import { Table,Column,DataType,Model } from "sequelize-typescript";
import { orderStatus } from "../../globals/types";

@Table({
    tableName:"orders",
    modelName:"Order",
    timestamps:true
})

class orderModel extends Model{
    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
    declare id:string

    @Column({
        type:DataType.STRING,
        allowNull:false,
        validate:{
            len:{
                args:[10,10],
                msg:"Invalid Phone number"
            }
        }
    })
    declare phoneNumber:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare shippingAddress:string

    @Column({
        type:DataType.FLOAT,
        allowNull:false
    })
    declare totalAmount:number

    @Column({
        type:DataType.ENUM(orderStatus.Cancelled,orderStatus.Delivered,orderStatus.OnTheWay,orderStatus.Pending,orderStatus.Preparation),
        defaultValue:orderStatus.Pending
    })
    declare orderStatus:string
}

export default orderModel