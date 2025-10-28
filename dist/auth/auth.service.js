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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(users, jwt) {
        this.users = users;
        this.jwt = jwt;
    }
    async register(dto) {
        const existsEmail = await this.users.findByEmailOrUsername(dto.email);
        const existsUser = await this.users.findByEmailOrUsername(dto.nombreUsuario);
        if (existsEmail || existsUser)
            throw new common_1.BadRequestException('Email o nombreUsuario ya están en uso');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const created = await this.users.create({
            nombre: dto.nombre,
            apellido: dto.apellido,
            nombreUsuario: dto.nombreUsuario,
            email: dto.email,
            passwordHash,
            role: dto.role,
            activo: false,
        });
        return { id: created.id, email: created.email, nombreUsuario: created.nombreUsuario };
    }
    async login(identifier, password) {
        const user = await this.users.findByEmailOrUsername(identifier);
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        if (!user.activo)
            throw new common_1.UnauthorizedException('Usuario inactivo');
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET || 'secret',
            expiresIn: process.env.JWT_EXPIRES || '3600s',
        });
        return { access_token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UsersService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map