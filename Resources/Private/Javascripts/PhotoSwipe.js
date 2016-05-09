window.PhotoSwipe = require('photoswipe');
window.PhotoSwipeUI = require('photoswipe/dist/photoswipe-ui-default.js');
if (typeof neosPhotoSwipe !== 'object') {
	window.neosPhotoSwipe = {};
}
if (typeof neosPhotoSwipe.defaults !== 'object') {
	neosPhotoSwipe.defaults = {};
}

neosPhotoSwipe.init = function(gallerySelector) {
	var lightboxSelector = '.lightbox';
	var parseThumbnailElements = function(el) {
		var lighboxElements = el.querySelectorAll(lightboxSelector);
		var numNodes = lighboxElements.length;
		var items = [];
		var element;
		var size;
		var item;
		var image;
		var figcaption;

		for (var i = 0; i < numNodes; i++) {
			element = lighboxElements[i];
			size = element.getAttribute('data-size').split('x');
			item = {
				src: element.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};
			figcaption = element.parentNode.querySelector('figcaption');
			image = element.querySelector('img');

			if (figcaption) {
				item.title = figcaption.innerText || figcaption.textContent || false;
			}

			if (image) {
				item.msrc = image.getAttribute('src');
			}

			item.el = element;
			items[items.length] = item;
		}

		return items;
	};

	// find nearest parent element
	var closest = function closest(element, fn) {
		return element && (fn(element) ? element : closest(element.parentNode, fn));
	};

	// Extend Objects
	var extend = function(obj, src) {
		Object.keys(src).forEach(function(key) {
			obj[key] = src[key];
		});
		return obj;
	};

	// triggers when user clicks on thumbnail
	var onThumbnailsClick = function(event) {
		event = event || window.event;
		//jshint -W030
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		//jshint +W030

		var _this = this;

		// find index of clicked item by looping through all child nodes
		// alternatively, you may define index via data- attribute
		var clickedGallery = closest(_this, function(element) {
			return (element.hasAttribute('data-pswp-uid'));
		});
		var childNodes = clickedGallery.querySelectorAll(lightboxSelector);
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
	};

	// parse picture index and gallery index from URL (#&pid=1&gid=2)
	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1);
		var params = {};

		if (hash.length < 5) {
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}

		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	};

	var getBoolean = function(key) {
		return (pswpElement.getAttribute('data-' + key) === 'true');
	};

	var pswpElement = document.getElementById('pswp');

	var settings = {
		opacity: pswpElement.getAttribute('data-opacity'),
		effect: getBoolean('effect'),
		zoom: getBoolean('zoom')
	};

	var defaults = {
		bgOpacity: settings.opacity ? parseFloat(settings.opacity) : 0,
		zoomEl: settings.zoom,
		counterEl: getBoolean('counter'),
		closeEl: getBoolean('close'),
		captionEl: getBoolean('caption'),
		fullscreenEl: getBoolean('fullscreen'),
		close: getBoolean('close'),
		modal: getBoolean('modal'),
		shareEl: getBoolean('share'),
		arrowEl: getBoolean('arrows'),
		preloaderEl: getBoolean('preloader'),
		showHideOpacity: settings.effect ? false : true
	};

	if (settings.effect) {
		defaults.getThumbBoundsFn = function(index) {
			// See Options -> getThumbBoundsFn section of documentation for more info
			var element = items[index].el;
			var thumbnail = element.getElementsByTagName('img')[0]; // find thumbnail

			if (!element || !thumbnail) {
				return {};
			}

			var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
			var width = window.innerWidth;
			var rect = thumbnail.getBoundingClientRect();
			return {
				x: rect.left,
				y: rect.top + pageYScroll,
				w: rect.width
			};
		};
	}

	if (!settings.zoom) {
		defaults.zoomEl = false;
		defaults.maxSpreadZoom = 1;
		defaults.getDoubleTapZoom = function(isMouseClick, item) {
			return item.initialZoomLevel;
		};
	}

	extend(neosPhotoSwipe.defaults, defaults);

	neosPhotoSwipe.open = function(items, options) {
		if (typeof options === 'undefined') {
			options = neosPhotoSwipe.defaults;
		}
		if (Object.prototype.toString.call(items) == '[object Array]') {
			// Pass data to PhotoSwipe and initialize it
			neosPhotoSwipe.gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, items, options);
			neosPhotoSwipe.gallery.init();
		} else {
			return 'Please define items for neosPhotoSwipe.open';
		}
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL, opt) {
		var items = parseThumbnailElements(galleryElement);
		var options = neosPhotoSwipe.defaults;
		// define gallery index (for URL)
		options.galleryUID = galleryElement.getAttribute('data-pswp-uid');

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
		}

		if (typeof opt === 'object') {
			extend(options, opt);
		}

		// Pass data to PhotoSwipe and initialize it
		neosPhotoSwipe.open(items, options);
	};

	// loop through all gallery elements and bind events
	var galleryElements = [];
	if (typeof gallerySelector === 'object') {
		if (typeof gallerySelector.length == 'number') {
			galleryElements = gallerySelector;
		} else {
			galleryElements[0] = gallerySelector;
		}
	} else if (typeof gallerySelector === 'string') {
		galleryElements = document.querySelectorAll(gallerySelector);
	} else {
		galleryElements[0] = document.body;
	}

	for (var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i + 1);
	}

	var lightbox = document.querySelectorAll(lightboxSelector);
	var lightboxLength = lightbox.length;
	while (lightboxLength--) {
		lightbox[lightboxLength].addEventListener('click', onThumbnailsClick);
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
	if (hashData.pid && hashData.gid) {
		openPhotoSwipe(hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true);
	}
};

// execute above function
neosPhotoSwipe.init();

// (function() {
// 	var events = ['ContentModuleLoaded','PageLoaded','NodeCreated'];
// 	for (var i = 0; i < events.length; i++) {
// 		document.addEventListener('Neos.' + events[i], initPhotoSwipe);
// 	}
// })();
