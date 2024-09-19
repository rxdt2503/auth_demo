import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    const { fullName, email, password, role } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
        return new Response('User already exists', { status: 409 });
    }

    const newUser = await db.collection('users').insertOne({
        fullName,
        email,
        password: hashedPassword,
        role
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
}
