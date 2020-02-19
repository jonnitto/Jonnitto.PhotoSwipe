import { closest } from './helper';
import openPhotoSwipe from './openPhotoSwipe';

// triggers when user clicks on thumbnail
export default function(element, selector) {
    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    let clickedGallery = closest(element, el =>
        el.hasAttribute('data-pswp-uid')
    );

    let childNodes = clickedGallery.querySelectorAll(selector.lightbox);
    let numChildNodes = childNodes.length;
    let nodeIndex = 0;
    let index;

    for (let i = 0; i < numChildNodes; i++) {
        if (childNodes[i].nodeType !== 1) {
            continue;
        }

        if (childNodes[i] === element) {
            index = nodeIndex;
            break;
        }
        nodeIndex++;
    }

    if (index >= 0) {
        openPhotoSwipe(selector, index, clickedGallery);
    }
    return false;
}
