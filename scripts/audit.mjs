import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const base=process.env.TEST_URL||'http://localhost:5173';
const paths=['/','/company/','/services/','/presence/','/contact/'];
await mkdir('docs/qa',{recursive:true});
const report=[];const errors=[];const allTexts=[];
try{
for(const width of [1920,1440,768,390,320]){
 const page=await browser.newPage({viewport:{width,height:900}});
 page.on('pageerror',e=>errors.push(e.message));
 for(const path of paths){
  await page.goto(base+path);await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(async()=>{for(const image of document.images){image.loading='eager';}await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));});
  assert.equal(await page.locator('h1').count(),1,`${path}: h1`);
  const layout=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)}));
  assert.ok(layout.scroll<=width,`${path} overflow at ${width}: ${layout.scroll}`);assert.deepEqual(layout.broken,[]);
  if(width===1920)allTexts.push(await page.locator('body').textContent());
  if((width===1920||width===390)&&path==='/')await page.screenshot({path:`docs/qa/home-${width}.png`,fullPage:true});
  if(width===390&&path!=='/')await page.screenshot({path:`docs/qa/${path.replaceAll('/','')}-390.png`,fullPage:true});
  report.push({path,width,overflow:false,brokenImages:0});
 }
 if(width===390){
  await page.goto(base);const toggle=page.locator('.menu-toggle');await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');await toggle.click();await page.locator('#navigation').getByRole('link',{name:'Services',exact:true}).click();assert.ok(page.url().endsWith('/services/'));
  await page.goto(base+'/presence/#achievement-7');await page.waitForLoadState('networkidle');assert.equal(await page.locator('#achievement-7').getAttribute('open'),'');await page.locator('#achievement-7 summary').click();await expect(page.locator('#achievement-7')).not.toHaveAttribute('open','');
 }
 await page.close();
}
const page=await browser.newPage();
for(const path of paths){await page.goto(base+path);await page.waitForLoadState('networkidle');const links=await page.locator('a[href^="/"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')));for(const link of new Set(links)){const [route,hash]=link.split('#');assert.ok(paths.includes(route),`Unknown route ${link}`);if(hash){await page.goto(base+link);assert.equal(await page.locator(`[id="${hash}"]`).count(),1,`Missing target ${link}`)}}}
assert.deepEqual(errors,[],'Browser errors');
const source=JSON.parse(await readFile('src/source.json','utf8'));const normalize=s=>s.replace(/[^\p{L}\p{N}]/gu,'').toLowerCase();const normalized=normalize(allTexts.join(' '));
const missing=source.paragraphs.map((text,index)=>({index,text})).filter(({text,index})=>text.length>45&&index!==1&&!normalized.includes(normalize(text)));
assert.deepEqual(missing,[],'Every substantial document paragraph must be represented; opening corrupted date is explicitly excluded.');
await writeFile('docs/qa/report.json',JSON.stringify({checks:report,errors,sourceParagraphsToReview:missing},null,2));
console.log(`PASS: ${report.length} page/viewport combinations, mobile navigation, keyboard dismissal, achievement disclosure, internal links, images and browser errors.`);console.log('Source fragments to review:',missing);
}finally{await browser.close()}
