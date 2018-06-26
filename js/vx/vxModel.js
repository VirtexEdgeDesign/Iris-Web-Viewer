function vxModel(file) {

    //Mesh Name
    this.Name = file.name;

    // Mesh Collection in this Model
    this.Meshes = {};
    //this.Meshes = [];

    // Material Collection
    this.Materials = {};
    //this.Materials = new Map();

    //Should it be Drawn
    this.Enabled = true;

    // The Max Point of this Mesh
    this.MaxPoint = new vxVertex3D(0, 0, 0);

    // Has it been initialised.
    this.IsInit = false;
    this.IsTreeInit = false;
    this.NotesAdded = false;

    this.WarningCount = 0;

    this.ErrorCount = 0;

    this.fileInfo = {
        fileName: "",
        type: "",
        format: "ASCII",
        size: "",
    };

    // set file info for debuggin
    this.ext = getFileExtention(file.name).toLowerCase();
    this.fileInfo.fileName = file.name;

    if(file.size > 1000000)
      this.fileInfo.size = (file.size/1000000) + " Mb";
    else
      this.fileInfo.size = (file.size/1000) + " Kb";

    switch (this.ext) {
        case 'obj':
            this.fileInfo.type = "Wavefront (*.obj)";
            this.fileInfo.format = "ASCII";
            break;
        case 'stl':
            this.fileInfo.type = "STereoLithography (*.stl)";
            this.fileInfo.format = "ASCII"; // Binary is set in the importer
            break;
        case 'x':
            this.fileInfo.type = "Direct X 3D File (*.x)";
            this.fileInfo.format = "ASCII";
            break;
    }

    this.modelNoteCount = 0;

    this.modelLoadNotes = {};

}

vxModel.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
};



// Material Methods
// ***************************************************************************
vxModel.prototype.getMaterial = function(matName) {


    var mtl;
    for (var key in this.Materials) {

        console.log(JSON.stringify(key));
        console.log(JSON.stringify(matName));
        if (JSON.stringify(key) === JSON.stringify(matName)) {
            mtl = this.Materials[key];
            console.log("Match");
        }
    }
    return mtl;

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
    for (var key in this.Meshes) {
        var mesh = this.Meshes[key];
        mesh.Enabled = this.Enabled;
    }
};


vxModel.prototype.GetVerticesCount = function() {
    var count = 0;

    for (var key in this.Meshes) {
        var mesh = this.Meshes[key];
        count += mesh.GetVerticesCount();
    }
    return count;
};

vxModel.prototype.GetIndicesCount = function() {
    var count = 0;

    for (var key in this.Meshes) {
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
    while (newMeshName in this.Meshes) {
        newMeshName = newMesh.Name + "(" + cnt + ")";
        cnt++;
    }
    newMesh.Name = newMeshName.trim();
    this.Meshes[newMeshName] = newMesh;
};

vxModel.prototype.Init = function() {

    if (this.IsInit == false) {
        //this.IsInit = true;
    // Initialise Textures
    for (var key in this.Meshes) {

        // get the current Mesh
        var mesh = this.Meshes[key];

        mesh.getCenter();

        // initialise the textures
        mesh.initMaterials();

        // finally add any errors or warnings in the mesh
        if(this.NotesAdded == false){
        for (var key in mesh.meshLoadNotes) {
            var note = mesh.meshLoadNotes[key];

            // deactivate zoom until the user clicks the close button
            MouseState.ZoomEnabled = false;

            if (note.type == 0) {
                this.ErrorCount++;
            } else {
                this.WarningCount++;
            }

            this.modelNoteCount++;
            //console.log(note);
            this.modelLoadNotes[this.modelNoteCount] = note;
            addResultsItem(note);

            // Finally show the file load results dialog
            modalLoadFileResults.style.display = "block";
        }
      }
    }
  }
};


// once all of th einformation is added, the import notes must be added to the treeview, 
// this is called during the initTreeNodes
vxModel.prototype.addImportNotes = function() {
    if (this.NotesAdded == false) {

        // default icons
        var resultsIcon = "bullet_success";
        var autoExpand = false;
        if (this.WarningCount > 0) {
            autoExpand = true;
            resultsIcon = "bullet_warning";
        }
        if (this.ErrorCount > 0) {
            autoExpand = true;
            resultsIcon = "bullet_error";
        }

        AddTreeNode(this.modelImportResults, "File Import Results", this.modelFileNode, resultsIcon, autoExpand);

        this.NotesAdded = true;
        AddTreeNode(this.modelImportWarning, "Warnings (" + this.WarningCount + ")", this.modelImportResults, "bullet_warning");
        AddTreeNode(this.modelImportError, "Errors (" + this.ErrorCount + ")", this.modelImportResults, "bullet_error");


        var count = 0;

        for (var key in this.modelLoadNotes) {

            var nodeToAdd = this.modelImportError;
            var imgKey = "bullet_error";
            var pre = "Error: "


            var note = this.modelLoadNotes[key];
            count++;
            if (note.type == 1) {
                nodeToAdd = this.modelImportWarning;
                imgKey = "bullet_warning";
                pre = "Warning: "
            }

            AddTreeNode(this.modelImportResults + "_" + count, pre + note.title, nodeToAdd, imgKey);
        }
    }
};


// initialises all tree items. this can only be called once.
vxModel.prototype.initTreeNodes = function() {

    if (this.IsTreeInit == false) {
        this.IsTreeInit = true;
        this.modelNode = "node_" + this.Name;
        AddTreeNode(this.modelNode, this.Name, "node_models", "envrroot", true);


        // Add Global Model Geometry Nodes
        this.modelFileNode = this.modelNode + "_file";
        this.modelGeomNod = this.modelNode + "_geometry";

        this.modelImportResults = this.modelFileNode + "_result";
        this.modelImportWarning = this.modelNode + "_warnging";
        this.modelImportError = this.modelNode + "_error";

        // File Info
        AddTreeNode(this.modelFileNode, "Info", this.modelNode, "file_info", true);
        AddTreeNode(this.modelFileNode + "_name", "File Name: " + this.fileInfo.fileName, this.modelFileNode, "document_import");
        AddTreeNode(this.modelFileNode + "_type", "Type: " + this.fileInfo.type, this.modelFileNode + "_name", "document_info");
        AddTreeNode(this.modelFileNode + "_format", "Format: " + this.fileInfo.format, this.modelFileNode + "_name", "file_bin");
        AddTreeNode(this.modelFileNode + "_size", "Size: " + this.fileInfo.size, this.modelFileNode + "_name", "hash");


        // add notes
        this.addImportNotes();

        // Handle Model Geometry
        AddTreeNode(this.modelGeomNod, "Model Geometry", this.modelNode, "properties");

        var center = "Model Center: (" + modelprop_Center[0] + "," + modelprop_Center[1] + "," + modelprop_Center[2] + ")";
        this.numOfModelVerts = "# of Vertices :" + this.GetVerticesCount();
        this.numOfModelFcs = "# of Faces      :" + this.GetIndicesCount() / 3;

        AddTreeNode("node_" + this.Name + "_center", center, this.modelGeomNod, "center");
        AddTreeNode("node_" + this.Name + "_numOfVerts", this.numOfModelVerts, this.modelGeomNod, "axis");
        AddTreeNode("node_" + this.Name + "_numOfFcs", this.numOfModelFcs, this.modelGeomNod, "plane");


        this.meshNode = "node_" + this.Name + "_meshes";
        AddTreeNode(this.meshNode, "Meshes", this.modelNode, "mesh", true);



        for (var key in this.Meshes) {

            // get the current Mesh
            var mesh = this.Meshes[key];

            // Check the Max Point
            if (mesh.MaxPoint.Length() > this.MaxPoint.Length())
                this.MaxPoint.Set(mesh.MaxPoint.X, mesh.MaxPoint.Y, mesh.MaxPoint.Z);


            // Add Nodes
            mesh.TreeNodeID = "node_" + this.Name + "_" + mesh.Name;

            // setup mesh node id's
            var geomNod = mesh.TreeNodeID + "_geometry";
            var nodeID_Mtls = mesh.TreeNodeID + "_materials";

            AddTreeNode(mesh.TreeNodeID, mesh.Name, this.meshNode, "mesh");



            // Now add Tree Node Info

            // Add in Mesh Geometry
            AddTreeNode(geomNod, "Geometry", mesh.TreeNodeID, "properties");

            var meshCenter = "Center: " + mesh.Center.toShortString();
            var numOfVerts = "Vertices :" + mesh.GetVerticesCount();
            var numOfFcs = "Faces      :" + mesh.GetIndicesCount() / 3;

            AddTreeNode("node_" + this.Name + "_" + mesh.Name + "_center", meshCenter, geomNod, "center");
            AddTreeNode("node_" + this.Name + "_" + mesh.Name + "_numOfVerts", numOfVerts, geomNod, "axis");
            AddTreeNode("node_" + this.Name + "_" + mesh.Name + "_numOfFcs", numOfFcs, geomNod, "plane");


            // Add in Mesh Materials
            AddTreeNode(nodeID_Mtls, "Materials", mesh.TreeNodeID, "materials");

            for (var key in mesh.Materials) {

                var material = mesh.Materials[key];
                var nodeID_MtlInfo = "node_" + this.Name + "_" + mesh.Name + "_" + material.Name;
                AddTreeNode(nodeID_MtlInfo, "Material: " + material.Name, nodeID_Mtls, "material");

                var nodeID_Colors = nodeID_MtlInfo+"_colors";
                

                AddTreeNode(nodeID_Colors, "Colours", nodeID_MtlInfo, "node_colours");

                // Ambient
                AddTreeNode(nodeID_Colors + "_ambient", "Ambient", nodeID_Colors, "node_color_info");
                AddColorTreeNode(nodeID_Colors + "_ambient_col", "Colour", material.AmbientColour, nodeID_Colors + "_ambient");
                AddTreeNode(nodeID_Colors + "_ambient_factor", "Intensity: 1", nodeID_Colors + "_ambient", "hash");

                // Diffuse
                AddTreeNode(nodeID_Colors + "_diffuse", "Diffuse", nodeID_Colors, "node_color_info");
                AddColorTreeNode(nodeID_Colors + "_diffuse_col", "Colour", material.DiffuseColour, nodeID_Colors + "_diffuse");
                AddTreeNode(nodeID_Colors + "_diffuse_factor", "Intensity: 1", nodeID_Colors + "_diffuse", "hash");

                // Emissive
                AddTreeNode(nodeID_Colors + "_emissive", "Emissive", nodeID_Colors, "node_color_info");
                AddColorTreeNode(nodeID_Colors + "_emissive_col", "Colour", material.EmissiveColour, nodeID_Colors + "_emissive");
                AddTreeNode(nodeID_Colors + "_emissive_factor", "Intensity: 1", nodeID_Colors + "_emissive", "hash");

                // Specular
                AddTreeNode(nodeID_Colors + "_specular", "Specular", nodeID_Colors, "node_color_info");
                AddColorTreeNode(nodeID_Colors + "_specular_col", "Colour", material.SpecularColour, nodeID_Colors + "_specular");
                AddTreeNode(nodeID_Colors + "_specular_factor", "Intensity: 1", nodeID_Colors + "_specular", "hash");
                AddTreeNode(nodeID_Colors + "_specular_power", "Power: " + material.SpecularPower, nodeID_Colors + "_specular", "hash");


                // Textures
                var nodeID_Textures = nodeID_MtlInfo + "_txtrs";
                AddTreeNode(nodeID_Textures, "Textures", nodeID_MtlInfo, "txtrs");
                if (material.DiffuseTexture.name !== "") {
                    AddTextureTreeNode(nodeID_Textures + "_txtrs_diff", "Diffuse: ", material.DiffuseTexture, nodeID_Textures);
                } else {
                    AddTreeNode(nodeID_Textures + "_textures_none", "<none>", nodeID_Textures, "error");
                }

            }
        }

    }


    function AddTextureTreeNode(nodeName, name, texture, parentNode) {
        AddTreeNode(nodeName, name + texture.name, parentNode, "image");
        var imgNodeID = nodeName + "_" + texture.name;
        var img = new Image();

        var size = "96px";
        //img.setAttribute("src", ioImgs[texture.name.toString().trim().valueOf()]);
        img.setAttribute("src", material.DiffuseTexture.base64);
        img.style.width = size;
        img.style.height = size;
        img.style.position = "relative";
        img.style.left = "-18px";

        img.onload = function(e) {
            //console.log("Img "+texture.name+" Applied to model");
            AddTreeNodeTexture(imgNodeID, nodeName, img, size);
            //AddTreeNode(imgNodeID + "_w", "Width: " + img.width, imgNodeID, "hash");
            //AddTreeNode(imgNodeID + "_h", "Height: " + img.height, imgNodeID, "hash");
        };

    }

    function AddColorTreeNode(nodeName, name, color, parentNode) {
        AddTreeNode(nodeName, name + ": ("+parseInt(color.R*255)+", "+parseInt(color.G*255)+", "+parseInt(color.B*255)+", "+parseInt(color.A*255)+")", parentNode, "colour_wheel");
        //AddTreeNode(nodeName + "_rgb", color.toString(), nodeName, "colour_rgb");
        AddTreeNode(nodeName + "_R", "R: " + color.R, nodeName, "bullet_red");
        AddTreeNode(nodeName + "_G", "G: " + color.G, nodeName + "", "bullet_green");
        AddTreeNode(nodeName + "_B", "B: " + color.B, nodeName + "", "bullet_blue");
        AddTreeNode(nodeName + "_A", "A: " + color.A, nodeName + "", "bullet_white");
        AddTreeNode(nodeName + "_hex", "Hex: " + color.toHex(), nodeName, "hash");

    }
};














// vxMaterial
// --------------------------------------------------------------------
// This class holds all information needed for a material. The materials
// are asigned on a per-meshpart basis, therefore a single mesh can hold
// multiple materials, broken up into different meshparts.
function vxMaterial (name) {
  this.Name = name;

  //Ambient Colour
  this.AmbientColour = new vxColour(0.5,0.5,0.5,1);

  //Diffuse Colour
  this.DiffuseColour = new vxColour(1,1,1,1);

  //Emissive Colour
  this.EmissiveColour = new vxColour(0,0,0,1);

  //Specular Colour
  this.SpecularColour = new vxColour(1,1,1,1);

  // Specular Power
  this.SpecularPower = 1;

  // The Diffuse Texture
  this.DiffuseTexture = {name: "", width:0, height:0, base64: ""};
}