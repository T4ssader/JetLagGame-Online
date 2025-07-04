const HAND_LIMIT = 5;
let deck = [];
let hand = [];
let questions = {};

function loadDeck() {
    if (localStorage.getItem('deck')) {
        deck = JSON.parse(localStorage.getItem('deck'));
    } else {
        fetch('deck.json')
            .then(r => r.json())
            .then(data => {
                deck = [];
                data.cards.forEach(cardType => {
                    for (let i = 0; i < cardType.amount; i++) {
                        deck.push({ title: cardType.title, description: cardType.description });
                    }
                });
                saveState();
                updateDeckCount();
            });
    }
}

function loadHand() {
    if (localStorage.getItem('hand')) {
        hand = JSON.parse(localStorage.getItem('hand'));
    }
}

function loadQuestions() {
    fetch('questions.json')
        .then(r => r.json())
        .then(data => {
            questions = data;
            renderCategories();
        });
}

function saveState() {
    localStorage.setItem('deck', JSON.stringify(deck));
    localStorage.setItem('hand', JSON.stringify(hand));
}

function updateDeckCount() {
    document.getElementById('deck-count').textContent = `Deck: ${deck.length} cards`;
}

function renderHand() {
    const handDiv = document.getElementById('hand');
    handDiv.innerHTML = '';
    hand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = card.title;
        const desc = document.createElement('p');
        desc.textContent = card.description;
        cardDiv.appendChild(title);
        cardDiv.appendChild(desc);
        const discardBtn = document.createElement('button');
        discardBtn.textContent = 'X';
        discardBtn.onclick = () => {
            hand.splice(index, 1);
            saveState();
            renderHand();
        };
        cardDiv.appendChild(discardBtn);
        handDiv.appendChild(cardDiv);
    });
    updateDeckCount();
}

function drawCard() {
    if (deck.length === 0 || hand.length >= HAND_LIMIT) return;
    const idx = Math.floor(Math.random() * deck.length);
    const card = deck.splice(idx, 1)[0];
    hand.push(card);
    saveState();
    renderHand();
}

function renderCategories() {
    const catDiv = document.getElementById('categories');
    catDiv.innerHTML = '';
    Object.keys(questions).forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.onclick = () => showQuestions(cat);
        catDiv.appendChild(btn);
    });
}

function showQuestions(category) {
    const qDiv = document.getElementById('questions');
    qDiv.innerHTML = '';
    questions[category].forEach(q => {
        const p = document.createElement('p');
        p.textContent = q;
        qDiv.appendChild(p);
    });
    qDiv.classList.remove('hidden');
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

document.getElementById('choose-hider').onclick = () => {
    showScreen('hider-screen');
    renderHand();
};

document.getElementById('choose-seeker').onclick = () => {
    showScreen('seeker-screen');
};

document.getElementById('back-from-hider').onclick = () => showScreen('role-selection');

document.getElementById('back-from-seeker').onclick = () => showScreen('role-selection');

document.getElementById('draw-card').onclick = drawCard;

window.onload = () => {
    loadDeck();
    loadHand();
    loadQuestions();
    renderHand();
};
