import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { 
  Type, 
  Image as ImageIcon, 
  Trash2, 
  Save, 
  ChevronLeft, 
  Upload, 
  Layers, 
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Maximize,
  Menu,
  X,
  Palette,
  MousePointer2
} from 'lucide-react';
import { Canvas, IText, FabricImage } from 'fabric';
import api from '../services/api';

const TemplateEditor = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState('Untitled Template');
  const [category, setCategory] = useState('General');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isDirty, setIsDirty] = useState(false);
  
  const canvasType = searchParams.get('type') || 'post';
  
  // Canvas Configurations
  const configs = {
    post: { width: 1080, height: 1080, ratio: '1:1', name: 'IG Post' },
    story: { width: 1080, height: 1920, ratio: '9:16', name: 'IG Story' },
    portrait: { width: 1080, height: 1350, ratio: '4:5', name: 'IG Portrait' },
    fb_post: { width: 1200, height: 630, ratio: '1.91:1', name: 'FB Post' },
    banner: { width: 820, height: 312, ratio: '2.6:1', name: 'FB Cover' },
    twitter: { width: 1200, height: 675, ratio: '16:9', name: 'Twitter Post' },
    youtube: { width: 1280, height: 720, ratio: '16:9', name: 'YT Thumbnail' },
    linkedin: { width: 1584, height: 396, ratio: '4:1', name: 'LinkedIn Banner' },
    custom: { 
      width: parseInt(searchParams.get('w')) || 1080, 
      height: parseInt(searchParams.get('h')) || 1080,
      ratio: `${searchParams.get('w')}:${searchParams.get('h')}`,
      name: 'Custom Size'
    }
  };

  const currentConfig = configs[canvasType] || configs.post;

  // Unsaved changes protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const zoomToFit = useCallback((canvasInstance) => {
    const container = document.getElementById('canvas-viewport');
    if (!container || !canvasInstance) return;

    const availableWidth = container.clientWidth - 100;
    const availableHeight = container.clientHeight - 100;

    if (availableWidth <= 0 || availableHeight <= 0) return;

    const scaleX = availableWidth / currentConfig.width;
    const scaleY = availableHeight / currentConfig.height;
    const scale = Math.min(scaleX, scaleY, 1);
    const finalScale = Math.max(scale, 0.1);

    canvasInstance.setZoom(finalScale);
    canvasInstance.setDimensions({
      width: currentConfig.width * finalScale,
      height: currentConfig.height * finalScale
    });
    
    setZoomLevel(finalScale);
    canvasInstance.renderAll();
  }, [currentConfig.width, currentConfig.height]);

  useEffect(() => {
    const initCanvas = new Canvas('editor-canvas', {
      width: currentConfig.width,
      height: currentConfig.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    setCanvas(initCanvas);

    // Initial zoom - wait for DOM to be ready
    const timer = setTimeout(() => {
      zoomToFit(initCanvas);
    }, 100);

    initCanvas.on('selection:created', (e) => setActiveObject(e.selected[0]));
    initCanvas.on('selection:updated', (e) => setActiveObject(e.selected[0]));
    initCanvas.on('selection:cleared', () => setActiveObject(null));
    initCanvas.on('object:modified', (e) => {
      const obj = e.target;
      if (obj && obj.type && obj.type.includes('text')) {
        // "HONEST TYPOGRAPHY" FIX: 
        // Convert visual scale into actual font size pixels and reset scale
        if (obj.scaleX !== 1 || obj.scaleY !== 1) {
          const newFontSize = Math.round(obj.fontSize * obj.scaleY);
          const newWidth = obj.width * obj.scaleX;
          obj.set({
            fontSize: newFontSize,
            width: newWidth,
            scaleX: 1,
            scaleY: 1
          });
          obj.setCoords();
        }
      }
      setIsDirty(true);
    });
    initCanvas.on('object:added', () => setIsDirty(true));

    const handleResize = () => {
      zoomToFit(initCanvas);
      setIsSidebarOpen(window.innerWidth > 1024);
    };
    
    window.addEventListener('resize', handleResize);

    if (id) {
      loadTemplate(id, initCanvas);
    }

    return () => {
      clearTimeout(timer);
      initCanvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
    // Removed zoomToFit from deps to prevent loop
    // Re-run ONLY when template ID or fundamental canvas size type changes
  }, [id, canvasType]);

  const handleManualZoom = (newZoom) => {
    if (!canvas) return;
    const scale = Math.max(0.05, Math.min(newZoom, 2));
    canvas.setZoom(scale);
    canvas.setDimensions({
      width: currentConfig.width * scale,
      height: currentConfig.height * scale
    });
    setZoomLevel(scale);
  };

  const loadTemplate = async (templateId, canvasInstance) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3333/api/templates/${templateId}`);
      const template = res.data;
      setTemplateName(template.name);
      setCategory(template.category);
      
      if (template.fabricJSON) {
        await canvasInstance.loadFromJSON(template.fabricJSON);
        canvasInstance.renderAll();
        zoomToFit(canvasInstance);
        setIsDirty(false); 
      }
    } catch (err) {
      console.error('Error loading template:', err);
    } finally {
      setLoading(false);
    }
  };

  const addText = (textType = 'heading') => {
    if (!canvas) return;
    
    let fontSize = 80;
    let fontWeight = 'bold';
    let content = 'HEADING';

    if (textType === 'subheading') {
      fontSize = 50;
      content = 'Subheading';
    } else if (textType === 'body') {
      fontSize = 32;
      fontWeight = 'normal';
      content = 'Tap to edit text...';
    }

    const text = new IText(content, {
      left: currentConfig.width / 2,
      top: currentConfig.height / 2,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontFamily: 'Inter',
      fill: '#000000',
      originX: 'center',
      originY: 'center',
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const res = await api.post('/templates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Fabric v7: fromURL returns a Promise
      const img = await FabricImage.fromURL(res.data.url, { crossOrigin: 'anonymous' });
      
      if (img.width > currentConfig.width) {
        img.scaleToWidth(currentConfig.width * 0.8);
      }
      
      img.set({
        left: currentConfig.width / 2,
        top: currentConfig.height / 2,
        originX: 'center',
        originY: 'center',
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeTemplate = () => {
    if (!canvas) return null;
    
    const objects = canvas.getObjects();
    const images = [];
    const textLayers = [];
    
    // Use actual internal canvas dimensions for normalization
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Explicitly handle Background
    const bgImage = canvas.backgroundImage;
    if (bgImage) {
      images.push({
        image: bgImage.src,
        x: 0, y: 0, width: 1, height: 1,
        fit: 'cover',
        isBackground: true,
        zIndex: -1
      });
    }

    objects.forEach((obj, index) => {
      // 1. STABLE RESOLUTION SYNC
      // Always use the base resolution (1080px), NOT the current zoomed canvas width
      const baseWidth = currentConfig.width;
      const baseHeight = currentConfig.height;

      // 2. Capture the VISUAL CENTER while the design is in its final state
      // Capture this before un-rotating to ensure the pivot is correct
      const center = obj.getCenterPoint();
      const x = center.x / baseWidth;
      const y = center.y / baseHeight;

      // 3. Temporarily un-rotate ONLY to get the pure rectangle dimensions
      const originalAngle = obj.angle || 0;
      obj.set('angle', 0);
      obj.setCoords();
      
      const width = (obj.type.includes('text') ? obj.width * obj.scaleX : obj.getScaledWidth()) / baseWidth;
      const height = (obj.type.includes('text') ? obj.height * obj.scaleY : obj.getScaledHeight()) / baseHeight;
      
      // 4. Restore original angle immediately
      obj.set('angle', originalAngle);
      obj.setCoords();

      const opacity = obj.opacity || 1;
      const zIndex = index;

      const isForcedBackground = obj.id === 'background' || obj.name === 'background';

      if (obj.type === 'image' || obj.type === 'image-layer') {
        images.push({
          image: obj._element?.src || obj.src,
          x, y, width, height,
          angle: originalAngle, opacity, zIndex,
          fit: 'contain',
          isBackground: isForcedBackground
        });
      } else if (obj.type.includes('text')) {
        textLayers.push({
          text: obj.text,
          font: obj.fontFamily,
          size: obj.fontSize,
          sizeRatio: obj.fontSize / baseWidth, // Honest size ratio (scale is now 1)
          color: obj.fill,
          x, y,
          width, height,
          angle: originalAngle, opacity, zIndex,
          bold: obj.fontWeight === 'bold',
          italic: obj.fontStyle === 'italic',
          textAlign: obj.textAlign || 'left'
        });
      }
    });

    return {
      name: templateName,
      category: category,
      baseColor: canvas.backgroundColor,
      ratio: currentConfig.ratio,
      size: canvasType.toUpperCase(),
      images,
      textLayers,
      fabricJSON: canvas.toJSON()
    };
  };

  const saveTemplate = async () => {
    const data = normalizeTemplate();
    if (!data) return;

    // Generate accurate visual thumbnail for preview
    const thumbnail = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.8,
      multiplier: 0.8 // High enough for mobile preview, low enough for storage
    });
    
    data.thumbnail = thumbnail;

    try {
      setLoading(true);

      if (id) {
        await api.put(`/templates/${id}`, data);
        alert('Design Saved! ✨');
      } else {
        await api.post('/templates', data);
        navigate('/templates');
      }
      setIsDirty(false);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSelected = () => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    canvas.requestRenderAll();
  };

  return (
    <div className="fixed inset-0 bg-[#f1f5f9] flex flex-col z-[60] overflow-hidden select-none">
      {/* Production Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 shrink-0 z-50">
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => {
              console.log('Back button clicked. isDirty:', isDirty);
              if (isDirty) {
                const confirmExit = window.confirm('You have unsaved changes. Exit anyway?');
                if (!confirmExit) return;
              }
              navigate('/templates');
            }} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 z-[100] cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="hidden sm:block h-6 w-px bg-slate-200" />
          <div className="flex flex-col">
            <input 
              value={templateName} 
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-xs sm:text-sm font-extrabold text-slate-900 bg-transparent border-none focus:outline-none hover:bg-slate-50 rounded px-1"
            />
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{currentConfig.name}</span>
              {isDirty && <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" title="Unsaved changes" />}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Zoom */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 ring-1 ring-white/50">
             <button onClick={() => handleManualZoom(zoomLevel - 0.1)} className="text-slate-400 hover:text-slate-900 transition-colors"><ZoomOut size={16} /></button>
             <span className="text-[10px] font-black text-slate-700 w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
             <button onClick={() => handleManualZoom(zoomLevel + 0.1)} className="text-slate-400 hover:text-slate-900 transition-colors"><ZoomIn size={16} /></button>
          </div>
          
          <button
             onClick={saveTemplate}
             disabled={loading}
             className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-black hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <Save size={16} className="hidden sm:inline" />
            {loading ? '...' : 'Save'}
          </button>
          
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 bg-slate-100 rounded-lg text-slate-600"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Mobile-Adaptive Sidebar */}
        <aside className={`
          fixed inset-y-14 left-0 z-40 w-full sm:w-80 bg-white border-r border-slate-200 transition-transform duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:inset-y-0 lg:translate-x-0 shrink-0 flex flex-col
        `}>
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
            {/* Project Config */}
            <section className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Details</h3>
               <div className="space-y-3">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 ml-1">CONTENT CATEGORY</label>
                   <select 
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:ring-4 focus:ring-slate-100 transition-all appearance-none"
                   >
                     <option>General</option>
                     <option>Political</option>
                     <option>Devotional</option>
                     <option>Birthdays</option>
                   </select>
                 </div>
               </div>
            </section>

            {/* Content Creator */}
            <section className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Typography</h3>
               <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => addText('heading')} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-110 transition-transform"><Type size={20} /></div>
                    <div className="flex flex-col items-start">
                       <span className="text-xs font-black">Add Heading</span>
                       <span className="text-[9px] font-bold opacity-50 uppercase">Bold Inter Fonts</span>
                    </div>
                  </button>
                  <button onClick={() => addText('body')} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm group-hover:scale-110 transition-transform"><Type size={16} /></div>
                    <div className="flex flex-col items-start text-slate-500">
                       <span className="text-xs font-black">Add Body Text</span>
                       <span className="text-[9px] font-bold opacity-50 uppercase">Light Paragraph</span>
                    </div>
                  </button>
               </div>
            </section>

            {/* Visuals */}
            <section className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Media Library</h3>
               <label className="flex flex-col items-center justify-center p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-100 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm mb-4 group-hover:-translate-y-1 transition-transform">
                     <Upload size={24} />
                  </div>
                  <span className="text-xs font-black text-slate-800">Choose Image</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1">PNG, JPG or SVG</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
               </label>
            </section>
          </div>

          {/* Quick Actions Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
             <div className="flex items-center justify-between gap-4">
                <button onClick={() => handleManualZoom(zoomLevel - 0.1)} className="flex-1 p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors flex justify-center"><ZoomOut size={18} /></button>
                <button onClick={() => zoomToFit(canvas)} className="flex-1 p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors flex justify-center"><Maximize size={18} /></button>
                <button onClick={() => handleManualZoom(zoomLevel + 0.1)} className="flex-1 p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors flex justify-center"><ZoomIn size={18} /></button>
             </div>
          </div>
        </aside>

        {/* Dynamic Canvas Viewport */}
        <main className="flex-1 relative flex items-center justify-center overflow-auto bg-[#e2e8f0] p-4 sm:p-12" id="canvas-viewport">
          <div 
            className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden flex items-center justify-center"
          >
            <canvas id="editor-canvas" />
          </div>

          {/* Contextual Controller - Production Ready */}
          {activeObject && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xl text-white p-2 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-500 scale-90 sm:scale-100">
                {activeObject.type.includes('text') && (
                  <>
                    <button onClick={() => { activeObject.set('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold'); canvas.renderAll(); setIsDirty(true); }} className={`p-2 rounded-xl transition-all ${activeObject.fontWeight === 'bold' ? 'bg-white text-slate-900' : 'hover:bg-white/10'}`}><Bold size={18} /></button>
                    <button onClick={() => { activeObject.set('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic'); canvas.renderAll(); setIsDirty(true); }} className={`p-2 rounded-xl transition-all ${activeObject.fontStyle === 'italic' ? 'bg-white text-slate-900' : 'hover:bg-white/10'}`}><Italic size={18} /></button>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                  </>
                )}
                <div className="flex gap-1 items-center bg-white/10 rounded-xl px-1">
                   <button 
                     onClick={() => { canvas.bringToFront(activeObject); canvas.renderAll(); setIsDirty(true); }} 
                     className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                     title="Bring to Front"
                   ><Maximize size={16} className="rotate-45" /></button>
                   <button 
                     onClick={() => { canvas.bringForward(activeObject); canvas.renderAll(); setIsDirty(true); }} 
                     className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                     title="Bring Forward"
                   ><ChevronUp size={18} /></button>
                   <button 
                     onClick={() => { canvas.sendBackwards(activeObject); canvas.renderAll(); setIsDirty(true); }} 
                     className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                     title="Send Backward"
                   ><ChevronDown size={18} /></button>
                   <button 
                     onClick={() => { canvas.sendToBack(activeObject); canvas.renderAll(); setIsDirty(true); }} 
                     className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                     title="Send to Back"
                   ><div className="w-4 h-4 border-2 border-white/40 rounded-sm" /></button>
                </div>
                <div className="w-px h-6 bg-white/10 mx-1" />
                
                {/* Color Control */}
                <div className="flex items-center gap-2 px-2 group">
                   <div 
                     className="w-6 h-6 rounded-full border border-white/20 shadow-inner relative"
                     style={{ backgroundColor: activeObject.fill || '#000000' }}
                   >
                     <input 
                       type="color" 
                       value={activeObject.fill || '#000000'}
                       onChange={(e) => {
                         activeObject.set('fill', e.target.value);
                         canvas.renderAll();
                         setIsDirty(true);
                       }}
                       className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                     />
                   </div>
                   <span className="text-[10px] font-bold text-white/50 hidden sm:block uppercase tracking-wider">{activeObject.fill || '#000000'}</span>
                </div>

                <div className="w-px h-6 bg-white/10 mx-1" />
                <button onClick={deleteSelected} className="p-2 hover:bg-red-500 bg-red-500/10 text-red-500 hover:text-white rounded-xl transition-all duration-300"><Trash2 size={18} /></button>
             </div>
          )}

          {/* Quick Tools (Mobile Friendly Access) */}
          <div className="lg:hidden absolute bottom-6 flex items-center gap-3 bg-white/90 backdrop-blur-md p-3 rounded-[2rem] shadow-2xl border border-white/50">
             <button onClick={() => addText('heading')} className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Type size={20} /></button>
             <button onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg border border-slate-100 active:scale-90 transition-transform"><Layers size={20} /></button>
             <label className="w-12 h-12 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center shadow-lg border border-slate-100 cursor-pointer active:scale-90 transition-transform">
                <Upload size={20} />
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
             </label>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TemplateEditor;
