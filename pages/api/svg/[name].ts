import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import { render } from '@resvg/resvg-js'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')

  const now = new Date().toLocaleDateString('en-US')

  const width = 1128
  const height = 600

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="400" font-family="Arial" font-size="80" font-weight="bold">${name}</text>
    <text x="50" y="500" font-family="sans-serif" font-size="35">${now}</text>
    <rect x="20" y="20" fill="none" stroke="gray" stroke-width="3" width="${width - 40}" height="${
    height - 40
  }" rx="20"/>
  </svg>`

  const pngData = render(svg, {
    font: {
      fontFiles: [join(process.cwd(), 'fonts/Arial.ttf')],
      loadSystemFonts: false,
      defaultFontFamily: 'Arial',
    },
    logLevel: 'debug',
  })

  response.setHeader('Content-Type', 'image/png')
  response.send(pngData)
}
