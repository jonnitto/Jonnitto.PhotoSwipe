import PhotoSwipe from 'photoswipe/dist/photoswipe.js';
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default.js';

// Make the variables global
window.PhotoSwipe = PhotoSwipe;
window.PhotoSwipeUI = PhotoSwipeUI;

let instance = {};

if (typeof window.neosPhotoSwipe !== 'object') {
    window.neosPhotoSwipe = instance;
} else {
    instance = window.neosPhotoSwipe;
}

export { PhotoSwipe, PhotoSwipeUI, instance };
