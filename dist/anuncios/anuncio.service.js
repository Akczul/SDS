"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnunciosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const anuncio_entity_1 = require("./anuncio.entity");
const mail_service_1 = require("../mail/mail.service");
const suscripcion_entity_1 = require("../suscripciones/suscripcion.entity");
let AnunciosService = class AnunciosService {
    constructor(repo, susRepo, mail) {
        this.repo = repo;
        this.susRepo = susRepo;
        this.mail = mail;
    }
    async create(dto) {
        const anuncio = this.repo.create({ ...dto, fechaPublicacion: new Date() });
        const saved = await this.repo.save(anuncio);
        const suscriptores = await this.susRepo.find({ where: { categoria: saved.categoria }, relations: ['user'] });
        await Promise.all(suscriptores.map(s => this.mail.enviarNuevoAnuncio(s.user.email, s.user.nombre, saved)));
        return saved;
    }
    findAll() { return this.repo.find(); }
    findOne(id) { return this.repo.findOne({ where: { id } }); }
    async update(id, dto) {
        await this.repo.update({ id }, dto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.repo.delete({ id });
        return { ok: true };
    }
    listByCategoria(categoria) {
        return this.repo.find({ where: { categoria } });
    }
};
exports.AnunciosService = AnunciosService;
exports.AnunciosService = AnunciosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(anuncio_entity_1.Anuncio)),
    __param(1, (0, typeorm_1.InjectRepository)(suscripcion_entity_1.Suscripcion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService])
], AnunciosService);
//# sourceMappingURL=anuncio.service.js.map