"use client";
import { useState } from "react";

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState("");
  const [totalSoFar, setTotalSoFar] = useState("");
  const [classesLeft, setClassesLeft] = useState("");
  const [showResult, setShowResult] = useState(false); // This controls when the result box appears

  // Convert text inputs to numbers, fallback to 0 if the box is empty
  const currentAttended = parseInt(attended) || 0;
  const currentTotal = parseInt(totalSoFar) || 0;
  const futureClasses = parseInt(classesLeft) || 0;

  // The Core Logic
  const finalTotalClasses = currentTotal + futureClasses;
  const minRequiredClasses = Math.ceil(0.75 * finalTotalClasses);
  const totalLeavesAllowed = finalTotalClasses - minRequiredClasses;
  const leavesTakenSoFar = currentTotal - currentAttended;
  
  const furtherLeavesAllowed = totalLeavesAllowed - leavesTakenSoFar;
  const canTakeLeave = furtherLeavesAllowed >= 1; 
  
  // Calculate what the final % will be if they skip this upcoming class 
  const finalAttendanceIfLeaveTaken = finalTotalClasses > 0 
    ? (((currentAttended + futureClasses - 1) / finalTotalClasses) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Can I Bunk?</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Find out if skipping your next class will ruin your 75% attendance streak.</p>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Classes Conducted So Far</label>
            <input 
              type="number" 
              value={totalSoFar} 
              onChange={(e) => { setTotalSoFar(e.target.value); setShowResult(false); }}
              className="w-full bg-gray-700 border-none rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., 40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Classes You Attended</label>
            <input 
              type="number" 
              value={attended} 
              onChange={(e) => { setAttended(e.target.value); setShowResult(false); }}
              className="w-full bg-gray-700 border-none rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., 32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Classes Left in Semester</label>
            <input 
              type="number" 
              value={classesLeft} 
              onChange={(e) => { setClassesLeft(e.target.value); setShowResult(false); }}
              className="w-full bg-gray-700 border-none rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g., 10"
            />
          </div>
        </div>

        {/* The New Calculate Button */}
        <button 
          onClick={() => setShowResult(true)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition duration-200 mb-6 shadow-lg shadow-blue-500/30"
        >
          Check My Attendance
        </button>

        {/* Dynamic Results Area - Only shows when the button is clicked */}
        {showResult && (
          <div className={`p-6 rounded-xl text-center transition-all duration-300 ${
            canTakeLeave ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
          }`}>
            <h2 className={`text-2xl font-black mb-2 ${canTakeLeave ? 'text-green-400' : 'text-red-400'}`}>
              {canTakeLeave ? "Yes, you can take a leave! 🛋️" : "No, attend the class! 🚨"}
            </h2>
            
            <div className="space-y-2 mt-4 text-gray-200 text-sm">
              <p>
                <span className="font-semibold text-gray-400">Leaves remaining: </span> 
                <span className={furtherLeavesAllowed > 0 ? "text-green-300" : "text-red-300"}>
                  {furtherLeavesAllowed > 0 ? furtherLeavesAllowed : 0}
                </span>
              </p>
              <p>
                <span className="font-semibold text-gray-400">Final % if you skip next class: </span> 
                {finalAttendanceIfLeaveTaken}%
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
                *Assuming you attend all other remaining classes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}