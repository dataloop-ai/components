/**
 * Vite plugin to serve local files for DlSimpleIde component
 * This plugin adds API endpoints to the dev server that can read local files
 */

import * as fs from 'fs'
import * as path from 'path'
import type { Plugin } from 'vite'

interface LocalFileServerOptions {
    /** Base path for the API endpoints */
    apiBase?: string
    /** Allowed root paths (for security) - empty means all paths allowed */
    allowedRoots?: string[]
}

export function localFileServerPlugin(
    options: LocalFileServerOptions = {}
): Plugin {
    const apiBase = options.apiBase || '/__local-files'
    const allowedRoots = options.allowedRoots || []

    const isPathAllowed = (filePath: string): boolean => {
        if (allowedRoots.length === 0) return true
        const normalizedPath = path.normalize(filePath)
        return allowedRoots.some((root) =>
            normalizedPath.startsWith(path.normalize(root))
        )
    }

    return {
        name: 'local-file-server',
        configureServer(server) {
            // List directory endpoint
            server.middlewares.use(`${apiBase}/list`, (req, res) => {
                const url = new URL(req.url || '', `http://${req.headers.host}`)
                const dirPath = url.searchParams.get('path')

                if (!dirPath) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: 'Missing path parameter' }))
                    return
                }

                if (!isPathAllowed(dirPath)) {
                    res.statusCode = 403
                    res.end(JSON.stringify({ error: 'Path not allowed' }))
                    return
                }

                try {
                    if (!fs.existsSync(dirPath)) {
                        res.statusCode = 404
                        res.end(JSON.stringify({ error: 'Path not found' }))
                        return
                    }

                    const entries = fs.readdirSync(dirPath, {
                        withFileTypes: true
                    })

                    // Filter out hidden files and common ignored directories
                    const filteredEntries = entries.filter((entry) => {
                        if (entry.name.startsWith('.')) return false
                        if (entry.name === 'node_modules') return false
                        if (entry.name === '__pycache__') return false
                        if (entry.name === '.git') return false
                        return true
                    })

                    const files = filteredEntries.map((entry) => ({
                        name: entry.name,
                        type: entry.isDirectory() ? 'folder' : 'file',
                        path: path.join(dirPath, entry.name)
                    }))

                    // Sort: folders first, then alphabetically
                    files.sort((a, b) => {
                        if (a.type !== b.type)
                            return a.type === 'folder' ? -1 : 1
                        return a.name.localeCompare(b.name)
                    })

                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ files }))
                } catch (error: any) {
                    res.statusCode = 500
                    res.end(JSON.stringify({ error: error.message }))
                }
            })

            // Read file endpoint
            server.middlewares.use(`${apiBase}/read`, (req, res) => {
                const url = new URL(req.url || '', `http://${req.headers.host}`)
                const filePath = url.searchParams.get('path')

                if (!filePath) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: 'Missing path parameter' }))
                    return
                }

                if (!isPathAllowed(filePath)) {
                    res.statusCode = 403
                    res.end(JSON.stringify({ error: 'Path not allowed' }))
                    return
                }

                try {
                    if (!fs.existsSync(filePath)) {
                        res.statusCode = 404
                        res.end(JSON.stringify({ error: 'File not found' }))
                        return
                    }

                    const stats = fs.statSync(filePath)

                    if (stats.isDirectory()) {
                        res.statusCode = 400
                        res.end(
                            JSON.stringify({ error: 'Path is a directory' })
                        )
                        return
                    }

                    // Check file size (limit to 5MB for safety)
                    if (stats.size > 5 * 1024 * 1024) {
                        res.statusCode = 413
                        res.end(
                            JSON.stringify({
                                error: 'File too large (max 5MB)'
                            })
                        )
                        return
                    }

                    const content = fs.readFileSync(filePath, 'utf-8')

                    res.setHeader('Content-Type', 'application/json')
                    res.end(
                        JSON.stringify({
                            content,
                            path: filePath,
                            name: path.basename(filePath)
                        })
                    )
                } catch (error: any) {
                    res.statusCode = 500
                    res.end(JSON.stringify({ error: error.message }))
                }
            })
        }
    }
}

/**
 * Default API config for local development
 * Use this with DlSimpleIde when running in dev mode
 */
export const localFileApiConfig = {
    baseUrl: '',
    listEndpoint: '/__local-files/list',
    readEndpoint: '/__local-files/read'
}
