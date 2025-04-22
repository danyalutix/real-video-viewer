
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Check if server dependencies are installed
const serverPackageJsonPath = path.join(__dirname, 'server', 'package.json');
const serverNodeModulesPath = path.join(__dirname, 'server', 'node_modules');

if (!fs.existsSync(serverNodeModulesPath)) {
  console.log(`${colors.yellow}Installing server dependencies...${colors.reset}`);
  
  const install = spawn('npm', ['install'], { 
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    shell: true
  });
  
  install.on('close', code => {
    if (code !== 0) {
      console.error(`${colors.red}Failed to install server dependencies${colors.reset}`);
      process.exit(1);
    }
    startApplications();
  });
} else {
  startApplications();
}

function startApplications() {
  // Start the server
  const server = spawn('npm', ['start'], { 
    cwd: path.join(__dirname, 'server'),
    shell: true
  });

  // Start the client
  const client = spawn('npm', ['run', 'dev'], { 
    cwd: __dirname,
    shell: true
  });

  console.log(`${colors.bright}${colors.green}Starting VideoHub application...${colors.reset}`);
  console.log(`${colors.cyan}Backend server running on http://localhost:5000${colors.reset}`);
  console.log(`${colors.magenta}Frontend application running on http://localhost:8080${colors.reset}`);
  console.log(`${colors.dim}Press Ctrl+C to stop all processes${colors.reset}`);

  // Handle server output
  server.stdout.on('data', data => {
    console.log(`${colors.cyan}[Server] ${colors.reset}${data}`);
  });

  server.stderr.on('data', data => {
    console.error(`${colors.red}[Server Error] ${colors.reset}${data}`);
  });

  // Handle client output
  client.stdout.on('data', data => {
    console.log(`${colors.magenta}[Client] ${colors.reset}${data}`);
  });

  client.stderr.on('data', data => {
    console.error(`${colors.red}[Client Error] ${colors.reset}${data}`);
  });

  // Handle process exit
  server.on('close', code => {
    console.log(`${colors.cyan}Server process exited with code ${code}${colors.reset}`);
  });

  client.on('close', code => {
    console.log(`${colors.magenta}Client process exited with code ${code}${colors.reset}`);
    server.kill();
  });

  // Handle script interruption
  process.on('SIGINT', () => {
    console.log(`${colors.yellow}Shutting down...${colors.reset}`);
    server.kill();
    client.kill();
    process.exit();
  });
}
