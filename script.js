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
      "stats": elementLi.lastChild.firstChild.firstChild.classList[1]
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
  //create elements and include class
  const ListItem = document.createElement('li');
  const description = document.createElement('span');

  const btnStats = document.createElement('span');  
  btnStats.classList.add("button_li");
  const btnStatsI = document.createElement('i');
  btnStatsI.classList.add("fa-solid");  
  btnStats.appendChild(btnStatsI);  
  

  const btnRemove = document.createElement("span");
  btnRemove.classList.add("btnRemove");
  const btnRemoveI = document.createElement("i")
  btnRemoveI.classList.add("fa-solid", "fa-trash-can");
  btnRemove.appendChild(btnRemoveI);

  const divButtons = document.createElement("div");  
  divButtons.classList.add("divButtons");

  const options = [
    "fa-plus",
    "fa-hourglass-half",
    "fa-check"
  ];

  const statsColors = {
    "fa-plus": "#ebe39e",
    "fa-plus BTN": "white",

    "fa-hourglass-half": "#ccc",
    "fa-hourglass-half BTN": "yellow",

    "fa-check": "#ccc",
    "fa-check BTN": "green"
  }

  // if from cache
  console.log(task)
  if (typeof (task) == "object") {
    description.innerText = task.description;
    btnStatsI.classList.add(task.stats || 'notClass');
  } else {
    description.innerText = task;
    btnStatsI.classList.add(options[0] || 'notClass');
  }
  ListItem.classList.add(`li-${document.querySelectorAll('#task-list li').length}`);
  

  // change style with stats
  changeColor();
  function changeColor() {
    ListItem.style.backgroundColor = statsColors[btnStats.firstChild.classList[1]] || "rgb(201, 231, 130)";
    btnStats.style.backgroundColor = statsColors[btnStats.firstChild.classList[1] + " BTN"] || "rgb(201, 231, 130)";
  }

  //EVENT BUTTON - to change stats
  btnStats.addEventListener("click", (event) => {

    const btnIcon = btnStats.firstChild;
    const btnIconClass = btnIcon.classList[1];
    let atualOption = options.indexOf(btnIconClass);
    atualOption == options.length-1 ? btnIcon.classList.replace(btnIconClass, options[1]) : btnIcon.classList.replace(btnIconClass, options[atualOption+1]);    
    changeColor();
    const li = btnStats.parentNode.parentNode;
    let id = li.classList.value.replace("li-", "");
    tasks[id].stats = btnIcon.classList[1];
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

