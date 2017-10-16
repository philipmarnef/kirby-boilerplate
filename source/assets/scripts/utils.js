const Utils = {

  ready: (fn) => {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  },

  isTouchDevice: () => 'ontouchstart' in window || !!navigator.maxTouchPoints,

  addClass(element, className) {
    const el = element;
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ` ${className}`;
    }
  },

  removeClass(element, className) {
    const el = element;
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },

  hasClass(element, className) {
    if (element.classList) return element.classList.contains(className);
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
  },

  toggleClass(element, className) {
    if (this.hasClass(element, className)) {
      this.removeClass(element, className);
    } else {
      this.addClass(element, className);
    }
  },

  reverseMailto(e){
    const a = e;
    const mail = a.textContent;
    const reversed = mail.split('').reverse().join('');
    a.href = `mailto:${reversed}`;
    a.textContent = reversed;
  }

};
