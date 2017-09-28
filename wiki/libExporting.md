# Exporter
Currently only ".stl" files can be exported in Iris Web Viewer. There are some things to be aware of how the files are exported as well.

## STL
STL files are often used for 3D printing which makes them very common and are a useful file extension. Iris can export ASCII stl files which are then saved to the users download folder.

### Notes
* STL files only specify one normal per face, therefore the exported Normal for each face is the average of all three vertices. This means that if each vertice of a given face has a different normal, the result in the export file will be averaged and shared among each vertex.