document.addEventListener('DOMContentLoaded', main);

function main() {
  //anropar funktioner från todo
  todoList = getDataFromLS();
  addEventListeners();
  const todosUl = document.querySelector('#todo-list');
  todosUl.classList.remove('todo-reveal-list');
  
  showAddTodoForm();
  renderTodoList();
  showListOfTodos();

  //anropar funktioner från today
  presentDateAndTime();
  updateClock();
  
  //anropar funktioner från calendar.js
  initCalendar();
  
  const calendarCells = document.querySelectorAll("[data-cy='calendar-cell']");
calendarCells.forEach(calendarCell => {
  calendarCell.addEventListener('click', event => {
    filterTodoByCalendarCell(event);
  });
});

}
