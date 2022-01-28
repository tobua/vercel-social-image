import type { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'

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
    border : 3px solid gray;
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

  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()
  page.setViewport(dimensions)
  page.setContent(`<html>
  <body>
    ${markup(name, now)}
  </body>
  <style>
    ${styles(dimensions)}
  </style>
</html>`)

  const screenshot = await page.screenshot()

  if (!screenshot) {
    return response.status(500).send({ error: 'Failed to generate image' })
  }

  response.setHeader('Content-Type', 'image/png')
  response.send(screenshot)
}
