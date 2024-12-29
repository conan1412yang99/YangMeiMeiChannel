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
        this.nextButton.disabled = true;

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

        // Create and append audio elements
        this.correctSound = document.createElement('audio');
        this.correctSound.id = 'correct-sound';
        this.correctSound.src = './img/correct.wav';
        this.correctSound.preload = 'auto';
        this.container.appendChild(this.correctSound);

        this.wrongSound = document.createElement('audio');
        this.wrongSound.id = 'wrong-sound';
        this.wrongSound.src = './img/wrong.wav';
        this.wrongSound.preload = 'auto';
        this.container.appendChild(this.wrongSound);
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
            this.resultDiv.innerHTML = ''; // Clear previous result
            this.nextButton.disabled = true; // Disable next button until an option is selected

            // Add event listener to enable the next button when an option is selected
            document.querySelectorAll('input[name="option"]').forEach(input => {
                input.addEventListener('change', () => {
                    this.nextButton.disabled = false;
                });
            });
        } else {
            this.showResult();
        }
    }

    nextQuestion() {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            const selectedValue = parseInt(selectedOption.value);
            const question = this.selectedQuestions[this.currentQuestionIndex];
            if (selectedValue === question.answer) {
                this.score += 20;
                this.resultDiv.innerHTML = '<p class="correct">正確!</p>';
                this.correctSound.play(); // Play correct sound
            } else {
                this.resultDiv.innerHTML = `<p class="wrong">錯誤! 正確答案是: ${question.options[question.answer]}</p>`;
                this.wrongSound.play(); // Play wrong sound
            }
            this.currentQuestionIndex++;

            this.nextButton.disabled = true; // Disable next button until the result is shown
            setTimeout(() => {
                this.displayQuestion(); // Display next question after a short delay
            }, 2000); // Adjust the delay as needed (2000 ms = 2 seconds)
        } else {
            alert("請選擇答案!");
        }
    }

    showResult() {
        this.questionContainer.style.display = 'none'; // Hide question container
        this.nextButton.style.display = 'none'; // Hide next button

        const pass = this.score >= 60 ? "及格" : "不及格";
        this.resultDiv.innerHTML = `
            <div class="result-container">
                <b>遊戲結束</b>
                <p>你的分數: ${this.score}</p>
                <p>你${pass}</p>
            </div>
        `;
        this.resultDiv.style.display = 'block'; // Ensure result div is displayed
    }
}

function init(data) {
    const container = document.getElementById("quiz-container");
    new Intro(container, () => {
        console.log(data);
        new MultipleChoiceGame(container, data);
    });
}