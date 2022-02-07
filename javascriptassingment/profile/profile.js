// Getting session data for the user.
let sessionId                   =   localStorage.getItem("activeSessionId");
let sessionValueStringified     =   localStorage.getItem(sessionId);
let sessionValueObject          =   JSON.parse(sessionValueStringified);

// Initilization function :- Always will run when this JS file will be called.
function init(){

    console.log(localStorage.getItem("activeSessionId"));

    if(localStorage.getItem("activeSessionId") === "null"){
        window.location.href="../index.html";
    }
    else{
        // Populating data from the session and displaying it in the form fields.
        document.forms["profileForm"]["email"].value        =   sessionValueObject.email;
        document.forms["profileForm"]["firstName"].value    =   sessionValueObject.firstName;
        document.forms["profileForm"]["lastName"].value     =   sessionValueObject.lastName;
        document.forms["profileForm"]["gender"].value       =   sessionValueObject.gender;
        document.forms["profileForm"]["address"].value      =   sessionValueObject.address;
        document.getElementById("profilePhoto").src         =   localStorage.getItem("profileImage"+sessionId);

        // Making the form, Read only.
        document.forms["profileForm"]["email"].disabled         =   true;
        document.forms["profileForm"]["firstName"].disabled     =   true;
        document.forms["profileForm"]["lastName"].disabled      =   true;
        document.forms["profileForm"]["gender"].disabled        =   true;
        document.forms["profileForm"]["address"].disabled       =   true;
        document.forms["profileForm"]["myProfilePic"].disabled  =   true;

        document.getElementById("saveProfileBtn").style.display='none';
    }
}
init();

function editProfile(){

    // Making the form editable.
    document.forms["profileForm"]["firstName"].disabled     =   false;
    document.forms["profileForm"]["lastName"].disabled      =   false;
    document.forms["profileForm"]["gender"].disabled        =   false;
    document.forms["profileForm"]["address"].disabled       =   false;
    document.forms["profileForm"]["myProfilePic"].disabled  =   false;

    // Switching button from edit to save.
    document.getElementById("editProfileBtn").style.display =   'none';
    document.getElementById("saveProfileBtn").style.display =   'block';
}

// Saving the editted information in the session.
function saveProfile(){

    // Getting data from the form.
    sessionValueObject.firstName    =   document.forms["profileForm"]["firstName"].value;
    sessionValueObject.lastName     =   document.forms["profileForm"]["lastName"].value;
    sessionValueObject.gender       =   document.forms["profileForm"]["gender"].value;
    sessionValueObject.address      =   document.forms["profileForm"]["address"].value;

    // Setting form to read only.
    document.forms["profileForm"]["firstName"].disabled     =   true;
    document.forms["profileForm"]["lastName"].disabled      =   true;
    document.forms["profileForm"]["gender"].disabled        =   true;
    document.forms["profileForm"]["address"].disabled       =   true;
    document.forms["profileForm"]["myProfilePic"].disabled  =   true;

    // storing the data in the session.
    localStorage.setItem(sessionId,JSON.stringify(sessionValueObject));
    console.log( JSON.parse(localStorage.getItem(sessionId)) , (localStorage.getItem("activeSessionId")) );

    // Readinf the editted image from the form and saving it in the session.
    let imgPath =   document.getElementById("myProfilePic").files[0];
    let reader  =   new FileReader();
    reader.addEventListener("load",function(){
        localStorage.setItem("profileImage"+sessionId,reader.result);
        document.getElementById("profilePhoto").src=localStorage.getItem("profileImage"+sessionId);
    },false)
    if (imgPath) reader.readAsDataURL(imgPath);
    
    
    document.getElementById("editProfileBtn").style.display     =   'block';
    document.getElementById("saveProfileBtn").style.display     =   'none';
}

function switchToToDoList(){
    window.location.href    =   "./toDo/toDoList.html";
}