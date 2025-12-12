const output = document.getElementById('output');
const terminal = document.getElementById('terminal');
const keyboard = document.getElementById('keyboard');
const inputLine = document.getElementById('input-line');
const commandInput = document.getElementById('command');
const cursor = document.querySelector('.cursor');
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');

const introLines = [
    { text: 'CONNECTING TO CASIO F-91W...', delay: 1000 },
    { text: '[SUCCESS]', delay: 750 },
    { text: `
> DATA STREAM: ANALOGUE TO DIGITAL [CONVERTED]
> POWER SOURCE: WRIST KINETIC [OPTIMAL]
> FUNCTION: EXCEED EXPECTATIONS [SUCCESS]
`, delay: 1500 },
    { text: 'SYSTEM INITIATION COMPLETE.', delay: 500 },
    { text: 'Waiting for input...', delay: 0 }
];

const typeSpeed = 20;
let isTyping = false;

function startMatrix() {
    isTyping = true;
    keyboard.disabled = true;
    terminal.style.display = 'none';
    matrixCanvas.style.display = 'block';
    setTimeout(() => {
        matrixCanvas.style.opacity = 1;
    }, 10);


    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = {
            y: Math.random() * matrixCanvas.height,
            speed: 2 + Math.random() * 3, // Random speed between 2 and 5
        };
    }

    let animationFrameId;
    const draw = () => {
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        matrixCtx.fillStyle = '#0F0';
        matrixCtx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const drop = rainDrops[i];
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            
            matrixCtx.fillText(text, i * fontSize, drop.y * fontSize);

            if (drop.y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drop.y = 0;
            }
            drop.y += drop.speed / 10;
        }
        animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        matrixCanvas.style.opacity = 0;
        setTimeout(() => {
            matrixCanvas.style.display = 'none';
            terminal.style.display = 'block';
            output.innerHTML = '';
            typeResponse('Wake up, Neo...');
        }, 500); // Wait for fade out
    }, 10000); // Run for 10 seconds
}

function typeResponse(text) {
    isTyping = true;
    keyboard.disabled = true;
    inputLine.style.display = 'none';

    const responseElement = document.createElement('div');
    output.appendChild(responseElement);

    let charIndex = 0;
    const typeChar = () => {
        if (charIndex < text.length) {
            responseElement.textContent += text.charAt(charIndex);
            charIndex++;
            terminal.scrollTop = terminal.scrollHeight;
            setTimeout(typeChar, typeSpeed);
        } else {
            isTyping = false;
            keyboard.disabled = false;
            inputLine.style.display = 'flex';
            keyboard.focus();
        }
    };
    typeChar();
}

function handleCommand(command) {
    appendHistory(`$ ${command}`);
    let response = '';
    const cmd = command.toLowerCase().trim();
    switch (cmd) {
        case 'help':
            response = 'Available commands: help, clear, date, matrix';
            break;
        case 'clear':
            output.innerHTML = '';
            break;
        case 'date':
            response = new Date().toLocaleString();
            break;
        case 'matrix':
            startMatrix();
            break;
        case '':
            break;
        default:
            response = `Command not found: ${command}. Type 'help' for available commands.`;
            break;
    }
    if (response) {
        typeResponse(response);
    }
    commandInput.textContent = ''; // Clear the command text
}

function appendHistory(text) {
    output.innerHTML += `<div>${text.replace(/\n/g, '<div></div>')}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
}

function typeIntro() {
    isTyping = true;
    keyboard.disabled = true;
    let lineIndex = 0;
    inputLine.style.display = 'none'; // Ensure input line is hidden

    function typeLine() {
        if (lineIndex < introLines.length) {
            const currentLine = introLines[lineIndex];
            let charIndex = 0;

            const typeChar = () => {
                if (charIndex < currentLine.text.length) {
                    output.innerHTML += currentLine.text.charAt(charIndex);
                    charIndex++;
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(typeChar, typeSpeed);
                } else {
                    if (lineIndex < introLines.length - 1) {
                        output.innerHTML += '\n';
                    }
                    lineIndex++;
                    setTimeout(typeLine, currentLine.delay);
                }
            };
            typeChar();
        } else {
            // After intro, add a newline and then show the interactive prompt
            output.innerHTML += '\n';
            initInteractiveTerminal();
        }
    }
    typeLine();
}

function initInteractiveTerminal() {
    isTyping = false;
    keyboard.disabled = false;
    inputLine.style.display = 'flex'; // Show the input line
    keyboard.focus();

    terminal.addEventListener('click', () => {
        if (!isTyping) {
            keyboard.focus();
        }
    });

    keyboard.addEventListener('input', (e) => {
        commandInput.textContent = e.target.value;
    });

    keyboard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isTyping) {
                handleCommand(keyboard.value);
                keyboard.value = '';
                commandInput.textContent = '';
            }
        } else if (e.key === 'c' && e.ctrlKey) {
            // Optional: Handle Ctrl+C to clear line
            keyboard.value = '';
            commandInput.textContent = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.cursor = 'none';
    setTimeout(typeIntro, 500);
});
