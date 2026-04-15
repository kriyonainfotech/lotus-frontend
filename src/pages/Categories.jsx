import React, { useState, useEffect } from 'react';
import { Plus, Tags, Search, Edit2, Trash2, FolderOpen, Save, X } from 'lucide-react';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = { name };
      
      if (currentCategory) {
        await api.put(`/categories/${currentCategory._id}`, data);
      } else {
        await api.post('/categories', data);
      }
      
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      alert(err.response?.data?.message || 'Error saving category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? (Templates using this category will block deletion)')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        alert(err.response?.data?.message || 'Error deleting category');
      }
    }
  };

  const openEdit = (cat) => {
    setCurrentCategory(cat);
    setName(cat.name);
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentCategory(null);
    setName('');
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 mt-1">Manage template categories for organization and filtering.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus size={20} />
          Create Category
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
            <Tags size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No categories found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="group bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                   <FolderOpen size={24} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(category)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(category._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-slate-900 truncate text-lg">{category.name}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <form 
            onSubmit={handleSubmit}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
          >
            <div className="p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{currentCategory ? 'Edit Category' : 'Create Category'}</h2>
              <p className="text-slate-500 mb-6">Define category properties for template organization.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Category Name</label>
                  <input 
                    required
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Political, Festivals..."
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-slate-200 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 flex justify-between items-center">
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="text-slate-500 font-bold hover:text-slate-900 px-4 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={18} />
                    {currentCategory ? 'Update Category' : 'Create Category'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Categories;
