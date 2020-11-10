function resetData() {
    document.querySelector('#name').value = '';
    document.querySelector('#mail').value = '';
    document.querySelector('#tel').value = '';
    document.querySelector('#name').focus();
    return;
}
function addListenerToItem() {
    const item_list = document.getElementsByClassName('form-items');
    for (let i = 1; i < item_list.length; ++i) {
        item_list[i].addEventListener('keypress', (e) => {
            if (e.keyCode === 13) sendData();
        });
    }
    return;
}
function makeHtmlSyntax(response) {
    const {data} = response;

    // data는 object 배열
    if (data[0] === null || data[0] === undefined) {
        throw new Error("something is going wrong!");
        return;
    }
    const keys = Object.keys(data[0]);
    const thead = '<table><thead><tr>' + keys.map(e => {
        return '<th>' + e + '</th>';
    }).join('') + '</tr></thead>';

    return thead + '<tbody>' + data.map(obj => { // elements 는 obj
        const elements = Object.keys(obj);
        return '<tr>' + elements.map(e => {
            return '<td>' + obj[e] + '</td>';
        }).join('') + '</tr>';
    }).join('') + '</tbody></table>';
    // name, email
}