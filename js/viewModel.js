// Genel Kültür Soruları
const questions = [
    {
        question: "Türkiye'nin başkenti neresidir?",
        options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
        correct: 1
    },
    {
        question: "Dünyanın en büyük okyanusu hangisidir?",
        options: ["Atlantik Okyanusu", "Hint Okyanusu", "Pasifik Okyanusu", "Kuzey Buz Denizi"],
        correct: 2
    },
    {
        question: "Ay'a ilk ayak basan insan kimdir?",
        options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"],
        correct: 1
    },
    {
        question: "Türkiye'nin en uzun nehri hangisidir?",
        options: ["Fırat", "Dicle", "Kızılırmak", "Sakarya"],
        correct: 2
    },
    {
        question: "Mona Lisa tablosunu kim yapmıştır?",
        options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
        correct: 1
    },
    {
        question: "Dünyada en fazla konuşulan dil hangisidir?",
        options: ["İngilizce", "Çince (Mandarin)", "İspanyolca", "Arapça"],
        correct: 1
    },
    {
        question: "Periyodik tabloda 'Au' sembolü hangi elementi temsil eder?",
        options: ["Gümüş", "Bakır", "Altın", "Demir"],
        correct: 2
    },
    {
        question: "Hangi gezegen 'Kırmızı Gezegen' olarak bilinir?",
        options: ["Venüs", "Mars", "Jüpiter", "Satürn"],
        correct: 1
    },
    {
        question: "İlk modern Olimpiyat Oyunları hangi yıl düzenlenmiştir?",
        options: ["1892", "1896", "1900", "1904"],
        correct: 1
    },
    {
        question: "Hangi ülke piramitleri ile ünlüdür?",
        options: ["Meksika", "Peru", "Mısır", "Hindistan"],
        correct: 2
    }
];

// Quiz durumu
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let selectedAnswer = null;

// DOM elementleri
let startScreen;
let quizScreen;
let resultScreen;
let startBtn;
let questionElement;
let optionsElement;
let nextBtn;
let timerElement;
let progressElement;
let finalScoreElement;
let playAgainBtn;
let timerDisplay;

// Quiz'i başlat
export function initQuiz() {
    // DOM elementlerini al
    startScreen = document.querySelector('.start-screen');
    quizScreen = document.querySelector('.quiz-screen');
    resultScreen = document.querySelector('.result-screen');
    startBtn = document.querySelector('.start-btn');
    questionElement = document.querySelector('.question');
    optionsElement = document.querySelector('.options');
    nextBtn = document.querySelector('.next-btn');
    timerElement = document.querySelector('.timer');
    progressElement = document.getElementById('progress');
    finalScoreElement = document.getElementById('final-score');
    playAgainBtn = document.querySelector('.play-again-btn');
    timerDisplay = document.getElementById('time');

    // Başlangıçta quiz ve sonuç ekranını gizle
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    timerElement.style.display = 'none';

    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    playAgainBtn.addEventListener('click', restartQuiz);
}

// Quiz'i başlat
function startQuiz() {
    startScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    timerElement.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

// Soruyu yükle
function loadQuestion() {
    // Timer'ı sıfırla
    clearInterval(timer);
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    timerElement.classList.remove('warning');
    selectedAnswer = null;
    nextBtn.disabled = true;

    // Soruyu göster
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;

    // Seçenekleri göster
    optionsElement.innerHTML = '';
    q.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectAnswer(index));
        optionsElement.appendChild(optionDiv);
    });

    // İlerlemeyi güncelle
    progressElement.textContent = `${currentQuestion + 1}/10`;

    // Timer'ı başlat
    startTimer();
}

// Timer'ı başlat
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 10) {
            timerElement.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(-1); // Zaman doldu, yanlış cevap
        }
    }, 1000);
}

// Cevap seç
function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return; // Zaten seçilmiş

    selectedAnswer = answerIndex;
    clearInterval(timer);
    checkAnswer(answerIndex);
}

// Cevabı kontrol et
function checkAnswer(answerIndex) {
    const options = document.querySelectorAll('.option');
    const correctAnswer = questions[currentQuestion].correct;

    if (answerIndex === correctAnswer) {
        score++;
        options[answerIndex].classList.add('correct');
    } else {
        if (answerIndex >= 0) {
            options[answerIndex].classList.add('wrong');
        }
        options[correctAnswer].classList.add('correct');
    }

    // Tüm seçenekleri devre dışı bırak
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });

    nextBtn.disabled = false;
}

// Sonraki soru
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Sonuçları göster
function showResults() {
    quizScreen.style.display = 'none';
    timerElement.style.display = 'none';
    resultScreen.style.display = 'block';
    finalScoreElement.textContent = `${score}/10`;

    // Skoru kaydet
    saveScore(score);
}

// Skoru kaydet
function saveScore(finalScore) {
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const newScore = {
        score: finalScore,
        total: 10,
        date: new Date().toLocaleDateString('tr-TR'),
        time: new Date().toLocaleTimeString('tr-TR')
    };
    scores.push(newScore);
    localStorage.setItem('quizScores', JSON.stringify(scores));
}

// Quiz'i yeniden başlat
function restartQuiz() {
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
    currentQuestion = 0;
    score = 0;
}
