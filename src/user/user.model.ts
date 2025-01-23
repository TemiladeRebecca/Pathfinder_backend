import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', timestampes: true })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

  @Column({ type: DataType.STRING, validate: { len: [8, 120] } })
  password: string;

  @Column({
    validate: { isEmail: true },
    allowNull: false,
    unique: true,
  })
  email: string;
}
