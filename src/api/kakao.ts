import axios from 'axios';

export class KakaoApi {
  private static kakaoTokenUrl = `https://kauth.kakao.com/oauth/token`;
  private static kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';

  public static async login(code: string) {
    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID,
      code,
    };

    const response = await axios({
      method: 'POST',
      url: this.kakaoTokenUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: new URLSearchParams(body).toString(),
    });

    if (response.status === 200) {
      const headerUserInfo = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: 'Bearer ' + response.data.access_token,
      };

      const responseUserInfo = await axios({
        method: 'GET',
        url: this.kakaoUserInfoUrl,
        timeout: 30000,
        headers: headerUserInfo,
      });

      if (responseUserInfo.status === 200) {
        return responseUserInfo.data;
      }
    }
  }
}
