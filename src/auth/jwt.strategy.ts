import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtConfig } from './auth.messages';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: AuthJwtConfig.SECRET,
        });
    }

    validate(payload: JwtPayload) {
        return { 
            userId: payload.sub, 
            email: payload.email, 
            role: payload.role 
        };
    }
}
