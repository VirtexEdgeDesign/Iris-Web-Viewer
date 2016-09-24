    var shaderProgram;
    var vertexPositionAttribute;
    var vertexColorAttribute;
    var hasTextureAttribute;
    
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    
    function webGLStart() {
        var canvas = document.getElementById("glcanvas3D");
        initGL(canvas);
        initShaders();
        initBuffers();

        
            gl.clearColor(0.20, 0.20, 0.20, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        drawScene();
        
    setInterval(drawScene, 15);
    
    }


    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        
        vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
  
        vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);

        hasTextureAttribute = gl.getUniformLocation(shaderProgram, "aHasTexture");

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
          
                  var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }


    function initBuffers() {
         
        var gridSize = 250;

  numOfElements = 0;
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
         
         GridMesh.vert_colours.push(temp_colour[0]);
         GridMesh.vert_colours.push(temp_colour[1]);
         GridMesh.vert_colours.push(temp_colour[2]);
         GridMesh.vert_colours.push(temp_colour[3]);
         
         GridMesh.Indices.push(count);
         count++;
        }
        
        GridMesh.InitialiseBuffers();
        GridMesh.meshType = MeshType.Lines;
        
        

// The X Axis
  var xcolour = [1, 0, 0, 1]; 
        XAxisMesh.mesh_vertices.push(0);
         XAxisMesh.mesh_vertices.push(0);
         XAxisMesh.mesh_vertices.push(0); 
         
         XAxisMesh.vert_noramls.push(0);
         XAxisMesh.vert_noramls.push(1);
         XAxisMesh.vert_noramls.push(0);
         
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
         
         XAxisMesh.vert_colours.push(xcolour[0]);
         XAxisMesh.vert_colours.push(xcolour[1]);
         XAxisMesh.vert_colours.push(xcolour[2]);
         XAxisMesh.vert_colours.push(xcolour[3]);
         
         XAxisMesh.Indices.push(1);
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
         
         YAxisMesh.vert_colours.push(ycolour[0]);
         YAxisMesh.vert_colours.push(ycolour[1]);
         YAxisMesh.vert_colours.push(ycolour[2]);
         YAxisMesh.vert_colours.push(ycolour[3]);
         
         YAxisMesh.Indices.push(1);
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
         
         ZAxisMesh.vert_colours.push(zcolour[0]);
         ZAxisMesh.vert_colours.push(zcolour[1]);
         ZAxisMesh.vert_colours.push(zcolour[2]);
         ZAxisMesh.vert_colours.push(zcolour[3]);
         
         ZAxisMesh.Indices.push(1);
        ZAxisMesh.InitialiseBuffers();
        ZAxisMesh.meshType = MeshType.Lines;
        



  var sel_colour = [ 0.1, 0.6, 1, 1];  
        for(var i = 0; i < 3; i++)
        {
          HoveredMesh.mesh_vertices.push(0); 
          HoveredMesh.mesh_vertices.push(0);
          HoveredMesh.mesh_vertices.push(0);
        
          HoveredMesh.vert_noramls.push(0);
          HoveredMesh.vert_noramls.push(1);
          HoveredMesh.vert_noramls.push(0);
        
          HoveredMesh.vert_colours.push(sel_colour[0]);
          HoveredMesh.vert_colours.push(sel_colour[1]);
          HoveredMesh.vert_colours.push(sel_colour[2]);
          HoveredMesh.vert_colours.push(sel_colour[3]);

          HoveredMesh.Indices.push(i);
        }

        HoveredMesh.InitialiseBuffers();

    }

    function drawScene() {

currotX = Smooth(currotX, DegToRad(rotX), 8);
currotY = Smooth(currotY, DegToRad(rotY), 8);
curZoom = Smooth(curZoom, Zoom, 8);

  // Clear the canvas before we start drawing on it.
  gl.clearColor(0,0,0,1); // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // Set the viewport to match
  gl.viewport(0, 0, canvas.width, canvas.height);
  
  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  var factor = -curZoom/400;

  if(ProjectionType == vxProjectionType.Perspective)
  {
        mat4.perspective(45, canvas.width / canvas.height, 0.1, 10000.0, pMatrix);
  }
  else if(ProjectionType == vxProjectionType.Ortho)
  {
        mat4.ortho(-factor*canvas.width/2, factor*canvas.width/2, 
    -factor*canvas.height/2, factor*canvas.height/2, -10000,10000);
}

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
        mat4.identity(mvMatrix);
        
        mat4.translate(mvMatrix, [-0.0, 0.0, curZoom]);
        mat4.rotate(mvMatrix, currotY, [1, 0, 0]);
        mat4.rotate(mvMatrix, currotX, [0, 1, 0]);
        mat4.translate(mvMatrix, modelprop_Center);
  
  // Save the current matrix, then rotate before we draw.
  
  mvPushMatrix();
  
  
// Draw Mesh with Encoded Index Colour for Selection
//***************************************************************************************
  gl.uniform1i(hasTextureAttribute, 0);

    for(var i = 0; i < MeshCollection.length; i++)
  {
    MeshCollection[i].DrawSelPreProc();
  }

// Get Selection Information
//***************************************************************************************
var pixels = new Uint8Array(4);
gl.readPixels(MouseState.x,gl.drawingBufferHeight - MouseState.y, 1,1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

HoverIndex = 0;
HoverIndex = pixels[0] + pixels[1] * 255 + pixels[2] * 255 * 255;


  gl.clearColor(0.15, 0.15, 0.15, 1.0);  // Clear to black, fully opaque
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform1i(hasTextureAttribute, 1);
  GridMesh.Draw();
  
if(RenderState != vxRenderState.Wireframe)
{
  //New elegent Drawing code
  for(var i = 0; i < MeshCollection.length; i++)
  {
      MeshCollection[i].Draw();
  }
}


// Everything After this does not need shading
  gl.uniform1i(hasTextureAttribute, 2);
  
 // Only find index is selection is greater than 0
 if(HoverIndex > 0 && MeshCollection.length > 0)
 {
    //Now Finally Draw the Face
  for(var i = 0; i < 9; i++)
    HoveredMesh.mesh_vertices[i] = MeshCollection[0].mesh_vertices[(HoverIndex - 1) * 9 + i];

    HoveredMesh.InitialiseBuffers();
  }
  else
  {
      for(var i = 0; i < 9; i++)
    HoveredMesh.mesh_vertices[i] = 0;

    HoveredMesh.InitialiseBuffers();
  }

HoveredMesh.Draw();



//Last thing to draw is the Selection

  for(var i = 0; i < SelectedMeshCollection.length; i++)
  {
    SelectedMeshCollection[i].Draw();
  }



// Only Draw Edges if the Shaded Edge Settings is set

   //New elegent Drawing code
  for(var i = 0; i < MeshCollection.length; i++)
  {
    if(RenderState == vxRenderState.ShadedEdge)
    {
      MeshCollection[i].DrawEdge();
    }
    if(RenderState == vxRenderState.Wireframe)
    {
      MeshCollection[i].DrawWireframe();
    }
  }


  mvPopMatrix();

  var size = 80;
  
  // Set the viewport to match
  gl.viewport(canvas.width - size, canvas.height - size, size, size);
 

  if(ProjectionType == vxProjectionType.Perspective)
  {
        mat4.perspective(45, 1, 0.1, 10000.0, pMatrix);
  }
  else if(ProjectionType == vxProjectionType.Ortho)
  { size = 15;
        mat4.ortho(-size,size,-size,size, 0.1, 10000.0);
  }
  
  
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
        mat4.identity(mvMatrix);
        
        mat4.translate(mvMatrix, [-0.0, 0.0, -size/2]);
        mat4.rotate(mvMatrix, currotY, [1, 0, 0]);
        mat4.rotate(mvMatrix, currotX, [0, 1, 0]);

  setMatrixUniforms();

  //gl.uniform1i(hasTextureAttribute, 2);
  //drawGrid();
  XAxisMesh.Draw();
  YAxisMesh.Draw();
  ZAxisMesh.Draw();


  //mvPopMatrix();
  
    }



function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
  
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}