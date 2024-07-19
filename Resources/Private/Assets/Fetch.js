import PhotoSwipeLightbox from "photoswipe/lightbox";
import {
    getPswpContainer,
    dispatchEvent,
    createElement,
    getDataOptions,
    setPswpContainerAttributes,
    addEventListener,
} from "./Helper";

const optionsFromNeos = { ...getDataOptions("photoswipeI18n"), ...getDataOptions("photoswipeFetchOptions") };

const wrappingClass = optionsFromNeos.wrappingClass || "jonnitto-photoswipe-content";
const fetchLinkAppend = optionsFromNeos.fetchLinkAppend || "";
delete optionsFromNeos.wrappingClass;
delete optionsFromNeos.fetchLinkAppend;

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

    lightbox.on("firstUpdate", () => {
        setPswpContainerAttributes();

        const container = getPswpContainer();
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

    lightbox.on("destroy", () => {
        dispatchEvent({ type: "fetch", action: "close" });
    });

    lightbox.on("contentLoad", async (event) => {
        const { content } = event;
        const data = content?.data;
        const src = data?.element?.dataset?.pwspSrc || data?.src;
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
    const href = target.dataset.pswpSrc || target.href;
    const newElement = await fetchElement(href);
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
    dispatchEvent({ url, lightbox: url + fetchLinkAppend, type: "fetch", action: "open" });
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

    const element = createElement(markup, wrappingClass);
    toggleLoadingClass(false);
    return element;
}

function toggleLoadingClass(show = true) {
    getPswpContainer()?.classList.toggle("pswp--fetch-loading", show);
}

const lightbox = init();

addEventListener("fetch", () => {
    lightbox.init();
});

window.neosPhotoSwipe = window.neosPhotoSwipe || {};
window.neosPhotoSwipe.fetch = {
    init,
    lightbox,
};
