"use client";
import { useState } from "react";

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState("");
  const [totalSoFar, setTotalSoFar] = useState("");
  const [classesPerWeek, setClassesPerWeek] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Convert text inputs to numbers
  const currentAttended = parseInt(attended) || 0;
  const currentTotal = parseInt(totalSoFar) || 0;
  const weeklyClasses = parseFloat(classesPerWeek) || 0;

  // -- NEW DATE MATH LOGIC --
  let futureClasses = 0;
  if (endDate && weeklyClasses > 0) {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day counting

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Only calculate if the date is in the future
    if (diffDays > 0) {
      const weeksLeft = diffDays / 7;
      futureClasses = Math.ceil(weeksLeft * weeklyClasses);
    }
  }

  // -- CORE MATH & LOGIC --
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
    <div className="relative min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* GEOMETRIC BACKGROUND ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-up { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-120px) rotate(180deg); } 100% { transform: translateY(0px) rotate(360deg); } }
        @keyframes float-down { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(120px) rotate(-180deg); } 100% { transform: translateY(0px) rotate(-360deg); } }
        @keyframes popup { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .shape-up { animation: float-up 20s infinite ease-in-out; }
        .shape-down { animation: float-down 25s infinite ease-in-out; }
        .shape-fast { animation-duration: 15s; }
        .shape-slow { animation-duration: 30s; }
        .triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
        .animate-popup { animation: popup 0.2s ease-out forwards; }
      `}} />

      {/* FLOATING SHAPES */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-[15%] left-[10%] w-24 h-24 border-2 border-blue-500/20 rounded-2xl shape-up"></div>
        <div className="absolute bottom-[20%] left-[15%] w-32 h-32 bg-purple-500/10 triangle shape-down" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-[25%] right-[15%] w-28 h-28 border-2 border-pink-500/20 triangle shape-up" style={{ animationDelay: '-10s' }}></div>
        <div className="absolute bottom-[15%] right-[10%] w-20 h-20 bg-blue-500/10 rounded-xl shape-down" style={{ animationDelay: '-15s' }}></div>
        <div className="absolute top-[45%] left-[5%] w-16 h-16 border-2 border-purple-500/20 rounded-full shape-up shape-fast" style={{ animationDelay: '-7s' }}></div>
        <div className="absolute top-[50%] right-[5%] w-12 h-12 bg-pink-500/10 triangle shape-down shape-fast" style={{ animationDelay: '-2s' }}></div>
      </div>

      {/* MAIN CARD */}
      <div className="relative w-full max-w-md bg-gray-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 z-10 my-4 mt-12">
        <h1 className="text-3xl font-black text-center mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Can I Bunk?
        </h1>
        <p className="text-gray-400 text-center mb-6 text-sm">Analyze your attendance in real-time.</p>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Conducted So Far</label>
              <input 
                type="number" 
                value={totalSoFar} 
                onChange={(e) => { setTotalSoFar(e.target.value); setShowResult(false); }}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g., 40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Classes Attended</label>
              <input 
                type="number" 
                value={attended} 
                onChange={(e) => { setAttended(e.target.value); setShowResult(false); }}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g., 32"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Classes Per Week</label>
              <input 
                type="number" 
                value={classesPerWeek} 
                onChange={(e) => { setClassesPerWeek(e.target.value); setShowResult(false); }}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g., 3"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Last Day of Classes</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => { setEndDate(e.target.value); setShowResult(false); }}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-200 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowResult(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg mb-4"
        >
          Check My Attendance
        </button>

        {/* RESULTS AREA */}
        {showResult && currentTotal > 0 && endDate !== "" && classesPerWeek !== "" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className={`p-4 rounded-xl border bg-gray-800/80 ${conditionColor.replace('text', 'border')}/30 flex justify-between items-center`}>
              <div>
                <h3 className={`text-lg font-bold ${conditionColor}`}>{conditionStatus}</h3>
                <p className="text-sm text-gray-300 mt-1">{conditionDesc}</p>
              </div>
              <div className="text-right pl-4 border-l border-gray-700">
                <p className="text-xs text-gray-400">Projected Future Classes</p>
                <p className="text-xl font-bold text-gray-200">+{futureClasses}</p>
              </div>
            </div>

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

      {/* FOOTER SECTION */}
      <footer className="relative z-10 mt-6 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-3 bg-gray-900/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-700/50 shadow-lg">
          <img 
            src="/profile.jpeg" 
            alt="Profile Icon" 
            onClick={() => setIsImageOpen(true)}
            className="w-8 h-8 rounded-full object-cover border border-gray-600 bg-gray-800 cursor-pointer hover:scale-110 transition-transform duration-200"
          />
          <span className="text-gray-200 text-sm font-semibold tracking-wide">Made by Naman Kanyal 25 batch</span>
          <div className="w-px h-5 bg-gray-600 mx-2"></div> 
          <div className="flex items-center space-x-4">
             {/* Replace these # with your real links */}
            <a href="https://github.com/AGuySoCool-Bz" className="text-gray-400 hover:text-white transition-colors duration-200"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
            <a href="https://www.linkedin.com/in/naman-kanyal-b2709b431/" className="text-gray-400 hover:text-blue-500 transition-colors duration-200"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.125 0 2.062 2.062 0 01-2.062 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd"/></svg></a>
            <a href="https://www.instagram.com/whyso_cool_/" className="text-gray-400 hover:text-pink-500 transition-colors duration-200"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg></a>
          </div>
        </div>
      </footer>

      {/* FULL-SCREEN IMAGE MODAL OVERLAY */}
      {isImageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer" onClick={() => setIsImageOpen(false)}>
          <div className="relative max-w-sm w-full animate-popup shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsImageOpen(false)} className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full border-2 border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-colors duration-200 shadow-xl z-50">✕</button>
            <img src="/profile.jpeg" alt="Profile Icon Enlarged" className="w-full h-auto rounded-2xl border border-gray-700/50 object-cover"/>
          </div>
        </div>
      )}
    </div>
  );
}