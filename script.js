const output = document.getElementById('output');
const terminal = document.getElementById('terminal');
const keyboard = document.getElementById('keyboard');
const inputLine = document.getElementById('input-line');
const commandInput = document.getElementById('command');
const cursor = document.querySelector('.cursor');

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

function handleCommand(command) {
    appendHistory(`$ ${command}`);
    let response = '';
    switch (command.toLowerCase().trim()) {
        case 'help':
            response = 'Available commands: help, clear, date';
            break;
        case 'clear':
            output.innerHTML = '';
            break;
        case 'date':
            response = new Date().toLocaleString();
            break;
        case '':
            break;
        default:
            response = `Command not found: ${command}. Type 'help' for available commands.`;
            break;
    }
    if (response) {
        appendHistory(response);
    }
    commandInput.textContent = ''; // Clear the command text
}

function appendHistory(text) {
    output.innerHTML += `<div>${text.replace(/\n/g, '<div></div>')}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
}

function typeIntro() {
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
    inputLine.style.display = 'flex'; // Show the input line
    keyboard.focus();

    terminal.addEventListener('click', () => {
        keyboard.focus();
    });

    keyboard.addEventListener('input', (e) => {
        commandInput.textContent = e.target.value;
    });

    keyboard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(keyboard.value);
            keyboard.value = '';
            commandInput.textContent = '';
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
