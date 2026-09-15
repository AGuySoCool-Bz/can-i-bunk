"use client";
import { useState } from "react";

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState("");
  const [totalSoFar, setTotalSoFar] = useState("");
  const [classesLeft, setClassesLeft] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Convert inputs to numbers
  const currentAttended = parseInt(attended) || 0;
  const currentTotal = parseInt(totalSoFar) || 0;
  const futureClasses = parseInt(classesLeft) || 0;

  // -- MATH & LOGIC --
  const finalTotalClasses = currentTotal + futureClasses;
  const minRequiredClasses = Math.ceil(0.75 * finalTotalClasses);
  const totalLeavesAllowed = finalTotalClasses - minRequiredClasses;
  const leavesTakenSoFar = currentTotal - currentAttended;
  const furtherLeavesAllowed = totalLeavesAllowed - leavesTakenSoFar;
  const canTakeLeave = furtherLeavesAllowed >= 1;

  // Percentages
  const currentPercent = currentTotal > 0 ? ((currentAttended / currentTotal) * 100).toFixed(1) : "0.0";
  const percentIfAttendNext = currentTotal > 0 ? (((currentAttended + 1) / (currentTotal + 1)) * 100).toFixed(1) : "0.0";
  const percentIfSkipNext = currentTotal > 0 ? ((currentAttended / (currentTotal + 1)) * 100).toFixed(1) : "0.0";
  
  const maxPossiblePercent = finalTotalClasses > 0 ? ((currentAttended + futureClasses) / finalTotalClasses) * 100 : 0;

  // -- CONDITION EVALUATION --
  let conditionStatus = "";
  let conditionColor = "";
  let conditionDesc = "";

  if (maxPossiblePercent < 75 && currentTotal > 0 && futureClasses > 0) {
    conditionStatus = "Permanent Damage ☠️";
    conditionColor = "text-red-500";
    conditionDesc = "It is mathematically impossible to reach 75% now.";
  } else if (parseFloat(currentPercent) > 85) {
    conditionStatus = "Very Good 🌟";
    conditionColor = "text-green-400";
    conditionDesc = "You have a solid buffer. Keep it up!";
  } else if (parseFloat(currentPercent) < 69) {
    conditionStatus = "Danger Zone 🚨";
    conditionColor = "text-red-500";
    conditionDesc = "You are critically low, but can still recover!";
  } else {
    conditionStatus = "Borderline ⚠️";
    conditionColor = "text-yellow-400";
    conditionDesc = "You are hovering around the limit. Tread carefully.";
  }

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* GEOMETRIC BACKGROUND ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-up {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-120px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        @keyframes float-down {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(120px) rotate(-180deg); }
          100% { transform: translateY(0px) rotate(-360deg); }
        }
        .shape-up { animation: float-up 20s infinite ease-in-out; }
        .shape-down { animation: float-down 25s infinite ease-in-out; }
        .triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
      `}} />

      {/* FLOATING SHAPES */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hollow Square Top Left */}
        <div className="absolute top-[15%] left-[10%] w-24 h-24 border-2 border-blue-500/20 rounded-2xl shape-up"></div>
        
        {/* Solid Triangle Bottom Left */}
        <div className="absolute bottom-[20%] left-[15%] w-32 h-32 bg-purple-500/10 triangle shape-down" style={{ animationDelay: '-5s' }}></div>
        
        {/* Hollow Triangle Top Right */}
        <div className="absolute top-[25%] right-[15%] w-28 h-28 border-2 border-pink-500/20 triangle shape-up" style={{ animationDelay: '-10s' }}></div>
        
        {/* Solid Square Bottom Right */}
        <div className="absolute bottom-[15%] right-[10%] w-20 h-20 bg-blue-500/10 rounded-xl shape-down" style={{ animationDelay: '-15s' }}></div>
        
        {/* Hollow Circle Center Left */}
        <div className="absolute top-[45%] left-[5%] w-16 h-16 border-2 border-purple-500/20 rounded-full shape-up" style={{ animationDelay: '-7s' }}></div>

        {/* Small Solid Triangle Center Right */}
        <div className="absolute top-[50%] right-[5%] w-12 h-12 bg-pink-500/10 triangle shape-down" style={{ animationDelay: '-2s' }}></div>
      </div>

      {/* MAIN CARD (Glassmorphism effect) */}
      <div className="relative w-full max-w-md bg-gray-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 z-10">
        <h1 className="text-3xl font-black text-center mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Can I Bunk?
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Analyze your attendance in real-time.</p>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Classes Conducted So Far</label>
            <input 
              type="number" 
              value={totalSoFar} 
              onChange={(e) => { setTotalSoFar(e.target.value); setShowResult(false); }}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., 40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Classes You Attended</label>
            <input 
              type="number" 
              value={attended} 
              onChange={(e) => { setAttended(e.target.value); setShowResult(false); }}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., 32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Classes Left in Semester</label>
            <input 
              type="number" 
              value={classesLeft} 
              onChange={(e) => { setClassesLeft(e.target.value); setShowResult(false); }}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., 10"
            />
          </div>
        </div>

        <button 
          onClick={() => setShowResult(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg mb-4"
        >
          Check My Attendance
        </button>

        {/* RESULTS AREA */}
        {showResult && currentTotal > 0 && classesLeft !== "" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Condition Alert Box */}
            <div className={`p-4 rounded-xl border bg-gray-800/80 ${conditionColor.replace('text', 'border')}/30`}>
              <h3 className={`text-lg font-bold ${conditionColor}`}>{conditionStatus}</h3>
              <p className="text-sm text-gray-300 mt-1">{conditionDesc}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Current %</p>
                <p className="text-xl font-bold text-white">{currentPercent}%</p>
              </div>
              <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Leaves Left</p>
                <p className={`text-xl font-bold ${furtherLeavesAllowed > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {furtherLeavesAllowed > 0 ? furtherLeavesAllowed : 0}
                </p>
              </div>
              <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">If you ATTEND next</p>
                <p className="text-lg font-semibold text-blue-300">{percentIfAttendNext}%</p>
              </div>
              <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">If you BUNK next</p>
                <p className="text-lg font-semibold text-orange-300">{percentIfSkipNext}%</p>
              </div>
            </div>

            {/* Final Verdict */}
            {conditionStatus !== "Permanent Damage ☠️" && (
              <div className={`p-4 rounded-xl text-center shadow-inner ${
                canTakeLeave ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                <p className="font-bold text-lg">
                  {canTakeLeave ? "You can skip the next class! 🛋️" : "DO NOT skip the next class! 🚨"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}