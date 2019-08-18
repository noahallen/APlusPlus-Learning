/*
	Introspect by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/


function initialize(){
    firebase.initializeApp(firebaseConfig);
}


//Pushes a User's registration data to firebase
function pushToFireStore(){
    
    var db = firebase.firestore();
    var email = document.getElementById("email").value
    db.collection("users").doc(email).set({
        FirstName: document.getElementById("fname").value,
        LastName: document.getElementById("lname").value,
        email: document.getElementById("email").value,
        school: document.getElementById("school").value,
        isTutor: document.getElementById("isTutor").checked,
    });

    if(document.getElementById("isTutor").checked){
        setTimeout(tutorRegistrationPage(email), 3000);
    }

    else{
        setTimeout(function(){ location.href ="index2.html"; }, 3000);
    } 
}

//If the user selects they want to be a tutor this takes them to the tutor registration specific page and adds
//an event listener for the new submit button
function tutorRegistrationPage(email){
    location.href ="tutorClasses.html";
    document.getElementById("tutorSubmit").addEventListener("click", addStrenghts(email));
}

//Adds a tutor's strengths to an array and pushes it to firestore
function addStrenghts(email){


    var db = firebase.firestore();
    db.collection("users").doc(email).add({
        Strenghts: []
    });

    setTimeout(function(){ location.href ="index2.html"; }, 3000);
}


//Logs the user out and redirects them to the homepage
function logout(){
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		location.href = "index1.html";
	  }).catch(function(error) {
        console.log(error);
        location.href = "index1.html";
	});
}


//Logs the user in through Google Auth
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



//Initializes a user object initialized with all of the current user's firebase data
async function createUser(){
    var email;
    var newUser;
    var user;
    // firebase.auth().onAuthStateChanged(function(user)
        user = firebase.auth().currentUser;
        email = user.email;
    //console.log(email);
    var db = firebase.firestore();
    var docRef = db.collection("users").doc(email);
    await docRef.get().then(function(doc){
        if (doc.exists) {
            user = {
                fname:doc.data().FirstName,
                lname:doc.data().LastName,
                email:doc.data().email,
                school:doc.data().School,
                isTutor:doc.data().isTutor,
                strenghts:doc.data().Strenghts,
            };
        }
        else{
            console.log("document doesn't exist");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    
    newUser = new User(
        email, user.fname, user.lname, user.school, user.isTutor, user.strengths
    );
    //console.log(newUser);
    return newUser;
    //return new User();
};
        


//User class storing a user's data
 class User{
     constructor(email, fname, lname, school, isTutor, strenghts){
		this.email = email;	
		this.fname = fname;
    	this.lname = lname;
        this.school = school;
        this.isTutor = isTutor;   
        this.strengths = strenghts;
	}
}



function populate(s1, s2){
	var s1 = document.getElementById(s1);
	var s2 = document.getElementById(s2);
	s2.innerHTML = "";
	if (s1.value === "Math"){
		var optArray = [ "|","math 9a|Math 9A","math 9b|Math 9B","math 9c|Math 9C"];
	}
	else if(s1.value === "Computer Science"){
		var optArray = [ "|","cs 005|CS 005","cs 008|CS 008","cs 010|CS 010"];	
	}
	else if(s1.value === "English"){
		var optArray = [ "|","engl 1a|ENGL 1A","engl 1b|ENGL 1B","engl 1c|ENGL 1C"];	
	}
	else if(s1.value === "Physics"){
		var optArray = [ "|","phys 040a|PHYS 040A","phys 040b|PHYS 040B","phys 040c|PHYS 040C"];	
	}
	for ( var optoin in optArray){
		var pair = optArray[optoin].split("|");
		var newOption = document.createElement("option");
		newOption.value = pair[0];
		newOption.innerHTML = pair[1];
		s2.options.add(newOption);
	}
}