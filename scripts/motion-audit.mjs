import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:4173/contact/');
await page.locator('.office').scrollIntoViewIfNeeded();await page.waitForTimeout(4500);
console.log('frames',page.frames().map(f=>f.url()));
for(const frame of page.frames().slice(1)){console.log('Map text',(await frame.locator('body').innerText()).slice(0,1600));}
await page.screenshot({path:'docs/qa/map-desktop.png'});
await page.goto('http://localhost:4173/presence/');
const details=page.locator('#achievement-1');const summary=details.locator('summary');
await summary.click();await expect(details).toHaveAttribute('open','');await page.waitForTimeout(450);await summary.click();await expect(details).not.toHaveAttribute('open','');
await summary.click();await page.waitForTimeout(80);await summary.click();await page.waitForTimeout(80);await summary.click();await page.waitForTimeout(500);await expect(details).toHaveAttribute('open','');
await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:4173/');await page.locator('.menu-toggle').click();await page.waitForTimeout(500);await page.screenshot({path:'docs/qa/menu-motion.png'});await page.keyboard.press('Escape');await page.waitForTimeout(450);await expect(page.locator('#navigation')).toBeHidden();
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:4173/presence/');await page.waitForTimeout(400);console.log('Reduced motion active animations',await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length));await page.locator('#achievement-1 summary').click();await expect(page.locator('#achievement-1')).toHaveAttribute('open','');await page.locator('#achievement-1 summary').click();await expect(page.locator('#achievement-1')).not.toHaveAttribute('open','');
console.log('errors',errors);await browser.close();
