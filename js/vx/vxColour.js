function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}



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

vxColour.prototype.toString = function() {
    return "rgba("+parseInt(this.R*255)+", "+parseInt(this.G*255)+", "+parseInt(this.B*255)+", "+parseInt(this.A*255)+")";
  };

//Function to convert hex format to a rgb color

vxColour.prototype.toHex = function(){
    var color = "rgb("+parseInt(this.R*255)+", "+parseInt(this.G*255)+", "+parseInt(this.B*255)+")";
if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    
    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);
    
    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
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