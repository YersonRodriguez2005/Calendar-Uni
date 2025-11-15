# CalendarTask Manager

Aplicación web desarrollada con **React + Vite + TailwindCSS**, diseñada
para gestionar actividades académicas mediante un calendario
interactivo. Permite registrar actividades, evaluaciones, cuestionarios
y foros, visualizarlos por fecha y gestionar su estado.

## 🚀 Características principales

-   **Calendario interactivo** como pantalla principal.\
-   Registro de:
    -   Actividades
    -   Evaluaciones
    -   Cuestionarios
    -   Foros\
-   **Distinción visual** por tipo de elemento (colores/etiquetas).\
-   **Modal de detalle** para ver la información completa.\
-   **Editar y eliminar registros**.\
-   **Marcar actividades como hechas** (tareas completadas).\
-   **Persistencia local** mediante `localStorage`.\
-   Vista secundaria con **listado general**.\
-   **Filtros por tipo**.\
-   UI responsiva con Tailwind.

## 📂 Estructura del proyecto

    src/
     ├── components/
     │    ├── Calendar.jsx
     │    ├── TaskForm.jsx
     │    ├── TaskList.jsx
     │    ├── TaskModal.jsx
     │    └── Filters.jsx
     ├── hooks/
     │    └── useLocalStorage.js
     ├── context/
     │    └── TaskContext.jsx
     ├── pages/
     │    └── Home.jsx
     ├── utils/
     │    └── dateUtils.js
     ├── App.jsx
     └── main.jsx

## 🧠 Funcionalidades clave

### ✓ Registrar elemento

Cada registro contiene: - Título\
- Descripción\
- Tipo (Actividad / Evaluación / Cuestionario / Foro)\
- Fecha inicio\
- Fecha límite

### ✓ Calendario dinámico

Los elementos aparecen en sus fechas asignadas con diferenciación visual
por tipo.

### ✓ Ver detalle

Al hacer clic sobre un elemento, se abre un modal con su información
completa.

### ✓ Marcar como hecho

Las actividades pueden ser marcadas como completadas, cambiando su
estilo visual.

### ✓ Persistencia local

Todos los datos se almacenan automáticamente en `localStorage`,
permitiendo mantener la información después de cerrar el navegador.

### ✓ Filtros

Filtros por tipo de elemento para mejorar la visualización.

## 🛠 Tecnologías usadas

-   **React**
-   **Vite**
-   **Tailwind CSS**
-   **localStorage API**
-   **React Context API**

## 📦 Instalación

``` bash
git clone https://github.com/usuario/CalendarTask-Manager.git
cd CalendarTask-Manager
npm install
npm run dev
```

## 🧪 Scripts

-   `npm run dev` → entorno de desarrollo\
-   `npm run build` → build de producción\
-   `npm run preview` → vista previa del build

## 📝 Licencia

Proyecto de uso libre para fines educativos o personales.

------------------------------------------------------------------------

## ✨ Autor

Desarrollado por **\[Tu Nombre\]**, con enfoque académico y
organizacional.
