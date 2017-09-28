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
    this.IndexStart = 0;
    this.IndexEnd = 0;

    // This keeps track of elements during addition
    this.ElementCount = 0;

    //What is the model type
    this.meshType = MeshType.Solid;
    
    //Should it be Drawn
    this.Enabled = true;
    
    this.Texture = null;
    
    //this.TextureImage = new Image();
    
    // The Max Point of this Mesh
    this.MaxPoint = new vxVertex3D(0,0,0);

    // The corresponding Mesh Tree node ID;
    this.TreeNodeID = null;
    
    this.Center = [0,0,0];
    
    this.IndexStart = numOfFaces;

    // the temp mesh part
    this.tempMeshPart = new vxMeshPart();
    this.MeshParts.push(this.tempMeshPart);

    this.Materials={};

    this.MaterialName = "";
}

vxMesh.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
};

vxMesh.prototype.SetCenter = function() {

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
    this.MeshParts[i].Model = this.Model;
    this.MeshParts[i].Mesh = this;
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

  // First Check if it's past the limit
  if(this.ElementCount > 65000/6)
  {
    this.ElementCount = 0;

    this.tempMeshPart = new vxMeshPart();
    this.tempMeshPart.Model = this.Model;
    this.MeshParts.push(this.tempMeshPart);
  }   
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
            this.MeshParts[i].Draw();
        }
  }
};

// Draws the Edge Mesh with using the Mesh Colours
vxMesh.prototype.DrawWireframe = function(){
  
  if(this.Enabled === true){

  for (var i = 0; i < this.MeshParts.length; i++) {
            this.MeshParts[i].meshType = this.meshType;
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
