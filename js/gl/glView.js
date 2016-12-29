
function SetViewToTop() {
rotY = 90;
rotX = 90;
}

function SetViewToBottom() {
rotY = -90;
rotX = 90;
}

function SetViewToFront() {
rotY = 0;
rotX = 270;
}

function SetViewToBack() {
rotY = 0;
rotX = 90;
}

function SetViewToLeft() {
rotY = 0;
rotX = 180;
}

function SetViewToRight() {
rotY = 0;
rotX = 0;
}




function SetShadingToEdge() {
	RenderState = vxRenderState.ShadedEdge;
	log("RenderState = " + RenderState);
}

function SetShadingToShaded() {
	RenderState = vxRenderState.Shaded;
	log("RenderState = " + RenderState);
}

function SetShadingToWireframe() {
	RenderState = vxRenderState.Wireframe;
	log("RenderState = " + RenderState);
}

function SetShadingToNormal() {
	RenderState = vxRenderState.SurfaceNormal;
	log("RenderState = " + RenderState);
}


function SetViewToPerspective() {
	ProjectionType = vxProjectionType.Perspective;
	log("ProjectionType = " + ProjectionType);
}

function SetViewToOrtho() {
	ProjectionType = vxProjectionType.Ortho;
	log("ProjectionType = " + ProjectionType);
}


