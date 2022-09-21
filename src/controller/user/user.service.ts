import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    private connection: Connection,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async test(user: any) {
    console.log(user);
    return true;
  }

  async validateUser(email: string, password: string) {
    return true;
  }

  async login(token) {
    const user = await this.userRepository.findOne({
      where: {
        token,
      },
    });

    return {
      code: 200,
      message: '유저 조회 완료',
      data: user,
    };
  }

  async getKakaoToken(code: string): Promise<string> {
    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID,
      code,
    };

    const response = await axios({
      method: 'POST',
      url: process.env.KAKAO_TOKEN_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: new URLSearchParams(body).toString(),
    });

    if (response.status === 200) {
      return response.data.access_token;
    }
  }

  async getUserInfo(kakaoToken: string) {
    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${kakaoToken}`,
    };

    const responseUserInfo = await axios({
      method: 'GET',
      url: process.env.KAKAO_USERINFO_URL,
      timeout: 30000,
      headers: headerUserInfo,
    });

    if (responseUserInfo.status === 200) {
      return responseUserInfo.data;
    }
  }

  search(token: string) {
    return this.userRepository.findOne({ token });
  }

  async register(userInfo: any) {
    const user = new User();
    user.token = userInfo.id.toString();
    if (userInfo.properties) {
      user.profile = userInfo.properties?.profile_image ?? '';
      user.nickname = userInfo.properties?.nickname ?? '';
    }

    const createdUser = await this.userRepository.save(user);

    return createdUser;
  }

  async getAccessToken(user: User) {
    const payload = {
      token: String(user.id),
      nickname: user.nickname,
      profile: user.profile,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });
  }

  async decodeAccessToken(accessToken: string) {
    return this.jwtService.decode(accessToken);
  }

  async checkUser(token) {
    return this.userRepository.findOne({ token });
  }
}
