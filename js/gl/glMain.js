    
    //var vertexPositionAttribute;
    //var vertexColorAttribute;
    //var hasTextureAttribute;

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var mvp = mat4.create();

    // Vertex shader program

  const vsSource = `
    attribute vec3 aVertexPosition;
    attribute highp vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;

    
      
    
    // The Render Type for this shader
    uniform int uRenderType;

    // Model View Matrix
    uniform highp mat4 uModelViewMatrix;
      
    // Projection Matrix
    uniform highp mat4 uProjectionMatrix;
    
    // Normal Matrix
    uniform highp mat3 uNormalMatrix;
      
    varying highp vec2 vTextureCoord;
    
    varying highp vec4 vColor;
    
    varying highp vec3 vLighting;

            
      
      void main(void) {

        // get position
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1);
        
        // get Texture Coordinates
        vTextureCoord = aTextureCoord;

        //vHasTexture = uHasTexture;

    // 1 is a basic Diffuse Shader
      if (uRenderType == 1) {
        vColor = aVertexColor;
        
        // Apply lighting effect
        
        highp vec3 ambientLight = vec3(0.5);
        highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
        highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);
        
        highp vec3 transformedNormal = uNormalMatrix * aVertexNormal;
        
        highp float directional = max(dot(transformedNormal, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
    // 2 is a colourless shading
    else if (uRenderType == 2) {
        vLighting = vec3(1);
        vColor = aVertexColor;
    }
    // 3 - Nnormal shader
    else if (uRenderType == 3) {
        vLighting = vec3(1);
        vec3 normal = vec3(aVertexNormal.x*0.5, aVertexNormal.y*0.5, aVertexNormal.z*0.5) + vec3(0.5);
        vColor =  vec4(normalize(normal), 1);
    }
    
    // 4 - Toon Shader
    else if (uRenderType == 4) {
      vColor = aVertexColor;
        
        // Apply lighting effect
        
        highp vec3 ambientLight = vec3(0.5);
        highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
        highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);
        
        highp vec3 transformedNormal = uNormalMatrix * aVertexNormal;
        
        highp float directional = max(dot(transformedNormal, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
        
        float intensity = dot(directionalVector, transformedNormal);
        
            if (intensity > 0.95)
        vLighting = vec3(1.0,1, 1);
    else if (intensity > 0.5)
        vLighting = vec3(0.6,0.6,0.6);
    else if (intensity > 0.25)
        vLighting = vec3(0.2,0.2,0.2);
    else
        vLighting = vec3(0.1,0.1,0.10);
        
    }
    // if none of the render types are met, then it must be the selection mode
    else{

        vLighting = vec3(1);
        vColor = aVertexColor;
    }

      }
  `;

  // Fragment shader program

  const fsSource = `
    varying highp vec4 vColor;
    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;

    uniform int uHasTexture;

    // The Render Type for this shader
    uniform int uRenderTypeFS;
      
    uniform sampler2D uSampler;
      
      
      void main(void) {


    // 1 is a basic Diffuse Shader
    if (uRenderTypeFS == 1) {
        if(uHasTexture == 0){
            gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).rgb * vLighting, texture2D(uSampler, vTextureCoord).a);
        }
        else{
            gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
        }
    }
    else{
            gl_FragColor = vec4(vColor);
        }
    }
  `;

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aTextureCoord and also
  // look up uniform locations.

  //gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));//vec4(vColor.rgb * vLighting, vColor.a);
  var programInfo;


    function webGLStart() {
        var canvas = document.getElementById("glcanvas3D");
        initGL(canvas);
        initShaders();
        initBuffers();


        gl.clearColor(0.15, 0.15, 0.15, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        drawScene();

        setInterval(drawScene, 15);
    }


//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const newShader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(newShader, source);

  // Compile the shader program

  gl.compileShader(newShader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(newShader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(newShader));
    gl.deleteShader(newShader);
    return null;
  }

  return newShader;
}

function initShaders() {

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  //      var fragmentShader = getShader(gl, "shader-fs");
    //    var vertexShader = getShader(gl, "shader-vs");

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }



        shader = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      txtrCoords: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        renderType: gl.getUniformLocation(shaderProgram, 'uRenderType'),
        renderTypeFS: gl.getUniformLocation(shaderProgram, 'uRenderTypeFS'),
        HasTexture: gl.getUniformLocation(shaderProgram, 'uHasTexture'),
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };
        gl.useProgram(shader.program);

//console.log(gl.getAttribLocation.length);
        gl.enableVertexAttribArray(shader.attribLocations.vertexPosition);
        gl.enableVertexAttribArray(shader.attribLocations.vertexNormal);
        gl.enableVertexAttribArray(shader.attribLocations.vertexColor);
        gl.enableVertexAttribArray(shader.attribLocations.txtrCoords);
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, pMatrix);
        gl.uniformMatrix4fv(shader.uniformLocations.modelViewMatrix, false, mvMatrix);

        // recalculate the normal matrix as the transposition of the inverted 3x3 matrice of the View Matrix.
        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shader.uniformLocations.normalMatrix, false, normalMatrix);
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
            
            
            HoveredMesh.vert_uvcoords.push(0);
            HoveredMesh.vert_uvcoords.push(1);

            HoveredMesh.vert_noramls.push(0);
            HoveredMesh.vert_noramls.push(1);
            HoveredMesh.vert_noramls.push(0);

            HoveredMesh.vert_colours.push(sel_colour[0]);
            HoveredMesh.vert_colours.push(sel_colour[1]);
            HoveredMesh.vert_colours.push(sel_colour[2]);
            HoveredMesh.vert_colours.push(sel_colour[3]);

            HoveredMesh.Indices.push(i);
        }
        HoveredMesh.initBasicTexture();

        HoveredMesh.InitialiseBuffers();

    }


    vec3.transformMat4 = function(out, a, m) {
        var x = a[0], y = a[1], z = a[2],
            w = m[3] * x + m[7] * y + m[11] * z + m[15];
        w = w || 1.0;
        out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        return out;
    };
        var center = [0,0,0];

    vec3.cross = function(out, a, b) {
        var ax = a[0], ay = a[1], az = a[2],
            bx = b[0], by = b[1], bz = b[2];

        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    };

        vec3.normalize = function(out, a) {
        var x = a[0],
            y = a[1],
            z = a[2];
        var len = x*x + y*y + z*z;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out[0] = a[0] * len;
            out[1] = a[1] * len;
            out[2] = a[2] * len;
        }
        return out;
    };

    function drawScene() {
      
      if(safeToDraw == true)
{
stats.begin();

    var resp = 8;
    // monitored code goes here
        currotX = Smooth(currotX, DegToRad(rotX), resp);
        currotY = Smooth(currotY, DegToRad(rotY), resp);
        curZoom = Smooth(curZoom, Zoom, resp);


        var theta = currotX;
        var phi = currotY;
        
        var up = [0,1,0];
        up[0] = Math.sin(theta)*Math.sin(phi);
        up[1] = Math.cos(phi);
        up[2] = -Math.cos(theta)*Math.sin(phi);
        //console.log(up);

        //var center = [0,0,0];
        
        // now get the foward vector, the right vector will be the x-product of that
        // and the up vector.
        var fwd = [0, 0, 0];
        var eye = [0, 0, curZoom];
        eye[0] = Math.sin(theta) * Math.cos(phi)* curZoom;
        eye[1] = -Math.sin(phi) * curZoom;
        eye[2] = -Math.cos(theta)*Math.cos(phi) * curZoom;

        fwd[0] = center[0]- eye[0];
        fwd[1] = center[1]- eye[1];
        fwd[2] = center[2]- eye[2];

        var fwdN = [0, 0, 0];
        vec3.normalize(fwdN, fwd);
        var right = [0, 0, 0];
        vec3.cross(right, up, fwdN);

        modelprop_Center[0] += panY * up[0] + panX * right[0];
        modelprop_Center[1] += panY * up[1] + panX * right[1];
        modelprop_Center[2] += panY * up[2] + panX * right[2];
        //mat4.translate(mvMatrix, [panY/10 * up[0], panY/10 * up[1], panY/10 * up[2]]);
        //mat4.translate(mvMatrix, [-panX/10 * right[0], -panX/10 * right[1], -panX/10 * right[2]]);
    panX = 0;
    panY = 0;


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

        mat4.translate(mvMatrix, [0, 0, curZoom]);
        
        mat4.translate(mvMatrix, [-2*panX/10, -2*panY/10, 0]);
        mat4.rotate(mvMatrix, currotY, [1, 0, 0]);
        mat4.rotate(mvMatrix, currotX, [0, 1, 0]);


        // Now get the cross product of the 

        //vec3.transformMat4(Cur_Center, mvMatrix, [panX/10, panY/10, 0]);
        mat4.translate(mvMatrix, Cur_Center);
        
        mat4.multiply(pMatrix, mvMatrix, mvp);
        // Save the current matrix, then rotate before we draw.

        mvPushMatrix();


        // Draw Mesh with Encoded Index Colour for Selection
        //***************************************************************************************
        gl.uniform1i(shader.uniformLocations.renderType, 0);
        gl.uniform1i(shader.uniformLocations.renderTypeFS, 0);


        for (var i = 0; i < MeshCollection.length; i++) {
            MeshCollection[i].DrawSelPreProc();
        }

        // Get Selection Information
        //***************************************************************************************
        var pixels = new Uint8Array(4);
        gl.readPixels(MouseState.x, gl.drawingBufferHeight - MouseState.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        HoverIndex = 0;
        HoverIndex = pixels[0] + pixels[1] * 255 + pixels[2] * 255 * 255;

        var backCol = 0.125;
        gl.clearColor(backCol, backCol, backCol, 1.0); // Clear to black, fully opaque
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Always draw the grid normally
        gl.uniform1i(shader.uniformLocations.renderType, 1);
        gl.uniform1i(shader.uniformLocations.renderTypeFS, 1);
        GridMesh.Draw();
        
        if(RenderState == vxRenderState.SurfaceNormal)
        {
            // Set to Normal View
            gl.uniform1i(shader.uniformLocations.renderType, 3);

            // Deactivate All Textures
            gl.uniform1i(shader.uniformLocations.renderTypeFS, 0);
        }
          
        if (RenderState != vxRenderState.Wireframe) {
            //New elegent Drawing code
            for (var i = 0; i < MeshCollection.length; i++) {
                MeshCollection[i].Draw();
            }
        }

        // Everything After this does not need shading
        gl.uniform1i(shader.uniformLocations.renderType, 2);

        // Only find index is selection is greater than 0
        if (HoverIndex > 0 && MeshCollectionPart.length > 0) {
          
          //Keep a running count of the total
          var runningtotal = 0;
          
          // Now check if the Hover index is within this mesh's bounds
          for (var i = 0; i < MeshCollectionPart.length; i++) {
            
            // Now check if the Hover Index is within this Mesh Collection
            if(HoverIndex >= MeshCollectionPart[i].IndexStart && HoverIndex < MeshCollectionPart[i].IndexEnd)
            {
              //Now Finally Draw the Face
              for (var j = 0; j < 9; j++)
              {
                HoveredMesh.mesh_vertices[j] = MeshCollectionPart[i].mesh_vertices[(HoverIndex - 1 - runningtotal) * 9 + j];
                HoveredMesh.vert_noramls[j] = MeshCollectionPart[i].vert_noramls[(HoverIndex - 1 - runningtotal) * 9 + j];
              }
              HoveredMesh.Model = MeshCollectionPart[i].Model;
              
              HoveredMesh.InitialiseBuffers();
              HoveredMesh.SetCenter();
            }
            
          // Keep running total
          runningtotal = runningtotal + (MeshCollectionPart[i].IndexEnd - MeshCollectionPart[i].IndexStart);
          
          }
          
        } else {
            for (var i = 0; i < 9; i++)
                HoveredMesh.mesh_vertices[i] = 0;

            HoveredMesh.InitialiseBuffers();
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
        
        gl.uniform1i(shader.uniformLocations.HasTexture, 1);
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
        
        
        //mat4.translate(mvMatrix,newCntr);
        //Cntr_Mesh.Draw();

        

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





function SetViewToTop() {
rotY = 90;
rotX = 90;
}

function SetViewToBottom() {
rotY = -90;
rotX = 90;
}

function SetViewToFront() {
rotY = 0;
rotX = 270;
}

function SetViewToBack() {
rotY = 0;
rotX = 90;
}

function SetViewToLeft() {
rotY = 0;
rotX = 180;
}

function SetViewToRight() {
rotY = 0;
rotX = 0;
}




function SetShadingToEdge() {
    RenderState = vxRenderState.ShadedEdge;
    log("RenderState = " + RenderState);
}

function SetShadingToShaded() {
    RenderState = vxRenderState.Shaded;
    log("RenderState = " + RenderState);
}

function SetShadingToWireframe() {
    RenderState = vxRenderState.Wireframe;
    log("RenderState = " + RenderState);
}

function SetShadingToNormal() {
    RenderState = vxRenderState.SurfaceNormal;
    log("RenderState = " + RenderState);
}


function SetViewToPerspective() {
    ProjectionType = vxProjectionType.Perspective;
    log("ProjectionType = " + ProjectionType);
}

function SetViewToOrtho() {
    ProjectionType = vxProjectionType.Ortho;
    log("ProjectionType = " + ProjectionType);
}



