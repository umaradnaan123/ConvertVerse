import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Mic, MicOff, Monitor, Music, Download, Trash2, 
  RefreshCw, Check, Copy, AlertCircle, Scissors
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { downloadBlob } from '../utils/downloadHelper';

export default function AIDocToolkit() {
  const [tabs, setTabs] = useState([
    { id: 'voice-text', name: 'Voice-to-Text Dictation', active: true },
    { id: 'screen-pdf', name: 'Screen Capture to PDF', active: false },
    { id: 'audio-trimmer', name: 'Web Audio Trimmer', active: false }
  ]);

  // Voice to Text States
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const recognitionRef = useRef(null);
  const [copiedText, setCopiedText] = useState(false);

  // Screen PDF States
  const [capturing, setCapturing] = useState(false);
  const [screenBlobUrl, setScreenBlobUrl] = useState(null);
  const videoRef = useRef(null);

  // Audio Trimmer States
  const [audioFile, setAudioFile] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(10);
  const [trimming, setTrimming] = useState(false);

  const fileInputRef = useRef(null);

  // Initialize Speech Recognition Hook
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        let final = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            final += e.results[i][0].transcript + ' ';
          }
        }
        if (final) {
          setTranscription(prev => prev + final);
        }
      };

      rec.onerror = (e) => {
        console.error('Speech error:', e.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const handleTabSwitch = (tabId) => {
    setTabs(prev => prev.map(t => ({ ...t, active: t.id === tabId })));
  };

  // 1. VOICE-TO-TEXT RECORDER CONTROLLERS
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Safari!');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const copyTranscription = () => {
    navigator.clipboard.writeText(transcription);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const downloadTranscription = () => {
    const blob = new Blob([transcription], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, 'convertverse-voice-note.txt');
  };

  // 2. SCREEN CAPTURE TO PDF COMPILER
  const startScreenCapture = async () => {
    setCapturing(true);
    setScreenBlobUrl(null);

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Capture single snapshot frame from stream and render to canvas -> jsPDF
      setTimeout(() => {
        captureScreenSnapshot(stream);
      }, 2500); // Allow user time to transition to target screen frame

    } catch (err) {
      console.error('Screen capture failed:', err);
      setCapturing(false);
    }
  };

  const captureScreenSnapshot = (stream) => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Stop all stream tracks to close display indicator
    stream.getTracks().forEach(track => track.stop());

    canvas.toBlob((blob) => {
      if (blob) {
        setScreenBlobUrl(URL.createObjectURL(blob));
      }
      setCapturing(false);
    }, 'image/jpeg', 0.90);
  };

  const compileScreenPdf = () => {
    if (!screenBlobUrl) return;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1280, 720]
    });

    const img = new Image();
    img.onload = () => {
      pdf.addImage(img, 'JPEG', 0, 0, 1280, 720);
      pdf.save('convertverse-screen-shot.pdf');
    };
    img.src = screenBlobUrl;
  };

  // 3. AUDIO CROP WAVE TRIMMER (Web Audio API)
  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAudioFile(file);
    setLoadingAudio(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
      setAudioBuffer(decodedBuffer);
      setAudioDuration(decodedBuffer.duration);
      setTrimStart(0);
      setTrimEnd(Math.min(10, decodedBuffer.duration));
    } catch (err) {
      console.error('Failed to decode audio:', err);
      alert('Error parsing audio file. Please upload standard MP3/WAV tracks.');
    } finally {
      setLoadingAudio(false);
    }
  };

  const processAudioTrim = async () => {
    if (!audioBuffer) return;
    setTrimming(true);

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    
    const rate = audioBuffer.sampleRate;
    const startOffset = trimStart * rate;
    const endOffset = trimEnd * rate;
    const frameCount = endOffset - startOffset;

    // Create trimmed AudioBuffer
    const trimmedBuffer = ctx.createBuffer(
      audioBuffer.numberOfChannels,
      frameCount,
      rate
    );

    // Copy channel data over
    for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const channelData = audioBuffer.getChannelData(c);
      const trimmedData = trimmedBuffer.getChannelData(c);
      for (let i = 0; i < frameCount; i++) {
        trimmedData[i] = channelData[startOffset + i];
      }
    }

    // Convert Buffer to WAV binary using custom local header builder
    const wavBytes = bufferToWav(trimmedBuffer);
    const wavBlob = new Blob([wavBytes], { type: 'audio/wav' });

    downloadBlob(wavBlob, `trimmed-${audioFile.name.replace(/\.[^/.]+$/, "")}.wav`);
    setTrimming(false);
  };

  // Helper: PCM Audio Buffer to RIFF/WAV array compiler
  const bufferToWav = (buffer) => {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    let result;
    if (numOfChan === 2) {
      result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }
    
    const bufferLength = result.length * 2;
    const arrayBuffer = new ArrayBuffer(44 + bufferLength);
    const view = new DataView(arrayBuffer);
    
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + bufferLength, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numOfChan, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * numOfChan * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numOfChan * 2, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, bufferLength, true);
    
    floatTo16BitPCM(view, 44, result);
    
    return arrayBuffer;
  };

  const interleave = (inputL, inputR) => {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;
    
    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  };

  const floatTo16BitPCM = (output, offset, input) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  return (
    <div className="py-4 space-y-8 flex-grow flex flex-col justify-between min-h-[500px]">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="text-primary-400" size={22} />
            AI Document & Media Toolkit
          </h2>
          <p className="text-xs text-dark-400 mt-1">
            Browser-based AI utilities. Transcribe voice, booklet capture display layouts, and trim local sound waves.
          </p>
        </div>

        {/* Tab Selection header */}
        <div className="flex border-b border-white/5 gap-1 bg-black/10 p-1 rounded-xl max-w-lg">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabSwitch(t.id)}
              className={`flex-grow py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                t.active
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/25'
                  : 'text-dark-400 hover:text-dark-200 border border-transparent'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Tab 1: Voice-to-Text Dictation */}
        {tabs.find(t => t.active)?.id === 'voice-text' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Action buttons */}
            <div className="lg:col-span-1 glass-panel p-4.5 rounded-2xl border border-white/5 space-y-4 text-center">
              <div>
                <span className="block text-xs font-bold text-white">Voice Dictation Hub</span>
                <p className="text-[10px] text-dark-400 mt-0.5">Captures native speech models with zero API calls.</p>
              </div>

              {/* Pulsing record button */}
              <button
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center border transition-all ${
                  isRecording 
                    ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse shadow-glow-primary' 
                    : 'bg-primary-500/10 border-primary-500/25 text-primary-400 hover:bg-primary-500/20'
                }`}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <span className="block text-xs font-mono font-bold text-dark-300">
                {isRecording ? 'Listening for sound waves...' : 'Microphone Ready'}
              </span>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={copyTranscription}
                  disabled={!transcription}
                  className="flex-grow py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {copiedText ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  Copy Output
                </button>
                <button
                  onClick={downloadTranscription}
                  disabled={!transcription}
                  className="flex-grow py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Download size={12} />
                  Download Note
                </button>
              </div>
            </div>

            {/* Note text transcription pad */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-white">Live Transcription Text</span>
                  {transcription && (
                    <button
                      onClick={() => setTranscription('')}
                      className="p-1 hover:bg-white/5 rounded text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Click the microphone on the left and start speaking to dictate notes instantly..."
                  className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-xs font-mono text-white min-h-[220px] focus:outline-none focus:border-primary-500/30 leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Screen Capture to PDF */}
        {tabs.find(t => t.active)?.id === 'screen-pdf' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Screen triggers */}
            <div className="lg:col-span-1 glass-panel p-4.5 rounded-2xl border border-white/5 space-y-4 text-center">
              <div>
                <span className="block text-xs font-bold text-white">Display Capture Panel</span>
                <p className="text-[10px] text-dark-400 mt-0.5">Captures active tab overlays locally.</p>
              </div>

              <button
                onClick={startScreenCapture}
                disabled={capturing}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-primary"
              >
                {capturing ? <RefreshCw className="animate-spin" size={13} /> : <Monitor size={13} />}
                Capture Target Screen
              </button>

              {screenBlobUrl && (
                <button
                  onClick={compileScreenPdf}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-accent"
                >
                  <Download size={13} />
                  Download Booklet PDF
                </button>
              )}
            </div>

            {/* Live frame canvas booklet view */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-4.5 rounded-2xl border border-white/5 min-h-[300px] flex flex-col justify-center items-center text-center">
                
                {/* Hidden video element used to query stream tracks */}
                <video ref={videoRef} className="hidden" />

                {capturing && (
                  <div className="space-y-3 py-10">
                    <RefreshCw className="animate-spin text-primary-400 mx-auto" size={24} />
                    <p className="text-xs text-dark-400 font-mono">
                      Staging screen stream... snapshot will trigger in 2 seconds automatically.
                    </p>
                  </div>
                )}

                {!capturing && !screenBlobUrl && (
                  <div className="space-y-2">
                    <AlertCircle className="text-dark-500 mx-auto" size={28} />
                    <p className="text-xs text-dark-400 max-w-sm leading-relaxed">
                      Click **Capture Target Screen** to trigger the browser prompt. You can choose any desktop, window, or tab to capture as a vector PDF.
                    </p>
                  </div>
                )}

                {!capturing && screenBlobUrl && (
                  <div className="space-y-4 w-full">
                    <span className="block text-xs font-bold text-white border-b border-white/5 pb-2.5 text-left">
                      Captured Snapshot Frame Preview
                    </span>
                    <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      <img src={screenBlobUrl} alt="Captured screen booklet frame" className="w-full h-auto aspect-video object-cover" />
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Web Audio Trimmer */}
        {tabs.find(t => t.active)?.id === 'audio-trimmer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Input trimmer configs */}
            <div className="lg:col-span-1 space-y-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="glass-panel border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/30 bg-black/15 transition-all text-center min-h-[150px]"
              >
                <Music size={24} className="text-primary-400 mb-2.5 animate-pulse" />
                <h5 className="font-bold text-white text-xs">Load Audio Track</h5>
                <p className="text-[10px] text-dark-400 mt-1">Supports standard MP3 or WAV uploads.</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>

              {audioBuffer && (
                <div className="glass-panel p-4.5 rounded-2xl border border-white/5 space-y-4 text-xs">
                  <div>
                    <span className="block text-xs font-bold text-white">Audio Wave Crop Limits</span>
                    <p className="text-[10px] text-dark-400 mt-0.5">Specify crop bounds in seconds.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="space-y-1">
                      <span className="text-dark-300 font-semibold block">Start Offset (s)</span>
                      <input
                        type="number"
                        min="0"
                        max={trimEnd}
                        value={trimStart}
                        onChange={(e) => setTrimStart(Math.max(0, parseFloat(e.target.value)))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-dark-300 font-semibold block">End Offset (s)</span>
                      <input
                        type="number"
                        min={trimStart}
                        max={audioDuration}
                        value={trimEnd}
                        onChange={(e) => setTrimEnd(Math.min(audioDuration, parseFloat(e.target.value)))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={processAudioTrim}
                    disabled={trimming}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-glow-accent"
                  >
                    {trimming ? <RefreshCw className="animate-spin" size={13} /> : <Scissors size={13} />}
                    Crop & Download WAV
                  </button>
                </div>
              )}
            </div>

            {/* Audio Wave previewer */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 min-h-[300px] flex flex-col justify-center items-center text-center">
                
                {loadingAudio ? (
                  <div className="space-y-3 py-10">
                    <RefreshCw className="animate-spin text-primary-400 mx-auto" size={24} />
                    <p className="text-xs text-dark-400 font-mono">Decoding PCM audio channel waves...</p>
                  </div>
                ) : !audioBuffer ? (
                  <div className="space-y-2">
                    <AlertCircle className="text-dark-500 mx-auto" size={28} />
                    <p className="text-xs text-dark-400 max-w-sm leading-relaxed">
                      WAV decoder workspace is empty. Select a standard audio track on the left to inspect timeline waves.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 w-full text-left">
                    <div className="border-b border-white/5 pb-2.5">
                      <span className="text-xs font-bold text-white block truncate">{audioFile?.name}</span>
                      <span className="text-[10px] text-primary-400 font-mono font-semibold">
                        Duration: {audioDuration.toFixed(2)} seconds | Sample Rate: {audioBuffer.sampleRate}Hz
                      </span>
                    </div>

                    {/* Timeline grid blocks */}
                    <div className="h-20 bg-black/25 border border-white/5 rounded-xl relative overflow-hidden flex items-center px-4">
                      {/* Audio visual bars */}
                      <div className="flex justify-between items-center w-full h-10 gap-0.5 opacity-50">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-primary-400 w-1 rounded-full transition-all"
                            style={{ height: `${Math.sin(i * 0.4) * 100 + 40}%` }}
                          />
                        ))}
                      </div>

                      {/* Crop crop indicators overlay visual */}
                      <div 
                        className="absolute h-full bg-primary-500/10 border-l border-r border-primary-500/35 transition-all"
                        style={{
                          left: `${(trimStart / audioDuration) * 100}%`,
                          right: `${100 - (trimEnd / audioDuration) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
