process.env.LD_LIBRARY_PATH = '/var/task/node_modules/canvas/build/Release'
process.env.LD_PRELOAD = '/var/task/node_modules/canvas/build/Release/libz.so.1'

console.log(process.env.LD_LIBRARY_PATH, process.env.LD_PRELOAD, 'path')

import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas } from 'canvas'

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')

  process.env.LD_LIBRARY_PATH = '/var/task/node_modules/canvas/build/Release'
  process.env.LD_PRELOAD = '/var/task/node_modules/canvas/build/Release/libz.so.1'

  console.log(process.env.LD_LIBRARY_PATH, process.env.LD_PRELOAD, 'path')

  const now = new Date().toLocaleDateString('en-US')

  const width = 1128
  const height = 600

  // Also 1200 x 627 (same ratio, exact size varies)
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  context.font = `bold 70pt sans-serif`
  context.fillStyle = '#000'
  context.fillText(name, 50, 400)

  context.font = `regular 20pt sans-serif`
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
