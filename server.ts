import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get('/api/plugins/search', async (req, res) => {
    const { query = '', category = '', limit = '20' } = req.query;
    try {
      // Modrinth API search
      const facets = [];
      if (category) {
        facets.push(`["categories:${category}"]`);
      }
      facets.push('["project_type:mod"]'); // We'll treat mods/plugins interchangeably for this mockup

      const url = new URL('https://api.modrinth.com/v2/search');
      url.searchParams.append('query', query as string);
      url.searchParams.append('limit', limit as string);
      if (facets.length > 0) {
        url.searchParams.append('facets', `[${facets.join(',')}]`);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'PluginVault/1.0.0 (as part of a coding exercise)'
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Failed to fetch plugins' });
    }
  });

  app.get('/api/plugins/:id', async (req, res) => {
    try {
      const response = await fetch(`https://api.modrinth.com/v2/project/${req.params.id}`, {
        headers: {
          'User-Agent': 'PluginVault/1.0.0'
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch plugin detail' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
