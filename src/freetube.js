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

        let database = new Database();
        database.connect();

        let app = express();    

        app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
        app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

        app.listen(this.config.port, () => console.log('Now browse to localhost:'+this.config.port+'/graphiql'));

        this.register();
    }

    seed() {
        var torrentClient = new Torrent();
        torrentClient.seed();
    }

    register() {

        let query = {
            query: `mutation Register($server: ServerInput!){
                        register(server:$server) {
                            message
                        }
                    }`,
            variables: {
                server: {
                    name: this.config.name,
                    kind: this.config.kind,
                    ip: this.config.address       
                }
            }
        };

        console.log(JSON.stringify(query));

        for(let i = 0; i < this.config.servers.length; i++) {

            let options = {
                url: this.config.servers[i].address + ':' + this.config.servers[i].port + "/" + this.config.servers[i].path,
                method: 'POST',
                json: query
            };

            request(options, function(err, httpResponse, body){
                console.log(body);
            });
        }
    }
};

// app.get('/videos/:hash', function (req, res) {
//   let serv = new VideoRestService();
//   serv.get(req.params.hash).then((json) => res.send(json));
// })
