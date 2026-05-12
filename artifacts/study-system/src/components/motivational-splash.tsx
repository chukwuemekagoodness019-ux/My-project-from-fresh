import { useEffect, useState } from "react";

const QUOTES = [
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Strive for progress, not perfection.", author: "AI Study Assistant" },
  { text: "Every expert was once a beginner.", author: "AI Study Assistant" },
  { text: "Consistency beats intensity. Show up every day.", author: "AI Study Assistant" },
  { text: "A little progress each day adds up to big results.", author: "AI Study Assistant" },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
  },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The expert in anything was once a beginner who refused to give up.", author: "AI Study Assistant" },
];

export function MotivationalSplash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [skipVisible, setSkipVisible] = useState(false);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    const skipTimer = setTimeout(() => setSkipVisible(true), 4000);
    const fadeTimer = setTimeout(() => setFading(true), 15000);
    const hideTimer = setTimeout(() => setVisible(false), 15800);
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 600);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-center px-8 transition-opacity duration-700 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
        <span className="text-4xl">📚</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">
        AI Study Assistant
      </h1>
      <p className="text-sm text-muted-foreground mb-10">Your smart learning companion</p>
      <blockquote className="max-w-sm">
        <p className="text-base font-medium text-foreground leading-relaxed italic">
          "{quote.text}"
        </p>
        <footer className="mt-4 text-xs text-muted-foreground">— {quote.author}</footer>
      </blockquote>
      <div className="mt-12 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      <div className="mt-8 h-8">
        {skipVisible && (
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg border border-border/50 hover:border-border animate-in fade-in duration-500"
          >
            Skip →
          </button>
        )}
      </div>
    </div>
  );
}
