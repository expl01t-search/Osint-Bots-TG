const canvas = document.getElementById('web');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function init() {
    particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 1
        });
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        if (mouse.x && mouse.y) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 180) {
                const force = (180 - dist) / 180;
                p.vx += dx * force * 0.02;
                p.vy += dy * force * 0.02;
            }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Точка с пурпурным свечением
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff00ff';
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#ff00ff';
        ctx.fill();
    });

    // Тонкие пурпурные линии
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 160) {
                ctx.globalAlpha = 1 - dist / 160;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
}

// Фильтры и поиск — без изменений
const catBtns = document.querySelectorAll('.cat-btn');
const cards = document.querySelectorAll('.card');
let activeCat = 'all';

catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.dataset.category;
        filter();
    });
});

function filter() {
    cards.forEach(card => {
        const cat = card.dataset.category;
        card.style.display = (activeCat === 'all' || cat === activeCat) ? 'block' : 'none';
    });
}

document.getElementById('searchInput').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const showCat = (activeCat === 'all' || card.dataset.category === activeCat);
        card.style.display = (showCat && text.includes(query)) ? 'block' : 'none';
    });
});

// Запуск эффекта
if (!('ontouchstart' in window)) {
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => mouse.x = mouse.y = null);
    window.addEventListener('resize', () => { resize(); init(); });
    resize();
    init();
    animate();
}