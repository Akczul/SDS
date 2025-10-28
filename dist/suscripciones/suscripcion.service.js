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
exports.SuscripcionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const suscripcion_entity_1 = require("./suscripcion.entity");
const user_service_1 = require("../users/user.service");
const mail_service_1 = require("../mail/mail.service");
let SuscripcionesService = class SuscripcionesService {
    constructor(repo, users, mail) {
        this.repo = repo;
        this.users = users;
        this.mail = mail;
    }
    async suscribirse(userId, categoria) {
        const user = await this.users.findById(userId);
        const existing = await this.repo.findOne({ where: { user, categoria } });
        if (existing)
            throw new common_1.BadRequestException('Ya estás suscrito a esta categoría');
        const saved = await this.repo.save({ user, categoria });
        await this.mail.enviarConfirmacionSuscripcion(user.email, user.nombre, await this.listarPreferencias(userId));
        return saved;
    }
    async desuscribirse(userId, categoria) {
        const user = await this.users.findById(userId);
        const existing = await this.repo.findOne({ where: { user, categoria } });
        if (!existing)
            throw new common_1.BadRequestException('No estabas suscrito a esta categoría');
        await this.repo.delete(existing.id);
        await this.mail.enviarConfirmacionSuscripcion(user.email, user.nombre, await this.listarPreferencias(userId));
        return { ok: true };
    }
    listarPreferencias(userId) {
        return this.repo.find({ where: { user: { id: userId } } });
    }
};
exports.SuscripcionesService = SuscripcionesService;
exports.SuscripcionesService = SuscripcionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(suscripcion_entity_1.Suscripcion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UsersService,
        mail_service_1.MailService])
], SuscripcionesService);
//# sourceMappingURL=suscripcion.service.js.map