    //var vertexPositionAttribute;
    //var vertexColorAttribute;
    //var hasTextureAttribute;

    //var mvMatrix = mat4.create();
    var Camera = new vxCamera();
    //var pMatrix = mat4.create();
    

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
        if(uHasTexture == 1){
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
        gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, Camera.projection);
        gl.uniformMatrix4fv(shader.uniformLocations.modelViewMatrix, false, Camera.view);

        // recalculate the normal matrix as the transposition of the inverted 3x3 matrice of the View Matrix.
        var normalMatrix = mat3.create();
        mat4.toInverseMat3(Camera.view, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shader.uniformLocations.normalMatrix, false, normalMatrix);
    }

var pixels = new Uint8Array(4);
    function initBuffers() {

        numOfElements = 0;

        // Create the Base Grid
        CreateGrid(250);

        // Craete the Axis system
        CreateAxis();


        var sel_colour = [0.1, 0.6, 1, 1];
        HoveredMesh.HasTexture = 0;

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

    function drawScene() {

        if (safeToDraw == true) {
            stats.begin();


            // Clear the canvas before we start drawing on it.
            gl.clearColor(0, 0, 0, 1); // Clear to black, fully opaque
            gl.clearDepth(1.0); // Clear everything
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Set the viewport to match
            gl.viewport(0, 0, canvas.width, canvas.height);

            // Update Camera
            Camera.update();

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
            
            gl.readPixels(MouseState.x, gl.drawingBufferHeight - MouseState.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

            HoverIndex = 0;
            HoverIndex = pixels[0] + pixels[1] * 255 + pixels[2] * 255 * 255;

            var backCol = 0.1;
            gl.clearColor(backCol, backCol, backCol, 1.0); // Clear to black, fully opaque
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Always draw the grid normally
            gl.uniform1i(shader.uniformLocations.renderType, 1);
            gl.uniform1i(shader.uniformLocations.renderTypeFS, 1);
            GridMesh.Draw();

            if (RenderState == vxRenderState.SurfaceNormal) {
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
                    if (HoverIndex >= MeshCollectionPart[i].IndexStart && HoverIndex < MeshCollectionPart[i].IndexEnd) {
                        //Now Finally Draw the Face
                        for (var j = 0; j < 9; j++) {
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
                if (ShowEdges == true) {
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


            if (Camera.projectionType == vxProjectionType.Perspective) {
                mat4.perspective(45, 1, 0.1, 10000.0, Camera.projection);

            } else if (Camera.projectionType == vxProjectionType.Ortho) {
                size = 15;
                mat4.ortho(-size, size, -size, size, -10000, 10000, Camera.projection);
            }


            // Set the drawing position to the "identity" point, which is
            // the center of the scene.
            mat4.identity(Camera.view);

            mat4.translate(Camera.view, [-0.0, 0.0, -size / 2]);
            mat4.rotate(Camera.view, Camera.phi, [1, 0, 0]);
            mat4.rotate(Camera.view, Camera.theta, [0, 1, 0]);

            setMatrixUniforms();


            // Draw Axis
            XAxisMesh.Draw();
            YAxisMesh.Draw();
            ZAxisMesh.Draw();

            stats.end();
        }
    }




    function SetViewToIso() {
        Camera.rotX = -45;
        Camera.rotY = 30;
    }

    function SetViewToTop() {
        Camera.rotY = 90;
        Camera.rotX = 90;
    }

    function SetViewToBottom() {
        Camera.rotY = -90;
        Camera.rotX = 90;
    }

    function SetViewToFront() {
        Camera.rotY = 0;
        Camera.rotX = 270;
    }

    function SetViewToBack() {
        Camera.rotY = 0;
        Camera.rotX = 90;
    }

    function SetViewToLeft() {
        Camera.rotY = 0;
        Camera.rotX = 180;
    }

    function SetViewToRight() {
        Camera.rotY = 0;
        Camera.rotX = 0;
    }


    function AdjustZoom(amount) {
        Camera.zoom *= amount;
    }

    function FitZoom() {
        for (var i = 0; i < ModelCollection.length; i++) {
            var model = ModelCollection[i];
            Camera.zoom = Math.min(-model.MaxPoint.Length() * 1.5, Camera.zoom) - 1;
        }
    }

    function SetEdgeRendering(value) {
        ShowEdges = value;
        log("ShowEdges = " + ShowEdges);
        SetMenuBarValues();
    }

    function SetShadingToTextured() {
        RenderState = vxRenderState.Textured;
        log("RenderState = " + RenderState);
        SetMenuBarValues();
    }

    function SetShadingToShaded() {
        RenderState = vxRenderState.Shaded;
        log("RenderState = " + RenderState);
        SetMenuBarValues();
    }

    function SetShadingToWireframe() {
        RenderState = vxRenderState.Wireframe;
        log("RenderState = " + RenderState);
        SetMenuBarValues();
    }

    function SetShadingToNormal() {
        RenderState = vxRenderState.SurfaceNormal;
        log("RenderState = " + RenderState);
        SetMenuBarValues();
    }


    function SetViewToPerspective() {
        Camera.projectionType = vxProjectionType.Perspective;
        log("ProjectionType = " + Camera.projectionType);
        SetMenuBarValues();
    }

    function SetViewToOrtho() {
        Camera.projectionType = vxProjectionType.Ortho;
        log("ProjectionType = " + Camera.projectionType);
        SetMenuBarValues();
    }

    var unSelCol = "";
    //var selCol = "#0094f7";
    //var selCol = "#0082d9";
    var selCol = "#555";

    function setMenuItemState(string, toggleState) {
        var item = document.getElementById(string);
        //document.getElementById(string).parentElement.style.backgroundColor = (toggleState == true) ? selCol : unSelCol;
        //document.getElementById(string).parentElement.style.border = (toggleState==true) ? "thin solid #0000FF" : "thin solid #333";
        //document.getElementById(string).parentElement.style.borderColor = (toggleState == true) ? selCol : unSelCol;
        //item.style.color = (toggleState == true) ? "#fff" : "#ccc";
    }


    function SetMenuBarValues() {

        // Handle Projection Type
        switch (Camera.projectionType) {
            case vxProjectionType.Perspective:
                setMenuItemState("menu_view_perspec", true);
                setMenuItemState("menu_view_ortho", false);
                break;
            case vxProjectionType.Ortho:
                setMenuItemState("menu_view_perspec", false);
                setMenuItemState("menu_view_ortho", true);
                break;
        }

        // Handle Shading Type
        switch (RenderState) {
            case vxRenderState.Textured:
                setMenuItemState("menu_view_textured", true);
                setMenuItemState("menu_view_shaded", false);
                setMenuItemState("menu_view_wireframe", false);
                setMenuItemState("menu_view_surfaceNormal", false);
                break;
            case vxRenderState.Shaded:
                setMenuItemState("menu_view_textured", false);
                setMenuItemState("menu_view_shaded", true);
                setMenuItemState("menu_view_wireframe", false);
                setMenuItemState("menu_view_surfaceNormal", false);
                break;
            case vxRenderState.Wireframe:
                setMenuItemState("menu_view_textured", false);
                setMenuItemState("menu_view_shaded", false);
                setMenuItemState("menu_view_wireframe", true);
                setMenuItemState("menu_view_surfaceNormal", false);
                break;
            case vxRenderState.SurfaceNormal:
                setMenuItemState("menu_view_textured", false);
                setMenuItemState("menu_view_shaded", false);
                setMenuItemState("menu_view_wireframe", false);
                setMenuItemState("menu_view_surfaceNormal", true);
                break;
        }

        // Handle Edge Rendering
        if (ShowEdges == true) {
            setMenuItemState("menu_view_doEdge", true);
            setMenuItemState("menu_view_noEdge", false);
        } else {
            setMenuItemState("menu_view_doEdge", false);
            setMenuItemState("menu_view_noEdge", true);
        }
    }













    // UTILTIES FOR WEBGL
    // --------------------------------------------------------------------
    // This class measures different values between mesh objects.

    // Converts Degrees to Radians
    function DegToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    // Converts Radians to Degrees
    function RadToDeg(radians) {
        return radians * 180 / Math.PI;
    }

    function Smooth(whatVarIs, whatVarShouldBe, steps) {
        return whatVarIs + (whatVarShouldBe - whatVarIs) / steps;
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
        mat4.set(Camera.view, copy);
        mvMatrixStack.push(copy);
    }

    // Pop a matrix off the stack
    function mvPopMatrix() {
        if (mvMatrixStack.length === 0) {
            throw "Invalid popMatrix!";
        }
        Camera.view = mvMatrixStack.pop();
    }



    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;



        } catch (e) {}
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }


    function CreateGrid(gridSize) {

        var temp_Normal = [0, 0, 0];
        //var temp_colour = [ 0.25, 0.25, 0.25, 1];  
        var temp_colour = [0.825, 0.825, 0.825, 1];
        var count = 0;
        /* Load In Vertex and Colour Data */
        for (var i = -gridSize; i < gridSize + 1; i += 5) {
            if (i % 20 === 0)
                temp_colour = [1, 1, 1, 1];
            else
                temp_colour = [0.7, 0.7, 0.7, 1];
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

    function CreateAxis() {
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