# 🏗️ Configuración del Build

## Estructura de Archivos

### ✅ Archivos de Desarrollo (Source)
- **`src/`** - Código fuente TypeScript/TSX
- **`dist/`** - Archivos compilados para producción (auto-generado)

### ❌ Archivos a Evitar en `src/`
- **`*.js`** - Archivos JavaScript compilados de TypeScript
- **`*.js.map`** - Source maps generados

## 📦 Scripts de Build

### Desarrollo
```bash
npm start                 # Servidor de desarrollo
```

### Producción
```bash
npm run build            # Build completo (TypeScript + Vite)
npm run build:clean      # Build limpio (limpia + build)
```

### Limpieza
```bash
npm run clean            # Limpia dist/ y archivos JS compilados
npm run clean:src        # Solo limpia archivos JS del src/
```

## 🗂️ Estructura del Build

El build genera la siguiente estructura en `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── js/           # Archivos JavaScript
│   ├── css/          # Archivos CSS
│   ├── png/          # Imágenes PNG
│   └── jpg/          # Imágenes JPG
└── [archivos estáticos]
```

## ⚙️ Configuración Vite

### Características Principales
- **Output**: `dist/` (limpiado automáticamente)
- **Assets**: Organizados por tipo en subcarpetas
- **Source Maps**: Deshabilitados en producción
- **Code Splitting**: Automático por Rollup

### Aliases Configurados
```javascript
'api' → 'src/api'
'core' → 'src/core'
'features' → 'src/features'
'generated' → 'src/generated'
'static' → 'src/static'
```

## 🛡️ Protecciones

### .gitignore
- Evita subir archivos `.js` compilados en `src/`
- Permite archivos legítimos (`*.config.js`, scripts)
- Excluye archivos generados por herramientas

### Scripts de Limpieza
- Remueven archivos JavaScript compilados no deseados
- Preservan archivos generados por Orval y scripts

## 🚨 Problemas Comunes

### Error: "useAuth debe ser usado dentro de un AuthProvider"
**Causa**: Archivos `.js` duplicados en `src/` interfieren con imports
**Solución**: 
```bash
npm run clean:src  # Limpiar archivos JS
npm start          # Reiniciar desarrollo
```

### Build con Errores TypeScript
**Solución temporal para deploy**:
```bash
npx vite build  # Solo build sin verificación TS
```

## 📋 Checklist Pre-Deploy

- [ ] `npm run clean` ejecutado sin errores
- [ ] No hay archivos `.js` no deseados en `src/`
- [ ] `npm run build` completa exitosamente
- [ ] Estructura de `dist/` es correcta
- [ ] Assets están organizados por tipo 