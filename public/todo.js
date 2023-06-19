document.addEventListener('DOMContentLoaded', main);

let todoList = [];
let popupElement;

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
      link.classList.add('todo-link');

      const p = document.createElement('p');
      p.textContent = todo.date ?? "Laddar datum";
      p.classList.add('todo-date-p');

      link.textContent = p.textContent + ' ';
      link.textContent += todo.title ?? "Laddar text...";
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
        editTodoPopUp(todo);
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
    editTodoPopUp(todo);
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

  if (todoTitle && todoDate) {
    const todo = {
      title: todoTitle,
      date: todoDate
    };
    todoList.push(todo);

    saveTodoToLS(todo);
    renderTodoList();

    const todosUl = document.querySelector('#todo-list');
    todosUl.classList.add('todo-reveal-list');
    renderTodoSound();
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

  if (selectedDate !== null) {
    const filteredTodos = getTodosForDay(state.year, state.month, selectedDate);
    renderFilteredTodoList(filteredTodos);
  }
  else {
    renderTodoList();
  }
  // renderTodoList();
  updateCalendarCells();

}
//lägger en kommentar för att göra en commit 

function editTodoPopUp(todo) {

  const titleInputStatic = document.querySelector('[data-cy="todo-title-input"]');
  const dateInputStatic = document.querySelector('[data-cy="todo-date-input"]');
  const saveButtonStatic = document.querySelector('[data-cy="save-todo-button"]');

  titleInputStatic.removeAttribute('data-cy');
  dateInputStatic.removeAttribute('data-cy');
  saveButtonStatic.removeAttribute('data-cy');

  const divElement = document.createElement('div');
  divElement.classList.add('popup-div');

  const popupHeader = document.createElement('div');
  popupHeader.classList.add('popup-header');

  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-window-close');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('id', 'popup-close-icon');

  const removeButton = document.createElement('button');
  removeButton.classList.add('todo-remove-button');
  removeButton.setAttribute('data-cy', 'delete-todo-button');
  removeButton.textContent = 'Ta bort';

  const popupDateInput = document.createElement('input');
  popupDateInput.setAttribute('data-cy', 'todo-date-input');
  popupDateInput.setAttribute('type', 'date');
  popupDateInput.value = todo.date;

  const popupTitleInput = document.createElement('input');
  popupTitleInput.setAttribute('data-cy', 'todo-title-input');
  popupTitleInput.value = todo.title;

  const popupSaveButton = document.createElement('button');
  popupSaveButton.classList.add('todo-save-button');
  popupSaveButton.setAttribute('data-cy', 'save-todo-button');
  popupSaveButton.textContent = "Spara";

  removeButton.addEventListener('click', () => {
    removeTodo(todo);
  });

  popupSaveButton.addEventListener('click', () => {
    updateTodo(todo);
    closePopup();
  });

  icon.addEventListener('click', () => {
    closePopup();
  });

  popupHeader.appendChild(popupDateInput);
  popupHeader.appendChild(icon);

  //här sätter jag de olika elementen till själva popupen
  divElement.appendChild(popupHeader);
  divElement.appendChild(popupTitleInput);
  divElement.appendChild(removeButton);
  divElement.appendChild(popupSaveButton);

  document.body.appendChild(divElement);

}

function updateTodo(todo) {
  const indexOfTodo = todoList.indexOf(todo);

  const dateInputPopup = document.querySelector('.popup-div [data-cy="todo-date-input"]');
  const titleInputPopup = document.querySelector('.popup-div [data-cy="todo-title-input"]');

  todoList[indexOfTodo].date = dateInputPopup.value;
  todoList[indexOfTodo].title = titleInputPopup.value;

  //återställer attriuten från andra formuläret
  const titleInputStatic = document.querySelector('#title-input');
  const dateInputStatic = document.querySelector('#date-input');
  const saveButtonStatic = document.querySelector('#save-todo-button');
  titleInputStatic.setAttribute('data-cy', 'todo-title-input');
  dateInputStatic.setAttribute('data-cy', 'todo-date-input');
  saveButtonStatic.setAttribute('data-cy', 'save-todo-button');

  updateTodoToLS();
  renderTodoList();
}

function closePopup() {
  const popUpDiv = document.querySelector('.popup-div');
  if (popUpDiv !== null) {
    popUpDiv.remove();
  }
}

function filterTodoByCalendarCell(event) {
  const calendarCell = event.target;
  const day = calendarCell.textContent;
  const { month, year } = state;
  const adjustedMonth = month + 1; // justerar månadsvärdet sålänge då det är fel
  const date = `${year}-${adjustedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  console.log(date);
  debugger;
  // och rendera en lista med endast de todos som har det datumet
  const filteredTodos = todoList.filter(todo => todo.date === date);
  renderFilteredTodoList(filteredTodos);
}

function renderFilteredTodoList(filteredTodos) {

  const todoUl = document.querySelector('[data-cy="todo-list"]');

  todoUl.innerHTML = '';

  let previousDate = null;
  if (filteredTodos.length > 0) {
    filteredTodos.sort((a, b) => new Date(a.date) - new Date(b.date));
    for (const todo of filteredTodos) {
      if (todo.date !== previousDate) {
        const title = document.createElement('h3');
        title.textContent = todo.date ?? "Laddar datum...";
        todoUl.appendChild(title);
        previousDate = todo.date;

      }
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.classList.add('todo-link');

      const p = document.createElement('p');
      p.textContent = todo.date ?? "Laddar datum";
      p.classList.add('todo-date-p');

      link.textContent = p.textContent + ' ';
      link.textContent += todo.title ?? "Laddar text...";
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
        editTodoPopUp(todo);
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

function getTodaysDate() {
  var today = new Date();
  return today.toISOString().split('T')[0];
}

function renderTodoSound() {
  // en ljudfil skapas som säger "you added a new todo"
  var speak = new SpeechSynthesisUtterance('you added a new too doo');
  speak.voiceURI = 'Google US English';
  speak.lang = 'en-US';
  speak.rate = 0.8;
  speechSynthesis.speak(speak);

  //exportera till audiofil
  speak.onend = function (event) {
    var blob = new Blob([new Uint8Array(speak.wav)]);
    var url = URL.createObjectURL(blob);
    var audio = new Audio(url);
    audio.play();  //här spelas den upp
  };
}