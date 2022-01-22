import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Canvas, GlobalFonts } from '@napi-rs/canvas'

console.log(__dirname, 'folder')

GlobalFonts.registerFromPath(join(__dirname, 'canvas', 'Arial.ttf'))

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  console.log(__dirname, 'folder1')
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')

  const now = new Date().toLocaleDateString('en-US')

  const width = 1128
  const height = 600

  // Also 1200 x 627 (same ratio, exact size varies)
  const canvas = new Canvas(width, height)
  const context = canvas.getContext('2d')

  context.font = `bold 70px Arial`
  context.fillStyle = '#000'
  context.fillText(name, 50, 400)

  context.font = `regular 20px Arial`
  context.fillStyle = '#000'
  context.fillText(now, 50, 500)

  context.beginPath()
  context.lineWidth = 3
  context.strokeStyle = 'lightgray'
  context.rect(20, 20, width - 40, height - 40)
  context.stroke()

  const buffer = canvas.toBuffer('image/png')

  response.setHeader('Content-Type', 'image/png')
  response.send(buffer)
}
