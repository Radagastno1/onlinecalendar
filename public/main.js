document.addEventListener('DOMContentLoaded', main);

function main() {
  todoList = getDataFromLS();
  //anropar funktioner från calendar.js
  initCalendar();

  //anropar funktioner från todo
  
  addEventListeners();
  const todosUl = document.querySelector('#todo-list');
  todosUl.classList.remove('todo-reveal-list');

  showAddTodoForm();
  renderTodoList();
  showListOfTodos();

  //anropar funktioner från today
  presentDateAndTime();
  updateClock();




}
