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
      const subject = `Nuevo anuncio en ${anuncio.categoria}: ${anuncio.titulo}`;
      const html = this.renderTemplateNuevoAnuncio(nombre, anuncio);
      return await this.transporter.sendMail({ to, subject, html, text: this.strip(html), from: process.env.MAIL_USER });
    } catch (err) {
      this.logger.warn(`Fallo enviando correo de nuevo anuncio a ${to}: ${String(err)}`);
      return undefined;
    }
  }

  async enviarConfirmacionSuscripcion(to: string, nombre: string, preferencias: any[]) {
    try {
      const subject = 'Tus suscripciones han sido actualizadas';
      const html = this.renderTemplateConfirmacion(nombre, preferencias);
      return await this.transporter.sendMail({ to, subject, html, text: this.strip(html), from: process.env.MAIL_USER });
    } catch (err) {
      this.logger.warn(`Fallo enviando correo de confirmación a ${to}: ${String(err)}`);
      return undefined;
    }
  }

  private renderTemplateNuevoAnuncio(nombre: string, anuncio: any) {
    const tpl = `<h2>Hola {{nombre}},</h2>
<p>Se publicó un nuevo anuncio en <b>{{anuncio.categoria}}</b>.</p>
<h3>{{anuncio.titulo}}</h3>
<p>{{anuncio.contenido}}</p>
<small>Publicado: {{fecha}}</small>`;
    const template = hbs.compile(tpl);
    return template({ nombre, anuncio, fecha: new Date(anuncio.fechaPublicacion).toLocaleString() });
  }

  private renderTemplateConfirmacion(nombre: string, preferencias: any[]) {
    const tpl = `<h2>Hola {{nombre}},</h2>
<p>Estas son tus categorías suscritas actualmente:</p>
<ul>{{#each preferencias}}<li>{{this.categoria}}</li>{{/each}}</ul>`;
    const template = hbs.compile(tpl);
    return template({ nombre, preferencias });
  }

  private strip(html: string) {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
