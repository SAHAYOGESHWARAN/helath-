const { spawn } = require('child_process');

const services = [
  { name: 'auth', command: 'npm', args: ['run', 'start-auth'] },
  { name: 'emr', command: 'npm', args: ['run', 'start-emr'] },
  { name: 'scheduling', command: 'npm', args: ['run', 'start-scheduling'] },
  { name: 'notes', command: 'npm', args: ['run', 'start-notes'] },
  { name: 'video', command: 'npm', args: ['run', 'start-video'] },
];

services.forEach(service => {
  const child = spawn(service.command, service.args, { stdio: 'inherit', shell: true });
  child.on('error', (error) => {
    console.error(`Error starting ${service.name}:`, error);
  });
  child.on('exit', (code) => {
    console.log(`${service.name} exited with code ${code}`);
  });
});
