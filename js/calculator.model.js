var buffs;
var monstre;

class Attaque{
	constructor(){
	
	}
	
	nom;
	quantite;
	toucher;
	degats;
	degatsBonus;
	multiplicateurCritique;
	critiqueMin;
	notes;
	
	isFilled(){
		var filled = this.nom != null && this.nom !== "";
		filled &= this.toucher != null && this.toucher === this.toucher;
		//filled &= this.degats != null && this.degats !== "";
		return filled;
	}
	isCritValid(){
		return this.multiplicateurCritique == this.multiplicateurCritique && this.multiplicateurCritique > 1
		&& this.critiqueMin == this.critiqueMin && this.critiqueMin <= 20 && this.critiqueMin >= 1;
	}
}

class Monstre{
	constructor(){
		this.nom = $("#Invocation_"+selectedIndex+" .inputCreatureNom").val();
		this.type = $("#Invocation_"+selectedIndex+" .inputCreatureType").val();
	
		this.nombreDv = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureNombreDv").val());
		this.valeurDv = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureValeurDv").val());
		this.initiative = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureInitiative").val());
		
		this.force = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureForce").val());
		this.dexterite = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureDexterite").val());
		this.constitution = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureConstitution").val());
		this.intelligence = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureIntelligence").val());
		this.sagesse = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureSagesse").val());
		this.charisme = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureCharisme").val());
	
		this.armure = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureArmure").val());
		this.reflexes = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureReflexes").val());
		this.vigueur = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureVigueur").val());
		this.volonte = parseInt($("#Invocation_"+selectedIndex+" .inputCreatureVolonte").val());
		
		this.resistances = $("#Invocation_"+selectedIndex+" .inputCreatureResistances").val();
		this.sorts = $("#Invocation_"+selectedIndex+" .inputCreatureSorts").val();
		this.notes = $("#Invocation_"+selectedIndex+" .inputCreatureNotes").val();
		/* Pour le calcul du toucher et des dégats*/
		this.attaqueList = [new Attaque(),new Attaque(), new Attaque(), new Attaque()];
		for(var i = 0; i < 4; i++){
			var atk = this.attaqueList[i];
			var htmlIndex = i + 1;
			atk.nom = $("#Invocation_"+selectedIndex+" .inputAttaqueNom"+htmlIndex).val();
			atk.quantite = parseInt($("#Invocation_"+selectedIndex+" .inputAttaqueQuantite"+htmlIndex).val());
			atk.toucher = parseInt($("#Invocation_"+selectedIndex+" .inputAttaqueToucher"+htmlIndex).val());
			atk.degats = $("#Invocation_"+selectedIndex+" .inputAttaqueDegats"+htmlIndex).val();
			atk.critiqueMin = parseInt($("#Invocation_"+selectedIndex+" .inputAttaqueCritiqueMin"+htmlIndex).val());
			atk.multiplicateurCritique = parseInt($("#Invocation_"+selectedIndex+" .inputAttaqueMultiplicateurCritique"+htmlIndex).val());
			atk.degatsBonus = "";
			atk.notes = $("#Invocation_"+selectedIndex+" .inputAttaqueNotes"+htmlIndex).val();
		}					
		this.bonusPvLvl = 0;
		this.bonusPvTotaux = 0;
		this.isMighty = false;
	}
	
	getPvTotaux(){
		if(this.nombreDv !== this.nombreDv
		|| this.valeurDv !== this.valeurDv
		|| this.constitution !== this.constitution){
			return 0;
		}	
		//Calcul des pv bonus par niveaux
		var pvLvl = getModificateur(this.constitution) + this.bonusPvLvl;
		//Premier DV maxé
		var pv = this.valeurDv + pvLvl;
		if(this.isMighty && this.nombreDv > 1){
			pv += (this.nombreDv - 1) * (this.valeurDv + pvLvl);
		}
		else if(this.nombreDv > 1){
			pv += (this.nombreDv - 1) *( ((this.valeurDv+1) / 2) + pvLvl);
		}
		pv += this.bonusPvTotaux;
		pv = Math.floor(pv);
		return pv;
	}
	
	nom;type;
	nombreDv;valeurDv;initiative;
	force;dexterite;constitution;intelligence;sagesse;charisme;
	armure;reflexes;vigueur;volonte;
	sorts;notes;resistances;
	
	attaqueList;
	
	bonusPvLvl;bonusPvTotaux;isMighty;
}

class Buffs{
	constructor(){
		this.augmentSummoning = $("#Invocation_"+selectedIndex+" .inputBuffAugmentSummoning").val() == "true";
		this.deceptiveSummon = $("#Invocation_"+selectedIndex+" .inputBuffDeceptiveSummon").val() == "true";
		this.minorSchoolEsoterica = $("#Invocation_"+selectedIndex+" .inputBuffMinorSchooEsoterica").val() == "true";
		this.mightySummon = $("#Invocation_"+selectedIndex+" .inputBuffMightySummon").val() == "true";
		
		this.bonusBardique = parseInt($("#Invocation_"+selectedIndex+" .inputBuffBonusBardique").val());
		this.degatsFeuBardique = $("#Invocation_"+selectedIndex+" .inputBuffDegatsFeuBardique").val();
	}
	
	appliquerA(monstre){
		if(! monstre instanceof Monstre){
			return;
		}
		/* Augment Summoning : +4For / Constit , +2 Vigueur, +2Toucher Dégats Cac */ 
		if(this.augmentSummoning){
			monstre.force += 4;
			monstre.constitution += 4;
			monstre.vigueur +=2;
			for(var i = 0; i < 4; i++){
				var atk = monstre.attaqueList[i];
				if(atk.isFilled()){
					atk.toucher +=2;
					if(atk.degats){
						atk.degats +="+2";
					}
				}
			}
		}
		/* Deceptive Summon : +2 PV / Lv, +2 Dégats, Durée x2 (on s'en branle), +2 volonté */
		if(this.deceptiveSummon){
			//+4 Force Constit
			monstre.bonusPvLvl += 2;
			//Effets Connexes : Vigueur + 2, Atk/Dgts +2
			monstre.volonte +=2;
			for(var i = 0; i < 4; i++){
				var atk = monstre.attaqueList[i];
				if(atk.isFilled() && atk.degats){
					atk.degats +="+2";
				}
			}
		}
		/* Minor School Esoterica : +20pv */
		if(this.minorSchoolEsoterica){
			monstre.bonusPvTotaux += 20;
		}
		monstre.isMighty = this.mightySummon
		if(this.bonusBardique === this.bonusBardique){
			for(var i = 0; i < 4; i++){
				var atk = monstre.attaqueList[i];
				if(atk.isFilled()){
					atk.toucher += this.bonusBardique;
					if(atk.degats){
						atk.degats += "+" + this.bonusBardique;
					}
				}
			}
		}
		if(this.degatsFeuBardique != null && this.degatsFeuBardique != ""){
			for(var i = 0; i < 4; i++){
				var atk = monstre.attaqueList[i];
				if(atk.isFilled()){
					atk.degatsBonus += "+"+this.degatsFeuBardique;
				}
			}
		}
	}
	
	augmentSummoning; deceptiveSummon; minorSchoolEsoterica; mightySummon;

	bonusBardique;degatsFeuBardique;
}