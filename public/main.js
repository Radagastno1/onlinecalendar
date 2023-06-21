document.addEventListener('DOMContentLoaded', main);

function main() {
  todoList = getDataFromLS();
  //anropar funktioner från calendar.js
  initCalendar();

  //anropar funktioner från todo
  initTodos();

  //anropar funktioner från today
  presentDateAndTime();
  updateClock();




}
