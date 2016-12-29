function vxModel (name) {
  
  //Mesh Name
    this.Name = name;
    
    // Mesh Collection in this Model
    this.Meshes = [];
    
    // Material Collection
    this.Materials = [];
    
    //Should it be Drawn
    this.Enabled = true;
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
    for (var i = 0; i < this.Meshes.length; i++) {
      this.Meshes[i].Enabled = value;
    }
};

vxModel.prototype.AddMesh = function(newMesh) {
  
  newMesh.Model = this;
  
  newMesh.Init();
  
    this.Meshes.push(newMesh);
};

vxModel.prototype.Init = function() {
  
  
  for (var i = 0; i < this.Meshes.length; i++) {
    
  }
  
    AddTreeNode("node_"+this.Name, this.Name, "node_mesh", "envrroot");
        
          for (var i = 0; i < this.Meshes.length; i++) {
   
        var mesh = this.Meshes[i];
        
        AddTreeNode("node_"+mesh.Name, mesh.Name, "node_"+this.Name, "mesh");
        //  var center = "Model Center: : (" +modelprop_Center[0] +","+ modelprop_Center[1] +","+ modelprop_Center[2]+")";
        var numOfVerts = "# of Vertices :" + mesh.mesh_vertices.length;
        var numOfFcs = "# of Faces      :"+ mesh.Indices.length/3;
        
        // Now add Tree Node Info
        AddTreeNode("node_"+mesh.Name+"_geometry", "Geometry", "node_"+mesh.Name, "properties");
        // AddTreeNode("node_"+FileName+"_numOfVerts", center, "node_"+FileName+"_properties");
        AddTreeNode("node_"+mesh.Name+"_numOfVerts", numOfVerts, "node_"+mesh.Name+"_geometry", "axis");
        AddTreeNode("node_"+mesh.Name+"_numOfVerts", numOfFcs, "node_"+mesh.Name+"_geometry", "plane");
        
        
        AddTreeNode("node_"+mesh.Name+"_material", "Material", "node_"+mesh.Name, "txtrs"); 
        AddTreeNode("node_"+mesh.Name+"_colour_diffuse", "Diffuse Colour", "node_"+mesh.Name+"_material", "txtrs"); 
        AddTreeNode("node_"+mesh.Name+"_textrures", "Textures", "node_"+mesh.Name+"_material", "txtrs"); 
  }
};