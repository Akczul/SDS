import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('suscripciones')
@Unique(['user', 'categoria'])
export class Suscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.suscripciones)
  user: User;

  @Column()
  categoria: string;
}
