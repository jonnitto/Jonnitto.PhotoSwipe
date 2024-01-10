import PhotoSwipeLightbox from "photoswipe/lightbox";
import { getPswpContainer, dispatchEvent, createElement } from "./Helper";

const i18n = JSON.parse(document.querySelector("[data-photoswipe-i18n]")?.dataset?.photoswipeI18n || "{}");
let optionsFromNeos = JSON.parse(
    document.querySelector("[data-photoswipe-template-options]")?.dataset?.photoswipeTemplateOptions || "{}",
);
optionsFromNeos = { ...i18n, ...optionsFromNeos };

const wrappingClass = optionsFromNeos.wrappingClass || "jonnitto-photoswipe-content";
delete optionsFromNeos.wrappingClass;

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
        mainClass: "pswp--template",
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
    });

    lightbox.on("destroy", () => {
        dispatchEvent({ type: "template", action: "close" });
    });

    lightbox.on("contentLoad", async (event) => {
        const { content } = event;
        const element = content?.data?.element;
        const template = element?.querySelector("template");
        if (!element || !template) {
            return;
        }
        content.state = "loading";
        event.preventDefault();
        content.element = createElement(template, wrappingClass);
        content.onLoaded();
    });
    lightbox.init();
    return lightbox;
}

window.neosPhotoSwipe = window.neosPhotoSwipe || {};
window.neosPhotoSwipe.template = {
    init,
    lightbox: init(),
};
