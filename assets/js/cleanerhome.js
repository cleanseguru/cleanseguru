function MyComponent() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h2>Hello from React!</h2>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("react-root"));

if (document.readyState !== "loading") {
  //   getCalender();
  root.render(<MyComponent />);
} else {
  //   getCalender();

  document.addEventListener("DOMContentLoaded", function () {
    root.render(<MyComponent />);
  });
}

function getCalender() {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
  });
  calendar.render();
}
