// Мобильное меню
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Карта Leaflet
document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('travel-map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
    }).addTo(map);

    // Добавляем маркеры популярных направлений
    const destinations = [
        { name: "Париж", coords: [48.8566, 2.3522] },
        { name: "Токио", coords: [35.6762, 139.6503] },
        { name: "Бали", coords: [-8.4095, 115.1889] }
    ];

    destinations.forEach(dest => {
        L.marker(dest.coords)
            .addTo(map)
            .bindPopup(`<b>${dest.name}</b>`);
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});