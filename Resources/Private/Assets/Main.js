import PhotoSwipeLightbox from "photoswipe/lightbox";

const optionsFromNeos = JSON.parse(
    document.querySelector("[data-photoswipe-options]")?.dataset?.photoswipeOptions || "{}",
);

function init(options = {}) {
    options = { ...optionsFromNeos, ...options };
    const lightbox = new PhotoSwipeLightbox({
        gallery: document.body,
        pswpModule: () => import("photoswipe"),
        ...options,
    });
    lightbox.init();
    return lightbox;
}

function triggerEvent(eventName, options = {}) {
    document.dispatchEvent(new CustomEvent(eventName, { detail: options }));
}

window.neosPhotoSwipe = init();

export default init;
