
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
	console.log(RenderState);
}

function SetShadingToShaded() {
	RenderState = vxRenderState.Shaded;
	console.log(RenderState);
}

function SetShadingToWireframe() {
	RenderState = vxRenderState.Wireframe;
	console.log(RenderState);
}


function SetViewToPerspective() {
	ProjectionType = vxProjectionType.Perspective;
	console.log(ProjectionType);
}

function SetViewToOrtho() {
	ProjectionType = vxProjectionType.Ortho;
	console.log(ProjectionType);
}


