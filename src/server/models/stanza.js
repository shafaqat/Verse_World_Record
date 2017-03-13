import Sequelize from 'sequelize';
import sequelize from './../utils/sequelize';

const Stanza = sequelize.define('stanzas', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'id'},
    stanza_text: Sequelize.STRING(100),
    approved_by: Sequelize.INTEGER,
    submitter_id: Sequelize.INTEGER,
    status_id: Sequelize.INTEGER,
    edited_by: Sequelize.INTEGER,
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
