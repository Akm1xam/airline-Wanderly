// Enhanced Preloader with Cloud Animation
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    const letters = document.querySelectorAll('.letter');
    
    // Animate letters with delay
    letters.forEach((letter, index) => {
        letter.style.setProperty('--index', index);
    });
    
    // Hide preloader after animation
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 800);
    }, 3000);
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Parallax effect for clouds
    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
        const speed = cloud.classList.contains('cloud-1') ? 0.3 : 
                     cloud.classList.contains('cloud-2') ? 0.5 :
                     cloud.classList.contains('cloud-3') ? 0.7 : 0.9;
        cloud.style.transform = `translateX(${parseFloat(cloud.style.transform?.match(/translateX\(([^)]+)/)?.[1] || 0) + speed}px)`;
    });
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            const isVisible = navLinks.style.display === 'flex';
            
            if (isVisible) {
                navLinks.style.display = 'none';
                navActions.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navActions.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = 'var(--shadow-lg)';
                navLinks.style.gap = '1.5rem';
                
                navActions.style.position = 'absolute';
                navActions.style.top = 'calc(100% + 200px)';
                navActions.style.left = '0';
                navActions.style.right = '0';
                navActions.style.background = 'white';
                navActions.style.padding = '2rem';
                navActions.style.boxShadow = 'var(--shadow-lg)';
                navActions.style.flexDirection = 'column';
                navActions.style.gap = '1rem';
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    navActions.style.display = 'none';
                }
            }
        });
    });

    // Initialize Яндекс Карты
    ymaps.ready(initMap);

    // Route selection with enhanced functionality
    const routeItems = document.querySelectorAll('.route-item');
    routeItems.forEach(item => {
        item.addEventListener('click', function() {
            routeItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const city = this.dataset.city;
            highlightRoute(city);
            showRouteDetails(this);
        });
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            filterRoutes(filter);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterRoutesBySearch(searchTerm);
        });
    }

    // Book button functionality
    const bookButtons = document.querySelectorAll('.btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const routeItem = this.closest('.route-item');
            const routeName = routeItem.querySelector('h4').textContent;
            showBookingModal(routeName);
        });
    });

    // Destination cards interaction
    const destCards = document.querySelectorAll('.dest-card');
    destCards.forEach(card => {
        card.addEventListener('click', function() {
            const destination = this.dataset.dest;
            highlightDestination(destination);
        });
    });

    // Fleet slider functionality
    initFleetSlider();

    // Newsletter subscription
    const subscribeBtn = document.querySelector('.btn-subscribe');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            const emailInput = this.parentElement.querySelector('input');
            if (emailInput.value) {
                showNotification('Спасибо за подписку!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Пожалуйста, введите email', 'error');
            }
        });
    }

    // Animation on scroll
    initScrollAnimations();
});

// Яндекс Карты with enhanced functionality
let map;

function initMap() {
    map = new ymaps.Map('map', {
        center: [30, 0],
        zoom: 2,
        controls: ['zoomControl', 'fullscreenControl']
    }, {
        suppressMapOpenBlock: true
    });

    // Map style for light theme
    map.options.set('theme', 'light');

    // Enhanced routes data
    const routes = {
        moscow: {
            from: [55.7558, 37.6173],
            to: [48.8566, 2.3522],
            name: 'Москва → Париж',
            color: '#2563eb',
            duration: '3ч 45м',
            price: 'от 15 000 ₽'
        },
        london: {
            from: [51.5074, -0.1278],
            to: [40.7128, -74.0060],
            name: 'Лондон → Нью-Йорк',
            color: '#3b82f6',
            duration: '7ч 30м',
            price: 'от 35 000 ₽'
        },
        tokyo: {
            from: [35.6762, 139.6503],
            to: [1.3521, 103.8198],
            name: 'Токио → Сингапур',
            color: '#f59e0b',
            duration: '6ч 15м',
            price: 'от 28 000 ₽'
        },
        dubai: {
            from: [25.2048, 55.2708],
            to: [-8.4095, 115.1889],
            name: 'Дубай → Бали',
            color: '#10b981',
            duration: '8ч 20м',
            price: 'от 42 000 ₽'
        }
    };

    // Create enhanced placemarks and routes
    Object.entries(routes).forEach(([key, route]) => {
        // Departure placemark
        const fromPlacemark = new ymaps.Placemark(route.from, {
            hintContent: `Вылет из ${route.name.split('→')[0].trim()}`,
            balloonContent: `
                <div class="map-balloon">
                    <h4>${route.name.split('→')[0].trim()}</h4>
                    <p>🛫 Вылет</p>
                    <p>⏱️ ${route.duration}</p>
                    <p>💰 ${route.price}</p>
                </div>
            `
        }, {
            preset: 'islands#blueAirportIcon',
            iconColor: route.color
        });

        // Arrival placemark
        const toPlacemark = new ymaps.Placemark(route.to, {
            hintContent: `Прибытие в ${route.name.split('→')[1].trim()}`,
            balloonContent: `
                <div class="map-balloon">
                    <h4>${route.name.split('→')[1].trim()}</h4>
                    <p>🛬 Прибытие</p>
                    <p>⏱️ ${route.duration}</p>
                    <p>💰 ${route.price}</p>
                </div>
            `
        }, {
            preset: 'islands#greenAirportIcon',
            iconColor: route.color
        });

        // Route line with animation
        const routeLine = new ymaps.Polyline([
            route.from,
            route.to
        ], {
            hintContent: route.name,
            balloonContent: `
                <div class="map-balloon">
                    <h4>${route.name}</h4>
                    <p>⏱️ Продолжительность: ${route.duration}</p>
                    <p>💰 Стоимость: ${route.price}</p>
                    <button onclick="bookRoute('${route.name}')" class="map-book-btn">Забронировать</button>
                </div>
            `
        }, {
            strokeColor: route.color,
            strokeWidth: 3,
            strokeOpacity: 0.7
        });

        // Add to map
        map.geoObjects.add(fromPlacemark);
        map.geoObjects.add(toPlacemark);
        map.geoObjects.add(routeLine);
    });

    // Highlight first route by default
    highlightRoute('moscow');
}

function highlightRoute(city) {
    const routes = {
        moscow: [[55.7558, 37.6173], [48.8566, 2.3522]],
        london: [[51.5074, -0.1278], [40.7128, -74.0060]],
        tokyo: [[35.6762, 139.6503], [1.3521, 103.8198]],
        dubai: [[25.2048, 55.2708], [-8.4095, 115.1889]]
    };

    if (routes[city]) {
        map.setBounds(routes[city], {
            checkZoomRange: true,
            zoomMargin: 50
        });
    }
}

function showRouteDetails(routeElement) {
    // Add enhanced details animation
    routeElement.classList.add('showing-details');
    setTimeout(() => {
        routeElement.classList.remove('showing-details');
    }, 300);
}

function filterRoutes(filter) {
    const routeItems = document.querySelectorAll('.route-item');
    
    routeItems.forEach(item => {
        if (filter === 'all' || item.dataset.filter === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterRoutesBySearch(searchTerm) {
    const routeItems = document.querySelectorAll('.route-item');
    
    routeItems.forEach(item => {
        const routeName = item.querySelector('h4').textContent.toLowerCase();
        if (routeName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function highlightDestination(destination) {
    // Add visual feedback for destination selection
    const destCards = document.querySelectorAll('.dest-card');
    destCards.forEach(card => {
        card.classList.remove('active');
    });
    
    const activeCard = document.querySelector(`[data-dest="${destination}"]`);
    activeCard.classList.add('active');
    
    showNotification(`Выбрано направление: ${activeCard.querySelector('h4').textContent}`, 'info');
}

function initFleetSlider() {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    let currentSlide = 0;
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(currentSlide - 1, 0);
            updateSlider();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(currentSlide + 1, slides.length - 1);
            updateSlider();
        });
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .route-item, .dest-card, .stat-card, .aircraft-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        border: 1px solid var(--border);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        border-left: 4px solid ${getNotificationColor(type)};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    return colors[type] || colors.info;
}

// Global function for booking from map
function bookRoute(routeName) {
    showBookingModal(routeName);
}

function showBookingModal(routeName) {
    showNotification(`Начало бронирования рейса: ${routeName}`, 'success');
    
    // Simulate booking process
    setTimeout(() => {
        showNotification('Переходим к выбору дат и пассажиров...', 'info');
    }, 1000);
}

// Enhanced plane animation
function animatePlane() {
    const plane = document.querySelector('.main-plane i');
    if (plane) {
        let angle = 0;
        setInterval(() => {
            angle = (angle + 1) % 360;
            const x = Math.cos(angle * Math.PI / 180) * 20;
            const y = Math.sin(angle * Math.PI / 180) * 10;
            plane.style.transform = `translate(-50%, -50%) rotate(${45 + angle / 10}deg) translate(${x}px, ${y}px)`;
        }, 50);
    }
}

// Start enhanced animations when page loads
window.addEventListener('load', () => {
    animatePlane();
    initScrollAnimations();
});

// Add CSS for map balloons
const style = document.createElement('style');
style.textContent = `
    .map-balloon {
        padding: 1rem;
        font-family: 'Inter', sans-serif;
    }
    
    .map-balloon h4 {
        margin: 0 0 0.5rem 0;
        color: var(--text);
        font-weight: 600;
    }
    
    .map-balloon p {
        margin: 0.25rem 0;
        color: var(--text-light);
        font-size: 0.9rem;
    }
    
    .map-book-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        margin-top: 0.5rem;
        width: 100%;
        transition: background 0.3s ease;
    }
    
    .map-book-btn:hover {
        background: var(--primary-dark);
    }
    
    .notification-success {
        border-left-color: #10b981 !important;
    }
    
    .notification-error {
        border-left-color: #ef4444 !important;
    }
    
    .notification-info {
        border-left-color: #3b82f6 !important;
    }
    
    .notification-warning {
        border-left-color: #f59e0b !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i {
        font-size: 1.25rem;
    }
    
    .showing-details {
        animation: pulseDetails 0.3s ease;
    }
    
    @keyframes pulseDetails {
        0% { transform: translateX(0); }
        50% { transform: translateX(5px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
