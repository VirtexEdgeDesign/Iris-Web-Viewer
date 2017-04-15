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

    this.nx=null;
    this.ny=null;
    this.nz=null;
    
    document.getElementById('footer_text').innerHTML = "Select the first face...";
  }
  
  HandleMouseClick(mesh) {
    console.log(mesh);
    if(this.CurrentClick == 1)
    {
      this.CurrentClick++;
      this.Point1 = mesh.Center;
      this.nx = parseFloat(mesh.vert_noramls[0]);
      this.ny = parseFloat(mesh.vert_noramls[1]);
      this.nz = parseFloat(mesh.vert_noramls[2]);
      
      document.getElementById('footer_text').innerHTML = "Select the second face...";
    }
    
    else if(this.CurrentClick == 2)
    {
      this.CurrentClick++;
      this.Point2 = mesh.Center;

      this.nx += parseFloat(mesh.vert_noramls[0]);
      this.ny += parseFloat(mesh.vert_noramls[1]);
      this.nz += parseFloat(mesh.vert_noramls[2]);


      this.Normal = new vxVertex3D(this.nx / 2, this.ny / 2, this.nz / 2);

      //Now output the distance
      var name = 'meas.'+measureCounts;
      var distanceMesh = new vxMeasure(name, this.Point1, this.Point2, this.Normal);
      
      document.getElementById('footer_text').innerHTML = "Distance '" + name + "' is: " + distanceMesh.Length;
    
      measureCounts++;
      
      MeasureCollection.push(distanceMesh);
      log("-----------------------------------");
    }
  }
}
