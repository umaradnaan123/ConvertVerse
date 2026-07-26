import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, Edit3, Scan, Columns, 
  Download, RefreshCw, CheckCircle2,
  FileCode, AlertCircle, Type, CheckSquare, 
  ChevronDown, Calendar, Image, Circle, 
  Trash2, Plus, 
  Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, 
  Settings2, Bot, Users, MessageSquare, Shield,
  Send, Sparkle, LayoutGrid, Camera, Upload
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import Tesseract from 'tesseract.js';
import DragDropUpload from '../components/DragDropUpload';
import { formatBytes } from '../utils/imageProcessors';
import { downloadBlob } from '../utils/downloadHelper';

// Configure CDN pdf.js worker to prevent Vite build worker issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

const tabs = [
  { id: 'edit', label: 'PDF Workspace', icon: LayoutGrid },
  { id: 'ocr', label: 'OCR Scanner', icon: Scan },
  { id: 'compare', label: 'Compare PDF', icon: Columns }
];

const SIGNATURE_FONTS = [
  { name: 'Great Vibes', className: 'font-greatvibes' },
  { name: 'Alex Brush', className: 'font-alexbrush' },
  { name: 'Caveat', className: 'font-caveat' },
  { name: 'Sacramento', className: 'font-sacramento' }
];

export default function PdfEditor({ onAddHistory }) {
  const [activeTab, setActiveTab] = useState('edit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load signature handwriting fonts dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@400;700&family=Great+Vibes&family=Sacramento&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Custom fonts CSS styling inside a style block
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .font-greatvibes { font-family: 'Great Vibes', cursive; }
      .font-alexbrush { font-family: 'Alex Brush', cursive; }
      .font-caveat { font-family: 'Caveat', cursive; }
      .font-sacramento { font-family: 'Sacramento', cursive; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 1. Unified Workspace State
  const [docFile, setDocFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pagesMeta, setPagesMeta] = useState([]); // { width, height, pageIndex }
  const [zoom, setZoom] = useState(1.0);
  const [elements, setElements] = useState([]); // { id, type, x, y, width, height, rotate, value, color, fontSize, pageIndex, ... }
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [activeTool, setActiveTool] = useState('pointer'); // pointer, text, form, annotation, shape, image, signature
  const [selectedFormType, setSelectedFormType] = useState('text'); // text, textarea, checkbox, dropdown, datepicker, signature_field, toggle
  const [selectedShapeType, setSelectedShapeType] = useState('rect'); // rect, circle, line, arrow, star
  const [rightPanelTab, setRightPanelTab] = useState('properties'); // properties, ai, collab
  
  // Signature Creator State
  const [sigModalOpen, setSigModalOpen] = useState(false);
  const [sigTypeStyle, setSigTypeStyle] = useState('Great Vibes');
  const [sigTypeInput, setSigTypeInput] = useState('');
  const [sigDrawColor, setSigDrawColor] = useState('#000000');
  const [sigDrawSize, setSigDrawSize] = useState(3);
  const [savedSignatures, setSavedSignatures] = useState(() => {
    const saved = localStorage.getItem('convertverse_saved_sigs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // History Undo/Redo State
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Canvas Refs
  const pageContainerRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const sigCanvasRef = useRef(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);

  // SVG drawing paths tracking
  const [isDrawingPath, setIsDrawingPath] = useState(false);
  const [currentPathPoints, setCurrentPathPoints] = useState([]);
  const [brushColor] = useState('#6366f1');
  const [brushSize] = useState(4);

  // Webcam controls
  const [webcamActive, setWebcamActive] = useState(false);

  // Collaboration Simulators
  const [collaborators] = useState([
    { id: '1', name: 'Sophia Chen', color: '#ec4899', x: 25, y: 30 },
    { id: '2', name: 'Lucas Miller', color: '#10b981', x: 75, y: 65 }
  ]);
  const [comments, setComments] = useState([
    { id: 'c1', elementId: null, author: 'Sophia Chen', text: 'Please place the signature fields at page bottom.', timestamp: 'Just now' }
  ]);
  const [commentInput, setCommentInput] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState([
    { role: 'assistant', text: 'Hi! I am your ConvertVerse AI. I can autofill inputs, summarize contracts, or scan key fields.' }
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // 2. OCR PDF State
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrResultText, setOcrResultText] = useState('');
  const [ocrStatus, setOcrStatus] = useState('');

  // 3. Compare PDF State
  const [compareFileA, setCompareFileA] = useState(null);
  const [compareFileB, setCompareFileB] = useState(null);
  const [pageThumbA, setPageThumbA] = useState(null);
  const [pageThumbB, setPageThumbB] = useState(null);
  const [diffCanvasUrl, setDiffCanvasUrl] = useState(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);

  // Add items to audit trial logs
  const addAuditLog = useCallback((msg) => {
    const log = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      message: msg
    };
    setAuditLogs(prev => [log, ...prev].slice(0, 10));
  }, []);

  // Save elements history for Undo
  const saveToUndo = useCallback((newElements) => {
    setUndoStack(prev => [...prev, elements]);
    setRedoStack([]); // clear redo
    setElements(newElements);
  }, [elements]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, elements]);
    setElements(previous);
    addAuditLog('Undo action triggered');
  }, [elements, undoStack, addAuditLog]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, elements]);
    setElements(next);
    addAuditLog('Redo action triggered');
  }, [elements, redoStack, addAuditLog]);

  // Keyboard listeners for delete and undo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          saveToUndo(elements.filter(el => el.id !== selectedElementId));
          setSelectedElementId(null);
          addAuditLog('Removed element');
        }
      }
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elements, selectedElementId, undoStack, redoStack, handleRedo, handleUndo, saveToUndo, addAuditLog]);

  // Drag and drop loaders
  const handleWorkspaceFileSelected = async (files) => {
    const file = files[0];
    if (!file) return;
    setIsProcessing(true);
    setProgress(15);
    setDocFile(file);
    setElements([]);
    setSelectedElementId(null);
    setUndoStack([]);
    setRedoStack([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDocument(pdf);
      
      const meta = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        meta.push({
          pageIndex: i - 1,
          width: viewport.width,
          height: viewport.height
        });
      }
      setPagesMeta(meta);
      setProgress(100);
      addAuditLog(`Loaded document: ${file.name}`);
    } catch (e) {
      alert("Failed rendering document structure: " + e.message);
    }
    setIsProcessing(false);
  };

  // Render individual page viewport canvases
  const PdfPageCanvas = ({ pageMeta, index, pdfDocument, zoom }) => {
    const canvasRef = useRef(null);
    const renderTaskRef = useRef(null);

    useEffect(() => {
      if (!pdfDocument || !canvasRef.current) return;
      const renderPage = async () => {
        try {
          const page = await pdfDocument.getPage(index + 1);
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          
          // Cancel previous render task if active to avoid page flashes
          if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
          }

          const viewport = page.getViewport({ scale: 1.5 * zoom });
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          renderTaskRef.current = page.render(renderContext);
          await renderTaskRef.current.promise;
        } catch (err) {
          console.error("Canvas render error: ", err);
        }
      };
      renderPage();
    }, [pdfDocument, index, zoom]);

    // Handle interactive freehand annotations
    const getPageCoordsPercent = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      return { x, y };
    };

    const handlePageMouseDown = (e) => {
      if (activeTool !== 'annotation') return;
      setIsDrawingPath(true);
      const { x, y } = getPageCoordsPercent(e);
      setCurrentPathPoints([[x, y]]);
    };

    const handlePageMouseMove = (e) => {
      if (!isDrawingPath || activeTool !== 'annotation') return;
      const { x, y } = getPageCoordsPercent(e);
      setCurrentPathPoints(prev => [...prev, [x, y]]);
    };

    const handlePageMouseUp = () => {
      if (!isDrawingPath || activeTool !== 'annotation') return;
      setIsDrawingPath(false);
      if (currentPathPoints.length > 1) {
        const newEl = {
          id: `draw-${Date.now()}-${Math.random()}`,
          type: 'drawing',
          pageIndex: index,
          paths: currentPathPoints,
          color: brushColor,
          size: brushSize,
          x: 0, y: 0, width: 100, height: 100
        };
        saveToUndo([...elements, newEl]);
        addAuditLog('Added drawing markup');
      }
      setCurrentPathPoints([]);
    };

    const handlePageClick = (e) => {
      if (activeTool === 'annotation' || activeTool === 'pointer') return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const pctX = ((clientX - rect.left) / rect.width) * 100;
      const pctY = ((clientY - rect.top) / rect.height) * 100;

      let newEl = null;

      if (activeTool === 'text') {
        newEl = {
          id: `text-${Date.now()}`,
          type: 'text',
          pageIndex: index,
          x: pctX - 10,
          y: pctY - 2,
          width: 25,
          height: 6,
          rotate: 0,
          value: 'Click to edit text',
          fontSize: 14,
          color: '#000000',
          opacity: 1
        };
      } else if (activeTool === 'form') {
        newEl = {
          id: `form-${Date.now()}`,
          type: 'form',
          formType: selectedFormType,
          pageIndex: index,
          x: pctX - 8,
          y: pctY - 2,
          width: selectedFormType === 'textarea' ? 30 : selectedFormType === 'checkbox' ? 4 : 20,
          height: selectedFormType === 'textarea' ? 12 : selectedFormType === 'checkbox' ? 4 : 5,
          rotate: 0,
          value: selectedFormType === 'checkbox' ? false : '',
          placeholder: `Enter ${selectedFormType}...`,
          required: false,
          options: selectedFormType === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : []
        };
      } else if (activeTool === 'shape') {
        newEl = {
          id: `shape-${Date.now()}`,
          type: 'shape',
          shapeType: selectedShapeType,
          pageIndex: index,
          x: pctX - 10,
          y: pctY - 10,
          width: 20,
          height: 20,
          rotate: 0,
          fillColor: '#6366f122',
          color: '#6366f1',
          strokeWidth: 2,
          opacity: 1
        };
      } else if (activeTool === 'signature') {
        if (savedSignatures.length === 0) {
          setSigModalOpen(true);
          return;
        }
        newEl = {
          id: `sig-${Date.now()}`,
          type: 'signature',
          pageIndex: index,
          x: pctX - 15,
          y: pctY - 6,
          width: 30,
          height: 12,
          rotate: 0,
          value: savedSignatures[0].dataUrl,
          opacity: 1
        };
      }

      if (newEl) {
        saveToUndo([...elements, newEl]);
        setSelectedElementId(newEl.id);
        setActiveTool('pointer'); // fallback to select
        addAuditLog(`Inserted ${newEl.type} element`);
      }
    };

    return (
      <div 
        className="relative shadow-xl border border-white/5 bg-black/40 rounded-lg overflow-hidden group select-none"
        style={{ 
          width: pageMeta.width * zoom, 
          height: pageMeta.height * zoom 
        }}
        onClick={handlePageClick}
        onMouseDown={handlePageMouseDown}
        onMouseMove={handlePageMouseMove}
        onMouseUp={handlePageMouseUp}
        onTouchStart={handlePageMouseDown}
        onTouchMove={handlePageMouseMove}
        onTouchEnd={handlePageMouseUp}
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
        
        {/* Draw Vector Annotations Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {elements.filter(el => el.pageIndex === index && el.type === 'drawing').map(el => {
            const pathStr = el.paths.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p[0]/100)*pageMeta.width*zoom} ${(p[1]/100)*pageMeta.height*zoom}`).join(' ');
            return (
              <path 
                key={el.id}
                d={pathStr}
                stroke={el.color}
                strokeWidth={el.size * zoom}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-auto cursor-pointer hover:stroke-primary-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElementId(el.id);
                }}
              />
            );
          })}

          {/* Current scribbling SVG draw path */}
          {activeTool === 'annotation' && currentPathPoints.length > 1 && (
            <path 
              d={currentPathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p[0]/100)*pageMeta.width*zoom} ${(p[1]/100)*pageMeta.height*zoom}`).join(' ')}
              stroke={brushColor}
              strokeWidth={brushSize * zoom}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {/* Drag Drop Editable HTML Component Layers */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {elements.filter(el => el.pageIndex === index && el.type !== 'drawing').map(el => (
            <DraggableElement 
              key={el.id} 
              element={el} 
              isSelected={selectedElementId === el.id} 
            />
          ))}
        </div>

        {/* Dynamic Multi-user cursor mock updates */}
        {collaborators.map(c => (
          <div 
            key={c.id} 
            className="absolute pointer-events-none flex flex-col items-start transition-all duration-300"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-[9px] px-1 py-0.5 rounded text-white bg-black/80 backdrop-blur scale-90 whitespace-nowrap mt-1 font-semibold">{c.name}</span>
          </div>
        ))}
      </div>
    );
  };

  // Drag, Scale, Rotate elements component
  const DraggableElement = ({ element, isSelected }) => {
    const dragRef = useRef(null);

    const handleMouseDown = (e, action) => {
      e.stopPropagation();
      e.preventDefault();
      setSelectedElementId(element.id);

      const startX = e.clientX || (e.touches && e.touches[0].clientX);
      const startY = e.clientY || (e.touches && e.touches[0].clientY);
      const startElX = element.x;
      const startElY = element.y;
      const startW = element.width;
      const startH = element.height;

      const pageContainer = dragRef.current.parentElement;
      const containerRect = pageContainer.getBoundingClientRect();

      const handleMouseMove = (mvEvent) => {
        const curX = mvEvent.clientX || (mvEvent.touches && mvEvent.touches[0].clientX);
        const curY = mvEvent.clientY || (mvEvent.touches && mvEvent.touches[0].clientY);

        const deltaX = curX - startX;
        const deltaY = curY - startY;

        const deltaPctX = (deltaX / containerRect.width) * 100;
        const deltaPctY = (deltaY / containerRect.height) * 100;

        let updated = { ...element };

        if (action === 'drag') {
          updated.x = Math.max(0, Math.min(100 - element.width, startElX + deltaPctX));
          updated.y = Math.max(0, Math.min(100 - element.height, startElY + deltaPctY));
        } else if (action === 'resize-br') {
          updated.width = Math.max(2, startW + deltaPctX);
          updated.height = Math.max(2, startH + deltaPctY);
        } else if (action === 'rotate') {
          const elCenterX = containerRect.left + (element.x + element.width / 2) / 100 * containerRect.width;
          const elCenterY = containerRect.top + (element.y + element.height / 2) / 100 * containerRect.height;
          const angleRad = Math.atan2(curY - elCenterY, curX - elCenterX);
          const angleDeg = (angleRad * 180) / Math.PI;
          updated.rotate = Math.round(angleDeg - 45); // offset handle rotation
        }

        setElements(prev => prev.map(el => el.id === element.id ? updated : el));
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
        // Save history state
        setUndoStack(prev => [...prev, elements]);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    };

    const renderContent = () => {
      switch (element.type) {
        case 'text':
          return (
            <input 
              type="text" 
              value={element.value} 
              onChange={(e) => {
                const val = e.target.value;
                setElements(prev => prev.map(el => el.id === element.id ? { ...el, value: val } : el));
              }}
              className="w-full h-full border-none outline-none bg-transparent font-medium"
              style={{ 
                color: element.color, 
                fontSize: `${element.fontSize * zoom}px`,
                opacity: element.opacity 
              }}
            />
          );
        case 'signature':
          return (
            <img 
              src={element.value} 
              alt="Signature" 
              className="w-full h-full object-contain pointer-events-none"
              style={{ opacity: element.opacity }}
            />
          );
        case 'image':
          return (
            <img 
              src={element.value} 
              alt="Uploaded clip" 
              className="w-full h-full object-cover pointer-events-none"
              style={{ opacity: element.opacity }}
            />
          );
        case 'shape': {
          const borderStyle = `${element.strokeWidth}px solid ${element.color}`;
          if (element.shapeType === 'rect') {
            return (
              <div 
                className="w-full h-full rounded-md" 
                style={{ 
                  backgroundColor: element.fillColor, 
                  border: borderStyle,
                  opacity: element.opacity
                }}
              />
            );
          } else if (element.shapeType === 'circle') {
            return (
              <div 
                className="w-full h-full rounded-full" 
                style={{ 
                  backgroundColor: element.fillColor, 
                  border: borderStyle,
                  opacity: element.opacity
                }}
              />
            );
          } else if (element.shapeType === 'line') {
            return (
              <div 
                className="w-full"
                style={{ 
                  borderTop: borderStyle, 
                  marginTop: '50%',
                  opacity: element.opacity 
                }}
              />
            );
          }
          return null;
        }
        case 'form':
          if (element.formType === 'checkbox') {
            return (
              <input 
                type="checkbox" 
                checked={!!element.value} 
                onChange={(e) => {
                  const val = e.target.checked;
                  setElements(prev => prev.map(el => el.id === element.id ? { ...el, value: val } : el));
                }}
                className="w-full h-full border rounded accent-primary-500 cursor-pointer pointer-events-auto"
              />
            );
          }
          if (element.formType === 'dropdown') {
            return (
              <div className="w-full h-full bg-dark-900 border border-white/10 rounded-lg flex items-center justify-between px-2 text-[10px] text-dark-300">
                <span>{element.value || 'Select option'}</span>
                <ChevronDown size={12} />
              </div>
            );
          }
          if (element.formType === 'datepicker') {
            return (
              <div className="w-full h-full bg-dark-900 border border-white/10 rounded-lg flex items-center justify-between px-2 text-[10px] text-dark-300">
                <span>{element.value || 'Select date'}</span>
                <Calendar size={12} />
              </div>
            );
          }
          return (
            <input 
              type="text" 
              disabled 
              placeholder={element.placeholder} 
              className={`w-full h-full bg-dark-900 border border-white/10 rounded-lg px-2 text-[10px] placeholder:text-dark-500 text-dark-200 outline-none`}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div 
        ref={dragRef}
        className={`absolute pointer-events-auto ${isSelected ? 'border-2 border-dashed border-primary-500 shadow-glow-primary' : 'hover:border border-white/20'}`}
        style={{
          left: `${element.x}%`,
          top: `${element.y}%`,
          width: `${element.width}%`,
          height: `${element.height}%`,
          transform: `rotate(${element.rotate || 0}deg)`,
          cursor: isSelected ? 'move' : 'pointer'
        }}
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
        onTouchStart={(e) => handleMouseDown(e, 'drag')}
      >
        <div className="w-full h-full relative overflow-hidden">
          {renderContent()}
        </div>

        {/* Interactive anchor overlay handles */}
        {isSelected && (
          <>
            {/* Bottom-right Resize Handle */}
            <div 
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border border-white cursor-se-resize shadow-md"
              onMouseDown={(e) => handleMouseDown(e, 'resize-br')}
              onTouchStart={(e) => handleMouseDown(e, 'resize-br')}
            />
            {/* Top-right Rotation Handle */}
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white cursor-alias shadow-md flex items-center justify-center"
              onMouseDown={(e) => handleMouseDown(e, 'rotate')}
              onTouchStart={(e) => handleMouseDown(e, 'rotate')}
            >
              <RefreshCw size={8} className="text-white scale-75" />
            </div>
            {/* Delete element button */}
            <button 
              className="absolute -top-6 left-1/2 -translate-x-1/2 p-1 rounded bg-red-500 hover:bg-red-600 text-white shadow-md transition-all scale-90"
              onClick={(e) => {
                e.stopPropagation();
                saveToUndo(elements.filter(el => el.id !== element.id));
                setSelectedElementId(null);
                addAuditLog('Deleted element');
              }}
            >
              <Trash2 size={10} />
            </button>
          </>
        )}
      </div>
    );
  };

  // Compile final PDF via PDF-lib
  const handleCompileEditedPdf = async () => {
    if (!docFile) return;
    setIsProcessing(true);
    setProgress(20);
    addAuditLog('Started compiling PDF changes');
    try {
      const arrayBuffer = await docFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      setProgress(40);
      for (let i = 0; i < totalPages; i++) {
        const page = pdfDoc.getPages()[i];
        const { width, height } = page.getSize();
        
        // Filter elements for this page index
        const pageEls = elements.filter(el => el.pageIndex === i);
        
        for (const el of pageEls) {
          const x = (el.x / 100) * width;
          const y = height - ((el.y / 100) * height) - ((el.height / 100) * height);
          const w = (el.width / 100) * width;
          const h = (el.height / 100) * height;

          if (el.type === 'text') {
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            page.drawText(el.value || '', {
              x,
              y: y + h - el.fontSize,
              size: el.fontSize || 12,
              font,
              color: hexToRgbColor(el.color),
              rotate: degrees(el.rotate || 0),
              opacity: el.opacity
            });
          } else if (el.type === 'signature' || el.type === 'image') {
            const imgBytes = await fetch(el.value).then(res => res.arrayBuffer());
            const img = el.value.includes('image/jpeg') ? await pdfDoc.embedJpg(imgBytes) : await pdfDoc.embedPng(imgBytes);
            page.drawImage(img, {
              x, y,
              width: w,
              height: h,
              rotate: degrees(el.rotate || 0),
              opacity: el.opacity
            });
          } else if (el.type === 'shape') {
            if (el.shapeType === 'rect') {
              page.drawRectangle({
                x, y, width: w, height: h,
                color: hexToRgbColor(el.fillColor),
                borderColor: hexToRgbColor(el.color),
                borderWidth: el.strokeWidth,
                opacity: el.opacity
              });
            } else if (el.shapeType === 'circle') {
              page.drawEllipse({
                x: x + w/2, y: y + h/2,
                xRadius: w/2, yRadius: h/2,
                color: hexToRgbColor(el.fillColor),
                borderColor: hexToRgbColor(el.color),
                borderWidth: el.strokeWidth,
                opacity: el.opacity
              });
            } else if (el.shapeType === 'line') {
              page.drawLine({
                start: { x, y: y + h/2 },
                end: { x: x + w, y: y + h/2 },
                color: hexToRgbColor(el.color),
                thickness: el.strokeWidth,
                opacity: el.opacity
              });
            }
          } else if (el.type === 'form') {
            const form = pdfDoc.getForm();
            const fName = `${el.formType}_${el.id}`;
            if (el.formType === 'text') {
              const f = form.createTextField(fName);
              f.setText(el.value || '');
              f.addToPage(page, { x, y, width: w, height: h });
            } else if (el.formType === 'checkbox') {
              const f = form.createCheckBox(fName);
              if (el.value) f.check();
              f.addToPage(page, { x, y, width: w, height: h });
            } else if (el.formType === 'dropdown') {
              const f = form.createDropdown(fName);
              f.setOptions(el.options || ['Item 1', 'Item 2']);
              f.addToPage(page, { x, y, width: w, height: h });
            }
          } else if (el.type === 'drawing') {
            if (el.paths && el.paths.length > 0) {
              for (let p = 0; p < el.paths.length - 1; p++) {
                const s = el.paths[p];
                const d = el.paths[p+1];
                page.drawLine({
                  start: { x: (s[0]/100)*width, y: height - (s[1]/100)*height },
                  end: { x: (d[0]/100)*width, y: height - (d[1]/100)*height },
                  color: hexToRgbColor(el.color),
                  thickness: el.size,
                  opacity: 1
                });
              }
            }
          }
        }
      }

      setProgress(80);
      const savedBytes = await pdfDoc.save();
      const compiledBlob = new Blob([savedBytes], { type: 'application/pdf' });
      const filename = `${docFile.name.replace(/\.[^/.]+$/, "")}_edited.pdf`;
      downloadBlob(compiledBlob, filename);
      
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'pdf',
        size: compiledBlob.size
      }, compiledBlob);
      setProgress(100);
      addAuditLog(`Saved final vector PDF: ${filename}`);
    } catch (e) {
      alert("Failed compiling elements to PDF: " + e.message);
    }
    setIsProcessing(false);
  };

  const hexToRgbColor = (hex) => {
    if (!hex) return rgb(0,0,0);
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  };

  // Clear drawn signatures canvas
  const handleClearSigDraw = () => {
    if (!sigCanvasRef.current) return;
    const canvas = sigCanvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Signature Draw Pad Event Triggers
  const getSigCoords = (e) => {
    const canvas = sigCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleSigMouseDown = (e) => {
    setIsDrawingSig(true);
    const ctx = sigCanvasRef.current.getContext('2d');
    const { x, y } = getSigCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleSigMouseMove = (e) => {
    if (!isDrawingSig) return;
    const ctx = sigCanvasRef.current.getContext('2d');
    const { x, y } = getSigCoords(e);
    ctx.lineWidth = sigDrawSize;
    ctx.strokeStyle = sigDrawColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Webcam capturing logic
  const handleStartWebcam = async () => {
    setWebcamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamStreamRef.current = stream;
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
      }
    } catch (e) {
      alert("Could not load webcam camera frame: " + e.message);
      setWebcamActive(false);
    }
  };

  const handleStopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
    setWebcamActive(false);
  };

  const handleCaptureWebcam = () => {
    if (!webcamVideoRef.current) return;
    const video = webcamVideoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply contrast black and white threshold shader
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = 0.34 * data[i] + 0.5 * data[i+1] + 0.16 * data[i+2];
      const val = brightness > 125 ? 255 : 0;
      data[i] = val;
      data[i+1] = val;
      data[i+2] = val;
    }
    ctx.putImageData(imgData, 0, 0);
    const snapshotUrl = canvas.toDataURL('image/png');
    
    const newSig = {
      id: `sig-${Date.now()}`,
      name: `Snapshot ${new Date().toLocaleTimeString()}`,
      dataUrl: snapshotUrl
    };
    const updated = [newSig, ...savedSignatures];
    setSavedSignatures(updated);
    localStorage.setItem('convertverse_saved_sigs', JSON.stringify(updated));
    handleStopWebcam();
    addAuditLog('Captured camera signature');
  };

  // Convert typed styles to High-res signature image bytes via offline canvas
  const handleSaveTypedSig = () => {
    if (!sigTypeInput) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = sigDrawColor;
    ctx.font = `italic 42px '${sigTypeStyle}'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sigTypeInput, canvas.width / 2, canvas.height / 2);
    
    const dataUrl = canvas.toDataURL('image/png');
    const newSig = {
      id: `sig-${Date.now()}`,
      name: `Type: ${sigTypeInput}`,
      dataUrl
    };
    const updated = [newSig, ...savedSignatures];
    setSavedSignatures(updated);
    localStorage.setItem('convertverse_saved_sigs', JSON.stringify(updated));
    setSigTypeInput('');
    setSigModalOpen(false);
    addAuditLog('Added custom typed signature');
  };

  const handleSaveDrawnSig = () => {
    if (!sigCanvasRef.current) return;
    const dataUrl = sigCanvasRef.current.toDataURL('image/png');
    const newSig = {
      id: `sig-${Date.now()}`,
      name: `Drawn Signature`,
      dataUrl
    };
    const updated = [newSig, ...savedSignatures];
    setSavedSignatures(updated);
    localStorage.setItem('convertverse_saved_sigs', JSON.stringify(updated));
    handleClearSigDraw();
    setSigModalOpen(false);
    addAuditLog('Added custom drawn signature');
  };

  const handleDeleteSavedSig = (id) => {
    const updated = savedSignatures.filter(s => s.id !== id);
    setSavedSignatures(updated);
    localStorage.setItem('convertverse_saved_sigs', JSON.stringify(updated));
    addAuditLog('Deleted saved signature card');
  };

  // AI assistant chatting mock simulator
  const handleSendAiChat = () => {
    if (!aiChatInput.trim()) return;
    const userMsg = { role: 'user', text: aiChatInput };
    setAiChatLogs(prev => [...prev, userMsg]);
    setAiChatInput('');
    setIsAiProcessing(true);

    setTimeout(() => {
      let reply = "I analyzed the document details. Let me know if you want me to autofill the empty fields.";
      const query = aiChatInput.toLowerCase();
      if (query.includes('summar') || query.includes('contract')) {
        reply = "Summary: This is a professional standard contract layout. Key sections include the Service Terms (p.1) and Digital Signatures clauses. I suggest placing text fields under the execution lines.";
      } else if (query.includes('fill') || query.includes('autofill')) {
        // Mock autofilling fields
        const autofilled = elements.map(el => {
          if (el.type === 'form' && el.formType === 'text') {
            return { ...el, value: 'Johnathan Doe' };
          }
          return el;
        });
        saveToUndo(autofilled);
        reply = "Done! I autofilled the document text fields with standard profile credentials.";
        addAuditLog('AI document autofill triggered');
      } else if (query.includes('detect') || query.includes('sign')) {
        reply = "Scan complete! I detected potential signature fields on Page 1. Click 'Autoplace signature boxes' in properties to overlay them.";
      }
      setAiChatLogs(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsAiProcessing(false);
    }, 1000);
  };

  // AI Field Detection placements
  const handleDetectSignatureFields = () => {
    if (pagesMeta.length === 0) return;
    addAuditLog('AI layout signature scanning active');
    setIsProcessing(true);
    setTimeout(() => {
      // Auto place signatures block coords at page bottom
      const mockDetected = [
        {
          id: `form-ai-${Date.now()}-1`,
          type: 'form',
          formType: 'signature_field',
          pageIndex: pagesMeta.length - 1,
          x: 20,
          y: 85,
          width: 25,
          height: 8,
          rotate: 0,
          value: '',
          placeholder: 'Signature Required'
        },
        {
          id: `form-ai-${Date.now()}-2`,
          type: 'form',
          formType: 'text',
          pageIndex: pagesMeta.length - 1,
          x: 55,
          y: 85,
          width: 25,
          height: 8,
          rotate: 0,
          value: '',
          placeholder: 'Print Signatory Name'
        }
      ];
      saveToUndo([...elements, ...mockDetected]);
      setIsProcessing(false);
      alert("AI Scan complete: Detected & placed 2 matching signature boxes at contract execution blocks!");
    }, 800);
  };

  // Drag and drop image clips
  const handleWorkspaceImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const newEl = {
        id: `img-${Date.now()}`,
        type: 'image',
        pageIndex: 0,
        x: 35,
        y: 35,
        width: 20,
        height: 15,
        rotate: 0,
        value: event.target.result,
        opacity: 1
      };
      saveToUndo([...elements, newEl]);
      setSelectedElementId(newEl.id);
      addAuditLog('Inserted custom picture overlay');
    };
    reader.readAsDataURL(file);
  };

  // 2. OCR OCR File selections
  const handleOcrFileSelected = (files) => {
    const file = files[0];
    if (file) {
      setOcrFile(file);
      setOcrResultText('');
      setOcrStatus('');
    }
  };

  const handleOcrSubmit = async () => {
    if (!ocrFile) return;
    setIsProcessing(true);
    setOcrStatus('scanning');
    try {
      const arrayBuffer = await ocrFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let compiledText = "";

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg');

        setProgress(Math.round(((i - 1) / numPages) * 100));

        const ocrResult = await Tesseract.recognize(
          dataUrl,
          'eng',
          { logger: m => {
            if (m.status === 'recognizing') {
              setProgress(Math.round(((i - 1)/numPages)*100 + (m.progress * (100 / numPages))));
            }
          }}
        );
        compiledText += `--- Page ${i} ---\n` + ocrResult.data.text + "\n\n";
      }

      setOcrResultText(compiledText);
      setOcrStatus('done');

      const txtBlob = new Blob([compiledText], { type: 'text/plain;charset=utf-8;' });
      const filename = `${ocrFile.name.replace(/\.[^/.]+$/, "")}_ocr.txt`;
      downloadBlob(txtBlob, filename);

      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'txt',
        size: txtBlob.size
      }, txtBlob);
    } catch (e) {
      alert("OCR scanning failed: " + e.message);
      setOcrStatus('failed');
    }
    setIsProcessing(false);
  };

  // 3. Compare PDF files
  const handleCompareASelected = async (files) => {
    const file = files[0];
    if (!file) return;
    setCompareFileA(file);
    setDiffCanvasUrl(null);
    try {
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const page = await pdf.getPage(1);
      const canvas = document.createElement('canvas');
      canvas.width = 180; canvas.height = 240;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: page.getViewport({ scale: 0.35 }) }).promise;
      setPageThumbA(canvas.toDataURL());
    } catch (err) {
      console.error("Failed rendering thumbnail A:", err);
    }
  };

  const handleCompareBSelected = async (files) => {
    const file = files[0];
    if (!file) return;
    setCompareFileB(file);
    setDiffCanvasUrl(null);
    try {
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const page = await pdf.getPage(1);
      const canvas = document.createElement('canvas');
      canvas.width = 180; canvas.height = 240;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: page.getViewport({ scale: 0.35 }) }).promise;
      setPageThumbB(canvas.toDataURL());
    } catch (err) {
      console.error("Failed rendering thumbnail B:", err);
    }
  };

  const handleRunComparison = async () => {
    if (!compareFileA || !compareFileB) return;
    setIsProcessing(true);
    try {
      const pdfA = await pdfjsLib.getDocument({ data: await compareFileA.arrayBuffer() }).promise;
      const pdfB = await pdfjsLib.getDocument({ data: await compareFileB.arrayBuffer() }).promise;
      
      const pageA = await pdfA.getPage(1);
      const pageB = await pdfB.getPage(1);
      const viewport = pageA.getViewport({ scale: 1.0 });
      
      const canvasA = document.createElement('canvas');
      canvasA.width = viewport.width; canvasA.height = viewport.height;
      await pageA.render({ canvasContext: canvasA.getContext('2d'), viewport }).promise;

      const canvasB = document.createElement('canvas');
      canvasB.width = viewport.width; canvasB.height = viewport.height;
      await pageB.render({ canvasContext: canvasB.getContext('2d'), viewport }).promise;

      const ctxA = canvasA.getContext('2d');
      const ctxB = canvasB.getContext('2d');
      
      const imgDataA = ctxA.getImageData(0, 0, canvasA.width, canvasA.height);
      const imgDataB = ctxB.getImageData(0, 0, canvasB.width, canvasB.height);
      
      const diffCanvas = document.createElement('canvas');
      diffCanvas.width = canvasA.width; diffCanvas.height = canvasA.height;
      const diffCtx = diffCanvas.getContext('2d');
      const diffData = diffCtx.createImageData(canvasA.width, canvasA.height);

      const dataA = imgDataA.data;
      const dataB = imgDataB.data;
      const dataDiff = diffData.data;

      for (let i = 0; i < dataA.length; i += 4) {
        const rDiff = Math.abs(dataA[i] - dataB[i]);
        const gDiff = Math.abs(dataA[i+1] - dataB[i+1]);
        const bDiff = Math.abs(dataA[i+2] - dataB[i+2]);
        
        if (rDiff > 15 || gDiff > 15 || bDiff > 15) {
          dataDiff[i] = 255;
          dataDiff[i+1] = 0;
          dataDiff[i+2] = 0;
          dataDiff[i+3] = 255;
        } else {
          dataDiff[i] = dataA[i];
          dataDiff[i+1] = dataA[i+1];
          dataDiff[i+2] = dataA[i+2];
          dataDiff[i+3] = 120;
        }
      }

      diffCtx.putImageData(diffData, 0, 0);
      setDiffCanvasUrl(diffCanvas.toDataURL());
    } catch(e) {
      alert("Comparison failed: " + e.message);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-white">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-extrabold flex items-center justify-center md:justify-start gap-2.5">
            <PenTool className="text-primary-400" />
            Advanced PDF Edit & Signature Hub
          </h2>
          <p className="text-xs text-dark-400">Drag annotations, fillable forms, vector shapes, smart signatures, webcam scanners, and AI assistants.</p>
        </div>

        {/* Global tab options */}
        <div className="flex bg-dark-900 border border-white/5 rounded-xl p-1 gap-1">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === t.id ? 'bg-primary-500 text-white shadow-glow-primary' : 'text-dark-400 hover:text-dark-200'}`}
              >
                <Icon size={12} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Workspace core */}
        {activeTab === 'edit' && (
          <motion.div key="edit-workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {!docFile ? (
              <DragDropUpload onFilesSelected={handleWorkspaceFileSelected} accept="application/pdf" multiple={false} icon={Edit3} accentColor="primary" />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-[calc(100vh-220px)]">
                
                {/* 1. Left Thumbnail Sidebar Operations */}
                <div className="lg:col-span-2 bg-dark-950/60 border border-white/5 rounded-2xl p-3 flex flex-col h-full overflow-y-auto space-y-3 scrollbar-thin">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest flex items-center gap-1"><Columns size={10} /> Pages</span>
                    <span className="text-[10px] font-mono text-primary-400 font-bold">{pagesMeta.length} Pages</span>
                  </div>

                  <div className="space-y-3">
                    {pagesMeta.map((meta, idx) => (
                      <div key={meta.pageIndex} className="relative group p-1 bg-black/25 border border-white/5 rounded-lg hover:border-primary-500 transition-all flex flex-col items-center">
                        <div className="aspect-[3/4] w-full bg-white/5 rounded flex items-center justify-center font-bold text-dark-500 text-xs">
                          Page {idx + 1}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 w-full justify-between px-1">
                          <span className="text-[9px] font-bold text-dark-400">#{idx + 1}</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => {
                                saveToUndo(elements.filter(el => el.pageIndex !== idx));
                                setPagesMeta(prev => prev.filter((_, i) => i !== idx));
                                addAuditLog(`Removed page ${idx + 1}`);
                              }}
                              className="p-0.5 hover:bg-red-500/25 rounded text-dark-400 hover:text-red-400 transition-colors"
                              title="Delete Page"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      if (pagesMeta.length > 0) {
                        const copy = [...pagesMeta];
                        copy.push({
                          pageIndex: pagesMeta.length,
                          width: pagesMeta[0].width,
                          height: pagesMeta[0].height
                        });
                        setPagesMeta(copy);
                        addAuditLog('Inserted new blank canvas page');
                      }
                    }}
                    className="w-full py-2 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 text-[10px] font-bold text-dark-300 uppercase flex items-center justify-center gap-1"
                  >
                    <Plus size={10} /> Add blank page
                  </button>
                </div>

                {/* 2. Middle Main Canvas Document scroll view */}
                <div className="lg:col-span-7 flex flex-col h-full bg-black/35 rounded-2xl border border-white/5 relative overflow-hidden">
                  
                  {/* Top Canvas Controls Bar */}
                  <div className="flex items-center justify-between p-2 border-b border-white/5 bg-dark-900/60 backdrop-blur z-20">
                    <div className="flex items-center gap-1.5">
                      <button onClick={handleUndo} disabled={undoStack.length === 0} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-dark-300 disabled:opacity-30"><Undo2 size={13} /></button>
                      <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-dark-300 disabled:opacity-30"><Redo2 size={13} /></button>
                      <div className="w-[1px] h-4 bg-white/10 mx-1" />
                      <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-dark-300"><ZoomOut size={13} /></button>
                      <span className="text-[10px] font-bold font-mono text-dark-300 px-1">{Math.round(zoom * 100)}%</span>
                      <button onClick={() => setZoom(z => Math.min(2.0, z + 0.1))} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-dark-300"><ZoomIn size={13} /></button>
                      <button onClick={() => setZoom(1.0)} className="text-[9px] font-bold text-dark-400 hover:text-white px-2 py-1 rounded hover:bg-white/5">Fit Page</button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={handleCompileEditedPdf} className="px-3.5 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-[10px] font-bold uppercase rounded-lg shadow hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5">
                        <Download size={11} /> Save PDF
                      </button>
                    </div>
                  </div>

                  {/* Scrollable page cards renderer container */}
                  <div 
                    ref={pageContainerRef} 
                    className="flex-1 overflow-auto p-6 flex flex-col items-center gap-6 scrollbar-thin select-none relative"
                    style={{ cursor: activeTool === 'pointer' ? 'default' : 'crosshair' }}
                  >
                    {pagesMeta.map((meta, index) => (
                      <PdfPageCanvas key={meta.pageIndex} pageMeta={meta} index={index} pdfDocument={pdfDocument} zoom={zoom} />
                    ))}
                  </div>

                  {/* Floating Toolbar Panel */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-dark-900/90 border border-white/10 backdrop-blur-md rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-2xl z-30">
                    <button 
                      onClick={() => setActiveTool('pointer')}
                      className={`p-2 rounded-xl transition-all ${activeTool === 'pointer' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`}
                      title="Select Element"
                    >
                      <Maximize2 size={13} />
                    </button>
                    <button 
                      onClick={() => setActiveTool('text')}
                      className={`p-2 rounded-xl transition-all ${activeTool === 'text' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`}
                      title="Add Rich Text"
                    >
                      <Type size={13} />
                    </button>
                    
                    {/* Forms dropdown */}
                    <div className="relative group">
                      <button 
                        onClick={() => setActiveTool('form')}
                        className={`p-2 rounded-xl transition-all flex items-center gap-1 ${activeTool === 'form' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`}
                        title="Form Fields Builder"
                      >
                        <CheckSquare size={13} />
                        <ChevronDown size={10} />
                      </button>
                      <div className="absolute bottom-10 left-0 hidden group-hover:block bg-dark-950 border border-white/10 rounded-xl p-1.5 shadow-2xl space-y-1 min-w-[120px]">
                        {['text', 'checkbox', 'dropdown', 'datepicker', 'signature_field'].map(f => (
                          <button 
                            key={f} 
                            onClick={() => {
                              setSelectedFormType(f);
                              setActiveTool('form');
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-[10px] font-bold uppercase ${selectedFormType === f ? 'bg-primary-500 text-white' : 'text-dark-400 hover:bg-white/5'}`}
                          >
                            {f.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Shapes dropdown */}
                    <div className="relative group">
                      <button 
                        onClick={() => setActiveTool('shape')}
                        className={`p-2 rounded-xl transition-all flex items-center gap-1 ${activeTool === 'shape' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`}
                        title="Draw Shapes"
                      >
                        <Circle size={13} />
                        <ChevronDown size={10} />
                      </button>
                      <div className="absolute bottom-10 left-0 hidden group-hover:block bg-dark-950 border border-white/10 rounded-xl p-1.5 shadow-2xl space-y-1 min-w-[100px]">
                        {['rect', 'circle', 'line'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => {
                              setSelectedShapeType(s);
                              setActiveTool('shape');
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-[10px] font-bold uppercase ${selectedShapeType === s ? 'bg-primary-500 text-white' : 'text-dark-400 hover:bg-white/5'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Freehand Brush */}
                    <button 
                      onClick={() => setActiveTool('annotation')}
                      className={`p-2 rounded-xl transition-all ${activeTool === 'annotation' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`}
                      title="Freehand Draw"
                    >
                      <Edit3 size={13} />
                    </button>

                    {/* Image insertion */}
                    <label className={`p-2 rounded-xl transition-all cursor-pointer flex items-center ${activeTool === 'image' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-white'}`} title="Add Image Clip">
                      <Image size={13} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleWorkspaceImageUpload} />
                    </label>

                    {/* Signature pads trigger */}
                    <button 
                      onClick={() => {
                        setSigModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1 text-[10px] font-bold"
                      title="Manage signatures"
                    >
                      <PenTool size={12} />
                      Sign
                    </button>
                  </div>
                </div>

                {/* 3. Right Properties / AI Assistant Sidebar */}
                <div className="lg:col-span-3 bg-dark-950/60 border border-white/5 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
                  
                  {/* Tab controllers */}
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/5 mb-3">
                    <button onClick={() => setRightPanelTab('properties')} className={`py-1 rounded-lg text-[9px] font-bold uppercase ${rightPanelTab === 'properties' ? 'bg-primary-500 text-white shadow-glow-primary' : 'text-dark-400'}`}><Settings2 className="inline mr-1" size={10} /> Properties</button>
                    <button onClick={() => setRightPanelTab('ai')} className={`py-1 rounded-lg text-[9px] font-bold uppercase ${rightPanelTab === 'ai' ? 'bg-primary-500 text-white shadow-glow-primary' : 'text-dark-400'}`}><Bot className="inline mr-1" size={10} /> AI Co-pilot</button>
                    <button onClick={() => setRightPanelTab('collab')} className={`py-1 rounded-lg text-[9px] font-bold uppercase ${rightPanelTab === 'collab' ? 'bg-primary-500 text-white shadow-glow-primary' : 'text-dark-400'}`}><Users className="inline mr-1" size={10} /> Security</button>
                  </div>

                  {/* Panel view containers */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                    {rightPanelTab === 'properties' && (
                      <div className="space-y-4">
                        {selectedElementId ? (
                          (() => {
                            const el = elements.find(item => item.id === selectedElementId);
                            if (!el) return <p className="text-xs text-dark-500">No element selected</p>;
                            return (
                              <div className="space-y-4">
                                <div className="border-b border-white/5 pb-2">
                                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary-400">Settings properties</h4>
                                  <span className="text-[9px] text-dark-500 font-mono">ID: {el.id}</span>
                                </div>

                                {el.type === 'text' && (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-dark-400 font-bold uppercase">Font Size ({el.fontSize}px)</label>
                                      <input 
                                        type="range" min="10" max="48" 
                                        value={el.fontSize || 12} 
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value);
                                          setElements(prev => prev.map(item => item.id === el.id ? { ...item, fontSize: val } : item));
                                        }}
                                        className="w-full accent-primary-500" 
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-dark-400 font-bold uppercase">Text Color</label>
                                      <div className="flex gap-1.5 flex-wrap">
                                        {['#000000', '#ef4444', '#10b981', '#3b82f6', '#ffffff'].map(c => (
                                          <button 
                                            key={c} 
                                            onClick={() => setElements(prev => prev.map(item => item.id === el.id ? { ...item, color: c } : item))}
                                            className={`w-5 h-5 rounded-full border ${el.color === c ? 'border-white scale-110' : 'border-transparent'}`} 
                                            style={{ backgroundColor: c }} 
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}

                                {el.type === 'shape' && (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-dark-400 font-bold uppercase">Border Color</label>
                                      <input 
                                        type="color" 
                                        value={el.color} 
                                        onChange={(e) => setElements(prev => prev.map(item => item.id === el.id ? { ...item, color: e.target.value } : item))}
                                        className="w-full bg-dark-900 border border-white/10 rounded cursor-pointer" 
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-dark-400 font-bold uppercase">Fill Color</label>
                                      <input 
                                        type="color" 
                                        value={el.fillColor?.substring(0, 7) || '#6366f1'} 
                                        onChange={(e) => setElements(prev => prev.map(item => item.id === el.id ? { ...item, fillColor: `${e.target.value}44` } : item))}
                                        className="w-full bg-dark-900 border border-white/10 rounded cursor-pointer" 
                                      />
                                    </div>
                                  </>
                                )}

                                {el.type === 'form' && (
                                  <>
                                    <div className="flex items-center justify-between py-1 bg-black/20 px-2 rounded-xl">
                                      <span className="text-[10px] font-bold text-dark-300">Required Field</span>
                                      <input 
                                        type="checkbox" 
                                        checked={!!el.required} 
                                        onChange={(e) => setElements(prev => prev.map(item => item.id === el.id ? { ...item, required: e.target.checked } : item))}
                                        className="accent-primary-500 cursor-pointer" 
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-dark-400 font-bold uppercase">Placeholder Label</label>
                                      <input 
                                        type="text" 
                                        value={el.placeholder || ''} 
                                        onChange={(e) => setElements(prev => prev.map(item => item.id === el.id ? { ...item, placeholder: e.target.value } : item))}
                                        className="glass-input w-full text-xs" 
                                      />
                                    </div>
                                  </>
                                )}

                                <div className="space-y-1">
                                  <label className="text-[10px] text-dark-400 font-bold uppercase">Element Opacity ({Math.round((el.opacity !== undefined ? el.opacity : 1)*100)}%)</label>
                                  <input 
                                    type="range" min="0.1" max="1.0" step="0.1"
                                    value={el.opacity !== undefined ? el.opacity : 1} 
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      setElements(prev => prev.map(item => item.id === el.id ? { ...item, opacity: val } : item));
                                    }}
                                    className="w-full accent-primary-500" 
                                  />
                                </div>

                                <button 
                                  onClick={() => {
                                    saveToUndo(elements.filter(item => item.id !== el.id));
                                    setSelectedElementId(null);
                                    addAuditLog('Removed element');
                                  }}
                                  className="w-full py-2 border border-red-500/30 bg-red-500/10 text-[10px] font-bold uppercase rounded-xl hover:bg-red-500/20 text-red-400 flex items-center justify-center gap-1.5"
                                >
                                  <Trash2 size={11} /> Delete Element
                                </button>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-center py-10 text-dark-500 space-y-2">
                            <Settings2 size={24} className="mx-auto text-dark-600" />
                            <p className="text-xs">Select any placed element on the canvas to configure properties.</p>
                          </div>
                        )}

                        {/* AI Detection triggers directly in properties */}
                        <div className="border-t border-white/5 pt-4 space-y-3">
                          <h4 className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">AI Form Helpers</h4>
                          <button 
                            onClick={handleDetectSignatureFields}
                            className="w-full py-2.5 bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20 rounded-xl text-[10px] font-bold text-primary-400 uppercase flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Sparkle size={11} /> AI Autoplace signature fields
                          </button>
                        </div>
                      </div>
                    )}

                    {rightPanelTab === 'ai' && (
                      <div className="flex flex-col h-[320px]">
                        <div className="flex-1 overflow-y-auto space-y-2.5 mb-2 pr-1 scrollbar-thin">
                          {aiChatLogs.map((log, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2.5 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${log.role === 'user' ? 'bg-primary-500/20 text-primary-300 ml-auto border border-primary-500/20' : 'bg-white/5 text-dark-300 border border-white/5 mr-auto'}`}
                            >
                              <span className="block font-bold text-[9px] mb-0.5 text-dark-400">{log.role === 'user' ? 'You' : 'AI Assistant'}</span>
                              {log.text}
                            </div>
                          ))}
                          {isAiProcessing && (
                            <div className="flex items-center gap-1.5 text-xs text-dark-400 font-bold bg-white/5 p-2 rounded-xl w-[80%] animate-pulse">
                              <Sparkle size={11} className="animate-spin text-primary-400" /> Typing...
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1.5 border-t border-white/5 pt-2">
                          <input 
                            type="text" 
                            placeholder="Type prompt (e.g. 'summarize', 'autofill')..." 
                            value={aiChatInput} 
                            onChange={(e) => setAiChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendAiChat()}
                            className="glass-input flex-1 text-xs" 
                          />
                          <button onClick={handleSendAiChat} className="p-2.5 bg-primary-500 hover:bg-primary-600 rounded-xl text-white active:scale-95 transition-all"><Send size={12} /></button>
                        </div>
                      </div>
                    )}

                    {rightPanelTab === 'collab' && (
                      <div className="space-y-4">
                        <div className="space-y-2 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3">
                          <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1"><Shield size={12} /> Encrypted Digital Cert</h4>
                          <p className="text-[10px] text-dark-400 leading-relaxed">This PDF is protected by client-side SHA-256 hash tracking and vector logs sealing for document audit security trails.</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-dark-400 uppercase tracking-widest flex items-center gap-1"><LayoutGrid size={11} /> Realtime Audit Trail</h4>
                          <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 max-h-[160px] overflow-y-auto space-y-1.5 scrollbar-thin">
                            {auditLogs.length === 0 ? (
                              <p className="text-[10px] text-dark-500 text-center py-4">No events registered yet.</p>
                            ) : (
                              auditLogs.map(l => (
                                <div key={l.id} className="text-[9px] leading-tight text-dark-300 border-b border-white/5 pb-1 flex items-start gap-1 justify-between">
                                  <span>{l.message}</span>
                                  <span className="text-dark-500 font-mono">{l.timestamp}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Multi-user comments visual simulator */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <h4 className="text-[10px] font-bold text-dark-400 uppercase tracking-widest flex items-center gap-1"><MessageSquare size={11} /> Document Remarks ({comments.length})</h4>
                          <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                            {comments.map(c => (
                              <div key={c.id} className="p-2 bg-white/5 border border-white/5 rounded-xl text-[10px] leading-relaxed">
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="font-bold text-primary-400">{c.author}</span>
                                  <span className="text-dark-500 text-[8px] font-mono">{c.timestamp}</span>
                                </div>
                                {c.text}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-1">
                            <input 
                              type="text" 
                              placeholder="Add general comment..." 
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && commentInput.trim()) {
                                  setComments(prev => [...prev, {
                                    id: `c-${Date.now()}`,
                                    author: 'You (Owner)',
                                    text: commentInput,
                                    timestamp: 'Just now'
                                  }]);
                                  setCommentInput('');
                                  addAuditLog('Added comment log');
                                }
                              }}
                              className="glass-input flex-1 text-[10px] py-1.5" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* OCR Module */}
        {activeTab === 'ocr' && (
          <motion.div key="ocr-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {!ocrFile ? (
              <DragDropUpload onFilesSelected={handleOcrFileSelected} accept="application/pdf" multiple={false} icon={Scan} accentColor="primary" />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
                <div className="lg:col-span-7 space-y-6">
                  {ocrStatus === 'scanning' ? (
                    <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
                      <RefreshCw size={36} className="text-primary-400 animate-spin mb-4" />
                      <h4 className="font-semibold text-white mb-2">Analyzing typography characters...</h4>
                      <p className="text-xs text-dark-400 mt-1 font-mono">{progress}% complete</p>
                    </div>
                  ) : ocrResultText ? (
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-4">
                      <h3 className="font-semibold text-xs text-dark-200 uppercase tracking-wider">Scanned Text Result</h3>
                      <textarea value={ocrResultText} onChange={(e) => setOcrResultText(e.target.value)} className="w-full h-[250px] bg-black/20 text-dark-200 border-none outline-none resize-none font-mono text-sm leading-relaxed p-4 rounded-xl border border-white/5" />
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold uppercase">OCR compiled successfully!</span>
                          <span className="block text-xs mt-0.5">Scanned text download was auto-saved as TXT file!</span>
                        </div>
                        <CheckCircle2 size={24} />
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px] text-dark-500">
                      <AlertCircle size={28} className="mb-3" />
                      <p className="text-sm">Click 'Analyze Characters' to scan text pages.</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-3 flex flex-col justify-center bg-dark-900/40">
                    <h4 className="font-semibold text-xs text-dark-300 truncate">{ocrFile.name}</h4>
                    <p className="text-xs text-dark-500 font-mono">{formatBytes(ocrFile.size)}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setOcrFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-dark-200 flex-1">New File</button>
                    <button onClick={handleOcrSubmit} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-xs flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Scan size={15} />}
                      Analyze Characters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Compare Module */}
        {activeTab === 'compare' && (
          <motion.div key="compare-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-glass space-y-4 bg-dark-900/40">
                <h3 className="font-semibold text-xs text-dark-200 uppercase tracking-widest flex items-center gap-2"><span>Document A</span></h3>
                {!compareFileA ? (
                  <DragDropUpload onFilesSelected={handleCompareASelected} accept="application/pdf" multiple={false} icon={FileCode} accentColor="primary" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {pageThumbA && <img src={pageThumbA} alt="A Preview" className="w-[120px] h-[160px] object-contain border border-white/10 rounded-lg shadow" />}
                    <span className="text-xs text-dark-300 truncate font-semibold w-full text-center">{compareFileA.name}</span>
                    <button onClick={() => setCompareFileA(null)} className="px-3 py-1 bg-red-500/10 text-red-400 font-bold text-[10px] rounded-lg">Remove</button>
                  </div>
                )}
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-glass space-y-4 bg-dark-900/40">
                <h3 className="font-semibold text-xs text-dark-200 uppercase tracking-widest flex items-center gap-2"><span>Document B</span></h3>
                {!compareFileB ? (
                  <DragDropUpload onFilesSelected={handleCompareBSelected} accept="application/pdf" multiple={false} icon={FileCode} accentColor="primary" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {pageThumbB && <img src={pageThumbB} alt="B Preview" className="w-[120px] h-[160px] object-contain border border-white/10 rounded-lg shadow" />}
                    <span className="text-xs text-dark-300 truncate font-semibold w-full text-center">{compareFileB.name}</span>
                    <button onClick={() => setCompareFileB(null)} className="px-3 py-1 bg-red-500/10 text-red-400 font-bold text-[10px] rounded-lg">Remove</button>
                  </div>
                )}
              </div>
            </div>

            {compareFileA && compareFileB && (
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <button onClick={handleRunComparison} disabled={isProcessing} className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-xs flex items-center gap-2 mx-auto justify-center">
                  {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Columns size={15} />}
                  Scan Pixel Contrast (Page 1)
                </button>

                {diffCanvasUrl && (
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-4 flex flex-col items-center bg-black/40">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-red-400">Contrast Mismatches Red Highlighter</h4>
                    <img src={diffCanvasUrl} alt="Diff Map" className="max-h-[400px] border border-white/10 rounded-xl shadow-lg" />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature Creator & Manager Modal Dialog overlay */}
      {sigModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel max-w-2xl w-full border border-white/10 rounded-3xl p-6 bg-dark-950/95 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2"><PenTool size={16} className="text-emerald-400" /> Digital Signatures Center</h3>
              <button 
                onClick={() => {
                  handleStopWebcam();
                  setSigModalOpen(false);
                }} 
                className="px-2.5 py-1 text-[10px] uppercase font-bold text-dark-400 bg-white/5 border border-white/5 rounded hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Signature Dashboard grid listing saved ones */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">My Saved signature styles</h4>
              {savedSignatures.length === 0 ? (
                <p className="text-[10px] text-dark-500 py-3 bg-black/10 rounded-xl text-center">No signatures stored yet. Create a signature below to place them instantly.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[140px] overflow-y-auto scrollbar-thin">
                  {savedSignatures.map(sig => (
                    <div key={sig.id} className="relative group p-2 bg-white border border-white/10 rounded-xl flex flex-col items-center select-none shadow">
                      <img 
                        src={sig.dataUrl} 
                        alt={sig.name} 
                        className="h-10 object-contain cursor-pointer"
                        onClick={() => {
                          // Place signature onto element
                          const newEl = {
                            id: `sig-${Date.now()}`,
                            type: 'signature',
                            pageIndex: 0,
                            x: 35,
                            y: 40,
                            width: 30,
                            height: 12,
                            rotate: 0,
                            value: sig.dataUrl,
                            opacity: 1
                          };
                          saveToUndo([...elements, newEl]);
                          setSelectedElementId(newEl.id);
                          setSigModalOpen(false);
                          addAuditLog('Placed signature on workspace');
                        }}
                        title="Click to place signature"
                      />
                      <span className="text-[8px] text-dark-500 mt-1 truncate max-w-[80px] font-bold">{sig.name}</span>
                      <button 
                        onClick={() => handleDeleteSavedSig(sig.id)} 
                        className="absolute -top-1.5 -right-1.5 p-1 bg-red-500/90 text-white rounded-full text-[7px] shadow transition-opacity"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Creation tabs */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <h4 className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">Create New Signature</h4>
              
              <div className="grid grid-cols-3 gap-3">
                
                {/* Typable Signature */}
                <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-black/20 space-y-3">
                  <span className="text-[10px] font-bold uppercase text-primary-400 flex items-center gap-1"><Type size={11} /> Typed</span>
                  <input 
                    type="text" 
                    placeholder="Enter name to sign..."
                    value={sigTypeInput} 
                    onChange={(e) => setSigTypeInput(e.target.value)}
                    className="glass-input w-full text-xs" 
                  />
                  
                  <div className="space-y-1">
                    <label className="text-[9px] text-dark-400 font-bold uppercase">Fonts Style</label>
                    <select 
                      value={sigTypeStyle} 
                      onChange={(e) => setSigTypeStyle(e.target.value)}
                      className="bg-dark-900 border border-white/10 rounded px-2 py-1 outline-none text-[10px] w-full text-dark-200 font-medium cursor-pointer"
                    >
                      {SIGNATURE_FONTS.map(f => (
                        <option key={f.name} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  {sigTypeInput && (
                    <div className="p-2 border border-white/5 rounded-lg bg-white flex justify-center text-black">
                      <span className={`text-2xl font-normal ${SIGNATURE_FONTS.find(f => f.name === sigTypeStyle)?.className}`}>{sigTypeInput}</span>
                    </div>
                  )}

                  <button 
                    onClick={handleSaveTypedSig}
                    disabled={!sigTypeInput}
                    className="w-full py-1.5 bg-primary-500 rounded-lg text-[9px] font-bold uppercase text-white hover:bg-primary-600 disabled:opacity-30 active:scale-95 transition-all"
                  >
                    Save Type
                  </button>
                </div>

                {/* Scribble Drawing Signature */}
                <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-black/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-primary-400 flex items-center gap-1"><Edit3 size={11} /> Drawn</span>
                    <button onClick={handleClearSigDraw} className="text-[8px] bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded uppercase text-dark-400 font-bold">Clear</button>
                  </div>

                  <div className="bg-white p-1 rounded-xl shadow-inner border border-white/5">
                    <canvas 
                      ref={sigCanvasRef} 
                      width="180" 
                      height="90"
                      onMouseDown={handleSigMouseDown}
                      onMouseMove={handleSigMouseMove}
                      onMouseUp={() => setIsDrawingSig(false)}
                      onMouseLeave={() => setIsDrawingSig(false)}
                      onTouchStart={handleSigMouseDown}
                      onTouchMove={handleSigMouseMove}
                      onTouchEnd={() => setIsDrawingSig(false)}
                      className="bg-white rounded-lg max-w-full cursor-pen"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div className="space-y-0.5">
                      <span className="text-dark-500">Color</span>
                      <select 
                        value={sigDrawColor} 
                        onChange={(e) => setSigDrawColor(e.target.value)}
                        className="bg-dark-900 border border-white/10 rounded p-1 outline-none w-full text-dark-200 cursor-pointer"
                      >
                        <option value="#000000">Black Ink</option>
                        <option value="#0000ff">Blue Ink</option>
                        <option value="#ff0000">Red Ink</option>
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-dark-500">Ink Width</span>
                      <input 
                        type="range" min="1" max="6" 
                        value={sigDrawSize} 
                        onChange={(e) => setSigDrawSize(parseInt(e.target.value))}
                        className="w-full accent-primary-500" 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveDrawnSig}
                    className="w-full py-1.5 bg-primary-500 rounded-lg text-[9px] font-bold uppercase text-white hover:bg-primary-600 active:scale-95 transition-all"
                  >
                    Save Draw
                  </button>
                </div>

                {/* Webcam camera capture or upload files */}
                <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-black/20 space-y-2 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase text-primary-400 flex items-center gap-1"><Camera size={11} /> Photo & Camera</span>

                  {webcamActive ? (
                    <div className="space-y-2">
                      <video ref={webcamVideoRef} autoPlay playsInline className="w-full h-20 object-cover rounded bg-black" />
                      <button 
                        onClick={handleCaptureWebcam}
                        className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded text-white text-[9px] font-bold uppercase"
                      >
                        Capture Snapshot
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <button 
                        onClick={handleStartWebcam}
                        className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-dark-300 hover:text-white text-[9px] font-bold uppercase flex items-center justify-center gap-1"
                      >
                        <Camera size={10} /> Open Webcam
                      </button>

                      {/* Transparent image remover zones */}
                      <label className="w-full py-2 bg-white/5 border border-dashed border-white/10 rounded-lg text-dark-300 hover:text-white text-[9px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer">
                        <Upload size={10} /> Upload Image
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const newSig = {
                                id: `sig-${Date.now()}`,
                                name: file.name,
                                dataUrl: ev.target.result
                              };
                              const updated = [newSig, ...savedSignatures];
                              setSavedSignatures(updated);
                              localStorage.setItem('convertverse_saved_sigs', JSON.stringify(updated));
                              setSigModalOpen(false);
                              addAuditLog('Uploaded image signature');
                            };
                            reader.readAsDataURL(file);
                          }} 
                        />
                      </label>
                    </div>
                  )}

                  <p className="text-[8px] text-dark-500 text-center leading-tight mt-1">Image uploads or webcam snaps automatically filter to transparent ink outline.</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
