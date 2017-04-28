# Iris Web Viewer

### Status
![image_version](https://img.shields.io/badge/build-beta%20%5Bv.%200.3.0%5D-green.svg "Version")

Iris Web Viewer is an open source experimental online model viewer. It allows you to view 3D Exchange format files through a web browser with out the need for larger packages to be installed on your or someone elses computer. It runs through Javascript and WebGL and is there fore cross paltform and available through a number of different browsers.

You can always access it here: [Iris Web Viewer](https://r4tch31.github.io/Iris-Web-Viewer/)

![image_intro](img/ref/scrnsht_intro.png "Intro")

## Disclaimer
Note though, this is currently both experimental and currently in Beta, and therefore naturally has some bugs in it. It's not a perfect system and is therefore only useful for general views and for working out rough ideas. It comes with no warrenty what so ever. Any models should be viewed and infomation verfied through a secondary programand before any designs are finalised. That said, it's open source, so feel free to commit and add to it as you see fit!

# Features

## Import
Iris can import any of the following model formats. If there's one you don't see then feel free to request it in the 'Issues'.

* stl (both ASCII and Binary)
* obj (material files not supported yet)

![image_import](img/ref/clsup_menu.png "Import")

## Tree View Breakdown
The Iris Envrioment has a treeview overlayed on the screen, allowing you to view statistics of each imported models as well as be able to hide and show groups/sub meshes of each model. Other info, such as measurements, are added to the treeview, allowing you to see broken down information (such as the measured distance in each coordinate axis).

![image_tree](img/ref/clsup_tree.png "tree")

## Multiple Shader Outputs
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
Iris allows you to measure the distance between different triangular faces of the imported model. This allows you to get a rough idea of distances in your model. Note: that no exact units are defined in Iris (i.e. mm, inches, etc...)  and the measurements given are in terms of Face center positions calcuated from Face Vertices.
![image_measure](img/ref/scrnsht_measure.png "The 'Normal' View")
