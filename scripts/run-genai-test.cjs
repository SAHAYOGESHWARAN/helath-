const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.resolve(__dirname, '..', 'server-genai.cjs');
console.log('Starting GenAI server from', serverPath);

const child = spawn(process.execPath, [serverPath], { cwd: path.resolve(__dirname, '..'), stdio: ['ignore', 'pipe', 'pipe'] });
child.stdout.on('data', (d) => process.stdout.write('[server] ' + d.toString()));
child.stderr.on('data', (d) => process.stderr.write('[server-err] ' + d.toString()));
child.on('exit', (code, sig) => console.log('Server process exited with', code, sig));

// Wait a bit for server to start, then test the mock endpoint
setTimeout(() => {
  const http = require('http');
  const req = http.request({
    hostname: '127.0.0.1',
    port: 4000,
    path: '/api/genai-mock',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer testtoken' }
  }, res => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => {
      console.log('RESPONSE', b);
      child.kill();
      process.exit(0);
    });
  });
  req.on('error', (e) => {
    console.error('ERR', e);
    child.kill();
    process.exit(1);
  });
  req.write(JSON.stringify({ prompt: 'hello world' }));
  req.end();
}, 800);
