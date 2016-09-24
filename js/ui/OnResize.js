function OnResize() {

    var canvas = document.getElementById('glcanvas');
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    var width;
    var height;
    var offsetWidth = 0;

    if (windowRatio < canvasRatio) {
        height = window.innerHeight;
        width = height / canvasRatio;
    } else {
        width = window.innerWidth;
        height = width * canvasRatio;
    }

    canvas.style.width = width - offsetWidth + 'px';
    canvas.style.height = height - offsetWidth + 'px';
}

window.addEventListener('resize', OnResize, false);