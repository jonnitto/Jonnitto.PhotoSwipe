import PhotoSwipeLightbox from "photoswipe/lightbox";
import { dispatchEvent } from "./Helper";

const i18n = JSON.parse(document.querySelector("[data-photoswipe-i18n]")?.dataset?.photoswipeI18n || "{}");
let optionsFromNeos = JSON.parse(
    document.querySelector("[data-photoswipe-options]")?.dataset?.photoswipeOptions || "{}",
);
optionsFromNeos = { ...i18n, ...optionsFromNeos };

function init(options = {}) {
    options = { ...optionsFromNeos, ...options };
    const lightbox = new PhotoSwipeLightbox({
        gallery: document.body,
        pswpModule: () => import("photoswipe"),
        ...options,
    });
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
