var headerTemplate = "&{template:DnD35Attack} {{name=CHARACTER_NAME}} {{subtags=ATK_TITLE }} {{pcflag=false}} ";
var fullAttackTemplate = "{{fullattackflag=[[d1]]}}";
var Attack_Template = "{{attackATK_COUNT=ATK_NAMEATK_INDEXT:[[1d20+ATK_BONUS]]}} {{damageATK_COUNT=D:[[ATK_DAMAGE]]}} ";
var Attack_Template_Crit = "{{attackATK_COUNT=ATK_NAMEATK_INDEXT:[[{d20cs>MOD_CRIT}+ATK_BONUS]]}}{{critconfirmATK_COUNT=Confirmation :[[{d20+ATK_BONUS}]] }}{{damageATK_COUNT=D:[[ATK_DAMAGE]]}}{{critdmgATK_COUNT=+[[ (CRIT_DAMAGE) * (CRIT_MULT - 1)]]}} ";
var Attack_Template_Notes="{{notes= Note: ATK_NOTES}}";
function generateTemplatesAttaque(atk){
	if(!(atk instanceof Attaque) || !atk.isFilled()){
		/* Ne rien faire */
		return;
	}
	var header = JSON.parse(JSON.stringify(headerTemplate));
	header = header.split("CHARACTER_NAME").join(monstre.nom);
	header = header.split("ATK_TITLE").join("Attaque avec "+atk.nom);
	var attack = JSON.parse(JSON.stringify(Attack_Template));
	if(atk.isCritValid()){
		attack = JSON.parse(JSON.stringify(Attack_Template_Crit));
		attack = attack.split("MOD_CRIT").join(atk.critiqueMin);
		attack = attack.split("CRIT_DAMAGE").join(atk.degats);
		attack = attack.split("CRIT_MULT").join(atk.multiplicateurCritique);
	}
	attack = attack.split("ATK_COUNT").join("1");
	attack = attack.split("ATK_NAME").join("");
	attack = attack.split("ATK_INDEX").join("");
	attack = attack.split("ATK_BONUS").join(atk.toucher);
	var damage = atk.degats ? atk.degats+atk.degatsBonus : "0";
	attack = attack.split("ATK_DAMAGE").join(damage);
	var notes = "";
	if(atk.notes){
		notes = JSON.parse(JSON.stringify(Attack_Template_Notes));
		notes = notes.split("ATK_NOTES").join(atk.notes);
	}
	return header+attack+notes;
}

function generateTemplatesAttaques(){
	var count = 1;
	var toReturn = JSON.parse(JSON.stringify(headerTemplate));
	toReturn = toReturn.split("CHARACTER_NAME").join(monstre.nom);
	toReturn = toReturn.split("ATK_TITLE").join("Attaque à Outrance");
	var notes = "";
	for(var i = 0; i < 4; i++){
		var atk = monstre.attaqueList[i];
		if((atk instanceof Attaque) && atk.isFilled()){
			notes+= atk.notes? atk.notes+" --- " : "";
			for(var j = 0; j < atk.quantite; j++){
				if(count == 2){
					toReturn+=JSON.parse(JSON.stringify(fullAttackTemplate));
				}
				var attack = JSON.parse(JSON.stringify(Attack_Template));
				if(atk.isCritValid()){
					attack = JSON.parse(JSON.stringify(Attack_Template_Crit));
					attack = attack.split("MOD_CRIT").join(atk.critiqueMin);
					attack = attack.split("CRIT_DAMAGE").join(atk.degats);
					attack = attack.split("CRIT_MULT").join(atk.multiplicateurCritique);
				}
				attack = attack.split("ATK_COUNT").join(count+"");
				count++;
				attack = attack.split("ATK_NAME").join(atk.nom);
				var indexAtk = j + 1;
				attack = attack.split("ATK_INDEX").join(" "+indexAtk+" ");
				attack = attack.split("ATK_BONUS").join(atk.toucher);
				var damage = atk.degats ? atk.degats+atk.degatsBonus : "0";
				attack = attack.split("ATK_DAMAGE").join(damage);
				toReturn+= attack;
			}
		}
	}
	if(notes){
		var noteTemplate = JSON.parse(JSON.stringify(Attack_Template_Notes));
		toReturn += noteTemplate.split("ATK_NOTES").join(notes);
	}
	return toReturn;
}