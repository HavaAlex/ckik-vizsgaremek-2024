const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Student extends Model {};

    Student.init
    (
        {
            ID:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            name:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },

            DoB:
            {
                type: DataTypes.DATE,
                allowNull: false,
            },

            address:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },

            phone:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
            
            email:
            {
                type: DataTypes.STRING(60),
                allowNull: false,
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            OMID:{
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
            }
            
        },

        {
            sequelize,
            modelName: "Student",
            timestamps: false,
        }
    )

    return Student;
}