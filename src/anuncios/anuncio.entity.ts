import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';

@Entity('anuncios')
export class Anuncio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @ManyToOne(() => Categoria, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  categoria: Categoria;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaPublicacion: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
