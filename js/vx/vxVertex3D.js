function vxVertex3D () {
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
}

function vxVertex3D (x, y, z) {
    this.X = x;
    this.Y = y;
    this.Z = z;
}

vxVertex3D.prototype.Set = function(x, y, z) {
    this.X = x;
    this.Y = y;
    this.Z = z;
  };
  
  // Returns the length of the Vector. 
  //
  //     L = (x^2 + y^2 + z^2)^0.5
  //
  vxVertex3D.prototype.Length = function() {
    return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
  };
  
  
  // Returns the Cross product of two vectors
  vxVertex3D.prototype.Cross = function(v1, v2) {
    return 1;
  };
