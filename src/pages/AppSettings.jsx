import React, { useState, useEffect } from 'react';
import { Settings2, Save, Type, List, Plus, Trash2, Info } from 'lucide-react';
import api from '../services/api';

const AppSettings = () => {
  const [settings, setSettings] = useState({
    heroHeadline1: '',
    heroHeadline2: '',
    marqueeText: []
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newMarquee, setNewMarquee] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put('/settings', settings);
      alert('Settings updated successfully! ✨');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const addMarqueeItem = () => {
    if (!newMarquee.trim()) return;
    setSettings({
      ...settings,
      marqueeText: [...settings.marqueeText, newMarquee.trim()]
    });
    setNewMarquee('');
  };

  const removeMarqueeItem = (index) => {
    const updated = [...settings.marqueeText];
    updated.splice(index, 1);
    setSettings({ ...settings, marqueeText: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
         <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">App Settings</h1>
          <p className="text-slate-500 mt-1">Configure global text and headlines for your mobile application.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Hero Section Headlines */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 border border-slate-100">
                 <Type size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Dashboard Hero Headlines</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Headline Line 1</label>
                 <input 
                    type="text" 
                    value={settings.heroHeadline1}
                    onChange={(e) => setSettings({ ...settings, heroHeadline1: e.target.value })}
                    placeholder="e.g. INTEGRATED ALL-IN-ONE"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Headline Line 2</label>
                 <input 
                    type="text" 
                    value={settings.heroHeadline2}
                    onChange={(e) => setSettings({ ...settings, heroHeadline2: e.target.value })}
                    placeholder="e.g. BUSINESS SOLUTIONS"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                 />
              </div>
           </div>

           <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed">
                These headlines appear in the top section of the mobile home screen. Keep them concise (max 25-30 chars per line) for best readability.
              </p>
           </div>
        </section>

        {/* Marquee Ticker */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 border border-slate-100">
                 <List size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">News Ticker (Marquee)</h3>
           </div>
           
           <div className="space-y-4">
              <div className="flex gap-3">
                 <input 
                    type="text" 
                    value={newMarquee}
                    onChange={(e) => setNewMarquee(e.target.value)}
                    placeholder="Add a news item or update message..."
                    className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && addMarqueeItem()}
                 />
                 <button 
                    onClick={addMarqueeItem}
                    className="bg-slate-900 text-white px-6 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all"
                 >
                    <Plus size={20} />
                 </button>
              </div>

              <div className="space-y-3 mt-4">
                 {settings.marqueeText.length === 0 ? (
                    <p className="text-center py-10 text-slate-400 font-bold italic">No ticker items added yet.</p>
                 ) : (
                    settings.marqueeText.map((text, idx) => (
                       <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-200 transition-all overflow-hidden">
                          <span className="font-bold text-slate-700 truncate mr-4">{text}</span>
                          <button 
                             onClick={() => removeMarqueeItem(idx)}
                             className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AppSettings;
