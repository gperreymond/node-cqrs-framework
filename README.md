# node-cqrs-framework

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

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

#### 2) Configutation automatique des variables d'environnement

```
$ npm run deve:config
```

## Engine

## Trigger

## Command

Une commande est un trigger pouvant se déclencher de manière manuelle ou évènementielle.

## Query

Une query est un trigger ne pouvant se déclencher que manuellement.
