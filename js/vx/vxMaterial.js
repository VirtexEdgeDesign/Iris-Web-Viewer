function vxMaterial (name) {
  this.Name = name;

  //Ambient Colour
  this.AmbientColour = new vxColour(1,1,1,1);

  //Diffuse Colour
  this.DiffuseColour = new vxColour(1,1,1,1);

  //Specular Colour
  this.SpecularColour = new vxColour(1,1,1,1);
}