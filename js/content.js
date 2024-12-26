contents = [
    'cin-cout',
    '<<>>',
    'char-string-int',
    '==',
    'less-greater-equal',
    'arithmetic',
    'variable',
    'int-float',
    'if-else',
    'for-while',
];
game = [
    'game1',
    'game2',
    'game3',
    'game4',
    'game5',
    'game6',
    'game7',
    'game8',
    'game9',
    'game10'
];


function fetch_content(chapter) {
    fetch('contents/' + contents[chapter - 1] + '.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('imported-section').innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}
async function fetch_quiz(chapter) {
    try {
        console.log(game[chapter - 1]);
        const response = await fetch('contents/' + game[chapter - 1] + '.json');
        const json_data = await response.text();
        const data = JSON.parse(json_data)["data"];
        $.getScript("js/" + game[chapter - 1] + ".js", function(){
            init(data);
        });
    } catch (error) {
        console.log('Error loading', error);
    }
}