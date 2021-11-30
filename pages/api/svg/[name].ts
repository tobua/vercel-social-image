import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')

  const now = new Date().toLocaleDateString('en-US')

  const width = 1128
  const height = 600

  const svg = `<svg version="1.1" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="400" font-family="Arial, sans-serif" font-weight="bold" font-size="70px">${name}</text>
    <text x="50" y="500" font-family="sans-serif" font-size="25px">${now}</text>
    <rect x="20" y="20" fill="none" stroke="lightgray" stroke-width="3" width="${
      width - 40
    }" height="${height - 40}" rx="20" />
  </svg>`

  // https://github.com/lovell/sharp/issues/1875
  // https://askubuntu.com/questions/492033/fontconfig-error-cannot-load-default-config-file
  // process.env.FONTCONFIG_PATH = '/etc/fonts'

  const input = Buffer.from(svg)
  const image = await sharp(input).png().toBuffer()

  response.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': Buffer.byteLength(image),
  })
  response.end(image)
}
