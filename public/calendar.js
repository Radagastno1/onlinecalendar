
document.addEventListener('DOMContentLoaded', main);
function updateCalendarCells() {
    var calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';

    var currentDate = new Date();
    var currentDay = currentDate.getDate();

    var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var startingDay = (firstDayOfMonth.getDay() + 6) % 7;
    
    var daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    var dayCounter = 1;

    for (var i = 0; i < 6; i++) {
        var row = document.createElement('tr');

        for (var j = 0; j < 7; j++) {
            var cell = document.createElement('td');
            cell.setAttribute('data-cy', 'calendar-cell');

            if (i === 0 && j < startingDay) {
                cell.textContent = '';
            }else if (dayCounter > daysInMonth) {
                cell.textContent = '';
            }else {
                cell.textContent = dayCounter;

                if (dayCounter === currentDay) {
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
