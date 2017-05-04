import {Sequelize} from 'sequelize';

export class VideosDB {
    
        constructor(seq, user) {
        
        this.User = user;

        this.Model = seq.define('videos', {
            id: { 
                type: Sequelize.INTEGER, 
                autoIncrement: true,
                primaryKey: true
            },            
            title: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            magnetUri: {
                type: Sequelize.STRING
            },
            sentDate: {
                type: Sequelize.DATE
            },
            hash: {
                type: Sequelize.STRING
            },
            like: {
                type: Sequelize.INTEGER
            },
            dislike: {
                type: Sequelize.INTEGER
            }
        }, 
        {
        freezeTableName: true // Model tableName will be the same as the model name
        });

        this.Model.belongsTo(user.getModel());

        this.Model.sync({force: true}).then(function () {
        });
        
    }

    async create(ent) {
                
        let us = await this.User.get(ent.user); //TODO BETTER PLACE?

        ent.sentDate = new Date();

        let vid = await this.Model.create(ent);

        let hash = JSON.stringify({
            username: us.name,
            vidId: vid.id
        });

        hash = new Buffer(hash).toString('base64');

        return vid.update({
            hash: hash
        });
    }

    async update(ent) {

        let upEnt = await this.Model.findById(id);

        return upEnt.update(ent);
    } 

    async delete(ent) {

        let del = await this.Model.findById(id);

        await del.destroy();

        return del;
    }    

    list(pag) {
      return this.Model.findAndCountAll({
        offset: pag.offset,
        limit: pag.limit,
        raw:true
      })
    }

    get(id) {
        return this.Model.findById(id);
    }

    getByHash(hash) {
        return this.Model.findOne({
            where: {
                hash: {
                    $eq: hash
                }
            }
        });
    }

    getByUserId(userId, pag) {
        return this.Model.findAndCountAll({
            where: {
                user: {
                    $eq: userId
                }
            },
            offset: pag.offset,
            limit: pag.limit,
            include: [
                { model: this.User }
            ],
            raw:true        
        });
    }

    fullTextSearch(search, pag) {
        return this.Model.findAndCountAll({ where: {
                $or:[
                    {title: {$like: '%'+search.text+'%'}},
                    {description: {$like: '%'+search.text+'%'}},
                ]
            },
            offset: pag.offset,
            limit: pag.limit,
            include: [
                { model: this.User }
            ],
            raw:true 
        });
    }
}