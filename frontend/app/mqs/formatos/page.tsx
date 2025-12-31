'use client';

import { useState, useEffect } from 'react';

interface Formato {
    id: number;
    nombre: string;
    nombreArchivo: string;
    nombreOriginal?: string;  // Nombre original para descarga
    tamano: number;
    extension: string;
    icon: string;
}

export default function FormatosPage() {
    const [formatos, setFormatos] = useState<Formato[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formatoToDelete, setFormatoToDelete] = useState<Formato | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [adminPin, setAdminPin] = useState('');

    useEffect(() => {
        fetchFormatos();
    }, []);

    const fetchFormatos = async () => {
        try {
            const response = await fetch('/formatos/list');
            const data = await response.json();
            setFormatos(data.formatos || []);
        } catch (error) {
            console.error('Error al cargar formatos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (nombreArchivo: string, nombreOriginal?: string) => {
        try {
            const response = await fetch(`/formatos/download/${encodeURIComponent(nombreArchivo)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en la descarga');
            }

            // Intentar obtener el nombre del archivo del header Content-Disposition
            let filename = nombreOriginal || nombreArchivo;

            const contentDisposition = response.headers.get('content-disposition');
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error al descargar:', error);
            alert(error instanceof Error ? error.message : 'Error al descargar el archivo');
        }
    };

    const openDeleteModal = (formato: Formato) => {
        setFormatoToDelete(formato);
        setAdminPin(''); // Resetear PIN al abrir
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setFormatoToDelete(null);
        setAdminPin('');
    };

    const handleDelete = async () => {
        if (!formatoToDelete) return;

        if (!adminPin) {
            alert('Por favor ingrese el PIN de administrador');
            return;
        }

        setIsDeleting(true);
        try {
            // Enviar PIN como query parameter
            const response = await fetch(`/formatos/delete/${formatoToDelete.nombreArchivo}?pin=${adminPin}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Recargar la lista de formatos
                await fetchFormatos();
                closeDeleteModal();
            } else {
                const error = await response.json();
                alert(`Error al eliminar: ${error.detail}`);
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar el archivo');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('/formatos/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Recargar la lista de formatos
                await fetchFormatos();
                setUploadModalOpen(false);
                setSelectedFile(null);
                setUploadProgress(100);
            } else {
                const error = await response.json();
                alert(`Error al subir: ${error.detail}`);
            }
        } catch (error) {
            console.error('Error al subir:', error);
            alert('Error al subir el archivo');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Formatos Descargables</h2>
                <div className="flex items-center justify-center py-24">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400 rounded-full animate-spin"></div>
                        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 font-medium">Cargando...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (<div className="space-y-8 animate-in fade-in duration-500">
        {/* Header con diseño mejorado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Formatos <span className="text-blue-600 dark:text-blue-400">Descargables</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Gestión centralizada de documentos y plantillas</p>
            </div>
            <button
                className="cursor-pointer bg-[#0F2C4A] dark:bg-blue-600 rounded-xl text-white font-semibold transition-all duration-300 ease-in-out 
                    hover:bg-[#1a4b7a] dark:hover:bg-blue-500 hover:ring-4 hover:ring-blue-100 dark:hover:ring-blue-900 hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-blue-900/30 hover:-translate-y-0.5
                    active:scale-95 px-6 py-3 flex items-center gap-3 group"
                onClick={() => setUploadModalOpen(true)}
            >
                <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
                    <i className="fas fa-upload text-sm"></i>
                </div>
                <span>Agregar Formato</span>
            </button>
        </div>

        {/* Stats Cards con diseño glass sutil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-transform hover:scale-[1.01] duration-300">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                    <i className="fas fa-file-alt text-blue-600 dark:text-blue-400 text-2xl"></i>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total de Archivos</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatos.length}</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-transform hover:scale-[1.01] duration-300">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                    <i className="fas fa-cloud-download-alt text-green-600 dark:text-green-400 text-2xl"></i>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Disponibles</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatos.length}</p>
                </div>
            </div>
        </div>

        {/* Grid de Formatos */}
        {formatos.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-dashed border-gray-300 dark:border-gray-600 p-16 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-folder-open text-xl sm:text-2xl lg:text-3xl text-gray-400 dark:text-gray-500"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No hay formatos disponibles</h3>
                <p className="text-gray-500 dark:text-gray-400">Sube un nuevo archivo para comenzar</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {formatos.map((formato) => (
                    <div
                        key={formato.id}
                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden hover:-translate-y-1"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-blue-50 dark:border-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                                    <i className={`fas ${formato.icon} text-xl sm:text-2xl lg:text-3xl text-blue-600 dark:text-blue-400`}></i>
                                </div>
                                <span className="text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full uppercase border border-blue-100 dark:border-blue-800">
                                    {formato.extension.toUpperCase().replace('.', '')}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg line-clamp-2 leading-snug min-h-[3.5rem]">
                                {formato.nombre}
                            </h3>

                            <div className="flex items-center text-sm text-gray-400 mb-6 bg-gray-50 dark:bg-gray-700/50 w-fit px-3 py-1 rounded-lg">
                                <i className="fas fa-hdd mr-2 text-gray-400"></i>
                                {formatFileSize(formato.tamano)}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleDownload(formato.nombreArchivo, formato.nombreOriginal || formato.nombreArchivo)}
                                    className="cursor-pointer bg-[#0F2C4A] dark:bg-blue-600 rounded-xl text-white font-semibold transition-all duration-300 
                                        hover:bg-[#1a4b7a] dark:hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 py-2.5 px-4 flex items-center justify-center gap-2 text-sm"
                                >
                                    <i className="fas fa-download"></i>
                                    <span className="hidden xl:inline">Descargar</span>
                                </button>
                                <button
                                    onClick={() => openDeleteModal(formato)}
                                    className="cursor-pointer bg-red-600 rounded-xl text-white font-semibold transition-all duration-300 
                                        hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 active:scale-95 py-2.5 px-4 flex items-center justify-center gap-2 text-sm"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                    <span className="hidden xl:inline">Eliminar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Modal de Confirmación de Eliminación (Rediseñado) */}
        {deleteModalOpen && formatoToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop con blur */}
                <div
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300"
                    onClick={closeDeleteModal}
                ></div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
                    {/* Header Danger Gradient */}
                    <div className="bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 px-6 py-4 border-b border-red-50 dark:border-red-900/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center shadow-sm">
                                <i className="fas fa-exclamation-triangle text-red-500 dark:text-red-400 text-lg"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar Eliminación</h3>
                        </div>
                        <button
                            onClick={closeDeleteModal}
                            className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="p-8">
                        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 sm:mb-8 leading-relaxed">
                            Esta acción eliminará permanentemente el archivo <br />
                            <span className="font-semibold text-gray-900 dark:text-white">"{formatoToDelete.nombre}"</span>.<br />
                            <span className="text-red-500 dark:text-red-400 text-sm mt-1 block">Esta acción no se puede deshacer.</span>
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-600 mb-6">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 text-center">
                                PIN de Seguridad
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-shield-alt text-gray-400 dark:text-gray-500"></i>
                                </div>
                                <input
                                    type="password"
                                    value={adminPin}
                                    onChange={(e) => setAdminPin(e.target.value)}
                                    placeholder="••••••"
                                    maxLength={6}
                                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-center text-lg tracking-[0.5em] font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 focus:border-red-400 transition-all outline-none placeholder:tracking-normal placeholder:font-normal"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting || adminPin.length < 4}
                                className="cursor-pointer bg-red-700 rounded-xl text-white font-bold text-lg transition-all duration-300 
                                    hover:bg-red-800 hover:ring-4 hover:ring-red-200 hover:shadow-xl hover:shadow-red-700/30 active:scale-95 py-3.5 w-full
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin"></i>
                                        Eliminando...
                                    </>
                                ) : (
                                    "Sí, Eliminar Archivo"
                                )}
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="text-gray-500 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-white py-2 transition-colors"
                            >
                                Cancelar operación
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Modal de Carga de Archivos (Rediseñado) */}
        {uploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop con blur */}
                <div
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => { setUploadModalOpen(false); setSelectedFile(null); }}
                ></div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
                    {/* Header Brand Gradient */}
                    <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-5 border-b border-blue-50 dark:border-blue-900/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#0F2C4A] dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 text-white">
                                <i className="fas fa-cloud-upload-alt text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Subir Formato</h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Agregar nuevo documento</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setUploadModalOpen(false); setSelectedFile(null); }}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="p-8">
                        <div className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 ${selectedFile
                            ? 'border-green-400 bg-green-50/30 dark:bg-green-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-[#0F2C4A] dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                            }`}>
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                accept=".docx,.pdf,.xlsx,.pptx,.txt,.zip"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploading}
                            />

                            {selectedFile ? (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fas fa-check text-2xl"></i>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">{selectedFile.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                        className="mt-4 text-red-700 hover:text-red-900 text-sm font-medium flex items-center justify-center gap-1 mx-auto z-20 relative"
                                    >
                                        <i className="fas fa-trash-alt"></i> Eliminar selección
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fas fa-cloud-upload-alt text-2xl"></i>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-white text-lg mb-2">Arrastra o selecciona un archivo</p>
                                    <p className="text-gray-400 text-sm mb-4">Soporta: DOCX, PDF, XLSX, PPTX, ZIP</p>
                                    <span className="inline-block bg-[#0F2C4A] text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        Explorar archivos
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => { setUploadModalOpen(false); setSelectedFile(null); }}
                                className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className="flex-[2] cursor-pointer bg-[#0F2C4A] dark:bg-blue-600 rounded-xl text-white font-bold transition-all duration-300 
                                    hover:bg-[#1a4b7a] dark:hover:bg-blue-500 hover:ring-4 hover:ring-blue-100 dark:hover:ring-blue-900 hover:shadow-xl hover:shadow-blue-900/20 active:scale-95 py-3.5
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Subiendo...
                                    </>
                                ) : (
                                    <>
                                        <span>Subir Archivo</span>
                                        <i className="fas fa-arrow-right"></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}
