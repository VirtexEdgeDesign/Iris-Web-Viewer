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
    
    document.getElementById('footer_text').innerHTML = "Select the first face...";
  }
  
  HandleMouseClick(mesh) {
    
    if(this.CurrentClick == 1)
    {
      this.CurrentClick++;
      this.Point1 = mesh.Center;
      
      document.getElementById('footer_text').innerHTML = "Select the second face...";
    }
    
    else if(this.CurrentClick == 2)
    {
      this.CurrentClick++;
      this.Point2 = mesh.Center;
      
      
      //Now output the distance
      var name = 'meas.'+measureCounts;
      var distanceMesh = new vxMeasure(name, this.Point1, this.Point2);
      
      document.getElementById('footer_text').innerHTML = "Distance '" + name + "' is: " + distanceMesh.Length;
    
      measureCounts++;
      
      MeasureCollection.push(distanceMesh);
      log("-----------------------------------");
    }
  }
}
