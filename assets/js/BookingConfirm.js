//populate the Time select element
var select = document.getElementById('arrival');
for (var i = 6; i<= 18; i++){
  var option = document.createElement('option');
  let isConverted = "AM";
  let simpleHour
  if (i == 12) {
    simpleHour = i
    isConverted = "PM";
  } else if (i > 12){
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
var select = document.getElementById('hours');
for (var i = 1; i <= 12; i++){
  var option = document.createElement('option');
  option.value = i;
  option.innerHTML = `<b>${i}</b>`;
  select.options.add(option);
}