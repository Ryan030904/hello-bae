const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const reasonInput = document.getElementById('reason-input');
const secretMsg = document.getElementById('secret-msg');
const bgMusic = document.getElementById('bg-music');
const moveSound = document.getElementById('move-sound');
let currentIndex = 0;

const fixedReason = "Do mình cute xinh đẹp ăn nhiều ngủ nhiều hướng nội nên không biết tán tỉnh ý :v";

// Mở giao diện chính
document.getElementById('ok-btn').onclick = () => {
  document.querySelector('.popup').style.display = 'none';
  document.querySelector('.question-page').style.display = 'flex';
  bgMusic.play();
};

// Né chuột trên PC
document.addEventListener('mousemove', e => {
  if (window.innerWidth > 768) {
    dodgeIfClose(e.clientX, e.clientY);
  }
});

// Né chuột trên mobile
document.addEventListener('touchmove', e => {
  if (window.innerWidth <= 768 && e.touches.length > 0) {
    dodgeInViewport(e.touches[0].clientX, e.touches[0].clientY);
  }
});

// Logic né chuột trên PC
function dodgeIfClose(mouseX, mouseY) {
  const questionPage = document.querySelector('.question-page');
  if (!questionPage || questionPage.style.display !== 'flex') return;

  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;
  const distance = Math.hypot(mouseX - noCenterX, mouseY - noCenterY);

  if (distance < 100) {
    moveSound.currentTime = 0;
    moveSound.play();

    const btnGroup = document.querySelector('.btn-group');
    const groupRect = btnGroup.getBoundingClientRect();
    const maxX = btnGroup.offsetWidth - noRect.width;
    const maxY = btnGroup.offsetHeight - noRect.height;

    let newLeft, newTop, overlap, mouseOverlap;
    let tries = 0;

    do {
      newLeft = Math.random() * maxX;
      newTop = Math.random() * maxY;

      const fakeNoRect = {
        left: groupRect.left + newLeft,
        right: groupRect.left + newLeft + noRect.width,
        top: groupRect.top + newTop,
        bottom: groupRect.top + newTop + noRect.height
      };

      overlap = !(
        fakeNoRect.right < yesRect.left ||
        fakeNoRect.left > yesRect.right ||
        fakeNoRect.bottom < yesRect.top ||
        fakeNoRect.top > yesRect.bottom
      );

      mouseOverlap = (
        mouseX >= fakeNoRect.left &&
        mouseX <= fakeNoRect.right &&
        mouseY >= fakeNoRect.top &&
        mouseY <= fakeNoRect.bottom
      );

      tries++;
    } while ((overlap || mouseOverlap) && tries < 100);

    noBtn.style.position = 'absolute';
    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
  }
}

// Né chuột trong viewport (mobile)
function dodgeInViewport(touchX, touchY) {
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;
  const distance = Math.hypot(touchX - noCenterX, touchY - noCenterY);

  if (distance < 100) {
    moveSound.currentTime = 0;
    moveSound.play();

    const padding = 16;
    const maxX = window.innerWidth - noRect.width - padding;
    const maxY = window.innerHeight - noRect.height - padding;

    let newLeft, newTop, tries = 0, overlap;

    do {
      newLeft = Math.random() * maxX;
      newTop = Math.random() * maxY;

      const newRect = {
        left: newLeft,
        right: newLeft + noRect.width,
        top: newTop,
        bottom: newTop + noRect.height
      };

      overlap = !(
        newRect.right < yesRect.left ||
        newRect.left > yesRect.right ||
        newRect.bottom < yesRect.top ||
        newRect.top > yesRect.bottom
      );

      tries++;
    } while (overlap && tries < 50);

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
  }
}

// Mở popup nhập lý do
yesBtn.onclick = () => {
  document.getElementById('reason-popup').style.display = 'block';
  document.querySelector('.question-page').style.display = 'none';
  reasonInput.value = '';
  reasonInput.placeholder = 'Whyyy';
  secretMsg.style.display = 'none';
  currentIndex = 0;
};

// Gõ tự động lý do
reasonInput.addEventListener('keydown', e => {
  if (["Tab", "Shift", "Control", "Alt"].includes(e.key)) return;

  e.preventDefault();

  if (e.key === 'Backspace') {
    if (currentIndex > 0) {
      currentIndex--;
      reasonInput.value = fixedReason.slice(0, currentIndex);
    }
    if (currentIndex === 0) secretMsg.style.display = 'none';
    return;
  }

  if (currentIndex < fixedReason.length) {
    currentIndex++;
    reasonInput.value = fixedReason.slice(0, currentIndex);
    secretMsg.style.display = 'block';
  }
});

// Chặn dán/cut/drag/input thủ công
["paste", "cut", "drop", "input"].forEach(evt =>
  reasonInput.addEventListener(evt, e => e.preventDefault())
);

// Mở kết quả khi nhấn nút bí mật
secretMsg.onclick = () => {
  document.getElementById('reason-popup').style.display = 'none';
  document.getElementById('result-popup').style.display = 'block';
};

// Nhấn "ahihi><" => reset
document.querySelector('.share-btn').onclick = () => {
  document.getElementById('result-popup').style.display = 'none';
  document.querySelector('.question-page').style.display = 'flex';
  reasonInput.value = fixedReason;
  secretMsg.style.display = 'none';
  resetNoBtnPosition();
};

// Reset vị trí nút "Không"
function resetNoBtnPosition() {
  noBtn.style.position = 'static';
  noBtn.style.left = '';
  noBtn.style.top = '';
}
