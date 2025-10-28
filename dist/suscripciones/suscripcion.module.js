"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuscripcionesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const suscripcion_entity_1 = require("./suscripcion.entity");
const suscripcion_controller_1 = require("./suscripcion.controller");
const suscripcion_service_1 = require("./suscripcion.service");
const user_module_1 = require("../users/user.module");
const mail_module_1 = require("../mail/mail.module");
let SuscripcionesModule = class SuscripcionesModule {
};
exports.SuscripcionesModule = SuscripcionesModule;
exports.SuscripcionesModule = SuscripcionesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([suscripcion_entity_1.Suscripcion]), user_module_1.UsersModule, mail_module_1.MailModule],
        controllers: [suscripcion_controller_1.SuscripcionController],
        providers: [suscripcion_service_1.SuscripcionesService],
        exports: [typeorm_1.TypeOrmModule],
    })
], SuscripcionesModule);
//# sourceMappingURL=suscripcion.module.js.map