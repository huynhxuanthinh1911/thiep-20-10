// ============ Kiểm tra mật khẩu ============
function checkPassword() {
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const correctPassword = '2508'; // Thay đổi mật khẩu tại đây
    
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === '') {
        errorMessage.textContent = '❌ Vui lòng nhập mật khẩu!';
        passwordInput.style.borderColor = '#e74c3c';
        return;
    }
    
    if (enteredPassword === correctPassword) {
        errorMessage.textContent = '';
        document.getElementById('password-screen').classList.add('hidden');
        document.getElementById('card-screen').classList.remove('hidden');
        
        // Khởi động các hiệu ứng
        initFireworks();
        startCountdown();
        playBackgroundMusic();
    } else {
        errorMessage.textContent = '❌ Mật khẩu không đúng! Thử lại nhé 😊';
        passwordInput.style.borderColor = '#e74c3c';
        passwordInput.value = '';
        passwordInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }
}

// Cho phép nhấn Enter để submit
document.getElementById('password-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
});

// ============ Countdown Timer ============
function startCountdown() {
    // Đặt ngày kỷ niệm (năm, tháng-1, ngày, giờ, phút, giây)
    const anniversaryDate = new Date(2025, 10, 25, 0, 0, 0).getTime(); // 25/11/2025
    
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = anniversaryDate - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// ============ Pháo hoa Canvas ============
function initFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const fireworks = [];
    
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            };
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        update() {
            this.velocity.y += 0.1;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= this.decay;
        }
    }
    
    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.5;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.velocity = 5;
            this.exploded = false;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        update() {
            if (this.y > this.targetY) {
                this.y -= this.velocity;
            } else if (!this.exploded) {
                this.explode();
                this.exploded = true;
            }
        }
        
        explode() {
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(255, 236, 210, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Tạo pháo hoa mới
        if (Math.random() < 0.03) {
            fireworks.push(new Firework());
        }
        
        // Cập nhật và vẽ pháo hoa
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].draw();
            fireworks[i].update();
            
            if (fireworks[i].exploded) {
                fireworks.splice(i, 1);
            }
        }
        
        // Cập nhật và vẽ particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].draw();
            particles[i].update();
            
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize canvas khi thay đổi kích thước màn hình
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============ Nhạc nền ============
let isMusicPlaying = false;
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

function playBackgroundMusic() {
    // Tự động phát nhạc khi mở thiệp
    backgroundMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggle.textContent = '🔊';
    }).catch(error => {
        // Trình duyệt chặn autoplay, người dùng cần click để bật
        console.log('Autoplay prevented. User needs to interact.');
        isMusicPlaying = false;
        musicToggle.textContent = '🔇';
    });
}

// Toggle nhạc nền
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicToggle.textContent = '🔇';
        isMusicPlaying = false;
    } else {
        backgroundMusic.play();
        musicToggle.textContent = '🔊';
        isMusicPlaying = true;
    }
});
