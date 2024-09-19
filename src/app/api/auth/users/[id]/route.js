

import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();

    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error('Fetch user error:', error);
        return new Response('Failed to fetch user', { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const { fullName } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    try {
        await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { fullName } }
        );

        return new Response(JSON.stringify({ message: 'User updated' }), { status: 200 });
    } catch (error) {
        console.error('Update user error:', error);
        return new Response('Failed to update user.', { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();

    try {
        await db.collection('users').deleteOne({ _id: new ObjectId(id) });
        return new Response(JSON.stringify({ message: 'User deleted' }), { status: 200 });
    } catch (error) {
        console.error('Delete user error:', error);
        return new Response('Failed to delete user.', { status: 500 });
    }
}
