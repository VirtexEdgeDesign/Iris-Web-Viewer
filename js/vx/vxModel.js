function vxModel (name) {
  
  //Mesh Name
    this.Name = name;
    
    // Mesh Collection in this Model
    this.Meshes = {};
    //this.Meshes = [];

    // Material Collection
    this.Materials = {};
    //this.Materials = new Map();
    
    //Should it be Drawn
    this.Enabled = true;

    // The Max Point of this Mesh
    this.MaxPoint = new vxVertex3D(0,0,0);

    // Has it been initialised.
    this.IsInit = false;
}

vxModel.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
};



// Material Methods
// ***************************************************************************
vxModel.prototype.getMaterial = function(matName) {


    var mtl;
    for(var key in this.Materials) {
       
      console.log(JSON.stringify(key));
      console.log(JSON.stringify(matName));
      if(JSON.stringify(key) === JSON.stringify(matName))
      {
         mtl = this.Materials[key];
         console.log("Match");
      }
    }    
      return mtl;

};


vxModel.prototype.LoadMaterialFromObjMtlFile = function(fileText) {
  
  
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
  
  if(this.IsInit == false)
  {
    this.IsInit  = true;
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

    // get the current Mesh
    var mesh = this.Meshes[key];

    // Check the Max Point
    if(mesh.MaxPoint.Length() > this.MaxPoint.Length())
      this.MaxPoint.Set(mesh.MaxPoint.X, mesh.MaxPoint.Y, mesh.MaxPoint.Z);


    // Add Nodes
    mesh.TreeNodeID = "node_"+this.Name+"_"+mesh.Name;

    // setup mesh node id's
    var geomNod = mesh.TreeNodeID + "_geometry";
    var nodeID_Mtls = mesh.TreeNodeID + "_materials";

    AddTreeNode(mesh.TreeNodeID, mesh.Name, this.meshNode, "mesh");


    
    // Now add Tree Node Info

    // Add in Mesh Geometry
    AddTreeNode(geomNod, "Geometry", mesh.TreeNodeID, "properties");

      var numOfVerts = "# of Vertices :" + mesh.GetVerticesCount();
      var numOfFcs = "# of Faces      :"+ mesh.GetIndicesCount()/3;
      AddTreeNode("node_"+this.Name+"_"+mesh.Name+"_numOfVerts", numOfVerts, geomNod, "axis");
      AddTreeNode("node_"+this.Name+"_"+mesh.Name+"_numOfFcs", numOfFcs, geomNod, "plane");

    
    // Add in Mesh Materials
    AddTreeNode(nodeID_Mtls, "Materials", mesh.TreeNodeID, "materials");

    for(var key in mesh.Materials) {
      var material = mesh.Materials[key];
      var nodeID_MtlInfo = "node_"+this.Name+"_"+mesh.Name+"_"+material.Name;
        AddTreeNode(nodeID_MtlInfo, "Material: "+material.Name, nodeID_Mtls, "material");

            AddColorTreeNode(nodeID_MtlInfo+"_ambient", "Ambient Colour", material.AmbientColour, nodeID_MtlInfo);
            AddColorTreeNode(nodeID_MtlInfo+"_diffuse", "Diffuse Colour", material.DiffuseColour, nodeID_MtlInfo);
            AddColorTreeNode(nodeID_MtlInfo+"_specular", "Specular Colour", material.SpecularColour, nodeID_MtlInfo);

          if(material.DiffuseTexture.name !== "")
          {
            AddTreeNode(nodeID_MtlInfo+"_txtrs", "Textures", nodeID_MtlInfo, "image");
              AddTextureTreeNode(nodeID_MtlInfo+"_txtrs_diff", "Diffuse: ",material.DiffuseTexture, nodeID_MtlInfo+"_txtrs");
          }
          
    }
 }
        
}


function AddTextureTreeNode(nodeName, name, texture, parentNode){
        AddTreeNode(nodeName, name + texture.name, parentNode, "image");
        var imgNodeID = nodeName+"_"+texture.name;
        var img = new Image();

//console.log(texture);
//console.log(ioImgs);
var size = "128px";
    img.setAttribute("src", ioImgs[texture.name.toString().trim().valueOf()]);
    img.style.width = size;
    img.style.height = size;
    img.style.position = "relative";
    img.style.left = "-18px";

img.onload = function(e) {
        //console.log("Img "+texture.name+" Applied to model");
        AddTreeNodeTexture(imgNodeID, nodeName, img,  size);
          AddTreeNode(imgNodeID+"_w", "Width: "+img.width, imgNodeID, "hash");
          AddTreeNode(imgNodeID+"_h", "Height: "+img.height, imgNodeID, "hash");
};

}

function AddColorTreeNode(nodeName, name, color, parentNode)
{
  AddTreeNode(nodeName, name, parentNode, "colour_wheel");
            AddTreeNode(nodeName+"_rgb", color.toString(), nodeName, "colour_rgb");
              AddTreeNode(nodeName+"_R", "R: "+color.R, nodeName+"_rgb", "bullet_red");
              AddTreeNode(nodeName+"_G", "G: "+color.G, nodeName+"_rgb", "bullet_green");
              AddTreeNode(nodeName+"_B", "B: "+color.B, nodeName+"_rgb", "bullet_blue");
            AddTreeNode(nodeName+"_hex", "Hex: "+color.toHex(), nodeName, "hash");

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