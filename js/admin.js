// Admin Blog Frontend
const API_BASE = '';

let easyMDE = null;
let currentPosts = [];

// Check auth status
async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE}/api/auth/status`);
    const data = await response.json();
    return data.authenticated;
  } catch (err) {
    return false;
  }
}

// Show login or dashboard
async function initAdmin() {
  const isAuth = await checkAuth();
  
  if (isAuth) {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    loadPosts();
  } else {
    document.getElementById('login-view').classList.remove('hidden');
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('editor-view').classList.add('hidden');
  }
}

// Load posts list
async function loadPosts() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/posts`);
    const data = await response.json();
    currentPosts = data.posts || [];
    
    const container = document.getElementById('posts-list');
    
    if (currentPosts.length === 0) {
      container.innerHTML = '<p class="text-dark-100 text-center py-8">No hay entradas aún. Crea la primera.</p>';
      return;
    }
    
    container.innerHTML = currentPosts.map(post => {
      const statusClass = post.status === 'published' ? 'bg-lime-500/20 text-lime-400' : 'bg-dark-500/50 text-dark-100';
      const statusText = post.status === 'published' ? 'Publicado' : 'Borrador';
      const date = new Date(post.created_at).toLocaleDateString('es-MX');
      
      return `
        <div class="glass-card p-4 flex items-center justify-between">
          <div class="flex-1">
            <h3 class="font-bold text-dark-50">${post.title}</h3>
            <div class="flex items-center gap-3 mt-1 text-sm text-dark-200">
              <span class="px-2 py-0.5 rounded-full text-xs ${statusClass}">${statusText}</span>
              <span>${date}</span>
              <span class="text-dark-300">/${post.slug}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="editPost(${post.id})" class="btn-primary text-sm px-3 py-1">Editar</button>
            <button onclick="deletePost(${post.id})" class="btn-outline text-sm px-3 py-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-dark-900">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading posts:', err);
    document.getElementById('posts-list').innerHTML = '<p class="text-red-400 text-center py-8">Error al cargar entradas. ¿Estás autenticado?</p>';
  }
}

// Show editor
function showEditor(isNew = true) {
  document.getElementById('dashboard-view').classList.add('hidden');
  document.getElementById('editor-view').classList.remove('hidden');
  document.getElementById('editor-title').textContent = isNew ? 'Nueva Entrada' : 'Editar Entrada';
  
  if (!easyMDE) {
    easyMDE = new EasyMDE({
      element: document.getElementById('post-content'),
      spellChecker: false,
      placeholder: 'Escribe tu contenido en Markdown...',
      toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', 'code', '|', 'preview', 'side-by-side', 'fullscreen'],
      theme: 'dark'
    });
  }
  
  if (isNew) {
    document.getElementById('post-form').reset();
    document.getElementById('post-id').value = '';
    document.getElementById('cover-image').value = '';
    document.getElementById('cover-preview').classList.add('hidden');
    easyMDE.value('');
  }
}

// Edit post
async function editPost(id) {
  try {
    const response = await fetch(`${API_BASE}/api/admin/posts/${id}`);
    const post = await response.json();
    
    document.getElementById('post-id').value = post.id;
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-slug').value = post.slug;
    document.getElementById('post-excerpt').value = post.excerpt || '';
    document.getElementById('post-tags').value = post.tags || '';
    document.getElementById('post-status').value = post.status || 'draft';
    document.getElementById('cover-image').value = post.cover_image || '';
    
    if (post.cover_image) {
      document.getElementById('cover-preview').src = post.cover_image;
      document.getElementById('cover-preview').classList.remove('hidden');
    } else {
      document.getElementById('cover-preview').classList.add('hidden');
    }
    
    showEditor(false);
    easyMDE.value(post.content_markdown);
  } catch (err) {
    console.error('Error loading post:', err);
    alert('Error al cargar la entrada');
  }
}

// Delete post
async function deletePost(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta entrada?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/posts/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadPosts();
    } else {
      alert('Error al eliminar la entrada');
    }
  } catch (err) {
    console.error('Error deleting post:', err);
    alert('Error al eliminar la entrada');
  }
}

// Generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Upload image
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.url;
  } catch (err) {
    console.error('Error uploading image:', err);
    alert('Error al subir la imagen');
    return null;
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
  
  // New post button
  document.getElementById('new-post-btn')?.addEventListener('click', () => {
    showEditor(true);
  });
  
  // Back button
  document.getElementById('back-btn')?.addEventListener('click', () => {
    document.getElementById('editor-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
  });
  
  // Logout button
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    window.location.href = '/auth/logout';
  });
  
  // Auto-generate slug
  document.getElementById('post-title')?.addEventListener('input', (e) => {
    const slugField = document.getElementById('post-slug');
    if (!slugField.value || slugField.dataset.auto === 'true') {
      slugField.value = generateSlug(e.target.value);
      slugField.dataset.auto = 'true';
    }
  });
  
  document.getElementById('post-slug')?.addEventListener('input', (e) => {
    e.target.dataset.auto = 'false';
  });
  
  // Upload button
  document.getElementById('upload-btn')?.addEventListener('click', () => {
    document.getElementById('cover-upload').click();
  });
  
  document.getElementById('cover-upload')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const url = await uploadImage(file);
    if (url) {
      document.getElementById('cover-image').value = url;
      document.getElementById('cover-preview').src = url;
      document.getElementById('cover-preview').classList.remove('hidden');
    }
  });
  
  // Form submit
  document.getElementById('post-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('post-id').value;
    const data = {
      title: document.getElementById('post-title').value,
      slug: document.getElementById('post-slug').value,
      content_markdown: easyMDE.value(),
      excerpt: document.getElementById('post-excerpt').value,
      tags: document.getElementById('post-tags').value,
      cover_image: document.getElementById('cover-image').value,
      status: document.getElementById('post-status').value
    };
    
    try {
      const url = id ? `${API_BASE}/api/admin/posts/${id}` : `${API_BASE}/api/admin/posts`;
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        document.getElementById('editor-view').classList.add('hidden');
        document.getElementById('dashboard-view').classList.remove('hidden');
        loadPosts();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar la entrada');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Error al guardar la entrada');
    }
  });
});

// Make functions available globally
window.editPost = editPost;
window.deletePost = deletePost;