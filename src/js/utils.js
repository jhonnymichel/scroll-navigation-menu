export function isHidden(anchor) {
  const {x, y, width, height} = anchor.getBoundingClientRect();
  return !(x + y + width + height);
}

export function isScrollInRange(range) {
  const [start, end] = range;
  return (start <= getScrollPosition() && end > getScrollPosition());
}

export function getScrollPosition() {
  return (window.scrollY || window.pageYOffset);
}