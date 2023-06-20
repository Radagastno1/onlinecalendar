const state = {
    selectedDate: null,
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    holidays: []
}

async function initCalendar() {

    state.holidays = await getHolidays(state.year, state.month + 1); // Uppdatera holidays i state

    var prevMonthButton = document.querySelector("[data-cy='prev-month']");
    var nextMonthButton = document.querySelector("[data-cy='next-month']");

    prevMonthButton.addEventListener('click', function () {
        changeMonth(-1);
    });

    nextMonthButton.addEventListener('click', function () {
        changeMonth(1);
    });

    updateCalendarCells();
    addCalendarCellListeners();

}
let dayTodos = [];
let selectedDate = null;

function addCalendarCellListeners() {
    const calendarBody = document.querySelector("[data-cy='calendar-body']");

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

async function changeMonth(change) {
    const { month, year } = state;

    var newDate = new Date(year, month + change, 1);
    state.month = newDate.getMonth();
    state.year = newDate.getFullYear();

    state.holidays = await getHolidays(state.year, state.month + 1); 

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

    const holidays = state.holidays;


    for (var i = 0; i < 6; i++) {
        var row = document.createElement('tr');

        var isEmptyRow = true;

        for (var j = 0; j < 7; j++) {
            var cell = document.createElement('td');
            cell.setAttribute('data-cy', 'calendar-cell');

            if (i === 0 && j < startingDay) {
                cell.textContent = '';
            } else if (dayCounter > daysInMonth) {
                cell.textContent = '';
            } else {
                isEmptyRow = false;
                var dateElement = document.createElement('span');
                dateElement.textContent = dayCounter;
                dateElement.setAttribute('data-cy', 'calendar-cell-date');
                cell.appendChild(dateElement);

                if (dayCounter === currentDay && month === currentDate.getMonth() && year == currentDate.getFullYear()) {
                    cell.classList.add('current-day');
                }
                else {
                    cell.classList.remove('current-day');
                }

                if (j === 6) {
                    cell.classList.add('sunday-cell');
                }

                dayTodos = getTodosForDay(state.year, state.month, dayCounter);
        
                if (dayTodos.length > 0) {
                    var todosElement = document.createElement('p');
                    todosElement.textContent = dayTodos.length;
                    todosElement.setAttribute('data-cy', 'calendar-cell-todos');
                    cell.appendChild(todosElement);
                }

                const holiday = holidays.find((holiday) => {
                    return holiday.datum === `${year}-${(month + 1).toString().padStart(2, '0')}-${dayCounter.toString().padStart(2, '0')}`;
                });


                if (holiday) {
                    var holidayElement = document.createElement('p');
                    holidayElement.textContent = holiday.helgdag;
                    holidayElement.setAttribute('data-cy', 'calendar-cell-holiday');
                    holidayElement.classList.add('holiday');
                    cell.appendChild(holidayElement);
                }
                if (holiday) {
                    cell.classList.add('holiday-cell');
                }

                dayCounter++;

            }

            row.appendChild(cell);
        }

        if (!isEmptyRow)
            table.appendChild(row);
    }
}

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
    return todosForDay || [];
}

async function getHolidays(year, month) {
    const apiUrl = `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`;
    try {
        const response = await fetch(apiUrl);

        const data = await response.json();

        const holidays = data.dagar
            .filter((d) => d.helgdag)
            .map((d) => ({
                helgdag: d.helgdag,
                datum: d.datum,
            }));
        return holidays || [];

    } catch {
        console.log(response);
        debugger;
    }
}








