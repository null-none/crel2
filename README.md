# crel2

The best way to make DOM elements is via `document.createElement`, but making lots of them with it is tedious.


### Installing

```bash
npm i crel2
```

```javascript
let crel = require('crel2');
```

For AMD:

```javascript
require.config({paths: { crel: 'https://example.com/static/js/crel.min.js' }});
require(['crel2'], (crel) => {
    // Your code
});
```

For standard script tag style:

```html
<script src="crel.min.js"></script>
```

### Usage

Syntax:

```javascript
// Returns a DOM element
crel(tagName / domElement, attributes, child1, child2, childN);
```

where `childN` may be:

- a DOM element,
- a string, which will be inserted as a `textNode`,
- `null`, which will be ignored, or
- an `Array` containing any of the above

### Examples

```javascript
let element = crel('div',
    crel('h1', 'Crello World!'),
    crel('p', 'This is crel'),
    crel('input', { type: 'number' })
);

// Do something with 'element'
```

You can add attributes that have dashes or reserved keywords in the name, by using strings for the objects keys:

```javascript
crel('div', { 'class': 'thing', 'data-attribute': 'majigger' });
```

You can define custom functionality for certain keys seen in the attributes
object:

```javascript
crel.attrMap['on'] = (element, value) => {
    for (let eventName in value) {
        element.addEventListener(eventName, value[eventName]);
    }
};
// Attaches an onClick event to the img element
crel('img', { on: {
    click: () => {
        console.log('Clicked');
    }
}});
```

You can pass already available elements to Crel to modify their attributes / add child elements to them

```javascript
crel(document.body, 
    crel('h1', 'Page title'),
    crel('p', 'This is a paragraph'),
    crel('ul', 
        crel('li', 'item 1'),
        crel('li', 'item 2'),
        crel('li', 'item 3')
    ),
    crel('button', {onclick: () => alert('Hello!')}, 'Click me');
);
```

You can assign child elements to variables during creation:

```javascript
let button;
let wrapper = crel('div',
    button  = crel('button')
);
```

You could probably use Crel to rearrange existing DOM elements..

```javascript
crel(someDiv, crel(someOtherDiv, anotherOne));
```

_But don't._

### Proxy support

If you are using Crel in an environment that supports Proxies, you can also use the new API:

```javascript
let crel = require('crel').proxy;

let element = crel.div(
    crel.h1('Crello World!'),
    crel.p('This is crel'),
    crel.input({ type: 'number' })
);
```
