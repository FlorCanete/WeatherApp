fetch("https://api.weatherapi.com/v1/forecast.json?key=2ec92f54761e4147ace223825252709&q=Buenos&Aires&days=3&aqi=no&alerts=no&lang=es")
.then(
    response => response.json()
)
.then(
    data => {
        conditionCode = data.current.condition.code;
        isDay = data.current.is_day;
        function getBackgroundClass(code, isDay) {
            switch (code) {
                case 1000: return isDay ? 'clear-day' : 'clear-night';
                case 1003: case 1006: case 1009:
                    return isDay ? 'cloudy-day' : 'cloudy-night';
                case 1063: case 1150: case 1153:
                case 1180: case 1183: case 1186:
                case 1189: case 1192: case 1195:
                    return isDay ? 'rain-day' : 'rain-night';
                default: return isDay ? 'clear-day' : 'clear-night';
            }
        }
        data.forecast.forecastday.forEach(days => {
    console.log(days.date); // ¿qué fechas están llegando?
});
        const bgClass = getBackgroundClass(conditionCode, isDay);
        document.body.className = bgClass;

        let todayWeather = document.querySelector('#today-weather-info');
        let city = todayWeather.querySelector('#city');
        let country = todayWeather.querySelector('#country');
        let date = todayWeather.querySelector('#date');
        let temperature = todayWeather.querySelector('#temperature');
        let icon = todayWeather.querySelector('#icon');
        let weather = todayWeather.querySelector('#weather');
        let realfeel = todayWeather.querySelector('#realFeel');
        let wind = todayWeather.querySelector('#wind');
        let humidity = todayWeather.querySelector('#humidity');
        let uv = todayWeather.querySelector('#uv');
        let rain = todayWeather.querySelector('#rain');

        city.textContent =`${data.location.name}`;
        country.textContent =`${data.location.region}, ${data.location.country}`;
        temperature.textContent = `${data.current.temp_c} ℃`;
        icon.src = `https:${data.current.condition.icon}`;
        weather.textContent = `${data.current.condition.text}`;
        wind.textContent = `${data.current.gust_kph}`;
        uv.textContent = `${data.current.uv}`;
        realfeel.textContent = `Sensación térmica: ${data.current.feelslike_c} ℃`;
        humidity.textContent = `${data.current.humidity}%`;
        rain.textContent = `${data.current.precip_mm} %`;

        const weekWeather = document.querySelector('#week-weather');
        const ul = weekWeather.querySelector('ul');
        //Formato del dia
        const formatDate = {
            weekday: "long",
            day: "numeric",
            month: "short"
        }

        data.forecast.forecastday.forEach(days => {
            const li = document.createElement('li');
            const weekDays = new Date(days.date);

            let date = weekDays.toLocaleDateString("es-ES", formatDate).replace(/^([a-z])/, m => m.toUpperCase()).replace('.','')

            ul.appendChild(li);

            const max_temp = days.day.maxtemp_c + `°C`;
            const min_temp = days.day.mintemp_c + `°C`;
            const maxwind = days.day.maxwind_kph + `km/h`;
            const totalprecip = days.day.totalprecip_mm;
            const humidity = days.day.avghumidity;
            const condition = days.day.condition.text;
            const condition_icon = 'https:' + days.day.condition.icon;
            const uv = days.day.uv

            const createParagraph = (value, classname, spanText = '', icon = '') => {
                const p = document.createElement('p');
                p.className = classname;

                const icons = document.createElement('i');
                icons.className = icon;

                p.appendChild(icons);

                if (spanText) {
                    const span = document.createElement('span');
                    span.textContent = spanText + ': ';
                    p.appendChild(span);
                }

                const textNode = document.createTextNode(value);
                p.appendChild(textNode);

                return p;
            };

            const createTemperatureParagrapht = (maxValue,minValue, classname, label='', ) => {
                const p = document.createElement('p');
                p.className = classname;    

                const maxSpan = document.createElement('span');
                maxSpan.className = 'text-red-700 font-bold';
                maxSpan.textContent = maxValue;

                const separator =  document.createTextNode(' / ');

                const minSpan = document.createElement('span');
                minSpan.className = 'text-blue-700 font-bold';
                minSpan.textContent = minValue;

                p.appendChild(maxSpan);
                p.appendChild(separator);
                p.appendChild(minSpan);

                return p;
            }

            img = document.createElement('img');
            img.src = condition_icon

            li.appendChild(createParagraph(date,'date'));
            li.appendChild(img);
            li.appendChild(createParagraph(condition,'condition'));
            li.appendChild(createTemperatureParagrapht(max_temp,min_temp, 'Alltemp'));
            li.appendChild(createParagraph(maxwind,'max-wind','','fa-solid fa-wind text-sky-500'));
            totalprecip > 0 ? li.appendChild(createParagraph(totalprecip,'total-precip')) : '';
            li.appendChild(createParagraph(uv,'uv', '', 'fas fa-sun text-sky-500'));
        });
    }
)