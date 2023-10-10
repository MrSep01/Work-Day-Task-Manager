// Document ready function to ensure jQuery executes after DOM is fully loaded
$(document).ready(function() {
  // Initialize date variables
  const currentDate = dayjs().format('YYYY-MM-DD');
  let displayedDate = currentDate;
  const lastAccessedDate = localStorage.getItem('lastAccessedDate') || "";
  
  // Check if last accessed date is different from the current date
  if (lastAccessedDate && lastAccessedDate !== currentDate) {
    // Loop through each hour from 9 to 17 (9 AM to 5 PM)
    for (let i = 9; i <= 17; i++) {
      // Retrieve event text from local storage
      const eventText = localStorage.getItem(`${displayedDate}-hour-${i}`);
      // Archive event text if it exists
      if (eventText) {
        localStorage.setItem(`archive-${lastAccessedDate}-hour-${i}`, eventText);
      }
      // Remove the old event for the current day
      localStorage.removeItem(`${displayedDate}-hour-${i}`);
    }
  }
  
  // Update 'lastAccessedDate' in local storage
  localStorage.setItem('lastAccessedDate', currentDate);
  
  // Function to display calendar
  function displayCalendar(date) {
    displayedDate = date;
    // Display the selected date at the top
    $("#currentDay").text(dayjs(date).format('MMMM D, YYYY'));
    // Clear existing calendar rows
    $(".container-lg").empty();
    
    // Generate time blocks from 9 AM to 5 PM
    for (let i = 9; i <= 17; i++) {
      // Fetch event text from local storage
      const eventText = localStorage.getItem(`${displayedDate}-hour-${i}`) || "";
      // Create DOM elements for each time block row
      const row = $('<div>').addClass('row time-block').attr('id', `hour-${i}`);
      const timeLabel = $('<div>').addClass('col-2 col-md-1 hour text-center py-3').text(`${i < 12 ? i + 'AM' : i === 12 ? i + 'PM' : (i - 12) + 'PM'}`);
      const textArea = $('<textarea>').addClass('col-8 col-md-10 description').attr('rows', '3').text(eventText);
      const saveButton = $('<button>').addClass('btn saveBtn col-2 col-md-1').html('<i class="fas fa-save"></i>');
      
      // Determine current hour and day for styling
      const currentHour = dayjs().hour();
      const currentDay = dayjs().format('YYYY-MM-DD');
      
      // Apply past, present, or future CSS classes based on time
      if (date === currentDay) {
        if (i < currentHour) row.addClass("past");
        else if (i === currentHour) row.addClass("present");
        else row.addClass("future");
      } else if (date < currentDay) {
        row.addClass("past");
      } else {
        row.addClass("future");
      }
      
      // Append elements to the row and row to the container
      row.append(timeLabel, textArea, saveButton);
      $(".container-lg").append(row);
    }
  }
  
  // Initialize the calendar with the current date
  displayCalendar(currentDate);
  
  // Event listener for save button clicks
  $(".container-lg").on('click', '.saveBtn', function() {
    // Extract hour and event text
    const hour = $(this).parent().attr("id").split("-")[1];
    const eventText = $(this).siblings(".description").val();
    // Save event text to local storage
    localStorage.setItem(`${displayedDate}-hour-${hour}`, eventText);
  });
  
  // Event listener for loading archived events
  $("#loadArchive").click(function() {
    const selectedDate = $("#archiveDate").val();
    if (selectedDate) {
      // Display calendar for the selected archived date
      displayCalendar(selectedDate);
    }
  });
});
