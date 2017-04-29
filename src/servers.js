import {Sequelize} from 'sequelize';

export class ServersDB {
    
    constructor(seq) {

        this.Model = seq.define('servers', {
            id: { 
                type: Sequelize.INTEGER, 
                autoIncrement: true,  
                primaryKey: true
            },             
            name: {
                type: Sequelize.STRING
            },
            kind: {
                type: Sequelize.STRING //kind of content: if sports, video game, this allows a server not distribute content it does not want to
            },            
            protocol: {
                type: Sequelize.STRING
            },            
            address: {
                type: Sequelize.STRING
            },
            port: {
                type: Sequelize.STRING
            },
            path: {
                type: Sequelize.STRING
            }                     
        }, 
        {
        freezeTableName: true // Model tableName will be the same as the model name
        });

        this.Model.sync({force: true}).then(function () {
        });

    }

    create(ent) {
        return this.Model.create(ent);
    }

    list(pag) {
      return this.Model.findAndCountAll({
        offset: pag.offset,
        limit: pag.limit,
        raw:true
      })
    }

    all() {
      return this.Model.findAndCountAll({
        raw:true
      })
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

    get(id) {
        return this.Model.findById(id);
    }

    getByServer(server) {

        return this.Model.findOne({
            where: {
                $and: {
                    // name: {
                    //   $eq: server.name
                    // },
                    address: {
                      $eq: server.address
                    },                   
                    port: {
                      $eq: server.port
                    },
                    path: {
                      $eq: server.path
                    }     
                }
            }            
        });

                //         $or:[
                //     {title: {$like: '%'+search.text+'%'}},
                //     {description: {$like: '%'+search.text+'%'}},
                // ]
    }
}