import {Sequelize} from 'sequelize';

export class UsersDB {
    
        constructor(seq) {

        this.Model = seq.define('users', {
            id: { 
                type: Sequelize.INTEGER, 
                autoIncrement: true,  
                primaryKey: true
            },             
            name: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            password: {
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

    get(id) {
        return this.Model.findById(id);
    }

    getByEmail(email) {
        return this.Model.findOne({ where: {email: email} });
    }

    getModel() {
        return this.Model;
    }
}