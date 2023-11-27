document.addEventListener('DOMContentLoaded', main);

function main() {
  todoList = getDataFromLS();

  initCalendar();

  initTodos();

  initToday();
}
