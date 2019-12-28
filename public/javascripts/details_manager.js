$(loadPage());

function clearPage() {
    clearZone('rounds');
    clearZone('players');
    clearZone('standings');
}

function clearZone(id){
    var element = document.getElementById(id);
    while(element.firstElementChild){
        element.removeChild(element.firstElementChild);
    }
}

function loadPage(){
    clearPage();
    $.getJSON((window.location.href + '/rounds_json'), function (data) {
        getResponseFromAction('#check-in', '/tournaments/' + data._id + '/register', "<a id='check-out' class='btn btn-primary text-white w-100'>Cancelar inscripción</a>");
        getResponseFromAction('#check-out', '/tournaments/' + data._id + '/unregister', "<a id='check-in' class='btn btn-primary text-white w-100'>Inscribirse</a>");
        getResponseFromAction('#start-button', '/tournaments/' + data._id + '/start', "<a id='#next-round' class='btn btn-primary text-white w-100'>Generar ronda</a>");
        if(!data.standings.length > 0) {
            getResponseFromAction('#next-round', '/tournaments/' + data._id + '/generateRound');
        } else {
            $('#next-round').remove();
        }
        buildBasic(data);
        buildPlayers(data);
        buildBrackets(data);
        buildRounds(data);
        buildStandings(data);
    });
}

function getResponseFromAction(element, url, replacement){
    if ($(element)) {
        $(element).click(function (evt) {
            $.get(url, function (result) {
                if(document.getElementById('title').children.length === 2){
                    document.getElementById('title').removeChild(document.getElementById('title').children[1]);
                }
                $('#title').append($("<div class='alert alert-success text-center'>").text(result));
                if(replacement){
                    $(element).remove();
                    $(replacement).appendTo($("#player-zone .col-md-6"));
                }
                loadPage();
            });
        });
    }
}

function buildStandings(data){
    $('#standings').append($("<h3>").text('Resultados'));
    if(data.standings.length > 0){
        var table = $("<table class='table table-striped text-center'><thead><th>#</th><th>Jugador</th></thead><tbody>");
        for(let i=0; i < data.standings.length; i++){
            var tr = $("<tr>");
            tr.append($("<td>").text((i+1) + "º"));
            tr.append($("<td>").text(data.standings[i]));
            table.append(tr);
        }
        $('#standings').append(table);
    } else {
        $('#standings').append($("<p>").text('Aún no ha finalizado el torneo'));
    }
}

function buildBasic(data) {
    $('#title h2').text(data.name);
    $('#basic .row .col-md-6 p').eq(0).text('Organizador: ' + data.tournament_organizer.username);
    $('#basic .row .col-md-6 p').eq(1).text('Formato: ' + data.tournament_type.name);
    $('#basic .row .col-md-6 p').eq(2).text('Fecha: ' + moment(data.tournament_date).format('DD-MM-YYYY'));
    $('#basic .row .col-md-6 p').eq(3).text('Aforo: ' + data.tournament_cap + ' personas');
}

function buildBrackets(data){
    let teams = [];
    let results = [];
    if(data.rounds.length > 0){
        for(let i=0; i < data.rounds[0].matches.length; i++){
            if(data.rounds[0].matches[i].player1_id && data.rounds[0].matches[i].player2_id) {
                teams.push([data.rounds[0].matches[i].player1_id.username, data.rounds[0].matches[i].player2_id.username]);
            } else {
                teams.push([data.rounds[0].matches[i].player1_id.username, null]);
            }
        }
        for(let i=0; i < data.rounds.length; i++){
            if(data.rounds[i].matches.length > 0){
                results.push([]);
                for(let j=0; j < data.rounds[i].matches.length; j++){
                    if(data.rounds[i].matches[j].player1_id && data.rounds[i].matches[j].player2_id && data.rounds[i].matches[j].outcome){
                        if(data.rounds[i].matches[j].player2_id.username === data.rounds[i].matches[j].outcome.username){
                            results[i].push([0,1]);
                        } else if(data.rounds[i].matches[j].player1_id.username === data.rounds[i].matches[j].outcome.username){
                            results[i].push([1,0]);
                        } else {
                            results[i].push([null, null]);
                        }
                    } else{
                        results[i].push([null, null]);
                    }
                }
            }
        }
        var saveData = {teams, results};
        $("#brackets").bracket({
            init: saveData,
        });
    }
}

function buildPlayers(data) {
    if (data.players.length > 0) {
        var list = $("<table class='table table-striped text-center'><thead><th>#</th><th>Jugador</th></thead><tbody>");
        for (let i = 0; i < data.players.length; i++) {
            var tr = $("<tr>");
            $("<td>").text(i + 1).appendTo(tr);
            $("<td>").text(data.players[i].username).appendTo(tr);
            tr.appendTo(list);
        }
    } else {
        var list = $("<p>").text('Aún no hay jugadores inscritos');
    }
    $('#players').append($("<h3>").text("Jugadores inscritos (" + data.players.length + "/ " + data.tournament_cap + ")"));
    $('#players').append(list);
}

function buildRounds(data) {
    var col = $("<div class='col-md-12 col-sm-12 col-lg-12'>");
    var row = $("<div class='row'>");
    col.append($("<h3>").text('Rondas'));
    if (data.rounds.length > 0) {
        for (let i = 0; i < data.rounds.length; i++) {
            col.append($("<a href='/rounds/" + data.rounds[i]._id + "'>").append($("<h4 class='text-center'>").text("Ronda " + data.rounds[i].round_number)));
            var table = $("<table class='table table-striped text-center'><thead><th>Jugador 1</th><th>vs</th><th>Jugador 2</th><th>Detalles</th></thead><tbody>");
            for (let j = 0; j < data.rounds[i].matches.length; j++) {
                var tr = $("<tr>");
                tr.append($("<td>").text(data.rounds[i].matches[j].player1_id.username));
                tr.append($("<td>").text(''));
                if (!data.rounds[i].matches[j].player2_id) {
                    tr.append($("<td>").text('BYE'));
                } else {
                    tr.append($("<td>").text(data.rounds[i].matches[j].player2_id.username));
                }
                tr.append($("<td>").append($("<a class='btn btn-primary' href='/match/" + data.rounds[i].matches[j]._id + "'>").html('Partida detallada')));
                tr.appendTo(table);
            }
            table.appendTo(col);
        }
        row.append(col).appendTo($("#rounds"));
    } else {
        col.append($("<p>").text('Aún no ha comenzado el torneo'));
    }
    row.append(col).appendTo($("#rounds"));
}

