import Database from './database';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import jsonfile from 'jsonfile';
import request from 'request';

import * as serverUtils from './serverUtils';

var database = new Database();

//TODO break into classes

export var resolvers = {

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return value.getTime(); // value from the client
    },
    serialize(value) {
      return new Date(value); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),

  Query: {

    async listUsers(root, params, options) {
        let ret = await database.getUsers().list(params.pag);

        return ret.rows;
    },

    async getUser(root, params, options) {
        let ret = await database.getUsers().get(params.id);

        return ret.dataValues;
    },

    async getUserByEmail(root, params, options) {
        let ret = await database.getUsers().get(params.email);

        return ret.dataValues;
    },

    async listServers(root, params, options) {
        let ret = await database.getServers().list(params.pag);

        return ret.rows;
    },

    async getServer(root, params, options) {
        let ret = await database.getServers().get(params.id);

        return ret.dataValues;
    },

    async listVideos(root, params, options) {
        let ret = await database.getVideos().list(params.pag);

        return ret.rows;
    },

    async getVideo(root, params, options) {
        let ret = await database.getVideos().get(params.id);

        return ret.dataValues;
    },

    async listVideosByUserId(root, params, options) {
        let ret = await database.getVideos().getByUserId(params.userId, params.pag);

        return ret.rows;
    },

    async listVideosByfullTextSearch(root, params, options) {
        let ret = await database.getVideos().fullTextSearch(params.text, params.pag);

        return ret.rows;
    }
  },

  Mutation: {

    rateVideo(rating: VideoRateInput!) {
        
    }
 
    async createUser(root, params, options) {

        let ret = await database.getUsers().create(params.input);

        ret = await database.getUsers().get(ret.dataValues.id);

        return ret.dataValues;
    },

    // async createServer(root, params, options) {
    //     let ret = await database.getServers().create(params.input);

    //     ret = await database.getServers().get(ret.dataValues.id);

    //     return ret.dataValues;
    // },

    async createVideo(root, params, options) {

        let ret = await database.getVideos().create(params.input);

        ret = await database.getVideos().get(ret.dataValues.id);

        return ret.dataValues;
    },

    async updateUser(root, params, options) {

        let ret = await database.getUsers().update(params.input);

        return ret.dataValues;
    },

    // async updateServer(root, params, options) {

    //     let ret = await database.getServers().update(params.input);

    //     return ret.dataValues;
    // },

    async updateVideo(root, params, options) {

        let ret = await database.getVideos().update(params.input);

        return ret.dataValues;
    },

    async deleteUser(root, params, options)  {
        let ret = await database.getUsers().delete(params.id);

        return ret.dataValues;
    },

    // async deleteServer(root, params, options)  {
    //     let ret = await database.getServers().delete(params.id);

    //     return ret.dataValues;
    // },

    async deleteVideo(root, params, options)  {
        let ret = await database.getVideos().delete(params.id);

        return ret.dataValues;
    },
    
    async announce(root, params, options) {
        //(server: ServerInput!, video: VideoInput!)
        //TODO
    },

    async register(root, params, options) {
        //(server: ServerInput!): StatusResponse    

        console.log(params.server);

        if(!serverUtils.accepts(params.server.kind)) {
            return {
                message: "kind not accepted",
                status:  "ERR"
            };            
        }

        //An address can have more tha one server if in different ports and paths
        let serv = await database.getServers().getByServer(params.server);

        if(serv != null && serv.dataValues != null) {
            return {
                message: "server already registered",
                status:  "OK"
            };            
        }

        await serverUtils.broadcastNewServer(params.server);

        let ret = await database.getServers().create(params.server);

        ret = await database.getServers().get(ret.dataValues.id);

        return {
            message: "registered with success",
	        status:  "OK"
        };
    },

    async broadcast(root, params, options) {

       if(!serverUtils.accepts(params.server.kind)) {
            return {
                message: "kind not accepted",
                status:  "ERR"
            };            
        }

        let serv = await database.getServers().getByServer(params.server);

        if(serv != null && serv.dataValues != null) {
            return {
                message: "server already registered",
                status:  "OK"
            };            
        }

        let ret = await database.getServers().create(params.server);
        ret = await database.getServers().get(ret.dataValues.id);
        
        serverUtils.broadcastNewServer(params.server).then((obj)=>{
            //NONE
            console.log("broadcastNewServer: OK");
        });

        await serverUtils.sendRegistered(params.server);

        return {
            message: "registered with success",
	        status:  "OK"
        };        

    },

    async registered(root, params, options) {

        console.log("registered");
        console.log(params);

       if(!serverUtils.accepts(params.server.kind)) {
            return {
                message: "kind not accepted",
                status:  "ERR"
            };            
        }
        
        let serv = await database.getServers().getByServer(params.server);

        if(serv != null && serv.dataValues != null) {
            return {
                message: "server already registered",
                status:  "OK"
            };            
        }

        let ret = await database.getServers().create(params.server);

        ret = await database.getServers().get(ret.dataValues.id);

        return {
            message: "registered with success",
	        status:  "OK"
        };        

    }    

  }
};