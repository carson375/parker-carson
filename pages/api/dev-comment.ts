import fs from 'fs'
import path from 'path'

import type { NextApiRequest, NextApiResponse } from 'next'

export interface DevComment {
  id: string
  url: string
  path: string
  selector: string
  tagName: string
  elementText: string
  classes: string
  comment: string
  timestamp: string
}

const FEEDBACK_DIR = path.join(process.cwd(), '.antigravity')
const FEEDBACK_FILE = path.join(FEEDBACK_DIR, 'feedback.json')

function getStoredComments(): DevComment[] {
  try {
    if (!fs.existsSync(FEEDBACK_FILE)) {
      return []
    }
    const raw = fs.readFileSync(FEEDBACK_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveComments(comments: DevComment[]) {
  if (!fs.existsSync(FEEDBACK_DIR)) {
    fs.mkdirSync(FEEDBACK_DIR, { recursive: true })
  }
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(comments, null, 2), 'utf-8')
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.headers.host || ''
  const isLocalhost =
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('[::1]')

  if (process.env.NODE_ENV !== 'development' || !isLocalhost) {
    return res.status(404).end('Not Found')
  }

  if (req.method === 'GET') {
    const comments = getStoredComments()
    return res.status(200).json({ comments })
  }

  if (req.method === 'POST') {
    const body = req.body
    if (!body || !body.comment) {
      return res.status(400).json({ error: 'Comment text is required' })
    }

    const newComment: DevComment = {
      id:
        body.id ||
        `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: body.url || '',
      path: body.path || '',
      selector: body.selector || '',
      tagName: body.tagName || '',
      elementText: body.elementText || '',
      classes: body.classes || '',
      comment: body.comment,
      timestamp: new Date().toISOString(),
    }

    const current = getStoredComments()
    const updated = [newComment, ...current]
    saveComments(updated)

    return res
      .status(201)
      .json({ success: true, comment: newComment, total: updated.length })
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (id && typeof id === 'string') {
      const current = getStoredComments()
      const updated = current.filter(c => c.id !== id)
      saveComments(updated)
      return res.status(200).json({ success: true, total: updated.length })
    } else {
      // Clear all
      saveComments([])
      return res.status(200).json({ success: true, total: 0 })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
