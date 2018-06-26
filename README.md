# Iris Web Viewer

![image_import](ref/screenshots/IRIS_TILE_SMALL.png 'tile')

### Status

| Build Status | ![image_version](https://img.shields.io/badge/build-beta%20%5Bv.%200.5.0%5D-blue.svg 'Version') |

Iris Web Viewer is an open source experimental online model viewer. It allows you to view 3D Exchange format files through a web browser with out the need for larger packages to be installed on a computer. It runs off of Javascript and WebGL is available at [Iris Web Viewer](https://VirtexEdgeDesign.github.io/Iris-Web-Viewer/) as well as through a Chrome Web Extension:

[<img src="https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png">](https://chrome.google.com/webstore/detail/iris-3d-viewer/kfaocdjigbgfjbmbbodglgoomooblail)

![image_import](ref/screenshots/01intro.png 'Intro')

## License & Disclaimer

Iris is released under the [MIT License](https://github.com/VirtexEdgeDesign/Iris-Web-Viewer/blob/master/License.md).

Note though, that Iris is currently both experimental and in Beta, and therefore naturally has some bugs in it. It's not a perfect system and is therefore only useful for general views and for working out rough ideas. It comes with no warrenty what so ever (refer to license). Any models should be viewed and infomation verfied through a secondary programand before any designs are finalised. That said it's meant for informal viewing of 3D files in non-critical applciations as well as it's open source, so feel free to commit and add to it as you see fit!

# Features

## Import

Iris can import any of the following model formats. If there's one you don't see then feel free to request it in the 'Issues'.

- stl (both ASCII and Binary)
- obj (material files not supported yet)

![image_import](ref/screenshots/02model_import.png 'Export')

## Export

Iris can can also export to stl files for use in 3D Printing. We currently only support ASCII stl files.

![image_import](ref/screenshots/03model_export.png 'Import')

## Tree View Breakdown

The Iris Environment has a treeview overlayed on the screen, allowing you to view statistics of each imported models as well as be able to hide and show groups/sub meshes of each model. Other info, such as measurements, are added to the treeview, allowing you to see broken down information (such as the measured distance in each coordinate axis).

![image_import](ref/screenshots/05model_tree.png 'tree')

## Multiple Shader Outputs

Solid, Wireframe and Normal shader options are avaiable. Solid gives a basic grey view to the model, Wireframe shows an entire wireframe skelton of the edges of the models and surface triangles. and _Normal_ shows the angle at which the surface is relative to the Global X, Y and Z axis'.

![image_import](ref/screenshots/04model_data.png 'views')

### Solid

The Solid View of the 'Utah teapot'.
![image_solid_view](ref/screenshots/scrnsht_solid.png "The 'Solid' View")

### Wireframe

The Wireframe View of the 'Utah teapot'.
![image_wireframe_view](ref/screenshots/scrnsht_wireframe.png "The 'Wireframe' View")

### Normal

The Normal View of the 'Utah teapot'.
![image_normal_view](ref/screenshots/scrnsht_normal.png "The 'Normal' View")

## Surface Measurement

Iris allows you to measure the distance between different triangular faces of the imported model. This allows you to get a rough idea of distances in your model. Note: that no exact units are defined in Iris (i.e. mm, inches, etc...) and the measurements given are in terms of Face center positions calcuated from Face Vertices.
![image_measure](ref/screenshots/scrnsht_measure.png "The 'Normal' View")
