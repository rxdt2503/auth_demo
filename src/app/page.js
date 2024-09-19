"use client";

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Home = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        } else {
            fetchUsers();
        }
    }, [status, router]);

    const fetchUsers = async () => {
        const response = await fetch('/api/auth/users');
        const data = await response.json();
        setUsers(data);
    };

    const handleDelete = async (id) => {
        const res = await fetch(`/api/auth/users/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchUsers(); // Refresh the user list
        } else {
            alert('Failed to delete user.');
        }
    };

    const isAdmin = session?.user.role === 'admin'; // Check if the logged-in user is an admin

    return (
        <div>
            <nav className="bg-black text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-bold">User Management</h1>
                    <div>
                          {isAdmin && <Link href="/add-user" className="px-4">Add New User</Link>}
                        <button onClick={() => signOut()} className="px-4">Logout</button>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto mt-10">
                {session ? (
                    <>
                        <h1 className="text-2xl">User List</h1>
                        <table className="min-w-full mt-4 border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Full Name</th>
                                    <th className="border p-2">Email</th>
                                    <th className="border p-2">Role</th> {/* New Role Column */}
                                    {isAdmin && <th className="border p-2">Actions</th>} {/* Conditional Actions Column */}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="border p-2">{user.fullName}</td>
                                        <td className="border p-2">{user.email}</td>
                                        <td className="border p-2">{user.role}</td> {/* Display Role */}
                                        {isAdmin && (
                                            <td className="border p-2">
                                                <Link href={`/edit-user/${user._id}`} className="text-blue-500">Edit</Link>
                                                {user.email !== session.user.email && ( // Check if the user is not the logged-in user
                                                    <button 
                                                        onClick={() => handleDelete(user._id)}
                                                        className="text-red-500 ml-4"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <h1 className="text-2xl">Redirecting to Sign In...</h1>
                )}
            </div>
        </div>
    );
};

export default Home;
