// If the create ToDo form is in edit/read mode or creation mode. 
let editMode    =   false;

// Getting session Id from the session for the user data.
let sessionId   =   sessionStorage.getItem("activeSessionId");

// Initilization function :- Always will run when this JS file will be called.
function init(){

    // Getting task Id from the URL
    let taskIdentifier = urlParams().get('taskIdentifier');

    document.forms["toDoForm"]["reminderDate"].style.display            =   'none';
    document.getElementById("reminderDateLabel").style.display          =   'none';
    document.getElementById("ToDoItemValidationMessage").style.display  =   'none';
    document.getElementById("saveToDoBtn").style.display                =   'none';

    // If the taskIdentifier is not null , that means URL contains taskIdentifier , which means form is in edit/read mode.
    if(taskIdentifier !== null){
        editMode=true;
        document.getElementById("editToDoBtn").style.display    =   'block';
        document.getElementById("createToDoBtn").style.display  =   'none';

        populateEntries();
        disableEntries(true);
    }
    else{
        document.getElementById("editToDoBtn").style.display        =   'none';
        document.getElementById("createToDoBtn").style.display      =   'block';
    }

    // Display task image if the user is in edit/read mode.
    if(editMode)
        document.getElementById("toDoImageDisplay").src =   sessionStorage.getItem("toDoImage"+taskIdentifier);
}
init();

// Form will be in read mode or edit mode will be handled by this function.
function disableEntries(status){

    document.forms["toDoForm"]["task"].disabled         =   status;
    document.forms["toDoForm"]["dueDate"].disabled      =   status;
    diasbleCategories("category",status);
    document.getElementById("reminder").disabled        =   status;
    document.forms["toDoForm"]["reminderDate"].disabled =   status;
    document.getElementById("toDoDone").disabled        =   status;
    document.getElementById("toDoImage").disabled       =   status;

}

// Populating entries into the form from the session. 
function populateEntries(){
    let taskIdentifier  = urlParams().get('taskIdentifier');
    let task            = getTaskByTaskIdentifier(taskIdentifier);
    
    document.forms["toDoForm"]["task"].value    =   task.task;
    document.forms["toDoForm"]["dueDate"].value =   task.dueDate;
    checkCategories("category",task.categories);
    if(task.reminderDate !== ""){
        document.getElementById("reminder").checked         =   true;
        addReminder();
        document.forms["toDoForm"]["reminderDate"].value    =   task.reminderDate;
    }
    if(task.markAsDone){
        document.getElementById("toDoDone").checked =   true;
    }

    console.log(task);
}

// Save the ditted task into the session.
function saveEditedTask(taskIdentifier,editedTask){
    let sessionObject=getSessionObject();
    let tasks = sessionObject.tasks;
    for(let taskIndex=0;taskIndex<tasks.length;taskIndex++){
        if(tasks[taskIndex].taskIdentifier == taskIdentifier){
            tasks[taskIndex]=editedTask;
        }
    }
    sessionObject.tasks =   tasks;
    sessionStorage.setItem(sessionId,JSON.stringify(sessionObject));

}

// Getting a particular task by its taskIdentifier from the session.
function getTaskByTaskIdentifier(taskIdentifier){
    let sessionObject   =   getSessionObject();
    let tasks           =   sessionObject.tasks;
    let particularTask;
    Array.prototype.forEach.call(tasks, function(task) {
        if(task.taskIdentifier == taskIdentifier){
            particularTask  =   task;
            return;
        }
    });
    return particularTask;
}

// Return URL parameters.
function urlParams(){
    const queryString   = window.location.search;
    const urlParams     = new URLSearchParams(queryString);
    return urlParams;
}

function getSessionObject(){
    return JSON.parse(sessionStorage.getItem(sessionId));
}

// Adding a reminder toggle into the form.
function addReminder(){

    if(document.getElementById("reminderDateLabel").style.display === 'none'){
        document.forms["toDoForm"]["reminderDate"].style.display    =   'block';
        document.getElementById("reminderDateLabel").style.display  =   'block';
    }
    else {
        document.forms["toDoForm"]["reminderDate"].style.display    =   'none';
        document.getElementById("reminderDateLabel").style.display  =   'none';
    }
}

// Categories will be in read mode or edit mode will be handled by this function.
function diasbleCategories(checkboxName,status){
    let checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]')
    Array.prototype.forEach.call(checkboxes, function(el) {
        el.disabled=status
    });
}

// Getting checked checkboxes on the basis of checkboxname.
function getCheckedCategories(checkboxName) {
    let checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked')
    let values = [];
    Array.prototype.forEach.call(checkboxes, function(el) {
        values.push(el.value);
    });
    return values;
}

// Checking checkboxes programatically.
function checkCategories(checkboxName,checkboxesToBeChecked){
    let checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]')
    Array.prototype.forEach.call(checkboxes, function(el) {
        if(checkboxesToBeChecked.indexOf(el.value) !==-1)
            el.checked = true;
    });
}

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

// Getting entries from the form and saving it in the session to create a new ToDo Item.
function createToDo(){

    document.getElementById("ToDoItemValidationMessage").style.display='none';

    let newTask={};
    newTask.task            =   document.forms["toDoForm"]["task"].value;
    newTask.dueDate         =   document.forms["toDoForm"]["dueDate"].value;
    newTask.reminderDate    =   document.forms["toDoForm"]["reminderDate"].value;
    newTask.categories      =   getCheckedCategories("category");
    newTask.markAsDone      =   (getCheckedCategories("toDoDone").length === 0)?false:true;

    if(newTask.task === ""){
        document.getElementById("ToDoItemValidationMessage").style.display  =   'block';
        document.getElementById("ToDoItemValidationMessage").innerHTML      =   "Please enter the task";
    }
    else if(newTask.dueDate === ""){
        document.getElementById("ToDoItemValidationMessage").style.display  =   'block';
        document.getElementById("ToDoItemValidationMessage").innerHTML      =   "Please enter a due date for the task";
    }
    else if(newTask.categories.length === 0){
        document.getElementById("ToDoItemValidationMessage").style.display  =   'block';
        document.getElementById("ToDoItemValidationMessage").innerHTML      =   "Please select a category";
    }
    else{
        let sessionId           =   sessionStorage.getItem("activeSessionId");
        let sessionObject       =   JSON.parse(sessionStorage.getItem(sessionId));
        newTask.taskIdentifier  =   stringToHash(""+newTask.task+newTask.dueDate+sessionObject.email+sessionObject.password);
        sessionObject.tasks.push(newTask);
        sessionStorage.setItem(sessionId,JSON.stringify(sessionObject));

        // Reading the task image from the form and saving it in the session.
        let imgPath =   document.getElementById("toDoImage").files[0];
        let reader  =   new FileReader();
        reader.addEventListener("load",function(){
            sessionStorage.setItem("toDoImage"+newTask.taskIdentifier,reader.result);
            document.getElementById("toDoImageDisplay").src=sessionStorage.getItem("toDoImage"+newTask.taskIdentifier);
        },false)
        if (imgPath) reader.readAsDataURL(imgPath);

        window.location.href="../toDoList.html";
    }
}

function editToDo(){
    disableEntries(false);
    document.getElementById("saveToDoBtn").style.display        =   'block';
    document.getElementById("editToDoBtn").style.display        =   'none';
    document.getElementById("toDoImageDisplay").style.display   =   'none';
}

function saveToDo(){
    document.getElementById("ToDoItemValidationMessage").style.display  =   'none';
    let taskIdentifier = urlParams().get('taskIdentifier');

    let newTask={};
    newTask.task            =   document.forms["toDoForm"]["task"].value;
    newTask.dueDate         =   document.forms["toDoForm"]["dueDate"].value;
    newTask.reminderDate    =   (getCheckedCategories("reminder").length === 0)?"":document.forms["toDoForm"]["reminderDate"].value;
    newTask.categories      =   getCheckedCategories("category");
    newTask.markAsDone      =   (getCheckedCategories("toDoDone").length === 0)?false:true;

    if(newTask.task === ""){
        document.getElementById("ToDoItemValidationMessage").style.display  =   'block';
        document.getElementById("ToDoItemValidationMessage").innerHTML      =   "Please enter the task";
    }
    else if(newTask.dueDate === ""){
        document.getElementById("ToDoItemValidationMessage").style.display  =   'block';
        document.getElementById("ToDoItemValidationMessage").innerHTML      =   "Please enter a due date for the task";
    }
    else{
        newTask.taskIdentifier=taskIdentifier;
        saveEditedTask(taskIdentifier,newTask)

        let imgPath     =   document.getElementById("toDoImage").files[0];
        let reader      =   new FileReader();
        reader.addEventListener("load",function(){
        sessionStorage.setItem("toDoImage"+newTask.taskIdentifier,reader.result);
        document.getElementById("toDoImageDisplay").src=sessionStorage.getItem("toDoImage"+taskIdentifier);
        },false)
        if (imgPath) reader.readAsDataURL(imgPath);

        window.location.href    =   "../toDoList.html";
    }
}

function cancelCreateToDo(){
    window.location.href    =   "../toDoList.html";
}