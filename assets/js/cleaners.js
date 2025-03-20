let bookinghtml = null;
let cleaners = [];
let selectedFilters = [];

document.addEventListener("DOMContentLoaded", async function () {
  cleaners = await fetchCleaners();
  loadCleaners();
  loadfooter(document);
});

async function fetchCleaners() {
  const response = await fetch("/assets/others/cleaners.json");
  fetch("/pages/home/bookingconfirmation.html")
    .then((response) => response.text())
    .then((data) => {
      bookinghtml = data;
    });
  return response.json();
}
function loadCleaners() {
  loadfilters();
  renderCleaners(cleaners);
}

function showModal(cleaner) {
  if (typeof cleaner === "string") {
    cleaner = JSON.parse(cleaner);
  }
  console.log(cleaner.specializations);

  document.getElementById("bookingbody").innerHTML = bookinghtml
    .replace("CleanerName", cleaner.name)
    .replace("CleanerLocation", cleaner.location)
    .replace("CleanerPrice", cleaner.rate)
    .replace("CleanerRating", cleaner.rating)
    .replace("profileimageurl", cleaner.image);

  const specializedServices = document.getElementById("specializedservices");
  specializedServices.innerHTML = "";
  cleaner.specializations.forEach((specialization) => {
    const option = document.createElement("option");
    option.value = specialization.toLowerCase().replace(/\s+/g, "-");
    option.textContent = specialization;
    specializedServices.appendChild(option);
  });
  loadtime();
}

function loadtime() {
  var select = document.getElementById("arrival");
  for (var i = 6; i <= 18; i++) {
    var option = document.createElement("option");
    let isConverted = "AM";
    let simpleHour;
    if (i == 12) {
      simpleHour = i;
      isConverted = "PM";
    } else if (i > 12) {
      simpleHour = i - 12;
      isConverted = "PM";
    } else {
      simpleHour = i;
    }
    option.value = simpleHour;
    option.innerHTML = `<b>${simpleHour}:00 ${isConverted}</b>`;
    select.options.add(option);
  }

  //populate the Hours select element
  var select = document.getElementById("hours");
  for (var i = 1; i <= 12; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.innerHTML = `<b>${i}</b>`;
    select.options.add(option);
  }
}

function storeFilter(filterType, option) {
  if (filterType === "Price" || filterType === "Rating") {
    const inputs = document.querySelectorAll(
      `input[onchange="storeFilter('${filterType}', this.value)"]`
    );
    const minValue = inputs[0].value;
    const maxValue = inputs[1].value;

    // Remove existing filterType if already present
    selectedFilters = selectedFilters.filter(
      (filter) => filter.filterType !== filterType
    );

    // Add new min-max value as an array
    selectedFilters.push({
      filterType: filterType,
      value: [minValue, maxValue],
    });
  } else {
    // Remove existing filterType if already present
    selectedFilters = selectedFilters.filter(
      (filter) => filter.filterType !== filterType
    );

    // Add the new filter
    selectedFilters.push({ filterType: filterType, value: option });
  }

  console.log(selectedFilters);
  applyFilters(); // Apply the updated filters
}

function createFitler(filterType, optionList) {
  if (filterType !== "Price" && filterType !== "Rating") {
    return `<div class="mb-3">
                    <select class="form-select" id="${filterType}Select" aria-describedby="${filterType}Feedback" onchange="storeFilter('${filterType}', this.value)" required>
                        <option value="" disabled selected>Filter by ${filterType}</option>
                        ${optionList
                          .map(
                            (option) =>
                              `<option value="${option}">${option}</option>`
                          )
                          .join("")}
                    </select>
                    <div id="${filterType}Feedback" class="invalid-feedback">Please provide your ${filterType.toLowerCase()}.</div>
                </div>`;
  } else {
    const minvalue = Math.min(...optionList);
    const maxvalue = Math.max(...optionList);
    return `<div class="d-flex flex-wrap align-items-center justify-content-between">
                <label class="text-primary fw-bold p-2">${filterType} range:</label>
                <input type="number" class="form-control w-auto me-2" value="${minvalue}" min="${minvalue}" max="${maxvalue}" onchange="storeFilter('${filterType}', this.value)"/>
                <input type="number" class="form-control w-auto me-2" value="${maxvalue}" min="${minvalue}" max="${maxvalue}" onchange="storeFilter('${filterType}', this.value)"/>
            </div>`;
  }
}
function loadfilters() {
  const filterTypes = ["Category", "Location", "Price", "Rating"];
  const filterOptions = {
    Category: [
      ...new Set(cleaners.map((cleaner) => cleaner.specializations).flat()),
    ],
    Location: [...new Set(cleaners.map((cleaner) => cleaner.location))],
    Price: [...new Set(cleaners.map((cleaner) => cleaner.rate))],
    Rating: [...new Set(cleaners.map((cleaner) => cleaner.rating))],
  };

  filterTypes.forEach((filterType) => {
    const container = document.getElementById("filtercontainer");
    const filterDiv = document.createElement("div");
    filterDiv.className = "mx-3 my-2";
    filterDiv.innerHTML = createFitler(filterType, filterOptions[filterType]);
    container.appendChild(filterDiv);
  });
}

function applyFilters() {
  const view = document.getElementById("view");
  view.innerHTML = "";

  const filteredCleaners = cleaners.filter((cleaner) => {
    return selectedFilters.every((filter) => {
      if (filter.filterType === "Category") {
        return (
          cleaner.specializations.includes(filter.value) ||
          filter.value === null
        );
      } else if (filter.filterType === "Location") {
        return cleaner.location === filter.value || filter.value === null;
      } else if (filter.filterType === "Price") {
        // Ensure the cleaner's rate is within the selected price range [min, max]
        const [minPrice, maxPrice] = filter.value;
        return cleaner.rate >= minPrice && cleaner.rate <= maxPrice;
      } else if (filter.filterType === "Rating") {
        // Ensure the cleaner's rating is within the selected rating range [min, max]
        const [minRating, maxRating] = filter.value;
        return cleaner.rating >= minRating && cleaner.rating <= maxRating;
      }
      return true; // Default case (no filtering applied)
    });
  });

  renderCleaners(filteredCleaners);
}

function renderCleaners(newcleaners) {
  const view = document.getElementById("view");
  view.innerHTML = ""; // Clear existing content

  newcleaners.forEach((element) => {
    const code = `<div class="w-100 m-2 border p-3 rounded">
        <img src="${element.image}"
            class="card-img-top rounded-4" style="aspect-ratio: 1.5; object-fit: cover;" />
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${element.name}</h5>
            <h5 class="card-subtitle">$${element.rate} pph</h5>
            <p class="card-text">${element.location}</p>
            <div class="mt-auto mx-3">
                <div class="row justify-content-between align-items-center">
                    <div class="col-6 d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-star-fill me-2" viewBox="0 0 16 16">
                            <path
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                        <span class="fw-bold ">${element.rating}</span>
                    </div>
                    <div class="col-6 justify-content-end d-flex">
                        <a class="btn btn-primary shadow-0 me-1" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='showModal(${JSON.stringify(
                          element
                        )})'>Book Now</a>
                    </div>
                </div>
            </div>
        </div>`;
    const newdiv = document.createElement("div");
    newdiv.className =
      "col-lg-3 col-md-5 col-sm-5 d-flex border-1 border-black rounded ";
    newdiv.innerHTML = code;
    view.appendChild(newdiv);
  });
}
