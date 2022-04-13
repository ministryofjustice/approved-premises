import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Premises {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    name: string

    @Column()
    postcode: string
}
