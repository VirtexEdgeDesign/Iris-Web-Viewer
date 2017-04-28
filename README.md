# Iris Web Viewer

### Status
![image_version](https://img.shields.io/badge/build-beta%20%5Bv.%200.3.0%5D-green.svg "Version")

Iris Web Viewer is an open source experimental online model viewer. It allows you to view 3D Exchange format files through a web browser with out the need for larger packages to be installed on your or someone elses computer. It runs through Javascript and WebGL and is there fore cross paltform and available through a number of different browsers.

Note though, this is currently both experimental and currently in Beta, and therefore naturally has some bugs in it. It's not a perfect system and is therefore only useful for general views and for working out rough ideas. It comes with no warrenty what so ever. Any models should be viewed and infomation verfied through a secondary programand before any designs are finalised. That said, it's open source, so feel free to commit and add to it as you see fit!

# Features

## Import
Iris can import any of the following model formats. If there's one you don't see then feel free to request it in the 'Issues'

## Multiple views for different output
Solid, Wireframe and Normal shader options are avaiable. Solid gives a basic grey view to the model, Wireframe shows an entire wireframe skelton of the edges of the models and surface triangles. and *Normal* shows the angle at which the surface is relative to the Global X, Y and Z axis'.

### Solid
The Solid View of the 'Utah teapot'.
![image_solid_view](img/ref/scrnsht_solid.png "The 'Solid' View")

### Wireframe
The Wireframe View of the 'Utah teapot'.
![image_wireframe_view](img/ref/scrnsht_wireframe.png "The 'Wireframe' View")

### Normal
The Normal View of the 'Utah teapot'.
![image_normal_view](img/ref/scrnsht_normal.png "The 'Normal' View")

## Surface Measurement
You're able to measure the distance between different tri faces on the imported model. This allows 