# Map and motion

The head-office photograph is replaced with a Google Maps embed resolving SAHU HOUSE, B-128, Sector 20, Belapur. The direct listing link is https://share.google/kX75Gvdt1NaLTtjBO (Google entity /g/11qgfbc1ms). The embedded map visually resolves SAHU HOUSE around 19.0151469, 73.0293002.

Motion references inspected live: https://www.apple.com/iphone/ and https://linear.app/. Apple navigation uses approximately 320ms transitions; Linear links use 100?160ms feedback. These informed a custom native CSS/Web Animations implementation, not an Apple library.

Shared CSS in src/motion.css handles entrances, page transitions where supported, button press/hover, link arrows, navigation, cards and focus. src/MotionEffects.jsx handles one-time intersection reveals and interruptible disclosure height animations. Native scrolling and static HTML remain usable. Reduced-motion disables these effects, including when the preference changes live. No new marketing copy was added.
