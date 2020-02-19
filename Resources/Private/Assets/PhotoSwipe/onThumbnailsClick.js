import { closest } from './helper';
import openPhotoSwipe from './openPhotoSwipe';

// triggers when user clicks on thumbnail
export default function(element, selector) {
    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    const CLICKED_GALLERY = closest(element, el => el.hasAttribute('data-pswp-uid'));

    const CHILD_NODES = CLICKED_GALLERY.querySelectorAll(selector.lightbox);
    let numChildNodes = CHILD_NODES.length;
    let nodeIndex = 0;
    let index;

    for (let i = 0; i < numChildNodes; i++) {
        if (CHILD_NODES[i].nodeType !== 1) {
            continue;
        }

        if (CHILD_NODES[i] === element) {
            index = nodeIndex;
            break;
        }
        nodeIndex++;
    }

    if (index >= 0) {
        openPhotoSwipe(selector, index, CLICKED_GALLERY);
    }
    return false;
}
