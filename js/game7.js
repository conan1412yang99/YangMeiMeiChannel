function init(data) {
	const container = document.getElementById("quiz-container");
	console.log("1");
	container.innerHTML = `
	<center>
	<iframe allow="autoplay" src="./games/variables/index.html" style="width: 200%; height: 200%; transform: scale(0.5); transform-origin: 0 0;"></iframe></iframe>
	</center>`;
}
