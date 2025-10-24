// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // يتأكد من صلاحية التوكن
      secretOrKey: process.env.JWT_SECRET || 'yourSecretKey',
    });
  }

  validate(payload: any) {
    // بيرجع البيانات اللي جوه التوكن، هتكون موجودة في req.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
