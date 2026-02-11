// setup.js
const { exec } = require("child_process");
const path = require("path");
const os = require("os");

const rootDir = __dirname;
const backendPath = path.join(rootDir, "Backend");
const frontendPath = path.join(rootDir, "Frontend");

const isWin = os.platform() === "win32";

function runCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    const child = exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
    if (child.stdout) child.stdout.pipe(process.stdout);
    if (child.stderr) child.stderr.pipe(process.stderr);
  });
}

async function setupBackend() {
  console.log("=== Setting up Backend ===");

  // Determine Python command
  const pythonCmd = isWin ? "py" : "python3";

  // Create virtual environment
  console.log("Creating virtual environment...");
  await runCommand(`${pythonCmd} -m venv "${path.join(backendPath, ".venv")}"`);

  // Install backend requirements using python -m pip
  console.log("Installing backend requirements...");
  await runCommand(`"${path.join(backendPath, ".venv", "Scripts", "python.exe")}" -m pip install -r "${path.join(backendPath, "requirements.txt")}"`);
}


async function setupFrontend() {
  console.log("=== Setting up Frontend ===");
  console.log("Installing frontend dependencies...");
  await runCommand("npm install", { cwd: frontendPath });
}

async function startServers() {
  console.log("=== Starting Servers ===");

  if (isWin) {
    // Start backend
    runCommand(`start "" cmd /k "cd /d "${backendPath}" && .\\.venv\\Scripts\\python.exe -m uvicorn main:app --reload"`);
    // Start frontend
    runCommand(`start cmd /k "cd /d "${frontendPath}" && npm run dev"`);
  } else {
    // Linux/macOS
    runCommand(`bash -c "cd '${backendPath}' && ./.venv/bin/python3 -m uvicorn main:app --reload"`); 
    runCommand(`bash -c "cd '${frontendPath}' && npm run dev"`);
  }
}

async function main() {
  try {
    await setupBackend();
    await setupFrontend();
    await startServers();
  } catch (err) {
    console.error("Error during setup:", err);
  }
}

main();
