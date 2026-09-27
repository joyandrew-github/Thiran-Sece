import { useState, useEffect } from 'react';

/**
 * Custom hook for calculating countdown time remaining to a target date.
 * @param {Date | string} targetDate Target date object or ISO string.
 */
export function useCountdown(targetDate) {
    const calculateTimeLeft = () => {
        const target = new Date(targetDate).getTime();
        const diff = target - Date.now();
        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
        }
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            done: false
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
}
