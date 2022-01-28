import { existsSync } from 'fs'
import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

console.log('svg', process.cwd(), __dirname)
console.log(join(process.cwd(), '/fonts'), existsSync(join(process.cwd(), '/fonts')))
process.env.FONTCONFIG_PATH = join(process.cwd(), '/fonts')

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  console.log(process.env.FONTCONFIG_PATH, 'path')
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
    <text x="50" y="450" font-family="sans-serif" font-size="30px">${now}</text>
    <text x="50" y="500" font-family="Arial, sans-serif" font-size="30px">${now}</text>
    <rect x="20" y="20" fill="none" stroke="gray" stroke-width="3" width="${width - 40}" height="${
    height - 40
  }" rx="20"/>
  </svg>`

  const input = Buffer.from(svg)
  const image = await sharp(input).png().toBuffer()

  response.setHeader('Content-Type', 'image/png')
  response.send(image)
}
