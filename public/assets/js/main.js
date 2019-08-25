/*
	Introspect by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/


/*------------------------------Firestore Code ------------------------------*/
function initialize(){
    firebase.initializeApp(firebaseConfig);
}



//Pushes a User's registration data to firebase
function pushToFireStore(){
    
    var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("users").doc(email).set({
        FirstName: document.getElementById("fname").value,
        LastName: document.getElementById("lname").value,
        email: email,
        school: document.getElementById("school").value,
        isTutor: document.getElementById("isTutor").checked,
        AvailableTime:[],
        PendingRequests:[],
    });

    if(document.getElementById("isTutor").checked){
        setTimeout(function(){ location.href ="tutorClasses.html"; }, 3000);
    }
    else{
        setTimeout(function(){ location.href ="index2.html"; }, 3000);
        
    } 
}


//Adds a tutor's strengths to an array and pushes it to firestore
function addStrengths(){
    user = firebase.auth().currentUser;
    email = user.email;

    var strengthArr = [];
    var numClasses = 12;
    for(var i = 0; i < numClasses; i++){
        if(document.getElementById(i.toString()).checked){
            strengthArr.push(document.getElementById(i).name);
        }
    }
    var db = firebase.firestore();
    db.collection("users").doc(email).update('Strengths', strengthArr);

    setTimeout(function(){ location.href ="index2.html"; }, 3000);
}

/*------------------------------General Code ------------------------------*/
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


/*------------------------------Profile Page Code ------------------------------*/

//Function to get a user variable containing the current user's data from firestore
async function getUser(callback) {
	if(firebase.auth().currentUser) {
		callback(firebase.auth().currentUser);
	} else {
		await firebase.auth().onAuthStateChanged(function(user) {
			if(user) {
				callback(user);
			}
		});
	}
};
	  

//Function to display the user's data on their profile page
function listUserInfo(user) {
    var currentUser = createUser(user);
	currentUser.then(function(user){
        document.getElementById("fnameProf").innerHTML = user.fname + "'s Profile";

		document.getElementById("emailDiv").innerHTML = user.email;
		document.getElementById("fnameDiv").innerHTML = user.fname;
        document.getElementById("fnameDiv").innerHTML += " " + user.lname;
        
		document.getElementById("schoolDiv").innerHTML = user.school;
		if (user.isTutor){
            document.getElementById("isTutorDiv").innerHTML = "Student and tutor";
            document.getElementById("subjectDiv").innerHTML = user.Strengths;
            document.getElementById("availTimeDiv").innerHTML = user.AvailableTime;
            listRequestsOnTutorsProfile(user.PendingRequests);
		}
		else{
            document.getElementById("isTutorDiv").innerHTML = "Student";

            var x = document.getElementById("removeSubj1");
            x.style.display = "none";
            var y = document.getElementById("removeSubj2");
            y.style.display = "none";
            var z = document.getElementById("removeSubj3");
            z.style.display = "none";
            document.getElementById("prof-pg").style.marginLeft="30%";
           
		}
	}).catch(function() {
		console.error('Failed to list user info')
		// logout();
	});
}


//User class storing a user's data
class User{
     constructor(email, fname, lname, school, isTutor, strengths, availTime, requests){
		this.email = email;	
		this.fname = fname;
    	this.lname = lname;
        this.school = school;
        this.isTutor = isTutor;   
        this.Strengths = strengths;
        this.AvailableTime = availTime;
        this.PendingRequests = requests;

	}
}

//Initializes a user object initialized with all of the current user's firebase data
async function createUser(){

    var newUser;
    var user = firebase.auth().currentUser;
    var email = user.email;


    var db = firebase.firestore();
    var docRef = db.collection("users").doc(email);


    await docRef.get().then(function(doc){
        if (doc.exists) {
            user = {
                fname:doc.data().FirstName,
                lname:doc.data().LastName,
                email:doc.data().email,
                school:doc.data().school,
                isTutor:doc.data().isTutor,
                Strengths:doc.data().Strengths,
                AvailableTime:doc.data().AvailableTime,
                PendingRequests:doc.data().PendingRequests,
            };
        }
        else{
            console.log("document doesn't exist");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    
    newUser = new User(
        email, user.fname, user.lname, user.school, user.isTutor, user.Strengths, user.AvailableTime, user.PendingRequests
    );
    return newUser;
};




/*------------------------------Search Page Code ------------------------------*/

//Populates the search parameters based on the subject chosen
function populate(s1, s2){
	var s1 = document.getElementById(s1);
	var s2 = document.getElementById(s2);
	s2.innerHTML = "";
    // var optArray = [ "|","math 9a|Math 9A","math 9b|Math 9B","math 9c|Math 9C"];
    
    if (s1.value === "Math"){
		var optArray = ["math 009a|Math 009A","math 009b|Math 009B","math 009c|Math 009C"];
	}
	if(s1.value === "Computer Science"){
		var optArray = ["cs 005|CS 005","cs 008|CS 008","cs 010|CS 010"];	
	}
	else if(s1.value === "English"){
		var optArray = ["engl 1a|Engl 1A","engl 1b|Engl 1B","engl 1c|Engl 1C"];	
	}
	else if(s1.value === "Physics"){
		var optArray = ["phys 040a|Phys 040A","phys 040b|Phys 040B","phys 040c|Phys 040C"];	
	}
	for ( var option in optArray){
		var pair = optArray[option].split("|");
		var newOption = document.createElement("option");
		newOption.value = pair[0];
		newOption.innerHTML = pair[1];
		s2.options.add(newOption);
	}
}



//function to take the tutors' times avilable and displays them as buttons
//takes an array and display the times as buttons
function displayAvailableTime(availTime){
	// var strs = "";
	// for (var i = 0; i < availTime.length; i++) {
    //     console.log(availTime[i]);
	// 	strs += '<input type="button"  onclick=creaTimeChosenArray("'+availTime[i]+'")  value="' + availTime[i] + '" />';//need to pass in the availTime to the onclick function
	// }
    // $("#availTimeButtons").html(strs);
    for (var i = 0; i < availTime.length; i++){
    var availTimeButtons = document.getElementById("availTimeButtons");
    var bre = document.createElement("br");
    var button = document.createElement("button");
    var Name = availTime[i];
    var parameter = availTime[i];

    Name = document.createTextNode(Name);
    button.appendChild(Name);
    button.value = parameter;
    button.onclick = (function(parameter){
        return function(){
            creaTimeChosenArray(parameter);
        }
     })(parameter);
     availTimeButtons.appendChild(button);
     availTimeButtons.appendChild(bre); 
    }

}
     

//Store tutor's data and carries it onto tutor's profile page
function parseURL() {
    var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (var i = 0; i < params.length; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
	}
	return decodeURIComponent(data.email);
	// listTutorInfo(data.email);
}
//Function direct user to the tutor's profile page when they click on the tutor's name + encode email stored in URL
function displayTutorProfile(email){
    location.href = "profileTutor.html?email=" + encodeURIComponent(email);
}

//create a tutor object based on email passed in
async function createTutor(email){

	var tutor;
	var db = firebase.firestore();
    var docRef = db.collection("users").doc(email);
    



    await docRef.get().then(function(doc){
        if (doc.exists) {
            tutor = {
                fname:doc.data().FirstName,
                lname:doc.data().LastName,
                email:doc.data().email,
                school:doc.data().school,
                isTutor:doc.data().isTutor,
                Strengths:doc.data().Strengths,
                AvailableTime:doc.data().AvailableTime,
                PendingRequests:doc.data().PendingRequests,
            };
        }
        else{
            console.log("document doesn't exist");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  
    newTutor = new User(
        email, tutor.fname, tutor.lname, tutor.school, tutor.isTutor, tutor.Strengths, tutor.AvailableTime, tutor.PendingRequests
	);
    return newTutor;
};

//populates the tutor's info based on email passed in
function listTutorInfo() {
    var email = parseURL();

    var currentUser = createTutor(email);
    document.getElementById("pub-prof-pg").style.marginLeft="30%";

	currentUser.then(function(tutor){
        document.getElementById("fnameProf").innerHTML = tutor.fname + "'s Profile";
		document.getElementById("fnameDiv").innerHTML = tutor.fname;
        document.getElementById("fnameDiv").innerHTML += " " + tutor.lname;
		document.getElementById("schoolDiv").innerHTML = tutor.school;
        document.getElementById("subjectDiv").innerHTML = tutor.Strengths;
        displayAvailableTime(tutor.AvailableTime);
        

	}).catch(function() {
		console.log('Failed to list user info')
	});
}



//Takes the current filter options and returns an array containing the matching tutors
async function pullTutorArray(){
    var subject = document.getElementById('selectSubj');
    var subjectOption = subject.options[subject.selectedIndex].text;
    if(subjectOption != "Select subject"){
        var selectedClass = document.getElementById('selectCourse');
        var selectedOption = selectedClass.options[selectedClass.selectedIndex].text;

        selectedOption = "•  " + selectedOption;
        // console.log(selectedOption);
        var db = firebase.firestore();
        var userArr = [];

        await db.collection("users").where("Strengths", "array-contains", selectedOption).get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // console.log(doc.data().email);
                var currUser = 
                {
                    FirstName:doc.data().FirstName,
                    LastName:doc.data().LastName,
                    email:doc.data().email,
                };
                userArr.push(currUser);
            });
        }).catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        // console.log(userArr);
        return userArr;
    }
    else{
        console.log("Please select a valid class!");
    }    
}


/*goes through each of the 10 tutor objects in the passed in array and displays them in the form of buttons*/
function displayPossibleTutors(){
    var div = document.getElementById('searchSel');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
    var arr = pullTutorArray();
    // console.log(arr);
    
    arr.then(function(arr) {
        
        if(arr != undefined) {
            // console.log(arr);
            for(var i=0; i < arr.length; i++){
                if(i < 10){
                    // console.log("Entered Loop");
                    
                    var searchSel = document.getElementById("searchSel");
                    var bre = document.createElement("br");
                    var button = document.createElement("button");
                    var Name = arr[i].FirstName + " " + arr[i].LastName;
                    var email = arr[i].email;

                    Name = document.createTextNode(Name);
                    button.appendChild(Name);
                    button.id = 'Tutor' + i;
                    button.value = email;
                    button.onclick = (function(email){
                        return function(){
                            displayTutorProfile(email);
                        }
                     })(email);
                    searchSel.appendChild(button);
                    searchSel.appendChild(bre);                     
                    button.style.background="grey";
                    button.style.marginTop="20px";
                    button.style.width="100%";
                    button.style.border="2px solid 	#505050";
                    button.style.borderRadius="2px";
                    // console.log("end of itteration")
                }
            }
            // console.log("After Loop")
        }
    });
}



//*------------------------------Public Tutor Profile Page Code ------------------------------*/


function listRequestsOnTutorsProfile(pendReqArr){
    console.log(pendReqArr);
    // for(var i = 0; i < 50;i++){    
    //     var node = document.createElement("LI");                 // Create a <li> node
    //     var textnode = document.createTextNode("Water");         // Create a text node
    //     node.appendChild(textnode);                              // Append the text to <li>
    //     document.getElementById("tut-prof-req").appendChild(node);
    // }
    if(pendReqArr != undefined){
        // var toAdd = document.createDocumentFragment();
        for(var i = 0; i < pendReqArr.length;i++){
            var req = pendReqArr[i];
            // console.log("entered loop");
            var name = pendReqArr[i].FirstName + " " + pendReqArr[i].LastName;
            var email = pendReqArr[i].Email;
            var time = pendReqArr[i].TutorTime;
            var msg = name + " (" + email + ") would like to request you for: " + time;
            // console.log(msg);
            var rejButton = document.createElement("button");
            var accButton = document.createElement("button");
            var br = document.createElement("br");

            var newDiv = document.createElement('div');
            var displmsg = document.createTextNode(msg);
            newDiv.id = 'request'+i;

            newDiv.appendChild(displmsg);
            newDiv.appendChild(br);
            newDiv.appendChild(accButton);
            newDiv.appendChild(rejButton);

            newDiv.style.border="1px solid black";
            newDiv.style.marginLeft="1%";
            newDiv.style.marginRight="1%";
            newDiv.style.marginTop="5%";
            newDiv.style.background="#F5F5F5";

            var reject = document.createTextNode("Reject");
            rejButton.appendChild(reject);
            rejButton.style.background="red";
            rejButton.style.width="45%";
            // rejButton.style.height="75%";
            rejButton.style.marginLeft="1%";
            rejButton.style.fontSize="50%";
            rejButton.style.marginBottom="2%";

           
            rejButton.onclick = (function(req){
                return function(){
                    rejectRequest(req);
                }
             })(req);
            
            var Accept = document.createTextNode("Accept");
            accButton.appendChild(Accept);
            accButton.style.background="green";
            accButton.style.width="45%";
            // rejButton.style.height="75%";
            accButton.style.fontSize="50%";

            
            accButton.onclick = (function(req){
                return function(){
                    rejectRequest(req);
                }
             })(req);

            document.getElementById("tut-prof-req").appendChild(newDiv);

            

            // console.log("finish loop"); 
           
        }
    }
}

//Add a function that store the request tutor's time, user's email and user's name into an array, then push to tutor's firebase
async function creaTimeChosenArray(time) {

    var teaEmail = parseURL();

    createUser()
    .then(function(user) {
        if(user.email != teaEmail){
            var currentTutor = createTutor(teaEmail);
            currentTutor.then(function(tutor){
                var email = user.email;
                var fname=user.fname;
                var lname=user.lname;
                var TTimeArr = tutor.PendingRequests;
                var requestSingle = {
                    FirstName:fname,
                    LastName:lname,
                    Email:email,
                    TutorTime:time
                };
                
                for (var i = 0; i < TTimeArr.length; i++) {
                    if (TTimeArr[i].FirstName == fname && TTimeArr[i].LastName == lname && TTimeArr[i].Email == email && TTimeArr[i].TutorTime == time) {
                        alert("Request already exist!");
                        return;
                    }
                }
                TTimeArr.push(requestSingle);
                var db = firebase.firestore();
                db.collection("users").doc(teaEmail).update({
                    PendingRequests: TTimeArr
                })
                
                alert("Request sent!");
            });
        }
        else{
            alert("Can't request your own time!");
        }
    });
 
}



//Push tutor's inputted available time to the tutor's firestore
function pushAvailTimeToFirestore(availTime){
	var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    var email = user.email;
    // var arrTime=user.AvailableTime;
    // arrTime.push(availTime);
	// console.log(db.user);
    db.collection("users").doc(email).update({
        AvailableTime: firebase.firestore.FieldValue.arrayUnion(availTime)
    });
    
}


//Function needs to be fixed based off of what the request object will look like
// function DisplayButtonsAccept(PendingRequests){
// 	var strs = "";

// 	for (var i = 0; i < PendingRequests.length; i++) {
//         console.log(PendingRequests[i]);
// 		strs+='<div class="req">'+
//         '<span>'+PendingRequests[i].FirstName+'</span>'+
//         '<span>'+PendingRequests[i].LastName+'</span>'+
//         '<span>'+PendingRequests[i].Email+'</span>'+
//         '<span>'+PendingRequests[i].TutorTime+'</span>'+
//         '<br/>'+
//         '<input type="button" onclick="acceptRequest('+PendingRequests[i]+')" value="Accept">'+
//         '<input type="button" onclick="rejectRequest('+PendingRequests[i]+')" value="Reject">'+
//     '<hr>'+
//     '</div>';

//     }
// $("#requestList").html(strs);
// }






// function acceptRequest(req){

//  //getting the tutor's email
//  createUser()//firebase.auth().currentUser)
//  .then(function (user) {
//         var AcceptedArr = user.AcceptedRequests;
//     var acceptObj={
//     FirstName:req.FirstName,
//     LastName:req.LastName,
//     Email:req.Email,
//     // ReservedTime:req.TutorTime

//    };
//    AcceptedArr.push(acceptObj);
//      var db = firebase.firestore();
//      db.collection("users").doc(user.email).update({
//          AcceptedRequests: newTimes
//      })
//  });

// };




// function rejectRequest(req){
//  //getting the tutor's email
//  createUser()//firebase.auth().currentUser)
//  .then(function (user) {
//      var TTimeArr = user.PendingRequests;
//      var newTimes = [];
//      for (var i = 0; i < TTimeArr.length; i++) {
//          if (TTimeArr[i] == req) {
//              continue;
//          }
//          newTimes.push(TTimeArr[i]);
//      }
//      var db = firebase.firestore();
//      db.collection("users").doc(user.email).update({
//          PendingRequests: newTimes
//      })
//  });

// }


