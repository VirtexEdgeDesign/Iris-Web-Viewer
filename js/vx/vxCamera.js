function vxCamera (view, projection) {
  
  // View matrix
  this.View = view;
  
  // Projection Matrix
  this.Projection = projection;
  
  // Zoom Amount
  this.Zoom = 10;
  
  // Angle about the X-Axis
  this.Theta = 0;
  
  // Angle about the Y-Axis
  this.Phi = 0;
  
  // View Target Position
  this.Target = new vxVertex3D();
}

vxCamera.prototype.Pan = function(deltaX, deltaY) {
  
  var look = normalize(ToCartesian());
  var worldUp = new vxVertex3D(0, 1, 0, 0);

  var right = cross(look, worldUp);
  var up = cross(look, right);

  Target = Target + (right * dx) + (up * dy);
};
  
vxCamera.prototype.Rotate = function(deltaTheta, deltaPhi) {

};

vxCamera.prototype.Zoom = function(deltaZ) {

};


vxCamera.prototype.Position = function() {

};
