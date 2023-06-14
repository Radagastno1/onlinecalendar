document.addEventListener('DOMContentLoaded', main);

let todoList = [];

function showAddTodoForm() {
  const addTodoButton = document.querySelector('#add-todo-btn');
  const addTodoForm = document.querySelector('#add-todo-form');

  addTodoButton.addEventListener('click', () => {
    addTodoForm.classList.toggle('todo-form');
  });
}

function showListOfTodos() {
  const showTodosButton = document.querySelector('#show-todos-btn');
  const todosUl = document.querySelector('#todo-list');

  showTodosButton.addEventListener('click', () => {
    todosUl.classList.toggle('todo-reveal-list');
  });
}

function addEventListeners() {
  const saveButton = document.querySelector('#save-todo-button');
  saveButton.addEventListener('click', saveTodo);

}

function getDataFromLS() {
  if (localStorage.getItem('todoList')) {
    todoList = JSON.parse(localStorage.getItem('todoList'));
  }
}

function renderTodoList() {

  const todoUl = document.querySelector('[data-cy="todo-list"]');

  todoUl.innerHTML = '';

  todoList.sort((a, b) => new Date(a.date) - new Date(b.date));

  let previousDate = null;
  if (todoList.length > 0) {
    for (const todo of todoList) {
      if (todo.date !== previousDate) {
        const title = document.createElement('h3');
        title.textContent = todo.date ?? "Laddar datum...";
        todoUl.appendChild(title);
        previousDate = todo.date;

      }
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = todo.title ?? "Laddar text...";
      link.href = '#';

      const removeButton = document.createElement('button');
      removeButton.classList.add('todo-remove-button');
      removeButton.setAttribute('data-cy', 'delete-todo-button');

      const removeIcon = document.createElement('i');
      removeIcon.classList.add('fas', 'fa-trash-alt');

      removeButton.addEventListener('click', () => {
        removeTodo(todo);
      });

      removeButton.appendChild(removeIcon);

      link.addEventListener('click', () => {
        showTodoPopup(todo);
      });

      li.appendChild(link);
      li.appendChild(removeButton);
      todoUl.appendChild(li);

      previousDate = todo.date;
    }
  }
  else {
    const textLi = document.createElement('li');
    textLi.textContent = "Det finns ingen todo än.."
    todoUl.appendChild(textLi);
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
  dateElement.textContent = todo.date ?? "Laddar datum...";

  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-window-close');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('id', 'popup-close-icon');

  const title = document.createElement('h4');
  title.classList.add('popup-title');
  title.textContent = todo.title ?? "Laddar text...";

  const removeButton = document.createElement('button');
  removeButton.classList.add('todo-remove-button');
  removeButton.setAttribute('data-cy', 'delete-todo-button');
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
  const todoTitle = document.querySelector('#title-input').value;
  const todoDate = document.querySelector('#date-input').value;

  if (todoTitle && todoDate >= getTodaysDate()) {
    const todo = {
      title: todoTitle,
      date: todoDate
    };
    todoList.push(todo);
    const startTime = performance.now();

    localStorage.setItem('todoList', JSON.stringify(todoList));
    renderTodoList();

    const todosUl = document.querySelector('#todo-list');
    todosUl.classList.add('todo-reveal-list');

    const endTime = performance.now(); 
    const totalTime = endTime - startTime; 
    console.log(`Tid för att uppdatera listan: ${totalTime} ms`);
    debugger;
  }
}


function removeTodo(todo) {
  //hittar platsen i listan där referensen till todon finns
  const indexForTodo = todoList.findIndex(t => t === todo);

  if (indexForTodo >= 0) {
    //tar bort en todo på den platsen i listan som den fanns på
    todoList.splice(indexForTodo, 1);
  }
  //sätter den nya listan i localstorage
  localStorage.setItem('todoList', JSON.stringify(todoList));

  closePopup();

  renderTodoList();

}

function closePopup() {
  const popUpDiv = document.querySelector('.popup-div');
  if (popUpDiv !== null) {
    popUpDiv.remove();
  }
}

function getTodaysDate() {
  var today = new Date();
  return today.toISOString().split('T')[0];
}

