var MeshType = {
    Solid: 0,
    Lines: 1
};

vec3.cross = function(out, a, b) {
        var ax = a[0], ay = a[1], az = a[2],
            bx = b[0], by = b[1], bz = b[2];

        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    };

vec3.avg = function(out, a, b) {
        var ax = a[0], ay = a[1], az = a[2],
            bx = b[0], by = b[1], bz = b[2];

        out[0] = (ax + bx)/2;
        out[1] = (ay + by)/2;
        out[2] = (az + bz)/2;
        return out;
    };

      vec3.fromValues = function(x, y, z) {
      var out = [0,0,0];
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out;
  };

vec3.angle = function(a, b) {
     
      var tempA = vec3.fromValues(a[0], a[1], a[2]);
      var tempB = vec3.fromValues(b[0], b[1], b[2]);
   
      vec3.normalize(tempA, tempA);
      vec3.normalize(tempB, tempB);
   
      var cosine = vec3.dot(tempA, tempB);

      if(cosine > 1.0){
          return 0;
      } else {
          return Math.acos(cosine);
      }     
  };

function vxMeasure (name, pt1, pt2, nrml1, nrml2) {
  
    // Mesh Name
    this.Name = name;
    
    // The Owning Model
    this.Model = null;
    
    var col = 0.75;
    this.meshcolor = new vxColour(col, col, col, 1);
    
    this.colour = [0, 162/255, 1, 1];
    
    // Place holders to determine if the Hover index is with in this
    // mesh or not.
    this.IndexStart = 0;
    this.IndexEnd = 0;

    //Vertice Array
    this.mesh_vertices = [];
    this.edgevertices = [];
    
    //Normal Array
    this.vert_noramls = [];
    this.edge_noramls = [];

    // texture uvs for consistency
    this.vert_uvcoords = [];
    this.edge_uvcoords = [];
    
    //Colour Array
    this.vert_colours = [];
    this.wire_colours = [];
    this.edge_colours = [];
    
    //Selection Colour Array
    this.vert_selcolours = [];

    //Indices
    this.Indices = [];
    this.EdgeIndices = [];
    
    this.meshBuffers = {
      verticies: null,
      normals: null,
      uvCoords: null,
      colours: null,
      selectionColours: null,
      wireframeColours: null,
      indices: null,
    }
    
    this.edgeBuffers = {
      verticies: null,
      normals: null,
      uvCoords: null,
      colours: null,
      selectionColours: null,
      wireframeColours: null,
      indices: null,
    }

    this.Texture = null;

    //What is the model type
    this.meshType = MeshType.Lines;
    
    //Should it be Drawn
    this.Enabled = true;
    
    // The Max Point of this Mesh
    this.MaxPoint = new vxVertex3D(0,0,0);
    
    this.Center = [0,0,0];
    
    this.IndexStart = numOfFaces;
    
    this.Point1 = pt1;
    this.Point2 = pt2;

    // Get the average vector of the face and then normalise it.
    this.Direction = new vxVertex3D(0,0,0);

    // setup the cross product
    this.CrossProd = [0,0,0];

    this.Delta = [0,0,0];
    this.Delta[0] = this.Point2[0] - this.Point1[0];
    this.Delta[1] = this.Point2[1] - this.Point1[1];
    this.Delta[2] = this.Point2[2] - this.Point1[2];

    this.NormalAvg = [0,0,0];


    vec3.cross(this.CrossProd, nrml1, nrml2);
    vec3.avg(this.NormalAvg, nrml1, nrml2);


    // If two vectors are parrellal, then we need to shift the normal direction slightly and re try the cross prod
    if(this.CrossProd[0]==0 && this.CrossProd[1]==0 && this.CrossProd[1]==0) {
        
          nrml2[0] = 1;
          nrml2[1] = 0;
          nrml2[2] = 0;

          vec3.cross(this.CrossProd, nrml1, nrml2);
          vec3.avg(this.NormalAvg, nrml1, nrml2);

          if(this.CrossProd[0]==0 && this.CrossProd[1]==0 && this.CrossProd[1]==0) {
            
              nrml2[0] = 0;
              nrml2[1] = 0;
              nrml2[2] = 1;

              vec3.cross(this.CrossProd, nrml1, nrml2);
              vec3.avg(this.NormalAvg, nrml1, nrml2);
          }
      }

      // Now we have a vector which is 90 degrees to both normals, which means it's also
      // tangent to both faces. With this we can then calculate a new cross product between
      // the tanget vector, and the vector between the two points.
      this.FinalCrossProd = [0,0,0];

    vec3.cross(this.FinalCrossProd, this.CrossProd, this.Delta);

    // Now check the angle between the Final Cross prod and the average normal this is
    // to prevent the leader lines going into the mesh. 
    var rad = vec3.angle(this.FinalCrossProd, this.NormalAvg);
    var angle = rad * 180/3.14159;
    var dirFactor = 1;
    if(angle > 90)
      dirFactor = -1;

    // First try setting the direction as the average of the two faces.
    this.Direction.X = this.FinalCrossProd[0] * dirFactor;
    this.Direction.Y = this.FinalCrossProd[1] * dirFactor;
    this.Direction.Z = this.FinalCrossProd[2] * dirFactor;

    this.Direction.Normalise();


    // now get the magnitude of the difference
    this.DeltaX = this.Point2[0] - this.Point1[0];
    this.DeltaY = this.Point2[1] - this.Point1[1];
    this.DeltaZ = this.Point2[2] - this.Point1[2];
    
    this.Length = Math.sqrt(this.DeltaX * this.DeltaX + this.DeltaY * this.DeltaY + this.DeltaZ * this.DeltaZ);
    
    // The height of the vertical lines
    this.vertLineHeight =  this.Length;
      
      // height of the distance marker line
    this.leaderHeight =  this.Length * 0.75;

    
      //log("Measurement");
      //log("=================================");
      //log("Point1 = " + this.Point1);
      //log("Point2 = " + this.Point2);
      //log("---------------------------------");
      //log("Direction = " + this.Direction.Z);
      //log("Length = " + this.Length);
      //log("=================================");
      
      this.leaderPadding = this.Length * 0.12525;

//      console.log(this.Direction);
      this.Direction.X = this.leaderHeight * this.Direction.X;
      this.Direction.Y = this.leaderHeight * this.Direction.Y;
      this.Direction.Z = this.leaderHeight * this.Direction.Z;
      
      // Top Distance Line
      this.AddVertices(-this.Point1[0] + this.Direction.X, -this.Point1[1] + this.Direction.Y, -this.Point1[2] + this.Direction.Z);
      this.AddVertices(-this.Point2[0] + this.Direction.X, -this.Point2[1] + this.Direction.Y, -this.Point2[2] + this.Direction.Z);
      

      this.Direction.X += this.leaderPadding * this.Direction.X;
      this.Direction.Y += this.leaderPadding * this.Direction.Y;
      this.Direction.Z += this.leaderPadding * this.Direction.Z;

      // First Leader Line
      this.AddVertices(-this.Point1[0], -this.Point1[1], -this.Point1[2]);
      this.AddVertices(-this.Point1[0] + this.Direction.X, -this.Point1[1] + this.Direction.Y, -this.Point1[2] + this.Direction.Z);
      
      // Second Leader Line
      this.AddVertices(-this.Point2[0], -this.Point2[1], -this.Point2[2]);
      this.AddVertices(-this.Point2[0] + this.Direction.X, -this.Point2[1] + this.Direction.Y, -this.Point2[2] + this.Direction.Z);
      
      
        this.InitialiseBuffers();
        //distanceMesh.meshType = MeshType.Lines;
        
        //this.Center = this.Point1[0];

        var lengthShort = this.Length.toString().substr(0, this.Length.toString().indexOf(".")+5);
        
    AddTreeNode("node_"+name, name, measureNodeId, "measure");
    AddTreeNode("node_"+name+"_dist", 'Distance: '+ lengthShort, "node_"+name, "bullet_vector");
    AddTreeNode("node_"+name+"_length", 'Length: '+ this.Length, "node_"+name+"_dist", "hash");
    AddTreeNode("node_"+name+"_deltax", 'Delta X: '+ this.DeltaX, "node_"+name+"_dist", "bullet_red");
    AddTreeNode("node_"+name+"_deltay", 'Delta Y: '+ this.DeltaY, "node_"+name+"_dist", "bullet_green");
    AddTreeNode("node_"+name+"_deltaz", 'Delta Z: '+ this.DeltaZ, "node_"+name+"_dist", "bullet_blue");
    
    this.TextPos = [0,0,0,0];
    this.TextCenter = [(-this.Point1[0] - this.Point2[0])/2 + this.Direction.X, (-this.Point1[1] - this.Point2[1])/2 + this.Direction.Y, (-this.Point1[2] - this.Point2[2])/2+ this.Direction.Z];
    
    var maindiv = document.getElementById("div_canvas");
    
    this.text = document.createElement("a");
     this.text.style.position = "absolute";
     this.text.style.top = "200px";
     this.text.style.left = "300px";
     this.text.innerHTML = this.Name +" = "+ lengthShort;
    //inp1.setAttribute("id", id); // added line
    this.text.setAttribute("class", "measure"); // added line
    
    maindiv.appendChild( this.text);
}


vxMeasure.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
};

vxMeasure.prototype.SetCenter = function() {
  var cnt = 0;
    for (var i = 0; i < this.mesh_vertices.length; i+=3) {
      cnt++;
      this.Center[0] += this.mesh_vertices[i];
      this.Center[1] += this.mesh_vertices[i+1];
      this.Center[2] += this.mesh_vertices[i+2];
    }
    if(cnt > 0)
    {
      this.Center[0] /= cnt;
      this.Center[1] /= cnt;
      this.Center[2] /= cnt;
    }
};

// Initialises the Mesh
vxMeasure.prototype.Init = function() {
  
  this.InitialiseBuffers();
  //this.IndexEnd = numOfFaces;
  //this.IndexEnd = this.IndexStart + this.Indices.length/3;
  
  // Now Add it to the MeshCollection
  //MeshCollection.push(this);
};

vxMeasure.prototype.initBasicTexture = function()
{
    this.Texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);
    const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 100, 255, 100]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);
}

vxMeasure.prototype.InitialiseBuffers = function(){
  
  this.initBasicTexture();
  console.log("initBasicTexture");

  this.meshBuffers.verticies = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.verticies);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh_vertices), gl.STATIC_DRAW);
  
    // Set up the normals for the vertices, so that we can compute lighting.
  this.meshBuffers.normals = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.normals);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_noramls), gl.STATIC_DRAW);
  
  // Now set up the colors
  this.meshBuffers.colours = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.colours);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_colours), gl.STATIC_DRAW);

  this.meshBuffers.selectionColours = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.selectionColours);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_selcolours), gl.STATIC_DRAW);

  // Set up the UV Texture Coordinates
  this.meshBuffers.uvCoords = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.uvCoords);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_uvcoords), gl.STATIC_DRAW);

  // Now set up the colors
  this.meshBuffers.wireframeColours = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.wireframeColours);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.wire_colours), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  this.meshBuffers.indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshBuffers.indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.Indices), gl.STATIC_DRAW);




// Edge Buffers
//*************************************************************************************
    this.edgeBuffers.verticies = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.verticies);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edgevertices), gl.STATIC_DRAW);
  
    // Set up the normals for the vertices, so that we can compute lighting.
  this.edgeBuffers.normals = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.normals);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_noramls), gl.STATIC_DRAW);
  
  // Now set up the colors
  this.edgeBuffers.colours = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.colours);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_colours), gl.STATIC_DRAW);

  // Now set up the uvs
  this.edgeBuffers.uvCoords = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.uvCoords);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_uvcoords), gl.STATIC_DRAW);




  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  this.edgeBuffers.indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffers.indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.EdgeIndices), gl.STATIC_DRAW);
};

vxMeasure.prototype.DrawSelPreProc = function(){

  if(this.Enabled === true){


  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.verticies );
  gl.vertexAttribPointer(shader.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.normals);
  gl.vertexAttribPointer(shader.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);

  // Bind Texture Coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.uvCoords);
  gl.vertexAttribPointer(shader.attribLocations.txtrCoords, 2, gl.FLOAT, false, 0, 0);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);
  gl.uniform1i(shader.uniformLocations.uSampler, 0);
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.selectionColours);
  gl.vertexAttribPointer(shader.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshBuffers.indices);
  
  setMatrixUniforms();
    
    if(this.meshType == MeshType.Solid){
      gl.drawElements(gl.TRIANGLES, this.Indices.length, gl.UNSIGNED_SHORT, 0);
    }
  }

};


vxMeasure.prototype.Draw = function(){


  // Set Text Position
  // ***************************************************************
  
  mat4.multiplyVec4(mvp, [this.TextCenter[0], this.TextCenter[1], this.TextCenter[2], 1] ,this.TextPos);

  this.TextPos[0] /= this.TextPos[3];
  this.TextPos[1] /= this.TextPos[3];

  this.TextPos[0] = (this.TextPos[0] + 1)/2 * canvas.width;
  this.TextPos[1] = (1 - this.TextPos[1])/2 * canvas.height;

//log(this.TextPos[0] + ", " + this.TextPos[1]);

  this.text.style.left =  Math.floor(this.TextPos[0]) - 50 + "px";
  this.text.style.top = Math.floor(this.TextPos[1]) + 20  + "px";
  
  
  
  // Draw the Lines
  // ***************************************************************
  if(this.Enabled === true){

  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.verticies );
  gl.vertexAttribPointer(shader.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.normals);
  gl.vertexAttribPointer(shader.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);

  // Bind Texture Coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.uvCoords);
  gl.vertexAttribPointer(shader.attribLocations.txtrCoords, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shader.attribLocations.txtrCoords);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);
  gl.uniform1i(shader.uniformLocations.uSampler, 0);
  //gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.colours);
  gl.vertexAttribPointer(shader.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshBuffers.indices);
  
  setMatrixUniforms();
  
  gl.drawElements(gl.LINES, this.Indices.length, gl.UNSIGNED_SHORT, 0);
  
  }
  
  else
  {
    
  this.text.style.left =  - 100 + "px";
  this.text.style.top = - 100  + "px";
  }
};


vxMeasure.prototype.AddVertices = function(vert1, vert2, vert3){
 
         this.mesh_vertices.push(vert1);
         this.mesh_vertices.push(vert2);
         this.mesh_vertices.push(vert3);
  
         this.vert_noramls.push(0);
         this.vert_noramls.push(1);
         this.vert_noramls.push(0);
         
         this.vert_uvcoords.push(0);
         this.vert_uvcoords.push(0);

         this.edge_uvcoords.push(0);
         this.edge_uvcoords.push(0);
         
         this.vert_colours.push(this.colour[0]);
         this.vert_colours.push(this.colour[1]);
         this.vert_colours.push(this.colour[2]);
         this.vert_colours.push(this.colour[3]);

         //Set Selection Colour
         this.vert_selcolours.push(0);
         this.vert_selcolours.push(0);
         this.vert_selcolours.push(0);
         this.vert_selcolours.push(1);

         //Increment Indicies
         this.Indices.push(this.Indices.length);
};