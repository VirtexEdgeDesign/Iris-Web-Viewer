function vxModel (name) {
  
  //Mesh Name
    this.Name = name;
    
    //Vertice Array
    this.Meshes = [];
    
    //Should it be Drawn
    this.Enabled = true;
}

vxModel.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
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
        AddTreeNode("node_"+mesh.Name+"_properties", "Properties", "node_"+mesh.Name, "properties");
        // AddTreeNode("node_"+FileName+"_numOfVerts", center, "node_"+FileName+"_properties");
        AddTreeNode("node_"+mesh.Name+"_numOfVerts", numOfVerts, "node_"+mesh.Name+"_properties", "axis");
        AddTreeNode("node_"+mesh.Name+"_numOfVerts", numOfFcs, "node_"+mesh.Name+"_properties", "plane");
        
        
        AddTreeNode("node_"+mesh.Name+"_textures", "Textures", "node_"+mesh.Name, "txtrs"); 
  }
};