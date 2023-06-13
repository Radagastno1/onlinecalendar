document.addEventListener('DOMContentLoaded', main);

function main() {
  //anropar funktioner från todo
  getDataFromLS();
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
