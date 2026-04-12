import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Globe,
  Hash,
  Eye,
  Calendar,
  MapPin,
  Shield,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    designation: '',
    firebaseUid: '',
    dob: '',
    gender: '',
    city: '',
    avatarUrl: '',
    role: 'user',
    isProfileComplete: false,
    businessName: '',
    industryId: '',
    logoUrl: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      const res = await api.get('/onboarding/industries');
      if (res.data?.success) {
        setIndustries(res.data.industries);
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');

      console.log(res.data, 'users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      // Fallback dummy data for demo if backend fails or returns 401
      setUsers([
        { _id: '1', name: 'John Doe', email: 'john@example.com', phoneNumber: '1234567890' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phoneNumber: '9876543210' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenViewModal = (user) => {
    setViewUser(user);
    setIsViewModalOpen(true);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        designation: user.designation || '',
        firebaseUid: user.firebaseUid || '',
        dob: user.dob || '',
        gender: user.gender || '',
        city: user.city || '',
        avatarUrl: user.avatarUrl || '',
        role: user.role || 'user',
        isProfileComplete: user.isProfileComplete || false,
        businessName: user.business?.businessName || '',
        industryId: user.business?.industryId?._id || user.business?.industryId || '',
        logoUrl: user.business?.logoUrl || '',
        contactPhone: user.business?.contactPhone || ''
      });
    } else {
      setCurrentUser(null);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        designation: '',
        firebaseUid: '',
        dob: '',
        gender: '',
        city: '',
        avatarUrl: '',
        role: 'user',
        isProfileComplete: false,
        businessName: '',
        industryId: '',
        logoUrl: '',
        contactPhone: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await api.put(`/admin/users/${currentUser._id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please check console.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Users</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">View, add, edit, and delete platform users.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-slate-200 active:scale-95 text-sm sm:text-base"
        >
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 border-b border-slate-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                      <p className="text-slate-500 text-sm">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600 flex items-center gap-1.5">
                          <Phone size={14} className="text-slate-400" />
                          {user.phoneNumber || 'N/A'}
                        </p>
                        {user.designation && (
                          <p className="text-xs text-slate-400 flex items-center gap-1.5">
                            <Briefcase size={12} />
                            {user.designation}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenViewModal(user)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-none sm:zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {currentUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Firebase UID - only editable if new user or for debugging */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Firebase UID</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                    value={formData.firebaseUid}
                    onChange={(e) => setFormData({ ...formData, firebaseUid: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Full Name</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Enter name"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="Enter email"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10 digit number"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phoneNumber: val });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Enter designation"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Gender</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Role</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-2 flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isProfileComplete"
                    className="w-5 h-5 accent-primary-600 rounded border-slate-300"
                    checked={formData.isProfileComplete}
                    onChange={(e) => setFormData({ ...formData, isProfileComplete: e.target.checked })}
                  />
                  <label htmlFor="isProfileComplete" className="text-sm font-semibold text-slate-700 cursor-pointer">Profile Complete</label>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Avatar URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  />
                </div>

                {/* Business Information Section */}
                <div className="col-span-1 md:col-span-2 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-slate-100"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Details</span>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Enter company name"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Industry</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                    value={formData.industryId}
                    onChange={(e) => setFormData({ ...formData, industryId: e.target.value })}
                  >
                    <option value="">Select Industry</option>
                    {industries.map(ind => (
                      <option key={ind._id} value={ind._id}>
                        {ind.icon} {ind.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Business Logo URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 px-1">Business Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Company contact"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:flex-1 py-3.5 px-4 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-2 py-3.5 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-200 order-1 sm:order-2 active:scale-[0.98]"
                >
                  {currentUser ? 'Update User' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {isViewModalOpen && viewUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                {viewUser.avatarUrl ? (
                  <img src={viewUser.avatarUrl} alt={viewUser.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                    {viewUser.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewUser.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      ID: {viewUser.firebaseUid?.slice(0, 12)}...
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${viewUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                      {viewUser.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8">
              {/* Personal Info */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <UserPlus size={14} /> Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail size={16} className="text-slate-400" />
                      <span className="text-sm">{viewUser.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone size={16} className="text-slate-400" />
                      <span className="text-sm font-medium">{viewUser.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-sm">{viewUser.dob || 'DOB Not Provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin size={16} className="text-slate-400" />
                      <span className="text-sm">{viewUser.city || 'City Not Provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="text-xs font-bold py-0.5 px-2 rounded bg-slate-100 text-slate-500">GENDER</span>
                      <span className="text-sm">{viewUser.gender || 'Not Specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={14} /> Profile Status
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className={`p-1.5 rounded-full ${viewUser.isProfileComplete ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {viewUser.isProfileComplete ? 'Profile Fully Completed' : 'Onboarding Pending'}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Status Verification</p>
                      </div>
                    </div>
                    <div className="space-y-2 px-1">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Briefcase size={16} className="text-slate-400" />
                        <span className="text-sm font-semibold">{viewUser.designation || 'No Designation'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Business Info */}
              {viewUser.business && (
                <section className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Building2 size={80} />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                    <Building2 size={12} /> Verified Business Info
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="flex items-start gap-5">
                      {viewUser.business.logoUrl ? (
                        <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-xl shadow-black/20 overflow-hidden">
                          <img src={viewUser.business.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                          <Building2 className="text-slate-500" size={28} />
                        </div>
                      )}
                      <div>
                        <p className="text-lg font-bold leading-tight">{viewUser.business.businessName}</p>
                        <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/5">
                          <span className="text-sm">{viewUser.business.industryId?.icon}</span>
                          <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                            {viewUser.business.industryId?.name || 'Unspecified Sector'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-slate-300 text-sm bg-white/5 py-2 px-3 rounded-xl border border-white/5">
                        <Phone size={14} className="text-primary-400" />
                        <span className="font-mono">Business: {viewUser.business.contactPhone || 'No Contact Info'}</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Media Gallery Section */}
              <section className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} /> Media & Assets
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {viewUser.avatarUrl && (
                    <div className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={viewUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">User Avatar</span>
                      </div>
                    </div>
                  )}
                  {viewUser.business?.logoUrl && (
                    <div className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={viewUser.business.logoUrl} alt="Logo" className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Business Logo</span>
                      </div>
                    </div>
                  )}
                  {!viewUser.avatarUrl && !viewUser.business?.logoUrl && (
                    <div className="col-span-full py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-sm text-slate-400">No media assets found for this user.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 relative z-20">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
              >
                Dismiss Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
