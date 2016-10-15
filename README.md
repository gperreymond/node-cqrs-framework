# node-cqrs-framework

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![CodeFactor](https://www.codefactor.io/repository/github/gperreymond/node-cqrs-framework/badge)](https://www.codefactor.io/repository/github/gperreymond/node-cqrs-framework)  
[![CircleCI](https://circleci.com/gh/gperreymond/node-cqrs-framework.svg?style=svg)](https://circleci.com/gh/gperreymond/node-cqrs-framework)

node-cqrs-framework is a node.js framework that helps you to implement microservices and scalability for cqrs architectures over rabbitmq service discovery.

## Description

*This project has just started, do not use yet.*

Think better! Think KISS!

## Advantages

* Only one monolithic project in your github.
* Only one monolithic project to maintain.
* Could be DDD oriented if you want.
* Configuration-driven oriented framework.
* Agnostics commands and queries, they just had to be promises.
* Tests are dissociate from the CQRS (more easy to implements).
* Deploy and scale your microservices like you want.
* Automatic services discovery! Thanks rabbitmq.

## Installation  

```
$ npm i -S node-cqrs-framework
```

## Description

#### Engine

The __engine__ is the main program, he needs to be start at first. Because the project is configuration-driven, you only need those lines of code to start all selected microservices in a row.

```javascript
'use strict'

const path = require('path')
const Engine = require('node-cqrs-framework').Engine

const engine = new Engine({
  source: path.resolve(__dirname, 'application'),
  patterns: [
    'domains/*/commands/*.js',
    'domains/*/queries/*.js'
  ]
})

console.log('engine on initialize')
engine.initialize()
  .then(() => {
    console.log('engine has initialized')
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
```

#### Service

A __service__ is the base element of the CQRS, see that like a microservice or a task. The resolution of a __service__ will automaticaly :

- Send an event on the bus in case of success
- Send an event on the bus in case of error

You will never have to use this class, __Command__ and __Query__ extend it.

#### Command

A __command__ is a __service__ who gives back states instead of data. Those states are a success and an error.

How to create a __Command__ ?

- You need to create a file who contains __"Command"__ in his name
- You need to __module.exports__ a promise

And that's all folks, the __engine__ will make the rest for you.

In this example, __CreateIndividualCommand.js__ will create a new entry in rethinkdb table __individuals__, after the data validation will succeed.

```javascript
'use strict'

const Promise = require('bluebird')
const Joi = require('joi')

const rethinkdb = require('./lib/rethinkdb')
const schema = require('./schema/individual')

const handler = function (params = {}) {
  return new Promise((resolve, reject) => {
    Joi.validate(params, schema, (error) => {
      if (error) { return reject(error) }
      rethinkdb.service('individuals').create(params).then(resolve).catch(reject)
    })
  })
}

module.exports = handler
```

#### Query

Une __query__ est un __service__ renvoyant des données ou un état (error).

#### Trigger

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

## Architecture CQRS

Vous avez un exemple assez large de tout ce que l'on peut faire dans le dossier __example__ du projet.

- [x] Utilisation de rethinkdb sous forme de services via __feathers-rethinkdb__
- [x] Un exemple de client utilisant directement le bus rabbitmq
- [ ] Utilisation de MySQL via knex
- [ ] Traitement d'image par imageMagick
- [ ] Analyse d'image par OpenCV

#### Les fichiers sources

Vous pouvez organiser votre architecture comme bon vous semble, il vous suffit de pointer vers les patterns de fichiers/dossiers souhaités, au format glob, lors du lancement de __engine__.

#### Création d'une commande

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
