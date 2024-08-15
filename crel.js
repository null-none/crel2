// IIFE our function
((exporter) => {
  // Define our function and its properties
  // These strings are used multiple times, so this makes things smaller once compiled
  const func = "function",
    isNodeString = "isNode",
    d = document,
    // Helper functions used throughout the script
    isType = (object, type) => typeof object === type,
    // Recursively appends children to given element. As a text node if not already an element
    appendChild = (element, child) => {
      if (child !== null) {
        if (Array.isArray(child)) {
          // Support (deeply) nested child elements
          child.map((subChild) => appendChild(element, subChild));
        } else {
          if (!crel[isNodeString](child)) {
            child = d.createTextNode(child);
          }
          element.appendChild(child);
        }
      }
    };
  //
  function crel(element, settings) {
    // Define all used variables / shortcuts here, to make things smaller once compiled
    let args = arguments, // Note: assigned to a variable to assist compilers.
      index = 1,
      key,
      attribute;
    // If first argument is an element, use it as is, otherwise treat it as a tagname
    element = crel.isElement(element) ? element : d.createElement(element);
    // Check if second argument is a settings object
    if (
      isType(settings, "object") &&
      !crel[isNodeString](settings) &&
      !Array.isArray(settings)
    ) {
      // Don't treat settings as a child
      index++;
      // Go through settings / attributes object, if it exists
      for (key in settings) {
        // Store the attribute into a variable, before we potentially modify the key
        attribute = settings[key];
        // Get mapped key / function, if one exists
        key = crel.attrMap[key] || key;
        // Note: We want to prioritise mapping over properties
        if (isType(key, func)) {
          key(element, attribute);
        } else if (isType(attribute, func)) {
          // ex. onClick property
          element[key] = attribute;
        } else {
          // Set the element attribute
          element.setAttribute(key, attribute);
        }
      }
    }
    // Loop through all arguments, if any, and append them to our element if they're not `null`
    for (; index < args.length; index++) {
      appendChild(element, args[index]);
    }

    return element;
  }

  // Used for mapping attribute keys to supported versions in bad browsers, or to custom functionality
  crel.attrMap = {};
  crel.isElement = (object) => object instanceof Element;
  crel[isNodeString] = (node) => node instanceof Node;
  // Expose proxy interface
  crel.proxy = new Proxy(crel, {
    get: (target, key) => {
      !(key in crel) && (crel[key] = crel.bind(null, key));
      return crel[key];
    },
  });
  // Export crel
  exporter(crel, func);
})((product, func) => {
  if (typeof exports === "object") {
    // Export for Browserify / CommonJS format
    module.exports = product;
  } else if (typeof define === func && define.amd) {
    // Export for RequireJS / AMD format
    define(() => product);
  } else {
    // Export as a 'global' function
    this.crel = product;
  }
});
