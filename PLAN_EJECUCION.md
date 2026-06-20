# Plan de Ejecución — Blog + Foto + Educación

## 1. Foto de perfil — `about.html`
Reemplazar el SVG placeholder por `<img src="assets/Yo.jpg" alt="Cesar Altamirano" class="w-full h-full object-cover">` dentro del div `w-64 h-64 md:w-80 md:h-80`.

## 2. Educación — Invertir orden + actualizar fecha del Diplomado
- Invertir el array `education.items` en `js/main.js` y `data/translations.json` (más reciente primero)
- Diplomado en Ciencia de Datos: periodo `"Ago 2025 — Jun 2026"` (ES) / `"Aug 2025 — Jun 2026"` (EN)
- Actualizar descripción para reflejar que fue concluido

## 3. Servidor + Base de Datos + Auth + API — `server.js`
- Express.js con better-sqlite3
- Esquema: tabla `posts` (id, title, slug, content_markdown, excerpt, cover_image, tags, status, created_at, updated_at, published_at)
- Passport.js con Google y GitHub OAuth
- API REST: GET `/api/posts`, GET `/api/posts/:slug`, GET/POST/PUT/DELETE `/api/admin/posts`
- Multer para uploads de imágenes
- `.env.example` con placeholders para OAuth keys
- `.gitignore` actualizado
- Puerto 3000

## 4. Admin — `admin.html` + `js/admin.js` + `css/blog.css`
- Login con Google/GitHub
- Dashboard: lista de posts con estado, fecha, acciones
- Editor Markdown con EasyMDE + preview
- Campos: título, slug (auto-generado), contenido, imagen de portada, tags, estado (borrador/publicado)
- Eliminar con confirmación

## 5. Blog público — `blog.html` + `post.html` + `js/blog.js`
- `blog.html`: lista paginada de posts publicados (más reciente primero)
- `post.html`: entrada individual con contenido renderizado
- Cada post: imagen de portada, título, fecha, tags, contenido

## 6. Navbar + Traducciones — Todos los HTML + `js/main.js` + `data/translations.json`
- Agregar "Blog" en nav (ES: "Blog", EN: "Blog")
- Agregar traducciones para el blog en ambos idiomas
- Actualizar todos los HTML con el enlace al blog

## 7. Reconstrucción de CSS Tailwind
