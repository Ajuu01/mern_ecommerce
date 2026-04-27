import { Table,Column,DataType,Model } from "sequelize-typescript";
import { orderStatus } from "../../globals/types";

@Table({
    tableName:"orderDetails",
    modelName:"OrderDetail",
    timestamps:true
})

class orderDetails extends Model{
    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
    declare id:string

    @Column({
        type:DataType.INTEGER,
        allowNull:false,
    })
    declare quantity:number 
}

export default orderDetails