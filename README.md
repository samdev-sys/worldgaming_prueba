# 🎮 WorldGaming Frontend

Una aplicación web moderna para la gestión de equipos de esports, torneos y comunidades gaming, construida con React, TypeScript y Vite.

## ✨ Características

- 🏆 **Gestión de Equipos**: Crear, unirse y gestionar equipos de esports
- 🎯 **Torneos**: Participar en torneos y competiciones
- 🎮 **Catálogo de Juegos**: Explorar y gestionar juegos soportados
- 👥 **Sistema de Usuarios**: Autenticación y perfiles de usuario
- 📊 **Dashboard**: Estadísticas y métricas en tiempo real
- 🎨 **UI Moderna**: Interfaz responsive con TailwindCSS
- 🔒 **Seguridad**: Autenticación JWT y autorización basada en roles

## 🚀 Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework de CSS
- **React Router DOM** - Enrutamiento
- **Lucide React** - Iconografía

### Estado y Datos
- **React Context API** - Gestión de estado global
- **Axios** - Cliente HTTP
- **React Query** - Cache y sincronización de datos

### Testing
- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **MSW** - Mock Service Worker

### Herramientas de Desarrollo
- **ESLint** - Linter
- **Prettier** - Formateador de código
- **Husky** - Git hooks
- **TypeScript** - Compilador

## 📋 Requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** >= 2.30.0

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/worldgaming-frontend.git
cd worldgaming-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus configuraciones:
```env
VITE_API_BASE_URL=https://localhost:7082/api
VITE_APP_NAME=WorldGaming
VITE_APP_VERSION=1.0.0
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de ESLint

# Testing
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con coverage
npm run test:ci      # Tests para CI/CD

# Calidad de código
npm run type-check   # Verificar tipos TypeScript
npm run format       # Formatear código con Prettier
npm run format:check # Verificar formato
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                          # Aplicación principal
│   ├── auth/                     # Módulo de autenticación
│   │   ├── components/           # Componentes de auth
│   │   ├── context/             # Contexto de auth
│   │   └── services/            # Servicios de auth
│   ├── equipos/                  # Módulo de equipos
│   │   ├── components/           # Componentes de equipos
│   │   ├── pages/               # Páginas de equipos
│   │   └── services/            # Servicios de equipos
│   ├── torneos/                  # Módulo de torneos
│   ├── juegos/                   # Módulo de juegos
│   └── shared/                   # Código compartido
│       ├── components/           # Componentes reutilizables
│       ├── hooks/               # Hooks personalizados
│       ├── services/            # Servicios compartidos
│       ├── types/               # Tipos TypeScript
│       ├── utils/               # Utilidades
│       └── constants/           # Constantes
├── assets/                       # Recursos estáticos
├── styles/                       # Estilos globales
└── tests/                        # Tests
```

## 🎯 Arquitectura

### Principios de Diseño
- **Componentes Funcionales**: Uso de hooks y funciones
- **Composición sobre Herencia**: Reutilización por composición
- **Separación de Responsabilidades**: Lógica separada de presentación
- **Tipado Fuerte**: TypeScript para mejor DX
- **Testing First**: Tests como parte del desarrollo

### Patrones Implementados
- **Repository Pattern**: Para servicios de datos
- **Factory Pattern**: Para creación de componentes
- **Observer Pattern**: Para hooks y contextos
- **Singleton Pattern**: Para servicios globales

## 🔧 Configuración

### TypeScript
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["src/app/shared/*"]
    }
  }
}
```

### ESLint
```javascript
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'error'
  }
};
```

## 🧪 Testing

### Estrategia de Testing
- **Unit Tests**: Componentes individuales
- **Integration Tests**: Flujos completos
- **E2E Tests**: Casos de uso críticos

### Ejecutar Tests
```bash
# Todos los tests
npm test

# Tests específicos
npm test -- --testNamePattern="Login"

# Tests con coverage
npm run test:coverage
```

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Variables de Entorno de Producción
```env
VITE_API_BASE_URL=https://api.worldgaming.com
VITE_APP_ENV=production
```

### Despliegue en Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📊 Métricas y Monitoreo

### Bundle Analysis
```bash
npm run build
npm run analyze
```

### Performance
- **Lighthouse Score**: > 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contribución

### Proceso de Contribución
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- **Conventional Commits**: Para mensajes de commit
- **ESLint**: Para calidad de código
- **Prettier**: Para formato consistente
- **TypeScript**: Para tipado fuerte
- **Tests**: Para funcionalidades nuevas

## 📝 Changelog

### v1.0.0 (2024-01-20)
- ✨ Lanzamiento inicial
- 🏆 Gestión de equipos
- 🎯 Sistema de torneos
- 🎮 Catálogo de juegos
- 👥 Autenticación de usuarios

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Documentación**: [docs.worldgaming.com](https://docs.worldgaming.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/worldgaming-frontend/issues)
- **Discord**: [Comunidad WorldGaming](https://discord.gg/worldgaming)
- **Email**: support@worldgaming.com

## 🙏 Agradecimientos

- **React Team** por la excelente biblioteca
- **Vite Team** por el build tool
- **TailwindCSS Team** por el framework de CSS
- **Comunidad Open Source** por las librerías utilizadas

---

<div align="center">
  <p>Hecho con ❤️ por el equipo de WorldGaming</p>
  <p>
    <a href="https://github.com/tu-usuario/worldgaming-frontend">⭐ Star en GitHub</a> •
    <a href="https://worldgaming.com">🌐 Sitio Web</a> •
  </p>
</div>