"use strict";

import express from "express";
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import { makeExecutableSchema } from "graphql-tools";

import {typeDefs} from "./schema";
import {resolvers} from "./resolvers";

import {VideoRestService} from './videoRestService';

import Database from './database';

var schema = makeExecutableSchema(
  {
  typeDefs:  typeDefs,
  resolvers: resolvers
});

var database = new Database();
database.connect();

var app = express();    

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

app.get('/videos/:hash', function (req, res) {

  let serv = new VideoRestService();

  res.send(serv.get(req.params.hash));
})

app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));