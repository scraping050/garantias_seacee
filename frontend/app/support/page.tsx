'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderActions } from '@/components/layout/header-actions';
import { HelpCircle, Mail, FileText, ChevronDown, ChevronUp, Send, Download, Phone, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';

import { useAuthProtection } from '@/hooks/use-auth-protection';

export default function SupportPage() {
    const { isAuthenticated, loading: authLoading } = useAuthProtection();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('tickets');
    const [loading, setLoading] = useState(false);

    if (authLoading || !isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            {/* Header */}
            <div className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <i className="fas fa-arrow-left text-slate-600 dark:text-slate-300"></i>
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Centro de Ayuda</h1>
                </div>
                <HeaderActions />
            </div>

            <div className="max-w-7xl mx-auto p-8 space-y-8">
                {/* Hero Section */}
                <div className="text-center py-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">¿Cómo podemos ayudarte hoy?</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Encuentra respuestas rápidas, guías detalladas o contacta directamente con nuestro equipo de soporte especializado.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: FAQ & Resources */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* FAQ Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-6">
                                <HelpCircle className="text-blue-600 dark:text-blue-400" size={24} />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Preguntas Frecuentes</h3>
                            </div>
                            <div className="space-y-4">
                                <FAQItem
                                    question="¿Cómo recupero mi contraseña?"
                                    answer="Puedes restablecer tu contraseña desde la pantalla de inicio de sesión haciendo clic en '¿Olvidaste tu contraseña?'. Recibirás un correo con las instrucciones."
                                />
                                <FAQItem
                                    question="¿Cómo exporto un reporte de garantías?"
                                    answer="Dirígete al módulo de Reportes, selecciona el rango de fechas y los filtros deseados, y haz clic en el botón 'Exportar a Excel' en la esquina superior derecha."
                                />
                                <FAQItem
                                    question="¿Qué hago si falla la carga de un archivo?"
                                    answer="Verifica que el archivo no supere los 10MB y esté en un formato permitido (PDF, JPG, PNG). Si el problema persiste, intenta limpiar la caché de tu navegador."
                                />
                                <FAQItem
                                    question="¿Cómo actualizo mi firma digital?"
                                    answer="Ve a tu Perfil > Información Personal. En la sección de 'Identidad Digital', haz clic en el área de la firma para subir una nueva imagen."
                                />
                                <FAQItem
                                    question="¿Puedo acceder desde mi celular?"
                                    answer="Sí, la plataforma es totalmente responsiva y puedes acceder desde cualquier navegador móvil moderno."
                                />
                            </div>
                        </div>

                        {/* Resources Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="text-purple-600 dark:text-purple-400" size={24} />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recursos y Documentación</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ResourceCard
                                    title="Manual de Usuario"
                                    description="Guía completa de uso del sistema v1.2.0"
                                    size="2.4 MB"
                                    type="PDF"
                                />
                                <ResourceCard
                                    title="Guía de Seguridad"
                                    description="Mejores prácticas para proteger tu cuenta"
                                    size="1.1 MB"
                                    type="PDF"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact */}
                    <div className="space-y-8">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <Mail className="text-green-600 dark:text-green-400" size={24} />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contáctanos</h3>
                            </div>
                            <ContactForm />
                        </div>

                        {/* Direct Contact Info */}
                        <div className="bg-blue-600 rounded-2xl p-8 shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-4">¿Necesitas ayuda urgente?</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-100">Correo Electrónico</p>
                                        <p className="font-medium">soporte@mqs.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-100">Línea Telefónica</p>
                                        <p className="font-medium">+51 1 234 5678</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-100">WhatsApp</p>
                                        <p className="font-medium">+51 999 888 777</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <span className="font-medium text-slate-800 dark:text-white">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-2">
                    {answer}
                </div>
            )}
        </div>
    );
}

function ResourceCard({ title, description, size, type }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all group cursor-pointer bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-red-500 shadow-sm">
                    <FileText size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="block text-xs font-bold text-slate-400">{type}</span>
                <span className="block text-xs text-slate-400">{size}</span>
            </div>
        </div>
    );
}

function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [formData, setFormData] = useState({
        subject: 'Duda sobre el sistema',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/support/contact', formData);
            setSent(true);
            setFormData({ ...formData, message: '' }); // Reset message
            setTimeout(() => setSent(false), 3000);
        } catch (error) {
            console.error('Error sending message:', error);
            // Optionally handle error state here
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center py-12 animate-in zoom-in">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                    <Send size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¡Mensaje Enviado!</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Hemos recibido tu solicitud. Te responderemos a la brevedad posible.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Asunto</label>
                <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-800 dark:text-white"
                >
                    <option>Reportar un error técnico</option>
                    <option>Duda sobre el sistema</option>
                    <option>Sugerencia de mejora</option>
                    <option>Problema de facturación</option>
                    <option>Otro</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mensaje</label>
                <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe tu problema o consulta..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400 resize-none"
                ></textarea>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
                {loading ? <span className="animate-spin">⏳</span> : <Send size={18} />}
                Enviar Mensaje
            </button>
        </form>
    );
}
