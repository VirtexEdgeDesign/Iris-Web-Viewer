// A File Writer class for exporting files.
class vxFileWriter {
  constructor(filename) {
    this.fileName = filename;
    this.text = '';
  }

  // export the file

  makeTextFile(text) {
    var textFile = null;
    var data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  }

  write(text) {
    this.text += text;
  }

  writeLine(text) {
    this.text += text + '\n';
  }

  // This finalises the file and saves it to disl
  save() {
    var link = document.createElement('a');
    link.setAttribute('download', this.fileName);
    link.href = this.makeTextFile(this.text);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function() {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
  }
}

var reader;
//var progress = document.querySelector('.percent');

var fileExtention;

var fileName;

var FileLoadNoteType = {
  // Error
  ERR: 0,

  // Warning
  WRN: 1
};

var FileLoadNotes = {};
var fileLoadNotesCount = 0;

function logLoadError(filename, title, descp) {
  fileLoadNotesCount++;
  FileLoadNotes[fileLoadNotesCount] = {
    type: FileLoadNoteType.ERR,
    fileName: filename,
    title: title,
    descp: descp
  };
}

function logLoadWarning(filename, title, descp) {
  fileLoadNotesCount++;
  FileLoadNotes[fileLoadNotesCount] = {
    type: FileLoadNoteType.WRN,
    fileName: filename,
    title: title,
    descp: descp
  };
}

var EnumFileType = {
  STL: 0,
  OBJ: 1
};

//Returns the File extension
function getFileExtention(fileName) {
  return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
}

function abortRead() {
  reader.abort();
}

function errorHandler(evt) {
  switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      alert('File Not Found!');
      break;
    case evt.target.error.NOT_READABLE_ERR:
      alert('File is not readable');
      break;
    case evt.target.error.ABORT_ERR:
      break; // noop
    default:
      alert('An error occurred reading this file.');
  }
}

function updateProgress(evt) {
  // evt is an ProgressEvent.
  if (evt.lengthComputable) {
    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
      //progress.style.width = percentLoaded + '%';
      //progress.textContent = percentLoaded + '%';
      //console.log(percentLoaded);
    }
  }
}

// This function is called when a file is loaded, whether locally or through Google Drive.
function ProcessFiles(files) {
  // Reset the file load index
  var CurFileIndex = 0;

  // First, clear out any previous errors
  for (var key in FileLoadNotes) {
    delete FileLoadNotes[key];
  }

  //The File Reader
  reader = new FileReader();
  reader.onerror = errorHandler;
  reader.onprogress = updateProgress;

  //The function executed for file load abort
  reader.onabort = function(e) {
    alert('File read cancelled');
  };

  //The Function Executed during loading
  reader.onloadstart = function(e) {
    //document.getElementById('progress_bar').className = 'loading';
  };

  // Before the main file can be read, support files such as textures
  // and material files must be read in first.
  var LoadRefFiles = true;

  function LoadFile(ext) {
    switch (ext) {
      case 'mtl':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return LoadRefFiles;
        break;
      default:
        return !LoadRefFiles;
        break;
    }
  }

  //Function Executed After the File Has Been Loaded
  reader.onload = function(e) {
    var ext = getFileExtention(files[CurFileIndex].name).toLowerCase();
    //console.log(this);
    // Get the file extention
    switch (ext) {
      // Wavefront OBJ file, reference MTL files.
      case 'obj':
        io_import_obj(files[CurFileIndex], this.result);
        break;

      // a material file in an obj file.
      case 'mtl':
        io_import_obj_mtl(fileName, this.result);
        break;

      // STL files for 3D Printing
      case 'stl':
        io_import_stl(files[CurFileIndex], this.result);
        break;
      case 'ply':
        io_import_ply(fileName, this.result);
        break;

      case 'x':
        io_import_x(files[CurFileIndex], this.result);
        break;
      case 'png':
      case 'jpeg':
      case 'jpg':
      case 'tga':
        io_import_img(fileName, this.result);
        //var srcData = e.target.result; // <--- data: base64
        break;
      default:
        //alert("File Type .'" + fileExtention + "' Not Supported.\nIf this is a 3D file format and you would like this file type added, please contact us!");
        //console.log("File Type .'" + ext + "' Not Supported.\nIf you would like this file type added, please contact us!");
        logLoadWarning(
          fileName,
          "'" + ext + "' File Type Not Supported",
          'If you would like this file type added, please contact us!'
        );
        break;
    }
    //        console.log(fileName+" Loaded.")
    CurFileIndex++;
    if (CurFileIndex < files.length) {
      fileName = files[CurFileIndex].name;
      log("LoadFile('" + fileName + "')");

      modalLoadFile.style.display = 'block';
      document.getElementById('modal_loadFile_file-prgrsbar').style.width =
        ((CurFileIndex + 1) / files.length) * 100 + '%';
      document.getElementById('modal_loadFile_file-name').innerHTML =
        'File Name: ' + files[CurFileIndex].name;
      document.getElementById('modal_loadFile_file-size').innerHTML =
        'Size: ' + parseInt(files[CurFileIndex].size / 1000) / 1000 + ' Mb';

      setTimeout(function() {
        switch (getFileExtention(files[CurFileIndex].name).toLowerCase()) {
          case 'png':
          case 'jpeg':
          case 'jpg':
          case 'tga':
            reader.readAsDataURL(files[CurFileIndex]);
            break;
          default:
            reader.readAsText(files[CurFileIndex]);
            break;
        }
      }, 100);
    }
    // Finished Loading all files
    else {
      onAllFilesLoaded();
    }
  };

  // start off reading a file
  fileName = files[CurFileIndex].name;
  log("LoadFile('" + fileName + "')");

  switch (getFileExtention(files[CurFileIndex].name).toLowerCase()) {
    case 'png':
    case 'jpeg':
    case 'jpg':
    case 'tga':
      reader.readAsDataURL(files[CurFileIndex]);
      break;
    default:
      reader.readAsText(files[CurFileIndex]);
      break;
  }
}

// Fired when all files have been loaded
function onAllFilesLoaded() {
  // Remove the Loading File Modal
  modalLoadFile.style.display = 'none';

  InitialiseFiles();
}

function InitialiseFiles() {
  // first, clear the root div for any load results
  document.getElementById('div_results').innerHTML = '';

  // next, loop through each model initisalising and getting any errors
  for (var i = 0; i < ModelCollection.length; i++) {
    var model = ModelCollection[i];

    // Initialise the model since all files should be loaded.
    model.Init();

    // now that all materials are set, initialise the tree nodes.
    model.initTreeNodes();

    Camera.zoom = Math.min(-model.MaxPoint.Length() * 1.5, Camera.zoom) - 1;
    Camera.rotX = -45;
    Camera.rotY = 30;
  }

  // Now process any errors loading the file
  for (var key in FileLoadNotes) {
    var note = FileLoadNotes[key];

    // deactivate zoom until the user clicks the close button
    MouseState.ZoomEnabled = false;

    if (note.type == 0) {
      model.ErrorCount++;
    } else {
      model.WarningCount++;
    }

    //console.log(note);
    addResultsItem(note);
    // Finally show the file load results dialog
    modalLoadFileResults.style.display = 'block';
  }
}

// fired when a local file has been selected
function handleLocalFileSelect(evt) {
  var IsFileASCII = true;
  modalOpenFile.style.display = 'none';
  modalLoadFile.style.display = 'block';

  document.getElementById('modal_loadFile_file-prgrsbar').style.width =
    (1 / evt.target.files.length) * 100 + '%';
  document.getElementById('modal_loadFile_file-name').innerHTML =
    'File Name: ' + evt.target.files[0].name;
  document.getElementById('modal_loadFile_file-size').innerHTML =
    'Size: ' + parseInt(evt.target.files[0].size / 10000) / 100 + ' Mb';

  // reorder files
  //var SortedFiles = {};

  setTimeout(function() {
    ProcessFiles(evt.target.files);
  }, 100);
}

document
  .getElementById('menu_file_openSelect')
  .addEventListener('change', handleLocalFileSelect, false);
