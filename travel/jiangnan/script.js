document.addEventListener('DOMContentLoaded', function() {
    const routePoints = document.querySelectorAll('.route-point');
    
    routePoints.forEach((point, index) => {
        point.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.transition = 'transform 0.3s ease';
            
            const location = this.dataset.location;
            showLocationInfo(location);
        });
        
        point.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            hideLocationInfo();
        });
    });

    const scheduleRows = document.querySelectorAll('.schedule-row:not(.header)');
    scheduleRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });

    const cards = document.querySelectorAll('.overview-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    const mapContainer = document.getElementById('route-map');
    mapContainer.addEventListener('click', function() {
        window.open('https://amap.com', '_blank');
    });
});

function showLocationInfo(location) {
    const info = {
        '厦门': {
            description: '厦门，海上花园城市，海滨旅游胜地',
            attractions: ['鼓浪屿', '厦门大学', '曾厝垵', '环岛路'],
            temperature: '25-32°C'
        },
        '苏州': {
            description: '苏州，古称姑苏，以园林景观闻名于世',
            attractions: ['拙政园', '平江路', '山塘街', '狮子林'],
            temperature: '22-28°C'
        },
        '杭州': {
            description: '杭州，人间天堂，西湖美景甲天下',
            attractions: ['西湖', '龙井村', '灵隐寺', '苏堤'],
            temperature: '23-30°C'
        },
        '乌镇': {
            description: '乌镇，江南水乡古镇，千年历史文化名镇',
            attractions: ['西栅', '东栅', '茅盾故居', '木心美术馆'],
            temperature: '21-27°C'
        }
    };
    
    const data = info[location];
    if (data) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'location-popup';
        infoDiv.innerHTML = `
            <h4>${location}</h4>
            <p>${data.description}</p>
            <p><strong>气温：</strong>${data.temperature}</p>
            <p><strong>主要景点：</strong>${data.attractions.join(', ')}</p>
        `;
        document.body.appendChild(infoDiv);
        
        const activePoint = document.querySelector(`[data-location="${location}"]`);
        const rect = activePoint.getBoundingClientRect();
        infoDiv.style.left = rect.left + 'px';
        infoDiv.style.top = rect.bottom + 10 + 'px';
    }
}

function hideLocationInfo() {
    const popup = document.querySelector('.location-popup');
    if (popup) {
        popup.remove();
    }
}

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .location-popup {
        position: fixed;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 300px;
        border: 1px solid #667eea;
    }
    
    .location-popup h4 {
        margin-bottom: 0.5rem;
        color: #667eea;
    }
    
    .location-popup p {
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(styleSheet);

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

document.querySelectorAll('section').forEach(section => {
    section.addEventListener('click', function(e) {
        if (e.target.tagName === 'H2') {
            const nextSection = this.nextElementSibling;
            if (nextSection && nextSection.tagName === 'SECTION') {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});