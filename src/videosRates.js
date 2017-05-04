import {Sequelize} from 'sequelize';

export class VideosRatesDB {
    
        constructor(seq, user) {
        
        this.User = user;

        this.Model = seq.define('videos_rates', {
            id: { 
                type: Sequelize.INTEGER, 
                autoIncrement: true,
                primaryKey: true
            },            
            rate: {
                type: Sequelize.STRING
            },
            userId: {
                type: Sequelize.INTEGER //TODO unique
            },
            videoId: {
                type: Sequelize.INTEGER //TODO unique
            }
        }, 
        {
        freezeTableName: true // Model tableName will be the same as the model name
        });

        this.Model.belongsTo(user.getModel());

        this.Model.sync({force: true}).then(function () {
        });

    }

    async rate(ent) {

        if(ent.id) {
            let upEnt = await this.Model.findById(id);
            return upEnt.update(ent);
        } else {
             return await this.Model.create(ent);
        }
    }

    getByVideo(id) {
        return this.Model.findById(id);
    }

}