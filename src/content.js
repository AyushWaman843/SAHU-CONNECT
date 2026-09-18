import source from './source.json';
// Content is indexed directly to the original DOCX paragraphs and tables.
// Source anomalies are intentionally not silently corrected.
export const p = source.paragraphs;
export const documentParts = source.documentParts;
export const headOffice = {email:'headoffice.belapur@gmail.com',phone:'+91 92236 82223'};
export const tables = source.tables;
export const title = (s) => s.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
export const range = (a,b) => p.slice(a,b+1).filter(Boolean);
export const nav = [ ['/', 'SAHUCONNECT'], ['/company/', 'Company Profile'], ['/services/', 'Services'], ['/presence/', 'National Presence'], ['/contact/', 'Connect With Us'] ];
export const assets = {
  hero: '/images/industrial-panorama.webp',
  plant: '/images/cement-plant-dusk.webp',
  team: '/images/maintenance-team.webp',
  workshop: '/images/workshop-machinery.webp',
};
export const services = range(143,152);
export const achievements = [...tables[6].slice(1), ...tables[7]];
export const contacts = [
 {name:p[432], role:p[433], phones:p[434].replace('📞 ','').split(' || '), email:p[435].replace('✉ ','')},
 {name:p[436], role:p[437], phones:p[438].replace('📞 ','').split(' || '), email:p[439].replace('✉ ','')},
];
