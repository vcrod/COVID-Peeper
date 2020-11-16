var newCasesEl = document.getElementById("newCases");
var totalCasesEl = document.getElementById("totalCases");
var newDeathsEl = document.getElementById("newDeaths");
var totalDeathsEl = document.getElementById("totalDeaths");
var selectCountryEl = document.getElementById("country");
var historyEl = document.querySelector("#search-history");
var searchHistory = JSON.parse(localStorage.getItem("country")) || [];

var apiSummary = "https://api.covid19api.com/summary"

function summaryData() {
  fetch(apiSummary)
    .then(response => {
      return response.json();
    })
    .then(json => {
      displaySummary(json);
    });
}

function displaySummary(json) {
  newCasesEl.textContent = json.Global.NewConfirmed.toLocaleString();
  totalCasesEl.textContent = json.Global.TotalConfirmed.toLocaleString();
  newDeathsEl.textContent = json.Global.NewDeaths.toLocaleString();
  totalDeathsEl.textContent = json.Global.TotalDeaths.toLocaleString();
}

summaryData();

let dropdown = $("#search");

dropdown.empty();

dropdown.append("<option selected='true' disabled>Select Country</option>");
dropdown.prop("selectedIndex", 0);

$.getJSON(apiSummary, function (data) {
  $.each(data.Countries, function (key, entry) {
    dropdown.append($("<option></option>").text(entry.Country).val(entry.Country.replaceAll(" ", "-")).data(entry));
  })
  renderSearch();
  initMap();
});

$("#search").change(function () {
  codeAddress(this.value);
  var countryData = $(this.selectedOptions[0]).data();

  renderCountryData(countryData);
  // add local storage here
  searchHistory.push(countryData.Country);
  searchHistory = Array.from(new Set(searchHistory)).sort();
  localStorage.setItem("country", JSON.stringify(searchHistory));
  renderSearch();
});

$("#search-history").change(function () {
  codeAddress(this.value);
  var countryData = $(this.selectedOptions[0]).data();
  console.log(this.selectedOptions);
  renderCountryData(countryData);
});

function renderCountryData(countryData) {

  document.getElementById("userInput").textContent = countryData.Country;
  document.getElementById("newCasesByCountry").textContent = countryData.NewConfirmed.toLocaleString();
  document.getElementById("newRecoveredByCountry").textContent = countryData.NewRecovered.toLocaleString();
  document.getElementById("newDeathsByCountry").textContent = countryData.NewDeaths.toLocaleString();
  document.getElementById("totalConfirmedByCountry").textContent = countryData.TotalConfirmed.toLocaleString();
  document.getElementById("totalRecoveredByCountry").textContent = countryData.TotalRecovered.toLocaleString();
  document.getElementById("totalDeathsByCountry").textContent = countryData.TotalDeaths.toLocaleString();
};

function renderSearch() {
  let dropdownHistory = $("#search-history");

  dropdownHistory.empty();

  dropdownHistory.append("<option selected='true' disabled>Recent Searches</option>");
  dropdownHistory.prop("selectedIndex", 0);

  for (var i = 0; i < searchHistory.length; i++) {
    const data = dropdown.find("option[value=" + searchHistory[i].replaceAll(" ", "-") + "]").data()
    console.log(data)
    dropdownHistory.append($("<option></option>").text(searchHistory[i]).data(data));
  }
};

let map;
var geocoder;

function initMap() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(0, 0);
  var mapOptions = {
    zoom: 1.5,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
};

function codeAddress(address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};
