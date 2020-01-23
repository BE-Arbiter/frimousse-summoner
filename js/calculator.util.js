//Inclusion des modals
$(document).ready(function() {
	$("#include_about").load("./html/modals/about.html");
	$("#include_confirm_delete").load("./html/modals/confirmDelete.html");
});

//Téléchargement
function download(blob, filename) {
	let a = document.createElement("a");
	document.body.appendChild(a);
	a.setAttribute('style', 'display:none;');
	let url = window.URL.createObjectURL(blob);
	a.download = filename;
	a.href = url;
	a.click();
}
//Gestions des caractéristiques
function getModificateur(value){
	return Math.floor((value - 10) / 2) ;
}

//Copier (Pas utilitaire Mais Roll20
function copyAtk(indexAttaque){
	if(indexAttaque == 0){
		indexAttaque = "All"
	}
	var toCopy = $("#Invocation_"+selectedIndex+" .cpyAtk"+indexAttaque).val();
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(toCopy).select();
	document.execCommand("copy");
	$temp.remove();
}
// Appliquer une valeur a un sélecteur
function applyValueString(selector,value,defaultValue){
	if(selector == null || selector == null || selector == ""){
		return;
	}
	if(value != null && value != null && value != ""){
		 $(selector).text(value);
	}
	else if(defaultValue != null && defaultValue != null && defaultValue != ""){
		 $(selector).text(defaultValue);
	}
	else{
		 $(selector).text("N / A");
	}
}

function applyValueNumber(selector,value){
	if(selector == null || selector == null || selector == ""){
		return;
	}
	if(value == null || value == undefined || value !== value){
		 $(selector).text("X");
	}
	$(selector).text(value);
	
}

function getSafeNumber(val){
	if(val == null || val == undefined || val !== val){
		return 0;
	}
	return val;
}
//Récupération d'un fichier Externe
function getHtmlFromFile(filename){
	var html;
	$.ajax({
		dataType: "html",
		crossDomain: true,
		async: false,
		method: 'get',
		url: filename,
		success: function(data){
			html = data;
		}
	});
	return html;
}

//Gestion de l'output
function applyResult(){
	//Nom
	applyValueString("#menu_"+selectedIndex+" .nom_menu",monstre.nom,"Invocation");
	applyValueString("#Invocation_"+selectedIndex+" .outpuNom",monstre.nom,"Invocation");

	//Type
	applyValueString("#Invocation_"+selectedIndex+" .outputType",monstre.type,"Type de l'invocation");
	//Force + Mod
	applyValueNumber("#Invocation_"+selectedIndex+" .outputForce",monstre.force);
	applyValueNumber("#Invocation_"+selectedIndex+" .outputForceMod",getModificateur(monstre.force));
	//Dex + Mod
	applyValueNumber("#Invocation_"+selectedIndex+" .outputDexterite",monstre.dexterite);
	applyValueNumber("#Invocation_"+selectedIndex+" .outputDexteriteMod",getModificateur(monstre.dexterite));
	//Constit + Mod
	applyValueNumber("#Invocation_"+selectedIndex+" .outputConstitution",monstre.constitution);
	applyValueNumber("#Invocation_"+selectedIndex+" .outputConstitutionMod",getModificateur(monstre.constitution));
	//Intelligence + Mod
	applyValueNumber("#Invocation_"+selectedIndex+" .outputIntelligence",monstre.intelligence);
	applyValueNumber("#Invocation_"+selectedIndex+" .outputIntelligenceMod",getModificateur(monstre.intelligence));
	//Sagesse + Mod
	applyValueNumber("#Invocation_"+selectedIndex+" .outputSagesse",monstre.sagesse);
	applyValueNumber("#Invocation_"+selectedIndex+" .outputSagesseMod",getModificateur(monstre.sagesse));
	//Charisme + Mod
	applyValueNumber("#Invocation_"+selectedIndex+" .outputCharisme",monstre.charisme);
	applyValueNumber("#Invocation_"+selectedIndex+" .outputCharismeMod",getModificateur(monstre.charisme));
	//CA
	applyValueNumber("#Invocation_"+selectedIndex+" .outputArmor",monstre.armure);
	//Reflexe
	applyValueNumber("#Invocation_"+selectedIndex+" .outputRef",monstre.reflexes);
	//Vigueur
	applyValueNumber("#Invocation_"+selectedIndex+" .outputVig",monstre.vigueur);
	//Volonté
	applyValueNumber("#Invocation_"+selectedIndex+" .outputVol",monstre.volonte);
	//Sorts
	applyValueString("#Invocation_"+selectedIndex+" .outputSorts",monstre.sorts,"N / A");
	//Résistances
	applyValueString("#Invocation_"+selectedIndex+" .outputResistances",monstre.resistances,"N / A");
	//Notes
	applyValueString("#Invocation_"+selectedIndex+" .outputNotes",monstre.notes,"N / A");
	
	//PV (Cas Spécial)
	var pvLvl = getModificateur(monstre.constitution) + monstre.bonusPvLvl;
	$("#Invocation_"+selectedIndex+" .outputPv").text( getSafeNumber(monstre.getPvTotaux()) + " (" + getSafeNumber(monstre.nombreDv) + "d" + getSafeNumber(monstre.valeurDv) + "+" + getSafeNumber(pvLvl) + ")" );
	//Initiative
	applyValueNumber("#Invocation_"+selectedIndex+" .outputInit",monstre.initiative);
	//Attaques
	var hasAtleastOneAttack = false;
	for(var i = 0; i < 4; i++){
		var atk = monstre.attaqueList[i];
		var htmlIndex = i+1;
		if(atk.isFilled()){
			hasAtleastOneAttack = true;
			$("#Invocation_"+selectedIndex+" .atk"+htmlIndex+"row").show();
			var degats = atk.degats ? atk.degats+atk.degatsBonus : "";
			applyValueString("#Invocation_"+selectedIndex+" .outputAtk"+htmlIndex+"Degats",degats,"Aucun Dégats");
			applyValueString("#Invocation_"+selectedIndex+" .outputAtk"+htmlIndex+"Nom",atk.nom,"Aucun Nom");
			applyValueNumber("#Invocation_"+selectedIndex+" .outputAtk"+htmlIndex+"Nombre",atk.quantite);
			var toucher = "1d20 + "+ getSafeNumber(atk.toucher);
			if(atk.isCritValid()){
				var plageCritique = "20";
				if(atk.critiqueMin < 20){
					plageCritique = atk.critiqueMin + "-20"
				}
				toucher+= " ("+plageCritique+"/x"+atk.multiplicateurCritique+")";
			}
			applyValueString("#Invocation_"+selectedIndex+" .outputAtk"+htmlIndex+"Toucher",toucher,"1d20");
			$("#Invocation_"+selectedIndex+" .cpyAtk"+htmlIndex).val(generateTemplatesAttaque(atk));
			if(atk.notes){
				$("#Invocation_"+selectedIndex+" .outputAtk"+htmlIndex+"Notes").removeClass("hidden_elem");
				applyValueString("#Invocation_"+selectedIndex+" .outputAtk"+htmlIndex+"Notes span",atk.notes,"-");
			}
			else{
				$("#Invocation_"+selectedIndex+" .outputAtk"+htmlIndex+"Notes").addClass("hidden_elem");
			}
		}
		else{
			$("#Invocation_"+selectedIndex+" .atk"+htmlIndex+"row").hide();
		}
	}
	if(hasAtleastOneAttack){
		$("#Invocation_"+selectedIndex+" .attackHeader").show();
		$("#Invocation_"+selectedIndex+" .cpyAtkAll").val(generateTemplatesAttaques());
		
	}
	else{
		$("#Invocation_"+selectedIndex+" .attackHeader").hide();				
	}
}
