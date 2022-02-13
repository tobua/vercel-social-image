import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Canvas, GlobalFonts } from '@napi-rs/canvas'
import { width, height, getNameFromRequest } from '../../../helper'
import roundRect from './round-rect'

GlobalFonts.registerFromPath(join(process.cwd(), 'fonts/Arial.ttf'))

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  const name = getNameFromRequest(request)
  const now = new Date().toLocaleDateString('en-US')
  const canvas = new Canvas(width, height)
  const context = canvas.getContext('2d')

  roundRect(context, 20, 20, width - 40, height - 40, 20, '#FFF', 'gray', 3)

  context.font = 'bold 80px Arial'
  context.fillStyle = '#000'
  context.fillText(name, 50, 400)

  context.font = 'regular 35px Arial'
  context.fillStyle = '#000'
  context.fillText(now, 50, 500)

  const buffer = canvas.toBuffer('image/png')

  response.setHeader('Content-Type', 'image/png')
  response.setHeader('Cache-Control', 's-maxage=86400') // Cache for one day.
  response.send(buffer)
}
