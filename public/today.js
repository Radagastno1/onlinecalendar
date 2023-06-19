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
  
  setInterval(updateClock, 1000);
  
  updateClock();
  