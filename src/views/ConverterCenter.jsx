import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, FileText, Image as ImageIcon, Download, 
  Eye, FileCode, AlertCircle,
  Presentation, Table, Images,
  Trash2, RotateCw, ArrowLeft, ArrowRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { useLanguage } from '../hooks/useLanguage';
import DragDropUpload from '../components/DragDropUpload';
import { formatBytes, convertHeicToAny, imageToPdfCompatibleDataUrl } from '../utils/imageProcessors';
import { performOcr, generateWordDocument } from '../utils/wordProcessors';
import { downloadBlob } from '../utils/downloadHelper';

// Setup pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

const pipelines = [
  { id: 'heic', label: 'HEIC to JPG/PNG', icon: ImageIcon },
  { id: 'images-pdf', label: 'Images to PDF', icon: FileText },
  { id: 'pdf-jpg', label: 'PDF to JPEG ZIP', icon: Images },
  { id: 'pdf-word', label: 'AI OCR to Word', icon: RefreshCw },
  { id: 'word-pdf', label: 'Word to PDF', icon: FileText },
  { id: 'pdf-ppt', label: 'PDF to PowerPoint', icon: Presentation },
  { id: 'ppt-pdf', label: 'PowerPoint to PDF', icon: Presentation },
  { id: 'pdf-excel', label: 'PDF to Excel', icon: Table },
  { id: 'excel-pdf', label: 'Excel to PDF', icon: Table }
];

export default function ConverterCenter({ onAddHistory, activeSubTab, setActiveSubTab }) {
  const { t } = useLanguage();
  const [activePipeline, setActivePipeline] = useState('heic'); // matched dynamically
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // HEIC State
  const [heicFile, setHeicFile] = useState(null);
  const [, setHeicResult] = useState(null);
  const [heicFormat, setHeicFormat] = useState('image/jpeg');

  // Image to PDF State
  const [img2pdfFiles, setImg2pdfFiles] = useState([]);

  // Drag & drop sorting states
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // PDF to Image State
  const [pdf2imgFile, setPdf2imgFile] = useState(null);
  const [, setPdf2imgZip] = useState(null);
  const [, setPdfPageCount] = useState(0);

  // AI OCR State
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrStatus, setOcrStatus] = useState(''); // idle, scanning, done

  // Word to PDF State
  const [wordFile, setWordFile] = useState(null);
  const [, setWordPdfBlob] = useState(null);

  // PDF to PPTX State
  const [pdfPptFile, setPdfPptFile] = useState(null);
  const [, setPdfPptBlob] = useState(null);

  // PPTX to PDF State
  const [pptPdfFile, setPptPdfFile] = useState(null);
  const [, setPptPdfBlob] = useState(null);

  // PDF to Excel State
  const [pdfExcelFile, setPdfExcelFile] = useState(null);
  const [, setExcelCsvText] = useState('');

  // Excel to PDF State
  const [excelFile, setExcelFile] = useState(null);
  const [, setExcelPdfBlob] = useState(null);

  // Route bind from dashboard
  useEffect(() => {
    if (activeSubTab) {
      const match = pipelines.find(p => p.id === activeSubTab);
      if (match) {
        const timer = setTimeout(() => {
          setActivePipeline(match.id);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [activeSubTab]);

  // Reset tab settings on active change
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeicFile(null);
      setHeicResult(null);
      setImg2pdfFiles(prev => {
        prev.forEach(item => {
          if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        return [];
      });
      setPdf2imgFile(null);
      setPdf2imgZip(null);
      setPdfPageCount(0);
      setOcrFile(null);
      setOcrText('');
      setOcrStatus('');
      setWordFile(null);
      setWordPdfBlob(null);
      setPdfPptFile(null);
      setPdfPptBlob(null);
      setPptPdfFile(null);
      setPptPdfBlob(null);
      setPdfExcelFile(null);
      setExcelCsvText('');
      setExcelFile(null);
      setExcelPdfBlob(null);
      setProgress(0);
      if (setActiveSubTab) {
        setActiveSubTab(null);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activePipeline, setActiveSubTab]);

  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      img2pdfFiles.forEach(item => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [img2pdfFiles]);

  // 1. HEIC Decoders
  const handleHeicSelected = (files) => {
    const file = files[0];
    if (file) {
      setHeicFile(file);
      setHeicResult(null);
    }
  };

  const handleHeicConvert = async () => {
    if (!heicFile) return;
    setIsProcessing(true);
    setProgress(15);
    try {
      const converted = await convertHeicToAny(heicFile, heicFormat);
      setProgress(85);
      setHeicResult(converted);
      
      downloadBlob(converted, converted.name);

      onAddHistory({
        fileName: converted.name,
        fromFormat: 'heic',
        toFormat: heicFormat.split('/')[1],
        size: converted.size
      }, converted);
      setProgress(100);
    } catch (error) {
      alert(error.message);
    }
    setIsProcessing(false);
  };

  // 2. Images to PDF Builders
  const handleImg2PdfSelected = (files) => {
    const existingNames = new Set(img2pdfFiles.map(item => item.file.name));
    const newItems = files
      .filter(file => !existingNames.has(file.name))
      .map((file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        rotation: 0
      }));
    setImg2pdfFiles(prev => [...prev, ...newItems]);
  };

  const handleRemoveImg2Pdf = (id) => {
    setImg2pdfFiles(prev => {
      const target = prev.find(item => item.id === id);
      if (target && target.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const handleRotateImg2Pdf = (id) => {
    setImg2pdfFiles(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, rotation: (item.rotation + 90) % 360 };
      }
      return item;
    }));
  };

  const handleMoveImg2Pdf = (index, direction) => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === img2pdfFiles.length - 1) return;
    
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    setImg2pdfFiles(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[newIndex];
      next[newIndex] = temp;
      return next;
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    setImg2pdfFiles(prev => {
      const next = [...prev];
      const [removed] = next.splice(draggedIndex, 1);
      next.splice(index, 0, removed);
      return next;
    });
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleClearAllImg2Pdf = () => {
    img2pdfFiles.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setImg2pdfFiles([]);
  };

  const handleImg2PdfConvert = async () => {
    if (img2pdfFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(5);
    try {
      const pdf = new jsPDF();
      for (let i = 0; i < img2pdfFiles.length; i++) {
        const item = img2pdfFiles[i];
        setProgress(Math.round(5 + (i / img2pdfFiles.length) * 85));
        const imgData = await imageToPdfCompatibleDataUrl(item.file, item.rotation);
        
        if (i > 0) pdf.addPage();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'JPEG', 10, 10, pdfWidth - 20, pdfHeight - 20);
      }
      
      setProgress(95);
      const pdfBlob = pdf.output('blob');
      const filename = `convertverse_gallery_${Date.now()}.pdf`;
      downloadBlob(pdfBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'images',
        toFormat: 'pdf',
        size: pdfBlob.size
      }, pdfBlob);
      setProgress(100);
    } catch (error) {
      alert("Failed compiling image pages: " + error.message);
    }
    setIsProcessing(false);
  };

  // 3. PDF to JPEG ZIP Packagers
  const handlePdf2ImgSelected = (files) => {
    const file = files[0];
    if (file) {
      setPdf2imgFile(file);
      setPdf2imgZip(null);
    }
  };

  const handlePdf2ImgConvert = async () => {
    if (!pdf2imgFile) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const arrayBuffer = await pdf2imgFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      setPdfPageCount(numPages);
      const zip = new JSZip();

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
        if (blob) {
          zip.file(`page_${i}.jpg`, blob);
        }
        setProgress(Math.round((i / numPages) * 90));
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setPdf2imgZip(zipBlob);
      const filename = `${pdf2imgFile.name.replace(/\.[^/.]+$/, "")}_pages.zip`;
      downloadBlob(zipBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'zip',
        size: zipBlob.size
      }, zipBlob);
      setProgress(100);
    } catch (error) {
      alert("Failed compiling PDF pages: " + error.message);
    }
    setIsProcessing(false);
  };

  // 4. AI OCR to Word Scanners
  const handleOcrSelected = (files) => {
    const file = files[0];
    if (file) {
      setOcrFile(file);
      setOcrText('');
      setOcrStatus('');
    }
  };

  const handleOcrScan = async () => {
    if (!ocrFile) return;
    setIsProcessing(true);
    setOcrStatus('scanning');
    try {
      const text = await performOcr(ocrFile, (prog) => {
        setProgress(prog);
      });
      setOcrText(text);
      setOcrStatus('done');
    } catch (error) {
      alert(error.message);
      setOcrStatus('failed');
    }
    setIsProcessing(false);
  };

  const handleDownloadOcrWord = () => {
    if (!ocrText) return;
    const docBlob = generateWordDocument(
      ocrFile ? ocrFile.name.replace(/\.[^/.]+$/, "") : "Scanned OCR",
      ocrText
    );
    const filename = `${ocrFile.name.replace(/\.[^/.]+$/, "")}_ocr.doc`;
    downloadBlob(docBlob, filename);
    onAddHistory({
      fileName: filename,
      fromFormat: 'image',
      toFormat: 'doc',
      size: docBlob.size
    }, docBlob);
  };

  // 5. Word to PDF Converters
  const handleWordSelected = (files) => {
    const file = files[0];
    if (file) {
      setWordFile(file);
      setWordPdfBlob(null);
    }
  };

  const handleWordConvert = async () => {
    if (!wordFile) return;
    setIsProcessing(true);
    setProgress(20);
    try {
      const arrayBuffer = await wordFile.arrayBuffer();
      setProgress(40);
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setProgress(60);
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const plainText = result.value.replace(/<[^>]*>/g, '\n').trim();
      const marginX = 15;
      const splitText = pdf.splitTextToSize(plainText, pdfWidth - (marginX * 2));
      setProgress(80);
      const lineHeight = 7;
      const startY = 20;
      const marginBottom = 20;
      let currentY = startY;
      for (let i = 0; i < splitText.length; i++) {
        if (currentY + lineHeight > pdfHeight - marginBottom) {
          pdf.addPage();
          currentY = startY;
        }
        pdf.text(splitText[i], marginX, currentY);
        currentY += lineHeight;
      }
      const pdfBlob = pdf.output('blob');
      setWordPdfBlob(pdfBlob);
      const filename = `${wordFile.name.replace(/\.[^/.]+$/, "")}.pdf`;
      downloadBlob(pdfBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'docx',
        toFormat: 'pdf',
        size: pdfBlob.size
      }, pdfBlob);
      setProgress(100);
    } catch {
      alert("Error parsing Word document. Ensure it is a valid XML DOCX container.");
    }
    setIsProcessing(false);
  };

  // 6. PDF to PowerPoint (Widescreen Open-XML slides)
  const handlePdfPptSelected = (files) => {
    const file = files[0];
    if (file) {
      setPdfPptFile(file);
      setPdfPptBlob(null);
    }
  };

  const handlePdfPptConvert = async () => {
    if (!pdfPptFile) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const arrayBuffer = await pdfPptFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const imageBlobs = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
        if (blob) imageBlobs.push(blob);
        setProgress(Math.round((i / numPages) * 70));
      }

      setProgress(80);
      const zip = new JSZip();
      
      // XML Structure skeletons
      let contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n  <Default Extension="xml" ContentType="application/xml"/>\n  <Default Extension="jpg" ContentType="image/jpeg"/>\n  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>`;
      let presentationRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`;
      let presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">\n  <p:sldIdLst>`;

      for (let i = 0; i < imageBlobs.length; i++) {
        const slideIndex = i + 1;
        const rId = `rId${slideIndex + 1}`;
        contentTypesXml += `\n  <Override PartName="/ppt/slides/slide${slideIndex}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
        presentationRelsXml += `\n  <Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${slideIndex}.xml"/>`;
        presentationXml += `\n    <p:sldId id="${255 + slideIndex}" r:id="${rId}"/>`;

        const slideRelXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n  <Relationship Id="rIdImg" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${slideIndex}.jpg"/>\n</Relationships>`;
        zip.file(`ppt/slides/_rels/slide${slideIndex}.xml.rels`, slideRelXml);

        const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">\n  <p:cSld>\n    <p:spTree>\n      <p:nvGrpSpPr>\n        <p:cNvPr id="1" name=""/>\n        <p:cNvGrpSpPr/>\n        <p:grpSpPr/>\n      </p:nvGrpSpPr>\n      <p:pic>\n        <p:nvPicPr>\n          <p:cNvPr id="2" name="Slide Image ${slideIndex}"/>\n          <p:cNvPicPr/>\n          <p:nvPr/>\n        </p:nvPicPr>\n        <p:blipFill>\n          <a:blip r:embed="rIdImg"/>\n          <a:stretch>\n            <a:fillRect/>\n          </a:stretch>\n        </p:blipFill>\n        <p:spPr>\n          <a:xfrm>\n            <a:off x="0" y="0"/>\n            <a:ext cx="9144000" cy="5143500"/>\n          </a:xfrm>\n          <a:prstGeom prst="rect">\n            <a:avLst/>\n          </a:prstGeom>\n        </p:spPr>\n      </p:pic>\n    </p:spTree>\n  </p:cSld>\n</p:sld>`;
        zip.file(`ppt/slides/slide${slideIndex}.xml`, slideXml);
        zip.file(`ppt/media/image${slideIndex}.jpg`, imageBlobs[i]);
      }

      contentTypesXml += `\n</Types>`;
      presentationRelsXml += `\n</Relationships>`;
      presentationXml += `\n  </p:sldIdLst>\n  <p:sldSz cx="9144000" cy="5143500" type="screen16x9"/>\n  <p:notesSz cx="6858000" cy="9144000"/>\n</p:presentation>`;

      const packageRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>\n</Relationships>`;

      zip.file(`[Content_Types].xml`, contentTypesXml);
      zip.file(`_rels/.rels`, packageRelsXml);
      zip.file(`ppt/_rels/presentation.xml.rels`, presentationRelsXml);
      zip.file(`ppt/presentation.xml`, presentationXml);

      const pptxBlob = await zip.generateAsync({ type: 'blob' });
      setPdfPptBlob(pptxBlob);
      const filename = `${pdfPptFile.name.replace(/\.[^/.]+$/, "")}.pptx`;
      downloadBlob(pptxBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'pptx',
        size: pptxBlob.size
      }, pptxBlob);
      setProgress(100);
    } catch (error) {
      alert("Failed creating slide deck: " + error.message);
    }
    setIsProcessing(false);
  };

  // 7. PowerPoint to PDF (ZIP-extracted slides compilation)
  const handlePptPdfSelected = (files) => {
    const file = files[0];
    if (file) {
      setPptPdfFile(file);
      setPptPdfBlob(null);
    }
  };

  const handlePptPdfConvert = async () => {
    if (!pptPdfFile) return;
    setIsProcessing(true);
    setProgress(20);
    try {
      const zip = await JSZip.loadAsync(pptPdfFile);
      setProgress(40);
      const mediaFolder = zip.folder("ppt/media");
      const images = [];

      if (mediaFolder) {
        // Collect slide images
        const files = Object.keys(mediaFolder.files).filter(name => /\.(jpg|jpeg|png)$/i.test(name));
        for (let i = 0; i < files.length; i++) {
          const file = mediaFolder.file(files[i]);
          const blob = await file.async("blob");
          images.push({ name: files[i], blob });
        }
      }

      if (images.length === 0) {
        throw new Error("No slide media files found in presentation package.");
      }

      // Sort slide media numerically
      images.sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
        return numA - numB;
      });

      const pdf = new jsPDF({ orientation: 'landscape' });
      for (let i = 0; i < images.length; i++) {
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(images[i].blob);
        });
        if (i > 0) pdf.addPage();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        setProgress(Math.round(40 + ((i + 1) / images.length) * 50));
      }

      const pdfBlob = pdf.output('blob');
      setPptPdfBlob(pdfBlob);
      const filename = `${pptPdfFile.name.replace(/\.[^/.]+$/, "")}.pdf`;
      downloadBlob(pdfBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'pptx',
        toFormat: 'pdf',
        size: pdfBlob.size
      }, pdfBlob);
      setProgress(100);
    } catch (error) {
      alert("Slide compile error: " + error.message);
    }
    setIsProcessing(false);
  };

  // 8. PDF to Excel (Spatial Y-axis Row clustering)
  const handlePdfExcelSelected = (files) => {
    const file = files[0];
    if (file) {
      setPdfExcelFile(file);
      setExcelCsvText('');
    }
  };

  const handlePdfExcelConvert = async () => {
    if (!pdfExcelFile) return;
    setIsProcessing(true);
    setProgress(15);
    try {
      const arrayBuffer = await pdfExcelFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let csvContent = "";

      for (let p = 1; p <= numPages; p++) {
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        const items = textContent.items;

        if (items.length === 0) continue;

        // Cluster items by Y coordinate (Y is at items[i].transform[5])
        const rowThreshold = 6;
        const rows = [];
        
        items.forEach(item => {
          const y = item.transform[5];
          const x = item.transform[4];
          const text = item.str.trim();
          if (!text) return;

          let matchedRow = rows.find(r => Math.abs(r.y - y) <= rowThreshold);
          if (matchedRow) {
            matchedRow.cols.push({ x, text });
          } else {
            rows.push({ y, cols: [{ x, text }] });
          }
        });

        // Sort rows descending vertically
        rows.sort((a, b) => b.y - a.y);

        // Sort items inside each row horizontally (X-axis)
        rows.forEach(r => {
          r.cols.sort((a, b) => a.x - b.x);
          const escapedCols = r.cols.map(c => {
            let val = c.text;
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
              val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          });
          csvContent += escapedCols.join(",") + "\n";
        });
        setProgress(Math.round((p / numPages) * 90));
      }

      setExcelCsvText(csvContent);
      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const filename = `${pdfExcelFile.name.replace(/\.[^/.]+$/, "")}_extracted.csv`;
      downloadBlob(csvBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'csv',
        size: csvBlob.size
      }, csvBlob);
      setProgress(100);
    } catch (error) {
      alert("Failed parsing table rows: " + error.message);
    }
    setIsProcessing(false);
  };

  // 9. Excel to PDF (Alternating grid rows paginator)
  const handleExcelSelected = (files) => {
    const file = files[0];
    if (file) {
      setExcelFile(file);
      setExcelPdfBlob(null);
    }
  };

  const handleExcelConvert = async () => {
    if (!excelFile) return;
    setIsProcessing(true);
    setProgress(30);
    try {
      const text = await excelFile.text();
      setProgress(60);
      
      const rows = text.split('\n').map(row => {
        // basic CSV parser splitting by comma
        return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/^"|"$/g, '').trim());
      }).filter(r => r.length > 0 && r.some(c => c !== ''));

      if (rows.length === 0) throw new Error("No data records found in CSV file.");

      const pdf = new jsPDF({ orientation: 'landscape' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 12;
      const startY = 25;
      let currentY = startY;
      const cellPadding = 3;
      const rowHeight = 9;
      
      // Table dimensions
      const maxCols = Math.max(...rows.map(r => r.length));
      const colWidth = (pdfWidth - (margin * 2)) / maxCols;

      // Header properties
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);

      for (let r = 0; r < rows.length; r++) {
        const isHeader = r === 0;
        
        // Page boundary checker
        if (currentY + rowHeight > pdfHeight - margin) {
          pdf.addPage();
          currentY = startY;
          // re-draw header on new page
          pdf.setFont("helvetica", "bold");
          pdf.setFillColor(67, 56, 202); // indigo header
          pdf.rect(margin, currentY, pdfWidth - (margin * 2), rowHeight, 'F');
          pdf.setTextColor(255, 255, 255);
          rows[0].forEach((col, idx) => {
            pdf.text(col.substring(0, 24), margin + (idx * colWidth) + cellPadding, currentY + 6);
          });
          currentY += rowHeight;
        }

        // Row background rendering
        if (isHeader) {
          pdf.setFillColor(67, 56, 202);
          pdf.rect(margin, currentY, pdfWidth - (margin * 2), rowHeight, 'F');
          pdf.setTextColor(255, 255, 255);
        } else {
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(40, 40, 40);
          if (r % 2 === 0) {
            pdf.setFillColor(243, 244, 246); // zebra rows
            pdf.rect(margin, currentY, pdfWidth - (margin * 2), rowHeight, 'F');
          }
        }

        // Draw cells and borders
        rows[r].forEach((col, idx) => {
          pdf.text(col.substring(0, 24), margin + (idx * colWidth) + cellPadding, currentY + 6);
          pdf.setDrawColor(229, 231, 235);
          pdf.rect(margin + (idx * colWidth), currentY, colWidth, rowHeight);
        });

        currentY += rowHeight;
      }

      const pdfBlob = pdf.output('blob');
      setExcelPdfBlob(pdfBlob);
      const filename = `${excelFile.name.replace(/\.[^/.]+$/, "")}.pdf`;
      downloadBlob(pdfBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'csv',
        toFormat: 'pdf',
        size: pdfBlob.size
      }, pdfBlob);
      setProgress(100);
    } catch (error) {
      alert("Table formatting failure: " + error.message);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center lg:justify-start gap-2.5">
          <RefreshCw className="text-primary-400 animate-spin-slow" />
          {t('converterTitle')}
        </h2>
        <p className="text-sm text-dark-400 max-w-2xl">{t('converterSub')}</p>
      </div>

      {/* Pipeline Navigation Menu */}
      <div className="glass-panel p-1.5 rounded-2xl border border-white/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-1 shadow-glass overflow-hidden">
        {pipelines.map((pipe) => {
          const Icon = pipe.icon;
          return (
            <button
              key={pipe.id}
              onClick={() => setActivePipeline(pipe.id)}
              className={`text-center py-2.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                activePipeline === pipe.id
                  ? 'bg-primary-500 text-white shadow-glow-primary border border-primary-400/20'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={12} />
              <span className="truncate">{pipe.label.split(' to ')[0]} ➔ {pipe.label.split(' to ')[1] || ''}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace display */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {/* HEIC Content */}
          {activePipeline === 'heic' && (
            <motion.div key="heic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!heicFile ? (
                <DragDropUpload onFilesSelected={handleHeicSelected} accept=".heic" multiple={false} accentColor="primary" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400 flex-shrink-0">
                        <ImageIcon size={18} />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{heicFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(heicFile.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Output format</span>
                      <select value={heicFormat} onChange={(e) => setHeicFormat(e.target.value)} className="bg-dark-900 border border-white/10 rounded-xl px-3 py-1.5 outline-none font-medium cursor-pointer text-xs text-dark-200">
                        <option value="image/jpeg">JPG / JPEG</option>
                        <option value="image/png">PNG</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setHeicFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">Upload New</button>
                    <button onClick={handleHeicConvert} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Convert HEIC
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          {/* Images to PDF */}
          {activePipeline === 'images-pdf' && (
            <motion.div key="images-pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <DragDropUpload onFilesSelected={handleImg2PdfSelected} accept="image/*" multiple={true} icon={FileText} accentColor="primary" />
              {img2pdfFiles.length > 0 && (
                <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-6 shadow-glass w-full max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
                    <div>
                      <h3 className="font-semibold text-sm text-dark-300 uppercase tracking-widest">Arrange Pages ({img2pdfFiles.length})</h3>
                      <p className="text-[10px] text-dark-500 mt-0.5">
                        Drag cards or use arrow buttons to reorder. Supported formats: JPG, PNG, WEBP.
                      </p>
                    </div>
                    <button 
                      onClick={handleClearAllImg2Pdf} 
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-dark-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Drag-and-drop Grid Gallery */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto pr-1.5 py-1 scrollbar-thin">
                    <AnimatePresence>
                      {img2pdfFiles.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          draggable={!isProcessing}
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          onDrop={(e) => handleDrop(e, idx)}
                          className={`relative glass-panel rounded-2xl border bg-black/10 overflow-hidden flex flex-col justify-between select-none ${
                            draggedIndex === idx 
                              ? 'opacity-40 border-dashed border-primary-500/50' 
                              : 'border-white/5 dark:border-white/5 light:border-black/5 hover:border-white/10 dark:hover:border-white/10 light:hover:border-black/10'
                          } ${
                            dragOverIndex === idx 
                              ? 'border-secondary-500 scale-102 ring-2 ring-secondary-500/20 shadow-glow-secondary' 
                              : ''
                          } group cursor-grab active:cursor-grabbing`}
                        >
                          {/* Card Header Indicators */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex justify-between items-center pointer-events-none">
                            <span className="bg-black/60 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-lg font-mono font-bold border border-white/5">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Rotation Container & Preview Image */}
                          <div className="relative aspect-[3/4] bg-black/25 flex items-center justify-center overflow-hidden p-2">
                            <div 
                              className="w-full h-full transition-transform duration-300 ease-out flex items-center justify-center"
                              style={{ transform: `rotate(${item.rotation}deg)` }}
                            >
                              <img 
                                src={item.previewUrl} 
                                alt={item.file.name} 
                                className="max-w-full max-h-full object-contain rounded-lg shadow-md pointer-events-none" 
                              />
                            </div>

                            {/* Hover Overlay Controls */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-10">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRotateImg2Pdf(item.id); }} 
                                disabled={isProcessing}
                                className="p-2 rounded-xl bg-white/10 hover:bg-primary-500 hover:text-white text-dark-200 border border-white/5 hover:border-primary-400/20 shadow-md transition-all duration-300 active:scale-90"
                                title="Rotate Clockwise"
                              >
                                <RotateCw size={15} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveImg2Pdf(item.id); }} 
                                disabled={isProcessing}
                                className="p-2 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-dark-200 border border-white/5 hover:border-red-400/20 shadow-md transition-all duration-300 active:scale-90"
                                title="Remove Page"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Card Footer controls for touch / mobile support */}
                          <div className="p-2 bg-black/15 border-t border-white/5 dark:border-white/5 light:border-black/5 flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleMoveImg2Pdf(idx, 'left'); }}
                                disabled={idx === 0 || isProcessing}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-dark-400 hover:text-dark-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                title="Move Left"
                              >
                                <ArrowLeft size={12} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleMoveImg2Pdf(idx, 'right'); }}
                                disabled={idx === img2pdfFiles.length - 1 || isProcessing}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-dark-400 hover:text-dark-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                title="Move Right"
                              >
                                <ArrowRight size={12} />
                              </button>
                            </div>
                            
                            <span className="text-[9px] text-dark-500 truncate max-w-[80px] font-mono" title={item.file.name}>
                              {item.file.name}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Actions & Progress Indicators */}
                  <div className="space-y-4 pt-2 border-t border-white/5 dark:border-white/5 light:border-black/5">
                    {isProcessing && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-dark-300">
                          <span>Compiling high-quality PDF layout...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-full h-1.5 overflow-hidden border border-white/5 dark:border-white/5 light:border-black/5">
                          <motion.div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={handleClearAllImg2Pdf} 
                        disabled={isProcessing}
                        className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 transition-all hover:bg-white/10 active:scale-98 disabled:opacity-50"
                      >
                        Reset Workspace
                      </button>
                      <button 
                        onClick={handleImg2PdfConvert} 
                        disabled={isProcessing} 
                        className="flex-grow px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw size={15} className="animate-spin" />
                            <span>Processing {progress}%...</span>
                          </>
                        ) : (
                          <>
                            <Download size={15} />
                            <span>Generate & Download PDF Booklet</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* PDF to JPEG ZIP */}
          {activePipeline === 'pdf-jpg' && (
            <motion.div key="pdf-jpg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!pdf2imgFile ? (
                <DragDropUpload onFilesSelected={handlePdf2ImgSelected} accept="application/pdf" multiple={false} icon={FileCode} accentColor="primary" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400 flex-shrink-0"><FileText size={18} /></div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{pdf2imgFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(pdf2imgFile.size)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setPdf2imgFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">Upload New</button>
                    <button onClick={handlePdf2ImgConvert} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Convert to JPG ZIP
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* AI OCR to Word */}
          {activePipeline === 'pdf-word' && (
            <motion.div key="pdf-word" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {!ocrFile ? (
                <div className="lg:col-span-12">
                  <DragDropUpload onFilesSelected={handleOcrSelected} accept="image/*" multiple={false} icon={RefreshCw} accentColor="primary" />
                </div>
              ) : (
                <>
                  <div className="lg:col-span-5 space-y-4">
                    <div className="glass-panel p-4 rounded-3xl border border-white/5 shadow-glass flex items-center justify-center bg-black/20 min-h-[250px]">
                      <img src={URL.createObjectURL(ocrFile)} alt="Source" className="max-h-[300px] object-contain rounded-xl shadow-md" />
                    </div>
                    {ocrStatus !== 'done' && (
                      <button onClick={handleOcrScan} disabled={isProcessing} className="w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                        {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Eye size={15} />}
                        Analyze Image Characters
                      </button>
                    )}
                  </div>
                  <div className="lg:col-span-7 space-y-4">
                    {ocrStatus === 'scanning' ? (
                      <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[320px]">
                        <RefreshCw size={36} className="text-primary-400 animate-spin mb-4" />
                        <h4 className="font-semibold text-white mb-2">Analyzing typography visual grid</h4>
                      </div>
                    ) : ocrText ? (
                      <div className="space-y-4">
                        <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-glass">
                          <textarea value={ocrText} onChange={(e) => setOcrText(e.target.value)} className="w-full h-[240px] bg-black/10 text-dark-200 border-none outline-none resize-none font-mono text-sm leading-relaxed" />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setOcrFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200">Discard</button>
                          <button onClick={handleDownloadOcrWord} className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                            <Download size={15} /> Download MS Word (.doc)
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[320px] text-dark-500">
                        <AlertCircle size={28} className="mb-3" />
                        <p className="text-sm">Click "Analyze Image" to scan typography grids.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Word to PDF */}
          {activePipeline === 'word-pdf' && (
            <motion.div key="word-pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!wordFile ? (
                <DragDropUpload onFilesSelected={handleWordSelected} accept=".docx" multiple={false} icon={FileText} accentColor="primary" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400 flex-shrink-0"><FileText size={18} /></div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{wordFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(wordFile.size)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setWordFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">Upload New</button>
                    <button onClick={handleWordConvert} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Convert to PDF
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* PDF to PowerPoint */}
          {activePipeline === 'pdf-ppt' && (
            <motion.div key="pdf-ppt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!pdfPptFile ? (
                <DragDropUpload onFilesSelected={handlePdfPptSelected} accept="application/pdf" multiple={false} icon={Presentation} accentColor="primary" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400 flex-shrink-0"><Presentation size={18} /></div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{pdfPptFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(pdfPptFile.size)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setPdfPptFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">Upload New</button>
                    <button onClick={handlePdfPptConvert} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 font-bold text-white shadow-glow-secondary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Convert to PPTX
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* PowerPoint to PDF */}
          {activePipeline === 'ppt-pdf' && (
            <motion.div key="ppt-pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!pptPdfFile ? (
                <DragDropUpload onFilesSelected={handlePptPdfSelected} accept=".pptx" multiple={false} icon={Presentation} accentColor="primary" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400 flex-shrink-0"><Presentation size={18} /></div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{pptPdfFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(pptPdfFile.size)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setPptPdfFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">Upload New</button>
                    <button onClick={handlePptPdfConvert} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 font-bold text-white shadow-glow-secondary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Convert to PDF
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* PDF to Excel */}
          {activePipeline === 'pdf-excel' && (
            <motion.div key="pdf-excel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!pdfExcelFile ? (
                <DragDropUpload onFilesSelected={handlePdfExcelSelected} accept="application/pdf" multiple={false} icon={Table} accentColor="primary" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0"><Table size={18} /></div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{pdfExcelFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(pdfExcelFile.size)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setPdfExcelFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">Upload New</button>
                    <button onClick={handlePdfExcelConvert} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Convert to CSV Excel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Excel to PDF */}
          {activePipeline === 'excel-pdf' && (
            <motion.div key="excel-pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!excelFile ? (
                <DragDropUpload onFilesSelected={handleExcelSelected} accept=".csv" multiple={false} icon={Table} accentColor="primary" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0"><Table size={18} /></div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{excelFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(excelFile.size)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setExcelFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">Upload New</button>
                    <button onClick={handleExcelConvert} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Convert to PDF report
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
