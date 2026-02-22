import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, account, profile }) {
      if (account?.provider) token.provider = account.provider;
      if (account?.providerAccountId) token.providerId = account.providerAccountId;
      if (profile && typeof profile === 'object') {
        const kakao = (profile as Record<string, unknown>).kakao_account as Record<string, unknown> | undefined;
        if (kakao?.email) token.email = kakao.email as string;
        const pro = kakao?.profile as Record<string, unknown> | undefined;
        if (pro?.nickname) token.name = pro.nickname as string;
        if (pro?.profile_image_url) token.picture = pro.profile_image_url as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.provider = (token.provider as string) ?? '';
        session.user.providerId = (token.providerId as string) ?? '';
        session.user.email = (token.email as string) ?? session.user.email ?? '';
        session.user.name = (token.name as string) ?? session.user.name ?? '';
        session.user.image = (token.picture as string) ?? session.user.image ?? '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };
