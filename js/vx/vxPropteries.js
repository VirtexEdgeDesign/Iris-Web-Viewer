


  class vxProperty {
  constructor(gui) {
    this.gui = gui
    this.Type = "base"
  }

  remove() {
  }
}
  
  class ModelProp extends vxProperty{
    
    constructor(gui, Name) {
    super(gui);
    
    
    this.Name = Name;
   this.NameNode = this.gui.add(this, 'Name');
  }

  remove() {
    this.gui.remove(this.NameNode);
    
  }
  
}


class VectorProperty extends vxProperty{
      constructor(gui, text, x, y, z) {
    super(gui);
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.z = parseFloat(z);
    
    this.nrmStrn = text + ' (' + this.x + ',' + this.y  + ',' + this.z+')';
    //this.folder = this.gui.addFolder('Normal (' + this.x + ',' + this.y  + ',' + this.z+')');
    
    this.folder = this.gui.addFolder(this.nrmStrn);
    this.folder.add(this, 'x');
    this.folder.add(this, 'y');
    this.folder.add(this, 'z');
      }

  remove() {
     //this.folder.remove(this.nodex);
     //this.folder.remove(this, 'y');
     //this.folder.remove(this, 'z');
    this.gui.removeFolder(this.nrmStrn);
    
  }
}

var x = 0;
class FaceProperty extends vxProperty{
    
    constructor(gui, mesh) {
    super(gui);
    
    
    this.Type = "face"
    
    x++;
    this.Name = mesh.Name;
    this.Mesh = mesh;
    this.Model = mesh.Model.Name;
    this.x = 1;
    
   this.NameNode = this.gui.add(this, 'Name');
   this.ModelNode = this.gui.add(this, 'Model');
   
   // Set the Normal
   this.Normal = new VectorProperty(gui, "Normal", mesh.vert_noramls[0], mesh.vert_noramls[1], mesh.vert_noramls[2]);
  
    // Set Vertices
   this.Vertices = this.gui.addFolder("Vertices");
   this.Vertices.open();
   
    this.Vert1 = new VectorProperty(this.Vertices, "Vert 1", mesh.mesh_vertices[0], mesh.mesh_vertices[1], mesh.mesh_vertices[2]);
    this.Vert2 = new VectorProperty(this.Vertices, "Vert 2", mesh.mesh_vertices[3], mesh.mesh_vertices[4], mesh.mesh_vertices[5]);
    this.Vert3 = new VectorProperty(this.Vertices, "Vert 3", mesh.mesh_vertices[6], mesh.mesh_vertices[7], mesh.mesh_vertices[8]);
    
    }

  remove() {
    
     this.Normal.remove();
     
    this.gui.removeFolder("Vertices");
     //this.Vert1.remove();
    
    this.gui.remove(this.NameNode);
    this.gui.remove(this.ModelNode);
  }
  
}