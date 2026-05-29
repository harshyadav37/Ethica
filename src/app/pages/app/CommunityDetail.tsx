import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';

function CommunityDetail({
  community,
  onBack,
  joinCommunity,
  leaveCommunity,
  toggleLike,
  sharePost,
  addPost,
  addComment,
}: any) {
  const [postText, setPostText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [focusedPostId, setFocusedPostId] = useState<number | null>(null);
  const [commentModalPostId, setCommentModalPostId] = useState<number | null>(null);
  const [shareModalPostId, setShareModalPostId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  if (!community) return null;

  const handleCreatePost = () => {
    if (!postText.trim() && !imageUrl.trim()) return;
    addPost?.(community.id, postText.trim(), imageUrl.trim() || undefined);
    setPostText('');
    setImageUrl('');
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-3xl   mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-1">{community.name}</h1>
            <p className="text-gray-400">{community.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onBack}>Back</Button>
            {community.joined ? (
              <Button variant="outline" onClick={() => leaveCommunity?.(community.id)}>Leave</Button>
            ) : (
              <Button onClick={() => joinCommunity?.(community.id)}>Join</Button>
            )}
          </div>
        </div>

        <div className=" border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl mb-4">Posts</h2>

          {community.joined ? (
            <div className="mb-4">
              <Textarea value={postText} onChange={(e) => setPostText((e.target as HTMLTextAreaElement).value)} placeholder="Share something with the community..." className="mb-2" />
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300">Image:</label>
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const f = (e.target as HTMLInputElement).files?.[0];
                    if (!f) return;
                    setImageFileName(f.name);
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImageUrl(reader.result as string);
                    };
                    reader.readAsDataURL(f);
                  }} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300">or URL:</label>
                  <Input value={imageUrl} onChange={(e) => { setImageUrl((e.target as HTMLInputElement).value); setImageFileName(null); }} placeholder="Optional image URL" />
                </div>
              </div>

              {imageUrl && (
                <div className="mb-2">
                  <img src={imageUrl} alt="preview" className="w-full max-h-48 object-cover rounded-md" />
                  {imageFileName && <div className="text-xs text-gray-400 mt-1">Uploaded: {imageFileName}</div>}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCreatePost}>Post</Button>
                <Button variant="ghost" onClick={() => { setPostText(''); setImageUrl(''); setImageFileName(null); }}>Clear</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">Join the community to see and create posts.</p>
          )}

          <div className="space-y-4">
            {(community.postsData || []).slice(0, visibleCount).map((post: any) => (
              <div key={post.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {post.authorAvatar ? (
                        <AvatarImage src={post.authorAvatar} />
                      ) : (
                        <AvatarFallback>{(post.author || 'U').slice(0,2)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="text-sm text-gray-200">{post.author}</div>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
                </div>

                <div className="mb-2">{post.content}</div>

                {post.image && (
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img src={post.image} alt="post image" className="w-full h-48 object-cover rounded-md mb-2" />
                )}

                <div className="mt-2">
                  <div className="flex items-center gap-6 text-gray-300 mb-3">
                    <button className={`flex items-center gap-2 ${post.liked ? 'text-red-400' : 'text-gray-300'}`} onClick={() => toggleLike?.(community.id, post.id)}>
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes || 0}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-300" onClick={() => setCommentModalPostId(post.id)}>
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{(post.comments || []).length}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-300" onClick={async () => {
                      // Try to share with image and text when supported
                      try {
                        const text = `${post.author} - ${post.content}\n\nPosted: ${new Date(post.createdAt).toLocaleString()}`;
                        if (navigator.share) {
                          // attempt to include image file if available and supported
                          if (post.image) {
                            try {
                              const resp = await fetch(post.image);
                              const blob = await resp.blob();
                              const file = new File([blob], 'image.jpg', { type: blob.type });
                                if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
                                  await (navigator as any).share({ files: [file], title: post.author, text });
                                  sharePost?.(community.id, post.id);
                                  return;
                                }
                            } catch (err) {
                              // fallthrough to text-only share
                            }
                          }

                          // text-only share fallback
                          await navigator.share({ title: post.author, text });
                          sharePost?.(community.id, post.id);
                        } else {
                          setShareModalPostId(post.id);
                        }
                      } catch (e) {
                        setShareModalPostId(post.id);
                      }
                    }}>
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares || 0}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(post.comments || []).map((c: any) => (
                      <div key={c.id} className="text-sm text-gray-300 pl-2">• <strong className="text-gray-100">{c.author}:</strong> {c.content}</div>
                    ))}
                  </div>

                </div>
              </div>
            ))}

            {community.postsData?.length > visibleCount && (
              <div className="flex justify-center mt-4">
                <Button variant="ghost" onClick={() => setVisibleCount((v) => v + 6)}>Load more</Button>
              </div>
            )}

            {!(community.postsData || []).length && (
              <p className="text-sm text-gray-400">No posts yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {commentModalPostId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCommentModalPostId(null)} />
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full sm:max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Comments</h3>
              <Button variant="ghost" size="sm" onClick={() => setCommentModalPostId(null)}>Close</Button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3 mb-3">
              {community.postsData?.find((p: any) => p.id === commentModalPostId)?.comments.map((c: any) => (
                <div key={c.id} className="text-sm text-gray-300">• <strong className="text-gray-100">{c.author}:</strong> {c.content}</div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={commentText[commentModalPostId || 0] || ''} onChange={(e) => setCommentText((s) => ({ ...s, [commentModalPostId || 0]: (e.target as HTMLInputElement).value }))} placeholder="Write a comment..." />
              <Button onClick={() => { const text = (commentText[commentModalPostId || 0] || '').trim(); if (!text) return; addComment?.(community.id, commentModalPostId, text); setCommentText((s) => ({ ...s, [commentModalPostId || 0]: '' })); }}>Add</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Fallback Modal */}
      {shareModalPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShareModalPostId(null)} />
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full sm:max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Share Post</h3>
              <Button variant="ghost" size="sm" onClick={() => setShareModalPostId(null)}>Close</Button>
            </div>
            <div className="space-y-3">
              {(() => {
                const p = community.postsData?.find((x: any) => x.id === shareModalPostId);
                if (!p) return null;
                return (
                  <div>
                    <h4 className="font-medium">{p.author} <span className="text-sm text-gray-400">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</span></h4>
                    <p className="text-sm text-gray-300 mb-2">{p.content}</p>
                    {p.image && <img src={p.image} alt="share" className="w-full h-48 object-cover rounded-md mb-2" />}
                    <div className="flex gap-2">
                      <Button onClick={() => { navigator.clipboard?.writeText(`${p.author} (${p.createdAt})\n\n${p.content}`); }}>Copy content</Button>
                      <Button variant="outline" onClick={() => { sharePost?.(community.id, p.id); setShareModalPostId(null); }}>Done</Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export { CommunityDetail };
export default CommunityDetail;
