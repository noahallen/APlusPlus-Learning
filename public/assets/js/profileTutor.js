//*------------------------------Public Tutor Profile Page Code ------------------------------*/

//Add a function that store the request tutor's time, user's email and user's name into an array, then push to tutor's firebase
async function creaTimeChosenArray(time) {

    var teaEmail = parseURL();

    createUser()
    .then(function(user) {
        if(user.email != teaEmail){
            var currentTutor = createTutor(teaEmail);
            currentTutor.then(function(tutor){
                var db = firebase.firestore();
                var email = user.email;
                var fname=user.fname;
                var lname=user.lname;
                var TTimeArr = tutor.IncomingRequests;
                var requestSingle = {
                    FirstName:fname,
                    LastName:lname,
                    Email:email,
                    TutorTime:time,
                    TutorEmail:teaEmail
                };
                

                for (var i = 0; i < TTimeArr.length; i++) {
                    if (TTimeArr[i].FirstName == fname && TTimeArr[i].LastName == lname && TTimeArr[i].Email == email && TTimeArr[i].TutorTime == time) {
                        alert("Request already exist!");
                        return;
                    }
                }
                
                
                db.collection("users").doc(teaEmail).update({
                    IncomingRequests: firebase.firestore.FieldValue.arrayUnion(requestSingle),
                })
                
                db.collection("users").doc(user.email).update({
                    OutgoingRequests: firebase.firestore.FieldValue.arrayUnion(requestSingle),
                    
                })
                alert("Request sent!");
            });

        }
        else{
            alert("Can't request your own time!");
        }
    });
 
}


//function to take the tutors' times avilable and displays them as buttons
//takes an array and display the times as buttons
function displayAvailableTime(availTime){
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
                IncomingRequests:doc.data().IncomingRequests,
                OutgoingRequests:doc.data().OutgoingRequests,
                Reserved:doc.data().Reserved,
            };
        }
        else{
            console.log("document doesn't exist");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  
    newTutor = new User(
        email, tutor.fname, tutor.lname, tutor.school, tutor.isTutor, tutor.Strengths, tutor.AvailableTime, tutor.IncomingRequests, tutor.Reserved,tutor.OutgoingRequests
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
