import { useEffect, useRef } from "react";

const DEFAULT_TITLE = "SadFlower HUB";

const glitchText = (text) => {
  const marks = ["̴", "̵", "̶", "̷", "̸"];
  return text
    .split("")
    .map((character) =>
      character !== " " && Math.random() > 0.45
        ? `${character}${marks[Math.floor(Math.random() * marks.length)]}`
        : character
    )
    .join("");
};

const faviconSvg = (glitch = false) => {
  const shift = glitch ? Math.floor(Math.random() * 5) - 2 : 0;
  const noise = glitch
    ? '<path d="M1 5h5v2H1zm9-3h5v2h-5zm-3 11h8v2H7z" fill="#00ff9c" opacity=".75"/>'
    : "";

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="2" fill="#272131"/>
      <g transform="translate(${shift} 0)">
        <circle cx="8" cy="8" r="5.4" fill="#5e526e"/>
        <circle cx="8" cy="8" r="3.2" fill="#272131"/>
        <circle cx="8" cy="8" r="1.4" fill="#d8d1e0"/>
      </g>
      ${noise}
    </svg>` )}`;
};

export default function BrowserTabEffects({ isBooting }) {
  const timeoutIds = useRef([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeouts = timeoutIds.current;
    const setGlitchFavicon = (href) => {
      let favicon = document.querySelector("link[data-sadflower-tab-glitch]");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.dataset.sadflowerTabGlitch = "true";
        document.head.appendChild(favicon);
      }
      favicon.href = href;
    };
    const reset = () => {
      document.title = DEFAULT_TITLE;
      document.querySelector("link[data-sadflower-tab-glitch]")?.remove();
    };
    const later = (callback, delay) => {
      const id = window.setTimeout(callback, delay);
      timeouts.push(id);
      return id;
    };

    if (isBooting) {
      const bootTitles = [
        "◌ INITIALISATION SADFLOWER CORE",
        "◍ INITIALISATION SADFLOWER CORE",
        "◉ INITIALISATION SADFLOWER CORE",
        "◍ INITIALISATION SADFLOWER CORE",
      ];
      let frame = 0;
      const renderBootFrame = () => {
        document.title = bootTitles[frame];
        setGlitchFavicon(faviconSvg(frame % 2 === 0));
        frame = (frame + 1) % bootTitles.length;
      };

      renderBootFrame();
      const bootInterval = window.setInterval(renderBootFrame, 500);
      return () => {
        window.clearInterval(bootInterval);
        reset();
      };
    }

    const flash = (message = glitchText(DEFAULT_TITLE), duration = 650) => {
      document.title = message;
      setGlitchFavicon(faviconSvg(true));
      later(reset, duration);
    };
    const scheduleAmbientGlitch = () => {
      const delay = 45000 + Math.random() * 75000;
      later(() => {
        if (!document.hidden) flash();
        scheduleAmbientGlitch();
      }, delay);
    };
    const handleClick = (event) => {
      const target = event.target.closest("button, [role='button'], a, .icon, .window");
      if (!target || reducedMotion) return;

      const label = `${target.getAttribute("aria-label") || ""} ${target.textContent || ""}`.toLowerCase();
      if (label.includes("close") || label.includes("fermer")) {
        flash("S̷e̸e̴ ̶y̸o̵u̶.", 900);
      } else if (target.classList.contains("icon")) {
        flash("O̷p̶e̴n̸i̵n̴g̸…", 500);
      } else if (Math.random() < 0.16) {
        flash(glitchText("It noticed."), 600);
      }
    };

    reset();
    document.addEventListener("click", handleClick);
    if (!reducedMotion) {
      later(() => flash(glitchText(DEFAULT_TITLE), 1000), 5000 + Math.random() * 7000);
      scheduleAmbientGlitch();
    }

    return () => {
      document.removeEventListener("click", handleClick);
      timeouts.forEach(window.clearTimeout);
      reset();
    };
  }, [isBooting]);

  return null;
}
