import React, { useContext, useEffect, useState } from 'react'
import './timer.css'
import { AppContext } from '../context/appContext';
import { notifyError } from '../utils/notifier';

export default function Timer() {
    const { setRemainingTime, remainingTime, setDurationTimeOut } = useContext(AppContext);
    const [notified, setNotified] = useState(false);

    useEffect(() => {
        if (remainingTime > 0) {
          const interval = setInterval(() => {
            setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
          }, 1000);
          return () => clearInterval(interval);
        } else if (remainingTime === 0 && !notified) {
          notifyError("O tempo acabou!");
          setDurationTimeOut(true);
          setNotified(true);
        }
      }, [remainingTime, notified]);

      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const secs = time % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
      };
    
  return (
    <div>
        {remainingTime != null && (
          <div id="timer-container">
            <h5>Tempo restante: {formatTime(remainingTime)}</h5>
          </div>
        )}
    </div>
  )
}