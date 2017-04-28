
// System Variables
var iris = {

  name: "Iris Web Viewer",
  version: "0.3.0",

  shortdescription: "3D Model Exchange Format Viewer",

  description: "A light weight 3D Model Viewer for viewing Exchange Format files without the need for larger packages to be preinstalled on a computer. For use in viewing *.stl and *.obj files.",

  disclaimer: "Note: This app is still in 'Beta' and should not be used for final production decisions. It should only be used for non-critical reference and conceptual views. You can file any bugs found on our Github page.",
}

// The WebGL Canvas
var canvas;

// The WebGL Context
var gl;

var safeToDraw = true;

var cubeImage;
var cubeTexture;

// Properties GUI
var gui;

// Holder for vxProperties object
var properties;

// Stats Marker for FPS/MS etc...
var stats = new Stats();

var CurrentCMD;


var DoDebug = false;

// Model Center
var modelprop_Center = [0, 0, 0];
var Cur_Center = [0, 0, 0];


  //var meshcolor = new vxColour(0.05, 0.5, 0.75, 1);
    var meshcolor = new vxColour(0.65, 0.65, 0.65, 1);
    var selectedcolor = new vxColour(0.93, 0.463, 0.05, 1);

var modelprop_Radius = 1;

var numOfFaces = 1;



// Render State, Shaded, Wireframe, etc...
//**************************************************
vxRenderState = {
    ShadedEdge: 0,
    Shaded: 1,
    Wireframe: 2,
    SurfaceNormal:3
};
var RenderState = vxRenderState.ShadedEdge;



vxShaderState = {
  Diffuse:0,
};
var ShaderState = vxShaderState.Diffuse;


// View Projection Type
//**************************************************
vxProjectionType = {
    Perspective: 0,
    Ortho: 1
};

var ProjectionType = vxProjectionType.Perspective;



//The Selection Index
var HoverIndex = 0;

var treeHasFocus = 0;


//This is a collection of all of the current models. A model is defined as a
// individual file.
var ModelCollection = [];

//This is a collection of all of the current meshes
var MeshCollection = [];

var MeshCollectionPart = [];

//This is a collection of all of the current meshes
var SelectedMeshCollection = [];

// Collection of Measurements
var MeasureCollection = [];


//Grid Variables
var GridMesh = new vxMeshPart('GridMesh');
var XAxisMesh = new vxMeshPart('X Axis');
var YAxisMesh = new vxMeshPart('Y Axis');
var ZAxisMesh = new vxMeshPart('Z Axis');

var Cntr_Mesh = new vxMeshPart('Center');

var HoveredMesh = new vxMeshPart('Hovered Mesh');

var ViewCenter = new vxVertex3D();

//var cubeVerticesIndexBuffer;
var numOfElements = 0;
var rotX = -45;
var rotY = 30;
var panX = 0;
var panY = 0;

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

// Mouse State Struct
var MouseState = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    LeftButtonDown: false,
    MiddleButtonDown: false,
    RightButtonDown: false
};


// Keyboard State
var KeyboardState = {
    Shift: false,
};

var meshNodeId = "node_mesh";
var measureNodeId = "node_measure";

var status;


var modalIntro = document.getElementById('modal_intro');


window.onload = function() {



  // First set up Splash Screen (modal_intro)
  window.document.title = "IRIS Viewer  - [v. " + iris.version + " - Beta]"
  document.getElementById("intro_text_title").innerHTML = iris.name;
  //document.getElementById("intro_text_version").innerHTML = "[v. " + iris.version + " - Beta]";
  document.getElementById("intro_text_subtitle").innerHTML = iris.shortdescription;
  
  document.getElementById("intro_text_description").innerHTML = iris.description;
  document.getElementById("intro_text_disclaimer").innerHTML = "Note: This app is still in 'Beta' and should not be used for final production decisions. It should only be used for non-critical reference and conceptual views. You can file any bugs found on our Github page.";

//  document.getElementById("menubar_text_cornerTitle").innerHTML = iris.name + " - [v. " + iris.version + " - Beta]";

  var versionSVGURL = "https://img.shields.io/badge/build-beta%20%5Bv.%20"+iris.version+"%5D-green.svg";
  
  // Set Version Text Elements
  var image = document.getElementById("img_version_launch");
  image.src = versionSVGURL;

  var version_image = document.getElementById("img_version_footer");
  version_image.src = versionSVGURL;

  // Now set up the 3D info
  canvas = document.getElementById('glcanvas3D');
    
    
  // Setup Stats Panel
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  //log(stats.dom);
  stats.dom.style.top = window.innerHeight - 75+"px";
  //hide it normally
  stats.dom.style.display = 'none';
  //stats.dom.style.bottom = 32+"px"
  document.body.appendChild( stats.dom );



  // Now Setup the Properties GUI
  gui = new dat.GUI({ autoplace: false, width: 300 });

  gui.domElement.id = 'prop_dat_gui';
  
    var prop = document.getElementById('cntrl_properties');
    var customContainer = $(prop).append($(gui.domElement));
    
 //initialise model properties
 properties = new ModelProp(gui, "");
 
    //Initialise Web GL
    webGLStart();

    //Initialise Input Handlers
    InitInputHandlers();

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseMove;
    document.addEventListener("wheel", MouseWheelHandler, {passive:true});
    
    
    status = document.getElementById('footer_text');
    document.getElementById('footer_text').innerHTML = "Welcome to Iris";
        
//TODO: Old method of handling mouse scrolling
/*
    //var myimage = document.getElementById(elmntID);
    if (canvas.addEventListener) {
        // IE9, Chrome, Safari, Opera
        canvas.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    // IE 6/7/8
    else canvas.attachEvent("onmousewheel", MouseWheelHandler);
*/
    Resize();

    /*
    <input type="checkbox" id="node-0-0" checked="checked" />
    <label><input type="checkbox" />
    <span></span></label>
    <label for="node-0-0">Documents</label>
    
  <li>
    <input type="checkbox" id="node-0-1-0" />
    
    <label>
      <input type="checkbox" />
      <span></span>
    </label>
    
    <label for="node-0-1-0">My Music</label>
  </li>
    */
    //AddTreeNode("node_origin", "Origin", "tree_root", "folder", true);
    /*
    AddTreeNode("node_axis", "Axis'", "node_origin", "folder", true);
    
    AddTreeNode("node_axis_x", "X-Axis", "node_axis", "axis");
    AddTreeNode("node_axis_y", "Y-Axis", "node_axis", "axis");
    AddTreeNode("node_axis_z", "Z-Axis", "node_axis", "axis");
    
    AddTreeNode("node_planes", "Planes", "node_origin", "folder", true);
    
    AddTreeNode("node_origin_x", "XY-Planes", "node_planes", "plane");
    AddTreeNode("node_origin_y", "YZ-Planes", "node_planes", "plane");
    AddTreeNode("node_origin_z", "XZ-Planes", "node_planes", "plane");
    */
    AddTreeNode(meshNodeId, "Meshes", "tree_root", "folder", true);
    
    AddTreeNode(measureNodeId, "Measurements", "tree_root", "folder", true);


    $('#loading').fadeOut();
};

function AddTreeNode(id, labelText, rootToAddTo) {
    AddTreeNode(id, labelText, rootToAddTo, "");
}

function AddTreeNode(id, labelText, rootToAddTo, icon) {
    AddTreeNode(id, labelText, rootToAddTo, "", true);
}

var nodeCount = 0;
function AddTreeNode(id, labelText, rootToAddTo, icon, isExpanded) {
  
  
    // First get the tree root
    var rootNode = document.getElementById(rootToAddTo + "_ul");

    // Next create the li element which will encapslate the entire tree node GUI item
    var li = document.createElement("li");
    
    var cnvs = document.createElement("CANVAS");
    cnvs.setAttribute("data-id", "id"); // added line
    cnvs.style.width = "100%";
    cnvs.style.height = "18px";
    li.appendChild(cnvs);

    //Now Add an Input

    //     <input type="checkbox" id="node-0-1-0" />
    var inp1 = document.createElement("INPUT");
    inp1.setAttribute("type", "checkbox"); // added line
    inp1.setAttribute("id", id); // added line

    if (isExpanded === true)
        inp1.setAttribute("checked", "true"); // added line

    li.appendChild(inp1);

    // Now Create the Nested label which holds the check box
    var chkLbl = document.createElement("LABEL");

    var inp2 = document.createElement("INPUT");
    inp2.setAttribute("id", id); // added line
    inp2.setAttribute("type", "checkbox"); // added line
    inp2.setAttribute("checked", "checked"); // added line
    chkLbl.appendChild(inp2);

    var spn = document.createElement("SPAN");
    chkLbl.appendChild(spn);

    li.appendChild(chkLbl);

    // Finally create the end Text
    var txtLbl = document.createElement("LABEL");
    var txt = document.createTextNode(labelText);
    txtLbl.setAttribute("for", id);
    txtLbl.setAttribute("data-icon", icon);
    txtLbl.appendChild(txt);
    li.appendChild(txtLbl);

    // Finally Append a 'ul' element so that it can parent other nodes
    var newul = document.createElement("ul");
    newul.setAttribute("id", id + "_ul"); // added line
    li.appendChild(newul);

    rootNode.appendChild(li);


}

function InitialiseModel(model)
{
  model.Init();
  ModelCollection.push(model);
  
}

/*

V 293256
F 32584

V 1082016
F 120224
*/


$(window).resize(function() {

    Resize();
});

// Handles Resizing
function Resize() {
    canvas.width = $(window).width();
    canvas.height = $(window).height() - 50;
    
    
    var footer = document.getElementById('div_footer');
    
    stats.dom.style.top = window.innerHeight - 75+"px";
    //footer.bottom = -30 + "px";
    //footer.left = 0 + "px";

    gl.viewport(0, 0, canvas.width, canvas.height);
}





$(".ui-cntrl-treeview").mouseenter(function(){treeHasFocus = 1;});
$(".ui-cntrl-treeview").mouseleave(function(){treeHasFocus = 0;});


// Handle Tree View Checkbox Toggle
// *****************************************************************************************************
$(".ui-cntrl-treeview").delegate("label input:checkbox", "change", function() {
    var
        checkbox = $(this),
        nestedList = checkbox.parent().next().next(),
        selectNestedListCheckbox = nestedList.find("label:not([for]) input:checkbox");

    // Toggle all Meshes
    if ($(checkbox).attr('id') == meshNodeId) {
        for (var i = 0; i < MeshCollection.length; i++) {

            MeshCollection[i].Enabled = checkbox.is(":checked");
        }
    }
    
    // Toggle all Measurements
    else if ($(checkbox).attr('id') == measureNodeId) {
        for (var i = 0; i < MeasureCollection.length; i++) {

            MeasureCollection[i].Enabled = checkbox.is(":checked");
        }
        
    // Parse through individual collections
    }else {
        
        //Check Meshes
        for (var i = 0; i < MeshCollection.length; i++) {

            if (MeshCollection[i].TreeNodeID == $(checkbox).attr('id')) {
                MeshCollection[i].Enabled = checkbox.is(":checked");
            }
        }
        //Check Models
        for (var i = 0; i < ModelCollection.length; i++) {
            
            //ModelCollection[i].TrueFunc = !ModelCollection[i].TrueFunc;
            
            if ("node_" + ModelCollection[i].Name == $(checkbox).attr('id')) {
                ModelCollection[i].SetEnabled(checkbox.is(":checked"));
            }
        }
        
        //Check Measurements
        for (var i = 0; i < MeasureCollection.length; i++) {
            
            if ("node_" + MeasureCollection[i].Name == $(checkbox).attr('id')) {
                MeasureCollection[i].Enabled = checkbox.is(":checked");
            }
        }
    }
    /*
          console.log($(checkbox).attr('id'));
        console.log(checkbox.is(":checked"));
        */
    if (checkbox.is(":checked")) {
        return selectNestedListCheckbox.prop("checked", true);
    }
    selectNestedListCheckbox.prop("checked", false);
});






// Handles Logging of Text
// *****************************************************************************************************
function log(Text) {
  
  if(DoDebug === true)
  {
    console.log(Text);
    //var TextSoFar = $('#console').html();

    //TextSoFar += new Date() + ">> " + Text + "<br/>";

    //$('#console').html(TextSoFar);

    //$('#sonsoleDiv').animate({scrollTop: $('#sonsoleDiv').prop("scrollHeight")}, 50);
  }
}










(function() {
  
  "use strict";

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //
  // H E L P E R    F U N C T I O N S
  //
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Function to check if we clicked inside an element with a particular class
   * name.
   *
   * @param {Object} e The event
   * @param {String} className The class name to check against
   * @return {Boolean}
   */
  function clickInsideElement( e, className ) {
    var el = e.srcElement || e.target;
    
    if ( el.classList.contains(className) ) {
      return el;
    } else {
      while ( el = el.parentNode ) {
        if ( el.classList && el.classList.contains(className) ) {
          return el;
        }
      }
    }

    return false;
  }

  /**
   * Get's exact position of event.
   *
   * @param {Object} e The event passed in
   * @return {Object} Returns the x and y position
   */
  function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //
  // C O R E    F U N C T I O N S
  //
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  
  /**
   * Variables.
   */
  var contextMenuClassName = "context-menu";
  var contextMenuItemClassName = "context-menu__item";
  var contextMenuLinkClassName = "context-menu__link";
  var contextMenuActive = "context-menu--active";

  var taskItemClassName = "glcanvas3D";
  var taskItemInContext;

  var clickCoords;
  var clickCoordsX;
  var clickCoordsY;

  var menu = document.querySelector("#context-menu");
  var menuItems = menu.querySelectorAll(".context-menu__item");
  var menuState = 0;
  var menuWidth;
  var menuHeight;
  var menuPosition;
  var menuPositionX;
  var menuPositionY;

  var windowWidth;
  var windowHeight;

  /**
   * Initialise our application's code.
   */
  function init() {
    contextListener();
    clickListener();
    keyupListener();
    resizeListener();
  }

  /**
   * Listens for contextmenu events.
   */
  function contextListener() {
    document.addEventListener( "contextmenu", function(e) {
      taskItemInContext = clickInsideElement( e, taskItemClassName );
//e.preventDefault();
      if ( taskItemInContext ) {
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      } else {
        taskItemInContext = null;
        toggleMenuOff();
      }
    });
  }

  /**
   * Listens for click events.
   */
  function clickListener() {
    document.addEventListener( "click", function(e) {
      var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );

      if ( clickeElIsLink ) {
        e.preventDefault();
        menuItemListener( clickeElIsLink );
      } else {
        var button = e.which || e.button;
        if ( button === 1 ) {
          toggleMenuOff();
        }
      }
    });
  }

  /**
   * Listens for keyup events.
   */
  function keyupListener() {
    window.onkeyup = function(e) {
      if ( e.keyCode === 27 ) {
        toggleMenuOff();
      }
    }
  }

  /**
   * Window resize event listener
   */
  function resizeListener() {
    window.onresize = function(e) {
      toggleMenuOff();
    };
  }

  /**
   * Turns the custom context menu on.
   */
  function toggleMenuOn() {
    if ( menuState !== 1 ) {
      menuState = 1;
      menu.classList.add( contextMenuActive );
    }
  }

  /**
   * Turns the custom context menu off.
   */
  function toggleMenuOff() {
    if ( menuState !== 0 ) {
      menuState = 0;
      menu.classList.remove( contextMenuActive );
    }
  }

  /**
   * Positions the menu properly.
   *
   * @param {Object} e The event
   */
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }

    if ( (windowHeight - clickCoordsY) < menuHeight ) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    }
  }

  /**
   * Dummy action function that logs an action when a menu item link is clicked
   *
   * @param {HTMLElement} link The link that was clicked
   */
  function menuItemListener( link ) {
    log( "Task ID - " + taskItemInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
    toggleMenuOff();
  }

  /**
   * Run the app.
   */
  init();

})();