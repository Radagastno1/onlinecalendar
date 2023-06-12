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

  let previousDate = null;

  for (const todo of todoList) {
    if(todo.date != todo.date[previousDate])
    {
      const title = document.createElement('h3'); 
      title.textContent = todo.date;
      todoUl.appendChild(title);
    }
    const li = document.createElement('li');
    li.textContent = todo.title;
    todoUl.appendChild(li);
    
    previousDate = todo.date; 
  }
  if (todoList.length == 0) {
    const li = document.createElement('li');
    li.textContent = "Det finns ingen todo än.."
    todoUl.appendChild(li);
  }
}

function saveTodo() {
  const todoTitle = document.querySelector('#todo-title-input').value;
  const todoDate = document.querySelector('#todo-date-input').value;

  const todo = {
    title: todoTitle,
    date: todoDate
  };

  todoList.push(todo);
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function getTodaysDate() {
  var today = new Date();
  today = generateDateFormat(today);
  return today;
}

function generateDateFormat(date) {

  var dd = date.getDate();

  var mm = date.getMonth() + 1;

  var yyyy = date.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }
  formatedDate = yyyy + '-' + mm + '-' + dd;
  return formatedDate;
}
