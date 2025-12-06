// backend/models/request.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); 
const User = require('./user'); 

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending'
    },

    rejectionReason: {
        type: DataTypes.STRING,
        allowNull: true
    },

    isFinalized: { 
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'requests'
});

//Aici se stabilesc relațiile (Foreign Keys)
Request.belongsTo(User, { as: 'student', foreignKey: 'studentId' }); 
Request.belongsTo(User, { as: 'professor', foreignKey: 'professorId' }); 

module.exports = Request;