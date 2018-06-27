function vxConsole() {
  this.form = document.getElementById('cntrl_console');
  this.textControl = document.getElementById('ui_console');
  this.textControl.textContent = '';
  this.isVisible = true;

  $('.ui-cntrl-console').mouseenter(function() {
    LogHasFocus = 1;
  });
  $('.ui-cntrl-console').mouseleave(function() {
    LogHasFocus = 0;
  });
}

vxConsole.prototype.ToggleVisibility = function() {
  this.isVisible = !this.isVisible;
  if (this.isVisible == true) {
    this.form.style.display = 'block';
  } else {
    this.form.style.display = 'none';
  }
};

vxConsole.prototype.WriteLine = function(input) {
  this.textControl.textContent += '\n' + input;
  this.textControl.scrollTop = 300; // this.textControl.scrollHeight;
  var objDiv = document.getElementById('ui_console_pre');
  objDiv.scrollTop = objDiv.scrollHeight - 95;
  Prism.highlightElement(this.textControl);
};
