# Importers
The method to open files in Iris is by importing them. This can be found in the side bar by clicking 'Menu'. Below each type of importer is noted, although for some files there are a few notes about how the files are imported which you should be aware of when using Iris.

## STL
STL is a very common 3D format and was therefore the first format supported by Iris. There are ASCII and Binary file formats, which Iris supports.

| 'stl' File Format | Status |
|-------------------|--------|
| ASCII             | Full   |
| Binary            | Full   |

## Notes
Iris has shown some trouble with very large binary stl files, so use with caution.

## OBJ
View below the supported flags in an obj file.

| Flag   | Name              | Status  |
|--------|-------------------|---------|
| v      | Vertex            | Full    |
| vt     | UV Coord.         | Full    |
| vn     | Vertex Normal     | Full    |
| f      | Face Indices      | Partial |
| mtllib | Material File     | Partial |
| usemtl | Sets Material     | Partial |
| o, g   | Object and Groups | Full    |
|        |                   |         |

### Notes
* Not all flags are supported for 'obj' files as well as 'f' lines which reference more then 4 indices are not supported.
* Not all flags in mtl files are supported by the shader. Currently Diffuse Color and Diffuse Texture are supported.
