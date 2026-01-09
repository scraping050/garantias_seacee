# Auditoría Completa: Auto-Logout y Timeouts

## Objetivo
Verificar que NO exista ningún mecanismo que cierre la sesión automáticamente.

## Archivos a Revisar

### Frontend
1. ✅ `contexts/settings-context.tsx` - Auto-logout principal
2. ⏳ `contexts/auth-context.tsx` - Contexto de autenticación
3. ⏳ `lib/api.ts` - Cliente HTTP (posibles interceptores)
4. ⏳ Cualquier middleware o guards de autenticación

### Backend
1. ⏳ Configuración de sesiones en FastAPI
2. ⏳ Tokens JWT (si existen) - tiempo de expiración
3. ⏳ Middleware de autenticación

## Hallazgos

### 1. Frontend - Auto-Logout
- **Archivo**: `contexts/settings-context.tsx`
- **Estado**: ✅ DESACTIVADO
- **Valor**: `autoLogout: 'never'` (línea 45)
- **Verificación**: El código verifica `if (settings.security.autoLogout === 'never' || !user) return;` (línea 110)
- **Conclusión**: NO se ejecutará el auto-logout

### 2. Pendiente de verificar...
