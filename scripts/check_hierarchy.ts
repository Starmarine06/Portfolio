import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Wait for spline to load
  await page.waitForFunction(() => (window as any).spline !== undefined, { timeout: 30000 });

  const data = await page.evaluate(() => {
    const app = (window as any).spline;
    const allObjects = app.getAllObjects();
    return allObjects.map((obj: any) => ({
      name: obj.name,
      type: obj.type,
      visible: obj.visible,
      parentId: obj.parent ? obj.parent.id : null
    }));
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
