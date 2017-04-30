import Database from './database';
import jsonfile from 'jsonfile';
import request from 'request';

var database = new Database();

var file = './config.json'
var resolverConfig = jsonfile.readFileSync(file);

export function accepts(kind) {
    
    for(let i = 0; i < resolverConfig.accept.length; i++) {
        if(resolverConfig.accept[i] == kind) {
            return true;
        }
    }

    return false;
}

//When a server is broadcasted to another, the unknow server sends a registered to the previous server
export function sendRegistered(server) {
    
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
            // console.log(err); TODO
            // console.log(httpResponse);
        });
}

//broadcast a new server for all the know others
export async function broadcastNewServer(server) {
    
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

export async function initDatabaseData() {
        for(let i = 0; i < resolverConfig.servers.length; i++) {            
            database.getServers().create(resolverConfig.servers[i]);
        }
}

export async function register() {

        let query = {
            query: `mutation Register($server: ServerInput!){
                        register(server:$server) {
                            message
                            status
                        }
                    }`,
            variables: {
                server: {
                    name: resolverConfig.name,
                    kind: resolverConfig.kind,
                    address: resolverConfig.address,
                    port: resolverConfig.port,
                    path: resolverConfig.path,
                    protocol: resolverConfig.protocol
                }
            }
        };

        console.log(JSON.stringify(query));

        for(let i = 0; i < resolverConfig.servers.length; i++) {
            
            let url = resolverConfig.servers[i].protocol + 
                      '://' + resolverConfig.servers[i].address +
                      ':' + resolverConfig.servers[i].port + 
                      "/" + resolverConfig.servers[i].path;
            
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
    }