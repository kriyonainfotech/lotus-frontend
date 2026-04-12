import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutTemplate, Search, Filter, Edit2, Trash2, Smartphone, Image as ImageIcon, Maximize } from 'lucide-react';
import axios from 'axios';

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customW, setCustomW] = useState(1080);
  const [customH, setCustomH] = useState(1080);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:3333/api/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`http://localhost:3333/api/templates/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTemplates(templates.filter(t => t._id !== id));
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const canvasSizes = [
    { id: 'post', name: 'Instagram Post', size: '1080 x 1080', ratio: '1:1', icon: <LayoutTemplate size={24} /> },
    { id: 'story', name: 'Instagram Story', size: '1080 x 1920', ratio: '9:16', icon: <Smartphone size={24} /> },
    { id: 'portrait', name: 'Instagram Portrait', size: '1080 x 1350', ratio: '4:5', icon: <LayoutTemplate size={24} /> },
    { id: 'fb_post', name: 'Facebook Post', size: '1200 x 630', ratio: '1.91:1', icon: <LayoutTemplate size={24} /> },
    { id: 'banner', name: 'Facebook Cover', size: '820 x 312', ratio: '2.6:1', icon: <ImageIcon size={24} /> },
    { id: 'twitter', name: 'Twitter/X Post', size: '1200 x 675', ratio: '16:9', icon: <LayoutTemplate size={24} /> },
    { id: 'youtube', name: 'YouTube Thumbnail', size: '1280 x 720', ratio: '16:9', icon: <LayoutTemplate size={24} /> },
    { id: 'linkedin', name: 'LinkedIn Banner', size: '1584 x 396', ratio: '4:1', icon: <LayoutTemplate size={24} /> },
  ];

  const handleCreate = (sizeId) => {
    if (sizeId === 'custom') {
      navigate(`/templates/create?type=custom&w=${customW}&h=${customH}`);
    } else {
      navigate(`/templates/create?type=${sizeId}`);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Templates</h1>
          <p className="text-slate-500 mt-1">Design and manage your visual templates for the app.</p>
        </div>
        <button
          onClick={() => setShowSizeModal(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus size={20} />
          Create New Template
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[4/5] bg-white rounded-3xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
            <LayoutTemplate size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No templates found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden cursor-pointer" onClick={() => navigate(`/templates/edit/${template._id}`)}>
                {template.imageUrl ? (
                  <img 
                    src={template.imageUrl} 
                    alt={template.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <LayoutTemplate size={80} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/templates/edit/${template._id}`); }}
                    className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform shadow-lg"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-900 truncate">{template.name}</h4>
                <div className="flex items-center justify-between mt-4 uppercase tracking-widest text-[10px] font-bold text-slate-400">
                  <span>{template.ratio}</span>
                  <button onClick={() => deleteTemplate(template._id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowSizeModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-0">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Choose Template Size</h2>
              <p className="text-slate-500 mb-6">Select a preset size or custom dimensions to start designing.</p>
            </div>
            
            <div className="px-8 pb-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {canvasSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleCreate(size.id)}
                    className="flex flex-col items-start p-6 rounded-[2rem] border-2 border-slate-50 hover:border-slate-900 bg-slate-50 hover:bg-white transition-all duration-200 group text-left"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-110 transition-transform mb-4">
                       {size.icon}
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">{size.name}</h5>
                    <p className="text-[10px] text-slate-500 mt-1">{size.size}</p>
                  </button>
                ))}
              </div>
              
              {/* Custom Size Form */}
              <div className="mt-8 border-t border-slate-100 pt-8">
                <button 
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold transition-all ${isCustomMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <Plus size={20} />
                  Custom Dimensions
                </button>
                
                {isCustomMode && (
                  <div className="grid grid-cols-2 gap-4 mt-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Width (px)</label>
                      <input 
                        type="number" 
                        value={customW} 
                        onChange={(e) => setCustomW(Math.min(4000, Math.max(100, parseInt(e.target.value) || 100)))}
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Height (px)</label>
                      <input 
                        type="number" 
                        value={customH} 
                        onChange={(e) => setCustomH(Math.min(4000, Math.max(100, parseInt(e.target.value) || 100)))}
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 flex justify-between items-center">
              <button onClick={() => setShowSizeModal(false)} className="text-slate-500 font-bold hover:text-slate-900 transition-colors">Cancel</button>
              <button 
                onClick={() => handleCreate('custom')}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95"
              >
                Create Designs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
