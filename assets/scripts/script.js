$(document).ready(function() {
    const currentDate = dayjs().format('YYYY-MM-DD');
    let displayedDate = currentDate;
    const lastAccessedDate = localStorage.getItem('lastAccessedDate') || "";
  
    if (lastAccessedDate && lastAccessedDate !== currentDate) {
      for (let i = 9; i <= 17; i++) {
        const eventText = localStorage.getItem(`${displayedDate}-hour-${i}`);
        if (eventText) {
          localStorage.setItem(`archive-${lastAccessedDate}-hour-${i}`, eventText);
        }
        localStorage.removeItem(`${displayedDate}-hour-${i}`);
      }
    }
  
    localStorage.setItem('lastAccessedDate', currentDate);
  
    function displayCalendar(date) {
      displayedDate = date;
      $("#currentDay").text(dayjs(date).format('MMMM D, YYYY'));
      $(".container-lg").empty();
      
      for (let i = 9; i <= 17; i++) {
        const eventText = localStorage.getItem(`${displayedDate}-hour-${i}`) || "";
        const row = $('<div>').addClass('row time-block').attr('id', `hour-${i}`);
        const timeLabel = $('<div>').addClass('col-2 col-md-1 hour text-center py-3').text(`${i < 12 ? i + 'AM' : i === 12 ? i + 'PM' : (i - 12) + 'PM'}`);
        const textArea = $('<textarea>').addClass('col-8 col-md-10 description').attr('rows', '3').text(eventText);
        const saveButton = $('<button>').addClass('btn saveBtn col-2 col-md-1').html('<i class="fas fa-save"></i>');
        const currentHour = dayjs().hour();

  const currentDay = dayjs().format('YYYY-MM-DD');
  
  if (date === currentDay) {
    if (i < currentHour) {
      row.addClass("past");
    } else if (i === currentHour) {
      row.addClass("present");
    } else {
      row.addClass("future");
    }
  } else if (date < currentDay) {
    row.addClass("past");
  } else {
    row.addClass("future");
  }
  
        row.append(timeLabel, textArea, saveButton);
        $(".container-lg").append(row);
      }
    }
  
    displayCalendar(currentDate);
  
    $(".container-lg").on('click', '.saveBtn', function() {
      const hour = $(this).parent().attr("id").split("-")[1];
      const eventText = $(this).siblings(".description").val();
      localStorage.setItem(`${displayedDate}-hour-${hour}`, eventText);
    });
  
    
    $("#loadArchive").click(function() {
      const selectedDate = $("#archiveDate").val();
      if (selectedDate) {
        displayCalendar(selectedDate);
      }
    });
  });
  