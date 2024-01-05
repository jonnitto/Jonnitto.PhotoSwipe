import PhotoSwipeLightbox from "photoswipe/lightbox";

const optionsFromNeos = JSON.parse(
    document.querySelector("[data-photoswipe-fetch-options]")?.dataset?.photoswipeFetchOptions || "{}",
);

const wrappingClass = optionsFromNeos.wrappingClass || "jonnitto-photoswipe-content";
const fetchLinkAppend = optionsFromNeos.fetchLinkAppend || "";
delete optionsFromNeos.contentSelector;
delete optionsFromNeos.fetchLinkAppend;

let preloaderTimeout = null;
let pswpContainer = null;

let pswpContent = null;

let currentContent = null;

function init(options = {}) {
    options = { ...optionsFromNeos, ...options };
    const lightbox = new PhotoSwipeLightbox({
        preloadFirstSlide: false,
        allowPanToNext: false,
        initialZoomLevel: 1,
        secondaryZoomLevel: 1,
        maxZoomLevel: 1,
        wheelToZoom: false,
        closeOnVerticalDrag: false,
        mainClass: "pswp--fetch",
        arrowKeys: false,

        pswpModule: () => import("photoswipe"),
        ...options,
    });

    lightbox.addFilter("isContentZoomable", () => false);
    lightbox.addFilter("preventPointerEvent", () => true);
    lightbox.on("change", showPreloader);

    lightbox.on("firstUpdate", (event) => {
        const container = getPswpContainer();
        container.setAttribute("data-turbo-temporary", true);
        // This enables default scrolling
        container?.addEventListener(
            "wheel",
            (event) => {
                event.stopImmediatePropagation();
                event.stopPropagation();
            },
            { passive: true },
        );

        // Register click handler between slides
        container?.addEventListener("click", pswpContentEventListener);
    });

    lightbox.on("contentLoad", async (event) => {
        const { content } = event;
        let src = content?.data?.src;
        if (content.type != "fetch" || !src) {
            return;
        }
        event.preventDefault();
        content.element = await fetchElement(src);
        currentContent = content.element;
    });
    lightbox.init();
    return lightbox;
}

window.neosPhotoSwipe = window.neosPhotoSwipe || {};
window.neosPhotoSwipe.fetch = {
    init,
    lightbox: init(),
};

async function pswpContentEventListener(event) {
    const target = event.target;
    if (!target.matches('[data-pswp-type="fetch"]')) {
        return;
    }
    event.preventDefault();
    showPreloader();
    toggleLoadingClass(true);

    const newElement = await fetchElement(target);
    currentContent.replaceWith(newElement);
    currentContent = newElement;
}

async function fetchElement(url) {
    const markup = await fetch(url + fetchLinkAppend).then((response) => response.text());
    const template = document.createElement("template");
    template.innerHTML = markup;
    const element = document.createElement("div");
    element.classList.add(wrappingClass);
    element.append(...template.content.children);
    hidePreloader();
    return element;
}

function showPreloader() {
    preloaderTimeout = setTimeout(() => {
        togglePreloader(true);
    }, 1000);
}

function hidePreloader() {
    preloaderTimeout && clearTimeout(preloaderTimeout);
    toggleLoadingClass(false);
    togglePreloader(false);
}

function getPswpContainer() {
    if (pswpContainer) {
        return pswpContainer;
    }
    pswpContainer = document.querySelector(".pswp");
    return pswpContainer;
}

function toggleLoadingClass(show = true) {
    getPswpContainer()?.classList.toggle("pswp--fetch-loading", show);
}

function togglePreloader(show = true) {
    getPswpContainer()?.classList.toggle("pswp--show-preloader", show);
}
