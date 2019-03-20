window.PhotoSwipe = require("photoswipe");
window.PhotoSwipeUI = require("photoswipe/dist/photoswipe-ui-default.js");
if (typeof neosPhotoSwipe !== "object") {
    window.neosPhotoSwipe = {};
}
if (typeof neosPhotoSwipe.defaults !== "object") {
    neosPhotoSwipe.defaults = {};
}

if (typeof neosPhotoSwipe.pswp !== "object") {
    neosPhotoSwipe.pswp = document.getElementById("pswp");
}

neosPhotoSwipe.open = function(items, options) {
    if (typeof options === "undefined") {
        options = neosPhotoSwipe.defaults;
    }
    if (Object.prototype.toString.call(items) == "[object Array]") {
        // Pass data to PhotoSwipe and initialize it
        neosPhotoSwipe.gallery = new PhotoSwipe(
            neosPhotoSwipe.pswp,
            PhotoSwipeUI,
            items,
            options
        );
        neosPhotoSwipe.gallery.init();
    } else {
        return "Please define items for neosPhotoSwipe.open";
    }
};

neosPhotoSwipe.init = function(selector) {
    if (typeof selector.lightbox !== "string") {
        selector.lightbox = ".lightbox";
    }

    function parseThumbnailElements(el) {
        var lighboxElements = el.querySelectorAll(selector.lightbox);
        var numNodes = lighboxElements.length;
        var items = [];
        var element;
        var data;
        var size;
        var item;
        var image;
        var figcaption;

        for (var i = 0; i < numNodes; i++) {
            element = lighboxElements[i];
            data = element.getAttribute("data-size");
            size = data && data.length ? data.split("x") : [0, 0];
            item = {
                src: element.getAttribute("href"),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };

            if (!size.length || !item.w || !item.h) {
                var isSVG = false;
                var childNodes = element.childNodes;
                for (var x = 0; x < childNodes.length; x++) {
                    var tagName =
                        childNodes[x].nodeType == 1
                            ? childNodes[x].tagName.toLowerCase()
                            : false;
                    if (tagName == "svg") {
                        isSVG = true;
                    } else if (tagName == "img") {
                        var filename = childNodes[x].getAttribute("src");
                        var ext = filename.substr(
                            filename.lastIndexOf(".") + 1
                        );
                        if (ext == "svg") {
                            isSVG = true;
                        }
                    }
                }

                if (isSVG) {
                    item.w = window.innerWidth * 2;
                    item.h = window.innerHeight * 2;
                } else {
                    continue;
                }
            }

            var figure = closest(element, function(el) {
                return el.tagName && el.tagName.toLowerCase() === "figure";
            });

            figcaption = figure
                ? figure.querySelector("figcaption")
                : element.querySelector("figcaption");
            figcaption = figcaption ? figcaption.innerHTML || false : false;
            image = element.querySelector("img");

            item.title =
                element.getAttribute("data-title") ||
                (figcaption ? figcaption : element.getAttribute("title")) ||
                false;

            if (image) {
                item.msrc =
                    image.currentSrc || image.src || image.getAttribute("src");
            }

            item.el = element;
            items[items.length] = item;
        }

        return items;
    }

    // find nearest parent element
    function closest(element, fn) {
        return (
            element && (fn(element) ? element : closest(element.parentNode, fn))
        );
    }

    // Extend Objects
    function extend(obj, src) {
        Object.keys(src).forEach(function(key) {
            obj[key] = src[key];
        });
        return obj;
    }

    // triggers when user clicks on thumbnail
    function onThumbnailsClick(event) {
        event = event || window.event;

        event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);

        var _this = this;

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = closest(_this, function(element) {
            return element.hasAttribute("data-pswp-uid");
        });
        var childNodes = clickedGallery.querySelectorAll(selector.lightbox);
        var numChildNodes = childNodes.length;
        var nodeIndex = 0;
        var index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === _this) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    }

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    function photoswipeParseHash() {
        var hash = window.location.hash.substring(1);
        var params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split("&");
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split("=");
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    }

    function getBoolean(key) {
        return neosPhotoSwipe.pswp.getAttribute("data-" + key) !== null;
    }

    function getShare(key) {
        var value = neosPhotoSwipe.pswp.getAttribute("data-share-" + key);
        return value && typeof value == "string" ? value.trim() : false;
    }

    var settings = {
        opacity: neosPhotoSwipe.pswp.getAttribute("data-opacity"),
        effect: getBoolean("effect"),
        zoom: getBoolean("zoom")
    };

    var shareButtons = [];
    var textShare = {
        facebook: getShare("facebook"),
        twitter: getShare("twitter"),
        pinterest: getShare("pinterest"),
        download: getShare("download")
    };
    if (textShare.facebook) {
        shareButtons.push({
            id: "facebook",
            label: textShare.facebook,
            url: "https://www.facebook.com/sharer/sharer.php?u={{url}}"
        });
    }
    if (textShare.twitter) {
        shareButtons.push({
            id: "twitter",
            label: textShare.twitter,
            url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"
        });
    }
    if (textShare.pinterest) {
        shareButtons.push({
            id: "pinterest",
            label: textShare.pinterest,
            url:
                "http://www.pinterest.com/pin/create/button/" +
                "?url={{url}}&media={{image_url}}&description={{text}}"
        });
    }
    if (textShare.download) {
        shareButtons.push({
            id: "download",
            label: textShare.download,
            url: "{{raw_image_url}}",
            download: true
        });
    }

    var defaults = {
        bgOpacity: settings.opacity ? parseFloat(settings.opacity) : 0,
        counterEl: getBoolean("counter"),
        closeEl: getBoolean("close"),
        captionEl: getBoolean("caption"),
        fullscreenEl: getBoolean("fullscreen"),
        close: getBoolean("close"),
        modal: getBoolean("modal"),
        shareEl: getBoolean("share"),
        arrowEl: getBoolean("arrows"),
        preloaderEl: getBoolean("preloader"),
        history: getBoolean("history"),
        showHideOpacity: settings.effect ? false : true,
        shareButtons: shareButtons
    };

    if (!settings.zoom) {
        defaults.zoomEl = false;
        defaults.maxSpreadZoom = 1;
        defaults.getDoubleTapZoom = function(isMouseClick, item) {
            return item.initialZoomLevel;
        };
    }

    extend(neosPhotoSwipe.defaults, defaults);

    function openPhotoSwipe(
        index,
        galleryElement,
        disableAnimation,
        fromURL,
        opt
    ) {
        var items = parseThumbnailElements(galleryElement);
        var options = neosPhotoSwipe.defaults;

        // define gallery index (for URL)
        options.galleryUID = galleryElement.getAttribute("data-pswp-uid");

        if (settings.effect) {
            options.showHideOpacity = false;
            options.getThumbBoundsFn = function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var element = items[index].el;
                var thumbnail = element.getElementsByTagName("img")[0]; // find thumbnail

                if (!element || !thumbnail) {
                    options.showHideOpacity = true;
                    return {};
                }

                var pageYScroll =
                    window.pageYOffset || document.documentElement.scrollTop;
                var rect = thumbnail.getBoundingClientRect();

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
                for (var j = 0; j < items.length; j++) {
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

        if (typeof opt === "object") {
            extend(options, opt);
        }

        // Pass data to PhotoSwipe and initialize it
        neosPhotoSwipe.open(items, options);
    }

    // loop through all gallery elements and bind events
    var galleryElements = [];
    if (typeof selector.gallery === "object") {
        if (typeof selector.gallery.length == "number") {
            galleryElements = selector.gallery;
        } else {
            galleryElements[0] = selector.gallery;
        }
    } else if (typeof selector.gallery === "string") {
        galleryElements = document.querySelectorAll(selector.gallery);
    } else {
        galleryElements[0] = document.body;
    }

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute("data-pswp-uid", i + 1);
    }

    var lightbox = document.querySelectorAll(selector.lightbox);
    var lightboxLength = lightbox.length;
    while (lightboxLength--) {
        lightbox[lightboxLength].addEventListener("click", onThumbnailsClick);
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(
            hashData.pid,
            galleryElements[hashData.gid - 1],
            true,
            true
        );
    }
};

neosPhotoSwipe.initDom = function() {
    var gallery = neosPhotoSwipe.pswp.getAttribute("data-gallery") || false;
    var lightbox = neosPhotoSwipe.pswp.getAttribute("data-lightbox") || false;
    neosPhotoSwipe.init({
        gallery: gallery,
        lightbox: lightbox
    });
};

if (neosPhotoSwipe.pswp.getAttribute("data-init") == "true") {
    neosPhotoSwipe.initDom();
}
