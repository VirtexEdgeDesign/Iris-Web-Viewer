class vxCommand {
  constructor() {
  }
  
  HandleMouseClick(mesh)
  {
    
  }
  
  get Draw() {
    
  }

}

var measureCounts = 1;
class vxMeasureCMD extends vxCommand {
  Init()
  {
    log("-----------------------------------");
    log("Starting Measurement Command");
    this.CurrentClick=1;
    
    this.Point1=null;
    this.Point2=null;
    
    this.Normal1 = [0,0,0];
    this.Normal2 = [0,0,0];
    
    document.getElementById('footer_text').innerHTML = "Select the first face...";
  }
  
  HandleMouseClick(mesh) {
    //console.log(mesh);
    if(this.CurrentClick == 1)
    {
      this.CurrentClick++;
      this.Point1 = mesh.Center;
      this.Normal1[0] = parseFloat(mesh.vert_noramls[0]);
      this.Normal1[1] = parseFloat(mesh.vert_noramls[1]);
      this.Normal1[2] = parseFloat(mesh.vert_noramls[2]);
      
      document.getElementById('footer_text').innerHTML = "Select the second face...";
    }
    
    else if(this.CurrentClick == 2)
    {
      this.CurrentClick++;
      this.Point2 = mesh.Center;

      this.Normal2[0] = parseFloat(mesh.vert_noramls[0]);
      this.Normal2[1] = parseFloat(mesh.vert_noramls[1]);
      this.Normal2[2] = parseFloat(mesh.vert_noramls[2]);

      //Now output the distance
      var name = 'dist.'+measureCounts;
      var distanceMesh = new vxMeasure(name, this.Point1, this.Point2, this.Normal1, this.Normal2);
      
      document.getElementById('footer_text').innerHTML = "Distance '" + name + "' is: " + distanceMesh.Length;
    
      measureCounts++;
      
      MeasureCollection.push(distanceMesh);
      log("-----------------------------------");
    }
  }
}



class vxMeasureAngleCMD extends vxCommand {
  Init()
  {
    log("-----------------------------------");
    log("Starting Angle Command");
    this.CurrentClick=1;
    
    this.Point1=null;
    this.Point2=null;
    
    this.Normal1 = [0,0,0];
    this.Normal2 = [0,0,0];
    
    document.getElementById('footer_text').innerHTML = "Select the first face...";
  }
  
  HandleMouseClick(mesh) {
    //console.log(mesh);
    if(this.CurrentClick == 1)
    {
      this.CurrentClick++;
      this.Point1 = mesh.Center;

      //TODO: change to vertices to get geometric normals

      // the average normal must be taken
      var temp_normal = [0,0,0];
      var faceCount = 0;
      for(var i = 0; i < mesh.vert_noramls.length; i+=3)
      {
        faceCount++;
        temp_normal[0] += parseFloat(mesh.vert_noramls[i+0]);
        temp_normal[1] += parseFloat(mesh.vert_noramls[i+1]);
        temp_normal[2] += parseFloat(mesh.vert_noramls[i+2]);
      }

      temp_normal[0] /= faceCount;
      temp_normal[1] /= faceCount;
      temp_normal[2] /= faceCount;

      this.Normal1[0] = temp_normal[0];
      this.Normal1[1] = temp_normal[1];
      this.Normal1[2] = temp_normal[2];
      
      document.getElementById('footer_text').innerHTML = "Select the second face...";
    }
    
    else if(this.CurrentClick == 2)
    {
      this.CurrentClick++;
      this.Point2 = mesh.Center;

            // the average normal must be taken
      var temp_normal = [0,0,0];
      var faceCount = 0;
      for(var i = 0; i < mesh.vert_noramls.length; i+=3)
      {
        faceCount++;
        temp_normal[0] += parseFloat(mesh.vert_noramls[i+0]);
        temp_normal[1] += parseFloat(mesh.vert_noramls[i+1]);
        temp_normal[2] += parseFloat(mesh.vert_noramls[i+2]);
      }

      temp_normal[0] /= faceCount;
      temp_normal[1] /= faceCount;
      temp_normal[2] /= faceCount;

      this.Normal2[0] = temp_normal[0];
      this.Normal2[1] = temp_normal[1];
      this.Normal2[2] = temp_normal[2];

      //Now output the distance
      var name = 'angle.'+measureCounts;
      var angleMesh = new vxMeasureAngle(name, this.Point1, this.Point2, this.Normal1, this.Normal2);
      
      document.getElementById('footer_text').innerHTML = "Angle '" + name + "' is: " + angleMesh.Angle;
    
      measureCounts++;
      
      MeasureCollection.push(angleMesh);
      log("-----------------------------------");
    }
  }
}