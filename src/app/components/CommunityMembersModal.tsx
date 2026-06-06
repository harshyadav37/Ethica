"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { getCommunityMembers } from '../api/communityService';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

interface Member {
  _id: string;
  name?: string;
}

interface Community {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  membersCount?: number;
  members?: Member[];
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  community: Community | null;
  onNavigate?: (path: string) => void;
}

export default function CommunityMembersModal({ open, onOpenChange, community, onNavigate }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, _setMembers] = useState<Member[]>([]);

  const pollRef = useRef<number | null>(null);
  const fetchMembers = async (communityId?: string) => {
    if (!communityId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCommunityMembers(communityId);
      const list = Array.isArray(data?.members) ? data.members : [];
      _setMembers(list);
    } catch (err: any) {
      console.error('Error fetching members', err);
      setError(err?.message || 'Failed to load members');
      _setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !community) return;

    if (Array.isArray(community.members)) {
      _setMembers(community.members);
    } else {
      fetchMembers(community._id);
    }

    // poll every 8 seconds while open to reflect new joins
    pollRef.current = window.setInterval(() => {
      if (community?._id) fetchMembers(community._id);
    }, 8000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [open, community]);

//   const handleViewProfile = (userId: string) => {
//     console.log('CommunityMembersModal: See Profile clicked for userId=', userId);
//     try {
//         console.log("Navigating to:", `/profile/${userId}`);
//       navigate(`/profile/${userId}`);
//       console.log('CommunityMembersModal: navigate() called with', `/profile/${userId}`);
//     } catch (e) {
//       console.error('CommunityMembersModal: navigate failed', e);
//       // fallback
//       window.location.href = `/profile/${userId}`;
//     }
//   };


const handleViewProfile = (member: any) => {
  localStorage.setItem(
    "ethica-selectedProfile",
    JSON.stringify({
      id: member._id,
      name: member.name,
      avatar: member.profilePic,
    })
  );

  onOpenChange(false);

  onNavigate?.("profile");
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Community Members</DialogTitle>
          <DialogDescription>Members who have joined this community</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold">Community Members</div>
              <div className="text-sm text-gray-400">{community?.name}</div>
            </div>
            <div className="text-sm text-gray-400">{(community?.membersCount ?? members.length).toLocaleString()} members</div>
          </div>

          <div className="mt-2 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => community?._id && fetchMembers(community._id)} disabled={loading}>
              Refresh
            </Button>
          </div>

        </div>

        <div className="mt-2 max-h-[60vh] overflow-y-auto space-y-3">
          {loading && <div className="text-center py-6">Loading members...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && members.length === 0 && <div className="text-center py-6">No members found</div>}

          {members.map((m) => (
            <div key={m._id} className="flex items-center justify-between gap-4 p-3 rounded-md hover:bg-white/5">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">{(m.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-medium truncate">{m.name || m._id}</div>
                  <div className="text-xs text-gray-400 truncate">{m._id}</div>
                </div>
              </div>
              <div>
                <Button
                //   variant="outline"
                //   onClick={() => {
                //     onOpenChange(false);
                //     console.log('CommunityMembersModal: button clicked for', m._id);
                //       console.log("Current URL before:", window.location.pathname);
                //     handleViewProfile(m._id);
                //   }}
                 variant="outline"
  onClick={() => handleViewProfile(m)}
                >
                  See Profile
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <DialogClose>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
