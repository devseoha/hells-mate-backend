import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/database/entities/user.entity';
import { CreateAuthDto } from '@/controller/user/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { BaseNickname } from '@/database/entities/base_nickname.entity';

@Injectable()
export class UserService {
  constructor(
    private connection: Connection,
    private jwtService: JwtService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(BaseNickname)
    private baseNicknameRepository: Repository<BaseNickname>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'email', 'nickname', 'password'],
    });

    if (!user) {
      throw new NotFoundException('회원정보가 존재하지 않습니다.');
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
  }

  async createNickname(): Promise<string> {
    const front = await this.baseNicknameRepository
      .createQueryBuilder('baseNickname')
      .where('baseNickname.frontNickname IS NOT NULL')
      .orderBy('RAND()')
      .getOne();

    const back = await this.baseNicknameRepository
      .createQueryBuilder('baseNickname')
      .where('baseNickname.backNickname IS NOT NULL')
      .orderBy('RAND()')
      .getOne();

    const nickname =
      (front?.frontNickname ? front.frontNickname : '오늘도') +
      (back?.backNickname ? back.backNickname : '헬린이');

    return nickname;
  }

  async join(data: CreateAuthDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const email = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email=:email', { email: data.email })
      .andWhere('user.deletedAt IS NULL')
      .getOne();

    if (email) {
      throw new BadRequestException('이미 사용중인 이메일 입니다.');
    }

    try {
      const user = new User();
      user.email = data.email;
      user.password = hashedPassword;
      const nickname = await this.createNickname();
      user.nickname = nickname;

      console.log(user);
      const join = await this.userRepository.save(user);
      const accessToken = await this.getAccessToken(join);
      const refreshToken = await this.getRefreshToken(join);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

      await this.setRefreshToken(join.id, hashedRefreshToken);

      return { id: join.id, accessToken, refreshToken };
    } catch (e) {
      if (e?.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException({ message: e?.sqlMessage });
      }
    }
  }

  async getAccessToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });
  }

  async getRefreshToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });
  }

  async setRefreshToken(id: number, refreshToken: string) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ refreshToken })
      .where('id=:id', { id })
      .execute();
  }

  async removeRefreshToken(id: number) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ refreshToken: null })
      .where('id=:id', { id })
      .execute();
  }

  async login(user: any) {
    const accessToken = await this.getAccessToken(user);
    const refreshToken = await this.getRefreshToken(user);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    await this.setRefreshToken(user.id, hashedRefreshToken);

    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async logout(user: any): Promise<boolean> {
    await this.removeRefreshToken(user.id);
    return true;
  }

  async validateRefreshToken(id: number, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'nickname', 'refreshToken'],
    });

    const result = await bcrypt.compare(refreshToken, user.refreshToken);
    if (result) {
      const { refreshToken, ...userWithoutRefreshToken } = user;
      console.log('userWithoutRefreshToken:', userWithoutRefreshToken);
      return userWithoutRefreshToken;
    }
  }
}
