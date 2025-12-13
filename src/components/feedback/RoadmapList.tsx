"use client";

import { useState, useEffect } from "react";
import { safeCapture } from "@/lib/posthog";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  hasVoted: boolean;
  discussionUrl?: string;
}

const initialRoadmapItems: RoadmapItem[] = [
  {
    id: "rag",
    title: "RAG: Upload Local Knowledge Files",
    description: "Upload local knowledge files, cross chat sessions",
    votes: 0,
    hasVoted: false,
    discussionUrl: "https://github.com/levante-hub/levante/discussions",
  },
  {
    id: "memory",
    title: "Memory: Local Memory Chat",
    description: "Local memory chat cross sessions",
    votes: 0,
    hasVoted: false,
    discussionUrl: "https://github.com/levante-hub/levante/discussions",
  },
  {
    id: "mcp-features",
    title: "Full MCP Features Definition Protocol",
    description: "Add more compatibilities",
    votes: 0,
    hasVoted: false,
    discussionUrl: "https://github.com/levante-hub/levante/discussions",
  },
  {
    id: "mic-to-text",
    title: "Chat Mic to Text",
    description: "Transform voice to text",
    votes: 0,
    hasVoted: false,
    discussionUrl: "https://github.com/levante-hub/levante/discussions",
  },
  {
    id: "voice-assistant",
    title: "Voice Assistant",
    description: "Full voice chat session",
    votes: 0,
    hasVoted: false,
    discussionUrl: "https://github.com/levante-hub/levante/discussions",
  },
];

export const RoadmapList = () => {
  const [items, setItems] = useState<RoadmapItem[]>(initialRoadmapItems);

  // Load votes from localStorage on mount
  useEffect(() => {
    const savedVotes = localStorage.getItem("roadmap-votes");
    if (savedVotes) {
      try {
        const votesData = JSON.parse(savedVotes);
        setItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            votes: votesData[item.id]?.votes || 0,
            hasVoted: votesData[item.id]?.hasVoted || false,
          }))
        );
      } catch (error) {
        console.error("Error loading votes:", error);
      }
    }
  }, []);

  // Save votes to localStorage whenever they change
  const saveVotes = (updatedItems: RoadmapItem[]) => {
    const votesData = updatedItems.reduce(
      (acc, item) => {
        acc[item.id] = { votes: item.votes, hasVoted: item.hasVoted };
        return acc;
      },
      {} as Record<string, { votes: number; hasVoted: boolean }>
    );
    localStorage.setItem("roadmap-votes", JSON.stringify(votesData));
  };

  const handleVote = (itemId: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === itemId) {
          const newHasVoted = !item.hasVoted;
          const newVotes = newHasVoted ? item.votes + 1 : item.votes - 1;

          // Track vote event
          safeCapture("roadmap_item_voted", {
            item_id: itemId,
            item_title: item.title,
            action: newHasVoted ? "vote" : "unvote",
            new_vote_count: newVotes,
          });

          return {
            ...item,
            votes: newVotes,
            hasVoted: newHasVoted,
          };
        }
        return item;
      });

      saveVotes(updatedItems);
      return updatedItems;
    });
  };

  // Sort items by votes (descending)
  const sortedItems = [...items].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-4">
      {sortedItems.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4">
            {/* Vote Button */}
            <button
              onClick={() => handleVote(item.id)}
              className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-lg border-2 transition-all ${
                item.hasVoted
                  ? "bg-black border-black text-white"
                  : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
              }`}
              aria-label={item.hasVoted ? "Remove vote" : "Vote for this feature"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold mt-1">{item.votes}</span>
            </button>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 mb-3">{item.description}</p>
              
              {/* View Discussion Button */}
              {item.discussionUrl && (
                <a
                  href={item.discussionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    safeCapture("roadmap_discussion_clicked", {
                      item_id: item.id,
                      item_title: item.title,
                    });
                  }}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-black transition-colors"
                >
                  View Discussion
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

