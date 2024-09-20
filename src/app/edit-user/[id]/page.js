"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const EditUser = ({ params }) => {
    const { id } = params;
    const { data: status } = useSession();
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        } else {
            fetchUser();
        }
    }, [status, router]);

    const fetchUser = async () => {
        const res = await fetch(`/api/auth/users/${id}`);
        if (!res.ok) {
            setError('Failed to fetch user.');
            return;
        }
        const data = await res.json();
        setUser(data);
        setFullName(data.fullName);
        setEmail(data.email); // Email is fetched but will be disabled
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/auth/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName }),
        });

        if (res.ok) {
            alert('User updated successfully!');
            router.push('/');
        } else {
            const errorText = await res.text();
            setError(errorText);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleEditUser} className="bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-xl mb-4">Edit User</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="border border-gray-300 p-2 mb-4 w-full rounded"
                    required
                />
                <input
                    type="email"
                    value={email}
                    disabled
                    className="border border-gray-300 p-2 mb-4 w-full rounded bg-gray-200"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
                >
                    Update User
                </button>
            </form>
        </div>
    );
};

export default EditUser;
