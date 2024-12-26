class Intro {
    constructor(container, callback) {
        this.container = container;
        this.container.innerHTML = "";
        this.container.className = "game1-intro-container";
        this.rule = document.createElement("img");
        this.rule.src = "img/game1-rule.jpg";
        this.rule.id = 'game1-rule';

        this.start = document.createElement("img");
        this.start.src = "img/game1-start.jpg";
        this.start.id = 'game1-start';

        this.start.onclick = callback;

        this.container.appendChild(this.rule);
        this.container.appendChild(this.start);
    }
}

class InteractiveCppGame {
    constructor(container) {
        this.container = container;
        this.container.innerHTML = ""; // Clear existing content
        this.container.className = "game1-container";

        // Create the layout
        this.leftPanel = document.createElement("div");
        this.rightPanel = document.createElement("div");
        this.leftPanel.className = "game1-left-panel";
        this.rightPanel.className = "game1-right-panel";

        // Populate the left panel
        this.leftPanel.innerHTML = `
            <p>在下方的程式碼中填寫內容以完成 C++ 程式：</p>
            <div class="game1-code-block">
                <pre>#include &lt;iostream&gt;
using namespace std;

int main() {
    cout &lt;&lt; "<input id="game1-code-placeholder" class="game1-editable" placeholder="在這裡輸入您的訊息" maxlength="10">" &lt;&lt; endl;
    return 0;
}</pre>
            </div>
            <button id="game1-run-program">執行程式</button>
        `;

        // Populate the right panel
        this.rightPanel.innerHTML = `
            <div style="font-weight: bold; font-size: 1.5rem">輸出結果</div>
            <div id="game1-output" style="font-size: 1rem; color: #333;"></div>
        `;

        // Append panels to the container
        this.container.appendChild(this.leftPanel);
        this.container.appendChild(this.rightPanel);

        // Add event listeners
        this.runButton = this.leftPanel.querySelector("#game1-run-program");
        this.codePlaceholder = this.leftPanel.querySelector("#game1-code-placeholder");
        this.outputDiv = this.rightPanel.querySelector("#game1-output");

        this.runButton.addEventListener("click", () => this.runProgram());
    }

    runProgram() {
        const userInput = this.codePlaceholder.value.trim();

        // if (userInput === "") {
        //     alert("請輸入一段訊息。");
        //     return;
        // }

        this.outputDiv.textContent = userInput;
    }
}

function init(data) {
    const container = document.getElementById("quiz-container");
    new Intro(container, () => {
        new InteractiveCppGame(container);
    });
}
