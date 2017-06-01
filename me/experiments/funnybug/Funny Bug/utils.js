let start = performance.now()
const fetchResource = (url) => {
    return fetch(url, { mode: 'no-cors' })
}
const getText = (url) => {
    return fetchResource(url).then(r => r.text())
}

//fetchResource('./testing elements/BC (1).png').then(r => r.blob().then(r => appendBlob(r)))

function appendBlob(blob) {
    const imageUrl = window.URL.createObjectURL(blob)
    const imageTag = document.createElement('img')
    imageTag.src = imageUrl
    document.body.appendChild(imageTag)
}

function onmousedown(event) {
    var x = event.clientX, y = event.clientY;
    var midX = gl.canvas.width / 2, midY = gl.canvas.height / 2;
    var rect = event.target.getBoundingClientRect();
    x = ((x - rect.left) - midX) / midX;
    y = (midY - (y - rect.top)) / midY;
    console.log(x + "  " + y);
}

let utils = {

}

function range(n){
    let a=0
    return new Array(n).fill(1).map(i=>i=a++)
}
function rnd(v){
    return (Math.random() * v*2)-v
}