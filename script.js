// Заполнение списка городов
const cities = ["Алматы", "Астана", "Шымкент", "Костанай"];
const citySelect = document.getElementById('city');
cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.text = city;
    citySelect.appendChild(option);
});

// Инициализация карты Яндекс
ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map("map", {
        center: [51.169392, 71.449074], // Координаты для примера (Астана)
        zoom: 10
    });

    // Изменение центра карты при выборе города
    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        if (selectedCity === "Алматы") {
            myMap.setCenter([43.238949, 76.889709], 10);
        } else if (selectedCity === "Астана") {
            myMap.setCenter([51.169392, 71.449074], 10);
        } else if (selectedCity === "Шымкент") {
            myMap.setCenter([42.315556, 69.5892], 10);
        } else if (selectedCity === "Костанай") {
            myMap.setCenter([53.219993, 63.631906], 10);
        }
    });

    // Получение адреса ЖК при клике на карте
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            document.getElementById('address').value = firstGeoObject.getAddressLine();
        });
    });
}

// Отправка данных формы в Google Sheets
const form = document.getElementById('application-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {
        city: formData.get('city'),
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        coords: formData.get('coords'), // Добавь получение координат ЖК
        date: new Date().toLocaleString(),
    };

    fetch('https://script.google.com/macros/s/AKfycbwE5NkgoPi3UfyIoh_Me35BvG00ydSoi63weYB7lQqku6i7lOJ5O6ugEVE8C82NSEdh/exec', {
        method: 'POST',
        mode: 'cors', // Включаем CORS
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(responseData => {
        if (responseData.result === 'success') {
            alert('Заявка успешно отправлена!');
        } else {
            alert('Произошла ошибка при отправке заявки.');
        }
    }).catch(error => {
        console.error('Ошибка:', error);
    });
});