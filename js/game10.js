class Intro {
    constructor(container, callback) {
        this.container = container;
        this.container.innerHTML = "";
        this.container.className = "game10-intro-container";
        this.rule = document.createElement("img");
        this.rule.src = "img/game10-rule.jpg";
        this.rule.id = 'game10-rule';

        this.start = document.createElement("img");
        this.start.src = "img/game1-start.jpg";
        this.start.id = 'game10-start';

        this.start.onclick = callback;

        this.container.appendChild(this.rule);
        this.container.appendChild(this.start);
    }
}

class MultipleChoiceGame {
    constructor(container, data) {
        this.container = container;
        this.container.innerHTML = ""; // Clear existing content
        this.container.className = "game10-container";

        // Create the layout
        this.questionContainer = document.createElement("div");
        this.questionContainer.id = "game10-question-container";

        this.nextButton = document.createElement("button");
        this.nextButton.textContent = "下一題";
        this.nextButton.onclick = () => this.nextQuestion();
        this.nextButton.className = "game10-button";

        this.resultDiv = document.createElement("div");
        this.resultDiv.className = "game10-result";

        // Append elements to the container
        this.container.appendChild(this.questionContainer);
        this.container.appendChild(this.nextButton);
        this.container.appendChild(this.resultDiv);

        // Initialize game variables
        this.questions = data;

        this.currentQuestionIndex = 0;
        this.score = 0;

        this.selectedQuestions = this.getRandomQuestions();
        this.displayQuestion();
    }

    getRandomQuestions() {
        const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    }

    displayQuestion() {
        if (this.currentQuestionIndex < this.selectedQuestions.length) {
            const question = this.selectedQuestions[this.currentQuestionIndex];
            this.questionContainer.innerHTML = `
                <div class="game10-question">${question.question}</div>
                <div class="game10-options">
                    <label><input type="radio" name="option" value="0"> ${question.options[0]}</label><br>
                    <label><input type="radio" name="option" value="1"> ${question.options[1]}</label>
                </div>
            `;
            this.nextButton.disabled = false;
        } else {
            this.showResult();
        }
    }

    nextQuestion() {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            const selectedValue = parseInt(selectedOption.value);
            if (selectedValue === this.selectedQuestions[this.currentQuestionIndex].answer) {
                this.score += 20;
            }
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            alert("請選擇答案!");
        }
    }

    showResult() {
        const pass = this.score >= 60 ? "及格" : "不及格";
        this.resultDiv.innerHTML = `
            <b>遊戲結束</b>
            <p>你的分數: ${this.score}</p>
            <p>你${pass}</p>
        `;
        this.nextButton.style.display = 'none';
    }
}

function init(data) {
    const container = document.getElementById("quiz-container");
    new Intro(container, () => {
        console.log(data);
        new MultipleChoiceGame(container, data);
    });
}