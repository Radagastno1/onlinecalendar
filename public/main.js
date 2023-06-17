document.addEventListener('DOMContentLoaded', main);

function main() {
  //anropar funktioner från calendar.js
  initCalendar();

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


  //   const calendarCells = document.querySelectorAll("[data-cy='calendar-cell']");
  // calendarCells.forEach(calendarCell => {
  //   calendarCell.addEventListener('click', event => {
  //     filterTodoByCalendarCell(event);
  //   });
  // });

  // const calendarBody = document.querySelector("[data-cy='calendar-body']");
  // let isCellClicked = false;

  // calendarBody.addEventListener('click', event => {
  //   if (event.target.matches("[data-cy='calendar-cell']")) {
  //     if (isCellClicked) {
  //       location.reload();
  //     } else {
  //       filterTodoByCalendarCell(event);
  //       isCellClicked = true;
  //     }
  //   }
  // });

}
