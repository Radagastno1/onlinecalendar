// Funktion för att initialisera dagens datum och klocka
function initToday() {
  updateClock();
  setInterval(updateClock, 1000);
  // Initierar funktionen för att uppdatera klockan och ställer in en uppdateringsintervall på 1 sekund.
}

function getDateAndTime() {
    var newDate = new Date();
  
    var options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    };

    // Skapa en formatterare för datum och tid baserat på de angivna alternativen
    var dateTimeFormatter = new Intl.DateTimeFormat(undefined, options);
    var dateTime = dateTimeFormatter.format(newDate);
    var day = newDate.toLocaleDateString(undefined, { weekday: 'long' });
    var capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1); 
    var date = newDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  
    return {
      time: dateTime,
      day: capitalizedDay,
      date: date
    };
  }
  
  // Funktion för att uppdatera klockan i DOM
  function updateClock() {
    var dateTime = getDateAndTime();
    const timeElement = document.getElementById('time');
    const dayElement = document.getElementById('day');
    const dateElement = document.getElementById('date');
  
    if (timeElement !== null) {
      timeElement.textContent = dateTime.time;
    }
  
    if (dayElement !== null) {
      dayElement.textContent = dateTime.day;
    }
  
    if (dateElement !== null) {
      dateElement.textContent = dateTime.date;
    }
  }