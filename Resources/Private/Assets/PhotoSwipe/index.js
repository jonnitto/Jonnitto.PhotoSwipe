import { PhotoSwipe, PhotoSwipeUI, instance } from './library';
import triggerEvent from './triggerEvent';
import setDefaults from './setDefaults';
import onThumbnailsClick from './onThumbnailsClick';
import parseHash from './parseHash';
import openPhotoSwipe from './openPhotoSwipe';

if (typeof instance.defaults !== 'object') {
    instance.defaults = {};
}

if (typeof instance.pswp !== 'object') {
    instance.pswp = document.getElementById('pswp');
}

instance.open = function(items, options) {
    triggerEvent('neosPhotoSwipe.open.before', { instance, items, options });
    if (typeof options === 'undefined') {
        options = instance.defaults;
    }
    if (Object.prototype.toString.call(items) == '[object Array]') {
        // Pass data to PhotoSwipe and initialize it
        instance.gallery = new PhotoSwipe(
            instance.pswp,
            PhotoSwipeUI,
            items,
            options
        );
        instance.gallery.init();
    } else {
        return 'Please define items for neosPhotoSwipe.open';
    }
    triggerEvent('neosPhotoSwipe.open.after', { instance, items, options });
};

instance.init = function(selector) {
    triggerEvent('neosPhotoSwipe.init.before', { instance, selector });
    if (typeof selector.lightbox !== 'string') {
        selector.lightbox = '.lightbox';
    }
    instance.defaults = setDefaults(instance);

    // loop through all gallery elements and bind events
    let galleryElements = [];
    if (typeof selector.gallery === 'object') {
        if (typeof selector.gallery.length == 'number') {
            galleryElements = selector.gallery;
        } else {
            galleryElements[0] = selector.gallery;
        }
    } else if (typeof selector.gallery === 'string') {
        galleryElements = document.querySelectorAll(selector.gallery);
    } else {
        galleryElements[0] = document.body;
    }

    for (let i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
    }

    let lightbox = document.querySelectorAll(selector.lightbox);
    let lightboxLength = lightbox.length;
    while (lightboxLength--) {
        lightbox[lightboxLength].addEventListener('click', function(event) {
            event.preventDefault();
            onThumbnailsClick(this, selector);
        });
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    const hashData = parseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(
            selector,
            hashData.pid,
            galleryElements[hashData.gid - 1],
            true,
            true
        );
    }
    triggerEvent('neosPhotoSwipe.init.after', {
        instance,
        selector,
        galleryElements,
        lightbox,
        hashData
    });
};

instance.initDom = function() {
    triggerEvent('neosPhotoSwipe.initDom.before', { instance });
    let gallery = instance.pswp.getAttribute('data-gallery') || false;
    let lightbox = instance.pswp.getAttribute('data-lightbox') || false;
    instance.init({
        gallery: gallery,
        lightbox: lightbox
    });
    triggerEvent('neosPhotoSwipe.initDom.after', {
        instance,
        gallery,
        lightbox
    });
};

if (instance.pswp.getAttribute('data-init') == 'true') {
    instance.initDom();
}
