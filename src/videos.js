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
            tile: {
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
            }
        }, 
        {
        freezeTableName: true // Model tableName will be the same as the model name
        });

        this.Model.belongsTo(user.getModel());

        this.Model.sync({force: true}).then(function () {
        });
        
    }

    create(ent) {
                //TODO BETTER PLACE?
        let us = this.User.get(ent.user);

        let vid = this.Model.create(ent);

        let hash = JSON.stringify({
            username: us.name,
            vidId: ent.id
        });

        hash = new Buffer(hash).toString('base64');

        vid.update({
            hash: hash
        });

        return vid;
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