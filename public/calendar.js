document.addEventListener('DOMContentLoaded', main);

function main() {
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
  var monthYearElement = document.querySelector("[data-cy='month-year']");
  var [month, year] = monthYearElement.textContent.split(' ');
  month = getMonthNumber(month);

  var newDate = new Date(year, month - 1 + change, 1);
  var newMonth = newDate.toLocaleString('default', { month: 'long' });
  var newYear = newDate.getFullYear();
  newMonth = capitalizeFirstLetter(newMonth);
  monthYearElement.textContent = newMonth + ' ' + newYear;

  updateCalendarCells();
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

  var monthYearElement = document.querySelector("[data-cy='month-year']");
  var [month, year] = monthYearElement.textContent.split(' ');
  month = getMonthNumber(month);

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
