export function isHidden(anchor) {
  const {x, y, width, height} = anchor.getBoundingClientRect();
  return !(x + y + width + height);
}
