/******************************************************************************
 ** Much of the structure of this JavaScript is related to the ajaxcode file
 ** demo.js posted from the CS 290 lecture.
 *****************************************************************************/

var favorites = null;

function Gist(gName, gURL) {
	this.gName = gName;
	this.gURL = gURL;
}

function addGist(favorites, gist) {
	if(gist instanceof Gist) {
		favorites.gists.push(gist);
		localStorage.setItem('userFavorites', JSON.stringify(favorites));
		return true;
	}
	console.error('Not a gist!');
	return false;
}

function ddGist(Gist) {
	var dl = document.createElement('dl');
	var entry = dlEntry('', Gist.gName);

	dl.appendChild(entry.dt);
	dl.appendChild(entry.dd);

	entry = dlEntry('', Gist.gURL);

	entry.a.href = Gist.gURL;
	entry.dd.appendChild(entry.a);

	dl.appendChild(entry.a);
	dl.appendChild(entry.favSubmit);

	return dl;
}

function dlEntry(term, definition) {
	var dt = document.createElement('dt');
	var dd = document.createElement('dd');
	var a = document.createElement('a');
	dt.innerText = term;
	dd.innerText = definition;
	a.innerHTML = definition;

	var favSubmit = document.createElement('input');
	if(definition.includes('http')) {

		favSubmit.type = "button";
		favSubmit.name = "FavSubmitButton";
		favSubmit.value = "Save";
		favSubmit.id = "FavFormSubmit";

	}

	return {'dt':dt, 'dd':dd, 'a':a, 'favSubmit':favSubmit};
}

function createGistList(ul, name, url) {
	var li = document.createElement('li');
	var newGist = new Gist(name, url);
	li.appendChild(ddGist(newGist));
	ul.appendChild(li);
}

function getGists() {
	var req = new XMLHttpRequest();
	if(!req) {
		throw 'Unable to create Http Request!';
	}
	var url = 'https://api.github.com/gists/public';
	req.onreadystatechange = function(){
		if(this.readyState == 4) {
			for(var i = 0; i < 30; i++) {
				var gistIn = JSON.parse(this.responseText);

				var name = gistIn[i].description;
				if(name == null || name == "") {
					name = "No Description Provided";
				}
		
				var gistURL = gistIn[i].url;

				createGistList(document.getElementById('gists'), name, gistURL);
			}


			var gistFavButtons = document.getElementsByName('FavSubmitButton');
			for(var j = 0; j < 30; j++) {

				gistFavButtons[j].onclick = function() {
						var tmpName = this.parentNode.childNodes[1].innerText;
						var tmpURL = this.parentNode.childNodes[2].innerText;
						window.alert(tmpName + " added to favorites!");
						var tmpGist = new Gist(tmpName, tmpURL);
						addGist(favorites, tmpGist);
				};
			}

		}
	};
	req.open('GET', url);
	req.send();
}

function submitToGetGists() {
	getGists();
}

function gistSearch() {
	var searchName = document.getElementById("searchField").value;
	var req = new XMLHttpRequest();
	if(!req) {
		throw 'Unable to create Http Request!';
	}
	var url = 'https://api.github.com/gists/public';
	req.onreadystatechange = function() {
		if(this.readyState == 4) { 
			var count = 0;
			for(var i = 0; i < 30; i++) {
				var gistIn = JSON.parse(this.responseText);

				var name = gistIn[i].description;
				if(name == null || name == "") {
					name = "No Description Provided";
				}
				var gistURL = gistIn[i].url;

				if(name.includes(searchName)) {
					createGistList(document.getElementById('gists'), name, gistURL);
					count += 1;
				}
			}
			if(count == 0) {
				window.alert("No recent gists found by that name!");	
			}
		}
	};
	req.open('GET', url);
	req.send();
}

window.onload = function() {
	var favoritesStr = localStorage.getItem('userFavorites');
	if(favoritesStr == null) {
		favorites = {'gists': []};
		localStorage.setItem('userFavorites', JSON.stringify(favorites));
	} else {
		favorites = JSON.parse(localStorage.getItem('userFavorites'));
		var gistFavoriteList = favorites.gists;
		for(var i = 0; i < gistFavoriteList.length; i++) {
			createGistList(document.getElementById('favoritesList'), gistFavoriteList[i].gName, gistFavoriteList[i].gURL);
		}
	}
}

