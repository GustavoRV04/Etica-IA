
const app = document.getElementById('app');
const modal = document.getElementById('modal-referencias');
const closeBtn = modal ? modal.querySelector('.close-btn') : null; 
let currentModule = 0;
let userScore = 0;

// A PARTIR DESTA LINHA, SUBSTITUA A DEFINIÇÃO COMPLETA DE const modules = [...] NO SEU script.js:
const modules = [
    // MÓDULO 0: INTRODUÇÃO
    {
        title: "IA em Foco: Você Trocaria Sua Liberdade por Conveniência?",
        content: `
            <p>Bem-vindo(a) ao manifesto interativo sobre Ética em IA. Explore os riscos da Tecnologia de Reconhecimento Facial (TRF) no Brasil.</p>
            [cite_start]<p>O debate central, levantado por Nina da Hora, é sobre **Trocar praticidade por vigilância** [cite: 34] [cite_start]e os **Racismo e outros problemas embutidos nas IAs**[cite: 35].</p>
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
        feedback: "A própria Nina se deparou com sistemas de reconhecimento que não a reconheciam[cite: 29]. [cite_start]Isso a motivou a expandir seu olhar para a **interface entre tecnologia e sociedade** [cite: 30] [cite_start]e estudar os vieses raciais[cite: 30].",
        action: (index) => {
            // Ação específica para este módulo
        },
        isQuiz: false
    },
    // MÓDULO 2: CASO REAL 1 - O FALSO POSITIVO
    {
        title: "Módulo 2: O Falso Positivo e o Racismo Algorítmico",
        subtitle: "Caso Real: Vigilante Preso Injustamente na Bahia (2022)",
        question: `
            [cite_start]<p>O sistema de TRF acusa 95% de similaridade com um criminoso[cite: 49]. [cite_start]O **vigilante negro perdeu o emprego** [cite: 54] [cite_start]após 26 dias preso por erro do sistema[cite: 43].</p>
            [cite_start]<p>Sabendo que **mais de 90% das prisões envolvem pessoas negras** [cite: 12, 58] [cite_start]e o erro chega a **40% para mulheres negras**[cite: 59], como desenvolvedor(a), você liberaria o sistema para uso imediato em segurança pública?</p>
        `,
        options: [
            { text: "Sim, priorizando a 'eficiência' e ignorando a taxa de erro para minorias.", correct: false },
            { text: "Não, o risco de prisões arbitrárias e letalidade policial é inaceitável. [Correta]", correct: true }
        ],
        feedback: "Você está certo. O caso exemplifica o **racismo algorítmico** [cite: 57] e a falha de transparência. A responsabilidade ética exige que sistemas falhos (e viesados) não sejam implementados em contextos de vida ou morte.",
        isQuiz: true
    },
    // MÓDULO 3: CASO REAL 2 - A FALHA INSTITUCIONAL
    {
        title: "Módulo 3: A Falha Institucional e a Expansão Ilegal",
        subtitle: "Caso Real: Teste do Maracanã (2019)",
        question: `
            [cite_start]<p>Um teste no Maracanã teve **margem de erro de 64%**[cite: 67]. [cite_start]Como executivo(a), você aceitaria uma parceria para expandir essa TRF para 20 estádios, incluindo o cadastro de **30 mil crianças** (violando o ECA e LGPD) [cite: 72] em troca de um contrato multimilionário?</p>
        `,
        options: [
            { text: "Sim, o lucro e a 'sensação de segurança' superam o risco.", correct: false },
            { text: "Não, a falha técnica (64% de erro) e a violação do ECA/LGPD são inegociáveis. [Correta]", correct: true }
        ],
        feedback: "Correto. O caso demonstra a falta de conscientização sobre as **limitações técnicas** [cite: 74] e como a **expansão sem controle** leva à violação de direitos fundamentais.",
        isQuiz: true
    },
    // MÓDULO 4: CONCLUSÃO
    {
        title: "Módulo 4: Conclusão - Sua Pontuação",
        content: `
            <h2 id="final-score">Resultado da Jornada Ética: Carregando...</h2>
            <h3>Principais Riscos Éticos no Brasil (Resumo)</h3>
            <ul>
                [cite_start]<li>**Risco de criminalização de populações vulneráveis:** O TRF erra mais com rostos negros e reforça uma dinâmica violenta[cite: 17, 19].</li>
                [cite_start]<li>**Risco de vigilância política e social:** Usada para monitorar torcidas organizadas, protestos e blocos de carnaval, criando um efeito inibidor sobre a liberdade de manifestação[cite: 14, 15, 16].</li>
                [cite_start]<li>**Risco institucional de expansão sem controle:** Estados testaram sistemas em parceria com empresas privadas e sem debate público[cite: 21, 23].</li>
                [cite_start]<li>**Risco democrático:** A TRF pode se tornar instrumento de vigilância massiva contra opositores, jornalistas ou movimentos sociais[cite: 26].</li>
            </ul>
            [cite_start]<p>O desenvolvimento ético exige: questionar os **vieses embutidos** [cite: 80][cite_start], compreender as **consequências sociais** [cite: 80] [cite_start]e assumir a **responsabilidade ética**[cite: 80].</p>
            <button onclick="showReferences()">Ver Referências e Manifesto</button>
        `,
        isQuiz: false
    }
];


// Função para renderizar o módulo atual
function renderModule() {
    const module = modules[currentModule];
    
    // Configura o conteúdo HTML
    let htmlContent = `<h1>${module.title}</h1>`;
    if (module.subtitle) {
        htmlContent += `<h2>${module.subtitle}</h2>`;
    }
    htmlContent += `<div class="question-box">`;
    htmlContent += module.content || '';

    if (module.question) {
        htmlContent += `<p><strong>${module.question}</strong></p>`;
        
        // Mapeia as opções para botões
        htmlContent += module.options.map((opt, index) => {
            const isCorrectValue = module.isQuiz ? opt.correct : 'null';
            
            // Certifique-se que o isCorrectValue é passado como string literal ou valor booleano
            return `<button onclick="handleAnswer(${index}, ${isCorrectValue})">${opt.text}</button>`;
        }).join('');
    }

    htmlContent += `</div>`;
    app.innerHTML = htmlContent;

    // Lógica específica para atualizar a pontuação no módulo final
    if (currentModule === modules.length - 1) {
         const scoreElement = document.getElementById('final-score');
         if(scoreElement) {
             scoreElement.innerHTML = `Resultado da Jornada Ética: Você respondeu corretamente a ${userScore} de 2 questões de risco ético.`;
         }
    }
}

// Função para avançar para o próximo módulo
function nextModule() {
    currentModule++;
    if (currentModule < modules.length) {
        renderModule();
    }
}

// Função para lidar com a resposta do usuário
function handleAnswer(optionIndex, isCorrect) {
    const module = modules[currentModule];
    
    // Se for um módulo de quiz (Módulos 2 e 3)
    if (module.isQuiz) {
        if (isCorrect === true) {
            userScore++;
            alert(`Resposta correta! ${module.feedback}`);
        } else {
            alert(`Resposta registrada. ${module.feedback}`);
        }
    } else if (currentModule === 1) { // Módulo 1 (Apenas feedback)
        alert(module.feedback);
    }
    
    nextModule();
}

// Função para abrir o modal de referências
function showReferences() {
    if (modal) {
        modal.style.display = 'block';
    }
}

// Inicializa a aplicação e configura os listeners de eventos
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a renderização do primeiro módulo
    renderModule();
    
    // Configura os listeners para fechar o modal, se ele existir
    if (modal && closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});
