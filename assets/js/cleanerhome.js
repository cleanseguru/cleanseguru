let calendar = null;
document.addEventListener("DOMContentLoaded", function () {
  loadfooter(document);

  InitCalender();
  fetch("/pages/home/cleanersprofile.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("profilebody").outerHTML = data;
    });

  var select = document.getElementById("profit-an-hour");
  var cedi = "&#8373;";
  for (var i = 5; i <= 50; i += 5) {
    option = document.createElement("option");
    option.value = i;
    option.innerHTML = `${cedi} ${i}`;
    select.options.add(option);
  }
});

function InitCalender() {
  var Calendar = tui.Calendar;
  var newcalendar = new Calendar("#calendar", {
    defaultView: "month",
    useCreationPopup: true,
    useDetailPopup: true,
    isReadOnly: true,
    usageStatistics: false,
    calendars: [
      {
        id: "1",
        name: "My Calendar",
        color: "white",
        borderColor: "blue",
        backgroundColor: "rgba(38, 0, 255, 0.64)",
      },
    ],
  });

  newcalendar.createEvents([
    {
      id: "event1",
      calendarId: "1",
      title: "Weekly meeting",
      start: new Date(2025, 2, 19, 9, 0, 0),
      end: new Date(2025, 2, 30, 10, 0, 0),
    },
  ]);
  calendar = newcalendar;

  document.getElementById("prev-btn").addEventListener("click", function () {
    calendar.prev(); // Move to previous month
    updateMonth();
  });

  document.getElementById("next-btn").addEventListener("click", function () {
    calendar.next(); // Move to next month
    updateMonth();
  });

  document.getElementById("today-btn").addEventListener("click", function () {
    calendar.today(); // Move to today
    updateMonth();
  });

  // View switch buttons
  document.getElementById("month-view").addEventListener("click", function () {
    calendar.changeView("month");
    updateMonth();
  });

  document.getElementById("week-view").addEventListener("click", function () {
    calendar.changeView("week");
    updateMonth();
  });

  document.getElementById("day-view").addEventListener("click", function () {
    calendar.changeView("day");
    updateMonth();
  });
}

function updateMonth() {
  const date = calendar.getDate(); // Get current date
  const monthYear = date
    .toDate()
    .toLocaleString("default", { month: "long", year: "numeric" });
  document.getElementById("current-month").innerText = monthYear;
}
