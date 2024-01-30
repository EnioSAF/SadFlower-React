export function updateStyles() {
  if (typeof window !== "undefined") {
    const screenWidth = window.innerWidth;
    const container = document.querySelector(".container");

    if (screenWidth <= 600) {
      document.body.style.fontSize = "14px";
      container.style.maxWidth = "90%";
    } else if (screenWidth <= 768) {
      document.body.style.fontSize = "16px";
      container.style.maxWidth = "80%";
    } else {
      document.body.style.fontSize = "18px";
      container.style.maxWidth = "70%";
    }
  }
}
