import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';

const CountdownTimer = ({ targetDate, onEnd, noSeconds = false }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (!remaining && onEnd) onEnd();
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <Badge bg="success">Started</Badge>;

  return (
    <div className="d-inline-flex gap-2 font-monospace fw-bold">
      <span className="bg-dark text-white px-2 py-1 rounded">{timeLeft.days}d</span>:
      <span className="bg-dark text-white px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>:
      <span className="bg-dark text-white px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
      {!noSeconds && (<>:<span className="bg-dark text-white px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span></>)}
    </div>
  );
};

export default CountdownTimer;