import {Sequelize} from 'sequelize';
import {ServersDB} from './servers';
import {UsersDB}   from  './users';
import {VideosDB}  from  './videos';

var sequelize = null;

var users = null;
var servers = null;
var videos = null;

export default class Database {

    constructor() {
    }

    connect() {
        if(!sequelize) {
            sequelize = new Sequelize('freetube', 'username', 'password', {
                dialect: 'sqlite',
                storage: './freetube.sqlite'
            });   
       
            users = new UsersDB(sequelize);
            servers = new ServersDB(sequelize);
            videos = new VideosDB(sequelize, users);        
        }
    }

    getUsers() {
        return users;    
    }

    getVideos() {
        return videos;    
    }

    getServers() {
        return servers;    
    }        
}