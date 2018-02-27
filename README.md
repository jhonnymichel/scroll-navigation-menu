# scroll-navigation-menu
A library to perform animated scrolling between sections and set active state in anchors as scroll happens.

## Installation
the package can be installed using npm
```
npm install --save scroll-navigation-menu
```

## Usage

### Markup:
You just need to add sections with ids and anchors pointing to them.
```html
<nav>
  <ul>
    <li>
      <a class="scroll" href="#about">About</a>
    </li>
    <li>
      <a class="scroll" href="#videos">Videos</a>
    </li>
    <li>
      <a class="scroll" href="#footer">Footer</a>
    </li>
  </ul>
</nav>

<div id="about">  
  This is the about section
</div>
<div id="about">  
  Watch videos here!
</div>
<div id="footer">  
  This is the end
</div>
```

### Style
Style is optional, it is needed to highlight the active section's anchors.
```css
.scroll {
  color: darkblue;
}

.scroll.active {
  color: orange;
}
```

### Javascript
```javascript
import ScrollNavigation from 'scroll-navigation-menu';

const scrollNavigation = new ScrollNavigation();
scrollNavigation.start();
```

## Options
An Options object can be passed when initializing ScrollNavigation.
the options with their defaults are:
```javascript
  animationDuration: 233
  activeClass: 'active'
  linksSelector: '.scroll'
  offset: 0
  ```
