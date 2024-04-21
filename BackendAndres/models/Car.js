const sequelize = require('sequelize');
const db = require('../utils/db');

const Car = db.define ('cars',{
    placa:{
        type: sequelize.DataTypes.TEXT,
        primaryKey:true
    },
    color:{
        type: sequelize.DataTypes.TEXT
    },
    image:{
        type: sequelize.DataTypes.TEXT
    },
    fecha_entrada:{
        type: sequelize.DataTypes.DATE
    }
    },{
        timestamps: false,

    // If don't want createdAt
    createdAt: false,
  
    // If don't want updatedAt
    updatedAt: false,
    }
    
);


module.exports= Car;