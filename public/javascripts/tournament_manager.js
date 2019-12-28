$(function () {
    if (window.localStorage) {
        if (localStorage.getItem('tour_list')) {
            $.getJSON("/tournaments/tournament_json", function (data) {
                if(JSON.stringify(data) != localStorage.getItem('tour_list')){
                    localStorage.removeItem('tour_list');
                    localStorage.setItem('tour_list', JSON.stringify(data));
                }
                var tournaments = JSON.parse(localStorage.getItem('tour_list'));
                var contentBox = document.getElementById('content');
                if(tournaments.length === 0){
                    var p = document.createElement('p');
                    p.innerHTML = 'No hay torneos'
                    contentBox.appendChild(p);
                }
                for (let i = 0; i < tournaments.length; i++) {
                    if (i % 3 === 0) {
                        var row = document.createElement('div');
                        row.classList.add('row');
                        contentBox.appendChild(row);
                    }
                    row.appendChild(generateTournamentCard(tournaments[i]));
                }
                setDragAndDrop();
            });
        } else {
            $.getJSON("/tournaments/tournament_json", function (data) {
                localStorage.setItem('tour_list', JSON.stringify(data));
                var contentBox = document.getElementById('content');
                if(data.length === 0){
                    var p = document.createElement('p');
                    p.innerHTML = 'No hay torneos'
                    contentBox.appendChild(p);
                }
                for (let i = 0; i < data.length; i++) {
                    if (i % 3 === 0) {
                        var row = document.createElement('div');
                        row.classList.add('row');
                        contentBox.appendChild(row);
                    }
                    row.appendChild(generateTournamentCard(data[i]));
                }
                setDragAndDrop();
            });
        }
    }
});

function setDragAndDrop(){
    var cards = document.getElementsByClassName('card');
    for(let i=0; i < cards.length; i++){
        cards[i].setAttribute('draggable', 'true');
        cards[i].id = 'card'+i;
        cards[i].addEventListener('dragover', function (evt) {
            evt.preventDefault();
        });
        cards[i].addEventListener('drop', function (evt) {
            evt.preventDefault();
            var data = evt.dataTransfer.getData("text");
            var origin = document.getElementById(data);
            var aux = document.getElementById(data);
            var destiny = evt.target;
            while(!destiny.classList.contains('card')){
                destiny = destiny.parentElement;
            }
            var final = destiny.parentElement;
            origin.parentElement.appendChild(destiny);
            final.appendChild(aux);
        });
        cards[i].addEventListener('dragstart', function (evt) {
            evt.dataTransfer.setData("text", evt.target.id);
        });
    }
}

function generateTournamentCard(tournament) {
    var card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('text-center');
    card.classList.add('mb-3');
    card.appendChild(generateCardHeader(tournament.name));
    var img = document.createElement('img');
    img.setAttribute('src', '/images/set.png');
    img.setAttribute('alt', 'Single Elimination Tournament');
    img.classList.add('card-img-top');
    img.classList.add('img-fluid');
    card.appendChild(img);
    card.appendChild(generateCardBody(tournament));
    var button = document.createElement('a');
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.classList.add('w-100');
    button.href = '/tournaments/' + tournament._id;
    button.innerHTML = 'Detalles';
    card.appendChild(button);
    var col = document.createElement('div');
    col.classList.add('col-lg-4');
    col.classList.add('col-md-4');
    col.classList.add('col-sm-12');
    col.appendChild(card);

    return col;
}

function generateCardBody(tournament) {
    var list = document.createElement('ul');
    list.classList.add('list-group');
    list.classList.add('list-group-flush');
    list.appendChild(crearListado('Organizador: ' + tournament.tournament_organizer.username));
    list.appendChild(crearListado('Fecha: ' + moment(tournament.tournament_date).format('DD-MM-YYYY')));
    list.appendChild(crearListado('Formato: ' + tournament.tournament_type.name));
    list.appendChild(crearListado('Aforo: ' + tournament.tournament_cap + ' jugadores'));
    var body = document.createElement('div');
    body.classList.add('card-body');
    body.classList.add('p-0');
    body.appendChild(list);
    return body;
}

function crearListado(message) {
    var li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = message;
    return li;
}

function generateCardHeader(text) {
    var title = document.createElement('h5');
    title.innerHTML = text;
    title.classList.add('card-title');
    title.classList.add('text-center');
    title.classList.add('m-0');
    var header = document.createElement('div');
    header.classList.add('card-header');
    header.appendChild(title);
    return header;
}