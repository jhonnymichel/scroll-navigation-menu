export function isHidden(anchor) {
  const {left, top, width, height} = anchor.getBoundingClientRect();
  return !(left + top + width + height);
}

export function isScrollInRange(range) {
  const [start, end] = range;
  return (start <= getScrollPosition() && end > getScrollPosition());
}

export function getScrollPosition() {
  return (window.scrollY || window.pageYOffset);
}
