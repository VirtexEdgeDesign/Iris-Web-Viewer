function vxMaterial (name) {
  this.Name = name;

  //Ambient Colour
  this.AmbientColour = new vxColour(0.5,0.5,0.5,1);

  //Diffuse Colour
  this.DiffuseColour = new vxColour(1,1,1,1);

  //Emissive Colour
  this.EmissiveColour = new vxColour(0,0,0,1);

  //Specular Colour
  this.SpecularColour = new vxColour(1,1,1,1);

  // Specular Power
  this.SpecularPower = 1;

  // The Diffuse Texture
  this.DiffuseTexture = {name: "", width:0, height:0, base64: ""};
}