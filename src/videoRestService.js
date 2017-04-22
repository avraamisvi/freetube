import Database from './database';

export class VideoRestService {
    
    constructor() {
        this.database = new Database();
    }

    async get(hash) {
        //let data = JSON.parse(new Buffer(hash, 'base64').toString('UTF-8'));
        
        let ret = await this.database.getVideos().getVideoByHash(hash);
        
        if(ret && ret.dataValues) {
            return ret.dataValues;
        }

        return null;
    }
}