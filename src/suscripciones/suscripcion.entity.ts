import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Categoria } from '../categorias/categoria.entity';

@Entity('suscripciones')
@Unique(['user', 'categoria'])
export class Suscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.suscripciones, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Categoria, { nullable: false, eager: true, onDelete: 'CASCADE' })
  categoria: Categoria;
}
