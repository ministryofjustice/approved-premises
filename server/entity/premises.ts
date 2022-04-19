import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

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
}
