function closest(element, fn) {
    return element && (fn(element) ? element : closest(element.parentNode, fn));
}

function extend(obj, src) {
    Object.keys(src).forEach(function (key) {
        obj[key] = src[key];
    });
    return obj;
}

function getBoolean(dataset, key) {
    return dataset[key] !== undefined;
}

function getShare(dataset, key) {
    let VALUE = dataset[`share-${key}`];
    return VALUE && typeof VALUE == 'string' ? VALUE.trim() : false;
}

function getTagName(element) {
    return element.nodeType == 1 ? element.tagName.toLowerCase() : false;
}

function triggerEvent(eventName, options) {
    let event;
    if (!options) {
        options = {};
    }
    if (window.CustomEvent) {
        event = new CustomEvent(eventName, { detail: options });
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, options);
    }
    document.dispatchEvent(event);
}

function getImageRatioFromUrl(url) {
    return new Promise((resolve) => {
        let image = new Image();
        image.addEventListener('load', () => {
            resolve(image.naturalWidth / image.naturalHeight);
        });
        image.src = url;
    });
}

const canUseWebP = (() => {
    let elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    return false;
})();

export { closest, extend, getBoolean, getShare, getTagName, getImageRatioFromUrl, triggerEvent, canUseWebP };
