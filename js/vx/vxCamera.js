function vxCamera (view, projection) {
  
  // View matrix
  this.view = view;
  
  // Projection Matrix
  this.projection = projection;

  this.nearPlane = 1;

  this.farPlane = 100000;
  
  // Zoom Amount
  this.zoom = 10;

  // Roatation about the Y-Axis
  // This must be between 0 < theta < 2*PI
  this.theta = 0;
  
  // Angle about the X-Axis
  // This must be between 0 < phi < PI
  this.phi = 0;
  
  // View Target Position
  this.target = new vxVertex3D();

  // The foward vector
  this.forward = new vxVertex3D();

  // The up vector
  this.up = new vxVertex3D();

  // The right vector
  this.right = new vxVertex3D();
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
