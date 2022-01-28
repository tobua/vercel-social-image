import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Canvas, GlobalFonts, SKRSContext2D } from '@napi-rs/canvas'

GlobalFonts.registerFromPath(join(process.cwd(), 'fonts/Arial.ttf'))

// https://stackoverflow.com/a/3368118/3185545
function roundRect(
  context: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl: number; tr: number; br: number; bl: number },
  fill: string,
  stroke: string | boolean
) {
  if (typeof stroke === 'undefined') {
    stroke = true
  }
  if (typeof radius === 'undefined') {
    radius = 5
  }
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
    for (let side in defaultRadius) {
      // @ts-ignore
      radius[side] = radius[side] || defaultRadius[side]
    }
  }
  context.beginPath()
  context.moveTo(x + radius.tl, y)
  context.lineTo(x + width - radius.tr, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  context.lineTo(x + width, y + height - radius.br)
  context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  context.lineTo(x + radius.bl, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  context.lineTo(x, y + radius.tl)
  context.quadraticCurveTo(x, y, x + radius.tl, y)
  context.closePath()
  if (fill) {
    context.fill()
  }
  if (stroke) {
    context.stroke()
  }
}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
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

  context.font = `bold 80px Arial`
  context.fillStyle = '#000'
  context.fillText(name, 50, 400)

  context.font = `regular 35px Arial`
  context.fillStyle = '#000'
  context.fillText(now, 50, 500)

  roundRect(context, 20, 20, width - 40, height - 40, 20, '#FFF', 'gray')

  // context.beginPath()
  // context.lineWidth = 3
  // context.strokeStyle = 'gray'
  // context.rect(20, 20, width - 40, height - 40)
  // context.stroke()

  const buffer = canvas.toBuffer('image/png')

  response.setHeader('Content-Type', 'image/png')
  response.send(buffer)
}
