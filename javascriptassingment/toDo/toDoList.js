// Getting sessionId for the user from session.
let sessionID       =   localStorage.getItem("activeSessionId");

// List of diffrent types of task.
let dueTasks        =   [];
let completedTasks  =   [];
let overdueTasks    =   [];

// Which tab is selected out of dueTask Tab, completedTask Tab, overdueTask Tab
let selectedTaskTab;

// What type of filter is applied on the tab.
let filterApplied   =   {};

// Divide task into due, completed and overdue.
function divideTasks(){
    
    let sessionObject   =   JSON.parse(localStorage.getItem(sessionID));
    let tasks           =   sessionObject.tasks;

    dueTasks        =   [];
    completedTasks  =   [];
    overdueTasks    =   [];

    for(let tasksIndex=0;tasksIndex<tasks.length;tasksIndex++){
        if(tasks[tasksIndex].markAsDone){
            completedTasks.push(tasks[tasksIndex]);
        }
        else if(tasks[tasksIndex].dueDate < todayDate()){
            overdueTasks.push(tasks[tasksIndex]);
        }
        else {
            dueTasks.push(tasks[tasksIndex]);
        }
    }

}

// getting today's date in the form of dd-mm-yyyy.
function todayDate() {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// Days left/due in the task.
function remainingDays(date){
    let day1 = new Date(todayDate()); 
    let day2 = new Date(date);

    let difference= Math.abs(day2-day1);
    days = difference/(1000 * 3600 * 24)
    return days;
}

// Displaying checkbox in front of each tasks for operation such as delete tasks.
function displayTaskCheckboxes(type){
    let checkboxes = document.querySelectorAll('input[name="' + "taskCheckbox" + '"]')
    Array.prototype.forEach.call(checkboxes, function(element) {
        element.style.display=type;
        element.checked=false;
    });
}

// Getting checked checkboxes on the basis of checkboxname.
function selectedCheckboxes(checkboxName){
    let checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked')
    let values=[];
    Array.prototype.forEach.call(checkboxes, function(element) {
        values.push(element.value);
    });
    return values;
}

// Initilization function :- Always will run when this JS file will be called.
function init(){

    if(localStorage.getItem("activeSessionId") === "null"){
        window.location.href="../index.html";
    }
    else{
        divideTasks();
        document.getElementById("selectTasksToDelete").style.display    =   'block';
        document.getElementById("cancelDelete").style.display           =   'none';
        document.getElementById("deleteTask").style.display             =   'none';
        document.getElementById("activate").click();
        document.getElementById("activate").focus();
        selectedTaskTab="Due Tasks";
        displayTaskCheckboxes('none');
        document.getElementById("dateRangeDropdown").style.display      =   'none';
        document.getElementById("categoriesDropdown").style.display     =   'none';
        document.getElementById("goSearch").style.display               =   'none';
    }
}
init();

// Applying date filter on tasks with start date as start and end date as end.
function applyDateFilter(tasks,start,end){
    return tasks.filter((task)=>{
        return (new Date(start)<=new Date(task.dueDate)) && (new Date(task.dueDate)<=new Date(end));
    });
}

// Applying category filter to filter out tasks which contains checked categories.
function applyCategoryFilter(tasks,checkedCategories){
    return tasks.filter((task)=>{
        let ans=false;
        Array.prototype.forEach.call(checkedCategories,function(val1){
            Array.prototype.forEach.call(task.categories,function(val2){
                if(val1 === val2){
                    ans=true;
                }
            })
        })
        return ans;
        // return (JSON.stringify(checkedCategories) === JSON.stringify(task.categories));
    })
}

// Displaying Due tasks programatically.
function showDueTasks(filterType,filterDetails){

    selectedTaskTab="Due Tasks";
    divideTasks();
    let dueTasksFiltered=[];
    if(filterType === undefined || filterType === "none"){
        dueTasksFiltered=dueTasks;
    }
    else if(filterType === "dateRange"){
        dueTasksFiltered    =   applyDateFilter(dueTasks,filterDetails.startDate,filterDetails.endDate);
    }
    else{
        dueTasksFiltered    =   applyCategoryFilter(dueTasks,filterDetails.checkedCategories);
    }

    let renderHTML="";
    for(let dueTaskIndex=0;dueTaskIndex<dueTasksFiltered.length;dueTaskIndex++){
        renderHTML+=' \
        <a href="./createToDoItem/createToDoItem.html?taskIdentifier='+dueTasksFiltered[dueTaskIndex].taskIdentifier+'" class="list-group-item list-group-item-action" aria-current="true"> \
            <div class="d-flex w-100 justify-content-between"> \
                <h3 class="mb-1"> \
                <label><input type="checkbox" name="taskCheckbox" value="'+dueTaskIndex+'"></label> \
                    '+dueTasksFiltered[dueTaskIndex].task+' \
                </h3> \
                <small>'+remainingDays(dueTasksFiltered[dueTaskIndex].dueDate)+' days left</small> \
            </div> \
            <p class="mb-1">'+'Categories:- '+dueTasksFiltered[dueTaskIndex].categories+'</p> \
            <small>'+'Due Date:- '+dueTasksFiltered[dueTaskIndex].dueDate+'</small> \
        </a> \
        <button class="doneBtn" onclick="markAsDone('+dueTasksFiltered[dueTaskIndex].taskIdentifier+')"><b>Done</b></button><br>\
        \
        '
        
    }
    console.log(renderHTML);
    document.getElementById("toDoItemPellete").innerHTML =renderHTML;
    displayTaskCheckboxes('none');
}

// Displaying completed tasks programatically.
function showCompletedTasks(filterType,filterDetails){
    selectedTaskTab="Completed Tasks";
    divideTasks();
    let completedTasksFiltered=[];
    if(filterType === undefined || filterType === "none"){
        completedTasksFiltered=completedTasks;
    }
    else if(filterType === "dateRange"){
        completedTasksFiltered  =   applyDateFilter(completedTasks,filterDetails.startDate,filterDetails.endDate);
    }
    else{
        completedTasksFiltered  =   applyCategoryFilter(completedTasks,filterDetails.checkedCategories);
    }

    let renderHTML="";
    for(let completedTaskIndex=0;completedTaskIndex<completedTasksFiltered.length;completedTaskIndex++){
        renderHTML+=' \
        <a href="./createToDoItem/createToDoItem.html?taskIdentifier='+completedTasksFiltered[completedTaskIndex].taskIdentifier+'" class="list-group-item list-group-item-action" aria-current="true"> \
            <div class="d-flex w-100 justify-content-between"> \
                <h3 class="mb-1"> \
                <label><input type="checkbox" name="taskCheckbox" value="'+completedTaskIndex+'"></label> \
                    '+completedTasksFiltered[completedTaskIndex].task+' \
                </h3> \
            </div> \
            <p class="mb-1">'+'Categories:- '+completedTasksFiltered[completedTaskIndex].categories+'</p> \
            <small>Completed</small> \
        </a> \
        \
        '
    }
    console.log(renderHTML);
    document.getElementById("toDoItemPellete").innerHTML =renderHTML;
    displayTaskCheckboxes('none');
}

// Displaying over due tasks programatically.
function showOverDueTasks(filterType,filterDetails){
    selectedTaskTab="Overdue Tasks";
    divideTasks();
    let overdueTasksFiltered=[];
    if(filterType === undefined || filterType === "none"){
        overdueTasksFiltered=overdueTasks;
    }
    else if(filterType === "dateRange"){
        overdueTasksFiltered    =   applyDateFilter(overdueTasks,filterDetails.startDate,filterDetails.endDate);
    }
    else{
        overdueTasksFiltered    =   applyCategoryFilter(overdueTasks,filterDetails.checkedCategories);
    }

    let renderHTML="";
    for(let overdueTaskIndex=0;overdueTaskIndex<overdueTasksFiltered.length;overdueTaskIndex++){
        renderHTML+=' \
        <a href="./createToDoItem/createToDoItem.html?taskIdentifier='+overdueTasksFiltered[overdueTaskIndex].taskIdentifier+'" class="list-group-item list-group-item-action" aria-current="true"> \
            <div class="d-flex w-100 justify-content-between"> \
                <h3 class="mb-1"> \
                <label><input type="checkbox" name="taskCheckbox" value="'+overdueTaskIndex+'"></label> \
                    '+overdueTasksFiltered[overdueTaskIndex].task+' \
                </h3> \
                <small>'+remainingDays(overdueTasksFiltered[overdueTaskIndex].dueDate)+' days due</small> \
            </div> \
            <p class="mb-1">'+'Categories:- '+overdueTasksFiltered[overdueTaskIndex].categories+'</p> \
            <small>'+'Due Date:- '+overdueTasksFiltered[overdueTaskIndex].dueDate+'</small> \
        </a> \
        <button class="doneBtn" onclick="markAsDone('+overdueTasksFiltered[overdueTaskIndex].taskIdentifier+')"><b>Done</b></button><br>\
        \
        '
    }
    console.log(renderHTML);
    document.getElementById("toDoItemPellete").innerHTML =renderHTML;
    displayTaskCheckboxes('none');
}

function selectTasksToDelete(){
    document.getElementById("selectTasksToDelete").style.display    =   'none';
    document.getElementById("cancelDelete").style.display           =   'block';
    document.getElementById("deleteTask").style.display             =   'block';
    displayTaskCheckboxes('block');
}

function cancelDelete(){
    document.getElementById("selectTasksToDelete").style.display    =   'block';
    document.getElementById("cancelDelete").style.display           =   'none';
    document.getElementById("deleteTask").style.display             =   'none';
    displayTaskCheckboxes('none');
}

function deleteTask(){

    let text="Are you sure , you want to delete the selected tasks?";
    if(confirm(text) == true){

        let selectedTasks = selectedCheckboxes("taskCheckbox");
        let taskType = selectedTaskTab;
        console.log(selectedTasks);
        if(taskType === "Due Tasks"){
            Array.prototype.forEach.call(selectedTasks, function(index) {
                delete(dueTasks[index]);
            });
        }
        else if(taskType === "Completed Tasks"){
            Array.prototype.forEach.call(selectedTasks, function(index) {
                delete(completedTasks[index]);
            });
        }
        else {
            Array.prototype.forEach.call(selectedTasks, function(index) {
                delete(overdueTasks[index]);
            });
        }

        let tasks=[];
        Array.prototype.forEach.call(dueTasks, function(value) {
            if(value !== undefined)tasks.push(value);
        });
        Array.prototype.forEach.call(completedTasks, function(value) {
            if(value !== undefined)tasks.push(value);
        });
        Array.prototype.forEach.call(overdueTasks, function(value) {
            if(value !== undefined)tasks.push(value);
        });

        let sessionObject   =   JSON.parse(localStorage.getItem(sessionID));
        sessionObject.tasks =   tasks;
        localStorage.setItem(sessionID,JSON.stringify(sessionObject));

        divideTasks();

        if(taskType === "Due Tasks")showDueTasks();
        else if(taskType === "Completed Tasks")showCompletedTasks();
        else showOverDueTasks();
    }

    cancelDelete();
}

function switchToProfile(){
    window.location.href="../profile/profile.html";
}

function logout(){
    localStorage.setItem("activeSessionId",null);
    window.location.href="../index.html?logout=true";
}

function createToDoItem(){
    window.location.href="./createToDoItem/createToDoItem.html"
}

function filterNone(){
    if(selectedTaskTab==="Due Tasks")showDueTasks("none");
    else if(selectedTaskTab==="Completed Tasks")showCompletedTasks("none")
    else showOverDueTasks("none");

    document.getElementById("dateRangeDropdown").style.display  =   'none';
    document.getElementById("goSearch").style.display           =   'none';
    document.getElementById("categoriesDropdown").style.display =   'none';
}

function filterDateRange(){
    document.getElementById("dateRangeDropdown").style.display  =   'block';
    document.getElementById("categoriesDropdown").style.display =   'none';
    document.getElementById("goSearch").style.display           =   'block';
    filterApplied.type  =   "dateRange";
    
}

function filterCategories(){
    document.getElementById("dateRangeDropdown").style.display  =   'none';
    document.getElementById("categoriesDropdown").style.display =   'block';
    document.getElementById("goSearch").style.display           =   'block';
    filterApplied.type  =   "categoryFilter";
}

function goSearch(){

    if(filterApplied.type==="dateRange"){
        let startDate   = document.getElementById("startDate").value;
        let endDate     = document.getElementById("endDate").value;
        if(startDate==="" || endDate==="")alert("Please enter start and end date");
        else if(startDate>endDate)alert("Start date should be less than end date");
        else{
            if(selectedTaskTab==="Due Tasks")showDueTasks("dateRange",{startDate:startDate,endDate:endDate});
            else if(selectedTaskTab==="Completed Tasks")showCompletedTasks("dateRange",{startDate:startDate,endDate:endDate})
            else showOverDueTasks("dateRange",{startDate:startDate,endDate:endDate});
        }
    }
    else if(filterApplied.type==="categoryFilter"){
        if(selectedTaskTab==="Due Tasks")showDueTasks("categoryFilter",{checkedCategories:selectedCheckboxes("categorFilter")});
        else if(selectedTaskTab==="Completed Tasks")showCompletedTasks("categoryFilter",{checkedCategories:selectedCheckboxes("categorFilter")});
        else showOverDueTasks("categoryFilter",{checkedCategories:selectedCheckboxes("categorFilter")});
    }
    // document.getElementById("dateRangeDropdown").style.display  =   'none';
    // document.getElementById("goSearch").style.display           =   'none';
    // document.getElementById("categoriesDropdown").style.display =   'none';
}

function markAsDone(taskIdentifier){

    let text="Are you sure , you want to mark this task as done?";
    if(confirm(text) == true){
        let sessionObject=JSON.parse(localStorage.getItem(sessionID));
        let tasks = sessionObject.tasks;
        for(let taskIndex=0;taskIndex<tasks.length;taskIndex++){
            if(tasks[taskIndex].taskIdentifier == taskIdentifier){
                tasks[taskIndex].markAsDone=true;
            }
        }
        sessionObject.tasks =   tasks;
        localStorage.setItem(sessionID,JSON.stringify(sessionObject));
    }
    init();
}

