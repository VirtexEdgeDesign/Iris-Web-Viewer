// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
var developerKey = 'AIzaSyCpY9meQR6AgjIYSko19crZpGr5jDjVsGA';

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientId = "629606533840-1j5m58o3krsdkno8hiamd763opce78ia.apps.googleusercontent.com"

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
var appId = "629606533840";

// Scope to use to access user's Drive items.
var scope = ['https://www.googleapis.com/auth/drive.file'];

var pickerApiLoaded = false;
var oauthToken;

// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
    gapi.load('auth', {
        'callback': onAuthApiLoad
    });
    gapi.load('picker', {
        'callback': onPickerApiLoad
    });
}

function onAuthApiLoad() {
    window.gapi.auth.authorize({
            'client_id': clientId,
            'scope': scope,
            'immediate': false
        },
        handleAuthResult);
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker();
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

// Create and render a Picker object for searching images.
function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        //var view = new google.picker.View(google.picker.ViewId.DOCS);
        var view = new google.picker.DocsView()
        .setParent('root')
        .setIncludeFolders(true);
        //view.setMimeTypes("application/vnd.ms-pki.stl, application/octet-stream");
        var picker = new google.picker.PickerBuilder()
            //.enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(developerKey)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
}

function downloadFiles(docs)
{

}

// A simple callback implementation.
function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {

// first open & close the respective dialogs
    modalOpenFile.style.display = "none";
    document.getElementById('modal_GDrivePicker').style.display = "block";
    document.getElementById('modal_GDrivePicker-prgrsbar').style.width = 0 + "%";

    document.getElementById('modal_GDrivePicker-name').innerHTML = "Requesting File: " + data.docs[0].name; 

    document.getElementById('modal_GDrivePicker-size').innerHTML = "Please Wait...";

    var numOfFilesToGet = data.docs.length;
    var currentFileIndex = 1;

    var totalBytes = 1;
    var currentBytes =0;

        var fileId = data.docs[0].id;

        var googleSelectedFiles = new Array();
        var docs = data[google.picker.Response.DOCUMENTS];
        docs.forEach(function(file) {

            var downloadUrl;
            totalBytes += file.sizeBytes;

            gapi.client.request({
                'path': '/drive/v2/files/' + file.id,
                'method': 'GET',
                callback: function(responsejs, responsetxt) {
                    //console.log(responsejs);

                    downloadUrl = responsejs.downloadUrl;


                    // progress on transfers from the server to the client (downloads)
                    function updateProgress(event) {
                        if (event.lengthComputable) {

                          // Add to the current bytes
                            currentBytes = event.loaded;

                            // Now calculate the percent finished
                            var percentComplete = currentBytes / totalBytes * 100;


                            //console.log("Downloaded: " + parseInt(percentComplete) + "%");
                            document.getElementById('modal_GDrivePicker-prgrsbar').style.width = parseInt(percentComplete)+"%";
//TODO: Add multiple download bars.

document.getElementById('modal_GDrivePicker-size').innerHTML = "Size: " + parseInt(currentBytes/10000)/100 + " of "  + parseInt(totalBytes/10000)/100+ " Mb";
document.getElementById('modal_GDrivePicker-name').innerHTML = "Downloading Files ";// + file.name; 

                        } else {
                            // Unable to compute progress information since the total size is unknown
                        }
                    }


                    var gDoxBlob = null;
                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener("progress", updateProgress, false);
                    xhr.open("GET", downloadUrl); //file.url

                    var accessToken = gapi.auth.getToken().access_token;
                    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);



                    xhr.responseType = "blob";
                    xhr.onload = function() {
                        
                        gDoxBlob = xhr.response;
                        gDoxBlob.name = file.name;
                        googleSelectedFiles.push(gDoxBlob);
                        //googleSelectedFiles.push({ bytes: gDoxBlob, name: file.name });
                        //console.log("File '" + file.name + "' Downloaded");

                        if(currentFileIndex == numOfFilesToGet)
                        {
                          //Finished Downloading Files
                            document.getElementById('modal_GDrivePicker').style.display = "none";
                            modalLoadFile.style.display = "block";
                            ProcessFiles(googleSelectedFiles);
                            //console.log("Loading Files...");
                        }
                        currentFileIndex++;
                    }
                    xhr.send();

                }
            });

        });

    }
}