import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas } from 'canvas'

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')

  const now = new Date().toLocaleDateString('en-US')

  const width = 1128
  const height = 600

  // if (
  //   process.env.LD_LIBRARY_PATH == null ||
  //   !process.env.LD_LIBRARY_PATH.includes(`${process.env.PWD}/node_modules/canvas/build/Release:`)
  // ) {
  //   console.log('in')
  //   process.env.LD_LIBRARY_PATH = `${process.env.PWD}/node_modules/canvas/build/Release:${
  //     process.env.LD_LIBRARY_PATH || ''
  //   }`
  // } else {
  //   console.log('out')
  // }

  process.env.LD_PRELOAD = '/var/task/node_modules/canvas/build/Release/libz.so.1'

  console.log(process.env.LD_LIBRARY_PATH)

  // Also 1200 x 627 (same ratio, exact size varies)
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  context.font = `bold 70pt 'Helvetica'`
  context.fillStyle = '#000'
  context.fillText(name, 50, 400)

  context.font = `regular 20pt 'Helvetica'`
  context.fillStyle = '#000'
  context.fillText(now, 50, 500)

  context.beginPath()
  context.lineWidth = 3
  context.strokeStyle = 'lightgray'
  context.rect(20, 20, width - 40, height - 40)
  context.stroke()

  const buffer = canvas.toBuffer('image/png')
  response.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': Buffer.byteLength(buffer),
  })
  response.end(buffer)
}
