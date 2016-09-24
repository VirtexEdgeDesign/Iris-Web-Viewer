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
        
        var ind = 0;
        var sel_colour = [ 0.1, 1, 0.6, 1];  
        for(var i = 0; i < 9; i+=3)
        {
          newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i]); 
          newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i+1]);
          newMesh.mesh_vertices.push(HoveredMesh.mesh_vertices[i+2]);
        
          newMesh.vert_noramls.push(0);
          newMesh.vert_noramls.push(1);
          newMesh.vert_noramls.push(0);
        
          newMesh.vert_colours.push(sel_colour[0]);
          newMesh.vert_colours.push(sel_colour[1]);
          newMesh.vert_colours.push(sel_colour[2]);
          newMesh.vert_colours.push(sel_colour[3]);

          newMesh.Indices.push(ind);
          ind++;
        }

        newMesh.InitialiseBuffers();

      SelectedMeshCollection.push(newMesh);
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

    MouseState.x = event.clientX - rect.left;
    MouseState.y = event.clientY - rect.top;
    
    if (!mouseDown) {
      return;
    }

    if(MouseState.MiddleButtonDown)
    {
    var newX = event.clientX;
    var newY = event.clientY;

	  rotX += newX - lastMouseX;
    rotY += newY - lastMouseY;

    lastMouseX = newX;
    lastMouseY = newY;
    }
    
  }
  
  function ResetRotation() {
    rotY = 0;
    rotX = 0;
  }
  
  function MouseWheelHandler(e) {

	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	Zoom -= delta * (Zoom/10);
  //log("Set Zoom: " + Zoom);
	return false;
}