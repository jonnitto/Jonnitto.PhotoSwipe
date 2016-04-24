var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI = require('photoswipe/dist/photoswipe-ui-default.js');

window.initPhotoSwipeFromDOM = function(gallerySelector) {
	var lightboxSelector = '.lightbox';
	var parseThumbnailElements = function(el) {
		var thumbElements = el.querySelectorAll(lightboxSelector);
		var numNodes = thumbElements.length;
		var items = [];
		var figureEl;
		var linkEl;
		var size;
		var item;
		var figcaption;

		for (var i = 0; i < numNodes; i++) {
			linkEl = thumbElements[i];
			size = linkEl.getAttribute('data-size').split('x');
			item = {
				src: linkEl.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};
			figureEl = linkEl.parentNode;

			if (figureEl.children.length > 1) {
				figcaption = figureEl.children[1];
				item.title = figcaption.innerText || figcaption.textContent || false;
			}

			if (linkEl.children.length > 0) {
				// <img> thumbnail element, retrieving thumbnail url
				item.msrc = linkEl.children[0].getAttribute('src');
			}

			item.el = figureEl; // save link to element for getThumbBoundsFn
			items.push(item);
		}

		return items;
	};

	// find nearest parent element
	var closest = function closest(element, fn) {
		return element && (fn(element) ? element : closest(element.parentNode, fn));
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
			// open PhotoSwipe if valid index found
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

	var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = document.querySelectorAll('.pswp')[0];
		var gallery;
		var options;
		var items;

		items = parseThumbnailElements(galleryElement);

		// define options (if needed)
		options = {

			// define gallery index (for URL)
			galleryUID: galleryElement.getAttribute('data-pswp-uid'),

			getThumbBoundsFn: function(index) {
				// See Options -> getThumbBoundsFn section of documentation for more info
				var thumbnail = items[index].el.getElementsByTagName('img')[0]; // find thumbnail
				var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
				var rect = thumbnail.getBoundingClientRect();

				return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
			}

		};

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

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, items, options);
		gallery.init();
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
initPhotoSwipeFromDOM();

// (function() {
// 	var events = ['ContentModuleLoaded','PageLoaded','NodeCreated'];
// 	for (var i = 0; i < events.length; i++) {
// 		document.addEventListener('Neos.' + events[i], initPhotoSwipe);
// 	}
// })();
