
function io_import_x(file, InputFileText)
{
  log("Loading file <b>'"+file.name+"'</b> as an <b>'ascii .x'</b> file...");

  // Create the model variable
  var model = new vxModel(file);
  
  // Now create the first mesh variable
    var mesh = new vxMesh();
    mesh.Name = file.name;

  var blockCount = 0;
    
  var activeMaterial = "default";
  //First initialise Arrarys
  /*******************************/
  var temp_vertices = [];      //Vertices List for initial loading
  var temp_indices_vert = [];      //Vertices Indices List for initial loading
  var temp_Normals = [];      //Normals List for initial loading
  var temp_indices_norm = [];      //Normals Indices List for initial loading
  var temp_UVs = [];      //Normals List for initial loading
  var uvs = [];
  
  var vert1 = new vxVertex3D(0,0,0);
  var vert2 = new vxVertex3D(0,0,0);
  var vert3 = new vxVertex3D(0,0,0);
  var vert4 = new vxVertex3D(0,0,0);

  var norm1 = new vxVertex3D("0","1","0");
  var norm2 = new vxVertex3D(0,1,0);
  var norm3 = new vxVertex3D(0,1,0);
  var norm4 = new vxVertex3D(0,1,0);

  var texCoord1 = new vxVertex2D(0,0);
  var texCoord2 = new vxVertex2D(0,0);
  var texCoord3 = new vxVertex2D(0,0);
  var texCoord4 = new vxVertex2D(0,0);

  function addFace(index, vi1, vi2, vi3){
    face={
      id: index,
      v1: vi1,
      v2: vi2, 
      v3: vi3,
    }
    faces.push(face);
  }

  function setFaceNormal(index, ni1, ni2, ni3){
    faces[index].n1 = ni1;
    faces[index].n2 = ni2;
    faces[index].n3 = ni3;
  }


  function setFaceUV(index, ni1, ni2, ni3){
    faces[index].n1 = ni1;
    faces[index].n2 = ni2;
    faces[index].n3 = ni3;
  }
  
  var faces = {};

  var txtCnt = 0;
  
  //Zero out the number of elements
  numOfElements = 1;
  
  //var treeItems = [];
  
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
     var inputLine = lines[line].trim().split(re);
     //console.log(inputLine);
     switch (inputLine[0])
     {
      // Only create a new mesh if it's not the Root Node
      case 'Frame':

        // Create a new Mesh
        mesh = new vxMesh();
        mesh.Name = "mesh: " + inputLine[1].trim();

           temp_vertices = [];      //Vertices List for initial loading
   temp_indices_vert = [];      //Vertices Indices List for initial loading
   temp_Normals = [];      //Normals List for initial loading
   temp_indices_norm = [];      //Normals Indices List for initial loading
   temp_UVs = [];      //Normals List for initial loading

        break;

        case 'Mesh':

        // get the next line
        line++;
        inputLine = lines[line].trim().split(re);
        var vertCount = inputLine[0].substr(0, inputLine[0].length-1);
        for(var v = 0; v < vertCount; v++){
          line++;

          // now split each line
          var verts = lines[line].split(';');
          temp_vertices.push(parseFloat(verts[0].trim()));
          temp_vertices.push(parseFloat(verts[1].trim()));
          temp_vertices.push(parseFloat(verts[2].trim()));
        }

        // once all vertice data has been read, now get the vertice indicies

        // the next line holds the face count, note this could be either tri's or quad's.
        // so it's easies to think of this number as the face line count, and for iris
        // to handle the importing on it's own.

        line++;
        inputLine = lines[line].trim().split(";");

        var faceLineCount = parseInt(inputLine[0]);

        // next what we need to do is figure out if the next line is parsed by ';' or ','
        for(var fv = 0; fv < faceLineCount; fv++){
          line++;

          var faceComponents = lines[line].trim().split(';');

          var char = ',';

          var splitComponents = true;
          var semicolon = lines[line].trim().split(';');
          var colon = lines[line].trim().split(',');
          if(semicolon.length > colon.length){
            char = ';';
            splitComponents = false;
          }

          var IsQuad = parseInt(faceComponents[0])==4 ? true : false;

          // these are the indices
          var fIndices = faceComponents[1].split(char);

          if(splitComponents == false){
            fIndices[0] = faceComponents[1];
            fIndices[1] = faceComponents[2];
            fIndices[2] = faceComponents[3];
            fIndices[3] = faceComponents[4];
          }


            temp_indices_vert.push(parseInt(fIndices[0]));
            temp_indices_vert.push(parseInt(fIndices[1]));
            temp_indices_vert.push(parseInt(fIndices[2]));

          if(IsQuad){
            temp_indices_vert.push(parseInt(fIndices[0]));
            temp_indices_vert.push(parseInt(fIndices[2]));
            temp_indices_vert.push(parseInt(fIndices[3]));
          }
        }
        break;

        case 'MeshNormals':

        // get the next line
        line++;
        inputLine = lines[line].trim().split(re);
        var normCount = inputLine[0].substr(0, inputLine[0].length-1);

        for(var n = 0; n < normCount; n++){
          line++;

          // now split each line
          var norms = lines[line].trim().split(";");
          temp_Normals.push(parseFloat(norms[0].trim()));
          temp_Normals.push(parseFloat(norms[1].trim()));
          temp_Normals.push(parseFloat(norms[2].trim()));
        }

        // once all vertice data has been read, now get the vertice indicies

        // the next line holds the face count, note this could be either tri's or quad's.
        // so it's easies to think of this number as the face line count, and for iris
        // to handle the importing on it's own.

        line++;
        inputLine = lines[line].trim().split(";");

        var faceLineCount = parseInt(inputLine[0]);
        for(var fv = 0; fv < faceLineCount; fv++){
          line++;

          var fnComponents = lines[line].trim().split(';');

          var IsQuad = parseInt(fnComponents[0])==4 ? true : false;

          var char = ',';
          var semicolon = lines[line].trim().split(';');
          var colon = lines[line].trim().split(',');

          var splitComponents = true;

          if(semicolon.length > colon.length){
            char = ';';
            splitComponents = false
          }
          // these are the indices
          var fnIndices = fnComponents[1].split(char);
          
          if(splitComponents == false){
            fnIndices[0] = fnComponents[1];
            fnIndices[1] = fnComponents[2];
            fnIndices[2] = fnComponents[3];
            fnIndices[3] = fnComponents[4];
          }
            temp_indices_norm.push(parseInt(fnIndices[0]));
            temp_indices_norm.push(parseInt(fnIndices[1]));
            temp_indices_norm.push(parseInt(fnIndices[2]));

          if(IsQuad){
            temp_indices_norm.push(parseInt(fnIndices[0]));
            temp_indices_norm.push(parseInt(fnIndices[2]));
            temp_indices_norm.push(parseInt(fnIndices[3]));
          }
        }
        break;

        case 'MeshTextureCoords':

        // get the next line
        line++;
        inputLine = lines[line].trim().split(re);
        var uvCount = parseInt(inputLine[0].substr(0, inputLine[0].length-1));

        var cn = 0;
        for(var uv = 0; uv < uvCount; uv++){
          line++;

          // now split each line
          var uvCoords = lines[line].trim().split(';');

          //temp_UVs.push(uvCoords[0]);
          //temp_UVs.push(uvCoords[1]);
          //uvs.push(0);
          //uvs.push(1);

          uvs.push(parseFloat(uvCoords[0].trim()));
          uvs.push(parseFloat(uvCoords[1].trim()));
          
          //temp_UVs.push(parseFloat(uvCoords[2].trim()));
        }
        break;
        case 'Material':

          // create a new material
          currentMaterial = inputLine[1].toString().trim().valueOf();
          
          var temp_matl = new vxMaterial(currentMaterial);

        // the next line is the Diffuse Colour
        line++;
        inputLine = lines[line].split(";");
        temp_matl.DiffuseColour = new vxColour(parseFloat(inputLine[0]), parseFloat(inputLine[1]), parseFloat(inputLine[2]), parseFloat(inputLine[3]));

        // the next factor is the specular power
        line++;
        inputLine = lines[line].split(";");
        temp_matl.SpecularPower = parseFloat(inputLine[0]);


        // the next factor is the specular colour
        line++;
        inputLine = lines[line].split(";");
        temp_matl.SpecularColour = new vxColour(parseFloat(inputLine[0]), parseFloat(inputLine[1]), parseFloat(inputLine[2]), 1);

        // next get the emissive colour
        line++;
        inputLine = lines[line].split(";");
        temp_matl.EmissiveColour = new vxColour(parseFloat(inputLine[0]), parseFloat(inputLine[1]), parseFloat(inputLine[2]), 1);

        // final check is if the next line is a'}' or a texure definition
        line++;
        inputLine = lines[line].trim().split(re);
        if(inputLine[0].trim() == "TextureFilename"){
          temp_matl.DiffuseTexture.name = inputLine[1].split('"')[1];
        }
        else{
          // finalise the mesh
        }

          //this.tempMeshPart.MaterialKey = this.activeMaterial;
          mesh.tempMeshPart.MaterialKey = currentMaterial;
          mesh.activeMaterial = currentMaterial;
          
          ioMaterials[currentMaterial] = temp_matl;

          function getUV(i){
              for (var key in uvs){
                  if(i==key){
                    console.log(uvs[key]);
                  }
              }
          };

    for(var vert = 0; vert < temp_indices_vert.length; vert+=3){

          vert1.Set(temp_vertices[(temp_indices_vert[vert])*3], temp_vertices[(temp_indices_vert[vert])*3+1], temp_vertices[(temp_indices_vert[vert])*3+2]);
          vert2.Set(temp_vertices[(temp_indices_vert[vert+1])*3], temp_vertices[(temp_indices_vert[vert+1])*3+1], temp_vertices[(temp_indices_vert[vert+1])*3+2]);
          vert3.Set(temp_vertices[(temp_indices_vert[vert+2])*3], temp_vertices[(temp_indices_vert[vert+2])*3+1], temp_vertices[(temp_indices_vert[vert+2])*3+2]);
      
          norm1.Set(temp_Normals[(temp_indices_norm[vert])*3], temp_Normals[(temp_indices_norm[vert])*3+1], temp_Normals[(temp_indices_norm[vert])*3+2]);
          norm2.Set(temp_Normals[(temp_indices_norm[vert+1])*3], temp_Normals[(temp_indices_norm[vert+1])*3+1], temp_Normals[(temp_indices_norm[vert+1])*3+2]);
          norm3.Set(temp_Normals[(temp_indices_norm[vert+2])*3], temp_Normals[(temp_indices_norm[vert+2])*3+1], temp_Normals[(temp_indices_norm[vert+2])*3+2]);
     
          //var uv1 = getUV((temp_indices_vert[vert])*2);
          texCoord1.Set(uvs[(temp_indices_vert[vert])*2], uvs[(temp_indices_vert[vert])*2+1]);
          texCoord2.Set(uvs[(temp_indices_vert[vert+1])*2], uvs[(temp_indices_vert[vert+1])*2+1]);
          texCoord3.Set(uvs[(temp_indices_vert[vert+2])*2], uvs[(temp_indices_vert[vert+2])*2+1]);
     
          //console.log((temp_indices_vert[vert+2])*2+1);
          //console.log(temp_indices_norm);
          //console.log(uvs);
          //console.log(temp_UVs[(temp_indices_vert[vert+2])*2+1]);

          //console.log(temp_UVs[(temp_indices_vert[vert])*3]);

          var selcol = new vxColour();
          selcol.EncodeColour(numOfFaces);
          mesh.AddFace(vert1, vert2, vert3, norm1, norm2, norm3, texCoord1, texCoord2, texCoord3, meshcolor, selcol);
          numOfFaces++;
          numOfElements++;
        }

        model.AddMesh(mesh);
        console.log(mesh);
        console.log(uvs);
        break;
     }
    }


         
    //Set Model Center
    modelprop_Center[0] /= numOfElements;
    modelprop_Center[1] /= numOfElements;
    modelprop_Center[2] /= numOfElements;
    
    
    numOfElements = 0;
    
  
  InitialiseModel(model);
           // Now Set the View Parameters
        Zoom = -model.MaxPoint.Length()*1.5-1;
        rotX = -45;
        rotY = 30;

  log("Done!");
}