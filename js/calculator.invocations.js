var selectedIndex = null;
var maxIndex = null;
//Ajout
function addInvocation(){
	var newIndex = 0;
	if(maxIndex != null){
		newIndex = maxIndex +1;
	}
	//Récupération et ajout du template
	var template = getHtmlFromFile("./html/templates/invocation.panel.html");
	template = template.split("INVOCATION_INDEX").join(newIndex+"");
	var invocation_div = $("#invocation_div");
	invocation_div.append(template);
	//Récupération du div de menu
	var templateMenu = getHtmlFromFile("./html/templates/menu.element.html");
	templateMenu = templateMenu.split("INVOCATION_INDEX").join(newIndex+"");
	var menuDiv = $("#invocation_menu");
	menuDiv.append(templateMenu);
	//Retrait du placeOlder
	$("#invocation_menu .placeholder").remove();
	//Mise a jour de la hauteur du bloc bouton:
	$("#bouton_top").height($("#invocation_menu").height());
	maxIndex = newIndex;
	selectInvocation(newIndex);
	
	adjustSize();
}
//Sélection
function selectInvocation(nouvelIndex){
	//Montrer le nouvel Index
	var toShow = $("#Invocation_"+nouvelIndex);
	if(!toShow.length){
		// L'élement n'existe pas, on ne fait rien
		return;
	}
	toShow.removeClass("hidden_elem");
	//Selectionner l'élement de menu
	$("#menu_"+nouvelIndex).addClass("active");
	//Cacher le currentIndex
	if(selectedIndex != null){
		$("#Invocation_"+selectedIndex).addClass("hidden_elem");
		$("#menu_"+selectedIndex).removeClass("active");
	}
	if(nouvelIndex == selectedIndex){
		selectedIndex = null;
	}
	else{
		selectedIndex = nouvelIndex;
	}
}

//Suppression
function deleteInvocation(){
	//On supprime l'invocation et le point de menu
	$("#Invocation_"+selectedIndex).remove();
	$("#menu_"+selectedIndex).remove();
	//Cas optimiste, il n'y a pas besoin de modifier les index
	//Par contre, il faut vérifie le Menu
	var menu = $("#invocation_menu");
	if(menu.html().trim() == ""){
		var template = getHtmlFromFile("./html/templates/menu.placeholder.html");
		menu.append(template);
	}
	monstre = null;
	$("#bouton_top").height($("#invocation_menu").height());
	//Fermer la modale
	$('#delete_confirm_modal').modal('hide');
}
//Chargement
function loadInvocation(event){
	if (event.files && event.files[0]) {
		var myFile = event.files[0];
		var reader = new FileReader();
		
		reader.addEventListener('load', function (e) {
			var newMonstre = JSON.parse(reader.result);
			addInvocation();
			readMonstre(newMonstre);
			calculate();
			event.value = "";
		});
		reader.readAsText(myFile);
	 }   
}

//Calculer les buffs
function calculate() {
	buffs = new Buffs();
	monstre = new Monstre();
	buffs.appliquerA(monstre);
	applyResult();
	adjustSize();
}

//Sauvegarde
function saveInvocation(){
	var tmpMonstre = new Monstre();
	if(tmpMonstre.nom == null || tmpMonstre.nom == ""){
		return;
	}
	var text = JSON.stringify(tmpMonstre);
	var fileName = tmpMonstre.nom;
	fileName+= ".json";
	var blob = new Blob([text],{type:"application/json"});
	download(blob,fileName);
	
}

//Lecture d'un monstre dans le panneau actuel
function readMonstre(monstre){
	if(monstre == null || monstre == undefined){
		return;
	}
	for(var property in monstre){
		var value = monstre[property];
		// Cas spécial, liste.
		if(property == "attaqueList"){
			for(var i = 0; i < 4 ; i++){
				readAttaque(value[i],i+1);
			}
		}
		else if(value != null && value != undefined && value !== ""){
			var CapitalizedProperty = property.charAt(0).toUpperCase() + property.substring(1);
			$("#Invocation_"+selectedIndex+" .inputCreature"+CapitalizedProperty).val(value);
		}
	}
}

//Lecture d'une attaque dans le panneau actuel
function readAttaque(attaque,indexAttaque){
	if(attaque == null || attaque == undefined){
		return;
	}
	for(var property in attaque){
		var value = attaque[property];
		if(value != null && value != undefined && value != ""){
			var CapitalizedProperty = property.charAt(0).toUpperCase() + property.substring(1);
			$("#Invocation_"+selectedIndex+" .inputAttaque"+CapitalizedProperty+indexAttaque).val(value);
		}
	}
}

//Lecture d'un buff dans le panneau actuel
function readBuff(buff){
	if(buff == null || buff == undefined){
		return;
	}
	$('#Invocation_'+selectedIndex+' .inputBuffAugmentSummoning option[value="'+buff.augmentSummoning+'"]').prop('selected', true);
	$('#Invocation_'+selectedIndex+' .inputBuffDeceptiveSummon option[value="'+buff.deceptiveSummon+'"]').prop('selected', true);
	$('#Invocation_'+selectedIndex+' .inputBuffMinorSchooEsoterica option[value="'+buff.minorSchoolEsoterica+'"]').prop('selected', true);
	$('#Invocation_'+selectedIndex+' .inputBuffMightySummon option[value="'+buff.mightySummon+'"]').prop('selected', true);
	
	$("#Invocation_"+selectedIndex+" .inputBuffBonusBardique").val(buff.bonusBardique);
	$("#Invocation_"+selectedIndex+" .inputBuffDegatsFeuBardique").val(buff.degatsFeuBardique);
}

//Recalcul auto
$(window).resize(function() {
	if($(window).width() > 991){
		adjustSize();
	}
	else{					
		var buff_panel = $("#Invocation_"+selectedIndex+" .buff_panel");
		var monstre_panel = $("#Invocation_"+selectedIndex+" .monstre_panel");
		resetSize(buff_panel,monstre_panel);
	}
});

function resetSize(buff_panel,monstre_panel){
	buff_panel.height("auto");
	monstre_panel.height("auto");
}
//Gestion des hauteurs de colonnes pour un joli layout
function adjustSize(){
	var buff_panel = $("#Invocation_"+selectedIndex+" .buff_panel");
	var monstre_panel = $("#Invocation_"+selectedIndex+" .monstre_panel");
	resetSize(buff_panel, monstre_panel);
	var height_buff = buff_panel.height();
	var height_monstre = monstre_panel.height();
	var max_height = (height_buff > height_monstre) ? height_buff : height_monstre;
	buff_panel.height(max_height);
	monstre_panel.height(max_height);
}

/* Gestion des instances d'invocations */
function addInvocationData(){
	var toAppend =  getHtmlFromFile("./html/templates/invocation.instance.html");
	$("#Invocation_"+selectedIndex+" .list_invocation_data").append(toAppend);
	showList();
}
function deleteInvocationData(button){
	$(button).parents('.invocation_data').remove();
	if(!$("#Invocation_"+selectedIndex+" .list_invocation_data").children().length){
		hideList();
	}
}

/* Gestion de l'affichage des panels */
function hideList(){
	$("#Invocation_"+selectedIndex+" .show_list_btn").removeClass("hidden_elem");
	$("#Invocation_"+selectedIndex+" .list_panel .panel-body").addClass("hidden_elem");
	$("#Invocation_"+selectedIndex+" .hide_list_btn").addClass("hidden_elem");
}
function showList(){
	$("#Invocation_"+selectedIndex+" .list_panel .panel-body").removeClass("hidden_elem");
	$("#Invocation_"+selectedIndex+" .hide_list_btn").removeClass("hidden_elem");
	$("#Invocation_"+selectedIndex+" .show_list_btn").addClass("hidden_elem");
}

function hideData(){
	$("#Invocation_"+selectedIndex+" .show_data_btn").removeClass("hidden_elem");
	$("#Invocation_"+selectedIndex+" .data_panel .panel-body").addClass("hidden_elem");
	$("#Invocation_"+selectedIndex+" .hide_data_btn").addClass("hidden_elem");
}
function showData(){
	$("#Invocation_"+selectedIndex+" .data_panel .panel-body").removeClass("hidden_elem");
	$("#Invocation_"+selectedIndex+" .hide_data_btn").removeClass("hidden_elem");
	$("#Invocation_"+selectedIndex+" .show_data_btn").addClass("hidden_elem");
}