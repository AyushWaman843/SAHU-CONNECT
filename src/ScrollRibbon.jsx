import './scroll-ribbon.css';

export const ribbonPath = 'M 120 -300 C 131.67 -120.00, 6.67 488.33, 190.00 780.00 C 373.33 1071.67, 1113.33 1248.33, 1220.00 1450.00 C 1326.67 1651.67, 1003.33 1818.33, 830.00 1990.00 C 656.67 2161.67, 125.00 2288.33, 180.00 2480.00 C 235.00 2671.67, 1023.33 2948.33, 1160.00 3140.00 C 1296.67 3331.67, 1153.33 3463.33, 1000.00 3630.00 C 846.67 3796.67, 316.67 3963.33, 240.00 4140.00 C 163.33 4316.67, 370.00 4528.33, 540.00 4690.00 C 710.00 4851.67, 1230.00 4940.00, 1260.00 5110.00 C 1290.00 5280.00, 901.67 5533.33, 720.00 5710.00 C 538.33 5886.67, 115.00 5991.67, 170.00 6170.00 C 225.00 6348.33, 928.33 6525.00, 1050.00 6780.00 C 1171.67 7035.00, 925.00 7546.67, 900.00 7700.00';

// Broad cubic spline with shared tangents at every join; no abrupt direction changes.
// Irregular anchors keep the route organic without tight hooks or cusps.
// The browser draws the stroke itself as the document scrolls; no scroll listeners.
export default function ScrollRibbon() {
 return <div className="scroll-ribbon" aria-hidden="true">
  <svg viewBox="0 0 1440 7000" preserveAspectRatio="none" focusable="false">
   <path className="scroll-ribbon-line" pathLength="1" d={ribbonPath}/>
  </svg>
 </div>;
}
