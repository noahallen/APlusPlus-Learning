/*------------------------------Profile Page Code ------------------------------*/

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

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
      



function listAvailTime(arr){
    if(arr != undefined){
        // var toAdd = document.createDocumentFragment();
        
        for(var i = 0; i < arr.length;i++){
            
            
            var msg = arr[i];
            // console.log(msg);
            var br = document.createElement("br");

            var newDiv = document.createElement('div');
            var displmsg = document.createTextNode(msg);
            //add remove button here 
            var button = document.createElement("button");
            var Name = "Remove";
            var parameter = arr[i];

            Name = document.createTextNode(Name);
            button.appendChild(Name);
            button.style.marginLeft="10%";
            button.style.marginTop="1%";
            button.style.marginBottom="1%";
            button.style.background="red";
            button.style.border="1px solid black";
            button.style.fontSize="50%";
            button.value = parameter;

            newDiv.id = "removeButton-div" + i;
            newDiv.className = "removeButton-div" + i;

            var id = newDiv.id;
            // console.log(button.value);
            button.onclick = (function(parameter, id){
                return function(){
                    RemoveAvailFirebase(parameter);
                    document.getElementById(id).remove();
                    
                }
            })(parameter, id);
            
            newDiv.appendChild(displmsg);
            newDiv.appendChild(button);
            newDiv.appendChild(br);
            

            newDiv.style.border="1px solid black";
            newDiv.style.marginLeft="1%";
            newDiv.style.marginRight="1%";
            newDiv.style.marginTop="5%";
            newDiv.style.background="#F5F5F5";
            
            
            document.getElementById("availTimeDiv").appendChild(newDiv);
        
        }
    }
}


//Function to remove the AvailTime form firebase
function RemoveAvailFirebase(TimeToRemove){
    createUser().then(function(tutor){
        var db = firebase.firestore();
        db.collection("users").doc(tutor.email).update({
            AvailableTime: firebase.firestore.FieldValue.arrayRemove(TimeToRemove)
        });
    });
}



//Function to display the user's data on their profile page
function listUserInfo(user) {
    var currentUser = createUser(user);
	currentUser.then(function(user){
        document.getElementById("fnameProf").innerHTML = user.fname + "'s Profile";

		document.getElementById("emailDiv").innerHTML = user.email;
		document.getElementById("fnameDiv").innerHTML = user.fname;
        document.getElementById("fnameDiv").innerHTML += " " + user.lname;
        displayReserved(user.Reserved);
        displayOutGoingReq(user.OutgoingRequests);

        
		document.getElementById("schoolDiv").innerHTML = user.school;
		if (user.isTutor){
            document.getElementById("isTutorDiv").innerHTML = "Student and tutor";
            document.getElementById("subjectDiv").innerHTML = user.Strengths;
            listAvailTime(user.AvailableTime);
            listRequestsOnTutorsProfile(user.IncomingRequests);
            var x = document.getElementById("addSubj1");
            x.style.display = "block";
            var y = document.getElementById("addSubj2");
            y.style.display = "block";
            var z = document.getElementById("addSubj3");
            z.style.display = "block";
		}
		else{
            
            document.getElementById("isTutorDiv").innerHTML = "Student";

            
            document.getElementById("prof-pg").style.marginLeft="30%";
           
		}
	}).catch(function() {
		console.error('Failed to list user info')
		// logout();
	});
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
                IncomingRequests:doc.data().IncomingRequests,
                Reserved:doc.data().Reserved,
                OutgoingRequests:doc.data().OutgoingRequests,
            };
        }
        else{
            console.log("document doesn't exist");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    
    newUser = new User(
        email, user.fname, user.lname, user.school, user.isTutor, user.Strengths, user.AvailableTime, user.IncomingRequests, user.Reserved, user.OutgoingRequests
    );
    return newUser;
};


function changeDatetimeFormat(){
    var str = document.getElementById("tutorInputDate").value;
    var d = new Date(str);
    if(d < new Date()){
        alert("Cannot choose the past date!");
        return;
    }
    // var n = d.toString();
    // year
    let yyyy = '' + d.getFullYear();
    // month
    let mm = ('0' + (d.getMonth() + 1));  // prepend 0 // +1 is because Jan is 0
    mm = mm.substr(mm.length - 2);        // take last 2 chars
    if ( mm == 01){
        mm = "Jan";
    }
    else if ( mm == 02){
        mm = "Feb";
    }
    else if ( mm == 03){
        mm = "Mar";
    }
    else if ( mm == 04){
        mm = "Apr";
    }
    else if ( mm == 05){
        mm = "May";
    }
    else if ( mm == 06){
        mm = "Jun";
    }
    else if ( mm == 07){
        mm = "Jul";
    }
    else if ( mm == 08){
        mm = "Aug";
    }
    else if ( mm == 09){
        mm = "Sep";
    }
    else if ( mm == 10){
        mm = "Oct";
    }
    else if ( mm == 11){
        mm = "Nov";
    }
    else {
        mm = "Dec";
    }
    // day
    let dd = ('0' + d.getDate());         // prepend 0
    dd = dd.substr(dd.length - 2);        // take last 2 chars
    let hh = "" + d.getHours();
    if (hh <11){
        hh = '0' + hh;
    }
    let min = "" + d.getMinutes();
    if (min === '0'){
        min = "00";
    }


    var dateAndTime = mm + " " + dd + "," + yyyy + " | " + hh + ":" + min;


    pushAvailTimeToFirestore(dateAndTime);
    
}


function configureDateInput(){
    var today = new Date();
    var dd = today.getDate() + 1;
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10){
            dd='0'+dd
        } 
    if(mm<10){
        mm='0'+mm
    } 
    today = yyyy + '-' + mm + '-' + dd + "T00:00:00";
    maxDate = yyyy+'-'+(mm+3)+'-'+dd+"T00:00:00";
    //minDate = yyyy + '-' + mm + '-'+ dd;
    minDate = today;
    document.getElementById("tutorInputDate").setAttribute("value", today);
    document.getElementById("tutorInputDate").setAttribute("max", maxDate);
    document.getElementById("tutorInputDate").setAttribute("min", minDate);
}


function displayReserved(arr){
    if(arr != undefined){
        var user = firebase.auth().currentUser;
        var currEmail = user.email;
        for(var i = 0; i < arr.length;i++){
            if(currEmail == arr[i].Email){
                var msg = "You have reserved " + arr[i].TutorEmail + " for: " +arr[i].TutorTime;
           
                var br = document.createElement("br");

                var newDiv = document.createElement('div');
                var displmsg = document.createTextNode(msg);
    
                var buttonEnd = document.createElement("button");
                var  Name = document.createTextNode("Confirm that session has taken place");
                buttonEnd.appendChild(Name);
                // buttonEnd.style.marginLeft="10%";
                buttonEnd.style.marginTop="1%";
                buttonEnd.style.marginBottom="1%";
                buttonEnd.style.background="limegreen";
                buttonEnd.style.color="";
                buttonEnd.style.border="1px solid black";
                buttonEnd.style.fontSize="60%";
    
    
                newDiv.id = "EndCourse-div" + i;
                newDiv.className = "EndCourse-div" + i;
                var parameter = arr[i];
                buttonEnd.value = "EndCourse";
                var id = newDiv.id;
                buttonEnd.onclick = (function(parameter, id){
                    return function(){
                        endCourse(parameter);
                        document.getElementById(id).remove();

                    }
                })(parameter, id);
    
                newDiv.appendChild(displmsg);
                newDiv.appendChild(buttonEnd);
                newDiv.appendChild(br);
                //append button here
    
                newDiv.style.border="1px solid black";
                newDiv.style.marginLeft="1%";
                newDiv.style.marginRight="1%";
                newDiv.style.marginTop="5%";
                newDiv.style.background="#F5F5F5";
                document.getElementById("ReservedID").appendChild(newDiv);
     
            }
            else{
                var msg = arr[i].FirstName + " " + arr[i].LastName + " (" + arr[i].Email + ") has reserved you for: " + arr[i].TutorTime;
                var br = document.createElement("br");

                var newDiv = document.createElement('div');
                var displmsg = document.createTextNode(msg);
    
                newDiv.appendChild(displmsg);
                newDiv.appendChild(br);
                //append button here
    
                newDiv.style.border="1px solid black";
                newDiv.style.marginLeft="1%";
                newDiv.style.marginRight="1%";
                newDiv.style.marginTop="5%";
                newDiv.style.background="#F5F5F5";
                document.getElementById("ReservedID").appendChild(newDiv);
            }
            
        }
    }
  
}


function listRequestsOnTutorsProfile(pendReqArr){

    if(pendReqArr != undefined){
        // var toAdd = document.createDocumentFragment();
        for(var i = 0; i < pendReqArr.length;i++){
            var req = pendReqArr[i];
            // console.log("entered loop");
            var name = req.FirstName + " " + req.LastName;
            var email = req.Email;
            var time = req.TutorTime;
            var msg = name + " (" + email + ") would like to request you for: " + time;
            // console.log(msg);
            var rejButton = document.createElement("button");
            var accButton = document.createElement("button");
            var br = document.createElement("br");

            var newDiv = document.createElement('div');
            var displmsg = document.createTextNode(msg);
            newDiv.id = 'request'+i;
            var newDivId = newDiv.id;

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
            rejButton.style.border="1px solid black";
            // rejButton.style.height="75%";
            rejButton.style.marginLeft="1%";
            rejButton.style.fontSize="50%";
            rejButton.style.marginBottom="2%";

           
            rejButton.onclick = (function(req, newDivId){
                return function(){
                    rejectReq(req);
                    document.getElementById(newDivId).remove();
                }
             })(req, newDivId);
            
            var Accept = document.createTextNode("Accept");
            accButton.appendChild(Accept);
            accButton.style.background="limegreen";
            accButton.style.width="45%";
            // rejButton.style.height="75%";
            accButton.style.fontSize="50%";
            accButton.style.border="1px solid black";

            
            accButton.onclick = (function(req, newDivId){
                return function(){
                    acceptReq(req);
                    document.getElementById(newDivId).remove();
                }
             })(req, newDivId);

            document.getElementById("tut-prof-req").appendChild(newDiv);
           
        }
        
    }
}


//Push tutor's inputted available time to the tutor's firestore
function pushAvailTimeToFirestore(availTime){
    if(availTime.includes("NaN")){
        alert("Please Enter a Valid Date!");
    }
    else{
        var db = firebase.firestore();
        var user = firebase.auth().currentUser;
        var email = user.email;
        db.collection("users").doc(email).update({
            AvailableTime: firebase.firestore.FieldValue.arrayUnion(availTime)
        });
        AddNewTime(availTime);
    }
}


function rejectReq(req){

    createTutor(req.Email).then(function(user){ //delete from student's OutgoingRequests firestore
        var db = firebase.firestore();   
        db.collection("users").doc(user.email).update({
            OutgoingRequests:firebase.firestore.FieldValue.arrayRemove(req)  
        });
    });
    createUser().
    then(function(tutor){
        var db=firebase.firestore();
        db.collection("users").doc(tutor.email).update({
            IncomingRequests:firebase.firestore.FieldValue.arrayRemove(req)
            
        });
    });
}


function acceptReq(req){
    DisplayAddedReservation(req);     
       
    createTutor(req.Email).then(function(user){ //add to student's reserved time firestore
        var db = firebase.firestore();   
        db.collection("users").doc(user.email).update({
            Reserved:firebase.firestore.FieldValue.arrayUnion(req),
            OutgoingRequests:firebase.firestore.FieldValue.arrayRemove(req)
        });
    });
    
    createUser().then(function(tutor){
        var db = firebase.firestore();
        db.collection("users").doc(tutor.email).update({
            Reserved:firebase.firestore.FieldValue.arrayUnion(req),    //add to tutor's firestore reserved field
            IncomingRequests: firebase.firestore.FieldValue.arrayRemove(req),
            AvailableTime: firebase.firestore.FieldValue.arrayRemove(req.TutorTime)
        });
    });
}

//Function to display outgoing request on students' profile
function displayOutGoingReq(arr){
    if(arr != undefined){
        for(var i = 0; i < arr.length;i++){

            var msg = "You have requested " + arr[i].TutorEmail + " for: " +arr[i].TutorTime;   
            // console.log(msg);
            var br = document.createElement("br");
            var newDiv = document.createElement('div');
            var displmsg = document.createTextNode(msg);

            newDiv.appendChild(displmsg);
            newDiv.appendChild(br);
            //append button here

            newDiv.style.border="1px solid black";
            newDiv.style.marginLeft="1%";
            newDiv.style.marginRight="1%";
            newDiv.style.marginTop="5%";
            newDiv.style.background="#F5F5F5";


            document.getElementById("OutgoingRequestsID").appendChild(newDiv);
        }
    }
}

///Student's endCourse button to end the course on both sides
function endCourse(req){

    createTutor(req.Email).then(function(user){ //delete from student's reserved time firestore
        var db = firebase.firestore();   
        db.collection("users").doc(user.email).update({
            Reserved:firebase.firestore.FieldValue.arrayRemove(req),
        });
    });

    createUser().then(function(tutor){ //delete tutor's reserved time firestore
        var db = firebase.firestore();
        db.collection("users").doc(req.TutorEmail).update({
            Reserved:firebase.firestore.FieldValue.arrayRemove(req),  

        });
    });
    // alert("You have finished your course!");

}

//fucntion to let time show immediately on the page
function AddNewTime(msg)
{

    var br = document.createElement("br");

    var newDiv = document.createElement('div');
    var displmsg = document.createTextNode(msg);
    //add remove button here 
    var button = document.createElement("button");
    var Name = "Remove";
    var parameter = msg;

    Name = document.createTextNode(Name);
    button.appendChild(Name);
    button.style.marginLeft="10%";
    button.style.marginTop="1%";
    button.style.marginBottom="1%";
    button.style.background="red";
    button.style.border="1px solid black";
    button.style.fontSize="50%";
    button.value = parameter;
    var rad=  Math.floor(Math.random() * (1000 - 1)) + 1;
    newDiv.id = "removeButton-div" + rad;
    newDiv.className = "removeButton-div" + rad;

    var id = newDiv.id;
    // console.log(button.value);
    button.onclick = (function(parameter, id){
        return function(){
            RemoveAvailFirebase(parameter, newDiv.className);
            document.getElementById(id).remove();
            
        }
    })(parameter, id);
    
    newDiv.appendChild(displmsg);
    newDiv.appendChild(button);
    newDiv.appendChild(br);
    

    newDiv.style.border="1px solid black";
    newDiv.style.marginLeft="1%";
    newDiv.style.marginRight="1%";
    newDiv.style.marginTop="5%";
    newDiv.style.background="#F5F5F5";
    
    
    document.getElementById("availTimeDiv").appendChild(newDiv);

}

function DisplayAddedReservation(req){
    var user = firebase.auth().currentUser;
    var currEmail = user.email;

    if(currEmail == req.Email){
        var msg = "You have reserved " + req.TutorEmail + " for: " + req.TutorTime;
    
        var br = document.createElement("br");

        var newDiv = document.createElement('div');
        var displmsg = document.createTextNode(msg);

        var buttonEnd = document.createElement("button");
        var  Name = document.createTextNode("Confirm that session has taken place");
        buttonEnd.appendChild(Name);
        buttonEnd.style.marginTop="1%";
        buttonEnd.style.marginBottom="1%";
        buttonEnd.style.background="limegreen";
        buttonEnd.style.color="";
        buttonEnd.style.border="1px solid black";
        buttonEnd.style.fontSize="60%";


        newDiv.id = "EndCourse-div" + i;
        newDiv.className = "EndCourse-div" + i;
        var parameter = req;
        buttonEnd.value = "EndCourse";
        var id = newDiv.id;
        buttonEnd.onclick = (function(parameter, id){
            return function(){
                endCourse(parameter);
                document.getElementById(id).remove();

            }
        })(parameter, id);

        newDiv.appendChild(displmsg);
        newDiv.appendChild(buttonEnd);
        newDiv.appendChild(br);
        //append button here

        newDiv.style.border="1px solid black";
        newDiv.style.marginLeft="1%";
        newDiv.style.marginRight="1%";
        newDiv.style.marginTop="5%";
        newDiv.style.background="#F5F5F5";
        document.getElementById("ReservedID").appendChild(newDiv);

    }
    else{
        var msg = req.FirstName + " " + req.LastName + " (" + req.Email + ") has reserved you for: " + req.TutorTime;
        var br = document.createElement("br");

        var newDiv = document.createElement('div');
        var displmsg = document.createTextNode(msg);

        newDiv.appendChild(displmsg);
        newDiv.appendChild(br);
        //append button here

        newDiv.style.border="1px solid black";
        newDiv.style.marginLeft="1%";
        newDiv.style.marginRight="1%";
        newDiv.style.marginTop="5%";
        newDiv.style.background="#F5F5F5";
        document.getElementById("ReservedID").appendChild(newDiv);
    }
        
    
}