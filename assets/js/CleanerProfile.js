//populate profit an hour select element
var select = document.getElementById('profit-an-hour');
  var cedi = "&#8373;";
  for (var i = 5; i <= 50; i +=5){
    option = document.createElement('option');
    option.value = i;
    option.innerHTML = `${cedi} ${i}`;
    select.options.add(option);
  }