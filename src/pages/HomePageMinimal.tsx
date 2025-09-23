import React from 'react';

const HomePageMinimal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome!</h1>
      <p className="text-lg text-gray-600 mb-8">
        You've successfully logged in as a kid! 🎉
      </p>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Let's Play Games!</h2>
        <p>Ready to start learning and having fun?</p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">0</div>
            <div>Games Played</div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">0</div>
            <div>Stars Earned</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">0</div>
            <div>Achievements</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageMinimal;