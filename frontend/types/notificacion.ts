export type EstadoNotificacion = 'LEIDO' | 'NO_LEIDO';
export type EstadoLicitacion = 'CONVOCADO' | 'CONTRATADO' | 'NULO' | 'ADJUDICADO' | 'DESIERTO';

export interface Notificacion {
    id: string;
    titulo: string;
    mensaje: string;
    fecha: string; // ISO String
    estado: EstadoNotificacion;

    // Detalles de la Licitación relacionada
    licitacionId?: string;
    nomenclatura?: string;
    categoria?: 'BIENES' | 'OBRAS' | 'SERVICIOS' | 'CONSULTORIA';
    ubicacion?: string;
    monto?: number;

    // Cambio de Estado
    estadoAnterior?: EstadoLicitacion;
    estadoNuevo?: EstadoLicitacion;

    orcid?: string;
}
