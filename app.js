// Data structure containing questions and details matching the poster content
const quizData = [
    {
        question: "O diabetes tipo 1 é causado principalmente por quê?",
        options: [
            "Comer muito açúcar",
            "Falta de exercício físico",
            "Ataque do sistema imunológico às células beta",
            "Beber pouca água"
        ],
        correct: 2, // C
        feedback: "Isso mesmo! No diabetes tipo 1, o sistema imune destrói células beta produtoras de insulina.",
        tag: "Causa & Autoimunidade",
        icon: "🧬"
    },
    {
        question: "Qual é o papel do sistema imune inato nessa doença?",
        options: [
            "Produzir insulina",
            "Reconhecer o dano, inflamar e apresentar antígenos",
            "Medir a glicose no sangue",
            "Curar o pâncreas"
        ],
        correct: 1, // B
        feedback: "Correto! A imunidade inata inicia e coordena a inflamação.",
        tag: "Sistema Imune Inato",
        icon: "🛡️"
    },
    {
        question: "Qual parte do sistema imune destrói diretamente as células beta?",
        options: [
            "Linfócitos T CD8+",
            "Hemácias",
            "Plaquetas",
            "Neurônios"
        ],
        correct: 0, // A
        feedback: "Muito bem! Os linfócitos T CD8+ são importantes na destruição das células beta.",
        tag: "Sistema Imune Adaptativo",
        icon: "🔬"
    },
    {
        question: "Qual é o papel principal do sistema complemento no diabetes tipo 1?",
        options: [
            "Produzir autoanticorpos",
            "Produzir insulina",
            "Amplificar a inflamação",
            "Substituir as células beta"
        ],
        correct: 2, // C
        feedback: "Exato! O complemento pode aumentar a inflamação e o recrutamento de células imunes.",
        tag: "Sistema Complemento",
        icon: "⚡"
    },
    {
        question: "Para que servem os autoanticorpos no diabetes tipo 1?",
        options: [
            "Para ajudar no diagnóstico da resposta autoimune",
            "Para aumentar a produção de insulina",
            "Para curar a doença",
            "Para medir a pressão arterial"
        ],
        correct: 0, // A
        feedback: "Perfeito! Autoanticorpos como anti-GAD65, anti-IA2, anti-ZnT8 e anti-insulina ajudam no diagnóstico.",
        tag: "Diagnóstico & Autoanticorpos",
        icon: "🩸"
    }
];

// App State Management
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const btnStart = document.getElementById('btn-start');
const btnNext = document.getElementById('btn-next');
const btnRestart = document.getElementById('btn-restart');
const btnHome = document.getElementById('btn-home');

const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');
const progressBarFill = document.getElementById('progress-bar-fill');

const tagIcon = document.getElementById('tag-icon');
const tagText = document.getElementById('tag-text');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const feedbackCard = document.getElementById('feedback-card');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');

const scoreNumber = document.getElementById('score-number');
const resultTitle = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');

// Audio Control Elements
const bgMusic = document.getElementById('bg-music');
const btnMusicToggle = document.getElementById('btn-music-toggle');
const musicIcon = document.getElementById('music-icon');
let isMusicPlaying = false;

function playAudio() {
    if (!bgMusic || isMusicPlaying) return;
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        if (btnMusicToggle) btnMusicToggle.classList.add('playing');
        if (musicIcon) musicIcon.textContent = '🔊';
    }).catch(err => {
        console.log("Autoplay aguardando primeira interação do usuário:", err);
    });
}

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        if (btnMusicToggle) btnMusicToggle.classList.remove('playing');
        if (musicIcon) musicIcon.textContent = '🔇';
    } else {
        playAudio();
    }
}

if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita acionar o listener global
        toggleMusic();
    });
}

// Tenta tocar imediatamente ao carregar a página
window.addEventListener('DOMContentLoaded', playAudio);
playAudio();

// Garante o início da música ao primeiro toque/clique em qualquer lugar da tela caso o navegador tenha bloqueado o autoplay
const handleFirstInteraction = () => {
    if (!isMusicPlaying) {
        playAudio();
    }
    ['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => {
        document.removeEventListener(evt, handleFirstInteraction);
    });
};

['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => {
    document.addEventListener(evt, handleFirstInteraction, { once: true });
});

// Event Listeners
btnStart.addEventListener('click', startQuiz);
btnNext.addEventListener('click', handleNextQuestion);
btnRestart.addEventListener('click', restartQuiz);
btnHome.addEventListener('click', showHomeScreen);

// Functions
function switchScreen(screenToActive) {
    [startScreen, quizScreen, resultScreen].forEach(screen => {
        screen.classList.remove('active');
    });
    setTimeout(() => {
        screenToActive.classList.add('active');
    }, 50);
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    playAudio();

    switchScreen(quizScreen);
    loadQuestion();
}

function loadQuestion() {
    const currentQuiz = quizData[currentQuestionIndex];
    selectedOption = null;

    // Update Progress
    const progress = Math.round(((currentQuestionIndex + 1) / quizData.length) * 100);
    progressText.textContent = `Pergunta ${currentQuestionIndex + 1} de ${quizData.length}`;
    progressPercent.textContent = `${progress}%`;
    progressBarFill.style.width = `${progress}%`;

    // Update Question Info
    tagIcon.textContent = currentQuiz.icon;
    tagText.textContent = currentQuiz.tag;
    questionText.textContent = currentQuiz.question;

    // Hide feedback and reset next button
    feedbackCard.className = "feedback-card hidden";
    btnNext.classList.add('hidden');
    btnNext.disabled = true;
    
    if (currentQuestionIndex === quizData.length - 1) {
        btnNext.querySelector('span').textContent = "Ver Resultado Final";
    } else {
        btnNext.querySelector('span').textContent = "Próxima Pergunta";
    }

    // Render Options
    optionsContainer.replaceChildren();
    const letters = ['A', 'B', 'C', 'D'];

    currentQuiz.options.forEach((optionText, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';

        const letterSpan = document.createElement('span');
        letterSpan.className = 'option-letter';
        letterSpan.textContent = letters[index];

        const textSpan = document.createElement('span');
        textSpan.className = 'option-text';
        textSpan.textContent = optionText;

        button.appendChild(letterSpan);
        button.appendChild(textSpan);
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedIndex) {
    if (selectedOption !== null) return; // Prevent changing answer
    selectedOption = selectedIndex;

    const currentQuiz = quizData[currentQuestionIndex];
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    const isCorrect = selectedIndex === currentQuiz.correct;

    if (isCorrect) {
        score++;
        optionButtons[selectedIndex].classList.add('correct');
        showFeedback(true, "Resposta Correta! ✨", currentQuiz.feedback);
    } else {
        optionButtons[selectedIndex].classList.add('wrong');
        optionButtons[currentQuiz.correct].classList.add('correct');
        showFeedback(false, "Ops! Resposta Incorreta", currentQuiz.feedback);
    }

    // Disable all options after selection
    optionButtons.forEach(btn => btn.disabled = true);

    // Show Next Button
    btnNext.classList.remove('hidden');
    btnNext.disabled = false;
    btnNext.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showFeedback(isCorrect, title, text) {
    feedbackCard.className = `feedback-card ${isCorrect ? 'correct-feedback' : 'wrong-feedback'}`;
    feedbackIcon.textContent = isCorrect ? '✨' : '💡';
    feedbackTitle.textContent = title;
    feedbackText.textContent = text;
    feedbackCard.classList.remove('hidden');
}

function handleNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        showResults();
    }
}

function showResults() {
    switchScreen(resultScreen);
    scoreNumber.textContent = score;

    if (score === 5) {
        resultTitle.textContent = "Excepcional! 🎉";
        resultSubtitle.textContent = "Você é um expert no assunto e acertou todas as questões!";
    } else if (score >= 3) {
        resultTitle.textContent = "Muito Bem! 👏";
        resultSubtitle.textContent = "Você absorveu a maior parte dos conceitos do cartaz informativo.";
    } else {
        resultTitle.textContent = "Bom Esforço! 📚";
        resultSubtitle.textContent = "Que tal dar mais uma olhada no cartaz e tentar novamente?";
    }
}

function restartQuiz() {
    startQuiz();
}

function showHomeScreen() {
    switchScreen(startScreen);
}
