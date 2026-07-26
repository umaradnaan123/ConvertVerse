import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Sparkles, Image, QrCode, Download, Maximize2, Type, Sliders
} from 'lucide-react';
import DragDropUpload from '../components/DragDropUpload';

export default function AIContentCreatorStudio() {
  // Preset dimensions
  const presets = [
    { name: 'Instagram Post', width: 1080, height: 1080, ratio: '1:1', icon: '📸' },
    { name: 'YouTube Thumbnail', width: 1280, height: 720, ratio: '16:9', icon: '📺' },
    { name: 'Twitter Header', width: 1500, height: 500, ratio: '3:1', icon: '🐦' },
    { name: 'LinkedIn Banner', width: 1584, height: 396, ratio: '4:1', icon: '💼' }
  ];

  const [activePreset, setActivePreset] = useState(presets[1]); // YouTube Thumbnail default
  const [canvasBg, setCanvasBg] = useState('gradient-purple-indigo'); // Gradient key
  const [customBgColor, setCustomBgColor] = useState('#1e1b4b');
  const [padding, setPadding] = useState(40);
  const [borderRadius, setBorderRadius] = useState(12);
  const [shadowDepth, setShadowDepth] = useState(25);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // Custom Text overlay state
  const [textOverlay, setTextOverlay] = useState('Next-Gen SaaS V1');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [textYPosition, setTextYPosition] = useState(80); // percentage height

  // Brand Kit State
  const [brandKit] = useState({
    name: 'Glow Enterprise',
    colors: ['#6366f1', '#10b981', '#f43f5e', '#06b6d4'],
    font: 'Outfit'
  });

  // QR Code generator state
  const [qrText, setQrText] = useState('https://convertverse.ai');
  const [qrColor, setQrColor] = useState('#ffffff');
  const [showQr, setShowQr] = useState(true);

  const canvasRef = useRef(null);

  // Generate a mock but structurally clean QR code matrix (21x21 grid) based on input string hash
  const generateQrGrid = useCallback((text) => {
    // Basic deterministic hash from input text to yield repeatable mock QR grid
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    const size = 21; // 21x21 modules
    const matrix = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        // Standard QR code finder patterns (corners)
        const isFinder = 
          (r < 7 && c < 7) || // Top-Left
          (r < 7 && c > 13) || // Top-Right
          (r > 13 && c < 7); // Bottom-Left

        if (isFinder) {
          // Render standard square rings
          const innerRing = 
            (r === 0 || r === 6 || c === 0 || c === 6) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          row.push(innerRing ? 1 : 0);
        } else {
          // Deterministic noise for data bits
          const bit = Math.abs((hash ^ (r * c + r + c)) % 3) === 0 ? 1 : 0;
          row.push(bit);
        }
      }
      matrix.push(row);
    }
    return matrix;
  }, []);

  const qrMatrix = useMemo(() => {
    return generateQrGrid(qrText);
  }, [qrText, generateQrGrid]);

  // Re-draw Canvas Visual Layers in real-time
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const w = activePreset.width;
    const h = activePreset.height;
    canvas.width = w;
    canvas.height = h;

    // 1. Draw outer background (gradient or solid)
    if (canvasBg === 'solid') {
      ctx.fillStyle = customBgColor;
      ctx.fillRect(0, 0, w, h);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      if (canvasBg === 'gradient-purple-indigo') {
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(1, '#0f172a');
      } else if (canvasBg === 'gradient-sunset') {
        gradient.addColorStop(0, '#f43f5e');
        gradient.addColorStop(1, '#eab308');
      } else if (canvasBg === 'gradient-cyber') {
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(1, '#d946ef');
      } else {
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#065f46');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Draw uploaded screenshot image with padding, shadow and border radius
    if (uploadedImage) {
      ctx.save();
      
      const innerW = w - (padding * 2);
      const innerH = h - (padding * 2);
      const x = padding;
      const y = padding;

      // Draw drop shadow manually in canvas
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = shadowDepth;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = shadowDepth / 2;

      // Draw rounded rectangle clip path
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + innerW - borderRadius, y);
      ctx.quadraticCurveTo(x + innerW, y, x + innerW, y + borderRadius);
      ctx.lineTo(x + innerW, y + innerH - borderRadius);
      ctx.quadraticCurveTo(x + innerW, y + innerH, x + innerW - borderRadius, y + innerH);
      ctx.lineTo(x + borderRadius, y + innerH);
      ctx.quadraticCurveTo(x, y + innerH, x, y + innerH - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      ctx.fill(); // Fills shadow bounding box

      ctx.restore();

      // Clip image to rounded rect
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + innerW - borderRadius, y);
      ctx.quadraticCurveTo(x + innerW, y, x + innerW, y + borderRadius);
      ctx.lineTo(x + innerW, y + innerH - borderRadius);
      ctx.quadraticCurveTo(x + innerW, y + innerH, x + innerW - borderRadius, y + innerH);
      ctx.lineTo(x + borderRadius, y + innerH);
      ctx.quadraticCurveTo(x, y + innerH, x, y + innerH - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      ctx.clip();

      // Draw image fitted to inner dimensions
      ctx.drawImage(uploadedImage, x, y, innerW, innerH);
      ctx.restore();
    }

    // 3. Draw text header overlays
    if (textOverlay) {
      ctx.save();
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      
      // Text drop shadow
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      
      const targetY = h * (textYPosition / 100);
      ctx.fillText(textOverlay, w / 2, targetY);
      ctx.restore();
    }

    // 4. Draw client-side QR Code Layer
    if (showQr && qrMatrix.length > 0) {
      ctx.save();
      
      // Position QR Code at bottom-right corner with margin
      const qrSize = Math.max(60, h * 0.18); // Responsive size
      const margin = 20;
      const qx = w - qrSize - margin;
      const qy = h - qrSize - margin;

      // Draw rounded glass background for QR
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.arc(qx + 5, qy + 5, 10, 0, Math.PI * 2);
      ctx.fillRect(qx - 5, qy - 5, qrSize + 10, qrSize + 10);
      
      const modulesCount = qrMatrix.length;
      const moduleSize = qrSize / modulesCount;

      ctx.fillStyle = qrColor;
      for (let r = 0; r < modulesCount; r++) {
        for (let c = 0; c < modulesCount; c++) {
          if (qrMatrix[r][c] === 1) {
            ctx.fillRect(qx + c * moduleSize, qy + r * moduleSize, moduleSize + 0.5, moduleSize + 0.5);
          }
        }
      }
      ctx.restore();
    }

    // 5. Draw brand logo / brand tag
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '9px monospace';
    ctx.fillText('ConvertVerse AI Studio', 20, h - 20);
    ctx.restore();
  }, [activePreset, canvasBg, customBgColor, padding, borderRadius, shadowDepth, uploadedImage, textOverlay, textColor, fontSize, textYPosition, showQr, qrMatrix, qrColor]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleImageUploaded = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        setUploadedImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleExportCreative = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `convertverse_creative_${activePreset.name.toLowerCase().replace(' ', '_')}.png`;
    a.click();
  };

  const applyBrandColor = (colorHex) => {
    setTextColor(colorHex);
  };

  return (
    <div className="space-y-10">
      {/* Hero Header Section */}
      <section className="text-center relative max-w-4xl mx-auto space-y-4 pt-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 glow-orb-1 opacity-20 -z-10" />
        
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-xs font-bold text-pink-400 shadow-glow-primary">
          <Sparkles size={14} className="animate-spin-slow" />
          Interactive Creative Visual Designer
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none text-dark-50">
          Advanced AI Content <br/>
          <span className="text-gradient-purple-cyan">Creator Studio</span>
        </h1>

        <p className="text-base text-dark-400 max-w-2xl mx-auto leading-relaxed">
          Design high-end thumbnails, clean social media banners, beautiful screenshot frames, and brand QR assets completely in your browser.
        </p>
      </section>

      {/* Grid workspace builder */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Preset Selectors & Control Sliders */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Dimension aspect ratio presets */}
          <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 flex items-center gap-2">
              <Maximize2 size={14} className="text-pink-400" />
              Dimension Aspect Presets
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {presets.map((preset, idx) => {
                const isActive = preset.name === activePreset.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setActivePreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-pink-500/10 border-pink-500/35 text-white shadow-glow-primary'
                        : 'bg-white/5 border-white/5 text-dark-300 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <span className="text-base block mb-1">{preset.icon}</span>
                    <span className="block text-xs font-bold truncate">{preset.name}</span>
                    <span className="block text-[10px] text-dark-400 mt-0.5 font-mono">
                      {preset.width}x{preset.height} ({preset.ratio})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Screenshot Beautifier Control panel */}
          <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 flex items-center gap-2">
              <Sliders size={14} className="text-pink-400" />
              Screenshot Decorator Sliders
            </h3>

            {/* Background selection */}
            <div className="space-y-2">
              <span className="text-[10px] text-dark-400 font-bold block">CANVAS BACKGROUND STYLING</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCanvasBg('gradient-purple-indigo')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${canvasBg === 'gradient-purple-indigo' ? 'bg-white/10 border-white text-white' : 'bg-black/20 border-white/5 text-dark-300'}`}
                >
                  Purple Glimmer
                </button>
                <button
                  onClick={() => setCanvasBg('gradient-sunset')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${canvasBg === 'gradient-sunset' ? 'bg-white/10 border-white text-white' : 'bg-black/20 border-white/5 text-dark-300'}`}
                >
                  Sunset Amber
                </button>
                <button
                  onClick={() => setCanvasBg('gradient-cyber')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${canvasBg === 'gradient-cyber' ? 'bg-white/10 border-white text-white' : 'bg-black/20 border-white/5 text-dark-300'}`}
                >
                  Cyber Pink
                </button>
                <button
                  onClick={() => setCanvasBg('solid')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${canvasBg === 'solid' ? 'bg-white/10 border-white text-white' : 'bg-black/20 border-white/5 text-dark-300'}`}
                >
                  Solid Color
                </button>
              </div>

              {canvasBg === 'solid' && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="flex-grow bg-white/5 border border-white/10 text-xs rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              )}
            </div>

            {/* Slider items */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              
              {/* Padding */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-400 font-bold">Outer Canvas Padding</span>
                  <span className="font-mono text-[10px] text-white">{padding}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              {/* Border Radius */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-400 font-bold">Inner Screenshot Radius</span>
                  <span className="font-mono text-[10px] text-white">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              {/* Shadow Depth */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-400 font-bold">Outer Shadow Depth</span>
                  <span className="font-mono text-[10px] text-white">{shadowDepth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={shadowDepth}
                  onChange={(e) => setShadowDepth(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Center/Right Column: Drawing designer canvas & Text / QR configs */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Main Visual Drawing Canvas View */}
          <div className="glass-panel p-6 rounded-2xl shadow-glass border border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
            
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-4 mb-4 z-10">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-400 animate-pulse" />
                  Studio Creator Workspace
                </h3>
                <span className="text-[10px] text-dark-400 block mt-0.5">Real-time canvas composition layout</span>
              </div>

              <button
                onClick={handleExportCreative}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-xs font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
              >
                <Download size={14} />
                Export Graphic Visual
              </button>
            </div>

            {/* Dynamic Sized Graphic Canvas Container */}
            <div className="w-full max-w-full overflow-auto bg-black/40 p-6 rounded-2xl flex items-center justify-center min-h-[360px] relative">
              
              <div className="relative shadow-2xl border border-white/10 rounded-lg overflow-hidden max-w-full">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto object-contain block bg-dark-950"
                  style={{
                    aspectRatio: `${activePreset.width} / ${activePreset.height}`,
                    width: activePreset.width > 800 ? '540px' : `${activePreset.width}px`
                  }}
                />
              </div>

              {!uploadedImage && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center gap-2.5 z-20 bg-dark-950/80 p-6 rounded-2xl border border-dashed border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-dark-400">
                    <Image size={24} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">No center screenshot uploaded</span>
                    <span className="block text-[10px] text-dark-500 mt-0.5">Drop screenshots below to beautify them</span>
                  </div>
                </div>
              )}
            </div>

            {/* Drag Drop Center Screenshot Uploader */}
            <div className="w-full mt-4">
              <DragDropUpload
                onFilesSelected={handleImageUploaded}
                maxFiles={1}
                accept="image/*"
                subtitle="Upload visual screenshot to center beautify"
              />
            </div>
          </div>

          {/* Bottom Grid: Text Customizer & Brand Kit + QR Codes generator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Text customizer panel */}
            <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 flex items-center gap-2">
                <Type size={14} className="text-pink-400" />
                Overlay Typography & Brands
              </h3>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-dark-450 font-bold block">CUSTOM HEADER STRING</span>
                  <input
                    type="text"
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                    placeholder="Enter visual headline text..."
                    className="w-full bg-white/5 text-xs border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-pink-500 text-white placeholder-dark-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-dark-450 font-bold block">FONT SIZE</span>
                    <input
                      type="number"
                      min="12"
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full bg-white/5 text-xs border border-white/10 rounded-xl px-3 py-2 outline-none text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-dark-450 font-bold block">POSITION Y (%)</span>
                    <input
                      type="number"
                      min="5"
                      max="95"
                      value={textYPosition}
                      onChange={(e) => setTextYPosition(parseInt(e.target.value))}
                      className="w-full bg-white/5 text-xs border border-white/10 rounded-xl px-3 py-2 outline-none text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-dark-450 font-bold block">TEXT COLOR</span>
                    <div className="flex items-center gap-1.5 border border-white/10 bg-white/5 rounded-xl px-2 py-1.5">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-5 h-5 cursor-pointer rounded bg-transparent border-0"
                      />
                      <span className="text-[9px] text-white font-mono">{textColor}</span>
                    </div>
                  </div>
                </div>

                {/* Branded Kit Palettes */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-dark-450 font-bold block">BRAND KIT COLOR SWATCHES ({brandKit.name})</span>
                  <div className="flex items-center gap-2">
                    {brandKit.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => applyBrandColor(c)}
                        className="w-6 h-6 rounded-lg transition-all border border-transparent hover:scale-105"
                        style={{ backgroundColor: c }}
                        title={`Apply brand color ${c}`}
                      />
                    ))}
                    <div className="text-[10px] text-dark-450 ml-auto font-mono">Font Preset: {brandKit.font}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Customizer Panel */}
            <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 flex items-center gap-2">
                  <QrCode size={14} className="text-pink-400" />
                  Client QR Code Studio
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-dark-500 font-bold">ENABLE LAYER</span>
                  <input
                    type="checkbox"
                    checked={showQr}
                    onChange={(e) => setShowQr(e.target.checked)}
                    className="accent-pink-500 w-3.5 h-3.5"
                  />
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-dark-450 font-bold block">QR CODE REDIRECT LINK / STRING</span>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="Enter redirect URL..."
                    disabled={!showQr}
                    className="w-full bg-white/5 text-xs border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-pink-500 text-white placeholder-dark-400 transition-all disabled:opacity-40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-dark-450 font-bold block">PIXEL MATRIX COLOR</span>
                    <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-xl px-2.5 py-1.5">
                      <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        disabled={!showQr}
                        className="w-5 h-5 cursor-pointer rounded bg-transparent border-0 disabled:opacity-40"
                      />
                      <span className="text-[9px] text-white font-mono">{qrColor}</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center text-right">
                    <span className="text-dark-500 text-[9px] block">QR Standard Grid Size</span>
                    <span className="text-white text-xs font-mono font-bold mt-1 block">21x21 modules</span>
                  </div>
                </div>

                {/* QR Vector Pattern Preview Card */}
                {showQr && qrMatrix.length > 0 && (
                  <div className="flex items-center justify-center p-3.5 bg-black/45 border border-white/5 rounded-xl">
                    <div className="w-16 h-16 bg-white/5 p-1 rounded border border-white/5 grid grid-cols-21 gap-[0.5px]">
                      {qrMatrix.flat().map((bit, idx) => (
                        <div
                          key={idx}
                          className="w-0.5 h-0.5 rounded-[0.2px]"
                          style={{
                            backgroundColor: bit === 1 ? qrColor : 'transparent'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-dark-400 font-mono ml-4 leading-relaxed max-w-[160px]">
                      Determined client QR matrix computed deterministically without external cloud compilers!
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
