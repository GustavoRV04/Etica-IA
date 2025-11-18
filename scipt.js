const app = document.getElementById('app');
let currentModule = 0;
let userScore = 0;

// Lista de módulos e conteúdo
const modules = [
    // MÓDULO 0: INTRODUÇÃO
    {
        title: "IA em Foco: Você Trocaria Sua Liberdade por Conveniência?",
        content: `
            <p>Bem-vindo(a) ao manifesto interativo sobre Ética em IA. Explore os riscos da Tecnologia de Reconhecimento Facial (TRF) no Brasil.</p>
            <p>O debate central, levantado por Nina da Hora, é sobre **Trocar praticidade por vigilância** e os **Racismo e outros problemas embutidos nas IAs**.</p>
            <button onclick="nextModule()">Iniciar Jornada Ética</button>
        `
    },
    // MÓDULO 1: O ALERTA DE NINA
    {
        title: "Módulo 1: O Alerta de Nina da Hora",
        question: "Pergunta Inicial: Qual a sua maior preocupação com a IA hoje?",
        options: [
            { text: "O Viés e a Discriminação Algorítmica", value: 1 },
            { text: "A Expansão sem Controle de Sistemas de Vigilância", value: 2 },
            { text: "A Falta de Transparência e Prestação de Contas", value: 3 }
        ],
        feedback: "A própria Nina se deparou com sistemas de reconhecimento que não a reconheciam[cite: 29]. Isso a motivou a expandir seu olhar para a **interface entre tecnologia e sociedade**[cite: 30].",
        citation: "",
        action: (value) => console.log('Preocupação escolhida:', value) // Apenas loga, não afeta o score
    },
    // MÓDULO 2: CASO REAL 1 - O FALSO POSITIVO
    {
        title: "Módulo 2: O Falso Positivo e o Racismo Algorítmico",
        subtitle: "Caso Real: Vigilante Preso Injustamente na Bahia (2022)",
        question: `
            <p>O sistema de TRF acusa 95% de similaridade com um criminoso[cite: 49]. O **vigilante negro perdeu o emprego** após 26 dias preso por erro do sistema[cite: 54].</p>
            <p>Sabendo que **mais de 90% das prisões envolvem pessoas negras**  e o erro chega a **40% para mulheres negras**, como desenvolvedor(a), você liberaria o sistema para uso imediato em segurança pública?</p>
        `,
        options: [
            { text: "Sim, priorizando a 'eficiência' e ignorando a taxa de erro para minorias.", score: 0 },
            { text: "Não, o risco de prisões arbitrárias e letalidade policial é inaceitável.", score: 1 }
        ],
        feedback: "Você está certo. O caso exemplifica o **racismo algorítmico** e a falha de transparência. A responsabilidade ética exige que sistemas falhos (e viesados) não sejam implementados em contextos de vida ou morte. O risco democrático é real[cite: 25].",
        citation: "[cite: 12, 54, 58, 59]",
        action: (score) => userScore += score
    },
    // MÓDULO 3: CASO REAL 2 - A FALHA INSTITUCIONAL
    {
        title: "Módulo 3: A Falha Institucional e a Expansão Ilegal",
        subtitle: "Caso Real: Teste do Maracanã (2019)",
        question: `
            <p>Um teste no Maracanã teve **margem de erro de 64%** (7 de 11 detidos foram erro).</p>
            <p>Como executivo(a), você aceitaria uma parceria para expandir essa TRF para 20 estádios, incluindo o cadastro de **30 mil crianças**  (violando o ECA e LGPD) em troca de um contrato multimilionário?</p>
        `,
        options: [
            { text: "Sim, o lucro e a 'sensação de segurança' superam o risco.", score: 0 },
            { text: "Não, a falha técnica (64% de erro) e a violação do ECA/LGPD são inegociáveis. É um risco democrático.", score: 1 }
        ],
        feedback: "Correto. O caso demonstra a falta de conscientização sobre as **limitações técnicas** e como a **expansão sem controle** (Risco Institucional) leva à violação de direitos fundamentais. A tecnologia não está pronta[cite: 74].",
        citation: "[cite: 67, 72, 75]",
        action: (score) => userScore += score
    },
    // MÓDULO 4: CONCLUSÃO
    {
        title: "Módulo 4: Conclusão - Sua Pontuação",
        content: `
            <h2>Resultado da Jornada Ética</h2>
            <p>Você respondeu corretamente a ${userScore} de 2 questões de risco ético.</p>
            <h3>Principais Riscos Éticos no Brasil (Resumo)</h3>
            <ul>
                <li>**Risco de criminalização de populações vulneráveis:** O TRF erra mais com rostos negros e reforça uma dinâmica violenta[cite: 18, 19].</li>
                <li>**Risco de vigilância política e social:** Usada para monitorar protestos e cria efeito inibidor sobre a liberdade de manifestação[cite: 15, 16].</li>
                <li>**Risco institucional de expansão sem controle:** Testes sem debate público, muitas vezes em parceria com empresas privadas[cite: 23].</li>
                <li>**Risco democrático:** Pode se tornar instrumento de vigilância massiva contra opositores e movimentos sociais[cite: 26].</li>
            </ul>
            <p>O desenvolvimento ético exige: questionar os **vieses embutidos**, compreender as **consequências sociais** e assumir a **responsabilidade ética**.</p>
            <button onclick="showReferences()">Ver Referências e Manifesto</button>
        `
    }
];

// Função para renderizar o módulo atual
function renderModule() {
    const module = modules[currentModule];
    app.innerHTML = `
        <h1>${module.title}</h1>
        ${module.subtitle ? `<h2>${module.subtitle}</h2>` : ''}
        <div class="question-box">
            ${module.content || ''}
            ${module.question ? `<p><strong>${module.question}</strong></p>` : ''}
            ${module.options ? module.options.map((opt, index) => `
                <button onclick="handleAnswer(${index}, ${opt.score !== undefined ? opt.score : 'null'})">
                    ${opt.text}
                </button>
            `).join('') : ''}
            ${module.citation ? `<span class="citation">${module.citation}</span>` : ''}
        </div>
    `;
}

// Função para avançar para o próximo módulo
function nextModule() {
    currentModule++;
    if (currentModule < modules.length) {
        renderModule();
    }
}

// Função para lidar com a resposta do usuário
function handleAnswer(optionIndex, score) {
    const module = modules[currentModule];
    
    // Se a opção tem pontuação (é uma pergunta de risco)
    if (score !== null) {
        module.action(score);
        alert(`Resposta registrada! ${module.feedback}`);
    } else {
        // Para a pergunta de introdução
        module.action(module.options[optionIndex].value);
        alert(module.feedback);
    }
    
    nextModule();
}

// Função para abrir o modal de referências
function showReferences() {
    document.getElementById('modal-referencias').style.display = 'block';
}

// Lógica para fechar o modal
window.onload = function() {
    renderModule();
    
    const modal = document.getElementById('modal-referencias');
    const span = document.getElementsByClassName("close-btn")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}