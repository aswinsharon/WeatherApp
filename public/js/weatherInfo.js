function getDataFromCollection() {
  const getDataUrl = "/getWeatherInfo";
  fetch(getDataUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayWeatherInfo(data.responseFromDataBase);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while fetching weather data from database");
    });
}

function displayWeatherInfo(data) {
  const tableBody = document.getElementById("table-body");
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                  <td>${item._id}</td>
                  <td>${item.City}</td>
                  <td>${item.Current_Time}</td>
                  <td>${item.Temperature}</td>
                  <td>${item.Feels_like}</td>
                  <td>${item.Minimum_Temperature}</td>
                  <td>${item.Maximum_Temperature}</td>
              `;
    tableBody.appendChild(row);
  });
}

getDataFromCollection();
