# node-cqrs-framework

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Do not use, research only.  

## Prepare for development

Il faut que __docker__ et __docker-compose__ soient installés sur votre machine.  
Le lancement s'effectue via des commande npm.

#### 1) Démarrage des dockers sur la machine de development

```
$ npm run deve:prepare```

Voici la liste des __containers__ qui vont être utilisés et démarrés :

- [x] rethinkdb:latest
- [x] rabbitmq:management

#### 2) Configuration automatique des variables d'environnement

```
$ npm run deve:config```

## Engine

## Trigger

## Command

Une commande est un trigger pouvant se déclencher de manière manuelle ou évènementielle.

## Query

Une query est un trigger ne pouvant se déclencher que manuellement.

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
})```

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

module.exports = handler```
