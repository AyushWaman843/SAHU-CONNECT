import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
for(const [name,url] of [['apple','https://www.apple.com/iphone/'],['linear','https://linear.app/'],['map','https://www.google.com/maps?q=SAHU%20HOUSE%20B-128%20Sector%2020%20Belapur%20Navi%20Mumbai&ftid=%2Fg%2F11qgfbc1ms&z=17&output=embed']]){
 try {await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(2500);await page.screenshot({path:`docs/qa/reference-${name}.png`});console.log(name,await page.title(),page.url());console.log((await page.locator('body').innerText()).slice(0,1200));console.log(await page.evaluate(()=>[...document.querySelectorAll('*')].map(e=>({tag:e.tagName,class:e.className,transition:getComputedStyle(e).transition,animation:getComputedStyle(e).animationName})).filter(e=>!e.transition.includes('0s ease 0s')||e.animation!=='none').slice(0,12)));if(name==='map')await writeFile('docs/map-render.html',await page.content());}catch(e){console.log(name,e.message)}
}
await browser.close();
