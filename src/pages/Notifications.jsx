import React, { useState } from 'react';
import axios from 'axios';
import { Bell, Send, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Notifications = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/notifications/send`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormData({ title: '', body: '', imageUrl: '' });
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      setError(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Push Notifications</h1>
          <p className="text-slate-500 mt-1">Send real-time alerts to all app users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notification Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Happy Diwali! 🪔"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Message Body
              </label>
              <textarea
                name="body"
                required
                value={formData.body}
                onChange={handleChange}
                placeholder="Share your message with everyone..."
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Image URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ImageIcon size={18} className="text-slate-400" />
                </div>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 animate-in shake duration-500">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 animate-in zoom-in duration-500">
                <CheckCircle size={20} />
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-slate-200"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Send size={20} />
                  <span>Send Notification Now</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 px-2">Live Preview</h3>
          <div className="relative max-w-sm mx-auto">
            {/* Phone Mockup Frame */}
            <div className="bg-slate-900 rounded-[3rem] p-4 border-[8px] border-slate-800 shadow-2xl aspect-[9/19.5]">
              <div className="w-full h-full bg-slate-800 rounded-[2rem] overflow-hidden relative">
                {/* Notification Bubble */}
                <div className="absolute top-12 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 animate-in slide-in-from-top-full duration-1000">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-200">
                      <Bell size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-primary-600 tracking-wider">LOTUS</span>
                        <span className="text-[10px] text-slate-400 font-medium">now</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {formData.title || 'Notification Title'}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">
                        {formData.body || 'This is how your message will appear on users\' phones.'}
                      </p>
                    </div>
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-100 h-32">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>

                {/* Lockscreen Elements */}
                <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    <ImageIcon size={20} />
                  </div>
                  <div className="w-32 h-1 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
