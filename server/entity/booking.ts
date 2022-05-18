import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
// eslint-disable-next-line import/no-cycle
import Bed from './bed'

@Entity('bookings')
export default class Booking {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Bed, bed => bed.bookings)
  bed: Bed

  @Column('timestamp')
  start_time: Date

  @Column('timestamp')
  end_time: Date
}
