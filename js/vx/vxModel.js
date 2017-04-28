function vxModel (name) {
  
  //Mesh Name
    this.Name = name;
    
    // Mesh Collection in this Model
    this.Meshes = {};
    //this.Meshes = [];

    // Material Collection
    this.Materials = [];
    
    //Should it be Drawn
    this.Enabled = true;

    // The Max Point of this Mesh
    this.MaxPoint = new vxVertex3D(0,0,0);
}

vxModel.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
};



// Material Methods
// ***************************************************************************
vxModel.prototype.GetMaterial = function(matName) {
    for(var i = 0; i < this.Materials.length; i++)
    {
      if(matName.trim() == this.Materials[i].Name.trim())
      {
        return this.Materials[i];
      }
    }
    
      return null;
};


vxModel.prototype.LoadMaterialFromObjMtlFile = function(fileText) {
  
  console.log("Loading Material File: " + fileText.name);
  console.log("----------------------------------------");
  console.log(fileText);
      var lines = fileText.split('\n');
    for(var line = 0; line < lines.length; line++){
      console.log(lines[line]);
    }
    console.log("----------------------------------------");
  };

vxModel.prototype.GetNumberOfMeshes = function() {
    return this.Meshes.length;
};

vxModel.prototype.GetEnabled = function() {
    return this.Enabled;
};

vxModel.prototype.SetEnabled = function(value) {
    this.Enabled = value;

    //now do the same for all owned meshes
  for(var key in this.Meshes) {
  var mesh = this.Meshes[key];
      mesh.Enabled = this.Enabled;
    }
};


vxModel.prototype.GetVerticesCount = function() {
    var count = 0;

    for(var key in this.Meshes) {
      var mesh = this.Meshes[key];
      count += mesh.GetVerticesCount();
    }
    return count;
};

vxModel.prototype.GetIndicesCount = function() {
    var count = 0;

    for(var key in this.Meshes) {
      var mesh = this.Meshes[key];
      count += mesh.GetIndicesCount();
    }
    return count;
};

vxModel.prototype.AddMesh = function(newMesh) {
  
  newMesh.Model = this;
  
  newMesh.Init();

  var cnt = 1;
  var newMeshName = newMesh.Name.trim();
  
  // Now loop through all Meshes, if the mesh name is present, then increment up 'cnt'
    while(newMeshName in this.Meshes)
    {
      newMeshName = newMesh.Name+"("+cnt+")";
      cnt++;
    }
    newMesh.Name = newMeshName.trim();
    this.Meshes[newMeshName] = newMesh;
};

vxModel.prototype.Init = function() {
  
 this.modelNode = "node_"+this.Name;
  AddTreeNode(this.modelNode, this.Name, "node_mesh", "envrroot");
 




   // Add Global Model Geometry Nodes
 this.modelGeomNod = this.modelNode + "_geometry";

        AddTreeNode(this.modelGeomNod, "Model Geometry", this.modelNode, "properties");

        //  var center = "Model Center: : (" +modelprop_Center[0] +","+ modelprop_Center[1] +","+ modelprop_Center[2]+")";
        this.numOfModelVerts = "# of Vertices :" + this.GetVerticesCount();
        this.numOfModelFcs = "# of Faces      :"+ this.GetIndicesCount()/3;
        
        // AddTreeNode("node_"+FileName+"_numOfVerts", center, "node_"+FileName+"_properties");
        AddTreeNode("node_"+this.Name+"_numOfVerts", this.numOfModelVerts, this.modelGeomNod, "axis");
        AddTreeNode("node_"+this.Name+"_numOfFcs", this.numOfModelFcs, this.modelGeomNod, "plane");





 this.meshNode = "node_"+this.Name + "_meshes";
  AddTreeNode(this.meshNode, "Meshes", this.modelNode, "mesh");



  for(var key in this.Meshes) {
  var mesh = this.Meshes[key];

  // Check the Max Point
    if(mesh.MaxPoint.Length() > this.MaxPoint.Length())
      this.MaxPoint.Set(mesh.MaxPoint.X, mesh.MaxPoint.Y, mesh.MaxPoint.Z);
 

 // Add Nodes
  mesh.TreeNodeID = "node_"+this.Name+"_"+mesh.Name;
 var geomNod = mesh.TreeNodeID + "_geometry";

        AddTreeNode(mesh.TreeNodeID, mesh.Name, this.meshNode, "mesh");

        //  var center = "Model Center: : (" +modelprop_Center[0] +","+ modelprop_Center[1] +","+ modelprop_Center[2]+")";
        var numOfVerts = "# of Vertices :" + mesh.GetVerticesCount();
        var numOfFcs = "# of Faces      :"+ mesh.GetIndicesCount()/3;
        
        // Now add Tree Node Info
        AddTreeNode(geomNod, "Geometry", mesh.TreeNodeID, "properties");
        // AddTreeNode("node_"+FileName+"_numOfVerts", center, "node_"+FileName+"_properties");
        AddTreeNode("node_"+this.Name+"_"+mesh.Name+"_numOfVerts", numOfVerts, geomNod, "axis");
        AddTreeNode("node_"+this.Name+"_"+mesh.Name+"_numOfFcs", numOfFcs, geomNod, "plane");
 
}
  /*
  for (var i = 0; i < this.Meshes.length; i++) {
   
        var mesh = this.Meshes[i];
        
        AddTreeNode("node_"+mesh.Name, mesh.Name, "node_"+this.Name, "mesh");
        //  var center = "Model Center: : (" +modelprop_Center[0] +","+ modelprop_Center[1] +","+ modelprop_Center[2]+")";
        var numOfVerts = "# of Vertices :" + mesh.GetVerticesCount();
        var numOfFcs = "# of Faces      :"+ mesh.GetIndicesCount()/3;
        
        // Now add Tree Node Info
        AddTreeNode("node_"+mesh.Name+"_geometry", "Geometry", "node_"+mesh.Name, "properties");
        // AddTreeNode("node_"+FileName+"_numOfVerts", center, "node_"+FileName+"_properties");
        AddTreeNode("node_"+mesh.Name+"_numOfVerts", numOfVerts, "node_"+mesh.Name+"_geometry", "axis");
        AddTreeNode("node_"+mesh.Name+"_numOfVerts", numOfFcs, "node_"+mesh.Name+"_geometry", "plane");
        
        
        //AddTreeNode("node_"+mesh.Name+"_material", "Material", "node_"+mesh.Name, "txtrs"); 
        //AddTreeNode("node_"+mesh.Name+"_colour_diffuse", "Diffuse Colour", "node_"+mesh.Name+"_material", "txtrs"); 
        //AddTreeNode("node_"+mesh.Name+"_textrures", "Textures", "node_"+mesh.Name+"_material", "txtrs"); 
  }
  */
};