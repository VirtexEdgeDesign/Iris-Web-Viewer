# v 0.5 June 26th 2018
* Added Chrome Extension.
* Added Ribbon and Tree support.

# v 0.4 October 3rd 2017
* Added Direct X (.x) 3D File Support.
* Added Google Drive Integration.
* Added Texture Support.
* Added Angle Measurement Tool.
* Fixed bug where 'stl' files would split meshes instead of mesh parts after 65000 elements.
* Fixed bug where mouse scroll/zoom was not working in firefox. Cross browser solution implemented.
* Added Toggleable Menu Items.
* Streamlined Menubar.
* Added Corner View Item.
* Added Mesh Highlighting when treeview item is highlighted.
* Added Scrollbar to Treeview.
* split mesh parts based on materials. add a material key name to each mesh part, then apply the material once all files have been read. Add material name to mesh part.


# v 0.3 April 28th 2017
* Added Mesh Parts to allow for internal handling of large meshes past the ~65000 element count.
* Changed Mesh Lists to Dictionaries.
* Fixed bug with Right View not working.

## v 0.22 March 13th 2017
* Fixed bug where OBJ files would not load after ~65000 elements.
* Added About page.

# v 0.2 Jan 18th 2017
* Added OBJ support
* Fixed bug where STL files would not load after ~65000 elements.

# v 0.1 Sept 28th 2015
* Basic STL file loading.


# TODO
* Add Centers
* Fully Implement Materials
* remove mesh collection. only use model collection.
* Write .x file writeup
* add fbx support.
* move all view and projections into camera class