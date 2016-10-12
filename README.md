# node-cqrs-framework

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![CodeFactor](https://www.codefactor.io/repository/github/gperreymond/node-cqrs-framework/badge)](https://www.codefactor.io/repository/github/gperreymond/node-cqrs-framework)

Do not use, research only.  

## Prepare for development

Il faut que __docker__ et __docker-compose__ soient installés sur votre machine.  
Le lancement s'effectue via des commande npm.

#### 1) Démarrage des dockers sur la machine de development

```
$ npm run deve:prepare
```

Voici la liste des __containers__ qui vont être utilisés et démarrés :

- [x] rethinkdb:latest
- [x] rabbitmq:management

#### 2) Configuration automatique des variables d'environnement

```
$ npm run deve:config
```

## Engine

C'est le chef d'orchestre du CQRS.

### Trigger

Un __trigger__ écoute sur le bus le passage des évènements.  
Si un évènement lui est destiné, il le prend et le traite via son __handler__.
Un __trigger__ n'est pas une promesse, à la fin du handler le process se termine.

Un __trigger__ peut être :

- Utilisé pour un système de logs, ELK par exemple
- Utilisé pour lancer un ou plusieurs batchs
- Utilisé pour lancer d'autres évènements sur le bus
- Utilisé pour lancer des commandes
- Etc...

Il existe deux types de __triggers__ :

- __System__ : Générés automatiquement par de le démarrage de __engine__
- __Custom__ : Les votres, faites vous plaisir

## Service

Le __service__ est l'élément de base du CQRS, il faut le voir comme un __microservice__ ou une __task__.  
La résolution d'un __service__ entraîne automatiquement :

- L'emission d'un évènement sur le bus en cas de succès
- L'emission d'un évènement sur le bus en cas de d'erreur

Ces évènements sont générés automatiquement par le démarrage de __engine__ ; Vous n'avez rien à faire, ni à déclarer.

Techniquement un __service__ c'est :

- Un élément bas niveau
- Un élément à ne jamais exposer directement
- Un élément dont son handler est une promesse

## Command

Une __command__ est un __service__ renvoyant un état (success ou error) et non des données.

## Query

Une __query__ est un __service__ renvoyant des données ou un état (error).

## Architecture CQRS

Vous avez un exemple assez large de tout ce que l'on peut faire dans le dossier __cqrs__ du projet.

- [x] Utilisation de rethinkdb sous forme de services via __feathers-rethinkdb__
- [ ] Utilisation de MySQL via knex
- [ ] Traitement d'image par imageMagick
- [ ] Analyse d'image par OpenCV

#### 1) Les fichiers sources

Vous pouvez organiser votre architecture comme bon vous semble, il vous suffit de pointer vers les patterns de fichiers/dossiers souhaités, au format glob, lors du lancement de __engine__.

```javascript
'use strict'

const Engine = require('node-cqrs-framework').Engine

const engine = new Engine({
  source: path.resolve(__dirname, '../../../..', 'cqrs'),
  patterns: [
    'domains/*/commands/*.js',
    'domains/*/queries/*.js'
  ]
})
```

#### 2) Création d'une commande

- Le nom du fichier doit contenir __Command__
- Le chemin n'a pas d'importance
- Le __handler__ doit être une promesse

```javascript
'use strict'

const Promise = require('bluebird')

const handler = function (params = {}) {
  return new Promise((resolve, reject) => {
    resolve({debug: true})
  })
}

module.exports = handler
```
