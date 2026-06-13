import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const JoinCallPage = () => {
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();

    const handleJoin = () => {
        if (roomId.trim() !== "") {
            setError("");
            navigate(`/videocallroom/${roomId}`);
        } else {
            setError("Please enter a Room ID to continue.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleJoin();
    };

    return (
        <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 py-8 relative overflow-hidden">

            {/* Ambient glow top-left */}
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-3xl pointer-events-none" />
            {/* Ambient glow bottom-right */}
            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md bg-white/[0.04] border border-white/[0.08] rounded-3xl px-10 py-12 backdrop-blur-xl">

                {/* Pulse icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-18 h-18 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_0_0_rgba(124,58,237,0.5)] animate-pulse-ring p-[18px]">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <p className="text-center text-[11px] font-semibold tracking-widest uppercase text-violet-400 mb-2">
                    Video Conference
                </p>
                <h1 className="text-center text-[28px] font-extrabold text-slate-100 leading-tight tracking-tight mb-2">
                    Join Your Room
                </h1>
                <p className="text-center text-sm text-slate-500 leading-relaxed mb-9">
                    Enter a Room ID to connect instantly with your team or guests.
                </p>

                {/* Input */}
                <div className="mb-3">
                    <label htmlFor="room-id" className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                        Room ID
                    </label>
                    <div className="relative flex items-center">
                        {/* Icon */}
                        <span className="absolute left-4 text-slate-600 pointer-events-none flex items-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </span>
                        <input
                            id="room-id"
                            type="text"
                            placeholder="e.g. team-standup-01"
                            value={roomId}
                            onChange={(e) => { setRoomId(e.target.value); if (error) setError(""); }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            autoComplete="off"
                            spellCheck={false}
                            className={[
                                "w-full pl-11 pr-4 py-3.5 rounded-xl text-[15px] font-medium text-slate-100 placeholder-slate-600 outline-none transition-all duration-200",
                                error
                                    ? "bg-red-500/5 border border-red-500/50 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                                    : focused
                                    ? "bg-violet-600/[0.07] border border-violet-500 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                                    : "bg-white/[0.05] border border-white/10 hover:border-white/20"
                            ].join(" ")}
                        />
                    </div>

                    {error && (
                        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-red-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </p>
                    )}
                </div>

                {/* Join button */}
                <button
                    onClick={handleJoin}
                    className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-violet-600 to-indigo-500 shadow-[0_4px_24px_rgba(124,58,237,0.35)] hover:shadow-[0_8px_32px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_12px_rgba(124,58,237,0.3)] transition-all duration-150 cursor-pointer"
                >
                    <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Join Call
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mt-7">
                    <div className="flex-1 h-px bg-white/[0.07]" />
                    <span className="text-[12px] font-medium text-slate-600">secure &amp; encrypted</span>
                    <div className="flex-1 h-px bg-white/[0.07]" />
                </div>

                {/* Status pills */}
                <div className="flex justify-center gap-5 mt-5">
                    {["HD Video", "Low Latency", "End-to-End"].map((label) => (
                        <span key={label} className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)] animate-pulse" />
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Keyframe for pulse ring — minimal inline style block */}
            <style>{`
                @keyframes pulse-ring {
                    0%   { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
                    70%  { box-shadow: 0 0 0 20px rgba(124,58,237,0); }
                    100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); }
                }
                .animate-pulse-ring { animation: pulse-ring 2.4s ease-out infinite; }
            `}</style>
        </div>
    );
};

export default JoinCallPage;