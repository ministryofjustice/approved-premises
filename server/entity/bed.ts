import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, OneToMany } from 'typeorm'
// eslint-disable-next-line import/no-cycle
import Premises from './premises'
// eslint-disable-next-line import/no-cycle
import Booking from './booking'

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

  @Column({
    nullable: true,
  })
  iap: boolean

  @Column({
    nullable: true,
  })
  pipe: boolean

  @Column({
    nullable: true,
  })
  enhanced_security: boolean

  @Column({
    nullable: true,
  })
  step_free_access_to_communal_areas: boolean

  @Column({
    nullable: true,
  })
  lift_or_stairlift: boolean

  @ManyToOne(() => Premises, premises => premises.beds)
  premises: Premises

  @OneToMany(() => Booking, booking => booking.bed, { cascade: true })
  bookings: Booking[]
}
