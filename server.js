import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const distPath = join(__dirname, 'dist');

// Serve static files from dist with aggressive caching for assets
app.use(express.static(distPath, {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}));

// Route missing assets to 404 to avoid sending index.html and creating MIME errors
app.use('/assets', (req, res) => {
    res.status(404).send('Asset not found');
});

// SPA fallback — send index.html for all unknown routes
app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Urkio server running on port ${PORT}`);
});
