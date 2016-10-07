

// File
//******************************************************************
$( "#menu_file_new" ).click(function() {
  chrome.runtime.reload();
});

$( "#menu_file_open" ).click(function() {
  $('#menu_file_openSelect').click();
});

$( "#menu_file_quit" ).click(function() {
  window.close();
});


// View
//******************************************************************

// Projection Events
$( "#menu_view_perspec" ).click(function() {
  SetViewToPerspective();
});
$( "#menu_view_ortho" ).click(function() {
  SetViewToOrtho();
});

// Set the view events
$( "#menu_view_top" ).click(function() {
  SetViewToTop();
});
$( "#menu_view_bottom" ).click(function() {
  SetViewToBottom();
});
$( "#menu_view_front" ).click(function() {
  SetViewToFront();
});
$( "#menu_view_back" ).click(function() {
  SetViewToBack();
});
$( "#menu_view_left" ).click(function() {
  SetViewToLeft();
});
$( "#menu_view_right" ).click(function() {
  SetViewToRight();
});

// Rendering Style
$( "#menu_view_shadedEdge" ).click(function() {
  SetShadingToEdge();
});
$( "#menu_view_shaded" ).click(function() {
  SetShadingToShaded();
});
$( "#menu_view_wireframe" ).click(function() {
  SetShadingToWireframe();
});





// About
//******************************************************************
// Get the modal
var modal = document.getElementById('myModal');
$( "#menu_about_about" ).click(function() {
  modal.style.display = "block";
});

/*
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
*/
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};



// Accordian
//******************************************************************
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
  };
}


// Sidebar
//******************************************************************
// Get the modal
$( "#btn_logo" ).click(function() {
  console.log("ffff");
  document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("div_main").style.marginLeft = "250px";
    document.getElementById("glcanvas3D").style.marginLeft = "250px";
    document.getElementById("top_menu").style.marginLeft = "250px";
    document.getElementById("model_treeview").style.marginLeft = "250px";
    
    //document.body.style.color = "rgba(0,0,0,0.4)";
});
$( "#btn_closeSidebar" ).click(function() {
      document.getElementById("mySidenav").style.width = "0";
    document.getElementById("div_main").style.marginLeft= "0";
    document.getElementById("glcanvas3D").style.marginLeft= "0";
    document.getElementById("top_menu").style.marginLeft = "0";
    document.getElementById("model_treeview").style.marginLeft = "0";
    //document.body.style.backgroundColor = "white";
});





// Context Menu
// ***************************************************************
$( "#SetViewToSel" ).click(function() {
   modelprop_Center = SelectedMeshCollection[0].Center;
});

$( "#SetViewToOrig" ).click(function() {
   modelprop_Center = [0, 0, 0];
});
