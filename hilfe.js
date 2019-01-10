"use strict";

var inhalte = document.getElementsByClassName("inhalt");
var buttons = document.getElementsByTagName("button");
function toggle(nr) {
	if (inhalte[nr].style.display == "none") {
		inhalte[nr].style.display = "block";
		buttons[nr].innerHTML = "-";
	} else {
		inhalte[nr].style.display = "none";
		buttons[nr].innerHTML = "+";
	}
}
