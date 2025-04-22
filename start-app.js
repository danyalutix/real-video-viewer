
const concurrently = require('concurrently');
const path = require('path');

// Colors for the different processes
const colors = ['blue', 'magenta'];

// Run the backend and frontend concurrently
concurrently([
  { 
    command: 'npm start', 
    name: 'backend', 
    cwd: path.join(__dirname, 'server'),
    prefixColor: colors[0]
  },
  { 
    command: 'npm run dev', 
    name: 'frontend', 
    cwd: __dirname,
    prefixColor: colors[1]
  }
], {
  prefix: 'name',
  timestampFormat: 'HH:mm:ss',
  killOthers: ['failure', 'success'],
}).then(
  () => console.log('All processes exited successfully'),
  (error) => console.error('One or more processes failed', error)
);
