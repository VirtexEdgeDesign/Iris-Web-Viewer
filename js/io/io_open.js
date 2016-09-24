var reader;
//var progress = document.querySelector('.percent');
  
var fileExtention;
  
var fileName;

var EnumFileType = {
    STL : 0,
    OBJ : 1
  };
  
  //Returns the File extension
function getFileExtention(fileName){
  return fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
}

  function abortRead() {
    reader.abort();
  }

  function errorHandler(evt) {
    switch(evt.target.error.code) {
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
      }
    }
  }


  function handleFileSelect(evt) {
    var IsFileASCII = true;
    
     //First Find Which File Type it is.
      var fileExtention = getFileExtention(evt.target.files[0].name).toLowerCase();
    fileName = evt.target.files[0].name;
    
    // Reset progress indicator on new file selection.
    //progress.style.width = '0%';
    //progress.textContent = '0%';

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
    
    
    //Function Executed After the File Has Been Loaded
    reader.onload = function(e) {
      
      switch(fileExtention)
      {
        case "obj":
          io_import_obj(fileName, this.result);
          break;
        case "stl":
          io_import_stl(fileName, this.result);
          break;
        case "ply":
          io_import_ply(fileName, this.result);
          break;
        default:
        //alert("File Type .'" + fileExtention + "' Not Supported.\nIf this is a 3D file format and you would like this file type added, please contact us!");
        log("File Type .'" + fileExtention + "' Not Supported.\nIf you would like this file type added, please contact us!");
        break;
      }
      

      // Ensure that the progress bar displays 100% at the end.
      //progress.style.width = '100%';
      //progress.textContent = '100%';
      //setTimeout("document.getElementById('progress_bar').className='';", 200);
    };

    // Read in the image file as a binary string.
    //reader.readAsBinaryString(evt.target.files[0]);
    reader.readAsText(evt.target.files[0]);
  }

  document.getElementById('menu_file_openSelect').addEventListener('change', handleFileSelect, false);