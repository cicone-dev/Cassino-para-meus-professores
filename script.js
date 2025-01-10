let increaseInterval;

const characterPrizes = {
    'Marcela': ['Salgado na Cantina', 'Nota extra na média', 'Salgado Gratis por uma semana','Crocs do Jorge','date com a Marcela'],
    'Jorge': ['Crocs do Jorge', 'Nota extra na média ', 'Almoço grátis por uma semana'],
    'Gustavo': ['Laptop novo', 'Bolsa de estudos', 'Acesso ilimitado ao laboratório']
};

function initializeBalance() {
    const balance = document.getElementById('balance');
    balance.innerText = "10000.00";
    showColorfulAlert("Bem-vindo! Você recebeu um bônus de R$ 10.000,00 para jogar!", "gold");
}

function chooseCharacter(name, imgSrc) {
    document.getElementById('choose-character').style.display = 'none';
    document.getElementById('user-account').style.display = 'block';
    document.getElementById('character-name').innerText = name;
    const characterImg = document.getElementById('character-img');
    characterImg.src = imgSrc;
    characterImg.style.display = 'block';
    initializeBalance();
    document.getElementById('reseter').click();
}

function increaseBalance() {
    let balance = document.getElementById('balance');
    let currentBalance = parseFloat(balance.innerText);
    currentBalance += 100;
    balance.innerText = currentBalance.toFixed(2);
}

function startIncreasing() {
    increaseBalance();
    increaseInterval = setInterval(increaseBalance, 200);
}

function stopIncreasing() {
    clearInterval(increaseInterval);
}

function awardPrize(character) {
    const prizes = characterPrizes[character];
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    alert(`Parabéns! Você ganhou: ${randomPrize}`);
}

function betAll() {
    const currentBalance = parseFloat(document.getElementById('balance').innerText);
    document.getElementById('bet-amount').value = currentBalance.toFixed(2);
}

function showColorfulAlert(message, color) {
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '50%';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translate(-50%, -50%)';
    alertBox.style.padding = '40px';
    alertBox.style.backgroundColor = color;
    alertBox.style.color = 'white';
    alertBox.style.border = '5px';
    alertBox.style.borderRadius = '10px';
    alertBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    alertBox.style.zIndex = '1000';
    alertBox.style.fontSize = '20px';
    alertBox.style.textAlign = 'center';
    alertBox.innerHTML = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3500);
}

(function () {
    "use strict";
  
    const items = [
        "7️⃣", "❌", "🍓", "🍋‍🟩", "🍉", "🍒", "💵", "🍊", "🍎"
    ];
    
    document.querySelector(".info").textContent = items.join(" ");
    const doors = document.querySelectorAll(".door");
    const resetButton = document.querySelector("#reseter");
    document.querySelector("#spinner").addEventListener("click", spin);
    resetButton.addEventListener("click", init);

    document.getElementById('bet-all')?.addEventListener('click', betAll);

    async function spin() {
        const betAmount = parseFloat(document.getElementById('bet-amount').value);
        let currentBalance = parseFloat(document.getElementById('balance').innerText);
        
        if (betAmount > currentBalance) {
            showColorfulAlert("Saldo insuficiente para esta aposta!", "red");
            return;
        }

        resetButton.disabled = true;
        const character = document.getElementById('character-name').innerText;

        init(false, 1, 2);
        for (const door of doors) {
            const boxes = door.querySelector(".boxes");
            const duration = parseInt(boxes.style.transitionDuration);
            boxes.style.transform = "translateY(0)";
            await new Promise((resolve) => setTimeout(resolve, duration * 100));
        }

        if (character === 'Marcela') {
            setTimeout(() => {
                const hackSymbol = items[Math.floor(Math.random() * items.length)];
                doors.forEach(door => {
                    const boxes = door.querySelector(".boxes");
                    while (boxes.firstChild) {
                        boxes.removeChild(boxes.firstChild);
                    }
                    const box = document.createElement("div");
                    box.classList.add("box");
                    box.style.width = door.clientWidth + "px";
                    box.style.height = door.clientHeight + "px";
                    box.textContent = hackSymbol;
                    box.style.filter = "none";
                    box.style.transition = "none";
                    boxes.appendChild(box);
                    boxes.style.transform = "translateY(0)";
                });
            }, 1000);
        }

        setTimeout(checkWinCondition, 1500);
    }

    function checkWinCondition() {
        const results = Array.from(document.querySelectorAll(".door .box")).map(box => box.textContent);
        const firstIcon = results[0];
        const allEqual = results.every(icon => icon === firstIcon);

        const balanceElement = document.getElementById('balance');
        const betAmount = parseFloat(document.getElementById('bet-amount').value);
        let currentBalance = parseFloat(balanceElement.innerText);
        const messageElement = document.getElementById('message');

        const character = document.getElementById('character-name').innerText;

        if (allEqual || character === 'Marcela') {
            messageElement.textContent = "Parabéns! Você ganhou! Seu saldo foi triplicado!";
            currentBalance *= 3;
            awardPrize(character);
        } else {
            messageElement.textContent = "Você perdeu! Tente novamente.";
            currentBalance -= betAmount;
            
        }

        balanceElement.innerText = currentBalance.toFixed(2);

        setTimeout(() => {
            messageElement.textContent = "";
            resetButton.disabled = false;
            init();
        }, 2500);
    }

    function init(firstInit = true, groups = 1, duration = 1) {
        const characterImg = document.getElementById('character-img')?.src;
        
        for (const door of doors) {
            if (firstInit) {
                door.dataset.spinned = "0";
            } else if (door.dataset.spinned === "1") {
                return;
            }

            const boxes = door.querySelector(".boxes");
            const boxesClone = boxes.cloneNode(false);

            const pool = characterImg ? [`<img src="${characterImg}" class="slot-character-img">`] : [];
            if (!firstInit) {
                const arr = [];
                for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                    arr.push(...items);
                }
                pool.push(...shuffle(arr));
            }

            for (let i = pool.length - 1; i >= 0; i--) {
                const box = document.createElement("div");
                box.classList.add("box");
                box.style.width = door.clientWidth + " px";
                box.style.height = door.clientHeight + "px";
                box.innerHTML = pool[i];
                boxesClone.appendChild(box);
            }
            boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
            boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
            door.replaceChild(boxesClone, boxes);
        }
    }

    function shuffle([...arr]) {
        let m = arr.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr;
    }

    init();
})();