function InitInputHandlers()
{

$(document).keydown(function (e) {
    if (e.keyCode == 16) {
    KeyboardState.Shift = true;
    }
});

$(document).keyup(function (e) {
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
    if(KeyboardState.Shift === false)
      SelectedMeshCollection.length = 0;

      if(HoverIndex > 0){
        var newMesh = new vxMesh();
        
        newMesh.Name = "Face." + HoverIndex;
        
        newMesh.Model = HoveredMesh.Model;
        
        var ind = 0;
        //var sel_colour = [ 0.1, 1, 0.6, 1];  
        var center = [0,0,0];
        for(var i = 0; i < 9; i+=3)
        {
          newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i]); 
          newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i+1]);
          newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i+2]);
          
          center[0] += parseFloat(HoveredMesh.mesh_vertices[i]);
          center[1] += parseFloat(HoveredMesh.mesh_vertices[i+1]);
          center[2] += parseFloat(HoveredMesh.mesh_vertices[i+2]);
        
          newMesh.vert_noramls.push(HoveredMesh.vert_noramls[i]); 
          newMesh.vert_noramls.push(HoveredMesh.vert_noramls[i+1]);
          newMesh.vert_noramls.push(HoveredMesh.vert_noramls[i+2]);
        
          newMesh.vert_colours.push(selectedcolor.R);
          newMesh.vert_colours.push(selectedcolor.G);
          newMesh.vert_colours.push(selectedcolor.B);
          newMesh.vert_colours.push(selectedcolor.A);

          newMesh.Indices.push(ind);
          ind++;
        }

        newMesh.InitialiseBuffers();
        newMesh.SetCenter();
        
          center[0] /=-3;
          center[1] /=-3;
          center[2] /=-3;
          
          newMesh.Center = center;
          
          //console.log(newMesh.Center);

      SelectedMeshCollection.push(newMesh);
      
      
      
      // Set Properties Data
      properties.remove();
      properties = new FaceProperty(gui, newMesh);
      //properties.setAll();
      
      if(CurrentCMD !== null)
        CurrentCMD.HandleMouseClick(newMesh);
      
      }
      
      
  }
  



function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    

    // Get's the Mouse State
    switch(event.button)
    {
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
    switch(event.button)
    {
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
    
    /*
            var msx = 0;
        var msy = 0;
        
        if(HoverIndex !== 0)
        {
          msx = MouseState.x;
          msy = MouseState.y;
        }
        
        var d = document.getElementById('div_mstext');
        d.style.position = "absolute";
        d.style.left = msx+ 30 + 'px';
        d.style.top = msy + 30 +'px';
        */
    
    if (!mouseDown) {
      return;
    }

    if(MouseState.MiddleButtonDown)
    {
      // Handle rotation
      if(KeyboardState.Shift == false)
      {
        var newX = event.clientX;
        var newY = event.clientY;

	      rotX += newX - lastMouseX;
        rotY += newY - lastMouseY;

        lastMouseX = newX;
        lastMouseY = newY;
      }
      // Handle Panning
      else
      {
        //var newPanX = event.clientX;
        //var newPanY = event.clientY;

	      panX += MouseState.x - MouseState.prevX;
        panY -= MouseState.y - MouseState.prevY;
 
        //lastPanX = newPanX;
        //lastPanY = newPanY;
      }
    }
  }
  var lastPanX = 0;
  var lastPanY = 0;
  
  
  
  function ResetRotation() {
    rotY = 0;
    rotX = 0;
  }
  
  
  var treepos = 32;
  
  
  
  function MouseWheelHandler(e) {

	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	// Move the tree based off of whether it has focus or not
if(treeHasFocus === 1)
{
   var tree = document.getElementById('model_treeview');
  
  //Set the position based off of the delta
  treepos += delta*4;
  //set the min as the bar height
  treepos = Math.min(32, treepos);
  
  //console.log(document.getElementById('model_treeview').clientHeight);
  //console.log(window.innerHeight);
  var allowedMovement = document.getElementById('model_treeview').clientHeight - window.innerHeight+32;
  
  if(allowedMovement > 0)
  {
  //Now set the top bound for the treepos
  treepos = Math.max(-1 * allowedMovement+32, treepos);
  
  //now set the css data
  tree.style.top = treepos + "px";
  }
  else
  { 
    tree.style.top = "32px";
  }
}
	else
	{
	// Set zoom info
	Zoom -= delta * (Zoom/10);
	}
  //log("Set Zoom: " + Zoom);
	return false;
}