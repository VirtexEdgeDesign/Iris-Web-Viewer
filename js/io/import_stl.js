function io_import_stl(FileName, InputFileText)
{
  var model = new vxModel(FileName);
  
  var mesh = new vxMesh("mesh: " + FileName.substring(0, FileName.length-4));

  log("Loading file <b>'"+FileName+"'</b> as an <b>'ascii .stl'</b> file...");

  /*******************************/
  //First initialise Arrarys
  /*******************************/

  var vertcount = 0;

var vert1 = new vxVertex3D(0,0,0);
var vert2 = new vxVertex3D(0,0,0);
var vert3 = new vxVertex3D(0,0,0);
var norm = new vxVertex3D(0,0,0);

  //Zero out the number of elements
  numOfElements = 0;
  
  //Set the Index. 0 is the background.
  //numOfFaces = 1 + MeshCollection.length;

  var treeItems = [];
  
  //Re-zero out the model center
  modelprop_Center[0] = 0;
  modelprop_Center[1] = 0;
  modelprop_Center[2] = 0;
  
  mesh.IndexStart = numOfFaces;
  
      // Print out Result line By Line
    var lines = InputFileText.split('\n');
    for(var line = 0; line < lines.length; line++){
     
     //First Split the Current Line into an Array split by spaces
     var inputLine = lines[line].split(" ");
     
    
     switch (inputLine[0])
     {
       //Add Normal
       case "facet":

       // Set the Normal for this Current Face
       norm.Set(inputLine[2], inputLine[3], inputLine[4]);


       var selcol = new vxColour();
        selcol.EncodeColour(numOfFaces);
        
//        console.log(numOfFaces);

          mesh.AddEdge(vert1, vert2);
          mesh.AddEdge(vert2, vert3);
          mesh.AddEdge(vert3, vert1);

         numOfFaces++;
        
       break;

       
       //Add Vertice point
       case "vertex":


         switch(vertcount)
         {
          case 0:
            vert1.Set(inputLine[1], inputLine[2], inputLine[3]);
          break;
          case 1:
            vert2.Set(inputLine[1], inputLine[2], inputLine[3]);
          break;
          case 2:
            vert3.Set(inputLine[1], inputLine[2], inputLine[3]);
          break;
         }
         vertcount++;
         if(vertcount>2)
          vertcount = 0;


         // Set Model Center
         modelprop_Center[0] -= inputLine[1];
         modelprop_Center[1] -= inputLine[2];
         modelprop_Center[2] -= inputLine[3];

         var vert = new vxVertex3D(inputLine[1], inputLine[2], inputLine[3]);
         
         mesh.AddVertices(vert, norm, meshcolor, selcol);
          numOfElements++;
        
       break;
     }

    }

    modelprop_Center[0] /= numOfElements;
    modelprop_Center[1] /= numOfElements;
    modelprop_Center[2] /= numOfElements;
        
        
        // Initialise the VBO Buffers 
      //mesh.Initialise();
        
        // Set the Name
        //mesh.Name = "mesh: " + FileName.substring(0, FileName.length-4);
        


        
        // Now Set the View Parameters
        Zoom = -mesh.MaxPoint.Length()*1.75;
        rotX = -45;
        rotY = 30;
        
  model.AddMesh(mesh);
  
   InitialiseModel(model);
    

  //$('#modelForm_Open').window('close');
  log("Done!");
}

