export declare class MailService {
    private transporter;
    constructor();
    enviarNuevoAnuncio(to: string, nombre: string, anuncio: any): Promise<any>;
    enviarConfirmacionSuscripcion(to: string, nombre: string, preferencias: any[]): Promise<any>;
    private renderTemplateNuevoAnuncio;
    private renderTemplateConfirmacion;
    private strip;
}
