import { closest, getTagName, getImageRatioFromUrl } from './helper';

export default async function(el, selector) {
    const LIGHBOX_ELEMENTS = el.querySelectorAll(selector.lightbox);
    let items = [];
    for (let i = 0; i < LIGHBOX_ELEMENTS.length; i++) {
        const ELEMENT = LIGHBOX_ELEMENTS[i];
        let dataset = ELEMENT.dataset;
        let size = dataset.size ? dataset.size.split('x') : [0, 0];
        let width = size[0] || dataset.width;
        let height = size[1] || dataset.height;
        let ratio = dataset.ratio;
        const HAS_JUST_ONE_DIMENSION = (!width || !height) && (height || width);

        if (ratio && HAS_JUST_ONE_DIMENSION) {
            // We have a ratio, but not both dimensions
            if (height) {
                width = Math.round(height * ratio);
            } else {
                height = Math.round(width / ratio);
            }
        } else if (!width || !height) {
            // No width and/or height is set
            const WIN_WIDTH = window.innerWidth;
            const WIN_HEIGHT = window.innerHeight;
            if (ratio) {
                // We have a ratio, but no dimensions
                width = WIN_WIDTH * 2;
                height = Math.round(width / ratio);
            } else if (dataset.ratioImage) {
                // A small ratio image is given

                // Try to get the dimensions from the filename
                let ratioFromFileName = dataset.ratioImage.match(/_Resources\/Persistent\/(.+)-(\d+x\d+)\.\w+/);
                if (ratioFromFileName && ratioFromFileName.length) {
                    ratioFromFileName = ratioFromFileName[2].split('x');
                    ratio = ratioFromFileName[0] / ratioFromFileName[1];
                } else {
                    // Download image and read size
                    ratio = await getImageRatioFromUrl(dataset.ratioImage);
                }

                // if possible use given dimensions
                if (height) {
                    width = Math.round(height * ratio);
                } else {
                    width = width || WIN_WIDTH * 2;
                    height = Math.round(width / ratio);
                }
            } else {
                // Make sure at least dimensions are set (also useful for svgs)
                width = width || WIN_WIDTH * 2;
                height = height || WIN_HEIGHT * 2;
            }
        }

        if (ratio && HAS_JUST_ONE_DIMENSION) {
            // Save this stuff for an second click
            dataset.size = `${width}x${height}`;
        }

        const PLACEHOLDER_IMAGE = ELEMENT.querySelector('img');
        let title = dataset.title;
        if (!title) {
            // Try to get a title from a figcaption
            const FIGURE = closest(ELEMENT, el => getTagName(el) === 'figure');
            const FIGCAPTION = FIGURE ? FIGURE.querySelector('figcaption') : ELEMENT.querySelector('figcaption');
            title = FIGCAPTION ? FIGCAPTION.innerHTML || false : false;
        }

        // PhotoSwipe use these properties:
        // src (path to image)
        // w (image width)
        // h (image height)
        // msrc (path to small image placeholder, large image will be loaded on top, optional)
        // html (custom HTML, optional)
        // title (The caption of the image, optional)
        items[items.length] = {
            src: ELEMENT.getAttribute('href'),
            msrc: PLACEHOLDER_IMAGE
                ? PLACEHOLDER_IMAGE.currentSrc || PLACEHOLDER_IMAGE.src || PLACEHOLDER_IMAGE.getAttribute('src')
                : null,
            w: parseInt(width, 10),
            h: parseInt(height, 10),
            title: title,
            el: ELEMENT,
            data: dataset
        };
    }
    return items;
}
