'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Mail, Briefcase, Camera, Key, Lock, Shield, Smartphone, PenLine, ChevronRight, Save, X, MoreVertical, Trash2, Edit, ShieldAlert, Plus, Search, Loader2 } from 'lucide-react';
import { HeaderActions } from '@/components/layout/header-actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PinVerificationModal } from '@/components/admin/pin-verification-modal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { api } from '@/lib/api';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [activeSection, setActiveSection] = useState<'info' | 'security' | 'admin'>('info');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/api/users/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const updatedUser = { ...user, avatar_url: res.data.url };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('userUpdated'));
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!confirm('¿Eliminar foto de perfil?')) return;
        try {
            await api.delete('/api/users/me/avatar');
            const updatedUser = { ...user, avatar_url: null };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('userUpdated'));
        } catch (error) {
            console.error('Error deleting avatar:', error);
        }
    };

    if (loading) return null;

    const isAdminOrDirector = user?.role === 'admin' || user?.role === 'director' || user?.role === 'DIRECTOR' || user?.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] pb-20">
            {/* Header */}
            <div className="bg-[#0F2C4A] h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                <div className="container mx-auto px-6 h-full flex items-center justify-between relative z-10">
                    <div className="mt-[-2rem]">
                        <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
                        <p className="text-blue-200">Gestiona tu información personal y seguridad de la cuenta.</p>
                    </div>
                    <div className="hidden md:block">
                        <HeaderActions />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-20 relative z-20">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="w-full md:w-80 flex-shrink-0">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                            <div className="p-8 flex flex-col items-center border-b border-slate-100 dark:border-slate-700">
                                <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-700 p-1.5 shadow-2xl relative group mb-4">
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-600 bg-white">
                                        {user?.avatar_url ? (
                                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-cyan-500 text-white text-4xl font-bold">
                                                {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleAvatarClick}
                                        className="absolute bottom-1 right-1 p-2 bg-blue-600 rounded-full text-white shadow-lg border-2 border-white dark:border-slate-800 hover:bg-blue-700 transition-colors transform hover:scale-105"
                                        title="Cambiar foto"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    {user?.avatar_url && (
                                        <button
                                            onClick={handleDeleteAvatar}
                                            className="absolute bottom-1 left-1 p-2 bg-red-600 rounded-full text-white shadow-lg border-2 border-white dark:border-slate-800 hover:bg-red-700 transition-colors transform hover:scale-105"
                                            title="Eliminar foto"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">{user?.nombre || 'Usuario'}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{user?.email}</p>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                isAdminOrDirector ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                            )}>
                                {user?.role || 'Colaborador'}
                            </span>
                        </div>
                        <div className="p-4">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveSection('info')}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                        activeSection === 'info'
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    )}
                                >
                                    <User className="w-5 h-5" />
                                    Información Personal
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                </button>
                                {isAdminOrDirector && (
                                    <button
                                        onClick={() => setActiveSection('security')}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                            activeSection === 'security'
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                        )}
                                    >
                                        <Shield className="w-5 h-5" />
                                        Seguridad y Contraseña
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                    </button>
                                )}

                                {isAdminOrDirector && (
                                    <button
                                        onClick={() => setActiveSection('admin')}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm mt-4 border-t border-slate-100 dark:border-slate-700 pt-4",
                                            activeSection === 'admin'
                                                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                        )}
                                    >
                                        <ShieldAlert className="w-5 h-5" />
                                        Administración
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                    </button>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 min-h-[500px]">
                        {activeSection === 'info' && <PersonalInfoForm user={user} setUser={setUser} />}
                        {activeSection === 'security' && isAdminOrDirector && <SecuritySettings />}
                        {activeSection === 'admin' && isAdminOrDirector && <UserManagement currentUser={user} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PersonalInfoForm({ user, setUser }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        email: user?.email || '',
        job_title: user?.job_title || '',
        username: user?.username || '',
        phone: user?.phone || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await api.put('/api/users/me', {
                nombre: formData.nombre,
                email: formData.email,
                job_title: formData.job_title,
                // username not editable? 
                // phone not in API?
            });
            const newUser = { ...user, ...response.data };
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            window.dispatchEvent(new Event('userUpdated'));
            setSuccess('Información actualizada correctamente');
            setTimeout(() => {
                setSuccess('');
                setIsEditing(false);
            }, 1000);
        } catch (err: any) {
            console.error('Error saving profile', err);
            let errorMsg = 'Error al guardar los cambios';
            if (err.response?.data?.detail) {
                if (typeof err.response.data.detail === 'string') {
                    errorMsg = err.response.data.detail;
                } else if (Array.isArray(err.response.data.detail)) {
                    errorMsg = err.response.data.detail.map((e: any) => e.msg).join(', ');
                } else {
                    errorMsg = JSON.stringify(err.response.data.detail);
                }
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Información Personal</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Actualiza tus datos de contacto y perfil público.</p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 rounded-xl">
                        <PenLine className="w-4 h-4" /> Editar
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl" disabled={loading}>Cancelar</Button>
                        <Button onClick={handleSave} className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm mb-4">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full pl-10 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre de Usuario</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full pl-8 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full pl-10 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cargo / Puesto</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full pl-10 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecuritySettings() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Seguridad de la Cuenta</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona tu contraseña y PIN de acceso.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Contraseña</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Se recomienda cambiar tu contraseña cada 90 días.</p>
                    </div>
                </div>

                <div className="space-y-4 max-w-lg">
                    <PasswordChangeForm />
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">PIN de Seguridad</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Código de 6 dígitos para operaciones sensibles.</p>
                    </div>
                </div>

                <div className="space-y-4 max-w-lg">
                    <PinChangeForm />
                </div>
            </div>
        </div>
    );
}

function UserManagement({ currentUser }: { currentUser: any }) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [resettingPasswordUser, setResettingPasswordUser] = useState<any>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Try fetch from primary users endpoint (directors)
            let response = await api.get('/api/users/');
            setUsers(response.data);
        } catch (error: any) {
            console.error("Failed to fetch from /api/users/", error);
            try {
                // Fallback to auth users endpoint if available/appropriate
                const response = await api.get('/api/auth/users');
                setUsers(response.data);
            } catch (err2) {
                console.error("Failed to fetch users", err2);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        (user.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.id_corporativo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setShowPinModal(true);
    };

    const handlePinVerify = async (pin: string) => {
        try {
            // Verify PIN
            await api.post('/api/auth/verify-pin', { pin });

            // Delete User
            if (userToDelete) {
                await api.delete(`/api/users/${userToDelete.id}`);
                setUsers(users.filter(u => u.id !== userToDelete.id));
                setUserToDelete(null);
                setShowPinModal(false);
                return true;
            }
        } catch (error: any) {
            console.error("Error verifying PIN or deleting user", error);
            throw new Error(error.response?.data?.detail || "Error de verificación");
        }
        return false;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Administración de Usuarios</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona cuentas, contraseñas y accesos. Requiere privilegios de Admin/Director.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white gap-2 rounded-xl"
                >
                    <Plus className="w-4 h-4" /> Nuevo Usuario
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-slate-700 dark:text-slate-200"
                />
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative min-h-[200px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : null}

                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4 pl-6">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right pr-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                        {filteredUsers.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    No se encontraron usuarios.
                                </td>
                            </tr>
                        )}
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 border border-slate-200 dark:border-slate-600 overflow-hidden">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                user.nombre?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{user.nombre} {user.apellidos || ''}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                                        (user.role || user.perfil) === 'DIRECTOR' || (user.role || user.perfil) === 'admin' ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800" :
                                            (user.role || user.perfil) === 'ANALISTA' ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" :
                                                "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                                    )}>
                                        {user.role || user.perfil}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "w-2.5 h-2.5 rounded-full animate-pulse",
                                            user.activo ? "bg-green-500" : "bg-red-500"
                                        )}></span>
                                        <span className={cn(
                                            "text-sm font-medium",
                                            user.activo ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                                        )}>
                                            {user.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content className="min-w-[180px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-1.5 animate-in zoom-in-95 duration-200 z-50 mr-8">
                                                <DropdownMenu.Item
                                                    onSelect={() => setEditingUser(user)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer outline-none font-medium transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-blue-500" /> Editar información
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                    onSelect={() => setResettingPasswordUser(user)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer outline-none font-medium transition-colors"
                                                >
                                                    <Key className="w-4 h-4 text-amber-500" /> Restablecer clave
                                                </DropdownMenu.Item>
                                                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                                                <DropdownMenu.Item
                                                    onSelect={() => handleDeleteClick(user)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer outline-none font-bold transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Eliminar usuario
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PinVerificationModal
                isOpen={showPinModal}
                onClose={() => setShowPinModal(false)}
                onVerify={handlePinVerify}
                title="Confirmar Eliminación"
                description={userToDelete ? `Para eliminar al usuario ${userToDelete.nombre}, ingresa tu PIN de seguridad personal.` : ''}
            />

            {showCreateModal && <CreateUserModal onClose={() => { setShowCreateModal(false); fetchUsers(); }} />}
            {editingUser && <EditUserDialog open={!!editingUser} user={editingUser} onClose={() => { setEditingUser(null); fetchUsers(); }} />}
            {resettingPasswordUser && <ResetPasswordDialog open={!!resettingPasswordUser} user={resettingPasswordUser} onClose={() => setResettingPasswordUser(null)} />}
        </div >
    );
}

function EditUserDialog({ open, user, onClose }: { open: boolean, user: any, onClose: () => void }) {
    const [formData, setFormData] = useState({
        id_corporativo: user.id_corporativo || '',
        nombre: user.nombre || '',
        email: user.email || '',
        perfil: user.perfil || 'COLABORADOR',
        job_title: user.job_title || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.put(`/api/users/${user.id}`, formData);
            onClose();
        } catch (err: any) {
            console.error(err);
            const detail = err.response?.data?.detail;
            setError(typeof detail === 'string' ? detail : 'Error al actualizar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg animate-in zoom-in-95"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold dark:text-white">Editar Usuario</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <X className="w-5 h-5 dark:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ID Corporativo</label>
                            <input
                                className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.id_corporativo}
                                onChange={e => setFormData({ ...formData, id_corporativo: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                            <select
                                className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.perfil}
                                onChange={e => setFormData({ ...formData, perfil: e.target.value })}
                            >
                                <option value="COLABORADOR">Colaborador</option>
                                <option value="DIRECTOR">Director</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                        <input
                            className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            value={formData.nombre}
                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cargo</label>
                        <input
                            className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            value={formData.job_title}
                            onChange={e => setFormData({ ...formData, job_title: e.target.value })}
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ResetPasswordDialog({ open, user, onClose }: { open: boolean, user: any, onClose: () => void }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleReset = async () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (newPassword.length < 3) {
            setError('La contraseña es muy corta');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.put(`/api/users/${user.id}`, { password: newPassword });
            onClose();
        } catch (e: any) {
            console.error(e);
            const detail = e.response?.data?.detail;
            setError(typeof detail === 'string' ? detail : 'Error al restablecer contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold mb-4 dark:text-white">Restablecer Contraseña</h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400 text-sm">Usuario: <strong>{user.nombre}</strong></p>

                <div className="space-y-3 mb-6">
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleReset} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                        {loading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        id_corporativo: '',
        nombre: '',
        email: '',
        password: '',
        perfil: 'COLABORADOR',
        job_title: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/api/auth/register', formData);
            onClose(); // This will trigger fetchUsers
        } catch (err: any) {
            console.error('Error creating user:', err);
            const detail = err.response?.data?.detail;
            setError(typeof detail === 'string' ? detail : 'Error al crear el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-lg animate-in zoom-in-95 shadow-2xl border border-slate-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Nuevo Usuario</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            ID Corporativo *
                        </label>
                        <input
                            type="text"
                            required
                            minLength={3}
                            maxLength={50}
                            value={formData.id_corporativo}
                            onChange={(e) => setFormData({ ...formData, id_corporativo: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            placeholder="admin, diana, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            placeholder="Juan Pérez"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            placeholder="usuario@mqs.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Contraseña *
                        </label>
                        <input
                            type="password"
                            required
                            minLength={3}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            placeholder="Contraseña temporal"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Cargo
                        </label>
                        <input
                            type="text"
                            value={formData.job_title}
                            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                            placeholder="Analista, Director, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Rol / Perfil *
                        </label>
                        <select
                            required
                            value={formData.perfil}
                            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        >
                            <option value="COLABORADOR">Colaborador</option>
                            <option value="DIRECTOR">Director</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PasswordChangeForm() {
    const [passData, setPassData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = async () => {
        if (passData.new_password !== passData.confirm_password) {
            setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/api/users/me/password', passData);
            setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
            setPassData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Error al actualizar contraseña' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {message.text && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}
            <input
                type="password"
                placeholder="Contraseña Actual"
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                value={passData.current_password}
                onChange={(e) => setPassData({ ...passData, current_password: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="password"
                    placeholder="Nueva Contraseña"
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={passData.new_password}
                    onChange={(e) => setPassData({ ...passData, new_password: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={passData.confirm_password}
                    onChange={(e) => setPassData({ ...passData, confirm_password: e.target.value })}
                />
            </div>
            <Button
                onClick={handlePasswordChange}
                disabled={loading}
                className="bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
            >
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Button>
        </div>
    );
}

function PinChangeForm() {
    const [pinData, setPinData] = useState({
        current_pin: '',
        new_pin: '',
        confirm_pin: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePinChange = async () => {
        if (pinData.new_pin !== pinData.confirm_pin) {
            setMessage({ type: 'error', text: 'Los nuevos PINs no coinciden' });
            return;
        }
        if (pinData.new_pin.length !== 6 || !/^\d+$/.test(pinData.new_pin)) {
            setMessage({ type: 'error', text: 'El PIN debe ser de 6 dígitos numéricos' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/api/users/me/pin', pinData);
            setMessage({ type: 'success', text: 'PIN actualizado correctamente' });
            setPinData({ current_pin: '', new_pin: '', confirm_pin: '' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Error al actualizar PIN' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {message.text && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}
            <input
                type="password"
                placeholder="PIN Actual (6 dígitos)"
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 tracking-widest text-center font-mono"
                maxLength={6}
                value={pinData.current_pin}
                onChange={(e) => setPinData({ ...pinData, current_pin: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="password"
                    placeholder="Nuevo PIN"
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 tracking-widest text-center font-mono"
                    maxLength={6}
                    value={pinData.new_pin}
                    onChange={(e) => setPinData({ ...pinData, new_pin: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Confirmar PIN"
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 tracking-widest text-center font-mono"
                    maxLength={6}
                    value={pinData.confirm_pin}
                    onChange={(e) => setPinData({ ...pinData, confirm_pin: e.target.value })}
                />
            </div>
            <Button
                onClick={handlePinChange}
                disabled={loading}
                className="bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium"
            >
                {loading ? 'Actualizando...' : 'Actualizar PIN'}
            </Button>
        </div>
    );
}
