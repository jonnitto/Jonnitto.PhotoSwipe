import parseThumbnailElements from './parseThumbnailElements';
import extend from './extend';

export default function(
    selector,
    index,
    galleryElement,
    disableAnimation,
    fromURL,
    opt
) {
    let items = parseThumbnailElements(galleryElement, selector);
    let options = window.neosPhotoSwipe.defaults;

    // define gallery index (for URL)
    options.galleryUID = galleryElement.getAttribute('data-pswp-uid');

    if (options.effect) {
        options.showHideOpacity = false;
        options.getThumbBoundsFn = function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            let element = items[index].el;
            let thumbnail = element.querySelector('img'); // find thumbnail

            if (!element || !thumbnail) {
                options.showHideOpacity = true;
                return {};
            }

            let pageYScroll =
                window.pageYOffset || document.documentElement.scrollTop;
            let rect = thumbnail.getBoundingClientRect();

            return {
                x: rect.left,
                y: rect.top + pageYScroll,
                w: rect.width
            };
        };
    }

    // PhotoSwipe opened from URL
    if (fromURL) {
        if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (let j = 0; j < items.length; j++) {
                if (items[j].pid == index) {
                    options.index = j;
                    break;
                }
            }
        } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
        }
    } else {
        options.index = parseInt(index, 10);
    }

    // exit if index not found
    if (isNaN(options.index)) {
        return;
    }

    if (disableAnimation) {
        options.showAnimationDuration = 0;
        setTimeout(function() {
            options.showAnimationDuration = 333;
        }, 333);
    }

    if (typeof opt === 'object') {
        extend(options, opt);
    }

    // Pass data to PhotoSwipe and initialize it
    window.neosPhotoSwipe.open(items, options);
}
