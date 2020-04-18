# GreenTurismo - Enzo Contini / Hugo Ferrer

Déjà, on espère que notre nom de projet vous a fait rire, ou au moins esquissé un sourire (On veut pas dénoncer mais Monsieur Yannick Joly nous a dit que ça pouvait valoir des points).

Cela dit, petit tutoriel pour utiliser notre application.

## Mise en route

Nous vous recommandons d'utiliser xampp pour un serveur local, il suffit de lancer "Apache". 

Vous trouverez ici notre [repository](https://github.com/Schuylinx/GreenTurismo) (il est public mais normalement vous aviez été ajoutés dessus au début du projet).

Placez-vous dans le dossier `\xampp\htdocs`, créez un repository pour notre projet et clonez le.

> git clone [https://github.com/Schuylinx/GreenTurismo](https://github.com/Schuylinx/GreenTurismo)

 Si "Apache" a bien été lancé, accédez à l'URL : [localhost](http://localhost/GreenTurismo/index.html) ET TADA l'application démarre.
 
## Utilisation

L'interface est plutôt simple, des champs pour sélectionner le départ et l'arrivée, une box pour sélectionner le véhicule et un slider pour l'autonomie restante au début du trajet.

Normalement, lorsque vous allez vouloir tester notre application, à la première recherche, l'API `leaflet-routing-machine` va demander d'accepter les certificats dans la console (il est possible que cette manipulation ne soit pas obligatoire cependant).

Rien de plus simple, il suffit de cliquer sur le lien dans la console et d'accepter même si le site peut être dangereux, oups, allez un peu de confiance ! (source : croyez-nous)

Nous vous recommandons également ces itinéraires qui permettent de prouver efficacement (car nous avons un fichier réduit de bornes de recharges) que notre application fonctionne correctement : 

|Départ| Arrivée | Véhicule | Autonomie | Nombre d'arrêt(s) calculé(s) par l'application
|--|--|--|--|--|
| Lyon | Lons-Le-Saunier  | Tesla ou Zoé | 85km, soit environ 21% pour la Tesla et 34% pour la Zoé| 1 |
| Lyon | Paris | Tesla ou Zoé | 140km, soit environ 35% pour la Tesla et 56% pour la Zoé| 3 |


## Fonctionnalités 

## Architecture 

