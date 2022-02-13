import playwright from 'playwright-chromium'
import { width, height } from './helper'

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
    font-family: Arial, Helvetica, sans-serif;
}
.content {
    border : 3px solid gray;
    border-radius : 20px;
    box-sizing: border-box;
    display : flex;
    flex-direction : column;
    justify-content: flex-end;
    height : calc(100% - 40px);
    margin : 20px;
    padding : 40px;
    width : calc(100% - 40px);
}
.title {
  display: flex;
  align-items: flex-end;
  font-size: 72px;
}
.summary {
  display: flex;
  align-items: flex-end;
  font-size: 34px;
}`

export const createScreenshot = async (name: string) => {
  const now = new Date().toLocaleDateString('en-US')
  const dimensions = { width, height }

  const browser = await playwright.chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  page.setViewportSize(dimensions)
  page.setContent(`<html>
  <body>
    ${markup(`Playwright: ${name}`, now)}
  </body>
  <style>
    ${styles(dimensions)}
  </style>
</html>`)

  await page.screenshot({ path: `public/build-${name}.png` })
}
