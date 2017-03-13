import Sequelize from 'sequelize';
import sequelize from './../utils/sequelize';

const User = sequelize.define('users', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'id'},
    email: Sequelize.STRING(100),
    password: Sequelize.STRING(100),
    type: Sequelize.STRING
}, {
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    // disable the modification of table names
    freezeTableName: true,
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true
});

export default User;
