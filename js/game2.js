class Drawable {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    update(deltaTime) {
        // To be implemented by subclasses
    }
    draw(context) {
        // To be implemented by subclasses
    }
    garbage() {
        // To be implemented by subclasses
    }
}

class Mutex {
    constructor() {
        this.locked = false;
        this.waitingQueue = [];
    }

    async lock() {
        if (this.locked) {
            await new Promise((resolve) => this.waitingQueue.push(resolve));
        }
        this.locked = true;
    }

    unlock() {
        if (this.waitingQueue.length > 0) {
            const nextResolve = this.waitingQueue.shift();
            nextResolve();
        } else {
            this.locked = false;
        }
    }
}

class AnimcationGame {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.container.innerHTML = "";
        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.canvas.width / 2;
        this.ctx = this.canvas.getContext("2d");

        this.objects = [];
        
        this.running = false;
        this.lock = new Mutex();

        this.lastFrameTime = 0;
        this.startTime = 0;
        this.loop = this.loop.bind(this);

        this.onNewFrame = () => {};
    }
    start() {
        this.running = true;
        this.startTime = document.timeline.currentTime;
        this.lastFrameTime = this.startTime;
        this.loop(this.lastFrameTime);
    }
    async stop() {
        await this.lock.lock();
        this.running = false;
        this.lock.unlock();
    }
    async loop(currentTime) {
        await this.lock.lock();
        if (!this.running) {
            this.lock.unlock();
            return;
        }
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        this.onNewFrame();

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // bg color gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "lightblue");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.objects.forEach((object) => {
            object.update(deltaTime);
            if(!object.garbage()) {
                object.draw(this.ctx);
            }
        });
        this.objects = this.objects.filter(object => object.garbage() === false);
        this.lock.unlock();
        // Request next frame
        requestAnimationFrame(this.loop);
    }

};

class FallingQuestion extends Drawable {
    constructor(canvasWidth, canvasHeight, data) {
        super(canvasWidth, canvasHeight);
        this.x = canvasWidth / 2 + Math.random() * 100 - 50;
        this.y = -20;
        this.speed = 200;
        this.active = true;
        this.opacity = 1;
        this.vanishing = false;
        this.color = "black";
        this.height = 40;

        const idx = Math.floor(Math.random() * data.length);
        this.question = data[idx].question;
        if(data[idx].choices[0].text == "<<") {
            if(data[idx].choices[0].correct == true) {
                this.ans = "int";
            } else {
                this.ans = "float";
            }
        } else {
            if(data[idx].choices[0].correct == true) {
                this.ans = "float";
            } else {
                this.ans = "int";
            }
        }
    }

    update(deltaTime) { this.y += this.speed * deltaTime; }

    draw(context) {
        context.beginPath();
        context.globalAlpha = this.opacity;
        
        context.fillStyle = this.color;
        context.font = "40px Arial";
        context.textAlign = "center";
        context.fillText(this.question, this.x, this.y);

        context.closePath();
        context.globalAlpha = 1;
    }

    garbage() { return !this.active || this.y - this.height > this.canvasHeight; }

    answer(ans) {
        if (ans == this.ans) {
            this.color = "green";
            this.vanish();
            return true;
        } else {
            this.color = "red";
            this.opacity = 0.5;
            return false;
        }
    }
    
    vanish() { 
        this.vanishing = true;
        const interval = setInterval(() => {
            this.opacity -= 0.1;
            if (this.opacity <= 0) {
                this.opacity = 0;
                this.active = false;
                clearInterval(interval);
            }
        }, 10);
    }
}

class Intro {
    constructor(container, callback) {
        this.container = container;
        this.container.innerHTML = "";
        this.container.className = "game2-intro-container";
        this.rule = document.createElement("img");
        this.rule.src = "img/game2-rule.jpg";
        this.rule.id = 'game2-rule';

        this.start = document.createElement("img");
        this.start.src = "img/game2-start.jpg";
        this.start.id = 'game2-start';

        this.start.onclick = callback;

        this.container.appendChild(this.rule);
        this.container.appendChild(this.start);
    }
}

class Result {
    constructor(container, score, callback) {
        this.container = container;
        this.container.innerHTML = "";
        this.container.className = "game2-intro-container";
        this.rule = document.createElement("img");
        if(score < 20) {
            this.rule.src = "img/game2-level1.jpg";
        } else if(score < 40) {
            this.rule.src = "img/game2-level2.jpg";
        } else {
            this.rule.src = "img/game2-level3.jpg";
        }
        this.rule.id = 'game2-rule';

        this.start = document.createElement("img");
        this.start.src = "img/game2-start.jpg";
        this.start.id = 'game2-start';

        this.score = document.createElement("span");
        this.score.innerHTML = "分數: " + score;
        this.score.id = "game2-result-score";
        
        const congrats = new Audio('img/game2-congrats.m4a');
        congrats.play();
        this.start.onclick = () => {
            congrats.pause();
            callback();
        };
        this.container.appendChild(this.score);
        this.container.appendChild(this.rule);
        this.container.appendChild(this.start);
    }
}

class FallingQuestionGame extends AnimcationGame {
    constructor(container, data, callback) {
        super(container, data);
        this.container.className = "game2-container";
        this.callback = callback;

        this.intBtn = document.createElement("img");
        this.intBtn.src = "img/<<.jpg";
        this.intBtn.className = 'game2-btn';

        this.floatBtn = document.createElement("img");
        this.floatBtn.src = "img/>>.jpg";
        this.floatBtn.className = 'game2-btn';

        this.intBtn.onclick = this.intBtnClick.bind(this);
        this.floatBtn.onclick = this.floatBtnClick.bind(this);
 
        this.keydownHandler = this.keydown.bind(this);
        document.addEventListener('keydown', this.keydownHandler);

        this.container.style.textAlign = "center";
        this.timer = document.createElement("span");
        this.timer.innerHTML = "時間: 30";
        this.timer.id = "game2-timer";

        this.onNewFrame = () => {
            let time = 30 - (this.lastFrameTime - this.startTime) / 1000;
            if (time <= 0) {
                this.stop();
                this.timer.innerHTML = "Finished";
                return;
            }
            this.timer.innerHTML = "時間: " + Math.ceil(time) + " s";
        }
        
        this.score = 0;
        this.scoreObj = document.createElement("span");
        this.scoreObj.innerHTML = "分數: " + this.score;
        this.scoreObj.id = "game2-score";

        this.container.appendChild(this.intBtn);
        this.container.appendChild(this.floatBtn);
        this.container.appendChild(this.timer);
        this.container.appendChild(this.scoreObj);

        this.queue = [];
        this.audio = new Audio('img/game2-bg.m4a');
        this.audio.loop = true;
    }
    keydown(event) {
        if (event.key === "a") {
            this.intBtnClick();
        } else if (event.key === "d") {
            this.floatBtnClick();
        }
    }
    start() {
        super.start();
        this.audio.play();

        setInterval(() => {
            if(!this.running) return;

            let fallingQuestion = new FallingQuestion(this.canvas.width, this.canvas.height, this.data);
            this.objects.push(fallingQuestion);
            this.queue.push(fallingQuestion);
        }, 500);

        setInterval(() => {
            if(!this.running) return;
            while(this.queue.length > 0 && this.queue[0].garbage()) {
                this.queue.shift();
                this.wrong();
            }
        }, 100000); 

    }
    async stop() {
        this.audio.pause();
        await super.stop();
        document.removeEventListener('keydown', this.keydownHandler);
        this.intBtn.onclick = null;
        this.floatBtn.onclick = null;
        if(!this.running) {
            this.callback(this.score);
            return;
        }
    }
    getNextQuestion() {
        while(this.queue.length > 0 && this.queue[0].garbage()) {
            this.queue.shift();
            this.wrong();
        }
        if (this.queue.length === 0) return null;
        return this.queue.shift();
    }
    intBtnClick() {
        let question = this.getNextQuestion();
        if (question === null) return
        if(question.answer("int")) {
            this.correct();
        } else {
            this.wrong();
        }
    }
    floatBtnClick() {
        let question = this.getNextQuestion();
        if (question === null) return
        if(question.answer("float")) {
            this.correct();
        } else {
            this.wrong();
        }
    }
    correct() {
        this.score += 1;
        this.scoreObj.innerHTML = "分數: " + this.score;
    }
    wrong() {

    }
}

function init(data) {
    const container = document.getElementById("quiz-container");
    let showIntro = null;
    let showGame = () => {
        const game = new FallingQuestionGame(container, data, (score) => {
            showIntro(score);
        });
        game.start();
    };
    showIntro = (score) => {
        if(score == null) {
            new Intro(container, () => {
                showGame();
            });
        } else {
            new Result(container, score, () => {
                showGame();
            });
        }
    };
    showIntro();
}