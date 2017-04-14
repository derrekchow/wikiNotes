var EDITS = 'edits.html';
var COURSES = 'courses.html';
var FAVS = 'favs.html';
var QUILL = 'quill.html';

$('document').ready(function() {
	loadBoxes(data, data, data);
});

var renderPage = function(page) {
	$.get(page, function(result) {
		$('#content').html(result);
	});
}

var activeItem = function(item) {
	$('.mdl-navigation__link').removeClass('mdl-navigation__link--current');
	item.addClass('mdl-navigation__link--current');
}

var onSignIn = function(googleUser) {
	renderPage(COURSES);
	activeItem($('#courses'));
	$('.header').hide();
	$('#signIn').hide();
	var profile = googleUser.getBasicProfile();
	$('.userItem').show();
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail());

	$('#userName').html(profile.getName());
	$('#userEmail').html(profile.getEmail());
	$('.image-cropper').html('<img src="' + profile.getImageUrl() + '" class="rounded" />');
	$('.g-signin2').hide();
	$('#accountNav').show();
}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
		$('#accountNav').hide();
		location.reload();
	});
}

var loadBoxes = function(data, topicData, fullData) {
	activeItem($('#browse'));
	$('#back').unbind().click(function() {
		if (data.level == 4) {
			loadBoxes(unitData, topicData, fullData);
		} else {
			loadBoxes(topicData, fullData, fullData);
		}
	});
	if (data.level > 1) {
		$('.header').hide();
		$('#back').show();
	} else if (data.level == undefined || data.level <= 1) {
		$('#back').hide();
		$('.header').show();
	}
	var content = ""
	var box;

	for (i in data) {
		if (i != 'level' && data['level'] == 3) {
			if (data[i].added == true) {
				box = '<div class="box mdl-cell mdl-cell--3-col mdl-cell--12-col-phone mdl-card mdl-shadow--2dp" id="' + i + '"><div class="mdl-card__title"><h2 class="mdl-card__title-text">' + data[i].name + '</h2></div><div class="add_button" align="right" style="position: absolute; bottom:0; padding:1rem; right:0" class="mdl-card__actions"><button class="mdl-button mdl-js-button mdl-button--icon  mdl-button--colored"> <i class="material-icons">check</i> </button></div><i align="center" class="material-icons" style="font-size:120px; color:#03A9F4; opacity:.5"">' + data[i].icon + '</i></div>';
			} else {
				box = '<div class="box mdl-cell mdl-cell--3-col mdl-cell--12-col-phone mdl-card mdl-shadow--2dp" id="' + i + '"><div class="mdl-card__title"><h2 class="mdl-card__title-text">' + data[i].name + '</h2></div><div class="add_button" align="right" style="position: absolute; bottom:0; padding:1rem; right:0" class="mdl-card__actions"><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored"> <i class="material-icons">add</i> </button></div><i align="center" class="material-icons" style="font-size:120px; color:#03A9F4; opacity:.5">' + data[i].icon + '</i></div>';
			}
			content += box;
		}
		else if (i != 'level') {
			box = '<div class="box mdl-cell mdl-cell--3-col mdl-cell--12-col-phone mdl-card mdl-shadow--2dp" id="' + i + '"><div class="mdl-card__title"><h2 class="mdl-card__title-text">' + data[i].name + '</h2></div><i align="center" class="material-icons" style="font-size:120px; color:#8BC34A; opacity:.5">' + data[i].icon + '</i></div>';
			content += box;
		}
	}
	$('#content').hide().html(content).fadeIn();
	content = "";
	$('.box').click(function(event) {
		var topicData = data[$(event.currentTarget)[0].id].topics;
		if (data.level == 3) {
			content += '<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp is-upgraded" align="center" data-upgraded=",MaterialDataTable"><thead> <tr align="center"><th class="mdl-data-table__cell--non-numeric">Unit</th> <th>Notes</th> <th>Last Modified</th> <th>Favourite</th> </tr> </thead><tbody>';
			var line;
			for (i in topicData) {
				if (topicData[i].fav == true && i != 'level') {
					line = '<tr class="lesson" id="' + topicData[i].file + '"><td class="mdl-data-table__cell--non-numeric">' + topicData[i].name + '</td> <td><button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons">insert_drive_file</i></button></td> <td>' + topicData[i].modified + '</td> <td> <label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect" for="icon-toggle-2"> <input type="checkbox" id="icon-toggle-2" class="mdl-icon-toggle__input"> <i class="mdl-icon-toggle__label material-icons">star</i> </label></td> </tr>';
					content += line;
				} else if (i != 'level') {
					line = '<tr class="lesson" id="' + topicData[i].file + '"><td class="mdl-data-table__cell--non-numeric">' + topicData[i].name + '</td> <td></td><td>' + topicData[i].modified + '</td> <td> <label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect" for="icon-toggle-2"> <input type="checkbox" id="icon-toggle-2" class="mdl-icon-toggle__input"> <i class="mdl-icon-toggle__label material-icons">star</i> </label></td> </tr>';
					content += line;
				}				
			}
			content += '</tbody></table>';
			$('#content').hide().html(content).fadeIn();
			componentHandler.upgradeAllRegistered();
			unitData = data;
			data = topicData;
		} else {
			loadBoxes(topicData, data, fullData);
		}
		$('.lesson').click(function(event) {
			if ($(event.target)[0].innerText == "insert_drive_file") {
				$('#notes').trigger('click');
			} else {
				var file = event.currentTarget.id;
				console.log(file);
				content = renderPage(QUILL);
				$('.fileName').attr('id', file);
				$('#search').hide();
			}
		});
	});
	

}