import { closest, getTagName } from './helper';

export default function(el, selector) {
    let lighboxElements = el.querySelectorAll(selector.lightbox);
    let items = [];

    for (let i = 0; i < lighboxElements.length; i++) {
        let element = lighboxElements[i];
        let data = element.getAttribute('data-size');
        let size = data && data.length ? data.split('x') : [0, 0];
        let item = {
            src: element.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10)
        };

        if (!size.length || !item.w || !item.h) {
            let isSVG = false;
            let childNodes = element.childNodes;
            for (let x = 0; x < childNodes.length; x++) {
                let tagName = getTagName(childNodes[x]);
                if (tagName == 'svg') {
                    isSVG = true;
                } else if (tagName == 'img') {
                    let filename = childNodes[x].getAttribute('src');
                    let ext = filename.substr(filename.lastIndexOf('.') + 1);
                    if (ext == 'svg') {
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

        let figure = closest(element, el => getTagName(el) === 'figure');

        let figcaption = figure
            ? figure.querySelector('figcaption')
            : element.querySelector('figcaption');
        figcaption = figcaption ? figcaption.innerHTML || false : false;
        let image = element.querySelector('img');

        item.title =
            element.getAttribute('data-title') ||
            (figcaption ? figcaption : element.getAttribute('title')) ||
            false;

        if (image) {
            item.msrc =
                image.currentSrc || image.src || image.getAttribute('src');
        }

        item.el = element;
        items[items.length] = item;
    }

    return items;
}
