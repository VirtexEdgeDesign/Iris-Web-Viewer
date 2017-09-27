
// Converts Degrees to Radians
    function DegToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
// Converts Radians to Degrees
        function RadToDeg(radians) {
        return radians *  180 / Math.PI;
    }

function Smooth(whatVarIs, whatVarShouldBe, steps)
{
  return  whatVarIs + (whatVarShouldBe - whatVarIs)/steps;
}





    function mvRotate(angle, v) {
        var inRadians = angle * Math.PI / 180.0;

        var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
        multMatrix(m);
    }
    
// The Matrix Stack
var mvMatrixStack = [];

// Push a Metrix onto the Stack
    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

// Pop a matrix off the stack
    function mvPopMatrix() {
        if (mvMatrixStack.length === 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }
    
    
    
    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            
            
            
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    
    function CreateGrid(gridSize)
    {

  var temp_Normal = [0,0,0];
  //var temp_colour = [ 0.25, 0.25, 0.25, 1];  
  var temp_colour = [ 0.825, 0.825, 0.825, 1];     
  var count = 0;
  /* Load In Vertex and Colour Data */
  for(var i = -gridSize; i < gridSize+1; i+=5)
  {
    if(i%20 === 0)
      temp_colour = [ 1, 1, 1, 1];   
    else
      temp_colour = [ 0.7, 0.7, 0.7, 1];   
    // First Point is (i, 0, -gridSize)
         GridMesh.mesh_vertices.push(i);
         GridMesh.mesh_vertices.push(0);
         GridMesh.mesh_vertices.push(-gridSize); 
         
         GridMesh.vert_noramls.push(temp_Normal[0]);
         GridMesh.vert_noramls.push(temp_Normal[1]);
         GridMesh.vert_noramls.push(temp_Normal[2]);
         
         GridMesh.vert_uvcoords.push(temp_Normal[1]);
         GridMesh.vert_uvcoords.push(temp_Normal[2]);
         
         GridMesh.vert_colours.push(temp_colour[0]);
         GridMesh.vert_colours.push(temp_colour[1]);
         GridMesh.vert_colours.push(temp_colour[2]);
         GridMesh.vert_colours.push(temp_colour[3]);
         
         GridMesh.Indices.push(count);
         count++;
         
         
         
         
         GridMesh.mesh_vertices.push(i);
         GridMesh.mesh_vertices.push(0);
         GridMesh.mesh_vertices.push(gridSize); 
         
         GridMesh.vert_noramls.push(temp_Normal[0]);
         GridMesh.vert_noramls.push(temp_Normal[1]);
         GridMesh.vert_noramls.push(temp_Normal[2]);
         
         GridMesh.vert_uvcoords.push(temp_Normal[1]);
         GridMesh.vert_uvcoords.push(temp_Normal[2]);
         
         GridMesh.vert_colours.push(temp_colour[0]);
         GridMesh.vert_colours.push(temp_colour[1]);
         GridMesh.vert_colours.push(temp_colour[2]);
         GridMesh.vert_colours.push(temp_colour[3]);
         
         GridMesh.Indices.push(count);
         count++;
         
         
         
         
         GridMesh.mesh_vertices.push(-gridSize); 
         GridMesh.mesh_vertices.push(0);
         GridMesh.mesh_vertices.push(i);
         
         GridMesh.vert_noramls.push(temp_Normal[0]);
         GridMesh.vert_noramls.push(temp_Normal[1]);
         GridMesh.vert_noramls.push(temp_Normal[2]);
         
         GridMesh.vert_uvcoords.push(temp_Normal[1]);
         GridMesh.vert_uvcoords.push(temp_Normal[2]);
         
         GridMesh.vert_colours.push(temp_colour[0]);
         GridMesh.vert_colours.push(temp_colour[1]);
         GridMesh.vert_colours.push(temp_colour[2]);
         GridMesh.vert_colours.push(temp_colour[3]);
         
         GridMesh.Indices.push(count);
         count++;
         
         
         
         GridMesh.mesh_vertices.push(gridSize); 
         GridMesh.mesh_vertices.push(0);
         GridMesh.mesh_vertices.push(i);
         
         GridMesh.vert_noramls.push(temp_Normal[0]);
         GridMesh.vert_noramls.push(temp_Normal[1]);
         GridMesh.vert_noramls.push(temp_Normal[2]);
         
         GridMesh.vert_uvcoords.push(temp_Normal[1]);
         GridMesh.vert_uvcoords.push(temp_Normal[2]);
         
         GridMesh.vert_colours.push(temp_colour[0]);
         GridMesh.vert_colours.push(temp_colour[1]);
         GridMesh.vert_colours.push(temp_colour[2]);
         GridMesh.vert_colours.push(temp_colour[3]);
         
         GridMesh.Indices.push(count);
         count++;
        }
        
        GridMesh.initBasicTexture();
        GridMesh.InitialiseBuffers();
        GridMesh.meshType = MeshType.Lines;
    }
    
    function CreateAxis()
    {
      var strt = 2;
      var end = 5;
      /*
  var cntr_colour = [0.75, 0.75, 0.75, 1];
      Cntr_Mesh.mesh_vertices.push(0);
         Cntr_Mesh.mesh_vertices.push(0);
         Cntr_Mesh.mesh_vertices.push(0); 
         
         Cntr_Mesh.vert_noramls.push(0);
         Cntr_Mesh.vert_noramls.push(1);
         Cntr_Mesh.vert_noramls.push(0);
         
         Cntr_Mesh.vert_uvcoords.push(0);
         Cntr_Mesh.vert_uvcoords.push(0);
         
         Cntr_Mesh.vert_colours.push(cntr_colour[0]);
         Cntr_Mesh.vert_colours.push(cntr_colour[1]);
         Cntr_Mesh.vert_colours.push(cntr_colour[2]);
         Cntr_Mesh.vert_colours.push(cntr_colour[3]);
         
         Cntr_Mesh.Indices.push(0);

         Cntr_Mesh.mesh_vertices.push(end);
         Cntr_Mesh.mesh_vertices.push(0);
         Cntr_Mesh.mesh_vertices.push(0); 
         
         Cntr_Mesh.vert_noramls.push(0);
         Cntr_Mesh.vert_noramls.push(1);
         Cntr_Mesh.vert_noramls.push(0);
         
         Cntr_Mesh.vert_uvcoords.push(0);
         Cntr_Mesh.vert_uvcoords.push(0);
         
         Cntr_Mesh.vert_colours.push(cntr_colour[0]);
         Cntr_Mesh.vert_colours.push(cntr_colour[1]);
         Cntr_Mesh.vert_colours.push(cntr_colour[2]);
         Cntr_Mesh.vert_colours.push(cntr_colour[3]);
         
         Cntr_Mesh.Indices.push(1);
         Cntr_Mesh.Indices.push(0);
         
        Cntr_Mesh.mesh_vertices.push(0);
         Cntr_Mesh.mesh_vertices.push(end);
         Cntr_Mesh.mesh_vertices.push(0); 
         
         Cntr_Mesh.vert_noramls.push(0);
         Cntr_Mesh.vert_noramls.push(1);
         Cntr_Mesh.vert_noramls.push(0);
         
         Cntr_Mesh.vert_uvcoords.push(0);
         Cntr_Mesh.vert_uvcoords.push(0);
         
         Cntr_Mesh.vert_colours.push(cntr_colour[0]);
         Cntr_Mesh.vert_colours.push(cntr_colour[1]);
         Cntr_Mesh.vert_colours.push(cntr_colour[2]);
         Cntr_Mesh.vert_colours.push(cntr_colour[3]);
         
         Cntr_Mesh.Indices.push(2);
         Cntr_Mesh.Indices.push(0);
         
        Cntr_Mesh.mesh_vertices.push(0);
         Cntr_Mesh.mesh_vertices.push(0);
         Cntr_Mesh.mesh_vertices.push(end); 
         
         Cntr_Mesh.vert_noramls.push(0);
         Cntr_Mesh.vert_noramls.push(1);
         Cntr_Mesh.vert_noramls.push(0);
         
         Cntr_Mesh.vert_uvcoords.push(0);
         Cntr_Mesh.vert_uvcoords.push(0);
         
         Cntr_Mesh.vert_colours.push(cntr_colour[0]);
         Cntr_Mesh.vert_colours.push(cntr_colour[1]);
         Cntr_Mesh.vert_colours.push(cntr_colour[2]);
         Cntr_Mesh.vert_colours.push(cntr_colour[3]);
         
         Cntr_Mesh.Indices.push(3);
         Cntr_Mesh.Indices.push(0);


        Cntr_Mesh.InitialiseBuffers();
        Cntr_Mesh.meshType = MeshType.Lines;*/
      
// The X Axis
  var xcolour = [1, 0, 0, 1]; 
        XAxisMesh.mesh_vertices.push(0);
         XAxisMesh.mesh_vertices.push(0);
         XAxisMesh.mesh_vertices.push(0); 
         
         XAxisMesh.vert_noramls.push(0);
         XAxisMesh.vert_noramls.push(1);
         XAxisMesh.vert_noramls.push(0);
         
         XAxisMesh.vert_uvcoords.push(0);
         XAxisMesh.vert_uvcoords.push(0);
         
         XAxisMesh.vert_colours.push(xcolour[0]);
         XAxisMesh.vert_colours.push(xcolour[1]);
         XAxisMesh.vert_colours.push(xcolour[2]);
         XAxisMesh.vert_colours.push(xcolour[3]);
         
         XAxisMesh.Indices.push(0);

         XAxisMesh.mesh_vertices.push(10);
         XAxisMesh.mesh_vertices.push(0);
         XAxisMesh.mesh_vertices.push(0); 
         
         XAxisMesh.vert_noramls.push(0);
         XAxisMesh.vert_noramls.push(1);
         XAxisMesh.vert_noramls.push(0);
         
         XAxisMesh.vert_uvcoords.push(0);
         XAxisMesh.vert_uvcoords.push(0);
         
         XAxisMesh.vert_colours.push(xcolour[0]);
         XAxisMesh.vert_colours.push(xcolour[1]);
         XAxisMesh.vert_colours.push(xcolour[2]);
         XAxisMesh.vert_colours.push(xcolour[3]);
         
         XAxisMesh.Indices.push(1);
        XAxisMesh.initBasicTexture();
        XAxisMesh.InitialiseBuffers();
        XAxisMesh.meshType = MeshType.Lines;
         

// The Y Axis
  var ycolour = [0, 1, 0, 1]; 
        YAxisMesh.mesh_vertices.push(0);
         YAxisMesh.mesh_vertices.push(0);
         YAxisMesh.mesh_vertices.push(0); 
         
         YAxisMesh.vert_noramls.push(0);
         YAxisMesh.vert_noramls.push(1);
         YAxisMesh.vert_noramls.push(0);
         
         YAxisMesh.vert_uvcoords.push(0);
         YAxisMesh.vert_uvcoords.push(0);
         
         YAxisMesh.vert_colours.push(ycolour[0]);
         YAxisMesh.vert_colours.push(ycolour[1]);
         YAxisMesh.vert_colours.push(ycolour[2]);
         YAxisMesh.vert_colours.push(ycolour[3]);
         
         YAxisMesh.Indices.push(0);

         YAxisMesh.mesh_vertices.push(0);
         YAxisMesh.mesh_vertices.push(10);
         YAxisMesh.mesh_vertices.push(0); 
         
         YAxisMesh.vert_noramls.push(0);
         YAxisMesh.vert_noramls.push(1);
         YAxisMesh.vert_noramls.push(0);
         
         YAxisMesh.vert_uvcoords.push(0);
         YAxisMesh.vert_uvcoords.push(0);
         
         YAxisMesh.vert_colours.push(ycolour[0]);
         YAxisMesh.vert_colours.push(ycolour[1]);
         YAxisMesh.vert_colours.push(ycolour[2]);
         YAxisMesh.vert_colours.push(ycolour[3]);
         
         YAxisMesh.Indices.push(1);
        YAxisMesh.initBasicTexture();
        YAxisMesh.InitialiseBuffers();
        YAxisMesh.meshType = MeshType.Lines;


// The Z Axis
  var zcolour = [0.25, 0.5, 1, 1]; 
        ZAxisMesh.mesh_vertices.push(0);
         ZAxisMesh.mesh_vertices.push(0);
         ZAxisMesh.mesh_vertices.push(0); 
         
         ZAxisMesh.vert_noramls.push(0);
         ZAxisMesh.vert_noramls.push(1);
         ZAxisMesh.vert_noramls.push(0);
         
         ZAxisMesh.vert_uvcoords.push(0);
         ZAxisMesh.vert_uvcoords.push(0);
         
         ZAxisMesh.vert_colours.push(zcolour[0]);
         ZAxisMesh.vert_colours.push(zcolour[1]);
         ZAxisMesh.vert_colours.push(zcolour[2]);
         ZAxisMesh.vert_colours.push(zcolour[3]);
         
         ZAxisMesh.Indices.push(0);

         ZAxisMesh.mesh_vertices.push(0);
         ZAxisMesh.mesh_vertices.push(0);
         ZAxisMesh.mesh_vertices.push(10); 
         
         ZAxisMesh.vert_noramls.push(0);
         ZAxisMesh.vert_noramls.push(1);
         ZAxisMesh.vert_noramls.push(0);
         
         ZAxisMesh.vert_uvcoords.push(0);
         ZAxisMesh.vert_uvcoords.push(0);
         
         ZAxisMesh.vert_colours.push(zcolour[0]);
         ZAxisMesh.vert_colours.push(zcolour[1]);
         ZAxisMesh.vert_colours.push(zcolour[2]);
         ZAxisMesh.vert_colours.push(zcolour[3]);
         
         ZAxisMesh.Indices.push(1);
        ZAxisMesh.initBasicTexture();
        ZAxisMesh.InitialiseBuffers();
        ZAxisMesh.meshType = MeshType.Lines;
        
    }