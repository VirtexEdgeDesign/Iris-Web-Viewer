function io_import_obj(files, FileName, InputFileText, reader)
{
  log("Loading file <b>'"+FileName+"'</b> as an <b>'ascii .obj'</b> file...");

  // Create the model variable
  var model = new vxModel(FileName);
  
  // Now create the first mesh variable
    var NewMesh = new vxMesh();
    NewMesh.Name = FileName;
    
  //First initialise Arrarys
  /*******************************/
  var temp_vertices = [];      //Vertices List for initial loading
  var temp_Normals = [];      //Normals List for initial loading
  var temp_Normal = [];        //To hold the Normal for that entire face.
  
  var vert1 = new vxVertex3D(0,0,0);
  var vert2 = new vxVertex3D(0,0,0);
  var vert3 = new vxVertex3D(0,0,0);
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
         
         // Each Group, create a New Mesh
         if(NewMesh.mesh_vertices.length> 0){
            model.AddMesh(NewMesh);
         }
        
        NewMesh = new vxMesh('mesh: ' + inputLine[1]);
        
         break;
       
      //Add Face
       case 'f':
         
          //console.log('indexArray');
        //Loop through each vertice collection in each line
        for(var vrt = 1; vrt < inputLine.length; vrt++){
          if(inputLine[vrt] !== ""){
          
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
         }


         modelprop_Center[0] -= temp_vertices[(indexArray[0]-1)*3];
         modelprop_Center[1] -= temp_vertices[(indexArray[0]-1)*3+1];
         modelprop_Center[2] -= temp_vertices[(indexArray[0]-1)*3+2];
         
          }
        }
        
        // Once all of the data is in, create the new face
        var selcol = new vxColour();
        selcol.EncodeColour(numOfFaces);
          NewMesh.AddFace(vert1, vert2, vert3, norm, meshcolor, selcol);
        
          numOfFaces++;
         break;
         
         case 'mtllib':
           // First rebuild the file name
           var length = 6;
           
           // the file name is a substring of the line minus the initial 'mtllib ' characters
           var mtlFileName = lines[line].substr(length+1, lines[line].length-length);
           
           //now loop through all files to find the required material file
           for(var i = 0; i < files.length; i++)
           {
             
             var searchedName = files[i].name.toString().trim();
             var currentName = mtlFileName.toString().trim();
             /*
             console.log("Searching");
             console.log("'"+searchedName+"'");
             console.log("'"+currentName+"'");
             */
             if(searchedName == currentName)
             {
               //console.log(reader);
               console.log("SUCCESS! - LOADING MATERIAL FILE: " + files[i].name);
               //var material = new vxMaterial(files[i].name);
               
                  var mtlreader = new FileReader();
                      mtlreader.onload = function(e) {
                       // material.CreateFromMTLFile(this.result);
                       model.LoadMaterialFromObjMtlFile(this.result);
                      };
                      
                  mtlreader.readAsText(files[i]);
             }
           }
           
           break;
           
           
         case 'usemtl':
           //console.log(inputLine);
           break;
           
           
     }
    }

         
    //Set Model Center
    modelprop_Center[0] /= numOfElements;
    modelprop_Center[1] /= numOfElements;
    modelprop_Center[2] /= numOfElements;
    
        Zoom = -NewMesh.MaxPoint.Length()*1.75;
        rotX = -45;
        rotY = 30;
    
    numOfElements = 0;
    
  model.AddMesh(NewMesh);
  
  InitialiseModel(model);

  
  //$('#modelForm_Open').window('close');
  log("Done!");
}