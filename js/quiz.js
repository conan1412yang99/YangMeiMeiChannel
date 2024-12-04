const container = document.getElementById("quiz-container");
container.innerHTML = `
<div id="start">開始玩遊戲<br/>!</div>
<div id="quiz" style="display: none">
    <div id="question"></div>
    <div id="qImg"></div>
    <div id="choices"></div>
    <div id="timer">
        <div id="counter"></div>
        <div id="btimeGauge"></div>
        <div id="timeGauge"></div>
    </div>
    <div id="progress"></div>
</div>
<div id="scoreContainer" style="display: none" onclick="restart()"></div>
`;
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const qImg = document.getElementById("qImg");
const choices = document.getElementById("choices"); 
const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("scoreContainer");
let lastQuestion = questions.length - 1;
let runningQuestion = 0;
let count = 0;
const questionTime = 10; // 10s
const gaugeWidth = 150; // 150px
const gaugeUnit = gaugeWidth / questionTime;
let TIMER;
let score = 0;

function restart() {
    runningQuestion = 0;
    count = 0;
    score = 0;
    start.style.display = "block";
    quiz.style.display = "none";
    scoreDiv.style.display = "none";
    progress.innerHTML = "";
}

// render a question
function renderQuestion(){
    let q = questions[runningQuestion];
    question.innerHTML = "<p>"+ q.question +"</p>";
    if (q.imgSrc) {
        qImg.innerHTML = "<img src="+ q.imgSrc +">";
    } else {
        qImg.innerHTML = "<img src='img/cpp.png'>";
    }
    let choicesHtml = "";
    if (q.choices){
        q.choices.forEach((choice, i) => {
            choicesHtml += `<div class="choice" onclick="checkAnswer(${choice.correct})">${choice.text}</div>`;
        });
    }
    choices.innerHTML = choicesHtml;
}

// start.addEventListener("click",startQuiz);

function startQuiz(){
    lastQuestion = questions.length - 1;
    start.style.display = "none";
    renderQuestion();
    quiz.style.display = "block";
    renderProgress();
    renderCounter();
    TIMER = setInterval(renderCounter,1000); // 1000ms = 1s
}

function renderProgress(){
    for(let qIndex = 0; qIndex <= lastQuestion; qIndex++){
        progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    }
}

function renderCounter(){
    if(count <= questionTime){
        counter.innerHTML = count;
        timeGauge.style.width = count * gaugeUnit + "px";
        count++
    }else{
        count = 0;
        // change progress color to red
        answerIsWrong();
        if(runningQuestion < lastQuestion){
            runningQuestion++;
            renderQuestion();
        }else{
            // end the quiz and show the score
            clearInterval(TIMER);
            scoreRender();
        }
    }
}

function checkAnswer(correct){
    if( correct ){
        // answer is correct
        score++;
        // change progress color to green
        answerIsCorrect();
    }else{
        // answer is wrong
        // change progress color to red
        answerIsWrong();
    }
    count = 0;
    if(runningQuestion < lastQuestion){
        runningQuestion++;
        renderQuestion();
    }else{
        // end the quiz and show the score
        clearInterval(TIMER);
        scoreRender();
    }
}

// answer is correct
function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

// answer is Wrong
function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}

// score render
function scoreRender(){
    scoreDiv.style.display = "block";
    
    // calculate the amount of question percent answered by the user
    const scorePerCent = Math.round(100 * score/questions.length);
    
    // choose the image based on the scorePerCent
    let img = (scorePerCent >= 80) ? "img/5.png" :
              (scorePerCent >= 60) ? "img/4.png" :
              (scorePerCent >= 40) ? "img/3.png" :
              (scorePerCent >= 20) ? "img/2.png" :
              "img/1.png";
    
    scoreDiv.innerHTML = "<img src="+ img +">";
    scoreDiv.innerHTML += "<p>"+ scorePerCent +"%</p>";
}
