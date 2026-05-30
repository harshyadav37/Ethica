"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';

export default function MemberProfile({
  member,
  open,
  onOpenChange,
  onFollow,
  onMessage,
}: {
  member: any | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onFollow: (id: number, follow: boolean) => void;
  onMessage: (id: number) => void;
}) {
  const [following, setFollowing] = useState<boolean>(!!member?.followed);

  React.useEffect(() => {
    setFollowing(!!member?.followed);
  }, [member]);

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member.name}</DialogTitle>
          <DialogDescription>{member.bio}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex items-center gap-4">
          <Avatar src={member.avatar} alt={member.name} />
          <div>
            <div className="font-medium">{member.name}</div>
            {member.bio && <div className="text-sm text-gray-400">{member.bio}</div>}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => {
              const next = !following;
              setFollowing(next);
              onFollow(member.id, next);
            }}
            size="sm"
          >
            {following ? 'Following' : 'Follow'}
          </Button>

          <Button size="sm" variant="outline" onClick={() => onMessage(member.id)}>
            Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
