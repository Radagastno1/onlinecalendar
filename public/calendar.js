export function updateCalendarCells() {
    var calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';

    var currentDate = new Date();
    var currentDay = currentDate.getDate();

    var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var startingDay = firstDayOfMonth.getDay();

    var daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    var dayCounter = 1;

    for (var i = 0; i < 6; i++) {
        var row = document.createElement('tr');

    }
}

// export function updateCalendarCells() {
//     var date = new Date();
//     var dayOfMonth = date.getDate();
//     var calendarCells = document.querySelectorAll('[data-cy="calendar-cell"]');

//     calendarCells.forEach(function(cell) {
//         cell.textContent = dayOfMonth.toString();
//         dayOfMonth++;
//     });

// }