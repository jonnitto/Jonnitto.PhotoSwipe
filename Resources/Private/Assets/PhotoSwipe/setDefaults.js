import { getBoolean, getShare, extend } from './helper';

export default function(object) {
    let dataset = object.pswp.dataset;

    let settings = {
        opacity: dataset.opacity ? parseFloat(dataset.opacity) : 0.8,
        effect: getBoolean(dataset, 'effect'),
        zoom: getBoolean(dataset, 'zoom')
    };
    let shareButtons = [];
    let facebook = getShare(dataset, 'facebook');
    let twitter = getShare(dataset, 'twitter');
    let pinterest = getShare(dataset, 'pinterest');
    let download = getShare(dataset, 'download');

    if (facebook) {
        shareButtons.push({
            id: 'facebook',
            label: facebook,
            url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}'
        });
    }
    if (twitter) {
        shareButtons.push({
            id: 'twitter',
            label: twitter,
            url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'
        });
    }
    if (pinterest) {
        shareButtons.push({
            id: 'pinterest',
            label: pinterest,
            url: 'http://www.pinterest.com/pin/create/button/' + '?url={{url}}&media={{image_url}}&description={{text}}'
        });
    }
    if (download) {
        shareButtons.push({
            id: 'download',
            label: download,
            url: '{{raw_image_url}}',
            download: true
        });
    }

    let defaults = {
        effect: settings.effect,
        bgOpacity: settings.opacity ? parseFloat(settings.opacity) : 0,
        counterEl: getBoolean(dataset, 'counter'),
        closeEl: getBoolean(dataset, 'close'),
        captionEl: getBoolean(dataset, 'caption'),
        fullscreenEl: getBoolean(dataset, 'fullscreen'),
        close: getBoolean(dataset, 'close'),
        modal: getBoolean(dataset, 'modal'),
        shareEl: getBoolean(dataset, 'share'),
        arrowEl: getBoolean(dataset, 'arrows'),
        preloaderEl: getBoolean(dataset, 'preloader'),
        history: getBoolean(dataset, 'history'),
        showHideOpacity: !settings.effect,
        shareButtons: shareButtons,
        tapToClose: getBoolean(dataset, 'tapToClose'),
        tapToToggleControls: getBoolean(dataset, 'tapToToggleControls'),
        clickToCloseNonZoomable: getBoolean(dataset, 'clickToCloseNonZoomable'),
        indexIndicatorSep: dataset.indicator
    };

    if (!settings.zoom) {
        defaults.zoomEl = false;
        defaults.maxSpreadZoom = 1;
        defaults.getDoubleTapZoom = function(isMouseClick, item) {
            return item.initialZoomLevel;
        };
    }

    return extend(object.defaults, defaults);
}
