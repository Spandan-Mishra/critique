import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: { params: { scope: "user-top-read" } }
        })
    ],
    callbacks: {
        async jwt({ token, account }: { token: any, account: any }) {
            if (account) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            session.accessToken = token.accessToken;
            return session;
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }