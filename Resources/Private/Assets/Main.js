import PhotoSwipeLightbox from "photoswipe/lightbox";
import { dispatchEvent, getDataOptions, setPswpContainerAttributes } from "./Helper";

const optionsFromNeos = { ...getDataOptions("photoswipeI18n"), ...getDataOptions("photoswipeOptions") };

function init(options = {}) {
    options = { ...optionsFromNeos, ...options };
    const lightbox = new PhotoSwipeLightbox({
        gallery: document.body,
        pswpModule: () => import("photoswipe"),
        ...options,
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

window.neosPhotoSwipe = window.neosPhotoSwipe || {};
window.neosPhotoSwipe.images = {
    init,
    lightbox: init(),
};

export default init;
