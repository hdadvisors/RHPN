document.addEventListener("DOMContentLoaded", () => {
  const selectors = [
    "#scrolly-inheritance",
    "#scrolly-signals",
    "#scrolly-chart",
    "#scrolly-cluster",
    "#scrolly-block",
    "#scrolly-contrast",
    "#scrolly-holc",
    "#scrolly-types",
    "#scrolly-zones"
  ];

  const viewer = document.createElement("dialog");
  viewer.className = "chart-lightbox";
  viewer.setAttribute("aria-label", "Expanded chart");

  const close = document.createElement("button");
  close.className = "chart-lightbox-close";
  close.type = "button";
  close.setAttribute("aria-label", "Close expanded chart");
  close.textContent = "Close";

  const expanded = document.createElement("img");
  expanded.alt = "";

  viewer.append(close, expanded);
  document.body.append(viewer);

  const visibleImage = section => {
    const images = Array.from(section.querySelectorAll(
      ".chart-stack > img, .media-stack > img, .cluster-finding-figure"
    ));
    const visible = images.filter(image => {
      const style = getComputedStyle(image);
      return style.display !== "none" && style.visibility !== "hidden" &&
        Number.parseFloat(style.opacity) > 0.5;
    });
    return visible.at(-1) || images[0];
  };

  const open = section => {
    const image = visibleImage(section);
    if (!image) return;
    const described = section.querySelector("img:not([aria-hidden='true'])");
    expanded.src = image.currentSrc || image.src;
    expanded.alt = image.alt || described?.alt || "Expanded chart";
    viewer.showModal();
    document.documentElement.classList.add("chart-lightbox-open");
  };

  selectors.forEach(selector => {
    const section = document.querySelector(selector);
    if (!section) return;
    const holder = section.querySelector(
      ".chart-stack, .media-stack, .cluster-visual"
    );
    if (!holder) return;

    const button = document.createElement("button");
    button.className = "chart-zoom-button";
    button.type = "button";
    button.textContent = "Enlarge";
    button.setAttribute("aria-label", "Enlarge chart");
    button.addEventListener("click", () => open(section));
    holder.append(button);
  });

  close.addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("close", () => {
    document.documentElement.classList.remove("chart-lightbox-open");
    expanded.removeAttribute("src");
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && viewer.open) {
      event.preventDefault();
      viewer.close();
    }
  });
});
