export default function(eventName, options) {
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
