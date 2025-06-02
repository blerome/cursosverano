# 🔐 Estrategia de Autenticación Dual

## 📋 Resumen

Se implementó un sistema de autenticación dual que maneja dos tipos de usuarios:
- **Estudiantes**: Autenticación vía Microsoft Azure AD (MSAL)
- **Personal (Admin/Maestros)**: Autenticación por sesión tradicional (email/contraseña)

## 🏗️ Arquitectura

### Endpoints de API

#### Estudiantes
- `GET /auth/student/profile` - Perfil del estudiante autenticado
- Requiere token de Microsoft Azure AD

#### Personal
- `POST /auth/staff/login` - Login de personal
- `GET /auth/staff/profile` - Perfil del personal autenticado
- Requiere token de sesión tradicional

### Flujo de Autenticación

```mermaid
graph TD
    A[Usuario accede] --> B{Tipo de usuario}
    B -->|Estudiante| C[Microsoft Login]
    B -->|Personal| D[Staff Login Form]
    
    C --> E[MSAL Token]
    D --> F[Session Token]
    
    E --> G[/auth/student/profile]
    F --> H[/auth/staff/profile]
    
    G --> I[PrivateRoute - Estudiantes]
    H --> J[AdminRoute - Personal]
```

## 🔧 Componentes Principales

### 1. Contexto de Autenticación (`AuthContext`)
- Detecta automáticamente el tipo de usuario
- Maneja estado unificado de autenticación
- Proporciona métodos de logout específicos

### 2. Configuración de Axios
- Interceptors inteligentes que detectan rutas
- Autenticación automática basada en el endpoint
- Manejo de expiración de tokens

### 3. Rutas Protegidas

#### PrivateRoute
- Solo para estudiantes autenticados vía Microsoft
- Incluye layout específico para estudiantes

#### AdminRoute  
- Solo para personal autenticado vía sesión
- Validación de roles (admin/maestro)

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── auth.types.ts              # Tipos de autenticación
├── contexts/
│   └── AuthContext.tsx            # Contexto unificado
├── components/
│   ├── auth/
│   │   ├── StaffLogin.tsx         # Login de personal
│   │   └── StaffLogin.module.css
│   └── privateroutes/
│       ├── PrivateRoute.tsx       # Rutas estudiantes
│       └── AdminRoute.tsx         # Rutas personal
├── pages/
│   └── staff/
│       ├── StaffProfile.tsx       # Perfil de personal
│       └── StaffProfile.module.css
├── api/
│   └── http/
│       ├── axios.config.ts        # Configuración dual
│       └── axios.mutator.ts       # Mutator con tipos
└── generated/
    └── api/
        └── auth/
            └── auth.ts             # Hooks generados
```

## 🛣️ Rutas del Sistema

### Públicas
- `/` - Homepage
- `/staff/login` - Login de personal

### Estudiantes (requiere Microsoft Auth)
- `/profile` - Perfil estudiante
- `/classes` - Clases disponibles
- `/create-class` - Crear curso
- `/my-courses` - Mis cursos

### Personal (requiere Session Auth)
- `/staff/profile` - Perfil de personal
- `/admin/dashboard` - Panel administrativo (solo admin)

## 🔄 Flujo de Detección Automática

1. **Al cargar la app**: `AuthProvider` detecta tipo de usuario
2. **LocalStorage**: Verifica sesión de staff guardada
3. **MSAL**: Verifica cuentas de Microsoft activas
4. **Prioridad**: Si ambas existen, prioriza staff
5. **Endpoints**: Axios enruta automáticamente según URL

## 💡 Beneficios

### ✅ Ventajas
- **Separación clara** de responsabilidades
- **Autenticación automática** sin intervención manual
- **Escalabilidad** para diferentes tipos de usuarios
- **Seguridad** con tokens específicos por tipo
- **UX consistente** con detección automática

### 🔧 Configuración
- **Zero-config** para usuarios finales
- **Flexible** para desarrollo y producción
- **Mantenible** con código organizado

## 🎯 Impacto en Componentes Existentes

### ✅ Sin Cambios Requeridos
- `ClassesPage`
- `CreateClassPage` 
- `MyCoursesPage`
- Componentes de filtros
- Hooks personalizados

### 🔄 Actualizados
- `Profile.tsx` - Usa contexto unificado
- `AdminDashboard.tsx` - Usa contexto para logout
- `MenuPrincipal.tsx` - Detecta tipo de usuario
- `PrivateLayout.tsx` - Integración con contexto

## 🚀 Implementación

### Para Estudiantes
```typescript
const { userType, user, isAuthenticated } = useAuth();

// user.type === 'student'
// user.studentData contiene info del estudiante
```

### Para Personal
```typescript
const { userType, user, isAuthenticated } = useAuth();

// user.type === 'staff'
// user.role === 'admin' | 'teacher'
```

### Logout Universal
```typescript
const { logout } = useAuth();

// Se ejecuta logout apropiado automáticamente
logout();
```

## 🔧 Mantenimiento

### Regeneración de API
```bash
npm run generate-api
```

### Agregar Nuevos Endpoints
1. Actualizar OpenAPI spec
2. Regenerar API
3. Los interceptors manejan autenticación automáticamente

### Debugging
- `DiagnosticPage` incluye información de autenticación
- Console logs en desarrollo para detección de tipo
- Manejo de errores específico por tipo de auth

---

Esta implementación proporciona una base sólida y escalable para manejar múltiples tipos de autenticación en el sistema de cursos de verano de IT Cancún. 