import type { SKRSContext2D } from '@napi-rs/canvas'

// https://stackoverflow.com/a/3368118/3185545
export default function roundRect(
  context: SKRSContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl: number; tr: number; br: number; bl: number },
  fill: string,
  stroke: string | boolean,
  strokeWidth: number = 1
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
    context.fillStyle = fill
    context.fill()
  }
  if (typeof stroke === 'string') {
    context.strokeStyle = stroke
  }
  if (stroke) {
    context.lineWidth = strokeWidth
    context.stroke()
  }
}
