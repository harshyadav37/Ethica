"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';

interface Member {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  followed?: boolean;
}

export default function MemberList({
  open,
  onOpenChange,
  members,
  onSelect,
  onViewProfile,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  members: Member[];
  onSelect: (m: Member) => void;
  onViewProfile?: (m: Member) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
          <DialogDescription>People in this community</DialogDescription>
        </DialogHeader>

        <div className="max-h-72 overflow-y-auto mt-4 space-y-3">
          {members.length === 0 && <div className="text-sm text-gray-400">No members to show</div>}
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 p-2 rounded hover:bg-white/5 cursor-pointer"
              onClick={() => onSelect(m)}
            >
              <div className="flex items-center gap-3">
                <Avatar src={m.avatar} alt={m.name} />
                <div>
                  <div className="font-medium">{m.name}</div>
                  {m.bio && <div className="text-sm text-gray-400">{m.bio}</div>}
                </div>
              </div>
              <div>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); if (onViewProfile) onViewProfile(m); else onSelect(m); }}>
                  See profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
