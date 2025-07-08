document.getElementById('ok-btn').onclick = function() {
  document.querySelector('.popup').style.display = 'none';
  document.querySelector('.question-page').style.display = 'flex';
};

const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');

// Đặt vị trí ban đầu cho hai nút ở giữa màn hình, song song nhau
function setInitialBtnPositions() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  // Đặt nút "Có" ở giữa
  yesBtn.style.position = "fixed";
  yesBtn.style.left = `${vw / 2 - yesRect.width / 2 + 100}px`;
  yesBtn.style.top = `${vh / 2 - yesRect.height / 2}px`;

  // Đặt nút "Không" bên trái nút "Có" 200px
  noBtn.style.position = "fixed";
  noBtn.style.left = `${vw / 2 - yesRect.width / 2 - noRect.width - 100}px`;
  noBtn.style.top = `${vh / 2 - noRect.height / 2}px`;
}
setInitialBtnPositions();
window.addEventListener('resize', setInitialBtnPositions);

// Né chuột cho nút "Không"
document.addEventListener('mousemove', function (e) {
  // Chỉ né chuột khi giao diện câu hỏi đang hiển thị
  const questionPage = document.querySelector('.question-page');
  if (!questionPage || questionPage.style.display !== 'flex') return;

  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;
  const distance = Math.hypot(mouseX - noCenterX, mouseY - noCenterY);

  if (distance < 100) {
    // Phát hiệu ứng âm thanh khi nút Không né chuột
    moveSound.currentTime = 0;
    moveSound.play();
    let newLeft, newTop, overlap, mouseOverlap;
    let tries = 0;
    do {
      newLeft = Math.random() * (window.innerWidth - noRect.width);
      newTop = Math.random() * (window.innerHeight - noRect.height);

      // Vị trí mới của nút Không
      const fakeNoRect = {
        left: newLeft,
        right: newLeft + noRect.width,
        top: newTop,
        bottom: newTop + noRect.height
      };

      // Kiểm tra có chồng lên nút "Có" không
      overlap = !(
        fakeNoRect.right < yesRect.left ||
        fakeNoRect.left > yesRect.right ||
        fakeNoRect.bottom < yesRect.top ||
        fakeNoRect.top > yesRect.bottom
      );

      // Kiểm tra vị trí mới có bị chuột đè lên không
      mouseOverlap = (
        mouseX >= fakeNoRect.left &&
        mouseX <= fakeNoRect.right &&
        mouseY >= fakeNoRect.top &&
        mouseY <= fakeNoRect.bottom
      );

      tries++;
    } while ((overlap || mouseOverlap) && tries < 100);

    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
  }
});

document.getElementById('yes-btn').onclick = function() {
  document.getElementById('reason-popup').style.display = 'block';
  document.querySelector('.question-page').style.display = 'none';
  // Đặt lại vị trí nút Không về giữa khi mở popup lý do
  setInitialBtnPositions();
  // Reset input khi mở popup
  reasonInput.value = "";
  reasonInput.placeholder = "Whyyy";
  secretMsg.style.display = 'none';
  currentIndex = 0;
};

const fixedReason = "Do mình cute xinh đẹp ăn nhiều ngủ nhiều hướng nội nên không biết tán tỉnh ý :v";
const reasonInput = document.getElementById('reason-input');
const secretMsg = document.getElementById('secret-msg');
let currentIndex = 0;

reasonInput.addEventListener('keydown', function(e) {
  // Cho phép phím Tab, Shift, Ctrl, Alt để không bị kẹt focus
  if (["Tab", "Shift", "Control", "Alt"].includes(e.key)) return;

  // Xử lý Backspace
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

  // Chặn nhập tự do
  e.preventDefault();

  if (currentIndex < fixedReason.length) {
    currentIndex++;
    reasonInput.value = fixedReason.slice(0, currentIndex);
    secretMsg.style.display = 'block';
  }
});

// Không cho paste, cut, drop, input
["paste", "cut", "drop", "input"].forEach(evt =>
  reasonInput.addEventListener(evt, e => e.preventDefault())
);

reasonInput.addEventListener('input', function(e) {
  // Luôn giữ giá trị đúng với fixedReason và currentIndex
  reasonInput.value = fixedReason.slice(0, currentIndex);
});

document.getElementById('secret-msg').onclick = function() {
  document.getElementById('reason-popup').style.display = 'none';
  document.getElementById('result-popup').style.display = 'block';
  // Đặt lại vị trí nút Không về giữa khi mở popup kết quả
  setInitialBtnPositions();
};

document.querySelector('.share-btn').onclick = function() {
  document.getElementById('result-popup').style.display = 'none';
  document.querySelector('.question-page').style.display = 'flex';
  // Reset popup lý do về trạng thái ban đầu
  reasonInput.value = "Do mình cute xinh đẹp ăn nhiều ngủ nhiều hướng nội nên không biết tán tỉnh ý :v";
  secretMsg.style.display = 'none';
  // Đặt lại vị trí nút Không về giữa khi quay lại giao diện câu hỏi
  setInitialBtnPositions();
};

const bgMusic = document.getElementById('bg-music');
const moveSound = document.getElementById('move-sound');

document.getElementById('ok-btn').addEventListener('click', function() {
  bgMusic.play();
});

.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px; /* khoảng cách giữa 2 nút, có thể chỉnh */
  width: 100%;
  margin-top: 32px; /* hoặc điều chỉnh theo ý */
}

.btn-group button {
  min-width: 120px; /* hoặc tùy chỉnh */
  font-size: 1.2rem;
  padding: 12px 24px;
}

.question-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
} 