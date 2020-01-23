# frimousse-summoner
######Par Arbiter - Ce logiciel est fourni tel-quel sans garantie aucune.</p>

##Description
"Calculatrice Invocation" est une application simple écrite en HTML/CSS/JS, utilisant les framework jquery et bootstrap 3. Ces technologies ont été sélectionnées car elles permettaient un développement rapide de l'application et permettra à terme de la déployer ou je veux.

Celle-ci sert à gérer les invocations de mon personnage "Frimousse l'invocateur" dans ma table de donjon 3.5, avec les dons, objets, capacités et alliés augmentant celles-ci il devenait très complexe de faire les calculs des pvs et des attaques. Entrainant une perte de temps et une certaine frustration de ma part.

"Calculatrice Invocation" permet donc de gérer les stats des invocations et calcule automatiquement les buffs appliqués à celles-ci. De plus, elle permet de générer les commandes d'attaques pour Roll20.

##Instructions
Clic et regarde ce que ça fait... humm....bon...
L'application est composé d'une listre d'invocations (Initialement vide) et des boutons "Ajouter", "Charger" et "Synchroniser".
Le bouton "Ajouter" Crée une nouvelle invocation. Le bouton charger permet de charger un fichier JSON contenant une invocation préalablement sauvegardée sur disque. Le bouton synchroniser sauvegarde l'état actuel de la liste dans la mémoire du navigateur et celle-ci sera chargée lors du prochain démarrage de l'application.
Pour sélectionner une invocation il suffit de cliquer sur son nom.

Chaque invocation est composé d'un bloc de donnée, d'un bloc de buffs (bon, j'ai mis que ceux qui m'étaient utiles, j'avoue), et d'un paneau résultat.

Le bloc de données à dans sont entête trois bouton: "Sauvegarder", "Supprimer" , "Afficher/Cacher le bloc de donnée"
Il m'y est possible d'entrer les données suivantes :
*nom
*Type
*Nombre de dés de vies
*Valeur du dés de vie
*Initiative
*Force
*Dextérité
*Constitution
*Intelligence
*Sagesse
*Charisme
*Armure
*Réflexe
*Vigueur
*Volonté
*Sorts / Pouvoirs Magiques
*Résistances / Immunité
*Notes
*4 attaques composées de : "Nom","Quantité","Bonus Toucher" (Nombre),"Dégats" (XDX+X), Critique, Multiplicateur et Notes

Le bloc de données de buffs me permet de sélectionner les buffs à appliquer au monstre:
*Le don "Augment Summoning"
*La capacité de classe "Deceptive Summon"
*La capacité de classe "Minor School Esoterica"
*La capacité de l'anneau de "Mighty Summon"
*Un bonus Bardique au touché et aux dégats
*Un bonus Bardique de dégats de feux (XD6)
*Un bouton pour initier le calcul

Le bloc de résultats afficheras les données de l'invocation une fois les buffs appliqués. Il est important de noter la présence de boutons à cotés des attaques. Qui permettent de copier dans le presse papier un template roll20 de celle-ci.