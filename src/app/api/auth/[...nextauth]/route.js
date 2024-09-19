import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const client = new MongoClient(process.env.MONGODB_URI);

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await client.connect();
                const db = client.db();

                const user = await db.collection('users').findOne({ email: credentials.email });
                if (user && (await bcrypt.compare(credentials.password, user.password))) {
                    // Include role information here
                    return { id: user._id, email: user.email, fullName: user.fullName, role: user.role }; 
                }
                return null;
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            // Include the role in the JWT token
            if (user) {
                token.role = user.role; // Add role to token
            }
            return token;
        },
        async session({ session, token }) {
            // Include the role in the session
            if (token) {
                session.user.role = token.role; // Add role to session
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
