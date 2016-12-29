    var shaderProgram;
    var vertexPositionAttribute;
    var vertexColorAttribute;
    var hasTextureAttribute;

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var mvp = mat4.create();

    function webGLStart() {
        var canvas = document.getElementById("glcanvas3D");
        initGL(canvas);
        initShaders();
        initBuffers();


        gl.clearColor(0.20, 0.20, 0.20, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

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
        
        /*
        textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(textureCoordAttribute);
        */

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

        numOfElements = 0;

        // Create the Base Grid
        CreateGrid(250);

        // Craete the Axis system
        CreateAxis();



        var sel_colour = [0.1, 0.6, 1, 1];
        HoveredMesh.HasTexture = false;
        
        for (var i = 0; i < 3; i++) {
            HoveredMesh.mesh_vertices.push(0);
            HoveredMesh.mesh_vertices.push(0);
            HoveredMesh.mesh_vertices.push(0);
            
            
           // HoveredMesh.vert_uvcoords.push(0);
           // HoveredMesh.vert_uvcoords.push(1);

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
      
      if(safeToDraw == true)
{
stats.begin();

    // monitored code goes here
        currotX = Smooth(currotX, DegToRad(rotX), 8);
        currotY = Smooth(currotY, DegToRad(rotY), 8);
        curZoom = Smooth(curZoom, Zoom, 8);
        Cur_Center[0] = Smooth(Cur_Center[0], modelprop_Center[0], 8);
        Cur_Center[1] = Smooth(Cur_Center[1], modelprop_Center[1], 8);
        Cur_Center[2] = Smooth(Cur_Center[2], modelprop_Center[2], 8);

        // Clear the canvas before we start drawing on it.
        gl.clearColor(0, 0, 0, 1); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set the viewport to match
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Establish the perspective with which we want to view the
        // scene. Our field of view is 45 degrees, with a width/height
        // ratio of 640:480, and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
        var factor = -curZoom / 800;

        if (ProjectionType == vxProjectionType.Perspective) {
            mat4.perspective(45, canvas.width / canvas.height, 0.1, 1000000.0, pMatrix);
        } else if (ProjectionType == vxProjectionType.Ortho) {
            mat4.ortho(-factor * canvas.width / 2, factor * canvas.width / 2, -factor * canvas.height / 2, factor * canvas.height / 2, -10000, 10000, pMatrix);
        }
        
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        mat4.identity(mvMatrix);

        //mat4.translate(mvMatrix, [0, 0, curZoom]);
        mat4.translate(mvMatrix, [panX/10, panY/10, curZoom]);
        
        mat4.rotate(mvMatrix, currotY, [1, 0, 0]);
        mat4.rotate(mvMatrix, currotX, [0, 1, 0]);
        mat4.translate(mvMatrix, Cur_Center);
        
        mat4.translate(mvMatrix, [-panX/10, -panY/10, 0]);
        mat4.multiply(pMatrix, mvMatrix, mvp);
        // Save the current matrix, then rotate before we draw.

        mvPushMatrix();


        // Draw Mesh with Encoded Index Colour for Selection
        //***************************************************************************************
        gl.uniform1i(hasTextureAttribute, 0);

        for (var i = 0; i < MeshCollection.length; i++) {
            MeshCollection[i].DrawSelPreProc();
        }

        // Get Selection Information
        //***************************************************************************************
        var pixels = new Uint8Array(4);
        gl.readPixels(MouseState.x, gl.drawingBufferHeight - MouseState.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        HoverIndex = 0;
        HoverIndex = pixels[0] + pixels[1] * 255 + pixels[2] * 255 * 255;


        gl.clearColor(0.15, 0.15, 0.15, 1.0); // Clear to black, fully opaque
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Always draw the grid normally
        gl.uniform1i(hasTextureAttribute, 1);
        GridMesh.Draw();
        
        if(RenderState == vxRenderState.SurfaceNormal)
          gl.uniform1i(hasTextureAttribute, 3);
          
        if (RenderState != vxRenderState.Wireframe) {
            //New elegent Drawing code
            for (var i = 0; i < MeshCollection.length; i++) {
                MeshCollection[i].Draw();
            }
        }

        // Everything After this does not need shading
        gl.uniform1i(hasTextureAttribute, 2);

        // Only find index is selection is greater than 0
        if (HoverIndex > 0 && MeshCollection.length > 0) {
          
          //Keep a running count of the total
          var runningtotal = 0;
          
          // Now check if the Hover index is within this mesh's bounds
          for (var i = 0; i < MeshCollection.length; i++) {
            
            // Now check if the Hover Index is within this Mesh Collection
            if(HoverIndex >= MeshCollection[i].IndexStart && HoverIndex < MeshCollection[i].IndexEnd)
            {
              //Now Finally Draw the Face
              for (var j = 0; j < 9; j++)
              {
                HoveredMesh.mesh_vertices[j] = MeshCollection[i].mesh_vertices[(HoverIndex - 1 - runningtotal) * 9 + j];
                HoveredMesh.vert_noramls[j] = MeshCollection[i].vert_noramls[(HoverIndex - 1 - runningtotal) * 9 + j];
              }
              HoveredMesh.Model = MeshCollection[i].Model;
              
              HoveredMesh.InitialiseBuffers();
              HoveredMesh.SetCenter();
            }
            
          // Keep running total
          runningtotal = runningtotal + (MeshCollection[i].IndexEnd - MeshCollection[i].IndexStart);
          
          }
          
        } else {
            for (var i = 0; i < 9; i++)
                HoveredMesh.mesh_vertices[i] = 0;

            HoveredMesh.InitialiseBuffers();
            //
        }

        HoveredMesh.Draw();



        //Last thing to draw is the Selection

        for (var i = 0; i < SelectedMeshCollection.length; i++) {
            SelectedMeshCollection[i].Draw();
        }




        // Only Draw Edges if the Shaded Edge Settings is set
        for (var i = 0; i < MeshCollection.length; i++) {
            if (RenderState == vxRenderState.ShadedEdge) {
                MeshCollection[i].DrawEdge();
            }
            if (RenderState == vxRenderState.Wireframe) {
                MeshCollection[i].DrawWireframe();
            }
        }
        
        
        for (var i = 0; i < MeasureCollection.length; i++) {
            MeasureCollection[i].Draw();
        }
        
        //gl.uniform1i(hasTextureAttribute, 2);
        XAxisMesh.Draw();
        YAxisMesh.Draw();
        ZAxisMesh.Draw();
        
        
        var newCntr = [];
        newCntr.push(-modelprop_Center[0]);
        newCntr.push(-modelprop_Center[1]);
        newCntr.push(-modelprop_Center[2]);
        
        
        mat4.translate(mvMatrix,newCntr);
        Cntr_Mesh.Draw();

        

        mvPopMatrix();

        //Gimbal Viewport Size
        var size = 80;

        // Set the viewport to match
        gl.viewport(canvas.width - size, canvas.height - size, size, size);


        if (ProjectionType == vxProjectionType.Perspective) {
            mat4.perspective(45, 1, 0.1, 10000.0, pMatrix);
            
        } else if (ProjectionType == vxProjectionType.Ortho) {
            size = 15;
            mat4.ortho(-size, size, -size, size,  -10000, 10000, pMatrix);
        }


        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [-0.0, 0.0, -size / 2]);
        mat4.rotate(mvMatrix, currotY, [1, 0, 0]);
        mat4.rotate(mvMatrix, currotX, [0, 1, 0]);

        setMatrixUniforms();
        
        
        // Draw Axis
        XAxisMesh.Draw();
        YAxisMesh.Draw();
        ZAxisMesh.Draw();
        
   stats.end();
}
    }
