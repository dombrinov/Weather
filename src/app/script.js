const temperature = document.body.querySelector(".main__temp");
const cityWeather = document.body.querySelector(".main__city_weather");
const screen = document.body.querySelector(".main__info");
const inputCity = document.body.querySelector(".main_input");
const btnChangeCity = document.body.querySelector(".main__change_city");
const info = document.body.querySelector(".main__info");
const find = document.body.querySelector(".main__find_hidden");
const btnFind = document.body.querySelector(".main__find_button");
const error = document.body.querySelector(".main_error_hide");
const trybtn = document.body.querySelector(".main_try");

function findLocation() {
  if (!navigator.geolocation) {
    temperature.textContent = "Geolocation access was declined";
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  async function success(position) {
    // если разрешение юзера получено, то запускаю серию функций (функция success тоже асинхронна т.к. внутри нее есть асинхронные функции)
    const { longitude, latitude } = position.coords;
    let weatherTemp = await getWeatherData(longitude, latitude);
    findTemp(weatherTemp);
  }

  async function error() {
    // если разрешение юзера не получено, то вывожу в текстконтент информацию об этом
    let weatherDataByIp = await getIp();
    findTemp(weatherDataByIp);
  }
}

// запрашиваю данные на сервере и форматирую методом JSON
async function getWeatherData(lat, long) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${long}&lon=${lat}&appid=bff51748a8973824609ac33d6b259bd2&units=metric`
  );
  const data = await response.json();
  console.log(data);
  return data;
}
//добавляю в текстконтент данные которые пришли (температура)
async function findTemp(obj) {
  temperature.textContent = Math.round(obj.main.temp) + "℃";
  cityWeather.textContent = obj.weather[0].main + " in " + obj.name;
}

// функционал кнопки  "изменение города" и отрисовка строки ввода города
btnChangeCity.addEventListener("click", (evt) => createInput());

function createInput() {
  info.classList.toggle("main__info");
  info.classList.toggle("main__info_hidden");
  find.classList.toggle("main__find_hidden");
  find.classList.toggle("main__find");
}

inputCity.addEventListener("input", () => inputCity.value);
btnFind.addEventListener("click", (evt) => findCity(inputCity.value));

//отправляет запрос по городу и отрисовывает данные по погоде, но если ошибка выводит кнопку и текст
async function findCity(city) {
  if (!city.trim(" ") == "".trim(" ")) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bff51748a8973824609ac33d6b259bd2&units=metric`
      );
      const data = await response.json();

      info.classList.toggle("main__info_hidden");
      info.classList.toggle("main__info");
      find.classList.toggle("main__find");
      find.classList.toggle("main__find_hidden");
      await findTemp(data);
    } catch (e) {
      createInput();
      find.classList.toggle("main__find_hidden");
      find.classList.toggle("main__find");
      error.classList.toggle("main_text_error");
      error.classList.toggle("main_error_hide");
      trybtn.addEventListener("click", () => toogle());
      function toogle() {
        find.classList.toggle("main__find_hidden");
        find.classList.toggle("main__find");
        error.classList.toggle("main_text_error");
        error.classList.toggle("main_error_hide");
        tryAgain();
      }
    }
  } else {
    return city;
  }
}
async function tryAgain() {
  trybtn.addEventListener("click", () => {
    find.classList.toggle("main__find_hidden");
    find.classList.toggle("main__find");
    error.classList.toggle("main_text_error");
    error.classList.toggle("main_error_hide");
  });
}

async function getIp() {
  const response2 = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_GzZGRDWjHwiVMAsbyCbRtaRfPMenm`
  );
  const data2 = await response2.json();
  const response3 = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${data2.location.city}&appid=bff51748a8973824609ac33d6b259bd2&units=metric`
  );
  const data3 = await response3.json();
  return data3;
}

findLocation();

