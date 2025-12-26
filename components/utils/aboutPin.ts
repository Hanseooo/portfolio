import ScrollTrigger from "gsap/ScrollTrigger";

export function disableAboutPin() {
  const st = ScrollTrigger.getById("about-horizontal");
  if (st) {
    st.disable(false);
  }
}

export function enableAboutPin() {
  const st = ScrollTrigger.getById("about-horizontal");
  if (st) {
    st.enable(false);
  }
}
