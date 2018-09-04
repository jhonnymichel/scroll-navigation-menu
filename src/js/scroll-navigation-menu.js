import animateScrollTo from 'animated-scroll-to';
import defaultSettings from './default-settings';
import { isHidden, isScrollInRange, getScrollPosition } from './utils';

class ScrollNavigation {
  constructor(settings = {}) {
    this.settings = { ...defaultSettings, ...settings};
    this._targetsRanges = new WeakMap();
    this._anchors = [];

    this.onAnchorClick = this.onAnchorClick.bind(this);
    this._mapAnchorToSectionPosition = this._mapAnchorToSectionPosition.bind(this);
    this._setCurrentHighlight = this._setCurrentHighlight.bind(this);

    window.addEventListener('resize', () => {
      this._targetsRanges = new WeakMap();
      this._anchors.forEach(this._mapAnchorToSectionPosition);
      this._setCurrentHighlight();
    });
  }

  _updateAnchorActiveState(anchor, active=true) {
    if (anchor && isHidden(anchor)) {
      return;
    }
    if (anchor && anchor.classList) {
      if (active) {
        anchor.classList.add(this.settings.activeClass);
      } else {
        anchor.classList.remove(this.settings.activeClass);
      }
    }
  }

  onAnchorClick(e) {
    e.preventDefault();
    const anchor = e.currentTarget;
    // this is needed since the href attr might have more than just the hash
    const targetAnchor = anchor.getAttribute('href').split("#")[1];
    const elementToScroll = document.getElementById(targetAnchor);
    if (!elementToScroll) {
      return;
    }
    const anchorPosition = elementToScroll.getBoundingClientRect().top;
    const positionToScroll = anchorPosition + getScrollPosition();
    animateScrollTo(positionToScroll + this.settings.offset, {
      minDuration: this.settings.animationDuration, maxDuration: this.settings.animationDuration,
      onComplete() {
        anchor.blur();
      }
    });
  }

  _mapAnchorToSectionPosition(anchor) {
    // this is needed since the href attr might have more than just the hash
    const targetAnchor = anchor.getAttribute('href').split("#")[1];
    const elementToScroll = document.getElementById(targetAnchor);
    if(!elementToScroll) {
      return;
    }
    const elementBoundaries = elementToScroll.getBoundingClientRect();
    const elementInitialPosition = (elementBoundaries.top + this.settings.offset) + getScrollPosition();
    const elementEndPosition = elementInitialPosition + elementBoundaries.height;
    this._targetsRanges.set(anchor, [elementInitialPosition, elementEndPosition]);
  }

  _setCurrentHighlight() {
    this._anchors.forEach(anchor => {
      const anchorTargetRange = this._targetsRanges.get(anchor);
      if(anchorTargetRange && isScrollInRange(anchorTargetRange)) {
        this._updateAnchorActiveState(anchor);
      } else {
        this._updateAnchorActiveState(anchor, false);
      }
    });
  }

  _setupHighlights() {
    this._targetsRanges = new WeakMap();
    this._anchors.forEach(this._mapAnchorToSectionPosition);
    window.addEventListener('scroll', this._setCurrentHighlight, { passive: true });
  }

  start() {
    this._anchors = [ ...document.querySelectorAll(this.settings.linksSelector) ];
    this._anchors.forEach(anchor => anchor.addEventListener('click', this.onAnchorClick));
    this._setupHighlights();
    this._setCurrentHighlight();
  }

  stop() {
    if (this._anchors && this._anchors.length) {
      this._anchors.forEach(anchor => {
        anchor.removeEventListener('click', this.onAnchorClick)
        this._updateAnchorActiveState(anchor, false);
      });
    }
    window.removeEventListener('scroll', this._setCurrentHighlight, { passive: true });
    this._targetsRanges = null;
    this._anchors = null;
  }

  scrollTo(target, options={}) {
    var target = document.querySelector(target);
    animateScrollTo(target, {
      minDuration: this.settings.animationDuration, maxDuration: this.settings.animationDuration, ...options
    });
  }
}

export default ScrollNavigation;
