var ioMaterials = {};
var mtlFileName = "";

function io_import_obj_mtl(filename, fileText)
{
 console.log("Loading Material File: "+filename);
  console.log("----------------------------------------");

    var mtlFile ={};
    // Split the lines based off of the carriage return
    var lines = fileText.split('\n');

    // now split the line by spaces
    var re = /\s* \s*/;
    var temp_matl;
    var currentMaterial = "default";
    for(var line = 0; line < lines.length; line++){

      // split the lines based off of spaces.
      var inputLine = lines[line].split(re);

      // now remove any stray spaces.
      var str = inputLine[0].replace(/\s/g, '');
      
      switch(str)
      {
        // A New Material
        case "newmtl":
          currentMaterial = inputLine[1].toString().trim().valueOf();
          
          temp_matl = new vxMaterial(currentMaterial);
          
          ioMaterials[currentMaterial] = temp_matl;
        break;
/*
        // setup Ambient Colour
        case "Ka":
          this.Materials[currentMaterial].AmbientColour = new vxColour(parseFloat(inputLine[1]), parseFloat(inputLine[2]), parseFloat(inputLine[3]), 1);
        break;
*/
        // Setup Diffuse Colour
        case "Kd":
          ioMaterials[currentMaterial].DiffuseColour = new vxColour(parseFloat(inputLine[1]), parseFloat(inputLine[2]), parseFloat(inputLine[3]), 1);
        break;
/*
        // Setup Specular Colour
        case "Ks":
          this.Materials[currentMaterial].SpecularColour = new vxColour(parseFloat(inputLine[1]), parseFloat(inputLine[2]), parseFloat(inputLine[3]), 1);
        break;
        */
      }

      //console.log(inputLine);
    }
    console.log("----------------------------------------");
    //ioMaterials[filename] = mtlFile;
    //console.log(ioMaterials);

    //console.log(this.getMaterial("Shoes")); 
}


function io_import_obj(files, FileName, InputFileText)
{
  log("Loading file <b>'"+FileName+"'</b> as an <b>'ascii .obj'</b> file...");

  // Create the model variable
  var model = new vxModel(FileName);
  
  // Now create the first mesh variable
    var mesh = new vxMesh();
    mesh.Name = FileName;

  var blockCount = 0;
    
  var activeMaterial = "default";
  //First initialise Arrarys
  /*******************************/
  var temp_vertices = [];      //Vertices List for initial loading
  var temp_Normals = [];      //Normals List for initial loading
  var temp_Normal = [];        //To hold the Normal for that entire face.
  
  var vert1 = new vxVertex3D(0,0,0);
  var vert2 = new vxVertex3D(0,0,0);
  var vert3 = new vxVertex3D(0,0,0);
  var vert4 = new vxVertex3D(0,0,0);
  var norm = new vxVertex3D(0,0,0);
  
   var textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
    ];
  var txtCnt = 0;
  
  //Zero out the number of elements
  numOfElements = 0;
  
  var treeItems = [];
  
  //Re-zero out the model center
  modelprop_Center[0] = 0;
  modelprop_Center[1] = 0;
  modelprop_Center[2] = 0;
  
  var CurrentGroupName = "default name";
  
      // Print out Result line By Line
    var lines = InputFileText.split('\n');
    for(var line = 0; line < lines.length; line++){
     
     //First Split the Current Line into an Array split by any number of spaces
     var re = /\s* \s*/;
     var inputLine = lines[line].split(re);
     
     switch (inputLine[0])
     {
       //Add Vertice
       case 'v':
        temp_vertices.push(inputLine[1]);
        temp_vertices.push(inputLine[2]);
        temp_vertices.push(inputLine[3]);
       break;
       
       //Add Normal
       case 'vn':
        temp_Normals.push(inputLine[1]);
        temp_Normals.push(inputLine[2]);
        temp_Normals.push(inputLine[3]);
       break;
       
       
       //Add group
       case 'o':
       case 'g':
         
         var newName = "mesh: " + inputLine[1].trim();
         var DoNewMesh = true;

         // Each Group, create a New Mesh
         if(mesh.MeshParts[0].mesh_vertices.length> 0){
            
            if(newName in model.Meshes) // true, regardless of the actual value)
            {
                DoNewMesh = false;
                mesh = model.Meshes[newName];
                break;
            }


          if(DoNewMesh === true)
            model.AddMesh(mesh);
         }
        CurrentGroupName = inputLine[1];

        if(DoNewMesh === true)
          mesh = new vxMesh(newName);
        
         break;
       
      //Add Face
       case 'f':
         var hasFourthVert = false;
          //console.log('indexArray');
        //Loop through each vertice collection in each line
        for(var vrt = 1; vrt < inputLine.length; vrt++){
          if(inputLine[vrt] != ""){
          
          vert4.Set(0,0,0);
          //Index Array
          var indexArray = inputLine[vrt] .split("/");
    
          //TODO: Add in Texture Support


          //Temp Normal
          var temp_Normal = [1,1,1];

          //Not all files specify Normal Data, Check, and then add if present
          if(indexArray.length > 2){
            temp_Normal[0] = temp_Normals[(indexArray[2]-1)*3];
            temp_Normal[1] = temp_Normals[(indexArray[2]-1)*3+1];
            temp_Normal[2] = temp_Normals[(indexArray[2]-1)*3+2];
            //console.log((indexArray[2]-1));
            
            
            // Set the Normal for this Current Face
            norm.Set(temp_Normal[0], temp_Normal[1], temp_Normal[2]);
          }
          else
          {
            norm.Set(0,1,0);
          }
          numOfElements++;

          
          switch(vrt-1)
         {
          case 0:
            vert1.Set(temp_vertices[(indexArray[0]-1)*3], temp_vertices[(indexArray[0]-1)*3+1], temp_vertices[(indexArray[0]-1)*3+2]);
          break;
          case 1:
            vert2.Set(temp_vertices[(indexArray[0]-1)*3], temp_vertices[(indexArray[0]-1)*3+1], temp_vertices[(indexArray[0]-1)*3+2]);
          break;
          case 2:
            vert3.Set(temp_vertices[(indexArray[0]-1)*3], temp_vertices[(indexArray[0]-1)*3+1], temp_vertices[(indexArray[0]-1)*3+2]);
          break;
          case 3:
            vert4.Set(temp_vertices[(indexArray[0]-1)*3], temp_vertices[(indexArray[0]-1)*3+1], temp_vertices[(indexArray[0]-1)*3+2]);
            hasFourthVert = true;
          break;
         }


         modelprop_Center[0] -= temp_vertices[(indexArray[0]-1)*3];
         modelprop_Center[1] -= temp_vertices[(indexArray[0]-1)*3+1];
         modelprop_Center[2] -= temp_vertices[(indexArray[0]-1)*3+2];
         
          }
        }
        
        // Once all of the data is in, create the new face
        var selcol = new vxColour();
        selcol.EncodeColour(numOfFaces);

        // if there's a material that has the name, then set the mesh colour to it
        if(ioMaterials[activeMaterial] != null)
        {
          meshcolor =  ioMaterials[activeMaterial].DiffuseColour;
        }
        mesh.AddFace(vert1, vert2, vert3, norm, meshcolor, selcol);
        numOfFaces++;

        if(hasFourthVert == true)
        {
          numOfElements++;
          selcol = new vxColour();
          selcol.EncodeColour(numOfFaces);
          numOfFaces++;
          mesh.AddFace(vert1, vert3, vert4, norm, meshcolor, selcol);
        }
        
        break;
         
         case 'mtllib':

         
           // First rebuild the file name
           var length = 6;
           
           // the file name is a substring of the line minus the initial 'mtllib ' characters
           var mtlFileName = lines[line].substr(length+1, lines[line].length-length);
          
            console.log("Set Material: "+mtlFileName);
           //model.Materials = $.extend(true, {}, ioMaterials[mtlFileName]);

           break;
           
           
         case 'usemtl':
         // set active material
           activeMaterial = inputLine[1].toString().trim().valueOf();
           break;
           
           
     }
    }

         
    //Set Model Center
    modelprop_Center[0] /= numOfElements;
    modelprop_Center[1] /= numOfElements;
    modelprop_Center[2] /= numOfElements;
    
    
    numOfElements = 0;
    
  model.AddMesh(mesh);
  
  InitialiseModel(model);

        Zoom = -model.MaxPoint.Length()*1.5-1; 
        rotX = -45;
        rotY = 30;
  
  //$('#modelForm_Open').window('close');
  log("Done!");
}