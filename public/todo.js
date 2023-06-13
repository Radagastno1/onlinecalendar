let todoList = [];

export function showAddTodoForm() {
  const addTodoButton = document.querySelector('#add-todo-btn');
  const addTodoForm = document.querySelector('#add-todo-form');

  addTodoButton.addEventListener('click', () => {
    addTodoForm.classList.toggle('todo-reveal-form');
  });
}

export function showListOfTodos() {
  const showTodosButton = document.querySelector('#show-todos-btn');
  const todosUl = document.querySelector('#todo-list');

  showTodosButton.addEventListener('click', () => {
    todosUl.classList.toggle('todo-reveal-list');
  });
}

export function addEventListeners() {
  const saveButton = document.querySelector('#save-todo-button');
  saveButton.addEventListener('click', saveTodo);

}

export function renderTodoList() {
  const todoUl = document.querySelector('#todo-list');

  if (localStorage.getItem('todoList')) {
    todoList = JSON.parse(localStorage.getItem('todoList'));
  }

  todoUl.innerHTML = '';

  todoList.sort((a, b) => new Date(a.date) - new Date(b.date));

  let previousDate = null;

  for (const todo of todoList) {
    if (todo.date !== previousDate) {
      const title = document.createElement('h3');
      title.textContent = todo.date;
      todoUl.appendChild(title);
      previousDate = todo.date;
    }
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = todo.title;
    link.href = '#';

    link.addEventListener('click', () => {
      showTodoPopup(todo);
    });

    li.appendChild(link);
    todoUl.appendChild(li);

    previousDate = todo.date;
  }
  if (todoList.length == 0) {
    const li = document.createElement('li');
    li.textContent = "Det finns ingen todo än.."
    todoUl.appendChild(li);
  }
}

// här skapas popup med element för varje gång man klickar på todo, finns bättre sätt
// tex att ha en template i en html-fil som laddas in som mall för popup
// men detta för att öva och förstå vad man kan göra med javascript
function showTodoPopup(todo) {
  const divElement = document.createElement('div');
  divElement.classList.add('popup-div');

  const popupHeader = document.createElement('div');
  popupHeader.classList.add('popup-header');

  const dateElement = document.createElement('h3');
  dateElement.classList.add('popup-date');
  dateElement.textContent = todo.date;

  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-window-close');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('id', 'popup-close-icon');

  const title = document.createElement('h4');
  title.classList.add('popup-title');
  title.textContent = todo.title;

  const removeButton = document.createElement('button');
  removeButton.classList.add('todo-remove-button');
  removeButton.textContent = 'Ta bort';

  popupHeader.appendChild(dateElement);
  popupHeader.appendChild(icon);

  //här sätter jag de olika elementen till själva popupen
  divElement.appendChild(popupHeader);
  divElement.appendChild(title);
  divElement.appendChild(removeButton);

  removeButton.addEventListener('click', () => {
    removeTodo(todo);
  });

  //och här sätts hela popupen som barn till DOMen
  document.body.appendChild(divElement);

  //lägger eventlyssnare här för att stänga popupen
  const closePopupIcon = document.querySelector('#popup-close-icon');
  closePopupIcon.addEventListener('click', closePopup);

}

function saveTodo() {
  const todoTitle = document.querySelector('#todo-title-input').value;
  const todoDate = document.querySelector('#todo-date-input').value;

  if (todoTitle && todoDate > getTodaysDate()) {
    const todo = {
      title: todoTitle,
      date: todoDate
    };
    todoList.push(todo);
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }
  renderTodoList();
}

function removeTodo(todo){
  //hittar platsen i listan där referensen till todon finns
  const indexForTodo = todoList.findIndex(t => t === todo);

  if(indexForTodo >= 0){
    //tar bort en todo på den platsen i listan som den fanns på
    todoList.splice(indexForTodo, 1);
  }
  //sätter den nya listan i localstorage
  localStorage.setItem('todoList', JSON.stringify(todoList));

  closePopup();

  renderTodoList();

}

function closePopup(){
  const popUpDiv = document.querySelector('.popup-div');
  popUpDiv.remove();
}

function getTodaysDate() {
  var today = new Date();
  return today.toISOString().split('T')[0];
}

