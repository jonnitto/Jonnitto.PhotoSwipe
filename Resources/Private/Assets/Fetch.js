import PhotoSwipeLightbox from "photoswipe/lightbox";

const i18n = JSON.parse(document.querySelector("[data-photoswipe-i18n]")?.dataset?.photoswipeI18n || "{}");
let optionsFromNeos = JSON.parse(
    document.querySelector("[data-photoswipe-fetch-options]")?.dataset?.photoswipeFetchOptions || "{}",
);
optionsFromNeos = { ...i18n, ...optionsFromNeos };

const wrappingClass = optionsFromNeos.wrappingClass || "jonnitto-photoswipe-content";
const fetchLinkAppend = optionsFromNeos.fetchLinkAppend || "";
delete optionsFromNeos.contentSelector;
delete optionsFromNeos.fetchLinkAppend;

let pswpContainer = null;
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
        preloaderDelay: 1000,

        pswpModule: () => import("photoswipe"),
        ...options,
    });

    lightbox.addFilter("isContentZoomable", () => false);
    lightbox.addFilter("preventPointerEvent", () => true);

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
        content.state = "loading";
        event.preventDefault();
        const element = await fetchElement(src);
        content.element = element;
        currentContent = content.element;
        content.onLoaded();
    });
    lightbox.init();
    return lightbox;
}

async function pswpContentEventListener(event) {
    const target = event.target;
    if (!target.matches('[data-pswp-type="fetch"]')) {
        return;
    }
    event.preventDefault();
    const newElement = await fetchElement(target.href);
    currentContent.replaceWith(newElement);
    currentContent = newElement;
}

async function fetchUrl(url, fetchLinkAppend) {
    const response = await fetch(url + fetchLinkAppend);
    if (!response.ok) {
        throw new Error(optionsFromNeos.errorMsg);
    }
    const markup = await response.text();
    url = completeUrl(url);
    const event = new CustomEvent("neosphotoswipe", {
        detail: { url, lightbox: url + fetchLinkAppend, type: "fetch" },
    });
    document.dispatchEvent(event);
    return markup;
}

function completeUrl(url) {
    const reg = new RegExp("^(http|https)://", "i");
    if (reg.test(url)) {
        return url;
    }
    return window.location.origin + (url.startsWith("/") ? "" : "/") + url;
}

async function fetchElement(url) {
    toggleLoadingClass(true);
    const markup = await fetchUrl(url, fetchLinkAppend).catch((error) => {
        const message = error.message.replace('"%s"', url);
        return `<p class="jonnitto-photoswipe-content__error">${message}</p>`;
    });

    const template = document.createElement("template");
    template.innerHTML = markup;
    const element = document.createElement("div");
    element.classList.add(wrappingClass);
    element.append(...template.content.children);
    toggleLoadingClass(false);
    return element;
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

window.neosPhotoSwipe = window.neosPhotoSwipe || {};
window.neosPhotoSwipe.fetch = {
    init,
    lightbox: init(),
};
