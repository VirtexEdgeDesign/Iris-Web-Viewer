function io_import_ply(FileName, InputFileText)
{
  log("Loading file <b>'"+FileName+"'</b> as an <b>'ascii .ply'</b> file...");
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
    
  /*******************************/
  //First initialise Arrarys
  /*******************************/
  var vertices = [];           //Vertices
  var temp_vertices = [];      //Vertices List for initial loading
  var vertexNormals = [];     //Normals
  var temp_Normals = [];      //Normals List for initial loading
  var generatedColors = [];     //Colours
  var cubeVertexIndices = [];   //Indices - Not very useful in STL files.
  
  var TotalVerticeCount = 0;
  var TotalFaceCount = 0;
  var IndexAfterHeader = 0;
  var StartAddingGeometry = false;
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
  
     //First Split the Current Line into an Array split by any number of spaces
     var re = /\s* \s*/;
  
    // Print out Result line By Line
    var lines = InputFileText.split('\n');
    for(var line = 0; line < lines.length; line++){
     
     var inputLine = lines[line].split(re);
     
     
     
     if(StartAddingGeometry === true){
       IndexAfterHeader++;
       
       //Add in a Vertice
       if(IndexAfterHeader <= TotalVerticeCount){
         
        //Vertices
        temp_vertices.push(inputLine[0]);
        temp_vertices.push(inputLine[1]);
        temp_vertices.push(inputLine[2]);
        
        //Normals
        temp_vertices.push(inputLine[3]);
        temp_vertices.push(inputLine[4]);
        temp_vertices.push(inputLine[5]);
       }
       
       //If it's past the vertices but less than the faces
       if(IndexAfterHeader > TotalVerticeCount && 
          IndexAfterHeader <=TotalFaceCount + TotalVerticeCount){
         
        console.log(IndexAfterHeader);
         //if the first element is 3, add a triangle
         
         //if the first element if 4, it's a quadralateral, so add as two triangles
         if(inputLine[0]==="4")
         {
          var curInd = 1;
          //Should Always have Vertice Data
          vertices.push(temp_vertices[(inputLine[curInd])*6]);
          vertices.push(temp_vertices[(inputLine[curInd])*6+1]);
          vertices.push(temp_vertices[(inputLine[curInd])*6+2]);
          /*
         modelprop_Center[0] -= temp_vertices[(indexArray[curInd]-1)*6];
         modelprop_Center[1] -= temp_vertices[(indexArray[curInd]-1)*6+1];
         modelprop_Center[2] -= temp_vertices[(indexArray[curInd]-1)*6+2];
         */
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+3]);
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+4]);
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+5]);
         
         generatedColors.push(temp_colour[0]);
         generatedColors.push(temp_colour[1]);
         generatedColors.push(temp_colour[2]);
         generatedColors.push(temp_colour[3]);
         
         cubeVertexIndices.push(numOfElements);
         
         numOfElements++;
         
         console.log(inputLine);
         
         
         curInd = 2;
          //Should Always have Vertice Data
          vertices.push(temp_vertices[(inputLine[curInd])*6]);
          vertices.push(temp_vertices[(inputLine[curInd])*6+1]);
          vertices.push(temp_vertices[(inputLine[curInd])*6+2]);
          /*
         modelprop_Center[0] -= temp_vertices[(indexArray[curInd]-1)*6];
         modelprop_Center[1] -= temp_vertices[(indexArray[curInd]-1)*6+1];
         modelprop_Center[2] -= temp_vertices[(indexArray[curInd]-1)*6+2];
         */
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+3]);
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+4]);
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+5]);
         
         generatedColors.push(temp_colour[0]);
         generatedColors.push(temp_colour[1]);
         generatedColors.push(temp_colour[2]);
         generatedColors.push(temp_colour[3]);
         
         cubeVertexIndices.push(numOfElements);
         
         numOfElements++;
         
         
         
         
         curInd = 3;
          //Should Always have Vertice Data
          vertices.push(temp_vertices[(inputLine[curInd])*6]);
          vertices.push(temp_vertices[(inputLine[curInd])*6+1]);
          vertices.push(temp_vertices[(inputLine[curInd])*6+2]);
          /*
         modelprop_Center[0] -= temp_vertices[(indexArray[curInd]-1)*6];
         modelprop_Center[1] -= temp_vertices[(indexArray[curInd]-1)*6+1];
         modelprop_Center[2] -= temp_vertices[(indexArray[curInd]-1)*6+2];
         */
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+3]);
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+4]);
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+5]);
         
         generatedColors.push(temp_colour[0]);
         generatedColors.push(temp_colour[1]);
         generatedColors.push(temp_colour[2]);
         generatedColors.push(temp_colour[3]);
         
         cubeVertexIndices.push(numOfElements);
         
         numOfElements++;
         
         
         cubeVertexIndices.push(numOfElements-3);
         cubeVertexIndices.push(numOfElements-1);    
         
         curInd = 4;
          //Should Always have Vertice Data
          vertices.push(temp_vertices[(inputLine[curInd])*6]);
          vertices.push(temp_vertices[(inputLine[curInd])*6+1]);
          vertices.push(temp_vertices[(inputLine[curInd])*6+2]);
          /*
         modelprop_Center[0] -= temp_vertices[(indexArray[curInd]-1)*6];
         modelprop_Center[1] -= temp_vertices[(indexArray[curInd]-1)*6+1];
         modelprop_Center[2] -= temp_vertices[(indexArray[curInd]-1)*6+2];
         */
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+3]);
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+4]);
         vertexNormals.push(temp_vertices[(inputLine[curInd])*6+5]);
         
         generatedColors.push(temp_colour[0]);
         generatedColors.push(temp_colour[1]);
         generatedColors.push(temp_colour[2]);
         generatedColors.push(temp_colour[3]);
         
         cubeVertexIndices.push(numOfElements);
         
         numOfElements++;
         }
       }
     }
     
     
     switch (inputLine[0])
     {
       //Get the Element Type
       case 'element':
       switch (inputLine[1])
       {
         //Set the Max Number of Vertices
         case 'vertex':
           TotalVerticeCount = inputLine[2];
           console.log("TotalVerticeCount: "+ TotalVerticeCount);
           break;
           
         //Set the Max Number of Vertices
         case 'face':
           TotalFaceCount = inputLine[2];
           console.log("TotalFaceCount: "+ TotalFaceCount);
           break;
       }
       break;
       
       //Add Normal
       case 'end_header':
        StartAddingGeometry = true;
           console.log("end_header reached, begining file load");
       break;
     }
     
    }
    console.log(vertices);
    
    /*
    //Set Model Center
    modelprop_Center[0] /= numOfElements;
    modelprop_Center[1] /= numOfElements;
    modelprop_Center[2] /= numOfElements;
         */
    //Now that all of the data has been written in, 
  // Create a buffer for the cube's vertices.
  cubeVerticesBuffer = gl.createBuffer();
  
  // Select the cubeVerticesBuffer as the one to apply vertex operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  // Set up the normals for the vertices, so that we can compute lighting.
  cubeVerticesNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  
  // Now set up the colors for the faces. We'll use solid colors for each face.
  
  cubeVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  
  cubeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  
  $('#modelForm_Open').window('close');
  log("Done!");
}