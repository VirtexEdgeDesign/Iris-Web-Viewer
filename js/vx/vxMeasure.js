var MeshType = {
    Solid: 0,
    Lines: 1
};

function vxMeasure (name, pt1, pt2, nrml) {
  
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
    
    //Colour Array
    this.vert_colours = [];
    this.wire_colours = [];
    this.edge_colours = [];
    
    //Selection Colour Array
    this.vert_selcolours = [];

    //Indices
    this.Indices = [];
    this.EdgeIndices = [];
    
    //Buffers
    this.meshVerticesBuffer = null;
    this.meshVerticesNormalBuffer= null;
    this.meshVerticesColorBuffer= null;
    this.meshVerticesSelectionColorBuffer= null;
    this.meshVerticesWireframeColorBuffer= null;
    this.meshVerticesIndexBuffer= null;
    
    this.edgeVerticesBuffer = null;
    this.edgeVerticesNormalBuffer= null;
    this.edgeVerticesColorBuffer= null;
    this.edgeVerticesIndexBuffer= null;

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
    this.Direction = nrml;
    this.Direction.Normalise();

    // If two vectors are parrellal, then the average will 0 out. this is a check for that.
    if(this.Direction.X==0 && this.Direction.Y==0 && this.Direction.Z==0)
      this.Direction.Y = 1;
    
    this.DeltaX = this.Point2[0] - this.Point1[0];
    this.DeltaY = this.Point2[1] - this.Point1[1];
    this.DeltaZ = this.Point2[2] - this.Point1[2];
    
    this.Length = Math.sqrt(this.DeltaX * this.DeltaX + this.DeltaY * this.DeltaY + this.DeltaZ * this.DeltaZ);
    
          // The height of the vertical lines
    this.vertLineHeight =  this.Length / 2;
      
      // height of the distance marker line
    this.leaderHeight = this.vertLineHeight;
    
      console.log("Measurement");
      console.log("=================================");
      //console.log("Point1 = " + this.Point1);
      //console.log("Point2 = " + this.Point2);
      //console.log("---------------------------------");
      //console.log("Direction = " + this.Direction.Z);
      console.log("Length = " + this.Length);
      console.log("=================================");
      
      this.leaderPadding = 1.0;

      this.Direction.X = this.leaderHeight * this.Direction.X;
      this.Direction.Y = this.leaderHeight * this.Direction.Y;
      this.Direction.Z = this.leaderHeight * this.Direction.Z;
      
      // Top Distance Line
      this.AddVertices(-this.Point1[0] + this.Direction.X, -this.Point1[1] + this.Direction.Y, -this.Point1[2] + this.Direction.Z);
      this.AddVertices(-this.Point2[0] + this.Direction.X, -this.Point2[1] + this.Direction.Y, -this.Point2[2] + this.Direction.Z);
      

      this.Direction.X = this.leaderPadding * this.Direction.X;
      this.Direction.Y = this.leaderPadding * this.Direction.Y;
      this.Direction.Z = this.leaderPadding * this.Direction.Z;

      // First Leader Line
      this.AddVertices(-this.Point1[0], -this.Point1[1], -this.Point1[2]);
      this.AddVertices(-this.Point1[0] + this.Direction.X, -this.Point1[1] + this.Direction.Y, -this.Point1[2] + this.Direction.Z);
      
      // Second Leader Line
      this.AddVertices(-this.Point2[0], -this.Point2[1], -this.Point2[2]);
      this.AddVertices(-this.Point2[0] + this.Direction.X, -this.Point2[1] + this.Direction.Y, -this.Point2[2] + this.Direction.Z);
      
      
        this.InitialiseBuffers();
        //distanceMesh.meshType = MeshType.Lines;
        
        //this.Center = this.Point1[0];
        
        
    AddTreeNode("node_"+name, name, measureNodeId, "measure");
    AddTreeNode("node_"+name+"_dist", 'Distance: '+ this.Length, "node_"+name, "bullet_vector");
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
     this.text.innerHTML = this.Name +" = "+ this.Length.toString().substr(0, this.Length.toString().indexOf(".")+5);
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

vxMeasure.prototype.InitialiseBuffers = function(){
  
  this.meshVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh_vertices), gl.STATIC_DRAW);
  
    // Set up the normals for the vertices, so that we can compute lighting.
  this.meshVerticesNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_noramls), gl.STATIC_DRAW);
  
  // Now set up the colors
  this.meshVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_colours), gl.STATIC_DRAW);

  this.meshVerticesSelectionColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesSelectionColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_selcolours), gl.STATIC_DRAW);


  // Now set up the colors
  this.meshVerticesWireframeColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesWireframeColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.wire_colours), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  this.meshVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshVerticesIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.Indices), gl.STATIC_DRAW);




// Edge Buffers
//*************************************************************************************
    this.edgeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edgevertices), gl.STATIC_DRAW);
  
    // Set up the normals for the vertices, so that we can compute lighting.
  this.edgeVerticesNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_noramls), gl.STATIC_DRAW);
  
  // Now set up the colors
  this.edgeVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_colours), gl.STATIC_DRAW);





  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  this.edgeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeVerticesIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.EdgeIndices), gl.STATIC_DRAW);
};

vxMeasure.prototype.DrawSelPreProc = function(){

  if(this.Enabled === true){


  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesBuffer );
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesNormalBuffer);
  gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesSelectionColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshVerticesIndexBuffer);
  
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
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesBuffer );
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesNormalBuffer);
  gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshVerticesIndexBuffer);
  
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