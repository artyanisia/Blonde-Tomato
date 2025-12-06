// backend/models/request.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); 
const User = require('./user'); // Presupunem că modelul User este deja definit

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
    
    // Noul câmp pentru a implementa regula locurilor
    isFinalized: { 
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'requests'
});

// Aici se stabilesc relațiile (Foreign Keys)
// O cerere aparține unui Student și unui Profesor
Request.belongsTo(User, { as: 'student', foreignKey: 'studentId' }); 
Request.belongsTo(User, { as: 'professor', foreignKey: 'professorId' }); 

module.exports = Request;