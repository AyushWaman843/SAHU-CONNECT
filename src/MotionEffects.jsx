import {useEffect} from 'react';

// Native animations keep the static, prerendered site readable without JavaScript.
// Effects run once on entry; interactions never delay navigation or hijack scrolling.
export default function MotionEffects() {
 useEffect(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const disclosures = new Map();
  const ease = 'cubic-bezier(.22,1,.36,1)';
  function play(element, frames, options) {
   if (preference.matches) return null;
   const animation = element.animate(frames, options);
   running.add(animation);
   animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
   return animation;
  }
  const targets = document.querySelectorAll('.section-heading, .about-grid > *, .company-intro > *, .service-card, .service-poster, .strengths-grid article, .industrial-gallery .photo, .quote, .leadership-preview article, .result-card, .vision-grid article, .values-grid article, .leadership-list article, .group-list p, .timeline article, .full-services article, .table-wrap, .achievement-list details, .contact-card, .office > *, .two-column > *, .checks li, .footer-grid > *');
  const observer = new IntersectionObserver(entries => {
   let order = 0;
   entries.forEach(({target, isIntersecting}) => {
    if (!isIntersecting) return;
    observer.unobserve(target);
    // Anchor targets and focus must remain immediately visible.
    if (target.contains(document.activeElement) || target.matches(':target')) return;
    play(target, [{opacity:0, translate:'0 24px'}, {opacity:1, translate:'0 0'}], {duration:680, delay:Math.min(order++ * 55, 165), easing:ease});
   });
  }, {threshold:.06});
  targets.forEach(target=>observer.observe(target));

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
   disclosures.forEach(({opening}, details)=>{details.open=opening;details.style.overflow='';delete details.dataset.expanded;});
   disclosures.clear();
  }
  document.addEventListener('click', onDisclosure);
  preference.addEventListener('change', onPreference);
  return () => {
   observer.disconnect();
   running.forEach(animation=>animation.cancel());
   disclosures.forEach((_, details)=>{details.style.overflow='';delete details.dataset.expanded;});
   document.removeEventListener('click', onDisclosure);
   preference.removeEventListener('change', onPreference);
  };
 }, []);
 return null;
}
