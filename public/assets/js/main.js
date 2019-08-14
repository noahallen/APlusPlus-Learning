/*
	Introspect by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/


function initialize(){
    firebase.initializeApp(firebaseConfig);
}

function pushToFireStore(){
    
    var db = firebase.firestore();
    db.collection("users").doc(document.getElementById("email").value).set({
        FirstName: document.getElementById("fname").value,
        LastName: document.getElementById("lname").value,
        email: document.getElementById("email").value,
        school: document.getElementById("school").value,
        isTutor: document.getElementById("isTutor").checked
    });
    setTimeout(function(){ location.href ="index2.html"; }, 3000);
    
}


function logout(){
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		location.href = "index1.html";
	  }).catch(function(error) {
		console.log(error);
	});
}

function login(){

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
        var provider = new firebase.auth.GoogleAuthProvider();


        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.     
            var user = result.user;
            var db = firebase.firestore();
            //console.log(user.email);

            //Goes through each user in the database
            var found = false;
            db.collection("users").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().email == user.email){
                        //Puts them on a profile
                        //button/profile button/makes login button disappear
                        found = true;
                        location.href = "index2.html";
                    }
                });
                if(!found){
                    //console.log("User not registerd")
                    location.href = "register.html";
                }
            });
            // ...
        });
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


(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Off-Canvas Navigation.

			// Navigation Panel Toggle.
				$('<a href="#navPanel" class="navPanelToggle"></a>')
					.appendTo($body);

			// Navigation Panel.
				$(
					'<div id="navPanel">' +
						$('#nav').html() +
						'<a href="#navPanel" class="close"></a>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left'
					});

			// Fix: Remove transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#navPanel')
						.css('transition', 'none');

	});

})(jQuery);


// function getEmail(){
//     firebase.auth().onAuthStateChanged(function(user){
//         if (user){
//             user = firebase.auth().currentUser;
//             return user.email;
//         }
//     });
// }


// class User{
//     constructor(){
//         this.userRef = firebase.firestore().collection("users");
//         this.email = getEmail();
//         this.fname;
//         this.lname;
//         this.school;
//         this.isTutor;
        
//     }

//     get UserEmail(){
//         return getEmail();
//     }

//     get fname(){
//         firebase.firestore().collection("users").where("email", "==", this.UserEmail)
//         .get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 return doc.data().fname;
//             });
//         })
//         .catch(function(error) {
//             //
//         });
//     }

//     get lname(){
//         firebase.firestore().collection("users").where("email", "==", this.UserEmail)
//         .get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 return doc.data().lname;
//             });
//         })
//         .catch(function(error) {
//             //
//         });
//     }

//     get school(){
//         firebase.firestore().collection("users").where("email", "==", this.UserEmail)
//         .get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 return doc.data().school;
//             });
//         })
//         .catch(function(error) {
//             //
//         });
//     }

//     get isTutor(){
//         firebase.firestore().collection("users").where("email", "==", this.UserEmail)
//         .get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 return doc.data().isTutor;
//             });
//         })
//         .catch(function(error) {
//             //
//         });
//     }

//     set fname(fname){
//         firebase.firestore().collection("users").doc(document.getElementById("email").value).set({
//             FirstName: fname,
//             LastName: document.getElementById("lname").value,
//             email: document.getElementById("email").value,
//             school: document.getElementById("school").value,
//             isTutor: document.getElementById("isTutor").checked
//         });
//         this.fname = fname;
//     }

//     set lname(lname){
//         firebase.firestore().collection("users").doc(document.getElementById("email").value).set({
//             FirstName: document.getElementById("fname").value,
//             LastName: lname,
//             email: document.getElementById("email").value,
//             school: document.getElementById("school").value,
//             isTutor: document.getElementById("isTutor").checked
//         });

//         this.lname = lname;
//     }

//     set setSchool(school){
//         firebase.firestore().collection("users").doc(document.getElementById("email").value).set({
//             FirstName: document.getElementById("fname").value,
//             LastName: document.getElementById("lname").value,
//             email: document.getElementById("email").value,
//             school: school,
//             isTutor: document.getElementById("isTutor").checked
//         });

//         this.school = school;
//     }

//     set setTutor(isTutor){
//         firebase.firestore().collection("users").doc(document.getElementById("email").value).set({
//             FirstName: document.getElementById("fname").value,
//             LastName: document.getElementById("lname").value,
//             email: document.getElementById("email").value,
//             school: document.getElementById("school").value,
//             isTutor: isTutor
//         });

//         this.isTutor = isTutor;
//     }
// }


