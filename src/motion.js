/* Žilić Consult — motion layer (Motion, vanilla JS).
   Progressive enhancement only: every element is visible without this file.
   Bundled to /assets/motion.js with `npm run bundle:motion`. */
import { animate } from "motion/mini";
import { inView, stagger, hover, press, spring } from "motion";

const root = document.documentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = [0.22, 1, 0.36, 1];

function ready() {
  root.classList.add("motion-ready");
  root.classList.remove("js-motion");
}

/* Scroll progress hairline under the sticky header. Runs on every page. */
function scrollProgress() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  header.appendChild(bar);
  let queued = false;
  const update = () => {
    queued = false;
    const max = root.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/* Hero: staggered entrance, then the career line steps through. */
function hero() {
  const hero = document.querySelector(".hero, .page-hero");
  if (!hero) return;
  const items = [...hero.children];
  animate(items, { opacity: [0, 1], transform: ["translateY(18px)", "none"] }, { duration: 0.8, delay: stagger(0.09, { startDelay: 0.05 }), ease });

  const steps = hero.querySelectorAll(".hero__step, .hero__arrow");
  if (steps.length) {
    const start = 0.05 + items.length * 0.09 + 0.1;
    animate(steps, { opacity: [0, 1], transform: ["translateX(-8px)", "none"] }, { duration: 0.5, delay: stagger(0.14, { startDelay: start }), ease });
  }
}

/* Blueprint CTAs: registration marks open out on hover, button settles on press. */
function blueprintButtons() {
  const offsets = { tl: [-4, -4], tr: [4, -4], bl: [-4, 4], br: [4, 4] };
  document.querySelectorAll(".btn.blueprint").forEach((btn) => {
    const corners = [...btn.querySelectorAll(".corner")];
    const springy = { type: spring, stiffness: 420, damping: 22 };
    hover(btn, () => {
      corners.forEach((c) => {
        const key = Object.keys(offsets).find((k) => c.classList.contains(k));
        const [x, y] = offsets[key] || [0, 0];
        animate(c, { transform: `translate(${x}px, ${y}px)` }, springy);
      });
      return () => animate(corners, { transform: "translate(0px, 0px)" }, springy);
    });
    press(btn, () => {
      animate(btn, { transform: "scale(0.97)" }, { duration: 0.12 });
      return () => animate(btn, { transform: "scale(1)" }, springy);
    });
  });
}

/* Sections reveal as they enter the viewport. Only elements that start below
   the fold are touched, so nothing already on screen ever blinks. */
const groups = [
  [".section-head", null],
  [".split > div:first-child", null],
  [".related-grid", "a > *"],
  [".situation-list", "li"],
  [".engagement-table", ".engagement-row"],
  [".proof-grid", ".proof-item"],
  [".rule-list--engagements", "li"],
  [".about__body", ":scope > *"],
  [".contact__inner", ":scope > *"],
  [".page-shell article > :not(.page-hero)", null],
];

function belowFold(el) {
  return el.getBoundingClientRect().top > window.innerHeight * 0.92;
}

function reveals() {
  const seen = new Set();
  groups.forEach(([selector, childSelector]) => {
    document.querySelectorAll(selector).forEach((group) => {
      if (seen.has(group) || !belowFold(group)) return;
      seen.add(group);
      const targets = childSelector ? [...group.querySelectorAll(childSelector)] : [group];
      if (!targets.length) return;
      targets.forEach((t) => { t.style.opacity = "0"; });
      inView(group, () => {
        animate(targets, { opacity: [0, 1], transform: ["translateY(22px)", "none"] }, { duration: 0.75, delay: stagger(0.07), ease });
      }, { amount: 0.15 });
    });
  });

  /* Portrait: registration marks draw in, then the photo lifts. */
  document.querySelectorAll(".about__figure").forEach((fig) => {
    if (!belowFold(fig)) return;
    const img = fig.querySelector("img");
    const corners = fig.querySelectorAll(".corner");
    if (img) img.style.opacity = "0";
    corners.forEach((c) => { c.style.opacity = "0"; });
    inView(fig, () => {
      animate(corners, { opacity: [0, 1], transform: ["scale(2.2)", "scale(1)"] }, { duration: 0.6, delay: stagger(0.06), ease });
      if (img) animate(img, { opacity: [0, 1], transform: ["scale(1.04)", "scale(1)"] }, { duration: 1, delay: 0.2, ease });
    }, { amount: 0.25 });
  });
}

if (reduced) {
  ready();
} else {
  hero();
  ready();
  scrollProgress();
  blueprintButtons();
  reveals();
}
