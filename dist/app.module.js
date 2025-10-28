"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./users/user.module");
const anuncio_module_1 = require("./anuncios/anuncio.module");
const suscripcion_module_1 = require("./suscripciones/suscripcion.module");
const mail_module_1 = require("./mail/mail.module");
const user_entity_1 = require("./users/user.entity");
const anuncio_entity_1 = require("./anuncios/anuncio.entity");
const suscripcion_entity_1 = require("./suscripciones/suscripcion.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'mysql',
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT || '3306', 10),
                    username: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                    entities: [user_entity_1.User, anuncio_entity_1.Anuncio, suscripcion_entity_1.Suscripcion],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            user_module_1.UsersModule,
            anuncio_module_1.AnunciosModule,
            suscripcion_module_1.SuscripcionesModule,
            mail_module_1.MailModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map