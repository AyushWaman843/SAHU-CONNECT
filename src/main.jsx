import React from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import './styles.css';
import './motion.css';
import App from './App';
const path=window.location.pathname.replace(/\/?$/,'/');
const root=document.getElementById('root');
if(root.querySelector('main'))hydrateRoot(root,<App path={path}/>);else createRoot(root).render(<App path={path}/>);
// Open the actual achievement when following a deep link.
function revealHash(){const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(el?.tagName==='DETAILS')el.open=true;el?.scrollIntoView({block:'start'})}
window.addEventListener('hashchange',revealHash);
if(location.hash)requestAnimationFrame(revealHash);
