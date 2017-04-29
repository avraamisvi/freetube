import Database from './database';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import jsonfile from 'jsonfile';
import request from 'request';

var database = new Database();

var file = './config.json'
var resolverConfig = jsonfile.readFileSync(file);

function accepts(kind) {
    
    for(let i = 0; i < resolverConfig.accept.length; i++) {
        if(resolverConfig.accept[i] == kind) {
            return true;
        }
    }

    return false;
}
//TODO move this methods
//When a server is broadcasted to another, the unknow server sends a registered to the previous server
function sendRegistered(server) {
    
    console.log("sendRegistered");

    let query = {
            query: `mutation Registered($server: ServerInput!){
                        registered(server:$server) {
                            message
                            status
                        }
                    }`,
            variables: {
                server: {
                    name: resolverConfig.name,
                    kind: resolverConfig.kind,
                    protocol: resolverConfig.protocol,
                    address: resolverConfig.address,
                    port: resolverConfig.port,
                    path: resolverConfig.path
                }
            }
        };

        let url = server.protocol + 
                    '://' + server.address +
                    ':' + server.port + 
                    "/" + server.path;
        
        let options = {
            url: url,
            method: 'POST',
            json: query
        };

        request(options, function(err, httpResponse, body){
            console.log('<<<<<<<<<<< RESP:');
            console.log(body);
            // console.log(err);
            // console.log(httpResponse);
        });
}

//broadcast a new server for all the know others
async function broadcastNewServer(server) {
    
    console.log(">>>>>>>>>>>>>>>>>>> broadcastNewServer");

    let query = {
            query: `mutation Broadcast($server: ServerInput!){
                        broadcast(server:$server) {
                            message
                            status
                        }
                    }`,
            variables: {
                server: server
            }
        };        

        let allServers = await database.getServers().all();
        
        if(allServers) {
            allServers = allServers.rows;

            for(let i = 0; i < allServers.length; i++) {
                
                let url = allServers[i].protocol + 
                        '://' + allServers[i].address +
                        ':' + allServers[i].port + 
                        "/" + allServers[i].path;
                
                console.log("SEND TO");
                console.log(url);
                
                let options = {
                    url: url,
                    method: 'POST',
                    json: query
                };

                request(options, function(err, httpResponse, body){
                    console.log('<<<<<<<<<<< BROAD RESP:');
                    console.log(body);
                    console.log(err);
                    // console.log(httpResponse);
                });
            }            
        }
       
}

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

        if(!accepts(params.server.kind)) {
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

        let ret = await database.getServers().create(params.server);

        ret = await database.getServers().get(ret.dataValues.id);

        await broadcastNewServer(params.server);

        return {
            message: "registered with success",
	        status:  "OK"
        };
    },

    async broadcast(root, params, options) {

       if(!accepts(params.server.kind)) {
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

        await sendRegistered(params.server);
        await broadcastNewServer(params.server);

        return {
            message: "registered with success",
	        status:  "OK"
        };        

    },

    async registered(root, params, options) {

        console.log("registered");
        console.log(params);

       if(!accepts(params.server.kind)) {
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