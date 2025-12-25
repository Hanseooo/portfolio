// "use client";

// import gsap from "gsap";
// import { useEffect, useRef } from "react";

// export function RevealText(text : string) {
//   const ref = useRef(null);

//   useEffect(() => {
//     const chars = ref.current.querySelectorAll(".char");

//     gsap.from(chars, {
//       y: "100%",
//       stagger: 0.03,
//       duration: 0.8,
//       ease: "power4.out",
//       scrollTrigger: {
//         trigger: ref.current,
//         start: "top 85%",
//       },
//     });
//   }, []);

//   return (
//     <h1 ref={ref} className="overflow-hidden">
//       {text.split("").map((c, i) => (
//         <span key={i} className="char inline-block">
//           {c === " " ? "\u00A0" : c}
//         </span>
//       ))}
//     </h1>
//   );
// }
