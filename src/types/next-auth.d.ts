import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      kakaoId?: string;
      provider?: string;
      providerId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    kakaoId?: string;
    provider?: string;
    providerId?: string;
    email?: string;
  }
}
