// View Projection Type
//**************************************************
const vxProjectionType = {
    Perspective: 0,
    Ortho: 1
};


vec3.transformMat4 = function(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};


vec3.cross = function(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x * x + y * y + z * z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

function vxCamera() {

    // View matrix
    this.view = mat4.create();

    // Projection Matrix
    this.projection = mat4.create();

    this.nearPlane = 1;

    this.farPlane = 100000;

    this.mvp = mat4.create();

    // Zoom Amount
    this.zoom = -100;

    this.projectionType = vxProjectionType.Perspective;

    this.targetCenter = [0, 0, 0];

    this.target = [0, 0, 0];

    this.center = [0, 0, 0];
    this.eye = [0, 0, 0];

    // Roatation about the Y-Axis
    // This must be between 0 < theta < 2*PI
    this.theta = 0;

    // Angle about the X-Axis
    // This must be between 0 < phi < PI
    this.phi = 0;


    this.rotX = -45;
    this.rotY = 30;
    this.panX = 0;
    this.panY = 0;

    this.curZoom = 0;

    // The foward vector
    this.fwd = [0, 0, 0];

    // The up vector
    this.up = [0, 1, 0];

    // The right vector
    this.right = [0, 0, 0];
}

vxCamera.prototype.update = function() {


    var resp = 8;
    // monitored code goes here
    this.theta = Smooth(this.theta, DegToRad(this.rotX), resp);
    this.phi = Smooth(this.phi, DegToRad(this.rotY), resp);
    this.curZoom = Smooth(this.curZoom, this.zoom, resp);

    
    this.up[0] = Math.sin(this.theta) * Math.sin(this.phi);
    this.up[1] = Math.cos(this.phi);
    this.up[2] = -Math.cos(this.theta) * Math.sin(this.phi);
    //console.log(up);

    //var center = [0,0,0];

    // now get the foward vector, the right vector will be the x-product of that
    // and the up vector.
    
    this.eye = [0, 0, this.curZoom];
    this.eye[0] = Math.sin(this.theta) * Math.cos(this.phi) * this.curZoom;
    this.eye[1] = -Math.sin(this.phi) * this.curZoom;
    this.eye[2] = -Math.cos(this.theta) * Math.cos(this.phi) * this.curZoom;

    this.fwd[0] = this.center[0] - this.eye[0];
    this.fwd[1] = this.center[1] - this.eye[1];
    this.fwd[2] = this.center[2] - this.eye[2];

    var fwdN = [0, 0, 0];
    vec3.normalize(fwdN, this.fwd);
    //this.right
    vec3.cross(this.right, this.up, fwdN);

    modelprop_Center[0] += this.panY * this.up[0] + this.panX * this.right[0];
    modelprop_Center[1] += this.panY * this.up[1] + this.panX * this.right[1];
    modelprop_Center[2] += this.panY * this.up[2] + this.panX * this.right[2];


    this.panX = 0;
    this.panY = 0;

    this.target[0] = Smooth(this.target[0], modelprop_Center[0], 8);
    this.target[1] = Smooth(this.target[1], modelprop_Center[1], 8);
    this.target[2] = Smooth(this.target[2], modelprop_Center[2], 8);

    var factor = -this.curZoom / 800;
    // Update Projection
    if (this.projectionType == vxProjectionType.Perspective) {
        mat4.perspective(45, canvas.width / canvas.height, this.nearPlane, this.farPlane, this.projection);
    } else if (this.projectionType == vxProjectionType.Ortho) {
        mat4.ortho(-factor * canvas.width / 2, factor * canvas.width / 2, -factor * canvas.height / 2, factor * canvas.height / 2, -this.farPlane, this.farPlane, this.projection);
    }

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(this.view);

    // Set Zoom
    mat4.translate(this.view, [0, 0, this.curZoom]);

    // set panning
    mat4.translate(this.view, [-2 * this.panX / 10, -2 * this.panY / 10, 0]);

    // rotate
    mat4.rotate(this.view, this.phi, [1, 0, 0]);
    mat4.rotate(this.view, this.theta, [0, 1, 0]);

    // translate to the target
    mat4.translate(this.view, this.target);

    mat4.multiply(this.projection, this.view, this.mvp);
    // Save the current matrix, then rotate before we draw.
};


vxCamera.prototype.pan = function(deltaX, deltaY) {

  Camera.panX = (deltaX) / 500 * Camera.zoom;
  Camera.panY = (deltaY) / 500 * Camera.zoom;
   
};

vxCamera.prototype.rotate = function(deltaTheta, deltaPhi) {
  Camera.rotX += deltaTheta;
  Camera.rotY += deltaPhi;
};
