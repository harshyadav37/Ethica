import axios from 'axios';

const BASE_URL = 'https://ethica-backend.onrender.com';
// const BASE_URL = "http://localhost:3000";

export interface Member {
  _id: string;
  name?: string;
  avatar?: string | null;
  email?: string;
}

// NOTE: backend does not expose /api/community/:id/members; use getCommunities and extract members
export const getCommunityMembers = async (communityId: string) => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await axios.get(`${BASE_URL}/api/user/getCommunities`, {
    headers,
  });

  const payload = res.data;

  // try to find communities array in multiple shapes
  let communities: any[] = [];
  if (Array.isArray(payload)) communities = payload;
  else if (Array.isArray(payload.communities)) communities = payload.communities;
  else if (Array.isArray(payload.data)) communities = payload.data;

  const community = communities.find((c: any) => c && (c._id === communityId || c.id?.toString() === communityId || c.name === communityId));

  let members: Member[] = [];
  if (community) {
    // common property names to inspect
    const raw = community.members || community.membersData || community.membersList || community.members_users || community.users || [];

    if (Array.isArray(raw)) {
      members = raw.map((m: any) => ({
        _id: m._id || m.id || m.userId || String(m.email || m.emailAddress || m.name || Math.random()),
        name: m.name || m.fullName || m.username || m.email,
        avatar: m.avatar || m.profileImage || m.photo || null,
        email: m.email || m.emailAddress || undefined,
      }));
    }
  }

  return { success: true, members } as { success: boolean; members: Member[] };
};
