// Blog Frontend
const API_BASE = '';

let currentPage = 1;
let totalPages = 1;

async function loadBlogPosts(page = 1) {
  const container = document.getElementById('blog-posts');
  const pagination = document.getElementById('pagination');

  if (!container) return;

  try {
    const response = await fetch(`${API_BASE}/api/posts?page=${page}&limit=10`);
    const data = await response.json();

    currentPage = data.pagination.page;
    totalPages = data.pagination.pages;

    if (data.posts.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16">
          <p class="text-dark-100 text-lg">No hay entradas publicadas aún.</p>
        </div>
      `;
      pagination.innerHTML = '';
      return;
    }

    container.innerHTML = data.posts.map(post => {
      const date = new Date(post.published_at).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : [];
      
      return `
        <article class="glass-card-hover overflow-hidden">
          ${post.cover_image ? `<div class="h-48 overflow-hidden"><img src="${post.cover_image}" alt="${post.title}" class="w-full h-full object-cover"></div>` : ''}
          <div class="p-6">
            <div class="flex flex-wrap gap-2 mb-3">
              ${tags.map(tag => `<span class="text-xs px-2 py-1 bg-lime-500/10 text-lime-400 rounded-full border border-lime-500/20">${tag}</span>`).join('')}
            </div>
            <h2 class="text-xl font-bold text-dark-50 mb-2 hover:text-lime-400 transition-colors">
              <a href="post.html?slug=${post.slug}">${post.title}</a>
            </h2>
            <p class="text-dark-100 text-sm mb-4">${post.excerpt || ''}</p>
            <div class="flex items-center justify-between text-sm text-dark-200">
              <span>${date}</span>
              <a href="post.html?slug=${post.slug}" class="text-lime-400 hover:text-lime-500 transition-colors">Leer más →</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Pagination
    if (totalPages > 1) {
      let paginationHTML = '';
      if (currentPage > 1) {
        paginationHTML += `<button onclick="loadBlogPosts(${currentPage - 1})" class="btn-outline text-sm">← Anterior</button>`;
      }
      paginationHTML += `<span class="text-dark-100">Página ${currentPage} de ${totalPages}</span>`;
      if (currentPage < totalPages) {
        paginationHTML += `<button onclick="loadBlogPosts(${currentPage + 1})" class="btn-outline text-sm">Siguiente →</button>`;
      }
      pagination.innerHTML = paginationHTML;
    } else {
      pagination.innerHTML = '';
    }
  } catch (err) {
    console.error('Error loading blog posts:', err);
    container.innerHTML = `
      <div class="text-center py-16">
        <p class="text-dark-100 text-lg">Error al cargar las entradas.</p>
      </div>
    `;
  }
}

async function loadPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  const container = document.getElementById('post-content');

  if (!slug || !container) {
    container.innerHTML = `
      <div class="text-center py-16">
        <p class="text-dark-100 text-lg">Entrada no encontrada.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/posts/${slug}`);
    
    if (!response.ok) {
      throw new Error('Post not found');
    }

    const post = await response.json();
    const date = new Date(post.published_at).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : [];
    
    // Convert markdown to HTML
    const contentHTML = typeof marked !== 'undefined' ? marked.parse(post.content_markdown) : post.content_markdown;
    
    document.title = `${post.title} | Blog | Cesar Altamirano`;
    
    container.innerHTML = `
      <article>
        ${post.cover_image ? `<div class="mb-8 rounded-2xl overflow-hidden"><img src="${post.cover_image}" alt="${post.title}" class="w-full h-64 md:h-80 object-cover"></div>` : ''}
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${tags.map(tag => `<span class="text-xs px-2 py-1 bg-lime-500/10 text-lime-400 rounded-full border border-lime-500/20">${tag}</span>`).join('')}
        </div>
        
        <h1 class="text-3xl md:text-4xl font-bold text-dark-50 mb-4">${post.title}</h1>
        
        <div class="flex items-center gap-4 text-sm text-dark-200 mb-8">
          <span>${date}</span>
        </div>
        
        <div class="prose prose-invert prose-lime max-w-none blog-content">
          ${contentHTML}
        </div>
      </article>
    `;
  } catch (err) {
    console.error('Error loading post:', err);
    container.innerHTML = `
      <div class="text-center py-16">
        <p class="text-dark-100 text-lg">Entrada no encontrada o error al cargar.</p>
      </div>
    `;
  }
}

// Initialize blog if on blog page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('blog-posts')) {
    loadBlogPosts();
  }
});