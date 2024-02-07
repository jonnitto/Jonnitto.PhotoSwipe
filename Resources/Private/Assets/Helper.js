const convertCamelCase = (string) => string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
const getDataOptions = (dataSetName, fallback = "{}") =>
    JSON.parse(document.querySelector(`[data-${convertCamelCase(dataSetName)}]`)?.dataset?.[dataSetName] || fallback);

const photoswipeAttributes = getDataOptions("photoswipeAttributes", false);
const getPswpContainer = () => document.querySelector(".pswp");

function setPswpContainerAttributes() {
    if (!photoswipeAttributes) {
        return;
    }
    const container = getPswpContainer();
    if (!container) {
        return;
    }
    Object.entries(photoswipeAttributes).forEach(([key, value]) => {
        if (key === "class") {
            container.classList.add(...value.split(" "));
            return;
        }
        container.setAttribute(key, value);
    });
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

export { getPswpContainer, dispatchEvent, createElement, getDataOptions, setPswpContainerAttributes };
