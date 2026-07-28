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

const ICON_ROOT = "/Icon/Windows95/Sort by Category [Without duplicates]";
const BOOT_ICON = `${ICON_ROOT}/Programs/Program wait.ico`;
const EASTER_EGG_ICON = `${ICON_ROOT}/Dialog icons/Warning.ico`;
const WINDOW_STATES = {
  mywork: { title: "MyWork.exe | SadFlower HUB", icon: `${ICON_ROOT}/Programs/Web-document program.ico` },
  articles: { title: "Articles.exe | SadFlower HUB", icon: `${ICON_ROOT}/Folders/Folder catalog.ico` },
  mentionLegal: { title: "MentionLegal.exe | SadFlower HUB", icon: `${ICON_ROOT}/Books/Book.ico` },
  twitch: { title: "Twitch.exe | SadFlower HUB", icon: `${ICON_ROOT}/Media/Movie frame (in hands).ico` },
  whoami: { title: "WhoAmI.exe | SadFlower HUB", icon: `${ICON_ROOT}/Help/Help book.ico` },
  profile: { title: "User profile | SadFlower HUB", icon: `${ICON_ROOT}/People/User.ico` },
};

export default function BrowserTabEffects({ isBooting, activeWindow }) {
  const timeoutIds = useRef([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeouts = timeoutIds.current;
    const setTemporaryFavicon = (href) => {
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
      document
        .querySelector("link[data-sadflower-tab-default]")
        ?.setAttribute("href", "/favicon.ico");
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
        setTemporaryFavicon(BOOT_ICON);
        frame = (frame + 1) % bootTitles.length;
      };

      renderBootFrame();
      const bootInterval = window.setInterval(renderBootFrame, 500);
      return () => {
        window.clearInterval(bootInterval);
        reset();
      };
    }

    const windowState = WINDOW_STATES[activeWindow];
    if (windowState) {
      document.title = windowState.title;
      setTemporaryFavicon(windowState.icon);
      return reset;
    }

    const flash = (message = glitchText(DEFAULT_TITLE), duration = 650) => {
      document.title = message;
      setTemporaryFavicon(EASTER_EGG_ICON);
      later(reset, duration);
    };
    const scheduleAmbientGlitch = () => {
      const delay = 180000 + Math.random() * 420000;
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
      scheduleAmbientGlitch();
    }

    return () => {
      document.removeEventListener("click", handleClick);
      timeouts.forEach(window.clearTimeout);
      reset();
    };
  }, [activeWindow, isBooting]);

  return null;
}
