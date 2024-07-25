import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipeDynamicCaption from "photoswipe-dynamic-caption-plugin";
import { dispatchEvent, getDataOptions, setPswpContainerAttributes, addEventListener } from "./Helper";

const optionsFromNeos = { ...getDataOptions("photoswipeI18n"), ...getDataOptions("photoswipeOptions") };

function init(options = {}) {
    options = { ...optionsFromNeos, ...options };
    const lightbox = new PhotoSwipeLightbox({
        gallery: document.body,
        pswpModule: () => import("photoswipe"),
        ...options,
    });
    new PhotoSwipeDynamicCaption(lightbox, {
        type: "auto",
        captionContent: (slide) =>
            slide.data.element.closest("figure").querySelector(".pswp-caption-content")?.innerHTML || "",
    });

    lightbox.on("firstUpdate", setPswpContainerAttributes);
    lightbox.on("contentLoadImage", ({ content, isLazy }) => {
        dispatchEvent({ type: "image", action: "open", content, isLazy });
    });
    lightbox.on("destroy", () => {
        dispatchEvent({ type: "image", action: "close" });
    });
    lightbox.init();
    return lightbox;
}

const lightbox = init();

addEventListener("images", () => {
    lightbox.init();
});

window.neosPhotoSwipe = window.neosPhotoSwipe || {};
window.neosPhotoSwipe.images = {
    init,
    lightbox,
};

export default init;
