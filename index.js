
const globalState = {
    data: [
        // {
        //     id: 1,
        //     task: "Example task.",
        //     status: true,
        // }
    ]
};

let taskIdGlobal;
let isUpdate = false;

const inputTaskEl = document.getElementById("inputTask");
const inputBtnEl = document.getElementById("inputBtn");
const contentBoxEl = document.querySelector(".task-container");
const contentEl = document.querySelector(".task-box");

const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(globalState.data));
};

const loadFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        globalState.data = JSON.parse(savedTasks);
    }
};

const renderTask = () => {
    const taskContainerEl = document.querySelector(".task-container");
    taskContainerEl.innerHTML = '';

    const taskData = globalState.data;

    taskData.forEach((data) =>{

        const {id, task, status} = data;
        const taskEl = `<div class="task-box" id="${id}">
                        <div class="task ${status ? '' : 'checked' }" onclick="checkTask(${id})">
                            <img src="./assets/${status ? 'unchecked' : 'checked'}.png">
                            <p>${task}</p>
                        </div>
                        <div class="activity">
                            <img onclick="updateHandler(${id})" src="./assets/edit.png">
                            <img onclick="deleteHandler(${id})" src="./assets/delete.png">
                        </div>
                    </div>`;
                    
        taskContainerEl.insertAdjacentHTML('beforeend', taskEl);
    });
};

const generateTask = (event) => {

    event.preventDefault();

    const task = inputTaskEl.value;

    if (task.trim() === '') {
        Toastify({
            text: "Task cannot be empty!",
            className: "info",
            position: "center",
            style: {
              background: "linear-gradient(to right, #6D1475, #CC25DB)",
            }
          }).showToast();
        return;
    }

    const taskCreate = {
        id: isUpdate ? taskIdGlobal : Math.floor(Math.random() * 1000),
        task: task,
        status: isUpdate? globalState.data.find(task => task.id === taskIdGlobal).status : true,
       };

    if(isUpdate){
        const taskIndex = globalState.data.findIndex((task) => (task.id === taskIdGlobal));

        globalState.data[taskIndex] = taskCreate;

        isUpdate = false;
        taskIdGlobal = null;
        inputBtnEl.innerText = 'Add Task';

    }
    else{
        globalState.data.push(taskCreate);
    }

    inputTaskEl.value = '';
    renderTask();
    saveToLocalStorage();
};


const checkTask = (id) =>{

    const taskIndex = globalState.data.findIndex((task) => (task.id === id));
    globalState.data[taskIndex].status = !globalState.data[taskIndex].status;

    renderTask();
    saveToLocalStorage();
};

const deleteHandler = (id) =>{
    const filteredTask = globalState.data.filter((task) => (task.id !== id));
    globalState.data = filteredTask;

    if (taskIdGlobal === id) {
        isUpdate = false;
        taskIdGlobal = null;
        inputTaskEl.value = '';
        inputBtnEl.innerText = 'Add Task';
    }

    renderTask();
    saveToLocalStorage();
};

const updateHandler = (id) => {

    const updateTask = globalState.data.find((task) => (task.id === id));
    const {task} = updateTask;

    inputTaskEl.value = task;
    taskIdGlobal = id;
    isUpdate = true;
    inputBtnEl.innerText = 'Update';
};


loadFromLocalStorage();
renderTask();
inputBtnEl.addEventListener("click", generateTask);