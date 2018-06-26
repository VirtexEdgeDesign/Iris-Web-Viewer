// System Variables
var iris = {
  name: 'Iris Web Viewer',
  version: '0.5.0',

  shortdescription: '3D Model Exchange Format Viewer',

  description:
    'A light weight 3D Model Viewer for viewing Exchange Format files without the need for larger packages to be preinstalled on a computer. For use in viewing *.stl and *.obj files.',

  disclaimer:
    "Note: This app is still in 'Beta' and should not be used for final production decisions. It should only be used for non-critical reference and conceptual views. You can file any bugs found on our Github page."
};

var User = {
  LoggedIn: false,

  ID: 'xxxxxxxx-id-xxxxxxxx',

  Name: 'default user name',

  ImgUrl: '',

  Email: ''
};

/* Uncomment for Debuging
var originalLog = log
log=function(obj){
    originalLog(JSON.parse(JSON.stringify(obj)))
}
*/

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
//var Cur_Center = [0, 0, 0];

//var meshcolor = new vxColour(0.05, 0.5, 0.75, 1);
var meshcolor = new vxColour(0.65, 0.65, 0.65, 1);
var selectedcolor = new vxColour(0.93, 0.463, 0.05, 1);

var modelprop_Radius = 1;

var numOfFaces = 1;

// Render State, Shaded, Wireframe, etc...
//**************************************************

vxRenderState = {
  Wireframe: 0,
  Shaded: 1,
  Textured: 2,
  SurfaceNormal: 3
};

var RenderState = vxRenderState.Textured;

var ShowEdges = true;

vxShaderState = {
  Diffuse: 0
};
var ShaderState = vxShaderState.Diffuse;

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

//var Cntr_Mesh = new vxMeshPart('Center');

var HoveredMesh = new vxMeshPart('Hovered Mesh');

var ViewCenter = new vxVertex3D();

//var cubeVerticesIndexBuffer;
var numOfElements = 0;

var lastCubeUpdateTime = 0;

var elmntID;

// Mouse State Struct
var MouseState = {
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0,
  LeftButtonDown: false,
  MiddleButtonDown: false,
  RightButtonDown: false,
  ZoomEnabled: true
};

// Keyboard State
var KeyboardState = {
  Shift: false
};

var meshNodeId = 'node_mesh';
var measureNodeId = 'node_measure';

var status;

// Modals
var modalIntro = document.getElementById('modal_intro');
var modalOpenFile = document.getElementById('modal_openFile');
var modalLoadFile = document.getElementById('modal_loadFile');
var modalLoadFileResults = document.getElementById('modal_openFileResults');

var loadingPrgrsBar = document.getElementById('loading-prgrsbar');

// Tree Variables
var tree = new vxTreeControl('js-treediv');
var rootNode = new vxTreeNode('rootNode', 'Enviroment');
tree.SetRootNode(rootNode);

var TreeNode_Models = new vxTreeNode('node_models', 'Models');
var TreeNode_Measurements = new vxTreeNode('node_measurements', 'Measurements');

var loadWait = 1;

function InitVariables() {
  log('InitVariables()');

  loadingPrgrsBar.style.width = '0%';

  // First set up Splash Screen (modal_intro)
  window.document.title = 'IRIS Viewer  - [v. ' + iris.version + ' - Beta]';
  document.getElementById('intro_text_title').innerHTML = iris.name;
  //document.getElementById("intro_text_version").innerHTML = "[v. " + iris.version + " - Beta]";
  document.getElementById('intro_text_subtitle').innerHTML =
    iris.shortdescription;

  document.getElementById('intro_text_description').innerHTML =
    iris.description;
  document.getElementById('intro_text_disclaimer').innerHTML =
    "Note: This app is still in 'Beta' and should not be used for final production decisions. It should only be used for non-critical reference and conceptual views. You can file any bugs found on our Github page.";

  //  document.getElementById("menubar_text_cornerTitle").innerHTML = iris.name + " - [v. " + iris.version + " - Beta]";

  var versionSVGURL =
    'https://img.shields.io/badge/build-beta%20%5Bv.%20' +
    iris.version +
    '%5D-green.svg';

  // Set Version Text Elements
  var image = document.getElementById('img_version_launch');
  //image.src = versionSVGURL;

  var version_image = document.getElementById('img_version_footer');
  //version_image.src = versionSVGURL;

  // Setup Signin Info
  //var dev_signedIn = document.getElementById('dev_signedIn');
  //dev_signedIn.style.display = 'none';

  //var btn_googleSignIn = document.getElementById('btn_googleSignIn');
  //btn_googleSignIn.style.display = 'block';

  status = document.getElementById('footer_text');
  document.getElementById('footer_text').innerHTML = 'Welcome to Iris';

  // Now set up the 3D info
  canvas = document.getElementById('glcanvas3D');
  loadingPrgrsBar.style.width = '10%';

  setTimeout(function() {
    InitRibbon();
  }, loadWait);
}

function InitRibbon() {
  var ribbon = new RibbonControl('div_ribbon');
  var irisTab = new RibbonTab('Iris');
  var mainTab = new RibbonTab('Home');
  var viewTab = new RibbonTab('View');
  var toolTab = new RibbonTab('Tools');

  ribbon.addTab(irisTab);
  ribbon.addTab(mainTab);
  ribbon.addTab(viewTab);
  ribbon.addTab(toolTab);

  // Iris Tab
  irisTab.tabBtn.addEventListener('click', function() {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('div_main').style.marginLeft = '250px';
    document.getElementById('glcanvas3D').style.marginLeft = '250px';
    //document.getElementById("div_ribbon").style.marginLeft = "250px";
    document.getElementById('model_treeview').style.marginLeft = '250px';
  });
  mainTab.tabBtn.click();

  // Main Tab
  // ------------------------------------------------
  var mainGroup = new RibbonGroup('Main', 250);
  mainTab.addItem(mainGroup);

  // Add in Controls
  var newBtn = new RibbonButton('New', 'new_32', false);
  newBtn.control.addEventListener('click', function() {
    window.location.reload(true);
  });

  mainGroup.addItem(newBtn);

  var openBtn = new RibbonButton('Open', 'open_32', false);
  openBtn.control.addEventListener('click', function() {
    $('#menu_file_openSelect').click();
  });

  mainGroup.addItem(openBtn);
  mainGroup.addBreak();

  var importBtn = new RibbonButton('Import', 'import');
  importBtn.control.addEventListener('click', function() {
    modalOpenFile.style.display = 'block';
    CloseSidebar();
  });
  mainGroup.addItem(importBtn);

  var exportBtn = new RibbonButton('Export', 'export');
  exportBtn.control.addEventListener('click', function() {
    document.getElementById('modal_exportFile').style.display = 'block';
    CloseSidebar();
  });
  mainGroup.addItem(exportBtn);

  // Controls Group
  // ------------------------------------------------
  var cntrlsGroup = new RibbonGroup('Controls', 300);
  mainTab.addItem(cntrlsGroup);

  var tglTreeBtn = new RibbonButton('Toggle Tree', 'toggle_tree');
  tglTreeBtn.control.addEventListener('click', function() {
    tree.ToggleVisibility();
  });
  cntrlsGroup.addItem(tglTreeBtn);

  var tglPropsBtn = new RibbonButton('Toggle Properties', 'toggle_properties');
  tglPropsBtn.control.addEventListener('click', function() {
    OpenProperties();
  });
  cntrlsGroup.addItem(tglPropsBtn);

  var tglCnslBtn = new RibbonButton('Toggle Console', 'toggle_console');
  tglCnslBtn.control.addEventListener('click', function() {});
  cntrlsGroup.addItem(tglCnslBtn);

  // About Group
  // ------------------------------------------------
  var aboutGroup = new RibbonGroup('About', 200);
  mainTab.addItem(aboutGroup);

  var settingsBtn = new RibbonButton('Settings', 'setting_tools', false);
  settingsBtn.control.addEventListener('click', function() {});

  aboutGroup.addItem(settingsBtn);

  var aboutBtn = new RibbonButton('About', 'icon_16');
  aboutBtn.control.addEventListener('click', function() {
    CloseSidebar();
    modal.style.display = 'block';
  });
  aboutGroup.addItem(aboutBtn);

  //aboutGroup.addItem(new RibbonButton("Help", "about_help"));
  var helpBtn = new RibbonButton('Help', 'about_help');
  helpBtn.control.addEventListener('click', function() {
    CloseSidebar();
    openInNewTab('https://github.com/VirtexEdgeDesign/Iris-Web-Viewer/wiki');
  });
  aboutGroup.addItem(helpBtn);

  // View Tab
  // ------------------------------------------------
  var viewGroup = new RibbonGroup('View', 375);
  viewTab.addItem(viewGroup);

  var zoomInBtn = new RibbonButton('Zoom In', 'zoomIn');
  zoomInBtn.control.addEventListener('click', function() {
    AdjustZoom(0.75);
  });
  viewGroup.addItem(zoomInBtn);

  var zoomOutBtn = new RibbonButton('Zoom Out', 'zoomOut');
  zoomOutBtn.control.addEventListener('click', function() {
    AdjustZoom(1.25);
  });
  viewGroup.addItem(zoomOutBtn);

  var zoomFitBtn = new RibbonButton('Zoom Fit', 'zoomFit');
  zoomFitBtn.control.addEventListener('click', function() {
    FitZoom();
  });
  viewGroup.addItem(zoomFitBtn);

  var SetPrespctvDrpDwn = new RibbonDropdown('Perspective', 'view_perspective');
  viewGroup.addItem(SetPrespctvDrpDwn);
  SetPrespctvDrpDwn.addItem('Perspective', 'view_perspective');
  SetPrespctvDrpDwn.addItem('Ortho', 'view_ortho');

  function OnSetPrespctvDrpDwnChange(e) {
    switch (e.detail.text) {
      case 'Perspective':
        SetViewToPerspective();
        break;
      case 'Ortho':
        SetViewToOrtho();
    }
  }
  var elm = document.getElementById('id_Perspective');
  elm.addEventListener(
    'OnRibbonDropDownChange',
    OnSetPrespctvDrpDwnChange,
    false
  );

  var SetViewDrpDwn = new RibbonDropdown('Set View', 'view_perspective');
  viewGroup.addItem(SetViewDrpDwn);
  SetViewDrpDwn.addItem('Top', 'setview_top');
  SetViewDrpDwn.addItem('Bottom', 'setview_bottom');
  SetViewDrpDwn.addItem('Front', 'setview_front');
  SetViewDrpDwn.addItem('Back', 'setview_back');
  SetViewDrpDwn.addItem('Left', 'setview_left');
  SetViewDrpDwn.addItem('Right', 'setview_right');
  SetViewDrpDwn.addItem('ISO', 'view_ortho');

  function OnSetViewDrpDwnChange(e) {
    switch (e.detail.text) {
      case 'Front':
        SetViewToFront();
        break;
      case 'Back':
        SetViewToBack();
        break;
      case 'Left':
        SetViewToLeft();
        break;
      case 'Right':
        SetViewToRight();
        break;
      case 'Top':
        SetViewToTop();
        break;
      case 'Bottom':
        SetViewToBottom();
        break;
      case 'ISO':
        SetViewToIso();
        break;
    }
  }
  var elm = document.getElementById(SetViewDrpDwn.id);
  elm.addEventListener('OnRibbonDropDownChange', OnSetViewDrpDwnChange, false);

  // Render Group
  var renderGroup = new RibbonGroup('Render', 200);
  viewTab.addItem(renderGroup);

  var DrpDwnRender = new RibbonDropdown('Render Type', 'setrndr_texture');
  renderGroup.addItem(DrpDwnRender);
  DrpDwnRender.addItem('Textured', 'setrndr_texture');
  DrpDwnRender.addItem('Shaded', 'setrndr_shaded');
  DrpDwnRender.addItem('Wireframe', 'setrndr_wireframe');
  DrpDwnRender.addItem('Normals', 'setrndr_normal');

  var elm = document.getElementById(DrpDwnRender.id);
  elm.addEventListener(
    'OnRibbonDropDownChange',
    function(e) {
      switch (e.detail.text) {
        case 'Textured':
          SetShadingToTextured();
          break;
        case 'Shaded':
          SetShadingToShaded();
          break;
        case 'Wireframe':
          SetShadingToWireframe();
          break;
        case 'Normals':
          SetShadingToNormal();
          break;
      }
    },
    false
  );

  var DrpDwnRender = new RibbonDropdown('Edge Type', 'view_perspective');
  renderGroup.addItem(DrpDwnRender);
  DrpDwnRender.addItem('Show Edges', 'setrndr_edges');
  DrpDwnRender.addItem('No Edges', 'setrndr_shaded');

  var elm = document.getElementById(DrpDwnRender.id);
  elm.addEventListener(
    'OnRibbonDropDownChange',
    function(e) {
      switch (e.detail.text) {
        case 'Show Edges':
          SetEdgeRendering(true);
          break;
        case 'No Edges':
          SetEdgeRendering(false);
          break;
      }
    },
    false
  );

  ribbon.init();

  setTimeout(function() {
    InitDebugStats();
  }, loadWait);
}

function InitDebugStats() {
  log('InitDebugStats()');
  // Setup Stats Panel
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  //log(stats.dom);
  stats.dom.style.top = window.innerHeight - 75 + 'px';
  //hide it normally
  stats.dom.style.display = 'none';
  //stats.dom.style.bottom = 32+"px"
  document.body.appendChild(stats.dom);
  loadingPrgrsBar.style.width = '30%';

  setTimeout(function() {
    InitProperties();
  }, 10);
}

function InitProperties() {
  log('InitProperties()');
  // Now Setup the Properties GUI
  gui = new dat.GUI({ autoplace: false, width: 300 });

  gui.domElement.id = 'prop_dat_gui';

  var prop = document.getElementById('cntrl_properties');
  var customContainer = $(prop).append($(gui.domElement));

  //initialise model properties
  properties = new ModelProp(gui, '');
  loadingPrgrsBar.style.width = '40%';
  setTimeout(function() {
    InitWebGL();
  }, loadWait);
}

function InitWebGL() {
  log('InitWebGL()');

  //Initialise Web GL
  webGLStart();
  loadingPrgrsBar.style.width = '50%';

  setTimeout(function() {
    InitListerners();
  }, loadWait);
}

function InitListerners() {
  log('InitListerners()');

  //Initialise Input Handlers
  InitInputHandlers();

  canvas.onmousedown = handleMouseDown;
  document.onmouseup = handleMouseUp;
  canvas.onmousemove = handleMouseMove;

  // hook up cross browser mouse scrolls
  document.addEventListener('DOMMouseScroll', MouseWheelHandler, {
    passive: true
  }); // for Firefox
  document.addEventListener('mousewheel', MouseWheelHandler, { passive: true }); // everyone else
  loadingPrgrsBar.style.width = '60%';

  setTimeout(function() {
    InitTreeNodes();
  }, loadWait);
}

function InitTreeNodes() {
  log('InitTreeNodes()');
  Resize();
  loadingPrgrsBar.style.width = '70%';
  //AddTreeNode(meshNodeId, "Meshes", "tree_root", "folder", true);

  rootNode.Expand();
  TreeNode_Models.Expand();
  TreeNode_Measurements.Expand();

  rootNode.AddNode(TreeNode_Models);
  rootNode.AddNode(TreeNode_Measurements);

  //AddTreeNode(measureNodeId, "Measurements", "tree_root", "folder", true);
  loadingPrgrsBar.style.width = '100%';

  //var dev_signedIn = document.getElementById('profile_img');
  //dev_signedIn.style.display = 'none';

  setTimeout(function() {
    FinaliseInit();
  }, loadWait);
}

function FinaliseInit() {
  log('FinaliseInit()');
  SetMenuBarValues();
  $('#loading').fadeOut();
}

window.onload = function() {
  setTimeout(function() {
    InitVariables();
  }, loadWait);
};

function AddTreeNode(id, labelText, rootToAddTo) {
  AddTreeNode(id, labelText, rootToAddTo, '');
}

function AddTreeNode(id, labelText, rootToAddTo, icon) {
  AddTreeNode(id, labelText, rootToAddTo, '', true);
}

function AddTreeNode(id, labelText, rootToAddTo, icon, isExpanded) {
  var newNode = new vxTreeNode(id, labelText, icon);
  tree.AddNode(newNode, rootToAddTo);
  if (isExpanded == true) {
    newNode.Expand();
  }

  // Get the Node Checkbox
  var elm = document.getElementById('chkbx_' + id);
  console.log(id);
  elm.addEventListener('onNodeCheckChanged', function(e) {
    var checkbox = $(this),
      nestedList = checkbox
        .parent()
        .next()
        .next();

    var elms = this.parentNode.getElementsByClassName('tree-node-chkbx');
    var imgs = this.parentNode.getElementsByClassName('tree-node-chkbx-img');
    //console.log(elms);
    for (var i = 0; i < elms.length; i++) {
      if (e.detail.isChecked) {
        elms[i].setAttribute('toggle', 'true');
        imgs[i].setAttribute('status', 'checked');
      } else {
        elms[i].setAttribute('toggle', 'false');
        imgs[i].setAttribute('status', 'not-checked');
      }
    }

    /*
            if (e.detail.isChecked) {
                    return selectNestedListCheckbox.prop("click", true);
                }
                selectNestedListCheckbox.prop("click", false);
            */
    //    nestedList = checkbox.parent().next().next(),
    //  selectNestedListCheckbox = nestedList.find("label:not([for]) input:checkbox");

    //Check Models
    for (var i = 0; i < ModelCollection.length; i++) {
      //ModelCollection[i].TrueFunc = !ModelCollection[i].TrueFunc;

      if ('node_' + ModelCollection[i].Name == e.detail.nodeId) {
        ModelCollection[i].SetEnabled(e.detail.isChecked);
      }
    }

    //Check Meshes
    for (var i = 0; i < MeshCollection.length; i++) {
      if (MeshCollection[i].TreeNodeID == e.detail.nodeId) {
        MeshCollection[i].Enabled = e.detail.isChecked;
      }
    }

    //Check Measurements
    for (var i = 0; i < MeasureCollection.length; i++) {
      if ('node_' + MeasureCollection[i].Name == e.detail.nodeId) {
        MeasureCollection[i].Enabled = e.detail.isChecked;
      }
    }
  });
}
var crntTreeHighlight = '';

function AddTreeNodeTexture(id, rootToAddTo, newImg, size) {
  /*

        // First get the tree root
        var rootNode = document.getElementById(rootToAddTo + "_ul");

        // Next create the li element which will encapslate the entire tree node GUI item
        var li = document.createElement("li");

        var cnvs = document.createElement("CANVAS");
        cnvs.setAttribute("data-id", "id"); // added line
        cnvs.style.width = "100%";
        cnvs.style.height = size;
        li.appendChild(cnvs);

        //Now Add an Input

        //     <input type="checkbox" id="node-0-1-0" />
        var inp1 = document.createElement("INPUT");
        inp1.setAttribute("type", "checkbox"); // added line
        inp1.setAttribute("id", id); // added line


        //if (isExpanded === true)
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
        var txt = document.createTextNode("img: ");
        var img = document.createElement("IMG");
        txtLbl.setAttribute("for", id);
        txtLbl.setAttribute("data-status", "texture");

        txtLbl.appendChild(newImg);
        li.appendChild(txtLbl);

        // Finally Append a 'ul' element so that it can parent other nodes
        var newul = document.createElement("ul");
        newul.setAttribute("id", id + "_ul"); // added line
        li.appendChild(newul);

        rootNode.appendChild(li);
        */
}

function InitialiseModel(model) {
  ModelCollection.push(model);
}

function addResultsItem(note) {
  // First get the tree root
  var rootDiv = document.getElementById('div_results');

  var errortype = note.type == 0 ? 'error' : 'warning';

  // first create the div which will encapsulate the entire note
  var noteDiv = document.createElement('div');
  noteDiv.setAttribute('class', 'modal-result-item');
  noteDiv.setAttribute('type', errortype);

  // Now create the image icon
  var noteImg = document.createElement('IMG');
  noteImg.setAttribute('class', 'modal-result-item-img');
  noteImg.setAttribute('data-icon', errortype);
  noteDiv.appendChild(noteImg);

  // Now create the title
  var titleSpan = document.createElement('SPAN');
  titleSpan.setAttribute('class', 'modal-result-item-title');
  titleSpan.innerHTML = note.title;
  noteDiv.appendChild(titleSpan);

  // next create the file name
  var fileSpan = document.createElement('SPAN');
  fileSpan.setAttribute('class', 'modal-result-item-file');
  fileSpan.innerHTML = note.fileName;
  noteDiv.appendChild(fileSpan);

  // add a hr splitter
  var spltr = document.createElement('br');
  spltr.setAttribute('id', 'splitter');
  noteDiv.appendChild(spltr);

  // next create the error description
  var descpSpan = document.createElement('SPAN');
  descpSpan.setAttribute('class', 'modal-result-item-txt');
  descpSpan.innerHTML = note.descp;
  noteDiv.appendChild(descpSpan);

  // finally append the note
  rootDiv.appendChild(noteDiv);
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
  canvas.height = $(window).height() - 118;

  document.getElementById('model_treeview').style.maxHeight =
    $(window).height() - 118 + 'px';
  document.getElementById('js-treediv').style.width = document.getElementById(
    'model_treeview'
  ).style.width;

  var footer = document.getElementById('div_footer');

  stats.dom.style.top = window.innerHeight - 75 + 'px';
  //footer.bottom = -30 + "px";
  //footer.left = 0 + "px";

  gl.viewport(0, 0, canvas.width, canvas.height);
}

$('.tree-control').mouseenter(function() {
  treeHasFocus = 1;
});
$('.tree-control').mouseleave(function() {
  treeHasFocus = 0;
  crntTreeHighlight = '';
});

// Handles Logging of Text
// *****************************************************************************************************
function log(Text) {
  //console.log(">> "+Text);
  if (DoDebug === true) {
    log(Text);
    //var TextSoFar = $('#console').html();

    //TextSoFar += new Date() + ">> " + Text + "<br/>";

    //$('#console').html(TextSoFar);

    //$('#sonsoleDiv').animate({scrollTop: $('#sonsoleDiv').prop("scrollHeight")}, 50);
  }
}

// Load File Results
//******************************************************************

$('#btn_fileLoadResults_Close').click(function() {
  modalLoadFileResults.style.display = 'none';
  // reanable zoom
  MouseState.ZoomEnabled = true;
});

// Side Bar
//******************************************************************
$('#sidebar_file_new').click(function() {
  // Reload the window
  window.location.reload(true);
});
$('#sidebar_file_import').click(function() {
  //$('#menu_file_openSelect').click();
  modalOpenFile.style.display = 'block';

  CloseSidebar();
});
$('#sidebar_file_export').click(function() {
  document.getElementById('modal_exportFile').style.display = 'block';
  CloseSidebar();
});

// Export the file
//******************************************************************
var textFile = null;

function makeTextFile(text) {
  var data = new Blob([text], { type: 'text/plain' });

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  // returns a URL you can use as a href
  return textFile;
}

$('#btn_file_export_do').click(function() {
  // first get which type of exporter we're using
  var combobox = document.getElementById('modal_exportFile_choice');

  switch (combobox.selectedIndex) {
    case 0: // STL
      io_export_stl();
  }
});
$('#btn_file_export_cancel').click(function() {
  document.getElementById('modal_exportFile').style.display = 'none';
});

function OnFileExportTypeChange() {
  var combobox = document.getElementById('modal_exportFile_choice');
  var idx = combobox.selectedIndex;
  var content = combobox.options[idx].innerHTML;
}

// Handle Location To Open File From
$('#btn_openfile_local').click(function() {
  $('#menu_file_openSelect').click();
});

$('#btn_openfile_gdrive').click(function() {
  //loadPicker();
});

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

$('#btn_social_github').click(function() {
  /*
  chrome.browser.openTab({
      url: 'https://github.com/r4tch31/Iris-Web-Viewer/wiki'
    });
    */
  openInNewTab('https://github.com/VirtexEdgeDesign/Iris-Web-Viewer/wiki');
});

$('#btn_social_fb').click(function() {
  openInNewTab('https://www.facebook.com/VirtexEdgeDesign');
});

$('#btn_social_twtr').click(function() {
  openInNewTab('https://www.twitter.com/VirtexEdge');
});

// File
//******************************************************************
$('#menu_file_new').click(function() {
  //chrome.runtime.reload();
  window.location.reload(true);
});

$('#menu_file_open').click(function() {
  $('#menu_file_openSelect').click();
});

$('#menu_file_quit').click(function() {
  window.close();
});

// Tools
//******************************************************************

$('#menu_tools_measure').click(function() {
  CurrentCMD = null;
  CurrentCMD = new vxMeasureCMD();
  CurrentCMD.Init();
});

$('#menu_tools_measure_angle').click(function() {
  CurrentCMD = null;
  CurrentCMD = new vxMeasureAngleCMD();
  CurrentCMD.Init();
});

$('#menu_tools_debug').click(function() {
  if (stats.dom.style.display == 'none') {
    stats.dom.style.display = 'block';
    DoDebug = true;
  } else {
    stats.dom.style.display = 'none';
    DoDebug = false;
  }
});

// About
//******************************************************************
// Get the modal
var modal = document.getElementById('modal_about');
$('#menu_about_about').click(function() {
  CloseSidebar();
  modal.style.display = 'block';
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

var modal_intro = document.getElementById('modal_intro');

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }

  if (event.target == modal_intro) {
    modal_intro.style.display = 'none';
  }

  if (event.target == modalOpenFile) {
    modalOpenFile.style.display = 'none';
  }
};

// Accordian
//******************************************************************
var acc = document.getElementsByClassName('accordion');
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].onclick = function() {
    this.classList.toggle('active');
    this.nextElementSibling.classList.toggle('show');
  };
}

// Sidebar
//******************************************************************
// Get the modal
$('#btn_logo').click(function() {
  document.getElementById('mySidenav').style.width = '250px';
  document.getElementById('div_main').style.marginLeft = '250px';
  document.getElementById('glcanvas3D').style.marginLeft = '250px';
  document.getElementById('top_menu').style.marginLeft = '250px';
  document.getElementById('model_treeview').style.marginLeft = '250px';

  //document.body.style.color = "rgba(0,0,0,0.4)";
});
$('#btn_closeSidebar').click(function() {
  CloseSidebar();
  //document.body.style.backgroundColor = "white";
});

function CloseSidebar() {
  document.getElementById('mySidenav').style.width = '0';
  document.getElementById('div_main').style.marginLeft = '0';
  document.getElementById('glcanvas3D').style.marginLeft = '0';
  document.getElementById('div_ribbon').style.marginLeft = '0';
  document.getElementById('model_treeview').style.marginLeft = '0';
}

// Context Menu
// ***************************************************************
$('#SetViewToSel').click(function() {
  modelprop_Center = SelectedMeshCollection[0].Center;
});

$('#SetViewToOrig').click(function() {
  modelprop_Center = [0, 0, 0];
});
$('#cntx_properties').click(function() {
  OpenProperties();
});

$('#btn_closeProperties').click(function() {
  CloseProperties();
});

function OpenProperties() {
  document.getElementById('cntrl_properties').style.marginRight = '300px';
}

function CloseProperties() {
  document.getElementById('cntrl_properties').style.marginRight = '0px';
}

// Show Intro Modal at Start
modal_intro.style.display = 'block';

function InitInputHandlers() {
  $(document).keydown(function(e) {
    if (e.keyCode == 16) {
      KeyboardState.Shift = true;
    }
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 16) {
      KeyboardState.Shift = false;
    }
  });
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

function LeftMouseClickEvent() {
  //Only clear the Selected Mesh Collection if the Shift key is up
  if (KeyboardState.Shift === false) SelectedMeshCollection.length = 0;

  if (HoverIndex > 0) {
    var newMesh = new vxMeshPart();

    newMesh.Name = 'Face.' + HoverIndex;

    newMesh.Model = HoveredMesh.Model;

    var ind = 0;
    //var sel_colour = [ 0.1, 1, 0.6, 1];
    var center = [0, 0, 0];
    for (var i = 0; i < 9; i += 3) {
      newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i]);
      newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i + 1]);
      newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i + 2]);

      center[0] += parseFloat(HoveredMesh.mesh_vertices[i]);
      center[1] += parseFloat(HoveredMesh.mesh_vertices[i + 1]);
      center[2] += parseFloat(HoveredMesh.mesh_vertices[i + 2]);

      newMesh.vert_uvcoords.push(0);
      newMesh.vert_uvcoords.push(0);

      newMesh.vert_noramls.push(HoveredMesh.vert_noramls[i]);
      newMesh.vert_noramls.push(HoveredMesh.vert_noramls[i + 1]);
      newMesh.vert_noramls.push(HoveredMesh.vert_noramls[i + 2]);

      newMesh.vert_colours.push(selectedcolor.R);
      newMesh.vert_colours.push(selectedcolor.G);
      newMesh.vert_colours.push(selectedcolor.B);
      newMesh.vert_colours.push(selectedcolor.A);

      newMesh.Indices.push(ind);
      ind++;
    }

    newMesh.initBasicTexture();
    newMesh.InitialiseBuffers();
    newMesh.SetCenter();

    center[0] /= -3;
    center[1] /= -3;
    center[2] /= -3;

    newMesh.Center = center;

    //console.log(newMesh.Center);

    SelectedMeshCollection.push(newMesh);

    // Set Properties Data
    properties.remove();
    properties = new FaceProperty(gui, newMesh);
    //properties.setAll();

    if (CurrentCMD) CurrentCMD.HandleMouseClick(newMesh);
  }
}

function handleMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  // Get's the Mouse State
  switch (event.button) {
    case 0:
      MouseState.LeftButtonDown = true;
      LeftMouseClickEvent();
      break;
    case 1:
      MouseState.MiddleButtonDown = true;
      break;
    case 2:
      MouseState.RightButtonDown = true;
      break;
  }
}

function handleMouseUp(event) {
  mouseDown = false;

  // Get's the Mouse State
  switch (event.button) {
    case 0:
      MouseState.LeftButtonDown = false;
      break;
    case 1:
      MouseState.MiddleButtonDown = false;
      break;
    case 2:
      MouseState.RightButtonDown = false;
      break;
  }
}

function handleMouseMove(event) {
  var rect = canvas.getBoundingClientRect();

  MouseState.prevX = MouseState.x;
  MouseState.prevY = MouseState.y;

  MouseState.x = event.clientX - rect.left;
  MouseState.y = event.clientY - rect.top;

  if (!mouseDown) {
    return;
  }

  if (MouseState.MiddleButtonDown) {
    // Handle rotation
    if (KeyboardState.Shift == false) {
      Camera.rotate(event.clientX - lastMouseX, event.clientY - lastMouseY);

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    }
    // Handle Panning
    else {
      Camera.pan(
        MouseState.x - MouseState.prevX,
        MouseState.y - MouseState.prevY
      );
    }
  }
}
var lastPanX = 0;
var lastPanY = 0;

function ResetRotation() {
  rotY = 0;
  rotX = 0;
}

var treepos = 118;

function MouseWheelHandler(e) {
  if (MouseState.ZoomEnabled == true) {
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

    // Move the tree based off of whether it has focus or not

    if (treeHasFocus === 1) {
      var tree = document.getElementById('model_treeview');

      //Set the position based off of the delta
      treepos += delta * 14;
      //set the min as the bar height
      treepos = Math.min(118, treepos);

      var allowedMovement =
        document.getElementById('model_treeview').clientHeight -
        window.innerHeight +
        118;

      if (allowedMovement > 0) {
        //Now set the top bound for the treepos
        treepos = Math.max(-1 * allowedMovement + 118, treepos);

        //now set the css data
        tree.style.top = treepos + 'px';
      } else {
        tree.style.top = '118px';
      }
    } else {
      // Set zoom info
      Camera.zoom -= delta * (Camera.zoom / 10);
    }
  }
  //log("Set Zoom: " + Zoom);
  return false;
}
