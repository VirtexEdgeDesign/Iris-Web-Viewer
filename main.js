
// The WebGL Canvas
var canvas;

// The WebGL Context
var gl;

// Model Center
var modelprop_Center=[0,0,0];

var modelprop_Radius=1;


// Render State, Shaded, Wireframe, etc...
//**************************************************
vxRenderState = {
    ShadedEdge : 0,
    Shaded : 1,
    Wireframe : 2
};

var RenderState = vxRenderState.ShadedEdge;



// View Projection Type 
//**************************************************
vxProjectionType = {
    Perspective : 0,
    Ortho : 1
};

var ProjectionType = vxProjectionType.Perspective;



//The Selection Index
var HoverIndex = 0;

//This is a collection of all of the current meshes
var MeshCollection = [];

//This is a collection of all of the current meshes
var SelectedMeshCollection = [];

//Grid Variables
var GridMesh = new vxMesh();
var XAxisMesh = new vxMesh();
var YAxisMesh = new vxMesh();
var ZAxisMesh = new vxMesh();
var HoveredMesh = new vxMesh();

var ViewCenter = new vxVertex3D();

//var cubeVerticesIndexBuffer;
var numOfElements = 0;
var rotX = -45;
var rotY = 30;

var currotX = 0;
var currotY = 0;
var curZoom = 0;

var lastCubeUpdateTime = 0;

var Zoom = -100;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var vertexSelColorAttribute;
var hasTextureAttribute;
var perspectiveMatrix;
var elmntID;

var MouseState = {
  x: 0,
  y: 0,
  LeftButtonDown : false,
  MiddleButtonDown : false,
  RightButtonDown : false
};

var KeyboardState = {
  Shift: false,
};

window.onload = function() {
    
		canvas = document.getElementById('glcanvas3D');
    
    //Initialise Web GL
    webGLStart();
    
    //Initialise Input Handlers
    InitInputHandlers();
    
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseMove;
    
    
    //var myimage = document.getElementById(elmntID);
    if (canvas.addEventListener) {
	    // IE9, Chrome, Safari, Opera
	    canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	    // Firefox
	    canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    // IE 6/7/8
    else canvas.attachEvent("onmousewheel", MouseWheelHandler);
    
    Resize();
};

$(window).resize(function() {

    Resize();
});

// Handles Resizing
function Resize()
{   
    canvas.width = $(window).width();
    canvas.height = $(window).height()-25;
    
    gl.viewport(0, 0, canvas.width, canvas.height);
}


// Handles Logging of Text
function log(Text)
{
  console.log(Text);
  //var TextSoFar = $('#console').html();
  
  //TextSoFar += new Date() + ">> " + Text + "<br/>";
  
  //$('#console').html(TextSoFar);
  
  //$('#sonsoleDiv').animate({scrollTop: $('#sonsoleDiv').prop("scrollHeight")}, 50);
}





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


// Sidebar
//******************************************************************
// Get the modal
$( "#btn_logo" ).click(function() {
  console.log("ffff");
  document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("div_main").style.marginLeft = "250px";
    document.getElementById("div_main").style.left = "250px";
    //document.body.style.color = "rgba(0,0,0,0.4)";
});
$( "#btn_closeSidebar" ).click(function() {
      document.getElementById("mySidenav").style.width = "0";
    document.getElementById("div_main").style.marginLeft= "0";
    //document.body.style.backgroundColor = "white";
});