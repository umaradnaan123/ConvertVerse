import { useState, useRef } from 'react';
import { 
  Users, FolderPlus, MessageSquare, Plus, FileCode, 
  Send, Radio, Palette, Edit2, Square, Circle, Trash2, Check,
  Link, FileCheck, Layers
} from 'lucide-react';

export default function RealTimeCollaboration() {
  // P2P Room Configuration State
  const [roomId] = useState(() => 'CV-ROOM-' + Math.random().toString(36).substring(2, 6).toUpperCase());
  const [copied, setCopied] = useState(false);
  const [peers] = useState([
    { name: 'Sarah (Lead Designer)', avatar: '👩‍💻', status: 'active', device: 'MacBook Pro' },
    { name: 'Alex (Product Manager)', avatar: '👨‍💼', status: 'active', device: 'iPad Pro' }
  ]);
  const [connectionLogs, setConnectionLogs] = useState([
    'Initializing local peer configuration...',
    'WebRTC mesh signal tunnel established.',
    'Synced with IndexedDB version history checkpoint.',
    'Sarah joined CV-ROOM.',
    'Alex joined CV-ROOM.'
  ]);

  // Drawing Canvas State
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen'); // 'pen' | 'rect' | 'circle' | 'select'
  const [color, setColor] = useState('#6366f1'); // Indigo default
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stickyNotes, setStickyNotes] = useState([
    { id: 1, text: 'Clean up JPEG resolution parameters!', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', x: 80, y: 50, author: 'Sarah' },
    { id: 2, text: 'PDF page rearrangement looks solid!', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', x: 280, y: 150, author: 'Alex' }
  ]);
  const [newStickyText, setNewStickyText] = useState('');

  // Comment Feed State
  const [comments, setComments] = useState([
    { id: 1, author: 'Sarah (Lead Designer)', avatar: '👩‍💻', text: 'I updated the logo watermarks overlay template. Let me know if the opacity is clear!', time: '14:02' },
    { id: 2, author: 'Alex (Product Manager)', avatar: '👨‍💼', text: 'Opacities look perfect! Let us bundle this template into the shared presets dashboard.', time: '14:04' }
  ]);
  const [newComment, setNewComment] = useState('');

  // Shared folder tree state
  const [teamFolders, setTeamFolders] = useState([
    { id: 'f1', name: 'Q2 Marketing Collaterals', size: '24.1 MB', count: 12 },
    { id: 'f2', name: 'Verified Financial Audits.pdf', size: '1.4 MB', count: 1 },
    { id: 'f3', name: 'JPEG Compress Presets.json', size: '12 KB', count: 1 }
  ]);
  const [newFolderName, setNewFolderName] = useState('');

  // Active synchronized preset parameters
  const [sharedPresets] = useState([
    { name: 'SaaS Pitch deck standard', format: 'PDF', compression: 'Low (Fidelity)', quality: 90 },
    { name: 'SEO Social Hero graphic', format: 'WEBP', compression: 'Balanced', quality: 75 },
    { name: 'Branded Vector Logo stamp', format: 'PNG', compression: 'None', quality: 100 }
  ]);

  // Interactive drawing context
  const startDrawing = (e) => {
    if (tool !== 'pen') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || tool !== 'pen') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  // Add standard shapes dynamically
  const addShape = (shapeType) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.fillStyle = color + '20';
    ctx.lineWidth = brushSize;

    if (shapeType === 'rect') {
      ctx.strokeRect(80, 80, 140, 80);
      ctx.fillRect(80, 80, 140, 80);
    } else if (shapeType === 'circle') {
      ctx.beginPath();
      ctx.arc(150, 120, 50, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
    
    // Log simulation log
    const log = `Local added visual layer: ${shapeType.toUpperCase()} (synced instantly with room)`;
    setConnectionLogs(prev => [...prev, log]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setConnectionLogs(prev => [...prev, 'Canvas layers cleared.']);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '?room=' + roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const comment = {
      id: Date.now(),
      author: 'You (Host)',
      avatar: '👑',
      text: newComment,
      time: timeNow
    };
    setComments(prev => [...prev, comment]);
    setNewComment('');
    
    // Log WebRTC signal push
    setConnectionLogs(prev => [...prev, 'Push message packet broadcasted on WebRTC stream.']);

    // Automated lead designer response simulation
    setTimeout(() => {
      setComments(prev => [...prev, {
        id: Date.now() + 1,
        author: 'Sarah (Lead Designer)',
        avatar: '👩‍💻',
        text: 'That makes perfect sense, let me implement those alterations on the workspace board right now!',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      }]);
      setConnectionLogs(prev => [...prev, 'Sarah synchronized a canvas layer node update packet.']);
    }, 1500);
  };

  const handleAddSticky = () => {
    if (!newStickyText.trim()) return;
    const colors = [
      'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    ];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    const newSticky = {
      id: Date.now(),
      text: newStickyText,
      color: randColor,
      x: Math.floor(Math.random() * 200) + 50,
      y: Math.floor(Math.random() * 150) + 30,
      author: 'You'
    };
    setStickyNotes(prev => [...prev, newSticky]);
    setNewStickyText('');
    setConnectionLogs(prev => [...prev, 'Broadcasted annotation sticky block.']);
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder = {
      id: 'f' + Date.now(),
      name: newFolderName,
      size: '0 KB',
      count: 0
    };
    setTeamFolders(prev => [newFolder, ...prev]);
    setNewFolderName('');
    setConnectionLogs(prev => [...prev, `Created team sync directory folder: ${newFolderName}`]);
  };

  return (
    <div className="space-y-10">
      {/* Hero Header Banner */}
      <section className="text-center relative max-w-4xl mx-auto space-y-4 pt-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 glow-orb-1 opacity-20 -z-10" />
        
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/25 text-xs font-bold text-secondary-400 shadow-glow-secondary">
          <Users size={14} className="animate-pulse" />
          Cloudless Peer-to-Peer Sync Channels
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none text-dark-50">
          Real-Time Cloudless <br/>
          <span className="text-gradient-purple-cyan">Collaboration Workspace</span>
        </h1>

        <p className="text-base text-dark-400 max-w-2xl mx-auto leading-relaxed">
          Instantly connect, drawing on custom annotation boards, manage team directories, and share conversion presets directly between browser peers using local P2P tunnels.
        </p>
      </section>

      {/* Grid Dashboard Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Signaling log, Invited peers, and synced presets */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* WebRTC peer manager */}
          <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio size={16} className="text-secondary-400 animate-pulse" />
                WebRTC Room Lobby
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                SECURE P2P
              </span>
            </div>

            {/* Invited Link Copy Block */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/20 border border-white/5">
              <span className="font-mono text-xs text-dark-300 font-bold ml-2 select-all">{roomId}</span>
              <button
                onClick={handleCopyLink}
                className="ml-auto p-2 rounded-lg bg-white/5 text-dark-400 hover:text-white transition-all flex items-center gap-1 text-[10px] font-bold"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link size={12} />
                    Copy Invite
                  </>
                )}
              </button>
            </div>

            {/* Peer List */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-dark-500 uppercase tracking-widest font-bold block">Connected Team Members</span>
              {peers.map((peer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{peer.avatar}</span>
                    <div>
                      <span className="block font-bold text-white">{peer.name}</span>
                      <span className="block text-[10px] text-dark-450">{peer.device}</span>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-accent" />
                </div>
              ))}
            </div>
          </div>

          {/* WebRTC Network Activity Logger */}
          <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 mb-3 flex items-center gap-2">
              <FileCode size={14} className="text-secondary-400" />
              P2P Sync Tunnel Signal logs
            </h3>
            <div className="h-36 overflow-y-auto bg-black/35 rounded-xl p-3 border border-white/5 font-mono text-[9px] text-emerald-400 space-y-2 custom-scrollbar">
              {connectionLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span className="text-dark-500 font-bold">&gt;&gt;</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Presets Synchronizer */}
          <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 flex items-center gap-2">
              <Layers size={14} className="text-secondary-400" />
              Shared Job Presets Sync
            </h3>
            
            <div className="space-y-3">
              {sharedPresets.map((preset, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-secondary-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-secondary-400 transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[9px] font-mono bg-secondary-500/10 text-secondary-400 px-1.5 py-0.5 rounded border border-secondary-500/20 font-bold">
                      {preset.format}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-dark-400">
                    <div>Compression: <span className="text-white font-mono">{preset.compression}</span></div>
                    <div>Quality Index: <span className="text-white font-mono">{preset.quality}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Drag/Drop Folder Board & Drawing Canvas Workspace */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Drawing Canvas Workspace board */}
          <div className="glass-panel p-6 rounded-2xl shadow-glass border border-white/5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette size={16} className="text-secondary-400" />
                  Interactive Team Annotation Canvas
                </h3>
                <span className="text-[10px] text-dark-400 block mt-0.5">Annotate slides, logos, or documents locally</span>
              </div>

              {/* Tool selector panel */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setTool('pen')}
                  className={`p-2 rounded-xl transition-all ${tool === 'pen' ? 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/35' : 'bg-white/5 text-dark-300 hover:text-white border border-transparent'}`}
                  title="Freehand Pen"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => addShape('rect')}
                  className="p-2 rounded-xl bg-white/5 text-dark-300 hover:text-white border border-transparent active:scale-95 transition-all"
                  title="Insert Rectangle"
                >
                  <Square size={14} />
                </button>
                <button
                  onClick={() => addShape('circle')}
                  className="p-2 rounded-xl bg-white/5 text-dark-300 hover:text-white border border-transparent active:scale-95 transition-all"
                  title="Insert Circle"
                >
                  <Circle size={14} />
                </button>
                <div className="w-[1px] h-6 bg-white/10 mx-1" />
                
                {/* Brush size slider */}
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-16 accent-secondary-500"
                />

                {/* Color presets selector */}
                <div className="flex items-center gap-1">
                  {['#6366f1', '#10b981', '#f43f5e', '#06b6d4', '#eab308'].map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setColor(c)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${color === c ? 'scale-110 border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <button
                  onClick={clearCanvas}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-450 border border-transparent hover:bg-rose-500/20 hover:border-rose-500/20 transition-all ml-1.5"
                  title="Clear All Canvas Layers"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Drawing Canvas and Sticky note zone */}
            <div className="relative border border-white/5 bg-black/40 rounded-2xl overflow-hidden min-h-[360px] flex items-center justify-center">
              
              <canvas
                ref={canvasRef}
                width={700}
                height={360}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="absolute inset-0 cursor-crosshair z-10 w-full h-full"
              />

              {/* Floating draggable/static sticky notes overlays */}
              {stickyNotes.map((note) => (
                <div
                  key={note.id}
                  className={`absolute z-20 p-3 rounded-xl border max-w-[140px] text-[10px] leading-relaxed shadow-lg font-medium animate-in zoom-in-95 duration-200`}
                  style={{ left: `${note.x}px`, top: `${note.y}px` }}
                >
                  <span className="block font-bold text-white mb-1.5 opacity-90">📌 {note.author}:</span>
                  <p className="opacity-90">{note.text}</p>
                </div>
              ))}

              {stickyNotes.length === 0 && (
                <div className="text-center text-xs text-dark-500 pointer-events-none select-none z-0">
                  Drawing board area active. Drag sticky comments below.
                </div>
              )}
            </div>

            {/* Sticky Comments Adder Bar */}
            <div className="flex gap-2 mt-4 relative z-20">
              <input
                type="text"
                value={newStickyText}
                onChange={(e) => setNewStickyText(e.target.value)}
                placeholder="Insert annotation sticky block..."
                className="flex-grow bg-white/5 text-xs border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-secondary-500 text-white placeholder-dark-400 transition-all"
              />
              <button
                onClick={handleAddSticky}
                className="px-4 py-2.5 rounded-xl bg-secondary-500/20 border border-secondary-500/35 hover:bg-secondary-500/30 text-xs font-bold text-secondary-400 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Sticky
              </button>
            </div>
          </div>

          {/* Bottom Grid: commentary feed and collaborative directory folder tree */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Live Comment Chat */}
            <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5 flex flex-col h-96">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 mb-4 flex items-center gap-2">
                <MessageSquare size={14} className="text-secondary-400" />
                Live Conversation Stream
              </h3>

              {/* Messages Index list */}
              <div className="flex-grow overflow-y-auto space-y-3 pr-1.5 custom-scrollbar text-xs">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-base mt-0.5">{c.avatar}</span>
                    <div className="space-y-0.5 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{c.author}</span>
                        <span className="text-[9px] text-dark-500">{c.time}</span>
                      </div>
                      <p className="text-dark-300 leading-relaxed mt-0.5">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input bar */}
              <div className="flex gap-1.5 mt-4 border-t border-white/5 pt-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Enter message parameter..."
                  className="flex-grow bg-white/5 text-xs border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-secondary-500 text-white placeholder-dark-400 transition-all"
                />
                <button
                  onClick={handleAddComment}
                  className="p-2.5 rounded-xl bg-secondary-500 text-white hover:opacity-90 active:scale-95 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Folder board tree directory */}
            <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5 flex flex-col h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 flex items-center gap-2">
                  <FolderPlus size={14} className="text-secondary-400" />
                  Team Shared Directory
                </h3>
              </div>

              {/* Create new directories */}
              <div className="flex gap-1.5 mb-4">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter new synced filename..."
                  className="flex-grow bg-white/5 text-xs border border-white/10 rounded-xl px-3.5 py-1.5 outline-none focus:border-secondary-500 text-white placeholder-dark-400 transition-all"
                />
                <button
                  onClick={handleAddFolder}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Directories tree listings */}
              <div className="flex-grow overflow-y-auto space-y-2 pr-1.5 custom-scrollbar text-xs">
                {teamFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary-500/10 text-secondary-400 flex items-center justify-center">
                        <FileCheck size={16} />
                      </div>
                      <div>
                        <span className="block font-bold text-white truncate max-w-[140px]">{folder.name}</span>
                        <span className="block text-[9px] text-dark-450 mt-0.5">{folder.size}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-dark-450 font-bold bg-black/20 border border-white/5 px-2 py-0.5 rounded-md">
                      {folder.count} files
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
