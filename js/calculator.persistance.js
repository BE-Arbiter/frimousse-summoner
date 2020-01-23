//Synchronise
function synchroniseInvocations(){
	if(typeof(Storage) === "undefined"){
		alert("Gestion du LocalStorage non supportée");
		return;
	}
	var selectedIndexGlobal = selectedIndex;
	var monstreList = [];
	var buffsList = [];
	var showList = [];
	for(var i = 0; i <= maxIndex ; i++){
		if(!$("#Invocation_"+i).length){
			continue;
		}
		selectedIndex = i;
		monstreList.push(new Monstre());
		showList.push(!$("#Invocation_"+selectedIndex+" .data_panel .panel-body").hasClass("hidden_elem"));
		buffsList.push(new Buffs());
	}
	selectedIndex = selectedIndexGlobal;
	window.localStorage.setItem("CALC_INVOC_LIST",JSON.stringify(monstreList));
	window.localStorage.setItem("CALC_BUFF_LIST",JSON.stringify(buffsList));
	window.localStorage.setItem("CALC_SHOW_LIST",JSON.stringify(showList));
	window.localStorage.setItem("CALC_SELECTED",selectedIndex);
}

//Récupération
$("document").ready(function(){
	if(typeof(Storage) === "undefined"){
		return;
	}
	var buffListString = window.localStorage.getItem("CALC_BUFF_LIST");
	var monstreListString = window.localStorage.getItem("CALC_INVOC_LIST");
	if(!monstreListString){
		return;
	}
	var buffList =  JSON.parse(buffListString);
	var monstreList = JSON.parse(monstreListString);
	
	for(var i =0 ; i< monstreList.length; i++){
		addInvocation();
		
		if(buffListString){
			readBuff(buffList[i]);
		}
		readMonstre(monstreList[i]);
		calculate();
	}
	var selectedIndexStored = JSON.parse(window.localStorage.getItem("CALC_SELECTED"));
	var showListString = window.localStorage.getItem("CALC_SHOW_LIST");
	if(showListString){
		var showList = JSON.parse(showListString);
		for(var i = 0 ; i < showList.length ; i++){
			if(!showList[i]){
				selectedIndex = i;
				hideData();
			}
		}
	}
	if(selectedIndexStored != selectedIndex){
		selectInvocation(selectedIndexStored);
	}
});