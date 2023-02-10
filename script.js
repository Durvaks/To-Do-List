// Get references to the form and list elements
const form = document.querySelector(".form");
const taskList = document.querySelector('#task-list');
const btn_clearCache = document.querySelector('.clear_list');
const btn_clearLastItem = document.querySelector('.clear_last_item');
const btn_clearFirstItem = document.querySelector('.clear_first_item');
const btn_newList = document.querySelector('.new_list');
const btn_lists = document.querySelector('.lists');
const list_title = document.querySelector('#list_title');
const clear_all = document.querySelector('.clear_all');
let menuList = document.querySelector("#other_lists");
let lastListView = localStorage.getItem("lastlistview") || 0;
let lists = JSON.parse(localStorage.getItem('lists')) || ["new list"];
let tasks = JSON.parse(localStorage.getItem(lists[lastListView])) || [];

// Event Button - Show list of lists
btn_lists.addEventListener("click", () => {
  menuList.style.height == "auto" ? menuList.style.height = '0' : menuList.style.height = 'auto';
})
// Event Button - Create a New list
btn_newList.addEventListener("click", (event) => {
  let title = prompt("write a name with a new list");
  if (title !== "" && lists.indexOf(title)) {
    lists.push(title.toLowerCase());
    localStorage.setItem('lists', JSON.stringify(lists));
    realoadMenu();
    start()
  }else{
    alert('invalid or repeat text')
  }
})
// Event Button - clear this list // corrigir bug que fica repetindo a pergunta de confirmação
btn_clearCache.addEventListener("click", () => {
  let verify = confirm("want to remove all items from the list?");
  if (verify) {
    localStorage.removeItem(lists[lastListView]);
    lists.splice(lists.indexOf(lists[lastListView]), 1);
    if(lists.length == 0){
      lists.push("new list")
    }
    localStorage.setItem('lists', JSON.stringify(lists));
    taskList.innerHTML = "";
    lastListView = 0;
    localStorage.setItem("lastlistview", 0);
    realoadMenu();
    start()
    alert("All itens of this list as removed")
  } else {
    alert("removal canceled")
  }
});
// Event Button - Clear All
clear_all.addEventListener("click", ()=>{
  if(confirm("Clear all lists?")){
    lists = ["new list"];
    localStorage.clear();    
    start();
    realoadMenu();
    alert("All lists clear")
  }
})

start();
function start() {
  taskList.innerHTML = "";
  tasks = JSON.parse(localStorage.getItem(lists[lastListView])) || [];
// resolver a questão do lastlistview retornar um numero inexistente.
  list_title.innerText = lists[lastListView] == undefined ? "New List" : lists[lastListView];
  tasks.forEach(task => {
    taskList.appendChild(createLi(task));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const task = event.target.elements.task.value;
    const thisTime = new Date();
    if (task !== "") {
      const elementLi = createLi(task);
      tasks.push({
        "description": elementLi.firstChild.innerHTML,
        "stats": elementLi.lastChild.firstChild.firstChild.classList[1],
        "creationDate": thisTime
      });
      taskList.appendChild(elementLi);
      localStorage.setItem(lists[lastListView], JSON.stringify(tasks));
      event.target.elements.task.value = '';
    }
  });

}
realoadMenu()
function realoadMenu() {
  menuList.innerHTML = "";
  lists.forEach((listName) => {
    if (listName !== null) {
      const li = document.createElement("li");
      li.innerText = listName;
      li.addEventListener("click", (event) => {
        let choseList = li.innerText.toLowerCase();
        console.log(choseList);
        console.log(lists.indexOf(choseList))
        lastListView = lists.indexOf(choseList);
        localStorage.setItem("lastlistview", lastListView);
        taskList.innerHTML = "";
        menuList.style.height = '0'
        list_title.innerText = listName;
        start();
      })
      menuList.appendChild(li);
    }
  })
}
function createLi(task) {
  //create elements and include class
  const ListItem = document.createElement('li');
  const description = document.createElement('span');
  description.classList.add("description");
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

  const options = [ //options get icons to fontsAwesome
    "fa-plus",
    "fa-hourglass-half",
    "fa-check"
  ];

  const statsColors = {// define color of buttons of stats
    "fa-plus": "transparent",
    "fa-plus BTN": "white",

    "fa-hourglass-half": "transparent",
    "fa-hourglass-half BTN": "#FFDB58",

    "fa-check": "transparent",
    "fa-check BTN": "green"
  }

  if (typeof (task) == "object") {
    description.innerHTML = task.description;
    btnStatsI.classList.add(task.stats || 'notClass');
  } else {
    description.innerText = task;
    btnStatsI.classList.add(options[0] || 'notClass');
  }
  ListItem.classList.add(`li-${document.querySelectorAll('#task-list li').length}`);

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
    atualOption == options.length - 1 ? btnIcon.classList.replace(btnIconClass, options[1]) : btnIcon.classList.replace(btnIconClass, options[atualOption + 1]);
    changeColor();
    const li = btnStats.parentNode.parentNode;
    let id = li.classList.value.replace("li-", "");
    tasks[id].stats = btnIcon.classList[1];
    localStorage.setItem(lists[lastListView], JSON.stringify(tasks));
  });

  //EVENT BUTTON - to remove this li
  btnRemove.addEventListener("click", (event) => {
    const itemClass = ListItem.classList.value;
    const itemToRemove = document.querySelector("." + itemClass);
    const verify = confirm("want to remove this item? " + itemToRemove.firstChild.innerText);
    if (verify) {
      tasks.splice(itemClass.replace("li-", ""), 1) // remove this item to the takslist - useful for a DOM.
      itemToRemove.parentNode.removeChild(itemToRemove) // remove this li only from DOM.
      localStorage.setItem(lists[lastListView], JSON.stringify(tasks)); // update the cache.
    } else {
      alert("Item has not been removed");
    }
  })
  ListItem.appendChild(description);
  divButtons.appendChild(btnStats);
  divButtons.appendChild(btnRemove);
  ListItem.appendChild(divButtons);
  return ListItem;
}