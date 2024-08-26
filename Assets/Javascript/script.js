const wau = 'https://api.openweathermap.org';
const wak = '5c9fb27197afaba0d36caf933e2d63de';

let ls = JSON.parse(localStorage.getItem("towns"))||[];
const sb = document.getElementById("sb");
const si = document.getElementById("search");
const sh = document.getElementById('local');
const tp = document.getElementById('top');
const bb = document.getElementById('bottom');
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function history() {
    sh.innerHTML = '';
    for (i = 0; i < ls.length; i++) {
        const hb = document.createElement('button');
        hb.setAttribute("id", "history");
        hb.setAttribute("name", ls[i]);
        hb.setAttribute("class", "history-button");
        hb.textContent = ls[i];
        sh.append(hb);
    }
}

function local(store) {
    ls.push(store);
    const tls = JSON.stringify(ls);
    localStorage.setItem('towns', tls)
    history()
}

function rcard(weather) {

    const t = weather.main.temp;
    const ws = weather.wind.speed;
    const h = weather.main.humidity;
  
    const card = document.createElement('div');
    const cb = document.createElement('div');
    const ti = document.createElement('h5');
    const tw = document.createElement('p');
    const he = document.createElement('p');
    
    card.setAttribute('id', 'forcast');
    card.append(cb);
    cb.append(ti, tw, he);
  

    ti.textContent = dayjs(weather.dt_txt).format('M/D/YYYY');
    tw.textContent = "|  Tempature(f) " + t + "|  Wind Speed(mph)" + ws;
    he.textContent = "|   Humidity(%)" + h;
  
    bb.append(card);
}

function rforcast(weather) {
    const d1 =dayjs().add(1, 'day').startOf('day').unix();
    const d6 =dayjs().add(6, 'day').startOf('day').unix();

    const hd = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = "Forecasts:";
    hd.append(h);

    bb.innerHTML = "";    
    bb.append(hd);

  for (let i = 0; i < weather.length; i++) {
    if (weather[i].dt >= d1 && weather[i].dt < d6) {
      if (weather[i].dt_txt.slice(11, 13) == '12') {
        rcard(weather[i]);
      }
    }
  }
}

function rWeather(tn, weather) {
    const date = dayjs().format('M/D/YYYY');
    const t = weather.main.temp;
    const ws = weather.wind.speed;
    const h = weather.main.humidity;

    const card = document.createElement('div');
    const content = document.createElement('div');
    const title = document.createElement('h2');
    const tw = document.createElement('p');
    const he = document.createElement('p');

    card.append(content);
    title.textContent = tn + "   " + date ;
    tw.textContent = "|  Tempature(f) " + t + "|  Wind Speed(mph)" + ws;
    he.textContent = "|   Humidity(%)" + h;
    content.append(title, tw, he);

    tp.innerHTML = '';
    tp.append(card);
}

function render(tn, data) {
    rWeather(tn, data.list[0], data.city.timezone);
    rforcast(data.list);
}

function weatherdata(location) {
    const { lat } = location;
    const { lon } = location;
    const tn = location.name;

    const au = `${wau}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${wak}`;

    fetch(au)
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
    render(tn, data);
    })
    .catch(function (err) {
        console.log(err);
    });
}

function processSearch(search) {
    const au = `${wau}/geo/1.0/direct?q=${search}&limit=5&appid=${wak}`;
    
    fetch(au)
    .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
            alert('Try a real location!');
        } else {
            local(search);
            weatherdata(data[0]);
        }
    })
    .catch(function (err) {
        console.log(err);
    });
}

function search(event) {
    if (si.value === "") {
        alert("Please fill in the search bar")
        return;
    }
    event.preventDefault();
    processSearch(si.value)
    si.value = "";
}

function hibu(event) {
const hb = event.target;
const fhb = hb.getAttribute('name');
const au = `${wau}/geo/1.0/direct?q=${fhb}&limit=5&appid=${wak}`;
    
    fetch(au)
    .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        weatherdata(data[0]);        
    })
    .catch(function (err) {
        console.log(err);
    });
}

sb.addEventListener("click", search);
sh.addEventListener("click", hibu);
history()