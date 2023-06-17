const state = {
  selectedDate: null,
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
}

function initCalendar() {
  var prevMonthButton = document.querySelector("[data-cy='prev-month']");
  var nextMonthButton = document.querySelector("[data-cy='next-month']");

  prevMonthButton.addEventListener('click', function () {
    changeMonth(-1);
  });

  nextMonthButton.addEventListener('click', function () {
    changeMonth(1);
  });

  updateCalendarCells(); // Flytta denna rad hit

  addCalendarCellListeners();
}

function addCalendarCellListeners() {
    const calendarBody = document.querySelector("[data-cy='calendar-body']");
    let selectedDate = null;
  
    calendarBody.addEventListener('click', event => {
      const cell = event.target.closest("[data-cy='calendar-cell']");
      if (cell) {
        const dayElement = cell.querySelector("[data-cy='calendar-cell-date']");
        const day = dayElement.textContent;
        const clickedDate = parseInt(day);
  
        if (selectedDate === clickedDate) {
          selectedDate = null;
          location.reload();
        } else {
          selectedDate = clickedDate;
        }
  
        const filteredTodos = getTodosForDay(state.year, state.month, selectedDate);
        renderFilteredTodoList(filteredTodos);
      }
    });
  }
  
  
// function addCalendarCellListeners() {
//     const calendarBody = document.querySelector("[data-cy='calendar-body']");
//     let selectedDate = null;
  
//     calendarBody.addEventListener('click', event => {
//       if (event.target.matches("[data-cy='calendar-cell']")) {
//         const day = event.target.querySelector("[data-cy='calendar-cell-date']").textContent;
//         const clickedDate = parseInt(day);
  
//         if (selectedDate === clickedDate) {
//           selectedDate = null;
//           location.reload();
//         } else {
//           selectedDate = clickedDate;
//           const filteredTodos = getTodosForDay(state.year, state.month, selectedDate);
//           renderFilteredTodoList(filteredTodos);
//         }
//       }
//     });
//   }
  
  

// function addCalendarCellListeners() {
//   const calendarCells = document.querySelectorAll("[data-cy='calendar-cell']");
//   calendarCells.forEach(calendarCell => {
//     calendarCell.addEventListener('click', event => {
//       filterTodoByCalendarCell(event);
//     });
//   });
// }

function changeMonth(change) {
  const { month, year } = state;

  var newDate = new Date(year, month + change, 1);
  state.month = newDate.getMonth();
  state.year = newDate.getFullYear();

  updateCalendarCells();
  updateCalendarMonthLabel();
}

function updateCalendarMonthLabel() {
  const { month, year } = state;
  const date = new Date(year, month, 1);
  var monthString = date.toLocaleString('default', { month: 'long' });
  monthString = capitalizeFirstLetter(monthString);

  const monthYearElement = document.getElementById('month-year');
  monthYearElement.textContent = monthString + ' ' + year;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getMonthNumber(month) {
  var months = [
    'januari',
    'februari',
    'mars',
    'april',
    'maj',
    'juni',
    'juli',
    'augusti',
    'september',
    'oktober',
    'november',
    'december'
  ];

  return months.indexOf(month.toLowerCase()) + 1;
}



function updateCalendarCells() {
  var calendarBody = document.querySelector("[data-cy='calendar-body']");
  calendarBody.innerHTML = '';

  const { month, year } = state;

  var currentDate = new Date();
  var currentDay = currentDate.getDate();

  var firstDayOfMonth = new Date(year, month, 1);
  var startingDay = (firstDayOfMonth.getDay() + 6) % 7;

  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var dayCounter = 1;

  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var tr = document.createElement('tr');

  var daysOfWeek = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

  for (var j = 0; j < 7; j++) {
    var th = document.createElement('th');
    th.textContent = daysOfWeek[j];
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  table.appendChild(thead);
  calendarBody.appendChild(table);

  for (var i = 0; i < 6; i++) {
    var row = document.createElement('tr');

    for (var j = 0; j < 7; j++) {
      var cell = document.createElement('td');
      cell.setAttribute('data-cy', 'calendar-cell');

      if (i === 0 && j < startingDay) {
        cell.textContent = '';
      } else if (dayCounter > daysInMonth) {
        cell.textContent = '';
      } else {
        var dateElement = document.createElement('span');
        dateElement.textContent = dayCounter;
        dateElement.setAttribute('data-cy', 'calendar-cell-date');
        cell.appendChild(dateElement);

        if (dayCounter === currentDay && month === currentDate.getMonth() && year == currentDate.getFullYear()) {
          cell.classList.add('current-day');
        }
        else
        {
          cell.classList.remove('current-day');
        }

        dayCounter++;
      }

      row.appendChild(cell);
    }

    table.appendChild(row);
  }
}

// function updateCalendarCells() {
//   const { month, year } = state;

//   const currentDate = new Date();
//   const currentDay = currentDate.getDate();

//   const firstDayOfMonth = new Date(year, month, 1);
//   const startingDay = (firstDayOfMonth.getDay() + 6) % 7;

//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   let dayCounter = 1;

//   const calendarBody = document.getElementById('calendar-body');
//   const rows = calendarBody.getElementsByTagName('tr');

//   for (let i = 0; i < rows.length; i++) {
//     const cells = rows[i].getElementsByTagName('td');

//     for (let j = 0; j < cells.length; j++) {
//       const cell = cells[j];

//       if (i === 0 && j < startingDay) {
//         cell.textContent = '';
//       } else if (dayCounter > daysInMonth) {
//         cell.textContent = '';
//       } else {
//         const dateElement = document.createElement('span');
//         dateElement.textContent = dayCounter;
//         dateElement.setAttribute('data-cy', 'calendar-cell-date');

//         // Ta bort den befintliga textnoden om den finns
//         while (cell.firstChild) {
//           cell.firstChild.remove();
//         }

//         cell.appendChild(dateElement);

//         if (
//           dayCounter === currentDay &&
//           month === currentDate.getMonth() &&
//           year === currentDate.getFullYear()
//         ) {
//           cell.classList.add('current-day');
//         }

//         dayCounter++;
//       }
//     }
//   }
// }

// function updateCalendarCells() {

//   var calendarBody = document.getElementById('calendar-body');
//   calendarBody.innerHTML = '';

//   const { month, year } = state;

//   var currentDate = new Date();
//   var currentDay = currentDate.getDate();

//   var firstDayOfMonth = new Date(year, month, 1);
//   var startingDay = (firstDayOfMonth.getDay() + 6) % 7;

//   var daysInMonth = new Date(year, month + 1, 0).getDate();
//   var dayCounter = 1;

//   var table = document.createElement('table');
//   var thead = document.createElement('thead');
//   var tr = document.createElement('tr');

//   var daysOfWeek = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

//   for (var j = 0; j < 7; j++) {
//     var th = document.createElement('th');
//     th.textContent = daysOfWeek[j];
//     tr.appendChild(th);
//   }

//   thead.appendChild(tr);
//   table.appendChild(thead);
//   calendarBody.appendChild(table);

//   for (var i = 0; i < 6; i++) {
//     var row = document.createElement('tr');

//     for (var j = 0; j < 7; j++) {
//       var cell = document.createElement('td');
//       cell.setAttribute('data-cy', 'calendar-cell');

//       if (i === 0 && j < startingDay) {
//         cell.textContent = '';
//       } else if (dayCounter > daysInMonth) {
//         cell.textContent = '';
//       } else {
//         var dateElement = document.createElement('span');
//         dateElement.textContent = dayCounter;
//         dateElement.setAttribute('data-cy', 'calendar-cell-date');
//         cell.appendChild(dateElement);

//         if (dayCounter === currentDay && month === currentDate.getMonth() && year == currentDate.getFullYear()) {
//           cell.classList.add('current-day');
//         }

//         dayCounter++;
//       }

//       row.appendChild(cell);
//     }

//     table.appendChild(row);
//   }
// }

function getTodosForDay(year, month, day) {
  var todosForDay = [];

  for (const todo of todoList) {
    var todoDate = new Date(todo.date);
    if (
      todoDate.getFullYear() === year &&
      todoDate.getMonth() === month &&
      todoDate.getDate() === day
    ) {
      todosForDay.push(todo);
    }
  }

  return todosForDay;
}


