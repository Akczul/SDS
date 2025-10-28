import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('anuncios')
export class Anuncio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'varchar', length: 50 })
  categoria: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaPublicacion: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
