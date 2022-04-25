import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm'
// eslint-disable-next-line import/no-cycle
import Bed from './bed'

// export interface Geometry {
//   type: 'Point'
//   coordinates: [number, number]
// }

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

  @Column('double precision', {
    nullable: true,
  })
  lat: number

  @Column('double precision', {
    nullable: true,
  })
  lon: number

  // @Column('geometry', {
  //   spatialFeatureType: 'Point',
  //   srid: 4326,
  // })
  // @Index({ spatial: true })
  // location: Geometry;

  @OneToMany(() => Bed, bed => bed.premises)
  beds: Bed[]
}
