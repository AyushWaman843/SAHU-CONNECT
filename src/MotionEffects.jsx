import {useEffect} from 'react';

// Native animations keep the static, prerendered site readable without JavaScript.
// Effects run once on entry; interactions never delay navigation or hijack scrolling.
export default function MotionEffects() {
 useEffect(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const disclosures = new Map();
  const ease = 'cubic-bezier(.22,1,.36,1)';
  // Re-apply deep-link state after hydration so React cannot reset an opened panel.
  const hashTarget = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (hashTarget?.tagName === 'DETAILS') hashTarget.open = true;
  if (hashTarget) requestAnimationFrame(()=>hashTarget.scrollIntoView({block:'start'}));
  function play(element, frames, options) {
   if (preference.matches) return null;
   const animation = element.animate(frames, options);
   running.add(animation);
   animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
   return animation;
  }
  const targets = document.querySelectorAll('.section-heading, .about-grid > *, .company-intro > *, .service-card, .service-poster, .strengths-grid article, .quote, .leadership-preview article, .result-card, .vision-grid article, .values-grid article, .leadership-list article, .group-list p, .timeline article, .full-services article, .table-wrap, .achievement-list details, .contact-card, .office > *, .two-column > *, .checks li, .footer-grid > *, .industrial-gallery .photo');
  const observer = new IntersectionObserver(entries => {
   let order = 0;
   entries.forEach(({target, isIntersecting}) => {
    if (!isIntersecting) return;
    observer.unobserve(target);
    // Anchor targets and focus must remain immediately visible.
    if (target.contains(document.activeElement) || target.matches(':target')) return;
    let frames=[{opacity:0,translate:'0 24px'},{opacity:1,translate:'0 0'}];
    let duration=680;
    if(target.matches('.section-heading')) {frames=[{opacity:0,translate:'0 30px',clipPath:'inset(0 0 80% 0)'},{opacity:1,translate:'0 0',clipPath:'inset(0 0 0 0)'}];duration=850}
    else if(target.matches('.industrial-gallery .photo')) {frames=[{opacity:.35,scale:1.06,clipPath:'inset(10% 0 10% 0 round 12px)'},{opacity:1,scale:1,clipPath:'inset(0 0 0 0 round 12px)'}];duration=900}
    else if(target.matches('.checks li')) {frames=[{opacity:0,translate:'-14px 0'},{opacity:1,translate:'0 0'}];duration=520}
    else if(target.matches('.service-card, .result-card, .values-grid article, .leadership-preview article')) {const x=order%2?-16:16;frames=[{opacity:0,translate:`${x}px 22px`,scale:.985},{opacity:1,translate:'0 0',scale:1}];duration=760}
    play(target, frames, {duration, delay:Math.min(order++ * 55, 165), easing:ease});
   });
  }, {threshold:.06});
  targets.forEach(target=>observer.observe(target));

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const buttons = document.querySelectorAll('.button');
  const cleanupPointers = [];
  buttons.forEach(button => {
   function move(event) {
    if (preference.matches || !finePointer.matches) return;
    const box = button.getBoundingClientRect();
    button.style.setProperty('--pointer-x', `${(event.clientX-box.left-box.width/2)*.07}px`);
    button.style.setProperty('--pointer-y', `${(event.clientY-box.top-box.height/2)*.1}px`);
   }
   function reset() {
    button.style.removeProperty('--pointer-x');
    button.style.removeProperty('--pointer-y');
   }
   function press(event) {
    if (preference.matches) return;
    const box = button.getBoundingClientRect();
    const pulse = document.createElement('span');
    pulse.className = 'press-light';
    pulse.setAttribute('aria-hidden','true');
    pulse.style.left = `${event.clientX-box.left}px`;
    pulse.style.top = `${event.clientY-box.top}px`;
    button.append(pulse);
    const animation = play(pulse, [{transform:'translate(-50%,-50%) scale(0)',opacity:.28},{transform:'translate(-50%,-50%) scale(1)',opacity:0}], {duration:550,easing:ease});
    animation.finished.catch(()=>{}).finally(()=>pulse.remove());
   }
   button.addEventListener('pointermove', move);
   button.addEventListener('pointerleave', reset);
   button.addEventListener('blur', reset);
   button.addEventListener('pointerdown', press);
   cleanupPointers.push(()=>{
    reset();
    button.removeEventListener('pointermove',move);
    button.removeEventListener('pointerleave',reset);
    button.removeEventListener('blur',reset);
    button.removeEventListener('pointerdown',press);
   });
  });

  const interactiveCards = document.querySelectorAll('.service-card, .result-card, .contact-card, .values-grid article, .leadership-preview article');
  interactiveCards.forEach(card => {
   function illuminate(event) {
    if (preference.matches || !finePointer.matches) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX-box.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY-box.top}px`);
    card.style.setProperty('--spot-opacity', '1');
   }
   function dim() { card.style.setProperty('--spot-opacity', '0'); }
   card.addEventListener('pointermove', illuminate);
   card.addEventListener('pointerleave', dim);
   cleanupPointers.push(()=>{
    card.style.removeProperty('--spot-x');
    card.style.removeProperty('--spot-y');
    card.style.removeProperty('--spot-opacity');
    card.removeEventListener('pointermove',illuminate);
    card.removeEventListener('pointerleave',dim);
   });
  });

  function onDisclosure(event) {
   const summary = event.target.closest('summary');
   if (!summary || preference.matches) return;
   const details = summary.parentElement;
   if (!details.matches('.achievement-list details')) return;
   event.preventDefault();
   const previous = disclosures.get(details);
   const opening = previous ? !previous.opening : !details.open;
   const start = details.getBoundingClientRect().height;
   previous?.animation.cancel();
   details.style.height = '';
   details.open = true;
   details.dataset.expanded = String(opening);
   const end = opening ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height;
   details.style.overflow = 'hidden';
   const animation = play(details, [{height:`${start}px`}, {height:`${end}px`}], {duration:360, easing:ease});
   const state = {animation, opening};
   disclosures.set(details, state);
   animation.onfinish = () => {
    if (disclosures.get(details) !== state) return;
    details.open = opening;
    details.style.overflow = '';
    delete details.dataset.expanded;
    disclosures.delete(details);
   };
  }
  function onPreference() {
   if (!preference.matches) return;
   running.forEach(animation=>animation.cancel());
   buttons.forEach(button=>{button.style.removeProperty('--pointer-x');button.style.removeProperty('--pointer-y');});
   disclosures.forEach(({opening}, details)=>{details.open=opening;details.style.overflow='';delete details.dataset.expanded;});
   disclosures.clear();
  }
  document.addEventListener('click', onDisclosure);
  preference.addEventListener('change', onPreference);
  return () => {
   observer.disconnect();
   cleanupPointers.forEach(cleanup=>cleanup());
   running.forEach(animation=>animation.cancel());
   disclosures.forEach((_, details)=>{details.style.overflow='';delete details.dataset.expanded;});
   document.removeEventListener('click', onDisclosure);
   preference.removeEventListener('change', onPreference);
  };
 }, []);
 return null;
}
