var form = document.querySelector('form');
var newToDoInput = document.querySelector('#newToDOInput');
var addNewToDOButton = document.querySelector('#addNewToDOButton');
var updateAToDOButton = document.querySelector('#updateAToDOButton');
var allFilters = document.querySelectorAll('#filters ul li');
var ul = document.querySelector('#ToDoList ul');
var noOfOverallToDosNode = document.querySelector('#noOfOverallToDos');
var noOfCompletedToDosNode = document.querySelector('#noOfCompletedToDos');
var noOfPendingToDosNode = document.querySelector('#noOfPendingToDos');

// fetch the toDoAppData from the local storage
var allToDos = JSON.parse(localStorage.getItem('toDoAppData'));
if (allToDos == null) {
    allToDos = [];
    updateLocalStorage(); //with empty value
}
else {
    displayToDos(); //update UI
}

// update local storage data with the new data
function updateLocalStorage() {
    localStorage.setItem('toDoAppData', JSON.stringify(allToDos));
}

// disable add button when the input box is empty
newToDoInput.addEventListener('keyup', () => {
    // 
    if (newToDoInput.value.trim() == 0) {
        addNewToDOButton.classList.add('EmptyInputBox');
    }
    else {
        addNewToDOButton.classList.remove('EmptyInputBox');
    }
})


//add new to do
function addNewToDO(e) {
    e.preventDefault();
    allToDos.push({ toDo: newToDoInput.value, status: 'Pending' });
    updateLocalStorage();
    displayToDos();

    // empty the input box and disable the button
    newToDoInput.value = '';
    addNewToDOButton.classList.add('EmptyInputBox');
}
addNewToDOButton.addEventListener('click', addNewToDO);

// displaying todos using DOM
function displayToDos() {
    var selectedFilter = document.querySelector('#filters ul li.active');
    let allLis = '';
    let indexInTheSelectedFilter = 0;
    allToDos.forEach((eachToDo, index) => {
        // if the All filter is selected(li with class active)
        if (selectedFilter.textContent == 'All') {
            allLis += `<li class="${eachToDo.status}">
        <p>${eachToDo.toDo}</p><i class="fa-solid fa-ellipsis-vertical" onmouseover="toDoActionHovered(${index})" onmouseleave="toDoActionHoverLeft(${index})">
                        <div class="toDoActions">
                    <i class="fa-solid fa-pen" title="Edit" onclick="editAToDo(${index})"></i>
                    <i class="fa-solid fa-trash" title="delete" onclick="deleteAToDo(${index})"></i>
                    <i class="fa-solid fa-check" title="Completed" onclick="completedAToDo(${index})"></i>
        </div>
        </i>
        </li>`
        }

        // for Pending/Completed todos
        if (selectedFilter.textContent == eachToDo.status) {
            allLis += `<li class="${eachToDo.status}">
        <p>${eachToDo.toDo}</p><i class="fa-solid fa-ellipsis-vertical" onmouseover="toDoActionHovered(${indexInTheSelectedFilter})" onmouseleave="toDoActionHoverLeft(${indexInTheSelectedFilter})">
                        <div class="toDoActions">
                    <i class="fa-solid fa-pen" onclick="editAToDo(${index})"></i>
                    <i class="fa-solid fa-trash" onclick="deleteAToDo(${index})"></i>
                    <i class="fa-solid fa-check" onclick="completedAToDo(${index})"></i>
        </div>
        </i>
        </li>`
            indexInTheSelectedFilter++;
        }

    })
    ul.innerHTML = allLis;
    // for footer data
    countNoOfTodos();
}

function countNoOfTodos() {
    let noOfPendingTodos = 0;
    let noOfCompletedToDos = 0;
    let noOfOverallToDos = 0;
    allToDos.forEach((eachToDo) => {
        (eachToDo.status == 'Pending') ? noOfPendingTodos++ : noOfPendingTodos;
        (eachToDo.status == 'Completed') ? noOfCompletedToDos++ : noOfCompletedToDos;
    })
    noOfOverallToDos = noOfCompletedToDos + noOfPendingTodos;

    noOfCompletedToDosNode.textContent = noOfCompletedToDos;
    noOfPendingToDosNode.textContent = noOfPendingTodos;
    noOfOverallToDosNode.textContent = noOfOverallToDos;
}

// when hovered on a todo,display actions 
function toDoActionHovered(index) {
    document.querySelector('#ToDoList ul').children[index].lastElementChild.children[0].style.display = 'flex'
}
// when unhovered on a todo,hide actions
function toDoActionHoverLeft(index) {
    document.querySelector('#ToDoList ul').children[index].lastElementChild.children[0].style.display = 'none'
}


function editAToDo(index) {
    indexOfToDoToUpdate = index;
    form.classList.replace('createMode', 'editMode'); //toggle the form to editMode class(so that we can hide the add btn and display the update btn)
    newToDoInput.value = allToDos[index].toDo;//set the input box value to the todo data to be edited
}
// after clicking update button
updateAToDOButton.addEventListener('click', (e) => {
    e.preventDefault();
    allToDos[indexOfToDoToUpdate].toDo = newToDoInput.value;//update the existing todo with the new value
    updateLocalStorage();
    displayToDos();
    form.classList.replace('editMode', 'createMode');//toggle the form back to createMode

    // empty the input box and disable the button
    newToDoInput.value = '';
    addNewToDOButton.classList.add('EmptyInputBox');
})

// Event listener for a todo completed btn
function completedAToDo(index) {
    allToDos[index].status = 'Completed';
    updateLocalStorage();
    displayToDos();
}

// delete a toDo
function deleteAToDo(index) {
    allToDos.splice(index, 1);
    updateLocalStorage();
    displayToDos();
}

// delete all todo's from DELETEALL Button
var deleteAllTodosButton = document.querySelector('#deleteAllTodosButton');
deleteAllTodosButton.addEventListener('click', () => {
    allToDos = [];//empty the data array
    updateLocalStorage();// to empty local storage...
    displayToDos();//update UI
})


// filtering
function filterSelected(filterName) {
    allFilters.forEach((eachLi, index) => {
        if (eachLi.textContent == filterName) {
            eachLi.className = 'active'; //set the class as active
            displayToDos();
        }
        else {
            eachLi.classList.remove('active');//remove the other filters(li's) as active
        }
    })
}