var isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "192.168.0.127";
if (!isLocal && window.location.protocol === "http:") {
    window.location.protocol = "https:";
}

var num = Math.floor(Math.random() * 5) + 1;
function getRandomLogo(size) {
    size = size || 50;
    var element = '<img class="logo" src="/img/logo/Signature ' + num + '.svg"';
    element += ' height="' + size + '" width="' + size + '" alt="Shakeel Mohamed inital signature logo">';
    document.write(element);
}