import animateScrollTo from 'animated-scroll-to';
import defaultSettings from './default-settings';
import { isHidden } from './utils';

class AnchorNavigation {
  constructor(settings = {}) {
    this.settings = { ...defaultSettings, ...settings};
    this._targetsPositions = new WeakMap();
    this._highlightableAnchors = [];
    this._anchors = [];

    this.onAnchorClick = this.onAnchorClick.bind(this);
    this._mapAnchorToSectionPosition = this._mapAnchorToSectionPosition.bind(this);
    this._onUserScroll = this._onUserScroll.bind(this);

    window.addEventListener('resize', () => {
      this._targetsPositions = new WeakMap();
      this._anchors.forEach(this._mapAnchorToSectionPosition);
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
    // this is needed since the href attr starts with an /
    const targetAnchor = anchor.getAttribute('href').slice(1);
    const elementToScroll = document.querySelector(targetAnchor);
    if (!elementToScroll) {
      return;
    }
    animateScrollTo(elementToScroll, {
      minDuration: this.settings.animationDuration, maxDuration: this.settings.animationDuration,
      onComplete() {
        anchor.blur();
      }
    });
  }

  _mapAnchorToSectionPosition(anchor) {
    // this is needed since the href attr starts with an /
    const targetAnchor = anchor.getAttribute('href').slice(1);
    const elementToScroll = document.querySelector(targetAnchor);
    this._targetsPositions.set(anchor, elementToScroll.getBoundingClientRect().top);
  }

  _onUserScroll() {
    this._highlightableAnchors.forEach(anchor => {
      const anchorTargetPosition = this._targetsPositions.get(anchor);
      if (anchorTargetPosition <= (window.scrollY || window.pageYOffset)) {
        this._toggleHighlight(anchor);
      }
    });
  }

  _setupHighlights() {
    this._targetsPositions = new WeakMap();
    this._anchors.forEach(this._mapAnchorToSectionPosition);
    window.addEventListener('scroll', this._onUserScroll, { passive: true });
  }

  start() {
    this._anchors = [ ...document.querySelectorAll(this.settings.linksSelector) ];
    this._anchors.forEach(anchor => anchor.addEventListener('click', this.onAnchorClick));
    this._setupHighlights();
  }

  stop() {
    if (this._anchors && this._anchors.length) {
      this._anchors.forEach(anchor => anchor.removeEventListener('click', this.onAnchorClick));
      this._toggleHighlight();
    }
    window.removeEventListener('scroll', this._onUserScroll, { passive: true });
    this._targetsPositions = null;
    this._anchors = null;
  }
}

export default AnchorNavigation;