import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne } from 'typeorm'
// eslint-disable-next-line import/no-cycle
import Premises from './premises'

@Entity('beds')
export default class Bed {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index({ unique: true })
  bedCode: string

  @Column({ length: 10 })
  @Index()
  gender: string

  @ManyToOne(() => Premises, premises => premises.beds)
  premises: Premises
}
