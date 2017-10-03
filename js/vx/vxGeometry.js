

// vxVertex2D
// --------------------------------------------------------------------
// A 2D Vector class which allows for basic operations.
function vxVertex2D () {
    this.X = 0;
    this.Y = 0;
}

function vxVertex2D (x, y) {
    this.X = x;
    this.Y = y;
}

vxVertex2D.prototype.Set = function(x, y) {
    this.X = x;
    this.Y = y;
  };
  
  // Returns the length of the Vector. 
  //
  //     L = (x^2 + y^2 + z^2)^0.5
  //
  vxVertex2D.prototype.Length = function() {
    return Math.sqrt(this.X * this.X + this.Y * this.Y);
  };
  
  // Normalises this Vector with respect to it's length.
  // X = X/L, Y = Y/L
  vxVertex2D.prototype.Normalise = function() {
    var length = this.Length();
    this.X = this.X/length;
    this.Y = this.Y/length;
  };








// vxVertex3D
// --------------------------------------------------------------------
// A 3D Vector class which allows for basic operations.
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
  
  // Normalises this Vector with respect to it's length.
  // X = X/L, Y = Y/L, Z = Z/L
  vxVertex3D.prototype.Normalise = function() {
    var length = this.Length();
    this.X = this.X/length;
    this.Y = this.Y/length;
    this.Z = this.Z/length;
  };
  
  // Returns the Cross product of two vectors
  vxVertex3D.prototype.Cross = function(v1, v2) {
    return 1;
  };

  function sigDigs(val, sigdig){
    var bigVal = parseInt(val * Math.pow(10, sigdig));

    return bigVal/(Math.pow(10, sigdig));
  };

  vxVertex3D.prototype.toShortString = function() {
    var fig = 3;
    return "(" + sigDigs(this.X, fig) + ", " + sigDigs(this.Y, fig) + ", " + sigDigs(this.Z, fig) + ")";
  };
