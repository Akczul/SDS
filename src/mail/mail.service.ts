import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      secure: String(process.env.MAIL_SECURE || 'false') === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async enviarNuevoAnuncio(to: string, nombre: string, anuncio: any) {
    try {
      const subject = `Nuevo anuncio en ${anuncio.categoria?.nombre || 'una categoría'}: ${anuncio.titulo}`;
      const html = this.renderTemplateNuevoAnuncio(nombre, anuncio);
      const text = this.strip(html);
      await this.transporter.sendMail({ 
        to, 
        subject, 
        html, 
        text, 
        from: process.env.MAIL_USER 
      });
      this.logger.log(`Correo de nuevo anuncio enviado a ${to}`);
    } catch (err) {
      this.logger.warn(`Fallo enviando correo de nuevo anuncio a ${to}: ${String(err)}`);
    }
  }

  async enviarConfirmacionSuscripcion(to: string, nombre: string, preferencias: any[]) {
    try {
      const subject = 'Tus suscripciones han sido actualizadas';
      const html = this.renderTemplateConfirmacion(nombre, preferencias);
      const text = this.strip(html);
      await this.transporter.sendMail({ 
        to, 
        subject, 
        html, 
        text, 
        from: process.env.MAIL_USER 
      });
      this.logger.log(`Correo de confirmación de suscripción enviado a ${to}`);
    } catch (err) {
      this.logger.warn(`Fallo enviando correo de confirmación a ${to}: ${String(err)}`);
    }
  }

  private renderTemplateNuevoAnuncio(nombre: string, anuncio: any) {
    const tpl = `<h2>Hola {{nombre}},</h2>
<p>Se publicó un nuevo anuncio en <b>{{categoriaNombre}}</b>.</p>
<h3>{{titulo}}</h3>
<p>{{contenido}}</p>
<small>Publicado: {{fecha}}</small>`;
    const template = hbs.compile(tpl);
    return template({ 
      nombre, 
      categoriaNombre: anuncio.categoria?.nombre || 'Sin categoría',
      titulo: anuncio.titulo,
      contenido: anuncio.contenido,
      fecha: new Date(anuncio.fechaPublicacion).toLocaleString('es-ES') 
    });
  }

  private renderTemplateConfirmacion(nombre: string, preferencias: any[]) {
    const tpl = `<h2>Hola {{nombre}},</h2>
<p>Estas son tus categorías suscritas actualmente:</p>
{{#if hayPreferencias}}
<ul>{{#each preferencias}}<li>{{this.nombre}}</li>{{/each}}</ul>
{{else}}
<p><em>No tienes suscripciones activas en este momento.</em></p>
{{/if}}`;
    const template = hbs.compile(tpl);
    const categoriasFormateadas = preferencias.map(p => ({ 
      nombre: p.categoria?.nombre || 'Sin nombre' 
    }));
    return template({ 
      nombre, 
      preferencias: categoriasFormateadas,
      hayPreferencias: preferencias.length > 0
    });
  }

  private strip(html: string) {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
