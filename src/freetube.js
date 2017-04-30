"use strict";

import request from "request";

import express from "express";
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import { makeExecutableSchema } from "graphql-tools";

import {typeDefs} from "./schema";
import {resolvers} from "./resolvers";

import {VideoRestService} from './videoRestService';

import Database from './database';
import Torrent from './torrent';
import jsonfile from 'jsonfile';

import * as serverUtils from './serverUtils';

export default class FreeTube {

    constructor() {
        this.loadConfig();
    }

    loadConfig() {
        let file = './config.json'
        this.config = jsonfile.readFileSync(file);
    }

    start() {

        let schema = makeExecutableSchema(
        {
            typeDefs:  typeDefs,
            resolvers: resolvers
        });

        this.database = new Database();
        this.database.connect();

        let app = express();    

        app.use('/' + this.config.path , bodyParser.json(), graphqlExpress({schema}));
        app.use('/graphiql', graphiqlExpress({endpointURL: '/' + this.config.path}));

        app.listen(this.config.port, () => console.log('Now browse to localhost:'+this.config.port+'/graphiql'));

        setTimeout(function(){
            serverUtils.initDatabaseData();
            serverUtils.register();
        }, 5000);
    }

    seed() {
        var torrentClient = new Torrent();
        torrentClient.seed();
    }

};

// app.get('/videos/:hash', function (req, res) {
//   let serv = new VideoRestService();
//   serv.get(req.params.hash).then((json) => res.send(json));
// })
