//Landing Page Javascript

function initialize(){
    firebase.initializeApp(firebaseConfig);
    //hideShow("ProfileButton");
}


function hideShow(idToHide) {

    var x = document.getElementById(idToHide);

    if (x.style.display === "none") {
        x.style.display = "inline";
    } 
    else {
        x.style.display = "none";
    }
}


function login(){
    var provider = new firebase.auth.GoogleAuthProvider();


    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        var db = firebase.firestore();
        //console.log(user.email);

        //Goes through each user in the database
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var found = false;
                if(doc.data().email == user.email){
                    //Puts them on a profile
                    //button/profile button/makes login button disappear
                    found = true;
                    //console.log("User registered");
                    hideShow("LoginButton");
                    hideShow("ProfileButton");
                    //document.getElementById("Welcome").innerHTML = "Welcome, " + doc.data().FirstName;
                }
            });
            if(!found){
                //console.log("User not registerd")
                location.href = "register.html";
            }
        });
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(errorCode);
        console.log(errorMessage);
      });
}

// document.getElementById("ProfileButton").onclick = function(){
//     location.href = "profile.html";
// };