# Chatting App

*Ce projet est mon tout premier projet sérieux que je réalise en web ! Il s'agit d'une application de disscussion en ligne simple inspirée de  [Cette vidéo](https://youtu.be/W3sOezpkGWI?si=iVqz2ByxrF36mSXy) que j'ai vu passé dans mon feed youtube. J'espère que ce projet vous plaira et qu'il pourra vous aider si vous avez l'intention de faire quelque chose de similaire !*

![](/public/icon.png)

## Outils utilisés

Tout d'abord avant de commencer la présentation de l'application, voici ma stack, elle n'est pas indispensable pour refaire un projet comme celui-ci, il y a des moyens plus simples, mais c'est ce que j'utilise le plus souvent:

- NextJs (Framework React)
- TailwindCss (Frameword Css)
- TypeScript 
- Prisma (ORM)

## Structure de l'application 

Pour cela, j'ai été au plus simple avec une page de connexion/inscription et une page où l'on retrouve les discussions avec d'autres utilisateurs.

![](/public/logPage.png)

![](/public/homePage.png)

_Attention: Ces images datent du 1/08/24, durant la phase de développement, il se peut donc que le design ai changé ou que de nouvelles features soient apparu !_

## Objectifs techniques et explication des choix

Durant le développement de l'application et tout au long de ce projet, j'ai cherché à parvenir à créer quelque chose de qualitatif, en pensant tout d'abord à la légèreté du projet (uniquement 2 pages, minimum de requêtes API) ainsi qu'à la sécurité (transfère des données en arrière-plan, utilisation d'un ORM).

## Objectifs futures

L'application étant toujours en cours de développement, il me reste des idées à mettre en place afin d'améliorer toujours le projet ainsi que l'expérience utilisateur. Les principales sont :

- ~~Possibilité de supprimer une conversation~~ _(Fini)_
- ~~Mode jour/nuit~~ _(Fini)_
- Responsive mobile
- Pouvoir choisir sa photo de profil

## Récupération du code source

``` bash
$> cd dossier/de/ton/projet
$> git clone https://github.com/matheokcx/chatting_app.git 
```