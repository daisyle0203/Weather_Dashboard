// Get elements that we need from the dom
let app = document.querySelector(".weather-app")
let temp = document.querySelector(".temp")
let dateOutput = document.querySelector(".date")
let timeOutput = document.querySelector(".time")
let conditionOutput = document.querySelector(".condition")
let nameOutput = document.querySelector(".name")
let icon = document.querySelector(".icon")
let windOutput = document.querySelector(".wind")
let humidityOutput = document.querySelector(".humidity")
let uvOutput = document.querySelector(".uv")
let form = document.querySelector("#locationInput")
let searchInput = document.querySelector(".searchInput")
let btn = document.querySelector(".submit")
let cities = document.querySelectorAll(".city")
let citiesUl = document.querySelector(".cities")

let apiKey = "26e579ef41bf4a9eb3fa2ddb685cf5c5"

// Function to render city list
function renderCities(cities) {
  // reset html list
  citiesUl.innerHTML = ""
  // Show the stored city in the browser
  for (let city of cities) {
    let li = document.createElement("li")
    li.classList.add("city")
    li.textContent = city
    citiesUl.appendChild(li)
  }
}

let cityArr = []
// Get the stored city input in the local storage when the page reloads
if (localStorage.getItem("cityInput")) {
  cityArr = JSON.parse(localStorage.getItem("cityInput"))
}

renderCities(cityArr)

// Set a default city when the page loads
let cityInput = "Austin, TX"

// Add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    // Change the  default city to the clicked one
    cityInput = e.target
    console.log(cityInput)
    // Fetch and display the data from Weather API
    fetchWeatherData()
    // Fade out the app
    app.style.opacity = "0"
  })
})

// Add event listener to the citiesUl
citiesUl.addEventListener("click", (e) => {
  let element = e.target
  if (element.matches(".city")) {
    // Change the  default city to the clicked one
    cityInput = element.textContent
    console.log(cityInput)
    // Fetch and display the data from Weather API
    fetchWeatherData()
    // Fade out the app
    app.style.opacity = "0"
  }
})

// Add a submit event listener to the form
form.addEventListener("submit", (e) => {
  // Prevent the default behavior of the form
  e.preventDefault()
  // If the search bar is empty, throw an alert
  if (!searchInput.value) {
    alert("Please type in a city name")
  } else {
    // Change the default city to the one written in the search bar
    cityInput = searchInput.value.trim()
    // Limit to 5 cities on the list
    if (cityArr.length === 5) {
      cityArr.shift()
    }
    // Put the clicked city in the city array
    cityArr.push(cityInput)
    // Render the saved cities on the list
    renderCities(cityArr)
    // Save the city input in the local storage
    localStorage.setItem("cityInput", JSON.stringify(cityArr))
    // Call the fetchWeatherDate function to display the data
    fetchWeatherData()
    // Remove all the text from the search bar
    searchInput.value = ""
    // Fade out the app
    app.style.opacity = "0"
  }
})

// Function that fetches and displays the data from the weather API
function fetchWeatherData() {
  // Fetch the data and add the city name with template literals
  fetch(
    ` https://api.weatherbit.io/v2.0/forecast/daily?city=${cityInput}&key=${apiKey}&units=I&days=5`
  )
    .then((response) => {
      if (response.ok) {
        response.json().then((resData) => {
          // Print the data to see what is available
          console.log(resData)
          let data = resData.data[0]
          // Add temperature and weather condition to the page
          temp.innerHTML = data.temp + "\u2109"
          conditionOutput.innerHTML = data.weather.description
          // Add the city name to the page
          nameOutput.innerHTML = resData.city_name
          // Add the icon to the page
          let iconId = data.weather.icon
          icon.src = `./assets/images/icons/${iconId}.png`
          // Add the weather details to the page
          windOutput.innerHTML = data.wind_spd + "MPH"
          humidityOutput.innerHTML = data.rh + "%"
          uvOutput.innerHTML = data.uv
          // Add the date and time
          let currentTime = new Date().getTime()
          let currentTimeString = new Date().toLocaleString("en-US", {
            timeZone: resData.timezone,
          })
          let dtArray = currentTimeString.split(",")
          timeOutput.innerHTML = dtArray[1]
          dateOutput.innerHTML = dtArray[0]
          // Set default time of day
          let timeOfDay = "night"
          // Get the unique id for each weather condition
          let code = data.weather.code
          // Change to night if it's night time
          let sunrise = new Date(data.sunrise_ts * 1000).getTime()
          let sunset = new Date(data.sunset_ts * 1000).getTime()

          if (currentTime > sunrise && currentTime < sunset) {
            timeOfDay = "day"
          }
          // Set the background image to rain if the weather is rainy
          if (
            code == 200 ||
            code == 201 ||
            code == 202 ||
            code == 230 ||
            code == 231 ||
            code == 232 ||
            code == 233 ||
            code == 300 ||
            code == 301 ||
            code == 302 ||
            code == 500 ||
            code == 501 ||
            code == 502 ||
            code == 511 ||
            code == 520 ||
            code == 521 ||
            code == 522
          ) {
            app.style.backgroundImage = `url(./assets/images/bg/${timeOfDay}/rain.jpg)`
            btn.style.background = "#647d75"
            // Change button color if it's night time
            if (timeOfDay == "night") {
              btn.style.background = "#325c80"
            }
          }
          // Set the background image to snow if the weather is snowy
          else if (
            code == 600 ||
            code == 601 ||
            code == 602 ||
            code == 610 ||
            code == 611 ||
            code == 612 ||
            code == 621 ||
            code == 622 ||
            code == 623
          ) {
            app.style.backgroundImage = `url(./assets/images/bg/${timeOfDay}/snow.jpg)`
            btn.style.background = "#4d72aa"
            // Change button color if it's night time
            if (timeOfDay == "night") {
              btn.style.background = "#1b1b1b"
            }
          }
          // Set the background image to cloud if the weather is cloudy
          else if (
            code == 700 ||
            code == 711 ||
            code == 721 ||
            code == 741 ||
            code == 751 ||
            code == 803 ||
            code == 804 ||
            code == 900
          ) {
            app.style.backgroundImage = `url(./assets/images/bg/${timeOfDay}/cloud.jpg)`
            btn.style.background = "#fa6d1b"
            // Change button color if it's night time
            if (timeOfDay == "night") {
              btn.style.background = "#181e27"
            }
          }
          // Set the background image to clear if the weather is clear
          else {
            app.style.backgroundImage = `url(./assets/images/bg/${timeOfDay}/clear.jpg)`
            btn.style.background = "#fa6d1b"
            // Change button color if it's night time
            if (timeOfDay == "night") {
              btn.style.background = "#181e27"
            }
          }

          // Fade in the page once all is done
          app.style.opacity = "1"
        })
      }
    })
    // If the user types a city that doesn't exist, throw an alert
    .catch(() => {
      alert("City not found, please try again")
      app.style.opacity = "1"
    })
}

// Call the function on page load
fetchWeatherData()

// Fade in the page
app.style.opacity = "1"
