import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/useAuth";
import { initStreak, tickStreak, pauseStreak, getStreak, getPrizeInfo } from "@/lib/streak";

export function useStreak() {
  const { user, isAuthenticated } = useAuth();
  const email = user?.email;

  const [count, setCount] = useState(0);
  const [accumulated, setAccumulated] = useState(0);
  const [newStreakFlash, setNewStreakFlash] = useState(false);
  const [prizeWinner, setPrizeWinner] = useState<string | null>(null);
  const [lastStreakDate, setLastStreakDate] = useState("");

  useEffect(() => {
    setPrizeWinner(getPrizeInfo().winner);
  }, []);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sync = useCallback(() => {
    if (!email) return;
    const data = getStreak(email);
    setCount(data.count);
    setAccumulated(data.accumulatedMs);
    setLastStreakDate(data.lastStreakDate);
  }, [email]);

  useEffect(() => {
    if (!email) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    initStreak(email);
    sync();

    const handleVisibility = () => {
      if (document.hidden) {
        pauseStreak(email);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    intervalRef.current = setInterval(() => {
      const result = tickStreak(email);
      sync();
      setPrizeWinner(getPrizeInfo().winner);
      if (result.newStreak) {
        setNewStreakFlash(true);
        setTimeout(() => setNewStreakFlash(false), 4000);
      }
    }, TICK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [email, sync]);

  return { count, accumulated, newStreakFlash, prizeWinner, lastStreakDate };
}

const TICK_INTERVAL = 10_000;
