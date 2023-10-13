function setAttributes(ele, attributes) {
    for (let keys in attributes) {
      let id_name = keys;
      let value = attributes[keys];
      ele.setAttribute(id_name, value);
    }
  }


  let buttonColumns = function (colValue, idValue, content, value) {
    const singleColumn = document.createElement("div");
    singleColumn.classList.add(`col-${colValue}`, "button-columns");
    const button = document.createElement("button");
    setAttributes(button, { class: "keys", id: idValue });
    button.innerHTML = content;
    if (value) {
      button.dataset[value] = "";
    }
    singleColumn.append(button);
    return singleColumn;
  };


  let buttonRows = function () {
    const singleRow = document.createElement("div");
    singleRow.classList.add("row", "line-section", "justify-content-start");
    return singleRow;
  };


  const body = document.body;
  const container = document.createElement("div");
  container.classList.add("container", "calculator");
  body.append(container);

  const innerSection = document.createElement("div");
  innerSection.classList.add("row", "inner-section", "justify-content-start");
  container.append(innerSection);

  const previousOperand = document.createElement("div");
  previousOperand.classList.add("previous");
  previousOperand.dataset.previous = "";

  const currentOperand = document.createElement("input");
  currentOperand.classList.add("current");
  currentOperand.setAttribute("id", "result");
  currentOperand.dataset.current = "";
  innerSection.append(previousOperand, currentOperand);

  const firstRow = buttonRows();
  container.append(firstRow);
  firstRow.append(buttonColumns(3, "clear", "c", "clear"));
  firstRow.append(buttonColumns(3, "delete", "DEL", "delete"));
  firstRow.append(buttonColumns(3, "period", `<i class="fa-solid fa-period"><b>.</b></i>`, "number"));
  firstRow.append(buttonColumns(3, "multiply", "*", "operation"));

  const secondRow = buttonRows();
  container.append(secondRow);
  secondRow.append(buttonColumns(3, "7", "7", "number"));
  secondRow.append(buttonColumns(3, "8", "8", "number"));
  secondRow.append(buttonColumns(3, "9", "9", "number"));
  secondRow.append(buttonColumns(3, "divide", "÷", "operation"));
  const thirdRow = buttonRows();

  container.append(thirdRow);
  thirdRow.append(buttonColumns(3, "4", "4", "number"));
  thirdRow.append(buttonColumns(3, "5", "5", "number"));
  thirdRow.append(buttonColumns(3, "6", "6", "number"));
  thirdRow.append(buttonColumns(3, "subtract", "-", "operation"));
  const fourthRow = buttonRows();

  container.append(fourthRow);
  fourthRow.append(buttonColumns(3, "1", "1", "number"));
  fourthRow.append(buttonColumns(3, "2", "2", "number"));
  fourthRow.append(buttonColumns(3, "3", "3", "number"));
  fourthRow.append(buttonColumns(3, "add", "+", "operation"));
  const fifthRow = buttonRows();
  
  container.append(fifthRow);
  fifthRow.append(buttonColumns(3, "0", "0", "number"));
  fifthRow.append(buttonColumns(3, "00", "00", "number"));
  fifthRow.append(buttonColumns(6, "equal", "=", "equals"));


  const numberButtons = document.querySelectorAll("[data-number]");
  const operationButtons = document.querySelectorAll("[data-operation]");
  const equalsButton = document.querySelector("[data-equals]");
  const deleteButton = document.querySelector("[data-delete]");
  const clearButton = document.querySelector("[data-clear]");
  const previousOperandTextElement = document.querySelector("[data-previous]");
  const currentOperandTextElement = document.querySelector("[data-current]");

  class calci {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.clear();
    }

    clear() {
      this.previousOperand = "";
      this.currentOperand = "";
      this.operation = undefined;
    }

    delete() {}

    appendNumber(number) {
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseoperation(operation) {
      if (this.currentOperand === "") return;
      if (this.previousOperand !== "") {
        this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = "";
    }

    compute() {
      let computation;
      let prev = parseFloat(this.previousOperand);
      let curr = parseFloat(this.currentOperand);
      if (isNaN(prev) || isNaN(curr)) return;
      switch (this.operation) {
        case "+":
          computation = prev + curr;
          break;
        case "-":
          computation = prev - curr;
          break;
        case "*":
          computation = prev * curr;
          break;
        case "÷":
          computation = prev / curr;
          break;
        default:
          return;
      }
      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = "";
    }

    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
    getDisplayNumber(number) {
      const stringNumber = number.toString();
      const integerDigits = parseFloat(stringNumber.split(".")[0]);
      const decimalDigits = stringNumber.split(".")[1];
      let integerDisplay;
      if (isNaN(integerDigits)) {
        integerDisplay = "";
      } else {
        integerDisplay = integerDigits.toLocaleString("en", { maximumFractionDigits: 0 });
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
      } else {
        return integerDisplay;
      }
    }
    updateDisplay() {
      this.currentOperandTextElement.value = this.getDisplayNumber(this.currentOperand);
      if (this.operation != null) {
        this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${
          this.operation
        }`;
      } else {
        this.previousOperandTextElement.innerText = "";
      }
    }
  }

  const calculator = new calci(previousOperandTextElement, currentOperandTextElement);
  // To click number values
  for (let button of numberButtons) {
    button.addEventListener("click", () => {
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    });
  }
  // To press number values
  let buttonids = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  document.body.addEventListener("keypress", (e) => {
    let key = e.key;
    console.log(key);
    if (buttonids.includes(key)) {
      calculator.appendNumber(key);
      calculator.updateDisplay();
    } else {
      alert("Only numbers are allowed");
    }
  });

  for (let button of operationButtons) {
    button.addEventListener("click", () => {
      calculator.chooseoperation(button.innerText);
      calculator.updateDisplay();
    });
  }

  equalsButton.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
  });

  clearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
  });

  deleteButton.addEventListener("click", () => {
    calculator.delete();
    calculator.updateDisplay();
  });