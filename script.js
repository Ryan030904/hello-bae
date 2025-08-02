const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');

document.getElementById('ok-btn').onclick = function () {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.question-page').style.display = 'flex';
    // Đảm bảo nút "Không" ở vị trí ban đầu
    noBtn.style.position = 'static';
    noBtn.style.left = '';
    noBtn.style.top = '';
};

// Hàm di chuyển nút với logic đơn giản hóa
function moveButton(e) {
    const questionPage = document.querySelector('.question-page');
    if (!questionPage || questionPage.style.display !== 'flex') return;

    const noRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    
    // Lấy tọa độ chuột/touch
    let mouseX, mouseY;
    if (e.type.includes('touch')) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;
    const distance = Math.hypot(mouseX - noCenterX, mouseY - noCenterY);

    if (distance < 100) {
        moveSound.currentTime = 0;
        moveSound.play();
        
        // Logic đơn giản hóa - chỉ di chuyển trong vùng an toàn
        const safeMargin = 50; // Tăng margin để đảm bảo an toàn
        const maxLeft = window.innerWidth - noRect.width - safeMargin;
        const maxTop = window.innerHeight - noRect.height - safeMargin;
        const minLeft = safeMargin;
        const minTop = safeMargin;
        
        // Đảm bảo vùng di chuyển hợp lệ
        if (maxLeft > minLeft && maxTop > minTop) {
            let newLeft, newTop;
            let attempts = 0;
            const maxAttempts = 50;
            
            do {
                newLeft = Math.random() * (maxLeft - minLeft) + minLeft;
                newTop = Math.random() * (maxTop - minTop) + minTop;
                attempts++;
                
                // Kiểm tra không chồng lên nút "Có"
            const fakeNoRect = {
                left: newLeft,
                right: newLeft + noRect.width,
                top: newTop,
                bottom: newTop + noRect.height
            };

                const overlap = !(
                fakeNoRect.right < yesRect.left ||
                fakeNoRect.left > yesRect.right ||
                fakeNoRect.bottom < yesRect.top ||
                fakeNoRect.top > yesRect.bottom
            );

                if (!overlap) break;
                
            } while (attempts < maxAttempts);
            
            // Đảm bảo nút không ra ngoài màn hình
            newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
            newTop = Math.max(minTop, Math.min(maxTop, newTop));
            
            // Di chuyển nút và đảm bảo hiển thị
        noBtn.style.position = "fixed";
        noBtn.style.left = `${newLeft}px`;
        noBtn.style.top = `${newTop}px`;
            noBtn.style.display = 'flex';
            noBtn.style.visibility = 'visible';
            noBtn.style.opacity = '1';
            noBtn.style.zIndex = '1001';
        }
    }
}

// Xử lý cho desktop
document.addEventListener('mousemove', moveButton);

// Xử lý cho mobile - touch events
document.addEventListener('touchmove', function(e) {
    e.preventDefault(); // Ngăn scroll khi touch
    moveButton(e);
}, { passive: false });

document.addEventListener('touchstart', function(e) {
    moveButton(e);
});

// Thêm xử lý cho touch end để tránh lag
document.addEventListener('touchend', function(e) {
    // Đảm bảo nút vẫn hiển thị sau khi touch
    ensureNoBtnVisible();
});

// Cải thiện performance cho mobile
let touchTimeout;
document.addEventListener('touchmove', function(e) {
    clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
        moveButton(e);
    }, 16); // ~60fps
}, { passive: false });

// Thêm xử lý đặc biệt cho màn hình dọc
function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

// Xử lý khi xoay màn hình
window.addEventListener('orientationchange', function() {
    // Đợi một chút để màn hình xoay xong
    setTimeout(() => {
        const noBtn = document.getElementById('no-btn');
        if (noBtn.style.position === 'fixed') {
            // Kiểm tra lại vị trí nút sau khi xoay
            const noRect = noBtn.getBoundingClientRect();
            const safeMargin = 30;
            const maxLeft = window.innerWidth - noRect.width - safeMargin;
            const maxTop = window.innerHeight - noRect.height - safeMargin;
            const minLeft = safeMargin;
            const minTop = safeMargin;
            
            let currentLeft = parseFloat(noBtn.style.left) || 0;
            let currentTop = parseFloat(noBtn.style.top) || 0;
            
            // Đảm bảo nút vẫn trong màn hình
            currentLeft = Math.max(minLeft, Math.min(maxLeft, currentLeft));
            currentTop = Math.max(minTop, Math.min(maxTop, currentTop));
            
            noBtn.style.left = `${currentLeft}px`;
            noBtn.style.top = `${currentTop}px`;
            
            // Đảm bảo nút hiển thị
            ensureNoBtnVisible();
        }
    }, 100);
});

// Xử lý khi resize màn hình
window.addEventListener('resize', function() {
    const noBtn = document.getElementById('no-btn');
    if (noBtn.style.position === 'fixed') {
        const noRect = noBtn.getBoundingClientRect();
        const safeMargin = 20;
        const maxLeft = window.innerWidth - noRect.width - safeMargin;
        const maxTop = window.innerHeight - noRect.height - safeMargin;
        const minLeft = safeMargin;
        const minTop = safeMargin;
        
        let currentLeft = parseFloat(noBtn.style.left) || 0;
        let currentTop = parseFloat(noBtn.style.top) || 0;
        
        // Đảm bảo nút vẫn trong màn hình
        currentLeft = Math.max(minLeft, Math.min(maxLeft, currentLeft));
        currentTop = Math.max(minTop, Math.min(maxTop, currentTop));
        
        noBtn.style.left = `${currentLeft}px`;
        noBtn.style.top = `${currentTop}px`;
    }
});

// Thêm xử lý để đảm bảo nút không bị khuất khi load trang
window.addEventListener('load', function() {
    // Đảm bảo viewport meta tag được set đúng cho mobile
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
        document.head.appendChild(viewport);
    }
    
    // Đảm bảo nút "Không" luôn hiển thị
    ensureNoBtnVisible();
});

// Hàm đảm bảo nút "Không" luôn hiển thị
function ensureNoBtnVisible() {
    const noBtn = document.getElementById('no-btn');
    if (noBtn) {
        noBtn.style.display = 'flex';
        noBtn.style.visibility = 'visible';
        noBtn.style.opacity = '1';
        noBtn.style.zIndex = '1000';
        
        // Đảm bảo nút có kích thước
        if (noBtn.offsetWidth === 0 || noBtn.offsetHeight === 0) {
            noBtn.style.width = '120px';
            noBtn.style.height = '45px';
        }
    }
}

// Thêm xử lý để force hiển thị nút nếu bị ẩn
function forceShowNoBtn() {
    const noBtn = document.getElementById('no-btn');
    const questionPage = document.querySelector('.question-page');
    
    if (questionPage && questionPage.style.display === 'flex' && noBtn) {
        // Force reset nút về trạng thái hiển thị
        noBtn.style.display = 'flex';
        noBtn.style.visibility = 'visible';
        noBtn.style.opacity = '1';
        noBtn.style.zIndex = '1001';
        
        // Đặt lại vị trí nếu cần
        if (noBtn.style.position === 'fixed') {
            const rect = noBtn.getBoundingClientRect();
            const safeMargin = 50;
            const maxLeft = window.innerWidth - rect.width - safeMargin;
            const maxTop = window.innerHeight - rect.height - safeMargin;
            const minLeft = safeMargin;
            const minTop = safeMargin;
            
            let currentLeft = parseFloat(noBtn.style.left) || 0;
            let currentTop = parseFloat(noBtn.style.top) || 0;
            
            // Đảm bảo nút trong màn hình
            currentLeft = Math.max(minLeft, Math.min(maxLeft, currentLeft));
            currentTop = Math.max(minTop, Math.min(maxTop, currentTop));
            
            noBtn.style.left = `${currentLeft}px`;
            noBtn.style.top = `${currentTop}px`;
        }
    }
}

// Chạy force show mỗi 200ms để đảm bảo nút luôn hiển thị
setInterval(forceShowNoBtn, 200);

// Thêm xử lý để kiểm tra và khôi phục nút nếu bị ẩn
setInterval(() => {
    const noBtn = document.getElementById('no-btn');
    const questionPage = document.querySelector('.question-page');
    
    if (questionPage && questionPage.style.display === 'flex' && noBtn) {
        // Kiểm tra nút có hiển thị không
        const rect = noBtn.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 && 
                         rect.top >= 0 && rect.left >= 0 &&
                         rect.bottom <= window.innerHeight && 
                         rect.right <= window.innerWidth;
        
        // Kiểm tra nút có bị ẩn không
        const isHidden = noBtn.style.display === 'none' || 
                        noBtn.style.visibility === 'hidden' || 
                        noBtn.style.opacity === '0';
        
        if (!isVisible || isHidden) {
            console.log('Nút bị ẩn, khôi phục...');
            
            // Đặt lại vị trí an toàn
            const safeMargin = 50;
            const maxLeft = window.innerWidth - rect.width - safeMargin;
            const maxTop = window.innerHeight - rect.height - safeMargin;
            const minLeft = safeMargin;
            const minTop = safeMargin;
            
            const newLeft = Math.max(minLeft, Math.min(maxLeft, Math.random() * maxLeft));
            const newTop = Math.max(minTop, Math.min(maxTop, Math.random() * maxTop));
            
            // Khôi phục nút
            noBtn.style.position = 'fixed';
            noBtn.style.left = `${newLeft}px`;
            noBtn.style.top = `${newTop}px`;
            noBtn.style.display = 'flex';
            noBtn.style.visibility = 'visible';
            noBtn.style.opacity = '1';
            noBtn.style.zIndex = '1001';
        }
    }
}, 500); // Kiểm tra mỗi 500ms thay vì 1000ms

// Thêm xử lý khi nút bị click để đảm bảo không biến mất
noBtn.addEventListener('click', function(e) {
    // Đảm bảo nút vẫn hiển thị sau khi click
    setTimeout(() => {
        ensureNoBtnVisible();
    }, 100);
});

// Thêm xử lý khi touch nút
noBtn.addEventListener('touchstart', function(e) {
    // Đảm bảo nút vẫn hiển thị sau khi touch
    setTimeout(() => {
        ensureNoBtnVisible();
    }, 100);
});

document.getElementById('yes-btn').onclick = function () {
    document.getElementById('reason-popup').style.display = 'block';
    document.querySelector('.question-page').style.display = 'none';
    reasonInput.value = "";
    reasonInput.placeholder = "Whyyy";
    secretMsg.style.display = 'none';
    currentIndex = 0;
};

const fixedReason = "Do mình cute xinh đẹp ăn nhiều ngủ nhiều hướng nội nên không biết tán tỉnh ý :v";
const reasonInput = document.getElementById('reason-input');
const secretMsg = document.getElementById('secret-msg');
let currentIndex = 0;

reasonInput.addEventListener('keydown', function (e) {
    if (["Tab", "Shift", "Control", "Alt"].includes(e.key)) return;

    if (e.key === "Backspace") {
        e.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            reasonInput.value = fixedReason.slice(0, currentIndex);
        }
        if (currentIndex === 0) {
            secretMsg.style.display = 'none';
        }
        return;
    }

    e.preventDefault();

    if (currentIndex < fixedReason.length) {
        currentIndex++;
        reasonInput.value = fixedReason.slice(0, currentIndex);
        secretMsg.style.display = 'block';
    }
});

["paste", "cut", "drop", "input"].forEach(evt =>
    reasonInput.addEventListener(evt, e => e.preventDefault())
);

reasonInput.addEventListener('input', function () {
    reasonInput.value = fixedReason.slice(0, currentIndex);
});

document.getElementById('secret-msg').onclick = function () {
    document.getElementById('reason-popup').style.display = 'none';
    document.getElementById('result-popup').style.display = 'block';
};

document.querySelector('.share-btn').onclick = function () {
    document.getElementById('result-popup').style.display = 'none';
    document.querySelector('.question-page').style.display = 'flex';
    reasonInput.value = "Do mình cute xinh đẹp ăn nhiều ngủ nhiều hướng nội nên không biết tán tỉnh ý :v";
    secretMsg.style.display = 'none';
    noBtn.style.position = 'static';
    noBtn.style.left = '';
    noBtn.style.top = '';
};

const bgMusic = document.getElementById('bg-music');
const moveSound = document.getElementById('move-sound');

document.getElementById('ok-btn').addEventListener('click', function () {
    bgMusic.play();
});

// Hàm tạo hiệu ứng bong bóng
function createBubble(x, y, index) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  
  // Kích thước ngẫu nhiên cho bong bóng
  const size = Math.random() * 50 + 20; // 20-70px
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';
  bubble.style.left = (x - size/2) + 'px';
  bubble.style.top = (y - size/2) + 'px';
  
  // Thêm màu sắc ngẫu nhiên cho bong bóng
  const colors = [
    'rgba(255, 255, 255, 0.9)',
    'rgba(255, 255, 255, 0.7)',
    'rgba(255, 255, 255, 0.8)',
    'rgba(255, 255, 255, 0.6)',
    'rgba(255, 255, 255, 0.85)'
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  bubble.style.background = `radial-gradient(circle at 30% 30%, ${randomColor}, rgba(255, 255, 255, 0.3))`;
  
  // Thêm animation khác nhau dựa trên index
  if (index % 3 === 0) {
    bubble.style.animation = 'bubbleFloatLeft 3s ease-out forwards';
  } else if (index % 3 === 1) {
    bubble.style.animation = 'bubbleFloatRight 3s ease-out forwards';
  } else {
    bubble.style.animation = 'bubbleFloat 3s ease-out forwards';
  }
  
  document.body.appendChild(bubble);
  
  // Xóa bong bóng sau khi animation kết thúc
  setTimeout(() => {
    if (bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  }, 3000);
}

// Hàm tạo hiệu ứng ripple
function createRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.width = '20px';
  ripple.style.height = '20px';
  ripple.style.left = (x - 10) + 'px';
  ripple.style.top = (y - 10) + 'px';
  
  document.body.appendChild(ripple);
  
  // Xóa ripple sau khi animation kết thúc
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Hàm tạo nhiều bong bóng
function createBubbleBurst(x, y) {
  // Tạo ripple effect tại điểm click
  createRipple(x, y);
  
  // Tạo nhiều bong bóng toàn màn hình
  const bubbleCount = Math.floor(Math.random() * 20) + 15; // 15-35 bong bóng
  
  for (let i = 0; i < bubbleCount; i++) {
    setTimeout(() => {
      // Vị trí ngẫu nhiên toàn màn hình
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      createBubble(randomX, randomY, i);
    }, i * 80); // Delay ngẫu nhiên để tạo hiệu ứng tự nhiên
  }
}

// Thêm xử lý sự kiện cho nút "Đừng nói ai biết nha!"
document.addEventListener('DOMContentLoaded', function() {
  const secretMsgBtn = document.getElementById('secret-msg');
  
  if (secretMsgBtn) {
    secretMsgBtn.addEventListener('click', function(e) {
      // Tạo hiệu ứng bong bóng tại vị trí click
      createBubbleBurst(e.clientX, e.clientY);
      
      // Chờ một chút rồi chuyển sang popup kết quả
      setTimeout(() => {
        document.getElementById('reason-popup').style.display = 'none';
        document.getElementById('result-popup').style.display = 'block';
      }, 500);
    });
  }
});