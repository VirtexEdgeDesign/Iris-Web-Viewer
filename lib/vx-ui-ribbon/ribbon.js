
// CSS rules
var rule  = '.red {background-color: red}';
    rule += '.blue {background-color: blue}';

class RibbonControl {

  constructor(divID) {
    this.divID = divID;
    this.basecntrl = document.createElement("DIV");
    this.basecntrl.classList.add("vx-rbn-cntrl");

    document.getElementById(divID).appendChild(this.basecntrl);
    
    this.titleBar = document.createElement("DIV");
    this.titleBar.classList.add("vx-rbn-headerbar");
    this.basecntrl.appendChild(this.titleBar);

    this.tabs = document.createElement("DIV");
    this.tabs.classList.add("vx-rbn-tab-header");
    this.basecntrl.appendChild(this.tabs);
    
    this.tabcount = 0;
}

injectCSS(rule) {
  var css = document.createElement('style'); // Creates <style></style>
  css.type = 'text/css'; // Specifies the type
  if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
  else css.appendChild(document.createTextNode(rule)); // Support for the rest
  document.getElementsByTagName("head")[0].appendChild(css); // Specifies where to place the css
}

init()
{




    var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("vx-rbn-drpdwn-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  var icn = selElmnt.options[selElmnt.selectedIndex].getAttribute("icon");
    a.setAttribute("icon", icn);
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    // apply icon attribute
    var icn = selElmnt.options[j].getAttribute("icon");
    c.setAttribute("icon", icn);
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var i, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            var icn = this.getAttribute("icon");
            h.setAttribute("icon", icn);

var event = new CustomEvent(
    "OnRibbonDropDownChange", 
    {
        detail: {
            index: i,
            text: h.innerHTML,
        },
        bubbles: true,
        cancelable: true
    }
);
            h.dispatchEvent(event);
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
  });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);
}

onTabChange(evt) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("vx-rbn-tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("vx-rbn-tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(evt.innerHTML).style.display = "block";

    evt.className += " active";
}

addTab(tab) {
    tab.init(this);
    this.tabs.appendChild(tab.tabBtn);
    this.basecntrl.appendChild(tab.content);

    // Add a tab
    if(this.tabcount > 0)
    {
        tab.tabBtn.addEventListener("click", function() {
          this.ribbon.onTabChange(tab.tabBtn);
      });
    }
    else
    {
    tab.tabBtn.setAttribute("id", "mainTab"); // added line
}

this.tabcount = this.tabcount + 1;
}

}



class RibbonTab {
  constructor(Name) {

    this.id = Name;
    this.tabBtn = document.createElement("button");
    this.tabBtn.classList.add("vx-rbn-tab");
    this.tabBtn.innerHTML = Name;

    this.content = document.createElement("DIV");
    this.content.classList.add("vx-rbn-tab-content");
    this.content.setAttribute("id", Name); // added line

    this.ulCntrl = document.createElement("ul");
    this.content.appendChild(this.ulCntrl);
}

init(ribbon)
{
    this.ribbon = ribbon;
    this.tabBtn.ribbon = ribbon;
    this.content.ribbon = ribbon;
}

addItem(item)
{
    var li = document.createElement("li");
    li.appendChild(item.control);
    this.ulCntrl.appendChild(li);
}

}



class RibbonGroup {
  constructor(Name, width = 350) {

    this.id = Name;

    this.control = document.createElement('div');

    var tbl = document.createElement('table');
    tbl.classList.add("vx-rbn-tab-group");
    var tbdy = document.createElement('tbody');
    tbl.appendChild(tbdy);
    this.control.appendChild(tbl);

    var tr1 = document.createElement('tr'); // row one
    var tr2 = document.createElement('tr'); // row two

    // top row
    this.group = document.createElement("ul");
    this.group.style.width=width+"px";
    tr1.appendChild(this.group);

    // bottom row
    var txtdiv = document.createElement('div');
    txtdiv.style.width="100%"
    txtdiv.classList.add("vx-rbn-tab-group-footer");
    txtdiv.innerHTML = Name;
    tr2.appendChild(txtdiv);

    tbdy.appendChild(tr1);
    tbdy.appendChild(tr2);
}


addItem(item)
{
    var li = document.createElement("li");
    li.appendChild(item.control);
    this.group.appendChild(li);
}

addSeperator()
{
    var li = document.createElement("li");
    var div = document.createElement("div");
    div.classList.add("vx-rbn-seperator");
    li.appendChild(div);
    this.group.appendChild(li);   
}

addBreak()
{
    var li = document.createElement("li");
    var div = document.createElement("div");
    div.classList.add("vx-rbn-break");
    li.appendChild(div);
    this.group.appendChild(li);   
}

}


class RibbonButton {
  constructor(text, icontag, small=true) {

    this.control = document.createElement("button");
    this.control.classList.add("vx-rbn-btn");
    this.control.innerHTML = text;

    // Set Icon to Large
    if(small == false)
        this.control.setAttribute("btn-size", "large");

    // Set Icon
    this.control.setAttribute("btn-icon", icontag);
}

}


class RibbonDropdown {
  constructor(text, icon="") {

    this.id = "id_"+text;
    this.control = document.createElement("div");
    this.control.classList.add("vx-rbn-drpdwn-select");
    this.control.setAttribute("id", this.id);
    this.control.style.width = 250;
    //console.log(this.control);

    this.slct = document.createElement("select");
    this.control.appendChild(this.slct);
    this.slct.style.width = 250;

    this.opt1 = document.createElement("option");
    this.opt1.setAttribute("value", 0);
    this.opt1.innerHTML = text;
    this.opt1.setAttribute("icon", icon);
    this.slct.appendChild(this.opt1);

    this.Count = 0;
}

addItem(text, icon=""){
    this.Count = this.Count + 0;
    var opt = document.createElement("option");
    opt.setAttribute("value", this.Count);
    opt.setAttribute("icon", icon);
    
    opt.innerHTML = text;
    this.slct.appendChild(opt);
}

}


