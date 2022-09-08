// Get all the necessary elements from the dom
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
let citiesUl = document.querySelector(".cities")

let smallDateOutput = document.querySelector(".date-card-date")
let smallIcon = document.querySelector(".icon-small")
let smallTempOutput = document.querySelector(".temp-small")
let smallWindOutput = document.querySelector(".wind-small")
let smallHumidityOutput = document.querySelector(".humidity-small")
let daySection = document.querySelector(".day-section")

// Store aip key in a variable
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

// Function to render 5 day forecast cards
function renderForecast(data, timezone) {
  // reset day section
  daySection.innerHTML = ""

  for (let day of data) {
    let dayCardDiv = document.createElement("div")
    dayCardDiv.classList.add("day-card")

    let dayCardDateSpan = document.createElement("span")
    dayCardDateSpan.classList.add("day-card-date")
    let date = new Date(day.datetime)
    date.setDate(date.getDate() + 1)
    let dateString = date.toLocaleString("en-US", {
      timeZone: timezone,
    })
    dayCardDateSpan.textContent = dateString.split(",")[0]

    let iconSmallImg = document.createElement("img")
    iconSmallImg.classList.add("icon-small")
    iconSmallImg.alt = "weather icon"
    iconSmallImg.src = `./assets/images/icons/${day.weather.icon}.png`

    let tempSpan = document.createElement("span")
    tempSpan.textContent = "Temp"

    let tempSmallSpan = document.createElement("span")
    tempSmallSpan.classList.add("temp-small")
    tempSmallSpan.textContent = day.temp

    let windSpan = document.createElement("span")
    windSpan.textContent = "Wind"

    let windSmallSpan = document.createElement("span")
    windSmallSpan.classList.add("wind-small")
    windSmallSpan.textContent = day.wind_spd

    let humiditySpan = document.createElement("span")
    humiditySpan.textContent = "Humidity"

    let humiditySmallSpan = document.createElement("span")
    humiditySmallSpan.classList.add("humidity-small")
    humiditySmallSpan.textContent = day.rh

    dayCardDiv.appendChild(dayCardDateSpan)
    dayCardDiv.appendChild(iconSmallImg)
    dayCardDiv.appendChild(tempSpan)
    dayCardDiv.appendChild(tempSmallSpan)
    dayCardDiv.appendChild(windSpan)
    dayCardDiv.appendChild(windSmallSpan)
    dayCardDiv.appendChild(humiditySpan)
    dayCardDiv.appendChild(humiditySmallSpan)

    daySection.appendChild(dayCardDiv)
  }
}

// Create an empty array to store the clicked cities
let cityArr = []
// Get the stored city input in the local storage when the page reloads
if (localStorage.getItem("cityInput")) {
  cityArr = JSON.parse(localStorage.getItem("cityInput"))
}
// Render the city list
renderCities(cityArr)

// Set a default city when the page loads
let cityInput = "Austin, TX"

// Add event listener to the citiesUl
citiesUl.addEventListener("click", (e) => {
  let element = e.target
  if (element.matches(".city")) {
    // Change the  default city to the clicked one
    cityInput = element.textContent
    console.log(cityInput)
    // Fetch and display the data from Weather API
    fetchCurrentWeatherData()
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
    fetchCurrentWeatherData()
    // Remove all the text from the search bar
    searchInput.value = ""
    // Fade out the app
    app.style.opacity = "0"
  }
})

// Function that fetches and displays the data from the current weather API
function fetchCurrentWeatherData() {
  // Fetch the data and add the city name with template literals
  fetch(
    ` https://api.weatherbit.io/v2.0/current?city=${cityInput}&key=${apiKey}&units=I`
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
          nameOutput.innerHTML = data.city_name + ", " + data.state_code
          // Add the icon to the page
          let iconId = data.weather.icon
          icon.src = `./assets/images/icons/${iconId}.png`
          // Add the weather details to the page
          windOutput.innerHTML = data.wind_spd + "MPH"
          humidityOutput.innerHTML = data.rh + "%"
          uvOutput.innerHTML = data.uv
          // Get the current time in milliseconds
          let currentTime = new Date().getTime()
          console.log(currentTime)
          // Turn the current time to a string
          let currentTimeString = new Date().toLocaleString("en-US", {
            timeZone: resData.timezone,
          })
          console.log(currentTimeString)
          // Split the current time string to 2 separate string by ","
          let dtArray = currentTimeString.split(",")
          console.log(dtArray)
          // Set the time and date text
          timeOutput.innerHTML = dtArray[1]
          dateOutput.innerHTML = dtArray[0]
          // Set default time of day to night
          let timeOfDay = "night"
          // Get the unique id for each weather condition
          let code = data.weather.code
          // Change to night if it's night time
          let sunrise = new Date(dtArray[0], data.sunrise).getTime()
          console.log(sunrise)
          let sunset = new Date(dtArray[0], data.sunset).getTime()
          console.log(sunset)

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

// // Function that fetches and displays the data from the forecast weather API
function fetchWeatherForecastData() {
  // Fetch the data and add the city name with template literals
  fetch(
    ` https://api.weatherbit.io/v2.0/forecast/daily?city=${cityInput}&key=${apiKey}&units=I&days=6`
  )
    .then((response) => {
      if (response.ok) {
        response.json().then((resData) => {
          // Print the data to see what is available
          console.log(resData)
          let data = resData.data.slice(1)
          renderForecast(data, resData.timezone)
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
fetchCurrentWeatherData()
fetchWeatherForecastData()

// Fade in the page
app.style.opacity = "1"
