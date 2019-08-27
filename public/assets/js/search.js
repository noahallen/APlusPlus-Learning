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
                if(doc.data().AvailableTime.length > 0){
                // console.log(doc.data().email);
                    var currUser = 
                    {
                        FirstName:doc.data().FirstName,
                        LastName:doc.data().LastName,
                        email:doc.data().email,
                    };
                    userArr.push(currUser);
                }
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
