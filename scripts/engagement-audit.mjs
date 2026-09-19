import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';

const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(process.env.TEST_URL||'http://localhost:4173/');
 await page.waitForLoadState('networkidle');
 const navLink=page.locator('.navigation>a:not(.button)').nth(1);
 await navLink.hover();await page.waitForTimeout(120);
 const glider=page.locator('.nav-glider');
 assert.ok(parseFloat(await glider.evaluate(element=>getComputedStyle(element).width))>50,'Navigation glider must follow links');
 assert.ok(parseFloat(await glider.evaluate(element=>getComputedStyle(element).opacity))>.8,'Navigation glider must be visibly engaged');
 const type=await page.locator('h1').evaluate(element=>{const style=getComputedStyle(element);return {size:parseFloat(style.fontSize),line:parseFloat(style.lineHeight),tracking:style.letterSpacing}});
 assert.ok(type.line/type.size<1.1&&type.tracking!=='normal','Display type must use tight leading and tracking');
 const progress=page.locator('.page-progress span');
 const initial=await progress.evaluate(element=>getComputedStyle(element).transform);
 await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight*.48,behavior:'instant'}));
 await page.waitForTimeout(250);
 const midway=await progress.evaluate(element=>getComputedStyle(element).transform);
 assert.notEqual(initial,midway,'Page progress must respond to scroll');
 const card=page.locator('.service-card').first();
 await card.scrollIntoViewIfNeeded();
 await card.hover({position:{x:80,y:90}});
 assert.equal(await card.evaluate(element=>element.style.getPropertyValue('--spot-opacity')),'1');
 const gallery=page.locator('.industrial-gallery .photo');
 await gallery.first().scrollIntoViewIfNeeded();
 await page.waitForTimeout(250);
 await page.screenshot({path:'docs/qa/engagement-desktop.png'});
 const drift=await gallery.evaluateAll(elements=>elements.map(element=>getComputedStyle(element).translate));
 assert.notEqual(drift[0],drift[1],'Gallery images must use alternating depth motion');
 for(const width of [1920,1440,768,390,320]) {
  await page.setViewportSize({width,height:900});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}px`);
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator('.menu-toggle').click();
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Open mobile navigation must not overflow');
 await page.keyboard.press('Escape');
 await page.locator('.strengths').scrollIntoViewIfNeeded();
 await page.waitForTimeout(250);
 await page.screenshot({path:'docs/qa/engagement-mobile.png'});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.reload();
 assert.equal(await page.locator('.page-progress').evaluate(element=>getComputedStyle(element).display),'none');
 assert.equal(await page.locator('.industrial-gallery .photo').first().evaluate(element=>getComputedStyle(element).animationName),'none');
 assert.equal(await page.locator('.nav-glider').evaluate(element=>getComputedStyle(element).display),'none');
 assert.deepEqual(errors,[]);
 console.log('PASS: type rhythm, nav glider, mobile menu, scroll progress, heading rule, gallery depth, card spotlight, five responsive widths, reduced motion and browser errors.');
} finally { await browser.close(); }
