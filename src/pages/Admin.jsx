import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Users, Server, LogOut, Plus, Search, X, Edit2, Trash2, Shield, AlertCircle, Home } from 'lucide-react';

const Admin = () => {
    const { isAuthenticated, user, logout, fetchWithAuth, loading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated]);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await fetchWithAuth('/users');
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setIsLoadingUsers(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let response;
            if (modalMode === 'add') {
                response = await fetchWithAuth('/users', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            } else {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                response = await fetchWithAuth(`/users/${selectedUser.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updateData)
                });
            }

            const data = await response.json();

            if (data.success) {
                setSuccessMsg(data.message);
                fetchUsers();
                closeModal();
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetchWithAuth(`/users/${userId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                setSuccessMsg(data.message);
                fetchUsers();
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setError(data.message);
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            setError('Failed to delete user.');
        }
        setDeleteConfirm(null);
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', email: '', password: '', role: 'User' });
        setSelectedUser(null);
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setSelectedUser(user);
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'User' });
        setSelectedUser(null);
        setError('');
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>;
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background text-white pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
                </div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400"
                        >
                            {successMsg}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <StatCard
                        icon={<Users className="text-blue-400" />}
                        title="Total Users"
                        value={users.length}
                        subtitle={`${users.filter(u => u.role === 'Admin').length} Admins, ${users.filter(u => u.role === 'User').length} Users`}
                    />
                    <StatCard
                        icon={<Server className="text-green-400" />}
                        title="System Status"
                        value="Online"
                        subtitle="All services operational"
                    />
                </div>

                {/* User Management */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-xl font-bold">User Management</h2>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <div className="relative flex-grow sm:flex-grow-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-72 bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                            <button
                                onClick={openAddModal}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                <Plus size={18} />
                                Add User
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        {isLoadingUsers ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <table className="w-full text-left text-gray-400">
                                <thead className="bg-white/5 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3 rounded-l-lg">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3 rounded-r-lg text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-medium">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-white">{u.name}</span>
                                                        {u.is_primary_admin === 1 && (
                                                            <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                                                Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'Admin'
                                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                    }`}>
                                                    {u.role === 'Admin' && <Shield size={12} className="inline mr-1" />}
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(u)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                                        title="Edit User"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    {!u.is_primary_admin && u.id !== user?.id && (
                                                        <button
                                                            onClick={() => setDeleteConfirm(u)}
                                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Add/Edit User Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#1a1a20] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                            >
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>

                                <h2 className="text-xl font-bold mb-6">
                                    {modalMode === 'add' ? 'Add New User' : 'Edit User'}
                                </h2>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500/50"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500/50"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Password {modalMode === 'edit' && <span className="text-gray-500">(leave blank to keep current)</span>}
                                        </label>
                                        <input
                                            type="password"
                                            required={modalMode === 'add'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500/50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            disabled={selectedUser?.is_primary_admin}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                                        >
                                            <option value="User">User</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                        {selectedUser?.is_primary_admin && (
                                            <p className="text-xs text-yellow-400 mt-1">Primary admin role cannot be changed</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors"
                                    >
                                        {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deleteConfirm && (
                        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#1a1a20] border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl text-center"
                            >
                                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="text-red-400" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Delete User?</h3>
                                <p className="text-gray-400 text-sm mb-6">
                                    Are you sure you want to delete <span className="text-white font-medium">{deleteConfirm.name}</span>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deleteConfirm.id)}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
};

const StatCard = ({ icon, title, value, subtitle }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-lg">{icon}</div>
            <div>
                <h3 className="text-gray-400 text-sm">{title}</h3>
                <p className="text-2xl font-bold text-white">{value}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    </div>
);

export default Admin;
