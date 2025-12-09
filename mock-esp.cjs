const http = require('http');
const url = require('url');
const os = require('os');

const PORT = 3000;

// Function to get local LAN IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let cfg of iface) {
      if (cfg.family === 'IPv4' && !cfg.internal) {
        return cfg.address;
      }
    }
  }
  return '0.0.0.0';
}

const server = http.createServer((req, res) => {
  // Enable CORS for mobile + web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (pathname === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
  } else if (pathname === '/device') {

    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'success',
        message: 'Command received',
        ...query
      }));
    }, 100);

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Bind server to all network interfaces
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log(`🚀 Mock ESP32 Server running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://${ip}:${PORT}  <-- Use this IP in Mobile App`);
  console.log('Endpoints:');
  console.log('  GET /ping');
  console.log('  GET /device?name=light&state=on');
});
