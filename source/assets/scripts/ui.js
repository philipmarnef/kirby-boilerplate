const UI = {
  init() {
    Utils.removeClass(document.body, 'no-js');
    
    if(!Utils.isTouchDevice()) {
      Utils.addClass(document.body, 'no-touch');
    }
    
    this.addEventListeners();
  },
  
  addEventListeners() {
    //
  }
}

Utils.ready(
  () => {
    UI.init();
  }
);