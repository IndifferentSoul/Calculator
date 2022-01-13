import * as calculations from "./math-functions.js";

const MAX_NUMBER = Number.MAX_SAFE_INTEGER;
const specialButtons = document.querySelectorAll(".special")
const operatorButtons = document.querySelectorAll(".operator")
const numberButtons = document.querySelectorAll(".number");
const calculateButton = document.querySelector("#calculate");
const zeroButton = document.querySelector("#zero");
const focus = document.querySelector(".focus")
const answer = document.querySelector(".answer")

let firstOperand = null;
let secondOperand = null;
let operatorOne = null;
let operatorTwo = null
let bigIntStorage = "";

specialButtons.forEach(button => {
    button.addEventListener("click", () => {
        switch (button.id) {
            case "pi":
                focus.textContent = calculations.pi;
                focus.classList.remove("disable-operator");
                break;
            case "euler":
                focus.textContent = calculations.euler;s
                focus.classList.remove("disable-operator");
                break;
            case "percent":
                firstOperand = focus.textContent
                focus.textContent = calculations.percent(firstOperand);
                break;
            case "positive-negative":
                if (Math.sign(Number(focus.textContent)) === 1) {
                    focus.textContent = `-${focus.textContent}`
                } else {
                    focus.textContent = `${focus.textContent.split("-").pop()}`
                }
                break;
            case "exponential":
                if (focus.classList.contains("big-int")) {
                    bigIntStorage = focus.textContent;
                    focus.textContent = Number.parseFloat(bigIntStorage).toExponential(2);
                    focus.classList.remove("big-int");
                } else {
                    focus.textContent = BigInt(Number(bigIntStorage));
                    focus.classList.add("big-int");
                }
                break;
            case "clear":
                focus.textContent = "";
                answer.textContent = "";
                firstOperand = null;
                secondOperand = null;
                operatorOne = null;
                operatorTwo = null
                bigIntStorage = "";
                break;
            case "backspace":
                focus.textContent = focus.textContent.slice(0, -1);
                break;
            case "decimal":
                if (focus.textContent.includes(".")) {
                    return;
                } else {
                    focus.textContent += ".";
                }
                break;
            default:
                break;
        }
    })
});

numberButtons.forEach(button => {
    button.addEventListener("click", () => {

        if (answer.classList.contains("not-empty")) {
            answer.textContent = "";
            answer.classList.remove("not-empty");
        }

        focus.textContent += button.textContent;

        focus.classList.remove("disable-operator");        
        zeroButton.disabled = false;
    })
});

calculateButton.addEventListener("click", () =>{
    if (operatorOne != null && operatorTwo === null) {
        secondOperand = focus.textContent;
        calculate(operatorOne);
        answer.textContent = firstOperand;
        answer.classList.add("not-empty");
        firstOperand = null;
        secondOperand = null;
        operatorOne = null;
        operatorTwo = null
        bigIntStorage = "";
    } else {
        secondOperand = focus.textContent;
        calculate(operatorTwo);
        answer.textContent = firstOperand;
        answer.classList.add("not-empty");
        firstOperand = null;
        secondOperand = null;
        operatorOne = null;
        operatorTwo = null
        bigIntStorage = "";
    }
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {

        if (focus.classList.contains("disable-operator")) return;
        focus.classList.add("disable-operator");

        if (button.id === "division") zeroButton.disabled = true;

        if (operatorOne != null && operatorTwo === null) {
            operatorTwo = button.id;
            secondOperand = focus.textContent;
            calculate(operatorOne);
           answer.textContent = firstOperand + " " + button.textContent;
        } else if(operatorOne != null && operatorTwo != null) {
            secondOperand = focus.textContent;
            calculate(operatorTwo);
            answer.textContent = firstOperand + " " + button.textContent;
            operatorTwo = button.id;
        } else { 
            operatorOne = button.id;
            firstOperand = focus.textContent;
            answer.textContent = firstOperand + " " + button.textContent;
            focus.textContent = "";
        }
    })
});

function calculate (operator) {
    let result = "";

    switch (operator) {
        case "multiplication":
            result = calculations.multiply(Number(firstOperand), Number(secondOperand));
            formatResult(result);
            break;
        case "addition":
            result = calculations.add(Number(firstOperand), Number(secondOperand));
            formatResult(result);
            break;
        case "subtraction":
            result = calculations.subtract(Number(firstOperand), Number(secondOperand));
            formatResult(result);
            break;
        case "division":
            result = calculations.divide(Number(firstOperand), Number(secondOperand));
            formatResult(result);
            break;
        default:
            break;
    }
};

function formatResult (result) {

    if (result < MAX_NUMBER) {
        bigIntStorage = firstOperand = result;
    } else {
        const asBigInt = bigIntStorage  = BigInt(result);
        firstOperand = Number.parseFloat(asBigInt).toExponential(2);
        answer.classList.remove("big-int");
    }

    focus.textContent = ""
};