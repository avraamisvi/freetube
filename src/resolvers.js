import Database from './database';

var database = new Database();

export var resolvers = {
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

    async listVideosByfullTextSearch(text, pag) {

    }
  },

  Mutation: {
    async createUser(root, params, options) {

        let ret = await database.getUsers().create(params.input);

        ret = await database.getUsers().get(ret.dataValues.id);

        console.log(ret.dataValues);

        return ret.dataValues;
    },
    createServer(input) {

    },

    createVideo(input) {

    },

    updateUser(input) {

    },

    updateServer(input) {

    },

    updateVideo(input) {

    },

    deleteUser(id) {

    },

    deleteServer(id) {

    },

    deleteVideo(id) {

    }

  }
};