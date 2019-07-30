export default function(element) {
    return element.nodeType == 1 ? element.tagName.toLowerCase() : false;
}
