document.addEventListener("DOMContentLoaded", async function () {
  const services = await fetchServices();
  loadprofile();
  addServices(services);
  updateServiceContent(services[0]);
  InitCalender();
});

async function fetchServices() {
  const response = await fetch("/assets/others/services.json");
  return response.json();
}

function addServices(services) {
  const servicesContainer = document.querySelector(".allservices");
  services.forEach((service, index) => {
    const input = document.createElement("input");
    input.type = "radio";
    input.className = "btn-check";
    input.name = "options";
    input.id = service.name.replace(" ", "").toLowerCase();
    input.autocomplete = "off";
    if (index === 0) {
      input.checked = true;
    }
    const label = document.createElement("label");
    label.className = "btn btn-outline-primary me-2 mb-2";
    label.htmlFor = service.name.replace(" ", "").toLowerCase();
    label.textContent = service.name;
    input.addEventListener("change", () => {
      updateServiceContent(service);
    });
    servicesContainer.appendChild(input);
    servicesContainer.appendChild(label);
  });
}

function updateServiceContent(service) {
  const textContainers = document.querySelectorAll(".text-container");
  textContainers.forEach((container, index) => {
    const carouselContainer = document.querySelector("#c-item");
    carouselContainer.innerHTML = "";

    const carousel = document.createElement("div");
    carousel.className = "carousel-item active h-100 align-content-center";
    const carouselTitle = document.createElement("h3");
    carouselTitle.id = "carousel-title";
    carouselTitle.className = "fw-bold text-white";
    carouselTitle.innerHTML = `${service.name}&nbsp;<span class="fw-normal">Service <br> <span>${service.subtitle}</span></span>`;

    carousel.innerHTML = carouselTitle.outerHTML;
    carouselContainer.appendChild(carousel);

    service.latestreviews.forEach((_review) => {
      const reviewCarousel = document.createElement("div");
      reviewCarousel.className = "carousel-item h-100 align-content-center";
      const reviewTitle = document.createElement("h3");
      reviewTitle.id = "review-title";
      reviewTitle.className = "fw-normal text-white";
      reviewTitle.innerHTML = `${_review.review}`;
      reviewCarousel.innerHTML = reviewTitle.outerHTML;
      carouselContainer.appendChild(reviewCarousel);
    });

    if (index === 0) {
      container.innerHTML = `<h2 class="fw-bold">${service.introTitle}</h2>
                            <p>${service.intro}</p>`;
    } else if (index === 1) {
      container.innerHTML = `<h2 class="fw-bold">${service.serviceTitle}</h2>
                            <p>${service.service}</p>`;
    } else {
      container.innerHTML = `<h2 class="fw-bold">${service.listTitle}</h2><ul>
      ${service.list
        .map(
          (item) =>
            `<li>  <strong>${item.title}</strong><ul>${item.desc
              .map((desc) => `<li>${desc}</li>`)
              .join("")}  </ul> </li>`
        )
        .join("")} </ul>`;
    }

    const bookButton = document.createElement("button");
    bookButton.type = "button";
    bookButton.innerHTML = "Book Now";
    bookButton.className = "btn btn-primary w-20";
    bookButton.addEventListener("click", () => {
      window.location.href = "/pages/home/cleaners.html";
    });

    container.appendChild(bookButton);

    document.querySelectorAll(".box-containers > div")[
      index
    ].style.backgroundImage = `url(${service.images[index].src})`;
  });
}

function loadprofile() {
  fetch("/pages/home/clientprofile.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("profilebody").outerHTML = data;
    });
}

function InitCalender() {
  var Calendar = tui.Calendar;
  var newcalendar = new Calendar("#calendarbody", {
    defaultView: "month",
    useCreationPopup: true,
    useDetailPopup: true,
    calendars: [
      {
        id: "1",
        name: "My Calendar",
        color: "#ffffff",
        bgColor: "#03bd9e",
        dragBgColor: "#03bd9e",
        borderColor: "#03bd9e",
      },
    ],
  });

  newcalendar.createEvents([
    {
      id: "event1",
      calendarId: "cal2",
      title: "Weekly meeting",
      start: new Date(2025, 2, 19, 9, 0, 0), // March is month 2 (0-indexed)
      end: new Date(2025, 2, 30, 10, 0, 0),
    },
    {
      id: "event2",
      calendarId: "cal3",
      title: "Weekly meeting",
      start: new Date(2025, 2, 19, 10, 0, 0), // March is month 2 (0-indexed)
      end: new Date(2025, 2, 19, 10, 0, 0),
    },
    {
      id: "event3",
      calendarId: "cal4",
      title: "Lunch appointment",
      start: new Date(2025, 2, 8, 12, 0, 0), // June is month 5 (0-indexed)
      end: new Date(2025, 2, 8, 13, 0, 0),
    },
    {
      id: "event4",
      calendarId: "cal5",
      title: "Vacation",
      start: new Date(2025, 5, 8), // June is month 5 (0-indexed)
      end: new Date(2025, 5, 10),
      isAllday: true,
      category: "allday",
    },
  ]);
}
