import type { NextApiRequest, NextApiResponse } from 'next'
import playwright from 'playwright-chromium'

const markup = (name: string, date: string) => `<div class="content">
    <h1 class="title">${name}</h1>
    <p class="summary">${date}</p>
</div>`

const styles = (dimensions: { width: number; height: number }) => `html, body {
    height : 100%;
}
body {
    width : ${dimensions.width}px;
    height : ${dimensions.height}px;
    display : flex;
    align-items : center;
    justify-content : center;
    margin: 0;
    background: #F5F5F5;
    font-family: -apple-system, Helvetica, Arial, sans-serif;
}
.content {
    border : 2px solid black;
    border-radius : 20px;
    box-sizing: border-box;
    display : flex;
    flex-direction : column;
    justify-content: flex-end;
    height : calc(100% - 80px);
    margin : 40px;
    padding : 40px;
    width : calc(100% - 80px);
}
.title {
    display: flex;
    align-items: flex-end;
    font-size: 72px;
    height: 200px;
}
.summary {
    display: flex;
    align-items: flex-end;
    font-size: 34px;
    height: 100px;
}`

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  let { name } = request.query
  if (Array.isArray(name)) {
    name = name.join('')
  }
  name = name.replace('.png', '')

  const now = new Date().toLocaleDateString('en-US')
  const dimensions = { width: 1128, height: 600 }

  const browser = await playwright.chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  page.setViewportSize(dimensions)
  page.setContent(`<html>
  <body>
    ${markup(name, now)}
  </body>
  <style>
    ${styles(dimensions)}
  </style>
</html>`)

  const screenshot = await page.screenshot()
  response.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': Buffer.byteLength(screenshot),
  })
  response.end(screenshot)
}
