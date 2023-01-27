// Get references to the form and list elements
const form = document.querySelector("form");
const taskList = document.querySelector('ul');
const btn_clearCache = document.querySelector('.clear_list');
const btn_clearLastItem = document.querySelector('.clear_last_item');
const btn_clearFirstItem = document.querySelector('.clear_first_item');


// clear all
btn_clearCache.addEventListener("click", () => {
  localStorage.clear();
  taskList.innerHTML = "";
  tasksCount = 0;
});


// Load any existing to-dos from cache
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let tasksCount = 0;

// Render the existing to-dos to the page
tasks.forEach(task => {
  //task agora retorna como um objeto
  taskList.appendChild(createLi(task));
});

// Add a new to-do when the form is submitted
form.addEventListener('submit', event => {
  event.preventDefault();

  // Get the value of the input field
  const task = event.target.elements.task.value;
  if (task !== "") {
    const elementLi = createLi(task);

    // Add the task to the tasks array
    tasks.push([elementLi.firstChild.innerText, elementLi.lastChild.innerText]); // <===### configurar para puxar array com itens ao inves de string

    // Render the new task to the page
    taskList.appendChild(elementLi);

    // Save the tasks array to cache
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Clear the input field
    event.target.elements.task.value = '';
  }
});

// create a item List
function createLi(task) {

  const taskItem = document.createElement('li');
  taskItem.classList.add(`li-${tasksCount}`);
  tasksCount++;
  const description = document.createElement('span');
  const spanButton = document.createElement('span');
  spanButton.classList.add("button_li");

  // with cache return
  if (typeof (task) == "object") {
    description.innerText = task[0];
    spanButton.innerText = task[1];

    // change style with stats
    switch (task[1]) {
      case "Em tratativa":
        taskItem.style.backgroundColor = "#ebe39e";
        break;
      case "Feito":
        taskItem.style.backgroundColor = "#ccc";
        break;
      default:
        break;
    }
  } else {
    spanButton.innerText = "Em Tratativa";
    description.innerText = task;
  }

  // event button to stats
  spanButton.addEventListener("click", (event) => {
    const btn = event.target;
    if (btn.innerText == "Em Tratativa") {
      btn.innerText = "Feito";
      btn.parentNode.style.backgroundColor = "#ccc";
    } else {
      btn.innerText = "Em Tratativa";
      btn.parentNode.style.backgroundColor = "#ebe39e";
    }
    let id = btn.parentNode.classList.value.replace("li-", "");
    tasks[id].splice(1, 0, btn.innerText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  });
  taskItem.appendChild(description);
  taskItem.appendChild(spanButton);
  return taskItem;
}