import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://localhost:4173/');await page.waitForTimeout(900);
const offsets=[];
const headY=[];
for(const y of [0,1100,3200,5200]) {
 await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(800);
 offsets.push(parseFloat(await page.locator('.scroll-ribbon-line').evaluate(e=>getComputedStyle(e).strokeDashoffset)));
 headY.push(await page.locator('.scroll-ribbon-line').evaluate(e=>{
  const svg=e.ownerSVGElement, box=svg.getBoundingClientRect(), drawn=1-parseFloat(getComputedStyle(e).strokeDashoffset);
  const point=e.getPointAtLength(e.getTotalLength()*drawn);
  return Math.round(box.top+(point.y/7000)*box.height);
 }));
 if(y===1100)await page.screenshot({path:'docs/qa/ribbon-desktop.png'});
}
assert.ok(offsets[0]>offsets.at(-1),'Ribbon stroke must draw with scroll depth');
assert.ok(headY.slice(0,-1).every(y=>y>180&&y<820),'Ribbon head must stay near the viewport centre');
for(const width of [1920,1440,768,390,320]) {await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo({top:1200,behavior:'instant'}));await page.waitForTimeout(700);await page.screenshot({path:'docs/qa/ribbon-mobile.png'});
await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>scrollTo({top:document.querySelector('footer').offsetTop-600,behavior:'instant'}));await page.waitForTimeout(700);await page.screenshot({path:'docs/qa/ribbon-footer.png'});
await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.scroll-ribbon-line').evaluate(e=>getComputedStyle(e).animationName),'none');
console.log('PASS: scroll draw',offsets,'head positions',headY,'; five widths without overflow; reduced-motion static fallback.');
} finally {await browser.close()}
