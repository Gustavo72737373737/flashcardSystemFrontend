import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist')
const port = Number(process.env.PORT || 4173)
const contentTypes = { '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }

const server = createServer((request, response) => {
	const requestedPath = request.url?.split('?')[0] || '/'
	const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.slice(1)
	const filePath = path.resolve(root, relativePath)
	const isInsideDist = filePath.startsWith(`${root}${path.sep}`)
	const finalPath = isInsideDist && existsSync(filePath) && statSync(filePath).isFile() ? filePath : path.join(root, 'index.html')
	response.setHeader('Content-Type', contentTypes[path.extname(finalPath)] || 'text/html; charset=utf-8')
	createReadStream(finalPath).on('error', () => { response.statusCode = 500; response.end('Server error') }).pipe(response)
})

server.listen(port, '0.0.0.0', () => console.log(`Frontend listening on port ${port}`))
