import { spawn } from "node:child_process"

const processes = [
  spawn("node", ["--watch", "server/index.mjs"], { stdio: "inherit" }),
  spawn("npm", ["--prefix", "client", "run", "dev"], { stdio: "inherit" }),
]

function shutdown(signal = "SIGTERM") {
  processes.forEach((process) => {
    if (!process.killed) process.kill(signal)
  })
}

processes.forEach((child) => {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      shutdown()
      process.exitCode = code
    }
  })
})

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))
