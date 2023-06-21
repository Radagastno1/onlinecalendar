const state = {
    selectedDate: null,
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    holidays: []
}

let dayTodos = [];
let selectedDate = null;

//bygger upp kalendern
async function initCalendar() {

    state.holidays = await getHolidays(state.year, state.month + 1); // Uppdatera holidays i state
    // byter månad efter knapptryck
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


function addCalendarCellListeners() {
    const calendarBody = document.querySelector("[data-cy='calendar-body']");
     // lägger till en klick lyssnare på kalendern
    calendarBody.addEventListener('click', event => {
        const cell = event.target.closest("[data-cy='calendar-cell']");
        if (cell) {
            const dayElement = cell.querySelector("[data-cy='calendar-cell-date']");
            const day = dayElement.textContent;
            const clickedDate = parseInt(day);
            //kolla om datumet redan är klickad på
            if (selectedDate === clickedDate) {
                selectedDate = null;
                location.reload(); //ladda om sidan om datume tklickas på igen
            } else {
                selectedDate = clickedDate; // sätter det valda datumet till det klickade
            }
            //hämtar todos för det valda datumet
            const filteredTodos = getTodosForDay(state.year, state.month, selectedDate);
            //visar filtrerad todo lista
            renderTodoList(filteredTodos);
        }
    });
}

async function changeMonth(change) {
    const { month, year } = state;

    var newDate = new Date(year, month + change, 1);
    state.month = newDate.getMonth();
    state.year = newDate.getFullYear();
     // hämta heldagar för nya månaden
    state.holidays = await getHolidays(state.year, state.month + 1);

    updateCalendarCells();
    updateCalendarMonthLabel();
}
//uppdaterar månadsrubriken md den aktuella månaden och året
function updateCalendarMonthLabel() {
    const { month, year } = state;
    const date = new Date(year, month, 1);
    var monthString = date.toLocaleString('default', { month: 'long' });
    monthString = capitalizeFirstLetter(monthString);

    const monthYearElement = document.getElementById('month-year');
    monthYearElement.textContent = monthString + ' ' + year;
}
// returnerar alltid första bokstaven versal
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
//uppdaterar kalender celler
function updateCalendarCells() {
    var calendarBody = document.querySelector("[data-cy='calendar-body']");
    calendarBody.innerHTML = ''; // tömmerinnehållet på cellen

    const { month, year } = state;

    var currentDate = new Date();
    var currentDay = currentDate.getDate();
    //beräknar vilken veckodag förstad agen i månaden är
    var firstDayOfMonth = new Date(year, month, 1);
    var startingDay = (firstDayOfMonth.getDay() + 6) % 7;
    //dagarna permånad, och räknar påd agarn för en månad
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var dayCounter = 1;

    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');

    var daysOfWeek = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
     //skapar tabellen för veckodagarna
    for (var j = 0; j < 7; j++) {
        var th = document.createElement('th');
        th.textContent = daysOfWeek[j];
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    table.appendChild(thead);
    calendarBody.appendChild(table);

    const holidays = state.holidays;

    //skapar rader  för varje kalendern
    for (var i = 0; i < 6; i++) {
        var row = document.createElement('tr');

        var isEmptyRow = true;
        //sätetr celelr per rad
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
                //lägger till klassen current dat om det är dagens datum
                if (dayCounter === currentDay && month === currentDate.getMonth() && year == currentDate.getFullYear()) {
                    cell.classList.add('current-day');
                }
                else {
                    cell.classList.remove('current-day');
                }
                //lägegr till sunday-cell klass om de är en söndag
                if (j === 6) {
                    cell.classList.add('sunday-cell');
                }
                //hämtar todos för dagen
                dayTodos = getTodosForDay(state.year, state.month, dayCounter);
                //visar antalet todos per dag med en siffra
                if (dayTodos.length > 0) {
                    var todosElement = document.createElement('p');
                    todosElement.textContent = dayTodos.length;
                    todosElement.setAttribute('data-cy', 'calendar-cell-todos');
                    cell.appendChild(todosElement);
                }
                //hitta och visar helgdagen om den finns för agen
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
                 //lägger till om det är en helg dag
                if (holiday) {
                    cell.classList.add('holiday-cell');
                }

                dayCounter++;

            }

            row.appendChild(cell);
        }
         //lägger bara till raden om det finns innehåll
        if (!isEmptyRow)
            table.appendChild(row);
    }
}

//hämtar dagens todos
function getTodosForDay(year, month, day) {
    var todosForDay = [];
     //loopar igenom varje todo i todolist
    for (const todo of todoList) {
        var todoDate = new Date(todo.date);
         //kollar om todos datum matchar år,ånad och dag
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
    //skapar url för api baserat på året och månaden
    const apiUrl = `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}`;
    try {
        const response = await fetch(apiUrl);

        const data = await response.json();

         //filtrerar api datum till önskat format för helgdagar
        const holidays = data.dagar
            .filter((d) => d.helgdag) //dagen som är helgdag
            .map((d) => ({
                helgdag: d.helgdag, //sätt namnet på helgdagen
                datum: d.datum, //och datum för helgdagen
            }));
        return holidays || [];

    } catch {
        console.log(response);
        debugger;
    }
}








