const state = {
  selectedDate: null,
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
}

function initCalendar() {
  var prevMonthButton = document.querySelector("[data-cy='prev-month']");
  var nextMonthButton = document.querySelector("[data-cy='next-month']");

  prevMonthButton.addEventListener('click', function() {
    changeMonth(-1);
  });

  nextMonthButton.addEventListener('click', function() {
    changeMonth(1);
  });

  updateCalendarCells();
}

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
  const date = new Date(year, month, 0);
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
  var calendarBody = document.getElementById('calendar-body');
  calendarBody.innerHTML = '';

  const { month, year } = state;

  var currentDate = new Date();
  var currentDay = currentDate.getDate();

  var firstDayOfMonth = new Date(year, month - 1, 1);
  var startingDay = (firstDayOfMonth.getDay() + 6) % 7;

  var daysInMonth = new Date(year, month, 0).getDate();
  var dayCounter = 1;

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
        cell.textContent = dayCounter;

        if (dayCounter === currentDay && month === currentDate.getMonth() + 1 && year == currentDate.getFullYear()) {
          cell.classList.add('current-day');
        }

        dayCounter++;
      }

      cell.classList.add('data-cy', 'calendar-cell-date');
      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
}
