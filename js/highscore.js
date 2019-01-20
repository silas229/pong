"use strict";

(function(){

var anzahl = parseInt(localStorage.getItem('increment'));

var val, row, table = document.getElementsByTagName('tbody')[0];

var values =  [];

for (var i = 0; i < anzahl; i++) {
	if (localStorage.getItem('game' + i) != null)	values.push(JSON.parse(localStorage.getItem('game' + i)));
}

values.sort(function (a, b) {
	if (a.gewonnen > b.gewonnen) {
		return -1;
	}
	if (a.gewonnen < b.gewonnen) {
		return 1;
	}
	if (a.gewonnen == b.gewonnen) {
		if ((a.tore - a.gegentore) > (b.tore - b.gegentore)) {
			return -1;
		}
		if ((a.tore - a.gegentore) < (b.tore - b.gegentore)) {
			return 1;
		}
		return 0;
	}
});

for (var i = 0; i < 5; i++) {
	if (values[i] != null) {
		row = table.insertRow(i);
		row.insertCell(0).innerHTML = values[i]['name'];
		row.insertCell(1).innerHTML = values[i]['gewonnen'];
		row.insertCell(2).innerHTML = values[i]['verloren'];
		row.insertCell(3).innerHTML = values[i]['tore'];
		row.insertCell(4).innerHTML = values[i]['gegentore'];
	}
}

})();
