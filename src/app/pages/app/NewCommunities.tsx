import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {createCommunity } from '../../api/auth';

interface NewCommunitiesProps {
  onNavigate?: (page: string) => void;
  addCommunity?: (data: { name: string; description?: string; category?: string }) => void;
}

export default function NewCommunities({ onNavigate, addCommunity }: NewCommunitiesProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	const [category, setCategory] = useState('');

		const handleCreate = async () => {
			if (!name.trim()) return;
			const payload = { name: name.trim(), description: description.trim(), category: category.trim() };
			try {
				await createCommunity(payload);
				// add to local state as well if provided
				addCommunity?.(payload);
				alert('Community created successfully');
				onNavigate?.('communities');
			} catch (err: any) {
				console.error('createCommunity failed:', err);
				const status = err?.status || err?.response?.status;
				const data = err?.data || err?.response?.data;
				// If backend returned a message, surface it to the user for debugging
				if (status) {
					alert(`Server error: ${status} - ${data?.message || JSON.stringify(data) || err.message}`);
				} else {
					alert('Unable to create community on server; created locally instead.');
				}
				// Fall back to local creation so UX isn't blocked
				addCommunity?.(payload);
				onNavigate?.('communities');
			}
		};

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
			<div className="max-w-3xl mx-auto space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl mb-1">Create a New Community</h1>
						<p className="text-gray-400">Start a space for like-minded people.</p>
					</div>
					<div className="flex gap-2">
						<Button variant="ghost" onClick={() => onNavigate?.('communities')}>Cancel</Button>
						<Button onClick={handleCreate}>Create</Button>
					</div>
				</div>

				<div className="bg-white/5 border border-white/10 rounded-2xl p-6">
					<label className="block mb-2 text-sm text-gray-300">Community Name</label>
					<Input value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} placeholder="e.g., Climate Action" className="mb-4" />

					<label className="block mb-2 text-sm text-gray-300">Description</label>
					<Textarea value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} placeholder="Short description" className="mb-4" />

					{/* <label className="block mb-2 text-sm text-gray-300">Community Type</label>
					<Input value={type} onChange={(e) => setType((e.target as HTMLInputElement).value)} placeholder="e.g., Interest, Professional" className="mb-4" /> */}

					<label className="block mb-2 text-sm text-gray-300">Category</label>
					<Input value={category} onChange={(e) => setCategory((e.target as HTMLInputElement).value)} placeholder="e.g., Environment, Technology" className="mb-4" />

					<label className="block mb-2 text-sm text-gray-300">Visibility</label>
					<p className="text-sm text-gray-400 mb-4">Public — anyone can find and join this community.</p>
				</div>
			</div>
		</div>
	);
}

