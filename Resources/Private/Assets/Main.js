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

window.neosPhotoSwipe = window.neosPhotoSwipe || {};
window.neosPhotoSwipe.images = {
    init,
    lightbox: init(),
};

export default init;
