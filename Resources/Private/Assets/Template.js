import PhotoSwipeLightbox from "photoswipe/lightbox";
import {
    getPswpContainer,
    dispatchEvent,
    createElement,
    getDataOptions,
    setPswpContainerAttributes,
    addEventListener,
} from "./Helper";

const optionsFromNeos = { ...getDataOptions("photoswipeI18n"), ...getDataOptions("photoswipeTemplateOptions") };

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

const lightbox = init();

addEventListener("template", () => {
    lightbox.init();
});

window.neosPhotoSwipe = window.neosPhotoSwipe || {};
window.neosPhotoSwipe.template = {
    init,
    lightbox,
};
