import fs from 'node:fs';
import path from 'node:path';

const htmlPath = path.resolve('dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// crossorigin on type="module" causes CORS error on file://, blocking script execution
html = html.replace('<script type="module" crossorigin>', '<script type="module">');

// Remove SW registration (not supported on file://)
html = html.replace(
  `<script>\n      if ('serviceWorker' in navigator) {\n        navigator.serviceWorker.register('/sw.js');\n      }\n    </script>`,
  ''
);

fs.writeFileSync(htmlPath, html);
console.log('Fixed for file:// protocol');
