function vxColour () {

    this.R=0;
    this.G=0;
    this.B=0;
    this.A=0;
}

function vxColour (r, g, b, a) {
    this.R = r;
    this.G = g;
    this.B = b;
    this.A = a;
}

vxColour.prototype.Create = function(r, g, b, a) {
    this.R = r;
    this.G = g;
    this.B = b;
    this.A = a;
  };

// Set's the RGB values based on a index value
vxColour.prototype.EncodeColour = function(index) {
    this.R = index % 255;
    this.G = Math.floor((index/255) % (255));
    this.B = Math.floor((index/(255 * 255)) % (255));
    this.A = 1;

    //Now scale down the values from 0-255 to 0-1
    this.R = this.R / 255;
    this.G = this.G / 255;
    this.B = this.B / 255;
    //this.A = this.A / 255;
};

// Set's the RGB values based on a index value
vxColour.prototype.DecodeColour = function(r, g, b, a) {
    var index = 0;

    index = r + g * 255 + b * 255 * 255;
    return index;
};