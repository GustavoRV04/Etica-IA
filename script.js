
const app = document.getElementById('app');
const modal = document.getElementById('modal-referencias');
const closeBtn = modal ? modal.querySelector('.close-btn') : null;

let currentModule = 0;
let userScore = 0;

// ============================================================================
// MÓDULOS DA APLICAÇÃO
// ============================================================================

const modules = [
    // MÓDULO 0
    {
        title: "IA em Foco: Você Trocaria Sua Liberdade por Conveniência?",
        content: `
            <p>Bem-vindo(a) ao manifesto interativo sobre Ética em IA. Explore os riscos da Tecnologia de Reconhecimento Facial (TRF) no Brasil.</p>
            [cite_start]<p>O debate central, levantado por Nina da Hora, é sobre <strong>Trocar praticidade por vigilância</strong> [cite: 34] 
            [cite_start]e os <strong>Racismo e outros problemas embutidos nas IAs</strong>[cite: 35].</p>
            <button onclick="nextModule()">Iniciar Jornada Ética</button>
        `,
        isQuiz: false
    },

    // MÓDULO 1
    {
        title: "Módulo 1: O Alerta de Nina da Hora",
        question: "Qual a sua maior preocupação com a IA hoje?",
        options: [
            { text: "O Viés e a Discriminação Algorítmica" },
            { text: "A Expansão sem Controle de Sistemas de Vigilância" },
            { text: "A Falta de Transparência e Prestação de Contas" }
        ],
        feedback: `
            A própria Nina se deparou com sistemas de reconhecimento que não a reconheciam[cite: 29]. 
            [cite_start]Isso a motivou a expandir seu olhar para a <strong>interface entre tecnologia e sociedade</strong> [cite: 30] 
            [cite_start]e estudar os vieses raciais[cite: 30].
        `,
        action: () => {},
        isQuiz: false
    },

    // MÓDULO 2
    {
        title: "Módulo 2: O Falso Positivo e o Racismo Algorítmico",
        subtitle: "Caso Real: Vigilante Preso Injustamente na Bahia (2022)",
        question: `
            [cite_start]<p>O sistema de TRF acusa 95% de similaridade com um criminoso[cite: 49]. 
            [cite_start]O <strong>vigilante negro perdeu o emprego</strong> [cite: 54] 
            [cite_start]após 26 dias preso por erro do sistema[cite: 43].</p>

            [cite_start]<p>Sabendo que <strong>mais de 90% das prisões envolvem pessoas negras</strong> [cite: 12, 58] 
            [cite_start]e que o erro chega a <strong>40% para mulheres negras</strong>[cite: 59], como desenvolvedor(a), 
            você liberaria o sistema para uso imediato em segurança pública?</p>
        `,
        options: [
            { text: "Sim, priorizando a 'eficiência' e ignorando a taxa de erro para minorias.", correct: false },
            { text: "Não, o risco de prisões arbitrárias e letalidade policial é inaceitável. [Correta]", correct: true }
        ],
        feedback: `
            Você está certo. O caso exemplifica o <strong>racismo algorítmico</strong> [cite: 57] e a falha de transparência. 
            A responsabilidade ética exige que sistemas falhos e viesados não sejam implementados em contextos de vida ou morte.
        `,
        isQuiz: true
    },

    // MÓDULO 3
    {
        title: "Módulo 3: A Falha Institucional e a Expansão Ilegal",
        subtitle: "Caso Real: Teste do Maracanã (2019)",
        question: `
            [cite_start]<p>Um teste no Maracanã teve <strong>margem de erro de 64%</strong>[cite: 67]. 
            [cite_start]Como executivo(a), você aceitaria uma parceria para expandir essa TRF para 20 estádios, incluindo 
            o cadastro de <strong>30 mil crianças</strong> (violando o ECA e a LGPD) [cite: 72], em troca de um contrato multimilionário?</p>
        `,
        options: [
            { text: "Sim, o lucro e a 'sensação de segurança' superam o risco.", correct: false },
            { text: "Não, a falha técnica (64% de erro) e a violação do ECA/LGPD são inegociáveis. [Correta]", correct: true }
        ],
        feedback: `
            Correto. O caso demonstra a falta de consciência sobre as <strong>limitações técnicas</strong> [cite: 74] e como 
            a <strong>expansão sem controle</strong> leva à violação de direitos fundamentais.
        `,
        isQuiz: true
    },

    // MÓDULO 4 – CONCLUSÃO
    {
        title: "Módulo 4: Conclusão - Sua Pontuação",
        content: `
            <h2 id="final-score">Resultado da Jornada Ética: Carregando...</h2>

            <h3>Principais Riscos Éticos no Brasil (Resumo)</h3>
            <ul>
                <li>[cite_start]<strong>Criminalização de populações vulneráveis:</strong> O TRF erra mais com rostos negros e reforça uma dinâmica violenta[cite: 17, 19].</li>
                <li>[cite_start]<strong>Vigilância política e social:</strong> Usado para monitorar torcidas, protestos e blocos de carnaval[cite: 14, 15, 16].</li>
                <li>[cite_start]<strong>Expansão institucional sem controle:</strong> Estados testaram sistemas sem debate público[cite: 21, 23].</li>
                <li>[cite_start]<strong>Risco democrático:</strong> Possibilidade de vigilância massiva contra opositores, jornalistas e movimentos sociais[cite: 26].</li>
            </ul>

            [cite_start]<p>O desenvolvimento ético exige: questionar os <strong>vieses embutidos</strong> [cite: 80], 
            compreender as <strong>consequências sociais</strong> [cite: 80] e assumir a 
            <strong>responsabilidade ética</strong>[cite: 80].</p>

            <button onclick="showReferences()">Ver Referências e Manifesto</button>
        `,
        isQuiz: false
    }
];

// ============================================================================
// FUNÇÕES PRINCIPAIS
// ============================================================================

function renderModule() {
    const module = modules[currentModule];

    let html = `<h1>${module.title}</h1>`;
    if (module.subtitle) html += `<h2>${module.subtitle}</h2>`;

    html += `<div class="question-box">`;
    if (module.content) html += module.content;

    if (module.question) {
        html += `<p><strong>${module.question}</strong></p>`;
        html += module.options.map((opt, index) => {
            const val = module.isQuiz ? opt.correct : "null";
            return `<button onclick="handleAnswer(${index}, ${val})">${opt.text}</button>`;
        }).join("");
    }

    html += `</div>`;
    app.innerHTML = html;

    if (currentModule === modules.length - 1) {
        const scoreElement = document.getElementById("final-score");
        if (scoreElement) {
            scoreElement.innerHTML = `Resultado da Jornada Ética: Você acertou ${userScore} de 2 questões.`;
        }
    }
}

function nextModule() {
    currentModule++;
    if (currentModule < modules.length) renderModule();
}

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

function showReferences() {
    if (modal) modal.style.display = "block";
}

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    renderModule();

    if (modal && closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";

        window.onclick = event => {
            if (event.target === modal) modal.style.display = "none";
        };
    }
});
