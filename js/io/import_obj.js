function io_import_obj(FileName, InputFileText)
{
  log("Loading file <b>'"+FileName+"'</b> as an <b>'ascii .obj'</b> file...");
    var node = $('#tt').tree('find', 'models');
      $('#tt').tree('append', {
            parent: node.target,
             data:[{
                 id: FileName,
                 text: FileName,
                 iconCls: 'icon-mesh',
                 checked:true

         }]
    });
    
    
    var NewMesh = new vxMesh();
    NewMesh.Name = FileName;
    
  /*******************************/
  //First initialise Arrarys
  /*******************************/
  var vertices = [];           //Vertices
  var temp_vertices = [];      //Vertices List for initial loading
  var vertexNormals = [];     //Normals
  var temp_Normals = [];      //Normals List for initial loading
  var generatedColors = [];     //Colours
  var cubeVertexIndices = [];   //Indices - Not very useful in STL files.
  
  /*
  var temp_Normal = [];        //To hold the Normal for that entire face.
   */
  var temp_colour = [ 0.75, 0.5, 0.05, 1];        //Holds the Current Model Colour
 
  
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
         
         
         if(NewMesh.vertices.length> 0){
            NewMesh.InitialiseBuffers();
            MeshCollection.push(NewMesh);
            numOfElements += NewMesh.Indices.length;
         }
        
        NewMesh = new vxMesh();
        NewMesh.Name = 'Group: ' + inputLine[1];
         
          var dataThisLoop = {
          id: 'Group: ' + inputLine[1],
          text:'Group: ' + inputLine[1],
          checked:true
         };
         treeItems.push(dataThisLoop);
         
         break;
       
      //Add Face
       case 'f':
         
        //Loop through each vertice collection in each line
        for(var vrt = 1; vrt < inputLine.length; vrt++){
          if(inputLine[vrt] !== ""){
          
          //Index Array
          var indexArray = inputLine[vrt] .split("/");
          

          //Should Always have Vertice Data
          NewMesh.vertices.push(temp_vertices[(indexArray[0]-1)*3]);
          NewMesh.vertices.push(temp_vertices[(indexArray[0]-1)*3+1]);
          NewMesh.vertices.push(temp_vertices[(indexArray[0]-1)*3+2]);
          
         modelprop_Center[0] -= temp_vertices[(indexArray[0]-1)*3];
         modelprop_Center[1] -= temp_vertices[(indexArray[0]-1)*3+1];
         modelprop_Center[2] -= temp_vertices[(indexArray[0]-1)*3+2];

          //TODO: Add in Texture Support


          //Temp Normal
          var temp_Normal = [1,1,1];

          //Not all files specify Normal Data, Check, and then add if present
          if(indexArray.length > 2){
            temp_Normal[0] = temp_Normals[(indexArray[2]-1)*3];
            temp_Normal[1] = temp_Normals[(indexArray[2]-1)*3+1];
            temp_Normal[2] = temp_Normals[(indexArray[2]-1)*3+2];
            //console.log((indexArray[2]-1));
          }

          //Add In Normals
          NewMesh.vert_noramls.push(temp_Normal[0]);
          NewMesh.vert_noramls.push(temp_Normal[1]);
          NewMesh.vert_noramls.push(temp_Normal[2]);
          
          //TODO: Add in Material Texture Support
          NewMesh.vert_colours.push(temp_colour[0]);
          NewMesh.vert_colours.push(temp_colour[1]);
          NewMesh.vert_colours.push(temp_colour[2]);
          NewMesh.vert_colours.push(temp_colour[3]);
          
          //Add in Element Indice
          NewMesh.Indices.push(NewMesh.Indices.length);
          }
        }
         break;
     }
    }
    
         var node2 = $('#tt').tree('find', FileName);
          $('#tt').tree('append', {
            parent: node2.target,
             data:treeItems
             });
    
    $('#tt').tree({onCheck: function(node,checked){   
              //New elegent Drawing code
  for(var i = 0; i < MeshCollection.length; i++)
  {
    if(MeshCollection[i].Name == node.text){
        MeshCollection[i].Enabled = !node.checked;
     console.log(node);
    }
  }
                }
            });
            
    //Set Model Center
    modelprop_Center[0] /= numOfElements;
    modelprop_Center[1] /= numOfElements;
    modelprop_Center[2] /= numOfElements;
    
    numOfElements = 0;
         
NewMesh.InitialiseBuffers();
MeshCollection.push(NewMesh);
console.log(MeshCollection.length);
  
  $('#modelForm_Open').window('close');
  log("Done!");
}