function closest(element, fn) {
    return element && (fn(element) ? element : closest(element.parentNode, fn));
}

export default closest;
