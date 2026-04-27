import { Table,Column,DataType,Model } from "sequelize-typescript";
import { orderStatus, PaymentMethod, PaymentStatus } from "../../globals/types";

@Table({
    tableName:"payments",
    modelName:"Payment",
    timestamps:true
})

class paymentModel extends Model{
    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
    declare id:string

    @Column({
        type:DataType.ENUM(PaymentMethod.COD,PaymentMethod.Esewa,PaymentMethod.Khalti),
        defaultValue:PaymentMethod.COD,
        allowNull:false,
    })
    declare paymentMethod:string

    @Column({
        type:DataType.ENUM(PaymentStatus.Paid,PaymentStatus.Unpaid),
        defaultValue:PaymentStatus.Unpaid
    })
    declare paymentStatus:string

}

export default paymentModel