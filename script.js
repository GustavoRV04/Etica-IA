const app = document.getElementById('app');
const modal = document.getElementById('modal-referencias');
const closeBtn = modal ? modal.querySelector('.close-btn') : null; 

let currentModule = 0;
let userScore = 0;

// ------------------------------------------------------------------------------------
// MÓDULOS LIMPOS, SEM CITAÇÕES, E COM O NOVO MÓDULO 5
// ------------------------------------------------------------------------------------

const modules = [
    // MÓDULO 0: INTRODUÇÃO
    {
        title: "IA em Foco: Você Trocaria Sua Liberdade por Conveniência?",
        content: `
            <p>Bem-vindo(a) ao manifesto interativo sobre Ética em IA. Explore os riscos da Tecnologia de Reconhecimento Facial (TRF) no Brasil.</p>
            <p>O debate central é sobre o impacto da tecnologia na nossa liberdade e como sistemas automatizados podem reforçar desigualdades ou permitir vigilância sem controle.</p>
            <button onclick="nextModule()">Iniciar Jornada Ética</button>
        `,
        isQuiz: false
    },

    // MÓDULO 1: O ALERTA DE NINA
    {
        title: "Módulo 1: O Alerta de Nina da Hora",
        question: "Qual a sua maior preocupação com a IA hoje?",
        options: [
            { text: "O Viés e a Discriminação Algorítmica" },
            { text: "A Expansão sem Controle de Sistemas de Vigilância" },
            { text: "A Falta de Transparência e Prestação de Contas" }
        ],
        feedback: "A pesquisadora Nina da Hora chamou atenção para como sistemas de reconhecimento facial podem falhar mais com pessoas negras e como isso se conecta a desigualdades históricas.",
        isQuiz: false
    },

    // MÓDULO 2: CASO REAL 1 — FALSO POSITIVO
    {
        title: "Módulo 2: O Falso Positivo e o Racismo Algorítmico",
        subtitle: "Caso Real: Vigilante Preso Injustamente na Bahia",
        question: `
            <p>Um sistema de reconhecimento facial identificou erroneamente um vigilante como criminoso procurado. Ele perdeu o emprego e ficou preso por semanas devido ao erro do algoritmo.</p>
            <p>Sabendo que erros desse tipo atingem desproporcionalmente pessoas negras, você autorizaria o uso desse sistema em segurança pública?</p>
        `,
        options: [
            { text: "Sim, priorizando eficiência mesmo com riscos.", correct: false },
            { text: "Não, o risco de prisões injustas é inaceitável. [Correta]", correct: true }
        ],
        feedback: "Esse caso exemplifica o impacto de sistemas enviesados e como erros podem destruir vidas. Tecnologias com alto potencial de dano exigem extrema responsabilidade.",
        isQuiz: true
    },

    // MÓDULO 3: CASO REAL 2 — FALHA INSTITUCIONAL
    {
        title: "Módulo 3: A Falha Institucional e a Expansão Ilegal",
        subtitle: "Caso Real: Testes no Maracanã",
        question: `
            <p>Um teste em estádio apresentou margens de erro elevadíssimas, mas mesmo assim houve propostas de expansão para outros locais, incluindo cadastro de crianças sem consentimento adequado.</p>
            <p>Como gestor(a), você aceitaria expandir o sistema para dezenas de estádios?</p>
        `,
        options: [
            { text: "Sim, priorizando lucro e sensação de segurança.", correct: false },
            { text: "Não, a combinação de falhas técnicas e riscos legais é inaceitável. [Correta]", correct: true }
        ],
        feedback: "Sistemas falhos usados em escala nacional podem gerar riscos legais, sociais e institucionais graves. Decisões éticas devem considerar impacto coletivo.",
        isQuiz: true
    },

    // MÓDULO 4: CONCLUSÃO
    {
        title: "Módulo 4: Conclusão - Sua Pontuação",
        content: `
            <h2 id="final-score">Resultado da Jornada Ética: Carregando...</h2>
            <h3>Principais Riscos Éticos no Brasil</h3>
            <ul>
                <li>Risco de criminalização injusta de populações vulneráveis.</li>
                <li>Possibilidade de vigilância política e social sem controle.</li>
                <li>Expansão institucional de tecnologias opacas.</li>
                <li>Risco democrático de monitoramento de opositores ou movimentos sociais.</li>
            </ul>
            <p>O desenvolvimento ético exige compreender riscos, analisar impactos e assumir responsabilidades sociais e técnicas.</p>
            <button onclick="nextModule()">Avançar</button>
        `,
        isQuiz: false
    },

    // MÓDULO 5: DECISÃO FINAL
    {
        title: "Módulo 5: Decisão Final — A Responsabilidade Está em Suas Mãos",
        subtitle: "Reflexão Ética Aplicada",
        content: `
            <p>Agora que você entendeu os principais riscos, chegou o momento decisivo.</p>

            <p>Imagine que você deve emitir um parecer final recomendando ou não a adoção de um sistema nacional de reconhecimento facial.</p>

            <p>Considere:</p>
            <ul>
                <li>Margens de erro e impactos sociais;</li>
                <li>Vigilância em massa e privacidade;</li>
                <li>Riscos institucionais e legais;</li>
                <li>Consequências caso o sistema falhe.</li>
            </ul>

            <p><strong>Qual é sua decisão final?</strong></p>

            <button onclick="handleFinalDecision('nao')">Recomendo NÃO implementar</button>
            <button onclick="handleFinalDecision('talvez')">Implementar apenas com salvaguardas fortes</button>
            <button onclick="handleFinalDecision('sim')">Recomendo implementar</button>
        `,
        isQuiz: false
    }
];

// ------------------------------------------------------------------------------------
// RENDERIZAÇÃO
// ------------------------------------------------------------------------------------

function renderModule() {
    const module = modules[currentModule];
    
    let htmlContent = `<h1>${module.title}</h1>`;

    if (module.subtitle) {
        htmlContent += `<h2>${module.subtitle}</h2>`;
    }

    htmlContent += `<div class="question-box">`;
    htmlContent += module.content || '';

    if (module.question) {
        htmlContent += `<p><strong>${module.question}</strong></p>`;
        
        htmlContent += module.options.map((opt, index) => {
            const isCorrectValue = module.isQuiz ? opt.correct : 'null';
            return `<button onclick="handleAnswer(${index}, ${isCorrectValue})">${opt.text}</button>`;
        }).join('');
    }

    htmlContent += `</div>`;
    app.innerHTML = htmlContent;

    if (currentModule === modules.length - 2) {
        const scoreElement = document.getElementById('final-score');
        if (scoreElement) {
            scoreElement.innerHTML = 
                `Resultado da Jornada Ética: Você respondeu corretamente a ${userScore} de 2 questões.`;
        }
    }
}

// ------------------------------------------------------------------------------------
// NAVEGAÇÃO
// ------------------------------------------------------------------------------------

function nextModule() {
    currentModule++;
    if (currentModule < modules.length) {
        renderModule();
    }
}

// ------------------------------------------------------------------------------------
// QUIZ
// ------------------------------------------------------------------------------------

function handleAnswer(optionIndex, isCorrect) {
    const module = modules[currentModule];

    if (module.isQuiz) {
        if (isCorrect === true) {
            userScore++;
            alert(`Resposta correta! ${module.feedback}`);
        } else {
            alert(`Resposta registrada. ${module.feedback}`);
        }
    } else if (currentModule === 1) {
        alert(module.feedback);
    }
    
    nextModule();
}

// ------------------------------------------------------------------------------------
// DECISÃO FINAL DO MÓDULO 5
// ------------------------------------------------------------------------------------

function handleFinalDecision(decision) {
    if (decision === "nao") {
        alert("Você decidiu não implementar. Uma postura alinhada à proteção de direitos fundamentais.");
    } else if (decision === "talvez") {
        alert("Você recomendou implementar com salvaguardas. Isso exige auditorias, transparência e controle público.");
    } else {
        alert("Você recomendou implementar. Essa decisão carrega grande responsabilidade ética e institucional.");
    }

    nextModule();
}

// ------------------------------------------------------------------------------------
// MODAL
// ------------------------------------------------------------------------------------

function showReferences() {
    if (modal) {
        modal.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderModule();

    if (modal && closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
});


