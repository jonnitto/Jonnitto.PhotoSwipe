let pswpContainer = null;

function getPswpContainer() {
    if (pswpContainer) {
        return pswpContainer;
    }
    pswpContainer = document.querySelector(".pswp");
    return pswpContainer;
}

function dispatchEvent(detail) {
    const event = new CustomEvent("neosphotoswipe", { detail });
    document.dispatchEvent(event);
}

function isNode(element) {
    return element instanceof Node;
}

function createElement(markupOrNode, wrappingClass) {
    let node = isNode(markupOrNode) ? markupOrNode : null;
    let appendElement = null;

    if (!node && typeof markupOrNode === "string") {
        node = document.createElement("template");
        node.innerHTML = markupOrNode;
    }
    if (node.tagName === "TEMPLATE") {
        appendElement = node.content.cloneNode(true);
    } else if (isNode(node)) {
        appendElement = node;
    }

    const element = document.createElement("div");
    element.classList.add(wrappingClass);
    element.append(appendElement);
    return element;
}

export { getPswpContainer, dispatchEvent, createElement };
