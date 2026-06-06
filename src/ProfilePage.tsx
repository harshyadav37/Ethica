import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProfilePage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Profile Page</h1>
      <p className="text-sm text-gray-500 mt-2">User ID: {id}</p>
    </div>
  );
}
