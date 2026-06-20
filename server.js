require('dotenv').config();

const express = require('express');
const Database = require('better-sqlite3');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'assets', 'blog');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// SQLite Database
const db = new Database(path.join(__dirname, 'blog.db'));

// Create tables
const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content_markdown TEXT NOT NULL,
      excerpt TEXT,
      cover_image TEXT,
      tags TEXT,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME
    )
  `);
};

createTables();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi-pagina-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, { id: profile.id, provider: 'google', displayName: profile.displayName, email: profile.emails?.[0]?.value });
  }));
}

// GitHub OAuth
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback'
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, { id: profile.id, provider: 'github', displayName: profile.displayName, username: profile.username, email: profile.emails?.[0]?.value });
  }));
}

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
};

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'cover-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/admin.html' }),
  (req, res) => {
    res.redirect('/admin.html');
  }
);

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/admin.html' }),
  (req, res) => {
    res.redirect('/admin.html');
  }
);

app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/admin.html');
  });
});

app.get('/api/auth/status', (req, res) => {
  res.json({ authenticated: req.isAuthenticated(), user: req.user || null });
});

// Public API routes
app.get('/api/posts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const stmt = db.prepare(`
    SELECT id, title, slug, excerpt, cover_image, tags, status, created_at, published_at
    FROM posts 
    WHERE status = 'published'
    ORDER BY published_at DESC
    LIMIT ? OFFSET ?
  `);

  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM posts WHERE status = 'published'`);
  const posts = stmt.all(limit, offset);
  const { total } = countStmt.get();

  res.json({
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

app.get('/api/posts/:slug', (req, res) => {
  const stmt = db.prepare(`
    SELECT id, title, slug, content_markdown, excerpt, cover_image, tags, status, created_at, published_at
    FROM posts 
    WHERE slug = ? AND status = 'published'
  `);
  const post = stmt.get(req.params.slug);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// Admin API routes
app.get('/api/admin/posts', requireAuth, (req, res) => {
  const stmt = db.prepare(`
    SELECT id, title, slug, excerpt, cover_image, tags, status, created_at, published_at, updated_at
    FROM posts 
    ORDER BY created_at DESC
  `);
  const posts = stmt.all();
  res.json({ posts });
});

app.get('/api/admin/posts/:id', requireAuth, (req, res) => {
  const stmt = db.prepare(`
    SELECT id, title, slug, content_markdown, excerpt, cover_image, tags, status, created_at, published_at, updated_at
    FROM posts 
    WHERE id = ?
  `);
  const post = stmt.get(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

app.post('/api/admin/posts', requireAuth, (req, res) => {
  const { title, slug, content_markdown, excerpt, tags, status } = req.body;

  if (!title || !slug || !content_markdown) {
    return res.status(400).json({ error: 'Title, slug, and content are required' });
  }

  const now = new Date().toISOString();
  const publishedAt = status === 'published' ? now : null;

  try {
    const stmt = db.prepare(`
      INSERT INTO posts (title, slug, content_markdown, excerpt, tags, status, created_at, updated_at, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, slug, excerpt || '', content_markdown, tags || '', status || 'draft', now, now, publishedAt);

    res.json({ id: result.lastInsertRowid, message: 'Post created' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/posts/:id', requireAuth, (req, res) => {
  const { title, slug, content_markdown, excerpt, cover_image, tags, status } = req.body;
  const id = req.params.id;

  if (!title || !slug || !content_markdown) {
    return res.status(400).json({ error: 'Title, slug, and content are required' });
  }

  const now = new Date().toISOString();
  const currentPost = db.prepare('SELECT status, published_at FROM posts WHERE id = ?').get(id);
  const publishedAt = status === 'published' && currentPost.status !== 'published' ? now : currentPost.published_at;

  try {
    const stmt = db.prepare(`
      UPDATE posts 
      SET title = ?, slug = ?, content_markdown = ?, excerpt = ?, cover_image = ?, tags = ?, status = ?, updated_at = ?, published_at = ?
      WHERE id = ?
    `);
    stmt.run(title, slug, content_markdown, excerpt || '', cover_image || '', tags || '', status || 'draft', now, publishedAt, id);

    res.json({ message: 'Post updated' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/posts/:id', requireAuth, (req, res) => {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  stmt.run(req.params.id);
  res.json({ message: 'Post deleted' });
});

app.post('/api/admin/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const relativePath = '/assets/blog/' + req.file.filename;
  res.json({ url: relativePath, filename: req.file.filename });
});

// Static files
app.use(express.static(__dirname));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Blog admin: http://localhost:${PORT}/admin.html`);
  console.log(`Blog: http://localhost:${PORT}/blog.html`);
});

module.exports = { app, db };