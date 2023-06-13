document.addEventListener('DOMContentLoaded', main);

function main() {
  //anropar funktioner från todo
  getDataFromLS();
  addEventListeners();
  showAddTodoForm();
  renderTodoList();
  showListOfTodos();

  //anropar funktioner från today
  presentDateAndTime();
  updateClock();
}
