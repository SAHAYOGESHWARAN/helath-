#!/usr/bin/env node
/**
 * Start all services concurrently for the Tangerine Health Application (CommonJS)
 * Usage: node start-all-services.cjs
 */

const { spawn } = require('child_process');

const services = [
  {
    name: 'Frontend (Vite)',
    cmd: 'npm',
    args: ['run', 'dev'],
    port: process.env.FRONTEND_PORT || 3000,
  },
  {
    name: 'GenAI Server',
    cmd: 'npm',
    args: ['run', 'genai-server'],
    port: process.env.GENAI_PORT || 4000,
  },
  {
    name: 'Auth Microservice',
    cmd: 'npm',
    args: ['run', 'start-auth'],
    port: process.env.AUTH_SERVICE_PORT || 4005,
  },
  {
    name: 'EMR Microservice',
    cmd: 'npm',
    args: ['run', 'start-emr'],
    port: process.env.EMR_SERVICE_PORT || 4001,
  },
  {
    name: 'Scheduling Microservice',
    cmd: 'npm',
    args: ['run', 'start-scheduling'],
    port: process.env.SCHEDULING_SERVICE_PORT || 4002,
  },
  {
    name: 'Notes Microservice',
    cmd: 'npm',
    args: ['run', 'start-notes'],
    port: process.env.NOTES_SERVICE_PORT || 4003,
  },
  {
    name: 'Video Microservice',
    cmd: 'npm',
    args: ['run', 'start-video'],
    port: process.env.VIDEO_SERVICE_PORT || 4004,
  },
  {
    name: 'WebSocket Server',
    cmd: 'npm',
    args: ['run', 'server-websocket'],
    port: process.env.WEBSOCKET_SERVICE_PORT || 8080,
  },
];

console.log('🚀 Starting Tangerine Health Application...\n');

const processes = [];

services.forEach((service, index) => {
  setTimeout(() => {
    console.log(`⏳ Starting ${service.name} (port ${service.port})...`);

    const child = spawn(service.cmd, service.args, {
      cwd: process.cwd(),
      stdio: ['ignore', 'inherit', 'inherit'],
      shell: true,
    });

    child.on('error', (error) => {
      console.error(`❌ Error starting ${service.name}:`, error.message);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ ${service.name} exited with code ${code}`);
      }
    });

    processes.push({ name: service.name, process: child });
    console.log(`✅ ${service.name} started`);
  }, index * 2000); // Stagger startup
});

console.log('\n✨ All services scheduled to start!');
console.log('\n📋 Service URLs:');
console.log('   Frontend:        http://localhost:3000');
console.log('   GenAI API:       http://localhost:4000/api');
console.log('   Auth API:        http://localhost:4005/api');
console.log('   EMR API:         http://localhost:4001/api');
console.log('   Scheduling API:  http://localhost:4002/api');
console.log('   Notes API:       http://localhost:4003/api');
console.log('   Video API:       http://localhost:4004/api');
console.log('   WebSocket:       ws://localhost:8080');
console.log('\n💡 Tip: Stop all processes with Ctrl+C\n');

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping all services...');
  processes.forEach((p) => {
    p.process.kill();
  });
  process.exit(0);
});
