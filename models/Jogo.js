const db = require('../db/conn');
const {DataTypes} = require("sequelize");

const Jogo = db.define("Jogo",{
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
},

titulo: {
    type: DataTypes.STRING,
    allowNull: false,
},

descricao: {
    type: DataTypes.STRING,
    allowNull: false,
},

precoBase: {
    type: DataTypes.INTEGER,
    allowNull: false,
}

});

module.exports = Jogo