var map;
var pos = {lat: 41.664565, lng: -4.723602};
var text = "<h3>Sede</h3>" +
    "<p>Aquí trabajamos en este proyecto, puedes visitarnos si te interesa</p>" +
    "<ul>" +
    "<li>Horario: 16:00 - 21:40</li>" +
    "<li>Telefono: 983123212</li>" +
    "</ul>"
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15
    });
    var info = new google.maps.InfoWindow({
        content: text,
    });
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Estamos aquí',
    });
    marker.addListener('click', function () {
        info.open(map, marker);
    });
}