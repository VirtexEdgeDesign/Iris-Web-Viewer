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
