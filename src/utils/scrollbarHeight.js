const getScrollbarHeight = () => {
  let scrollbarHeight = 0;
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.overflow = 'scroll';
    div.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(div);
    scrollbarHeight = (div.offsetHeight - div.clientHeight);
    document.body.removeChild(div);
  } else {
    scrollbarHeight = 0;
  }
  return scrollbarHeight;
};

export default getScrollbarHeight;
