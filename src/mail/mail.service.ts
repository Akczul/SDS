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

  // 📨 Notifica cuando se publica un nuevo anuncio
async enviarNuevoAnuncio(
  to: string,
  nombre: string,
  anuncio: { titulo: string; categoria: { nombre: string }; contenido: string },
) {
  const subject = `Nuevo anuncio en ${anuncio.categoria.nombre}: ${anuncio.titulo}`;
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hola ${nombre},</h2>
      <p>Se ha publicado un nuevo anuncio en la categoría <strong>${anuncio.categoria.nombre}</strong>.</p>
      <h3>${anuncio.titulo}</h3>
      <p>${anuncio.contenido}</p>
      <p>Visítanos en <a href="${process.env.APP_URL}">${process.env.APP_URL}</a></p>
      <hr>
      <small>Este correo fue enviado automáticamente por el Sistema de Anuncios y Suscripciones.</small>
    </div>
  `;

  await this.transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text: `Nuevo anuncio: ${anuncio.titulo} en la categoría ${anuncio.categoria.nombre}`,
    html,
  });
}

// 📨 Notifica cuando un usuario actualiza o confirma sus suscripciones
async enviarConfirmacionSuscripcion(
  to: string,
  nombre: string,
  preferencias: { categoria: { nombre: string } }[],
) {
  const categorias = preferencias.map((p) => p.categoria.nombre).join(', ');
  const subject = `Preferencias de suscripción actualizadas`;
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hola ${nombre},</h2>
      <p>Has actualizado tus preferencias de suscripción.</p>
      <p><strong>Categorías seleccionadas:</strong> ${categorias}</p>
      <p>Recibirás notificaciones cuando se publiquen nuevos anuncios en estas categorías.</p>
      <hr>
      <small>Este correo fue enviado automáticamente por el Sistema de Anuncios y Suscripciones.</small>
    </div>
  `;

  await this.transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text: `Tus preferencias de suscripción han sido actualizadas. Categorías: ${categorias}`,
    html,
  });
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
