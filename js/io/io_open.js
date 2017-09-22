var reader;
//var progress = document.querySelector('.percent');

var fileExtention;

var fileName;

var EnumFileType = {
    STL: 0,
    OBJ: 1
};

//Returns the File extension
function getFileExtention(fileName) {
    return fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
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
            console.log(percentLoaded);
        }
    }
}

// This function is called when a file is loaded, whether locally or through Google Drive.
function ProcessFiles(files) {

    // Reset the file load index
    var CurFileIndex = 0;


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
            case "mtl":
            case "png":
            case "jpg":
            case "jpeg":
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

        // Get the file extention
        switch (ext) {
            case "obj":
                io_import_obj(files, fileName, this.result);
                console.log(ioImgs);
                break;

                // a material file in an obj file.
            case "mtl":
                io_import_obj_mtl(fileName, this.result);
                break;
            case "stl":
                io_import_stl(files, fileName, this.result);
                break;
            case "ply":
                io_import_ply(fileName, this.result);
                break;
            case "png":
                io_import_png(fileName, this.result);
                //var srcData = e.target.result; // <--- data: base64
                break;
            default:
                //alert("File Type .'" + fileExtention + "' Not Supported.\nIf this is a 3D file format and you would like this file type added, please contact us!");
                console.log("File Type .'" + ext + "' Not Supported.\nIf you would like this file type added, please contact us!");
                break;
        }

        CurFileIndex++;
        if (CurFileIndex < files.length) {

            fileName = files[CurFileIndex].name;
            log("Loading File: " + fileName);

            modalLoadFile.style.display = "block";
            document.getElementById('modal_loadFile_file-prgrsbar').style.width = ((CurFileIndex + 1) / files.length * 100) + "%";
            document.getElementById('modal_loadFile_file-name').innerHTML = "File Name: " + files[CurFileIndex].name;
            document.getElementById('modal_loadFile_file-size').innerHTML = "Size: " + parseInt(files[CurFileIndex].size / 1000) / 1000 + " Mb";

            setTimeout(function() {
              
            switch (getFileExtention(files[CurFileIndex].name).toLowerCase()) {
              case "png":
              reader.readAsDataURL(files[CurFileIndex]);
                break;
              default:
                reader.readAsText(files[CurFileIndex]);
                break;
              }
            }, 100);

        }

    };




    // start off reading a file
    fileName = files[CurFileIndex].name;
    log("Loading File: " + fileName);
    

            switch (getFileExtention(files[CurFileIndex].name).toLowerCase()) {
              case "png":
              reader.readAsDataURL(files[CurFileIndex]);
                break;
              default:
                reader.readAsText(files[CurFileIndex]);
                break;
              }
}


function handleLocalFileSelect(evt) {
    var IsFileASCII = true;
    modalOpenFile.style.display = "none";
    modalLoadFile.style.display = "block";

    document.getElementById('modal_loadFile_file-prgrsbar').style.width = (1 / evt.target.files.length * 100) + "%";
    document.getElementById('modal_loadFile_file-name').innerHTML = "File Name: " + evt.target.files[0].name;
    document.getElementById('modal_loadFile_file-size').innerHTML = "Size: " + parseInt(evt.target.files[0].size / 10000) / 100 + " Mb";


    // reorder files
    //var SortedFiles = {};


    setTimeout(function() {
        ProcessFiles(evt.target.files)
    }, 100);
}

document.getElementById('menu_file_openSelect').addEventListener('change', handleLocalFileSelect, false);