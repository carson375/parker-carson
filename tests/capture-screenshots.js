const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 1000 })

  page.on('console', msg =>
    console.log('BROWSER CONSOLE:', msg.type(), msg.text())
  )
  page.on('pageerror', err => console.log('BROWSER PAGEERROR:', err.toString()))

  console.log('Navigating to http://localhost:3000/hobbies/golfing...')
  await page.goto('http://localhost:3000/hobbies/golfing', {
    waitUntil: 'networkidle2',
  })

  // Set dark theme
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })

  // Click on Rock Manor round tile (18 holes)
  const clicked = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('[data-testid="round-tile"]'))
    const rockManor = tiles.find(t => t.textContent && t.textContent.includes('Rock Manor'))
    if (rockManor) {
      rockManor.click()
      return true
    }
    return false
  })

  console.log('Clicked Rock Manor 18H tile:', clicked)
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: 'tests/rock-manor-tab1.png' })
  console.log('Saved tests/rock-manor-tab1.png')

  // Click Course Map button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const mapBtn = btns.find(b => b.textContent && b.textContent.includes('Course Map'))
    if (mapBtn) mapBtn.click()
  })

  await new Promise(r => setTimeout(r, 1500))
  await page.screenshot({ path: 'tests/rock-manor-tab2.png' })
  console.log('Saved tests/rock-manor-tab2.png')

  await browser.close()
  console.log('Done capturing 18H screenshots!')
})()
