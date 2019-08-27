/*------------------------------Registration Code ------------------------------*/
function initialize(){
    firebase.initializeApp(firebaseConfig);
}


//Pushes a User's registration data to firebase
function pushToFireStore(){
    
    var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    var email = user.email;
    if (document.getElementById("fname").value == "" || document.getElementById("lname").value == ""){
        alert("Please fill in all fields");
        return;
    }
    db.collection("users").doc(email).set({
        FirstName: document.getElementById("fname").value,
        LastName: document.getElementById("lname").value,
        email: email,
        school: document.getElementById("school").value,
        isTutor: document.getElementById("isTutor").checked,
        AvailableTime:[],
        IncomingRequests:[],
        OutgoingRequests:[],
        Reserved:[],
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