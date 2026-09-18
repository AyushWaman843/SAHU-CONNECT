import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {render,paths} from '../.ssr/entry-server.js';
const template=await readFile('dist/index.html','utf8');
const titles={'/':'SAHUCONNECT','/company/':'Company Profile','/services/':'Service Portfolio','/presence/':'National Presence','/contact/':'Connect With Us'};
for(const path of paths){await mkdir(`dist${path}`,{recursive:true});await writeFile(`dist${path}index.html`,template.replace('<!--app-html-->',render(path)).replace('<title>SAHUCONNECT</title>',`<title>${titles[path]}${path==='/'?'':' | SAHUCONNECT'}</title>`));}
await writeFile('dist/404.html',template.replace('<!--app-html-->',render('/')));
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>https://www.sahuconnect.com${p}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: https://www.sahuconnect.com/sitemap.xml\n');
console.log(`Pre-rendered ${paths.length} pages.`);
