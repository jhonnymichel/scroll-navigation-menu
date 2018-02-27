import animateScrollTo from 'animated-scroll-to';
import defaultSettings from './default-settings';
import { isHidden } from './utils';

class AnchorNavigation {
  constructor(settings = {}) {
    this.settings = { ...defaultSettings, ...settings};
    this._targetsPositions = new WeakMap();
    this._anchors = [];

    this.onAnchorClick = this.onAnchorClick.bind(this);
    this._mapAnchorToSectionPosition = this._mapAnchorToSectionPosition.bind(this);
    this._setCurrentHighlight = this._setCurrentHighlight.bind(this);

    window.addEventListener('resize', () => {
      this._targetsPositions = new WeakMap();
      this._anchors.forEach(this._mapAnchorToSectionPosition);
      this._setCurrentHighlight();
    });
  }

  _toggleHighlight(anchor) {
    if (anchor && isHidden(anchor)) {
      return;
    }
    this._anchors.forEach(anchor => anchor.classList.remove(this.settings.activeClass));
    if (anchor && anchor.classList) {
      anchor.classList.add(this.settings.activeClass);
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
    const positionToScroll = anchorPosition + (window.scrollY || window.pageYOffset);
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
    this._targetsPositions.set(anchor,
      (elementToScroll.getBoundingClientRect().top + this.settings.offset) +
      (window.scrollY || window.pageYOffset));
  }

  _setCurrentHighlight() {
    this._anchors.forEach(anchor => {
      const anchorTargetPosition = this._targetsPositions.get(anchor);
      if (anchorTargetPosition <= (window.scrollY || window.pageYOffset)) {
        this._toggleHighlight(anchor);
      }
    });
  }

  _setupHighlights() {
    this._targetsPositions = new WeakMap();
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
      this._anchors.forEach(anchor => anchor.removeEventListener('click', this.onAnchorClick));
      this._toggleHighlight();
    }
    window.removeEventListener('scroll', this._setCurrentHighlight, { passive: true });
    this._targetsPositions = null;
    this._anchors = null;
  }
}

export default AnchorNavigation;