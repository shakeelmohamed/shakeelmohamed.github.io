const { spawnSync, spawn } = require("node:child_process");

const START_PORT = 8080;

function isPortFree(port) {
    const result = spawnSync("lsof", ["-ti", `:${port}`], { encoding: "utf8" });
    return result.stdout.trim().length === 0;
}

function findFreePort(port) {
    if (isPortFree(port)) return port;
    return findFreePort(port + 1);
}

const port = findFreePort(START_PORT);
if (port !== START_PORT) {
    console.log(`Port ${START_PORT} in use, using port ${port}`);
}

const args = ["@11ty/eleventy", "--serve", "--incremental", "--input=src", "--output=docs", "--port", String(port)];
const proc = spawn("bunx", args, { stdio: "inherit" });
proc.on("exit", (code) => process.exit(code || 0));
