const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');

document.getElementById('ok-btn').onclick = function () {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.question-page').style.display = 'flex';
};

document.addEventListener('mousemove', function (e) {
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
        moveSound.currentTime = 0;
        moveSound.play();
        let newLeft, newTop, overlap, mouseOverlap;
        let tries = 0;
        do {
            newLeft = Math.random() * (window.innerWidth - noRect.width);
            newTop = Math.random() * (window.innerHeight - noRect.height);

            const fakeNoRect = {
                left: newLeft,
                right: newLeft + noRect.width,
                top: newTop,
                bottom: newTop + noRect.height
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

        noBtn.style.position = "fixed";
        noBtn.style.left = `${newLeft}px`;
        noBtn.style.top = `${newTop}px`;
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
