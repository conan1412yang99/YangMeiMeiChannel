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
        const response = await fetch('contents/' + contents[chapter - 1] + '.json');
        const json_data = await response.text();
        const data = JSON.parse(json_data)["data"];
        $.getScript("js/game" + chapter + ".js", function(){
            init(data);
        });
    } catch (error) {
        console.error('Error loading', error);
    }
}