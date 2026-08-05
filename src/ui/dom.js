import {

    escapeHtml

} from "../core/security.js";

/**
 * ---------------------------------------------------------
 * Select First Matching Element
 * ---------------------------------------------------------
 */

export function select(selector, parent = document) {

    return parent.querySelector(selector);

}

/**
 * ---------------------------------------------------------
 * Select All Matching Elements
 * ---------------------------------------------------------
 */

export function selectAll(selector, parent = document) {

    return [...parent.querySelectorAll(selector)];

}

/**
 * ---------------------------------------------------------
 * Create HTML Element
 * ---------------------------------------------------------
 */

export function createElement(tagName) {

    return document.createElement(tagName);

}

/**
 * ---------------------------------------------------------
 * Set Safe Text
 * ---------------------------------------------------------
 */

export function setText(element, text) {

    if (!element) {

        return;

    }

    element.textContent = text ?? "";

}

/**
 * ---------------------------------------------------------
 * Set Safe HTML
 * Prevent XSS
 * ---------------------------------------------------------
 */

export function setHtml(element, html) {

    if (!element) {

        return;

    }

    element.innerHTML = escapeHtml(

        html ?? ""

    );

}

/**
 * ---------------------------------------------------------
 * Add CSS Class
 * ---------------------------------------------------------
 */

export function addClass(element, className) {

    if (!element) {

        return;

    }

    element.classList.add(className);

}

/**
 * ---------------------------------------------------------
 * Remove CSS Class
 * ---------------------------------------------------------
 */

export function removeClass(element, className) {

    if (!element) {

        return;

    }

    element.classList.remove(className);

}

/**
 * ---------------------------------------------------------
 * Toggle CSS Class
 * ---------------------------------------------------------
 */

export function toggleClass(

    element,

    className,

    force

) {

    if (!element) {

        return;

    }

    element.classList.toggle(

        className,

        force

    );

}

/**
 * ---------------------------------------------------------
 * Set Attribute
 * ---------------------------------------------------------
 */

export function setAttribute(

    element,

    name,

    value

) {

    if (!element) {

        return;

    }

    element.setAttribute(

        name,

        value

    );

}

/**
 * ---------------------------------------------------------
 * Remove Attribute
 * ---------------------------------------------------------
 */

export function removeAttribute(

    element,

    name

) {

    if (!element) {

        return;

    }

    element.removeAttribute(name);

}

/**
 * ---------------------------------------------------------
 * Append Child
 * ---------------------------------------------------------
 */

export function append(

    parent,

    ...children

) {

    if (!parent) {

        return;

    }

    children.forEach(child => {

        if (child) {

            parent.appendChild(child);

        }

    });

}

/**
 * ---------------------------------------------------------
 * Remove Element
 * ---------------------------------------------------------
 */

export function remove(element) {

    if (

        element &&

        element.parentNode

    ) {

        element.parentNode.removeChild(

            element

        );

    }

}

/**
 * ---------------------------------------------------------
 * Remove All Children
 * ---------------------------------------------------------
 */

export function clear(element) {

    if (!element) {

        return;

    }

    element.replaceChildren();

}

/**
 * ---------------------------------------------------------
 * Show Element
 * ---------------------------------------------------------
 */

export function show(element) {

    if (!element) {

        return;

    }

    element.hidden = false;

}

/**
 * ---------------------------------------------------------
 * Hide Element
 * ---------------------------------------------------------
 */

export function hide(element) {

    if (!element) {

        return;

    }

    element.hidden = true;

}

/**
 * ---------------------------------------------------------
 * Add Event Listener
 * ---------------------------------------------------------
 */

export function on(

    element,

    event,

    callback,

    options

) {

    if (!element) {

        return;

    }

    element.addEventListener(

        event,

        callback,

        options

    );

}

/**
 * ---------------------------------------------------------
 * Remove Event Listener
 * ---------------------------------------------------------
 */

export function off(

    element,

    event,

    callback

) {

    if (!element) {

        return;

    }

    element.removeEventListener(

        event,

        callback

    );

}

/**
 * ---------------------------------------------------------
 * Create Document Fragment
 * ---------------------------------------------------------
 */

export function createFragment() {

    return document.createDocumentFragment();

}