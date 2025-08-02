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

// Bỏ tất cả touch events và mobile effects
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
});

// Thêm xử lý sự kiện cho nút "Đừng nói ai biết nha!"
document.addEventListener('DOMContentLoaded', function() {
  const secretMsgBtn = document.getElementById('secret-msg');
  
  if (secretMsgBtn) {
    secretMsgBtn.addEventListener('click', function(e) {
      // Chuyển sang popup kết quả ngay lập tức
      document.getElementById('reason-popup').style.display = 'none';
      document.getElementById('result-popup').style.display = 'block';
    });
  }
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