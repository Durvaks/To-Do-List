// Get references to the form and list elements
const form = document.querySelector("form");
const taskList = document.querySelector('ul');
const btn_clearCache = document.querySelector('.clear_list');
const btn_clearLastItem = document.querySelector('.clear_last_item');
const btn_clearFirstItem = document.querySelector('.clear_first_item');


// Load any existing to-dos from cache
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


// Render the existing to-dos to the page
tasks.forEach(task => {
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
    tasks.push({
      "description": elementLi.firstChild.innerText,
      "stats": elementLi.lastChild.firstChild.innerText
    });

    // Render the new task to the page
    taskList.appendChild(elementLi);

    // Save the tasks array to cache
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Clear the input field
    event.target.elements.task.value = '';
  }
});

// EVENT BUTTON - clear all
btn_clearCache.addEventListener("click", () => {
  localStorage.clear();
  taskList.innerHTML = "";
});

// ######  FUNCTION - create a item List  #######
function createLi(task) {

  const ListItem = document.createElement('li');
  const description = document.createElement('span');
  const btnStats = document.createElement('span');
  btnStats.classList.add("button_li");
  const btnRemove = document.createElement("span");
  btnRemove.classList.add("btnRemove");
  btnRemove.innerText = "X";
  const divButtons = document.createElement("div");
  divButtons.classList.add("divButtons");

  const options = [
    "novo item",
    "pendente",
    "feito"
  ];

  const statsColors = {
    "novo item": "#ebe39e",
    "novo item BTN": "white",

    "pendente": "#ccc",
    "pendente BTN": "yellow",

    "feito": "#ccc",
    "feito BTN": "green"
  }

  // if from cache
  if (typeof (task) == "object") {
    description.innerText = task.description;
    btnStats.innerText = task.stats;

  } else {
    description.innerText = task;
    btnStats.innerText = options[0];
  }
  ListItem.classList.add(`li-${document.querySelectorAll('#task-list li').length}`);

  // change style with stats
  changeColor();
  function changeColor() {
    ListItem.style.backgroundColor = statsColors[btnStats.innerText.toLowerCase()] || "rgb(201, 231, 130)";
    btnStats.style.backgroundColor = statsColors[btnStats.innerText.toLowerCase() + " BTN"] || "rgb(201, 231, 130)";
  }

  //EVENT BUTTON - to change stats
  btnStats.addEventListener("click", (event) => {

    const btn = event.target;
    let atualOption = options.indexOf(btn.innerText.toLowerCase())
    atualOption == options.length-1 ? btn.innerText = options[1] : btn.innerText = options[atualOption+1];

    changeColor();

    const li = event.target.parentNode.parentNode;
    let id = li.classList.value.replace("li-", "");
    tasks[id].stats = btn.innerText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  });


  //EVENT BUTTON - to remove this li
  btnRemove.addEventListener("click", (event) => {
    const itemClass = ListItem.classList.value;
    const itemToRemove = document.querySelector("." + itemClass);
    const verify = confirm("Deseja excluir o item: " + itemToRemove.firstChild.innerText);

    if (verify) {
      tasks.splice(itemClass.replace("li-", ""), 1) // remove this item to the takslist - useful for a DOM.
      itemToRemove.parentNode.removeChild(itemToRemove) // remove this li only from DOM.
      localStorage.setItem('tasks', JSON.stringify(tasks)); // update the cache.

    } else {
      alert("Item não foi removido");
    }

  })

  ListItem.appendChild(description);
  divButtons.appendChild(btnStats);
  divButtons.appendChild(btnRemove);
  ListItem.appendChild(divButtons);

  return ListItem;
}

