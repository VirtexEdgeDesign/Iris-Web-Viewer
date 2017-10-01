var MeshType = {
    Solid: 0,
    Lines: 1
};

function vxMesh (name) {
  
    // Mesh Name
    this.Name = name;
    
    // The Owning Model
    this.Model = null;
    
    // Mesh Parts Collection for this mesh, because the Draw call can only handle 65000 indices
    this.MeshParts = [];
    
    var col = 0.75;
    this.meshcolor = new vxColour(col, col, col, 1);
    
    // Place holders to determine if the Hover index is with in this
    // mesh or not.
    this.IndexStart = numOfFaces;
    this.IndexEnd = 0;

    // This keeps track of elements during addition
    this.ElementCount = 0;

    //What is the model type
    this.meshType = MeshType.Solid;
    
    //Should it be Drawn
    this.Enabled = true;
    
    this.Texture = null;

    this.activeMaterial = "";
    
    // The Max Point of this Mesh
    this.MaxPoint = new vxVertex3D(0,0,0);

    // The corresponding Mesh Tree node ID;
    this.TreeNodeID = null;
    
    this.Center = new vxVertex3D(0,0,0);
    

    // the temp mesh part
    this.tempMeshPart = new vxMeshPart();
    this.MeshParts.push(this.tempMeshPart);

    this.Materials={};

    this.MaterialName = "";


    // error management
    this.meshNoteCount = 0;

    this.meshLoadNotes = {};
}

vxMesh.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
};

vxMesh.prototype.logLoadError = function(title, descp){
this.meshNoteCount++;
this.meshLoadNotes[this.meshNoteCount]={
    type: FileLoadNoteType.ERR,
    fileName: this.Name,
    title: title,
    descp: descp,
    };
}


vxMesh.prototype.logLoadWarning = function (title, descp){
this.meshNoteCount++;
this.meshLoadNotes[this.meshNoteCount]={
    type: FileLoadNoteType.WRN,
    fileName: this.Name,
    title: title,
    descp: descp,
    };
}

vxMesh.prototype.getCenter = function() {
  var temp_center = [0,0,0];
  var count = 0;

  if(this.MeshParts.length > 0){
  for (var i = 0; i < this.MeshParts.length; i++) {

    for(var v = 0; v < this.MeshParts[i].mesh_vertices.length; v+=3){
      temp_center[0] += parseFloat(this.MeshParts[i].mesh_vertices[v]);
      temp_center[1] += parseFloat(this.MeshParts[i].mesh_vertices[v+1]);
      temp_center[2] += parseFloat(this.MeshParts[i].mesh_vertices[v+2]);
      count+=3;
    }
  }

  temp_center[0] /= count;
  temp_center[1] /= count;
  temp_center[2] /= count;

  this.Center.Set(temp_center[0], temp_center[1], temp_center[2]);
}
};

vxMesh.prototype.GetVerticesCount = function() {

var vertCount = 0;
  for (var i = 0; i < this.MeshParts.length; i++) {
            vertCount += this.MeshParts[i].mesh_vertices.length;
        }
return vertCount;
};

vxMesh.prototype.GetIndicesCount = function() {

var indCount = 0;
  for (var i = 0; i < this.MeshParts.length; i++) {
            indCount += this.MeshParts[i].Indices.length;
        }
return indCount;
};


vxMesh.prototype.initMaterials = function () {
  for (var i = 0; i < this.MeshParts.length; i++) {
    this.MeshParts[i].initMaterials(this);
    this.Materials[this.MeshParts[i].MaterialKey] = this.MeshParts[i].getMaterial();
  }
};

vxMesh.prototype.initBasicTexture = function () {
  for (var i = 0; i < this.MeshParts.length; i++) {
    this.MeshParts[i].initBasicTexture(this);
  }
};


// Initialises the Mesh
vxMesh.prototype.Init = function() {

  this.IndexEnd = numOfFaces;
  for (var i = 0; i < this.MeshParts.length; i++) {

    this.MeshParts[i].Name = this.Name + ".MeshPart."+i;
    //this.MeshParts[i].Model = this.Model;
    this.MeshParts[i].Mesh = this;
    //console.log(this.MeshParts[i].MaterialKey);
    this.MeshParts[i].Init();

    if(this.MeshParts[i].MaxPoint.Length() > this.MaxPoint.Length())

      this.MaxPoint.Set(this.MeshParts[i].MaxPoint.X, this.MeshParts[i].MaxPoint.Y, this.MeshParts[i].MaxPoint.Z);
        }
  
  // Now Add it to the MeshCollection
  MeshCollection.push(this);
};

vxMesh.prototype.InitialiseBuffers = function(){
  for (var i = 0; i < this.MeshParts.length; i++) {
            this.MeshParts[i].InitialiseBuffers();
        }
};

// initialises a new mesh part. this can be if 
vxMesh.prototype.initNewMeshPart = function () {
    // reset th element count
    this.ElementCount = 0;

    // create a new temp mesh part and add it to the, but only if it has vertices
    this.tempMeshPart = new vxMeshPart();
    this.tempMeshPart.Model = this.Model;
    this.tempMeshPart.Mesh = this;
    this.MeshParts.push(this.tempMeshPart);
    this.tempMeshPart.MaterialKey = this.activeMaterial;
};

// this sets the new active material during importing
vxMesh.prototype.setActiveMaterial = function (newMaterial) {
    
    // set the new active material
    this.activeMaterial = newMaterial.toString().trim().valueOf();

    // if the temp mesh part has vertices, then a new temp mesh part needs to be created
    if(this.tempMeshPart.mesh_vertices.length > 0){
      this.initNewMeshPart();
    }

    // set the Material key to the active one
    this.tempMeshPart.MaterialKey = this.activeMaterial;
  };

vxMesh.prototype.AddVertices = function(vertices, normal, texCoord, colour, encodedIndexColor){
        
  this.tempMeshPart.AddEdge.push(vertices, normal, colour, encodedIndexColor);
  
  // Now Check if it's outside the current bounds
  if(vertices.Length() > this.MaxPoint.Length())
  {
    this.MaxPoint.Set(vertices.X, vertices.Y, vertices.Z);
  }
};



vxMesh.prototype.AddFace = function(vert1, vert2, vert3, norm1, norm2, norm3, uv1, uv2, uv3, colour, encodedIndexColor){

  this.tempMeshPart.AddFace(vert1, vert2, vert3, norm1, norm2, norm3,uv1, uv2, uv3, colour, encodedIndexColor);

  // First Check if it's past the limit. divide by 6, bc 3 vertices per face, 2 vertices per edge, so 6 elements are
  // added each time.
  if(this.ElementCount > 65000/6){
    initNewMeshPart();
  }   

  // up the element count
  this.ElementCount++;
  };

vxMesh.prototype.AddEdge = function(vert1, vert2){

  this.tempMeshPart.AddEdge.push(vert1, vert2);

  };



vxMesh.prototype.DrawSelPreProc = function(){

  if(this.Enabled === true){

  for (var i = 0; i < this.MeshParts.length; i++) {
            this.MeshParts[i].DrawSelPreProc();
        }
  }

};


vxMesh.prototype.Draw = function(){
  
  if(this.Enabled === true){

  for (var i = 0; i < this.MeshParts.length; i++) {
            this.MeshParts[i].meshType = this.meshType;

            this.MeshParts[i].UseHighlight = false;   

            if(crntTreeHighlight==this.Name){
              this.MeshParts[i].UseHighlight = true;              
            }
            this.MeshParts[i].Draw();
        }
  }
};

// Draws the Edge Mesh with using the Mesh Colours
vxMesh.prototype.DrawWireframe = function(){
  
  if(this.Enabled === true){

  for (var i = 0; i < this.MeshParts.length; i++) {
            this.MeshParts[i].meshType = this.meshType;
            this.MeshParts[i].UseHighlight = false;   

            if(crntTreeHighlight==this.Name){
              this.MeshParts[i].UseHighlight = true;              
            }
            this.MeshParts[i].DrawWireframe();
        }
  }
};


vxMesh.prototype.DrawEdge = function(){
  
  if(this.Enabled === true){
  
  for (var i = 0; i < this.MeshParts.length; i++) {
            this.MeshParts[i].meshType = this.meshType;
            this.MeshParts[i].DrawEdge();
        }
}
};
