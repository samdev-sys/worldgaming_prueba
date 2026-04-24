import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import { IFieldConfig } from '../../shared/interface/IFieldConfig';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { createUser, getUserById, updateUser } from '../../configuracion/service/configuracionService';

const UsuarioForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formValues, setFormValues] = useState({
        Nombre: '',
        Apellidos: '',
        Correo: '',
        Telefono: '',
        Password: '',
        Rol: '2'
    });
    const { entidadId } = useParams<{ entidadId?: string }>();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const RolTipo = ["Admin", "Supervisor", "Usuario", "Analista"];

    function obtenerIndiceRol(rol: string): string {
        const idx = RolTipo.findIndex(r => r.toLowerCase() === rol.toLowerCase());
        return idx !== -1 ? String(idx) : "2";
    }

    const fields: IFieldConfig[] = [
        { name: 'Nombre', label: 'Nombre', type: 'text', required: true, colSpan: 1, maxLength: 20 },
        { name: 'Apellidos', label: 'Apellidos', type: 'text', required: true, colSpan: 1 },
        { name: 'Correo', label: 'Correo Electrónico', type: 'email', required: true, colSpan: 2 },
        { name: 'Telefono', label: 'Teléfono', type: 'number', required: true, colSpan: 1 },
        { name: 'Rol', label: 'Rol', type: 'select', required: true, colSpan: 1, options: [
            { value: '0', label: 'Administrador' },
            { value: '1', label: 'Supervisor' },
            { value: '2', label: 'Usuario' },
            { value: '3', label: 'Analista' }
        ]},
        { name: 'Password', label: 'Contraseña', type: 'password', colSpan: 2, minLength: 6, maxLength: 30, required: !isEditMode },
    ];

    React.useEffect(() => {
        if (entidadId) {
            setIsEditMode(true);
            setIsLoading(true);
            getUserById(entidadId)
                .then((user) => {
                    if (user) {
                        setFormValues({
                            Nombre: user.data.nombre || '',
                            Apellidos: user.data.apellidos || '',
                            Correo: user.data.correo || '',
                            Telefono: user.data.telefono || '',
                            Password: '',
                            Rol: user.data.rol ? obtenerIndiceRol(user.data.rol) : '2',
                        });
                    } else {
                        addNotification('Usuario no encontrado.', 'error');
                        navigate('/configuracion/usuarios');
                    }
                })
                .catch(() => {
                    addNotification('Error al cargar el usuario.', 'error');
                    navigate('/configuracion/usuarios');
                })
                .finally(() => setIsLoading(false));
        }
    }, [entidadId]);

    const handleSubmit = async (values: Record<string, any>) => {
        setIsLoading(true);
        try {
            // Definir userData y la función a usar
            const userData = {
                ...values,
                ...(isEditMode && entidadId ? { entidadId } : {})
            };
            const userFn = (isEditMode && entidadId) ? updateUser : createUser;
            const response = await userFn(userData);
            addNotification(response.message, response.success ? 'success' : 'error');
            if (response.success) {
                navigate('/configuracion/usuarios');
            }
        } catch (err: any) {
            // Manejo de errores de validación tipo RFC 9110
            if (err?.response?.data?.errors && typeof err.response.data.errors === 'object') {
                const errors = err.response.data.errors;
                Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => addNotification(msg, 'error'));
                    }
                });
            } else {
                addNotification('Error al guardar el usuario. Verifique sus datos e intente de nuevo.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            to="/configuracion/usuarios"
                            className="flex items-center gap-2 text-text-secondary hover:text-orange-primary transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            <span>Volver a Usuarios</span>
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h1>
                        <p className="text-text-secondary mt-2">{isEditMode ? 'Edita los datos del usuario' : 'Crea un nuevo usuario en el sistema'}</p>
                    </div>
                </div>

                {/* Formulario */}
                <div className="bg-card-background backdrop-blur-lg p-8 rounded-2xl border border-border">
                    {isLoading ? (
                        <div className="text-center py-8">Cargando datos del usuario...</div>
                    ) : (
                        <DynamicForm
                            fields={fields}
                            initialValues={formValues}
                            onSubmit={handleSubmit}
                            submitText={isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
                            renderSubmitButton={({ submitText }) => (
                                <div className="flex flex-col items-center gap-4 md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-orange-primary to-red-primary text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                {submitText}
                                            </div>
                                        ) : (
                                            submitText
                                        )}
                                    </button>
                                    <p className="text-sm text-text-secondary mt-4">
                                        ¿Necesitas ayuda?{' '}
                                        <Link to="/configuracion" className="font-medium text-orange-primary hover:underline">
                                            Ver configuración
                                        </Link>
                                    </p>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsuarioForm;