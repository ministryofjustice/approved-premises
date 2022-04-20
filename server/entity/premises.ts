import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm'
// eslint-disable-next-line import/no-cycle
import Bed from './bed'

@Entity()
export default class Premises {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index({ unique: true })
  apCode: string

  @Column({ length: 100 })
  @Index()
  name: string

  @Column()
  apArea: string

  @Column()
  probationRegion: string

  @Column()
  localAuthorityArea: string

  @Column()
  town: string

  @Column()
  address: string

  @Column()
  postcode: string

  @OneToMany(() => Bed, bed => bed.premises)
  beds: Bed[]
}
