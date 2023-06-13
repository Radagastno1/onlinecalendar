function presentDateAndTime() {
    var newDate = new Date();
  
    var options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    };
  
    var dateTimeFormatter = new Intl.DateTimeFormat(undefined, options);
    var dateTime = dateTimeFormatter.format(newDate);
    var day = newDate.toLocaleDateString(undefined, { weekday: 'long' });
    var capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1); // Första bokstaven stor
    var date = newDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  
    return {
      time: dateTime,
      day: capitalizedDay,
      date: date
    };
  }
  
  function updateClock() {
    var dateTime = presentDateAndTime();
    document.getElementById('time').textContent = dateTime.time;
    document.getElementById('day').textContent = dateTime.day;
    document.getElementById('date').textContent = dateTime.date;
  }
  
  // Uppdatera klockan varje sekund
  setInterval(updateClock, 1000);
  
  // Uppdatera klockan direkt vid laddning av sidan
  updateClock();
  