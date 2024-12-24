// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

const Main = () => {
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [timerLabel, setTimerLabel] = useState('Session');
    const [isRunning, setIsRunning] = useState(false);
    const audioRef = useRef(null);
    const timerRef = useRef(null);
  
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
  
    const handleLengthChange = (type, change) => {
      if (isRunning) return;
      
      if (type === 'break') {
        const newBreakLength = breakLength + change;
        if (newBreakLength > 0 && newBreakLength <= 60) {
          setBreakLength(newBreakLength);
        }
      } else {
        const newSessionLength = sessionLength + change;
        if (newSessionLength > 0 && newSessionLength <= 60) {
          setSessionLength(newSessionLength);
          setTimeLeft(newSessionLength * 60);
        }
      }
    };
  
    const handleReset = () => {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setBreakLength(5);
      setSessionLength(25);
      setTimeLeft(25 * 60);
      setTimerLabel('Session');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  
    const handleStartStop = () => {
      setIsRunning(!isRunning);
    };
  
    useEffect(() => {
      if (isRunning) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime === 0) {
              audioRef.current.play();
              if (timerLabel === 'Session') {
                setTimerLabel('Break');
                return breakLength * 60;
              } else {
                setTimerLabel('Session');
                return sessionLength * 60;
              }
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        clearInterval(timerRef.current);
      }
  
      return () => clearInterval(timerRef.current);
    }, [isRunning, timerLabel, breakLength, sessionLength]);
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-96 bg-white p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">25 + 5 Clock</h1>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <h2 id="break-label" className="text-lg font-semibold mb-4 text-gray-700">Break Length</h2>
              <div className="flex items-center justify-center gap-4">
                <button
                  id="break-decrement"
                  onClick={() => handleLengthChange('break', -1)}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span id="break-length" className="text-xl font-bold w-12">{breakLength}</span>
                <button
                  id="break-increment"
                  onClick={() => handleLengthChange('break', 1)}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <h2 id="session-label" className="text-lg font-semibold mb-4 text-gray-700">Session Length</h2>
              <div className="flex items-center justify-center gap-4">
                <button
                  id="session-decrement"
                  onClick={() => handleLengthChange('session', -1)}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span id="session-length" className="text-xl font-bold w-12">{sessionLength}</span>
                <button
                  id="session-increment"
                  onClick={() => handleLengthChange('session', 1)}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 id="timer-label" className="text-2xl font-bold mb-4 text-gray-800">{timerLabel}</h2>
            <div id="time-left" className="text-5xl font-bold mb-6 text-gray-900">
              {formatTime(timeLeft)}
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                id="start_stop"
                onClick={handleStartStop}
                className="p-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                id="reset"
                onClick={handleReset}
                className="p-4 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
  
          <audio
            id="beep"
            ref={audioRef}
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          />
        </div>
      </div>
  )
}

export default Main
