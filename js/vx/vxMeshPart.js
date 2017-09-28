

function vxMeshPart (name) {
  
    // MeshPart Name
    this.Name = name;
    
    // The Owning Mesh
    this.Mesh = null;
    

    var col = 0.75;
    this.meshcolor = new vxColour(col, col, col, 1);
    
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
    
    // UV Texture Coordinates
    this.vert_uvcoords = [];
    this.edge_uvcoords = [];
    //this.HasTexture = true;
    
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

    this.edgeBuffers.verticies = null;
    this.edgeBuffers.normals= null;
    this.edgeBuffers.uvCoords= null;
    this.edgeBuffers.colours= null;
    this.edgeBuffers.indices= null;

    //What is the model type
    this.meshType = MeshType.Solid;
    
    //Should it be Drawn
    this.Enabled = true;

    this.AmbientColour = new vxColour(0.5,0.5,0.5, 1);
    
    this.Texture = null;

    this.HasTexture = 0;
    
    this.TextureImage = new Image();
    
    // The Max Point of this Mesh
    this.MaxPoint = new vxVertex3D(0,0,0);
    
    this.Center = [0,0,0];
    
    this.IndexStart = numOfFaces;
}

vxMeshPart.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
};

vxMeshPart.prototype.SetCenter = function() {
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

vxMeshPart.prototype.initBasicTexture = function()
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
  const pixel = new Uint8Array([255, 0, 255, 100]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);
}

vxMeshPart.prototype.loadTexture = function (gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  var mp = this;

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    mp.InitialiseBuffers();
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

vxMeshPart.prototype.initMaterials = function (mesh) {

  // Handle Ambient Colour
  //this.AmbientColour = mesh.Materials[mesh.MaterialName].AmbientColour;

  // Handle Textures
  var material = mesh.Materials[mesh.MaterialName];
  console.log(mesh.MaterialName);
  //console.log(material);
  if(mesh.Materials[mesh.MaterialName] == null){

    // set up material
    this.initBasicTexture();
  }
  else{
   var textName = mesh.Materials[mesh.MaterialName].DiffuseTexture.name;


    var src = ioImgs[textName.toString().trim().valueOf()];
     
    if(textName !== ""){

      if(src == null)
      {
        var missing_src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAADAFBMVEUAAAD/ANwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADyfiMeAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+EJHAMTMTRkFyAAAABySURBVHja7dixCQAwCATAd/+ls4BFIJhAOOsvTis16ara2o9mJAoAAAAAAAAAAPArYKSDujgXAAAAAAAAAAAAgGOAuwAAAAAAAAAAAMCrFgAAAAAAAAAAAMBaDgAAAAAAAAAAAOAuAAAAAAAAAAAAeA1YfPggAfk/15cAAAAASUVORK5CYII="
        //var missing_src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAgMAAAC+UIlYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QkcAxoOU8CBVAAAAAlQTFRFqAD//wD/////dFYIKwAAAAFiS0dEAmYLfGQAAAA3SURBVFjD7dShAcAwAMMwP5n/XxktKSubUIhQgNu2qtsG/Ar4AjjXB4A+APoA6AOgD4A+AI/AB1lFqB/c8lphAAAAAElFTkSuQmCC";
    
        this.HasTexture = 1;

       this.Texture = this.loadTexture(gl, missing_src);

       logLoadError(this.Mesh.Name, "Texture '"+textName+"' not found!", "The referenced texture '"+textName+"' can't be found! This is usually caused by a missing texture file.");
      }
      else
      {
        this.HasTexture = 1;

       this.Texture = this.loadTexture(gl, src);
    }
    }
}
};



// Initialises the Mesh
vxMeshPart.prototype.Init = function() {
  
  this.initBasicTexture();
  this.InitialiseBuffers();


 
  //gl.activeTexture(gl.TEXTURE0);
  //gl.bindTexture(gl.TEXTURE_2D, this.Texture);
  //gl.uniform1i(shader.uniformLocations.uSampler, 0);

  //this.IndexEnd = numOfFaces;
  this.IndexEnd = this.IndexStart + this.Indices.length/3;

  this.MaxPoint = new vxVertex3D(0,0,0);
  // Now get the Max Point of this Mesh Part
  var TestPoint = new vxVertex3D();
  for(var i = 0; i < this.mesh_vertices.length; i+=3)
  {
    TestPoint.Set(this.mesh_vertices[i],this.mesh_vertices[i+1], this.mesh_vertices[i+2]);

    if(TestPoint.Length() > this.MaxPoint.Length())
      this.MaxPoint.Set(this.mesh_vertices[i],this.mesh_vertices[i+1], this.mesh_vertices[i+2]);
  }

  // Now Add it to the MeshCollection
  MeshCollectionPart.push(this);
};

vxMeshPart.prototype.InitialiseBuffers = function(){
  
  this.meshBuffers.verticies = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.verticies);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh_vertices), gl.STATIC_DRAW);
  
    // Set up the normals for the vertices, so that we can compute lighting.
  this.meshBuffers.normals = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.normals);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_noramls), gl.STATIC_DRAW);
  
  // Set up the UV Texture Coordinates
  this.meshBuffers.uvCoords = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.uvCoords);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_uvcoords), gl.STATIC_DRAW);
  
  
  // Now set up the colors
  this.meshBuffers.colours = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.colours);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_colours), gl.STATIC_DRAW);

  this.meshBuffers.selectionColours = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.selectionColours);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_selcolours), gl.STATIC_DRAW);


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
  this.edgeBuffers.uvCoords = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.uvCoords);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_uvcoords), gl.STATIC_DRAW);

  // Now set up the colors
  this.edgeBuffers.colours = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.colours);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_colours), gl.STATIC_DRAW);





  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  this.edgeBuffers.indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffers.indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.EdgeIndices), gl.STATIC_DRAW);


//  console.log("Init");
/*
  this.Texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);
  */
  //this.initTextures();
};

vxMeshPart.prototype.DrawSelPreProc = function(){

  if(this.Enabled === true){

  gl.uniform1i(shader.uniformLocations.HasTexture, 0);
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


vxMeshPart.prototype.Draw = function(){
  
  if(this.Enabled === true){

  gl.uniform3fv(shader.uniformLocations.ambientColour, [this.AmbientColour.R, this.AmbientColour.G, this.AmbientColour.B]);

  var doTexture = (RenderState == vxRenderState.Textured) ? 1 : 0;
  gl.uniform1i(shader.uniformLocations.HasTexture, this.HasTexture * doTexture);
  //gl.uniform1i(shader.uniformLocations.HasTexture, 0);

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
  //console.log(this.Indices.length);
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshBuffers.indices);
  
  setMatrixUniforms();
  if(this.meshType == MeshType.Solid){
    gl.drawElements(gl.TRIANGLES, this.Indices.length, gl.UNSIGNED_SHORT, 0);
  }
  if(this.meshType == MeshType.Lines){
    gl.drawElements(gl.LINES, this.Indices.length, gl.UNSIGNED_SHORT, 0);
  }
  }
};

// Draws the Edge Mesh with using the Mesh Colours
vxMeshPart.prototype.DrawWireframe = function(){
  

  gl.uniform1i(shader.uniformLocations.HasTexture, 0);
  if(this.Enabled === true){

  if(this.meshType == MeshType.Solid){
  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.verticies );
  gl.vertexAttribPointer(shader.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.normals);
  gl.vertexAttribPointer(shader.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
  
  // Bind Texture Coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.uvCoords);
  gl.vertexAttribPointer(shader.attribLocations.txtrCoords, 2, gl.FLOAT, false, 0, 0);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);
  gl.uniform1i(shader.uniformLocations.uSampler, 0);
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshBuffers.wireframeColours);
  gl.vertexAttribPointer(shader.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffers.indices);
  
  setMatrixUniforms();

  gl.drawElements(gl.LINES, this.EdgeIndices.length, gl.UNSIGNED_SHORT, 0);

  }
  }
};


vxMeshPart.prototype.DrawEdge = function(){
  
  // always turn off the textures
  gl.uniform1i(shader.uniformLocations.HasTexture, 0);
  if(this.Enabled === true){

  if(this.meshType == MeshType.Solid){
  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.verticies );
  gl.vertexAttribPointer(shader.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.normals);
  gl.vertexAttribPointer(shader.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);

  // Bind Texture Coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.uvCoords);
  gl.vertexAttribPointer(shader.attribLocations.txtrCoords, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);
  gl.uniform1i(shader.uniformLocations.uSampler, 0);
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffers.colours);
  gl.vertexAttribPointer(shader.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffers.indices);
  
  setMatrixUniforms();

  gl.drawElements(gl.LINES, this.EdgeIndices.length, gl.UNSIGNED_SHORT, 0);

  }
}
};

vxMeshPart.prototype.AddVertices = function(vertices, normal, texCoord, colour, encodedIndexColor){
 
         this.mesh_vertices.push(vertices.X);
         this.mesh_vertices.push(vertices.Y);
         this.mesh_vertices.push(vertices.Z);
  
         this.vert_noramls.push(normal.X);
         this.vert_noramls.push(normal.Y);
         this.vert_noramls.push(normal.Z);
         
         
         this.vert_uvcoords.push(texCoord.X);
         this.vert_uvcoords.push(texCoord.Y);
         
         this.vert_colours.push(colour.R);
         this.vert_colours.push(colour.G);
         this.vert_colours.push(colour.B);
         this.vert_colours.push(colour.A);

         //Set Selection Colour
         this.vert_selcolours.push(encodedIndexColor.R);
         this.vert_selcolours.push(encodedIndexColor.G);
         this.vert_selcolours.push(encodedIndexColor.B);
         this.vert_selcolours.push(encodedIndexColor.A);

         //Increment Indicies
         this.Indices.push(this.Indices.length);
         
         // Now Check if it's outside the current bounds
         if(vertices.Length() > this.MaxPoint.Length())
         {
           this.MaxPoint.Set(vertices.X, vertices.Y, vertices.Z);
         }
};


// add a fave with a different normal for each vertices
vxMeshPart.prototype.AddFace = function(vert1, vert2, vert3, norm1, norm2, norm3, uv1, uv2, uv3, colour, encodedIndexColor){
    
  this.AddVertices(vert1, norm1, uv1, colour, encodedIndexColor);
  this.AddVertices(vert2, norm2, uv2,  colour, encodedIndexColor);
  this.AddVertices(vert3, norm3, uv3,  colour, encodedIndexColor);

  this.meshcolor.R = colour.R;
  this.meshcolor.G = colour.G;
  this.meshcolor.B = colour.B;
  this.meshcolor.A = 1;

  this.AddEdge(vert1, vert2);
  this.AddEdge(vert2, vert3);
  this.AddEdge(vert3, vert1);
};

vxMeshPart.prototype.AddEdge = function(vert1, vert2){

  this.edgevertices.push(vert1.X);
  this.edgevertices.push(vert1.Y);
  this.edgevertices.push(vert1.Z);

  this.edgevertices.push(vert2.X);
  this.edgevertices.push(vert2.Y);
  this.edgevertices.push(vert2.Z);

  this.edge_noramls.push(1);
  this.edge_noramls.push(0);
  this.edge_noramls.push(0);
  this.edge_noramls.push(1);
  this.edge_noramls.push(0);
  this.edge_noramls.push(0);

  this.edge_uvcoords.push(0);
  this.edge_uvcoords.push(1);
  this.edge_uvcoords.push(0);
  this.edge_uvcoords.push(1);

  this.edge_colours.push(0);
  this.edge_colours.push(0);
  this.edge_colours.push(0);
  this.edge_colours.push(1);
  this.edge_colours.push(0);
  this.edge_colours.push(0);
  this.edge_colours.push(0);
  this.edge_colours.push(1);


  this.wire_colours.push(this.meshcolor.R);
  this.wire_colours.push(this.meshcolor.G);
  this.wire_colours.push(this.meshcolor.B);
  this.wire_colours.push(1);
  this.wire_colours.push(this.meshcolor.R);
  this.wire_colours.push(this.meshcolor.G);
  this.wire_colours.push(this.meshcolor.B);
  this.wire_colours.push(1);


  this.EdgeIndices.push(this.EdgeIndices.length);
  this.EdgeIndices.push(this.EdgeIndices.length);

  };
