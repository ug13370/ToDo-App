let isSignup    =   true; // Determines whether the user is in signup mode or sign in mode.

// Initilization function :- Always will run when this JS file will be called.
function init(){
    document.getElementById("signin").style.display =   (isSignup)?'none':'block';
    document.getElementById("signup").style.display =   (isSignup)?'block':'none';
    let logoutStatus=urlParams().get('logout');
    if(logoutStatus === null){
        let emailPresence=[];
        sessionStorage.setItem("emailPresence",JSON.stringify(emailPresence));
    }
}
init();

function urlParams(){
    const queryString   = window.location.search;
    const urlParams     = new URLSearchParams(queryString);
    return urlParams;
}

// Validates email:- whether the syntax of email is correct or not
const validateEmail = (email) => {
    let isCorrectSyntax = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    
    let isNotRepeatedEmail=true;
    if(isSignup){
        let emailPresence = JSON.parse(sessionStorage.getItem("emailPresence"));
        isNotRepeatedEmail=(emailPresence.includes(email))?false:true;
    }
    return isCorrectSyntax && isNotRepeatedEmail;
};

// A hash function which will give a hash for every string.(Used to create a unique sessionId for each user.)
function stringToHash(string) {            
    var hash = 0;
    if (string.length == 0) return hash;
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

// This function will validate the entries for signup and store it in the session.
function validateSignupForm(){
    document.getElementById("signupFormValidationMessage").style.display= 'none';

    let email           =   document.forms["signupForm"]["email"].value;
    let firstName       =   document.forms["signupForm"]["firstName"].value;
    let lastName        =   document.forms["signupForm"]["lastName"].value;
    let gender          =   document.forms["signupForm"]["gender"].value;
    let address         =   document.forms["signupForm"]["address"].value;
    let password        =   document.forms["signupForm"]["password"].value;
    let repeatPassword  =   document.forms["signupForm"]["repeatPassword"].value;

    if(!validateEmail(email)){
        document.getElementById("signupFormValidationMessage").innerHTML        =   "Please enter a correct email!";
        document.getElementById("signupFormValidationMessage").style.display    =   'block';
    }
    else if(password.length<8){
        document.getElementById("signupFormValidationMessage").innerHTML        =   "Password should be 8 characters long!";
        document.getElementById("signupFormValidationMessage").style.display    =   'block';
    }
    else if(!(password === repeatPassword)){
        document.getElementById("signupFormValidationMessage").innerHTML        =   "Please correctly enter repeat password!";
        document.getElementById("signupFormValidationMessage").style.display    =   'block';
    }
    else{

        let sessionObject={
            email           :   email,
            firstName       :   firstName,
            lastName        :   lastName,
            gender          :   gender,
            address         :   address,
            password        :   password,
            repeatPassword  :   repeatPassword,
            tasks           :   []
        }

        // Making a sessionId for the current user using email and password provided
        let sessionID       =   ""+stringToHash(email+password);
        let sessionValue    =   JSON.stringify(sessionObject);

        // Storing the user details and sessionId for the user in the session
        sessionStorage.setItem(sessionID,sessionValue);
        sessionStorage.setItem("activeSessionId",sessionID);

        let emailPresence = JSON.parse(sessionStorage.getItem("emailPresence"));
        emailPresence.push(email);
        sessionStorage.setItem("emailPresence",JSON.stringify(emailPresence));

        // Reading profile image from the html and storing it in the session.
        let imgPath =   document.getElementById("myProfilePic").files[0];
        let reader  =   new FileReader();
        reader.addEventListener("load",function(){
            sessionStorage.setItem("profileImage"+sessionID,reader.result);
        },false)
        if (imgPath) reader.readAsDataURL(imgPath);

        console.log( (sessionStorage.getItem(sessionID)) , (sessionStorage.getItem("activeSessionId")) );
        window.location.href="./toDo/toDoList.html";
    }
}

// This function will validate the entries for signin and store it in the session.
function validateSigninForm(){
    document.getElementById("signinFormValidationMessage").style.display= 'none';

    let email           =   document.forms["signinForm"]["email"].value;
    let password        =   document.forms["signinForm"]["password"].value;

    if(!validateEmail(email)){
        document.getElementById("signinFormValidationMessage").innerHTML        =   "Please enter a correct email!";
        document.getElementById("signinFormValidationMessage").style.display    =   'block';
    }
    else if(password.length<8){
        document.getElementById("signinFormValidationMessage").innerHTML        =   "Password should be 8 characters long!";
        document.getElementById("signinFormValidationMessage").style.display    =   'block';
    }
    else{
        let sessionID       =   ""+stringToHash(email+password);
        let sessionValue    =   sessionStorage.getItem(sessionID);

        // Checking if the user exists in the session with the particular credentials.
        if(sessionValue === null){
            document.getElementById("signinFormValidationMessage").innerHTML        =   "Please enter correct credentials";
            document.getElementById("signinFormValidationMessage").style.display    =   'block';
        }
        else{
            sessionStorage.setItem("activeSessionId",sessionID);
            console.log( (sessionStorage.getItem(sessionID)) , (sessionStorage.getItem("activeSessionId")) );
            window.location.href="./toDo/toDoList.html";
        }
    }
}

// Switch from signup to signin and vice versa.
function switchLoggingMech(){
    isSignup=!isSignup;
    document.getElementById("signin").style.display =   (isSignup)?'none':'block';
    document.getElementById("signup").style.display =   (isSignup)?'block':'none';
}