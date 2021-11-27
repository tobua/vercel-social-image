import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas } from 'canvas'

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')

  const now = new Date().toLocaleDateString('en-US')

  // Also 1200 x 627 (same ratio, exact size varies)
  const canvas = createCanvas(1128, 600)
  const context = canvas.getContext('2d')

  context.font = `bold 70pt 'Helvetica'`
  context.fillStyle = '#000'
  context.fillText(name, 50, 400)

  context.font = `regular 20pt 'Helvetica'`
  context.fillStyle = '#000'
  context.fillText(now, 50, 500)

  const buffer = canvas.toBuffer('image/png')
  response.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': Buffer.byteLength(buffer),
  })
  response.end(buffer)
}
