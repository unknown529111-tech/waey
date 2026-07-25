import { useEffect, useState } from "react";
import { getStreakState, getPrizeInfo } from "@/lib/streak";

export function useStreak() {
  const [count, setCount] = useState(0);
  const [newStreakFlash, setNewStreakFlash] = useState(false);
  const [prizeWinner, setPrizeWinner] = useState<string | null>(null);

  useEffect(() => {
    setPrizeWinner(getPrizeInfo().winner);
  }, []);

  useEffect(() => {
    const sync = () => {
      const s = getStreakState();
      setCount(s.count);
      setPrizeWinner(getPrizeInfo().winner);
    };
    sync();
    const interval = setInterval(sync, 10_000);
    return () => clearInterval(interval);
  }, []);

  return { count, newStreakFlash, prizeWinner };
}
