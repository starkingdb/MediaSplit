import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Video, Scissors, FileArchive, Download, Play, Loader } from 'lucide-react';
import { initFFmpeg, splitMedia, createZip } from './lib/ffmpeg';

export default function App() {
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [chunkSize, setChunkSize] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState([]);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  // Load FFmpeg early
  useEffect(() => {
    initFFmpeg().then(() => setFfmpegLoaded(true)).catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // To get duration, we can create a temporary object URL and load it into a hidden video/audio element
      const tempUrl = URL.createObjectURL(selected);
      const mediaElement = document.createElement(selected.type.startsWith('audio') ? 'audio' : 'video');
      mediaElement.src = tempUrl;
      mediaElement.onloadedmetadata = () => {
        setDuration(mediaElement.duration);
        URL.revokeObjectURL(tempUrl);
      };
    }
  };

  const handleSplit = async () => {
    if (!file || duration === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setSegments([]);

    try {
      const results = await splitMedia(file, chunkSize, setProgress);
      setSegments(results);
    } catch (err) {
      console.error(err);
      alert('Error en el procesamiento: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (segments.length === 0) return;
    try {
      const zipUrl = await createZip(segments);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `fragmentos_${file.name.replace(/\s+/g, '_')}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(zipUrl), 10000);
    } catch (err) {
      console.error(err);
      alert('Error al crear ZIP');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-zinc-100 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      {/* Top Navigation / Logo area */}
      <nav className="max-w-5xl mx-auto flex items-center justify-between mb-12 animate-in relative z-10">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="LocalMedia Splitter" className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-transform hover:scale-105" />
          <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">Media<span className="text-emerald-500">Split</span></span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto space-y-12 pb-20">

        {/* Header */}
        <header className="text-center space-y-8 pt-6 pb-10 animate-in relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm font-semibold transition-all duration-300 mx-auto relative group cursor-default shadow-lg">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wide">100% Proceso Local y Privado</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-sm leading-[1.1]">
            Corta tus videos con <br className="hidden md:block" />
            <span className="text-gradient">LocalMedia Splitter</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
            Divide archivos multimedia en tu navegador sin subirlos a ninguna nube. Rápido, seguro y completamente gratuito.
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8 animate-in relative z-10">

          {/* File Upload Section */}
          <div className="group relative glass-panel overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="border-2 border-dashed border-zinc-700/60 rounded-2xl m-2.5 p-12 md:p-24 text-center transition-colors relative z-10 flex flex-col items-center justify-center min-h-[360px] bg-zinc-900/30 group-hover:bg-zinc-900/50">
              <input
                type="file"
                accept="video/*, audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                title="Sube tu archivo multimedia"
              />
              <div className="space-y-6 pointer-events-none">
                <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                  {file ? (
                     <Video className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  ) : (
                     <Video className="w-12 h-12 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                    {file ? file.name : "Sube un archivo multimedia"}
                  </h3>
                  <p className="text-zinc-400 text-lg md:text-xl font-medium">
                    {file 
                      ? <span className="flex items-center justify-center gap-3">
                          <span className="bg-zinc-800 px-4 py-2 rounded-xl text-sm font-bold border border-zinc-700 text-zinc-300">{(file.size / (1024 * 1024)).toFixed(2)} MB</span> 
                          <span className="bg-zinc-800 px-4 py-2 rounded-xl text-sm font-bold border border-zinc-700 text-emerald-400">{Math.round(duration)}s duración</span>
                        </span>
                      : "Arrastra y suelta tu video o audio aquí. Formatos MP4, MP3, WebM."}
                  </p>
                </div>
                {!file && (
                  <div className="inline-flex mt-6 items-center justify-center px-8 py-4 rounded-2xl bg-zinc-100 text-zinc-900 text-lg font-extrabold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(255,255,255,0.2)]">
                    Explorar archivos
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          {file && (
            <div className="glass-panel p-6 md:p-10 animate-in">
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-3 w-full">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Duración por corte</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={chunkSize}
                      onChange={(e) => setChunkSize(Number(e.target.value))}
                      min="5"
                      className="w-full bg-zinc-900/90 border-2 border-zinc-800 rounded-2xl pl-6 pr-16 py-5 text-white text-2xl font-black focus:outline-none focus:border-emerald-500/80 focus:bg-zinc-900 transition-all shadow-inner"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold group-focus-within:text-emerald-500 transition-colors">seg</span>
                  </div>
                </div>
                <button
                  onClick={handleSplit}
                  disabled={isProcessing || !ffmpegLoaded}
                  className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xl py-5 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.45)] hover:-translate-y-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-7 h-7 animate-spin" />
                      <span>Procesando {progress}%</span>
                    </>
                  ) : !ffmpegLoaded ? (
                    <>
                      <Loader className="w-7 h-7 animate-spin" />
                      <span>Cargando...</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="w-7 h-7" />
                      <span>Dividir Video</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              {isProcessing && (
                <div className="mt-10 space-y-4">
                  <div className="flex justify-between text-sm font-bold tracking-wide text-zinc-400 px-1">
                    <span>Generando cortes precisos localmente...</span>
                    <span className="text-emerald-400 text-lg">{progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-5 border border-zinc-800 overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-[shimmer_1.5s_infinite]"></div>
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out relative shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {segments.length > 0 && (
          <div className="pt-10 space-y-10 animate-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-800/80 pb-8">
              <h2 className="text-4xl font-extrabold flex items-center gap-4 text-white tracking-tight">
                <FileArchive className="text-emerald-500 w-10 h-10" />
                Fragmentos Listos
              </h2>
              <button 
                onClick={handleDownloadAll} 
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center gap-3 cursor-pointer border border-zinc-700 hover:border-zinc-500 hover:-translate-y-1"
              >
                <Download className="w-6 h-6" />
                Descargar Todo (.zip)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {segments.map((seg, idx) => {
                const startTime = idx * chunkSize;
                const endTime = Math.min((idx + 1) * chunkSize, duration);
                
                const formatTime = (secs) => {
                  const m = Math.floor(secs / 60).toString().padStart(2, '0');
                  const s = Math.floor(secs % 60).toString().padStart(2, '0');
                  return `${m}:${s}`;
                };
                
                const timeStr = `${formatTime(startTime)} - ${formatTime(endTime)}`;
                const isAudio = file?.type.startsWith('audio');

                return (
                  <div key={idx} className="glass-panel overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] hover:border-emerald-500/40">
                    
                    {/* Media Preview Player */}
                    <div className="w-full bg-[#050505] flex items-center justify-center border-b border-zinc-800/80 relative aspect-video">
                      {isAudio ? (
                        <audio src={seg.url} controls className="w-full h-14 p-3 opacity-90 hover:opacity-100 transition-opacity" />
                      ) : (
                        <video 
                          src={seg.url} 
                          controls 
                          className="w-full h-full object-cover group-hover:object-contain transition-all duration-500"
                        />
                      )}
                      
                      {/* Floating Time Badge */}
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-black tracking-wider px-3 py-2 rounded-xl border border-emerald-500/30 shadow-2xl z-10">
                        ⏱ {timeStr}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col gap-5 flex-1 bg-zinc-900/50">
                      <div className="flex justify-between items-start gap-3">
                        <span className="font-mono text-sm text-zinc-300 truncate font-semibold flex-1 leading-tight" title={seg.name}>
                          {seg.name}
                        </span>
                        <span className="text-xs text-zinc-400 font-bold tracking-wider uppercase bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700/60 whitespace-nowrap shadow-inner">
                          Parte {idx + 1}
                        </span>
                      </div>
                      
                      <div className="mt-auto pt-3">
                        <a 
                          href={seg.url} 
                          download={seg.name} 
                          className="w-full bg-zinc-800 hover:bg-emerald-500 text-zinc-200 hover:text-emerald-950 text-center py-4 rounded-xl flex items-center justify-center gap-2.5 text-sm font-extrabold transition-all duration-300 cursor-pointer border border-zinc-700 hover:border-emerald-400 group/btn shadow-md hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.6)]"
                        >
                          <Download className="w-5 h-5 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5 transition-transform" /> 
                          Guardar ({Math.round(seg.size / 1024)} KB)
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
