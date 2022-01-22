import { existsSync } from 'fs'
import { resolve, join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

console.log('svg', process.cwd())

resolve(process.cwd(), 'fonts', 'fonts.conf')
resolve(process.cwd(), 'fonts', 'Arial.ttf')

process.env.FONTCONFIG_PATH = '/var/task/.next/server/pages/api/svg/fonts'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  process.env.FONTCONFIG_PATH = '/var/task/.next/server/pages/api/svg/fonts'
  console.group('svg1', existsSync(join(process.cwd(), 'fonts', 'fonts.conf')))
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')

  const now = new Date().toLocaleDateString('en-US')

  const width = 1128
  const height = 600

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="400" font-family="Arial" font-size="70px" font-weight="bold">${name}</text>
    <text x="50" y="500" font-family="Arial" font-size="30px">${now}</text>
    <rect x="20" y="20" fill="none" stroke="lightgray" stroke-width="3" width="${
      width - 40
    }" height="${height - 40}" rx="20"/>
  </svg>`

  const input = Buffer.from(svg)
  const image = await sharp(input).png().toBuffer()

  response.setHeader('Content-Type', 'image/png')
  response.send(image)
}
