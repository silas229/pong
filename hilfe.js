"use strict";

//Beschreibender Text und Button mit + oder -
var inhalte = document.getElementsByClassName("inhalt");
var buttons = document.getElementsByTagName("button");

/**
 * Beschreibende Texte werden ein- und ausgeklappt.
 * @param  {int} nr welcher Punkt
 */
function toggle(nr) {
	if (inhalte[nr].style.display == "none") {
		inhalte[nr].style.display = "block";
		buttons[nr].innerHTML = "-";
	} else {
		inhalte[nr].style.display = "none";
		buttons[nr].innerHTML = "+";
	}
}
