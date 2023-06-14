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
  const storedTodoList = localStorage.getItem('todos');
  if (storedTodoList) {
    return JSON.parse(storedTodoList);
  }
  else {
    return [];
  }
}


function renderTodoList() {

  const todoUl = document.querySelector('[data-cy="todo-list"]');

  todoUl.innerHTML = '';


  let previousDate = null;
  if (todoList.length > 0) {
    todoList.sort((a, b) => new Date(a.date) - new Date(b.date));
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

      // ta bort knapp
      const removeButton = document.createElement('button');
      removeButton.classList.add('todo-remove-button');
      removeButton.setAttribute('data-cy', 'delete-todo-button');

      removeButton.addEventListener('click', () => {
        removeTodo(todo);
      });

      const removeIcon = document.createElement('i');
      removeIcon.classList.add('fas', 'fa-trash-alt');

      removeButton.appendChild(removeIcon);

      // redigera knapp

      const editButton = document.createElement('button');
      editButton.classList.add('todo-edit-button');
      editButton.setAttribute('data-cy', 'edit-todo-button');

      const editIcon = document.createElement('i');
      editIcon.classList.add('fas', 'fa-edit');

      editButton.addEventListener('click', () => {
        showTodoPopup(todo, true);
      });


      editButton.appendChild(editIcon);

      link.addEventListener('click', () => {
        showTodoPopup(todo);
      });

      li.appendChild(link);
      li.appendChild(removeButton);
      li.appendChild(editButton);
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
function showTodoPopup(todo, isEditMode) {
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

  const editButton = document.createElement('button');
  editButton.classList.add('todo-edit-button');
  editButton.setAttribute('data-cy', 'edit-todo-button');
  editButton.setAttribute('id', 'edit-button');
  editButton.textContent = 'Redigera';


  popupHeader.appendChild(dateElement);
  popupHeader.appendChild(icon);

  //här sätter jag de olika elementen till själva popupen
  divElement.appendChild(popupHeader);
  divElement.appendChild(title);
  divElement.appendChild(removeButton);
  divElement.appendChild(editButton);


  removeButton.addEventListener('click', () => {
    removeTodo(todo);
  });

  editButton.addEventListener('click', () => {
    editTodo(todo);
  });


  //och här sätts hela popupen som barn till DOMen
  document.body.appendChild(divElement);

  //lägger eventlyssnare här för att stänga popupen
  const closePopupIcon = document.querySelector('#popup-close-icon');
  closePopupIcon.addEventListener('click', closePopup);

  if (isEditMode) {
    editTodo(todo);
  }

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

    saveTodoToLS(todo);
    renderTodoList();

    const todosUl = document.querySelector('#todo-list');
    todosUl.classList.add('todo-reveal-list');
  }
}

function saveTodoToLS(todo) {
  const todos = getDataFromLS();
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTodoToLS() {
  localStorage.setItem('todos', JSON.stringify(todoList));
}

function removeTodo(todo) {
  //hittar platsen i listan där referensen till todon finns
  const indexForTodo = todoList.findIndex(t => t === todo);

  if (indexForTodo >= 0) {
    //tar bort en todo på den platsen i listan som den fanns på
    todoList.splice(indexForTodo, 1);
  }
  //sätter den nya listan i localstorage
  localStorage.setItem('todos', JSON.stringify(todoList));

  closePopup();

  renderTodoList();

}

function editTodo(todo) {

  const popupDateInput = document.createElement('input');
  // popupDateInput.add.classList('popup-date');
  popupDateInput.setAttribute('id', 'todo-date-input');
  // popupDateInput.setAttribute('data-cy', 'todo-date-input');
  popupDateInput.setAttribute('type', 'date');
  popupDateInput.value = todo.date;

  const popupTitleInput = document.createElement('input');
  // popupTitleInput.add.classList('popup-title');
  popupTitleInput.setAttribute('id', 'todo-title-input');
  // popupTitleInput.setAttribute('data-cy', 'todo-title-input');
  popupTitleInput.value = todo.title;

  const popupEditButton = document.querySelector('#edit-button');
  popupEditButton.textContent = "Spara";

  if(popupEditButton.textContent === "Spara"){
    popupEditButton.addEventListener('click', function() {
      updateTodo(todo);
      closePopup();
    });
  }  

  //hämtar elementet för titel och datum i popupen så jag kan byta ut dessa mot input-fält
  const divElement = document.querySelector('.popup-div');
  const popUpHeader = document.querySelector('.popup-header');
  const titleElement = document.querySelector('.popup-title');
  const dateElement = document.querySelector('.popup-date');

  divElement.replaceChild(popupTitleInput, titleElement);
  popUpHeader.replaceChild(popupDateInput, dateElement);


}

function updateTodo(todo) {
  const indexOfTodo = todoList.indexOf(todo);

  todoList[indexOfTodo].date = document.querySelector('#todo-date-input').value;
  todoList[indexOfTodo].title = document.querySelector('#todo-title-input').value;

  updateTodoToLS();
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

