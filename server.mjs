import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const vitePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'node_modules/vite/bin/vite.js')
const port = process.env.PORT || '4173'
const server = spawn(process.execPath, [vitePath, 'preview', '--host', '0.0.0.0', '--port', port], { stdio: 'inherit' })
server.on('exit', code => process.exit(code ?? 0))
