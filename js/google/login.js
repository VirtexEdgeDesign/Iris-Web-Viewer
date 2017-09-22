var GoogleProfile;

function onSignIn(googleUser) {
   GoogleProfile = googleUser.getBasicProfile();
  
  /*
  console.log('ID: ' + GoogleProfile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + GoogleProfile.getName());
  console.log('Image URL: ' + GoogleProfile.getImageUrl());
  console.log('Email: ' + GoogleProfile.getEmail()); // This is null if the 'email' scope is not present.
*/
  User.LoggedIn = true;
  User.ID = GoogleProfile.getId();
  User.Name = GoogleProfile.getName();
  User.ImgUrl = GoogleProfile.getImageUrl();
  User.Email = GoogleProfile.getEmail();

  // hide the button
  var btn_googleSignIn = document.getElementById("btn_googleSignIn");
	btn_googleSignIn.style.display = 'none';


  // hide and show the proper divs
  var btn_googleSignIn = document.getElementById("btn_googleSignIn");
  btn_googleSignIn.style.display = 'none';

  var img_profile = document.getElementById("img_profile");
	img_profile.src = GoogleProfile.getImageUrl();


  var profile_name = document.getElementById("profile_name");
	profile_name.innerHTML = GoogleProfile.getName();


  var profile_img = document.getElementById("profile_img");
	profile_img.src = GoogleProfile.getImageUrl();

  var profile_email = document.getElementById("profile_email");
	profile_email.innerHTML = GoogleProfile.getEmail();

	
  var dev_signedIn = document.getElementById("dev_signedIn");
  dev_signedIn.style.display = 'block';

/*
Code to Request Google Drive Later On
  var options = new gapi.auth2.SigninOptionsBuilder(
        {'scope': 'email https://www.googleapis.com/auth/drive'});

googleUser.grant(options).then(
    function(success){
      console.log(JSON.stringify({message: "success", value: success}));
    },
    function(fail){
      alert(JSON.stringify({message: "fail", value: fail}));
    });
*/

}
// Logout
//******************************************************************
function OnGoogleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
gapi.auth2.getAuthInstance().disconnect();
      var dev_signedIn = document.getElementById("dev_signedIn");
      dev_signedIn.style.display = 'none';


      var btn_googleSignIn = document.getElementById("btn_googleSignIn");
      btn_googleSignIn.style.display = 'block';

      console.log('User signed out.');
    });
};