import Database from './database';

export class VideoRestService {
    
    constructor() {
        this.database = new Database();
    }

    async get(hash) {

        let ret = await this.database.getVideos().getByHash(hash);
        
        if(ret && ret.dataValues) {

            return JSON.stringify(ret.dataValues);
        }

        return null;
    }
}