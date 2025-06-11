import React, { useState, useEffect } from 'react';
import { Heart, Users, MessageCircle, Star, Trophy, ArrowLeft, Shuffle, UserPlus, LogIn, LogOut, Wifi, WifiOff } from 'lucide-react';

const CouplesGameApp = () => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [isConnected, setIsConnected] = useState(true);

  // Game room state
  const [gameRoom, setGameRoom] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [partner, setPartner] = useState(null);
  const [waitingForPartner, setWaitingForPartner] = useState(false);

  // Game state
  const [currentGame, setCurrentGame] = useState('menu');
  const [gameState, setGameState] = useState({
    truthOrDare: {
      currentPlayer: null,
      currentType: null,
      currentQuestion: '',
      score: {}
    },
    quiz: {
      currentPlayer: null,
      currentQuestion: '',
      answers: [],
      correctAnswer: 0,
      score: {},
      questionIndex: 0,
      showResult: false
    },
    wouldYouRather: {
      currentQuestion: '',
      votes: {},
      playerVotes: {},
      hasVoted: false
    }
  });

  // Mock data (in real app, this would come from backend)
  const truthQuestions = [
    "What's your biggest fear in our relationship?",
    "What's the most romantic thing you've ever done?",
    "What's one thing you've never told me?",
    "What's your favorite memory of us together?",
    "What's something you want to try together?",
    "What initially attracted you to me?",
    "What's your love language?",
    "What's the best compliment you've ever received?",
    "What's one thing you'd change about yourself?",
    "What's your biggest relationship goal?"
  ];

  const dareQuestions = [
    "Send me a cute selfie right now",
    "Do your best impression of me",
    "Sing our favorite song together",
    "Share a childhood photo",
    "Write me a short poem",
    "Do a silly dance for 30 seconds",
    "Tell me 3 things you love about me",
    "Make up a funny story about how we met",
    "Show me your favorite outfit",
    "Create a secret handshake together"
  ];

  const coupleQuizQuestions = [
    {
      question: "What's the key to a lasting relationship?",
      answers: ["Communication", "Trust", "Shared interests", "All of the above"],
      correct: 3
    },
    {
      question: "How often should couples have date nights?",
      answers: ["Weekly", "Monthly", "Whatever works for you", "Daily"],
      correct: 2
    },
    {
      question: "What's most important in conflict resolution?",
      answers: ["Being right", "Listening", "Winning", "Avoiding conflict"],
      correct: 1
    },
    {
      question: "What shows love best?",
      answers: ["Expensive gifts", "Quality time", "Grand gestures", "Small daily acts"],
      correct: 3
    }
  ];

  const wouldYouRatherQuestions = [
    {
      option1: "Always know what your partner is thinking",
      option2: "Always have your partner understand your feelings"
    },
    {
      option1: "Travel the world together",
      option2: "Build the perfect home together"
    },
    {
      option1: "Have a fancy dinner date",
      option2: "Have a cozy movie night at home"
    },
    {
      option1: "Be able to read each other's minds",
      option2: "Never have any arguments"
    }
  ];

  // Mock WebSocket connection simulation
  useEffect(() => {
    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 5000);

    return () => clearInterval(connectionInterval);
  }, []);

  // Authentication functions
  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'signup' && authForm.password !== authForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Mock authentication
    const mockUser = {
      id: Date.now(),
      username: authForm.username,
      gamesPlayed: Math.floor(Math.random() * 50),
      joinedDate: new Date().toLocaleDateString()
    };
    
    setUser(mockUser);
    setAuthForm({ username: '', password: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    setUser(null);
    setGameRoom(null);
    setPartner(null);
    setCurrentGame('menu');
    setWaitingForPartner(false);
  };

  // Room management functions
  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = {
      code,
      host: user,
      players: [user],
      createdAt: new Date()
    };
    
    setGameRoom(room);
    setRoomCode(code);
    setIsHost(true);
    setWaitingForPartner(true);
    
    // Simulate partner joining after random delay
    setTimeout(() => {
      const mockPartner = {
        id: Date.now() + 1,
        username: 'TestPartner',
        gamesPlayed: 25,
        joinedDate: '2024-01-15'
      };
      setPartner(mockPartner);
      setWaitingForPartner(false);
      setGameRoom(prev => ({
        ...prev,
        players: [user, mockPartner]
      }));
    }, Math.random() * 5000 + 2000);
  };

  const joinRoom = () => {
    if (!joinRoomCode) return;
    
    // Mock joining room
    const mockHost = {
      id: Date.now() - 1,
      username: 'RoomHost',
      gamesPlayed: 35,
      joinedDate: '2023-12-01'
    };
    
    const room = {
      code: joinRoomCode,
      host: mockHost,
      players: [mockHost, user],
      createdAt: new Date()
    };
    
    setGameRoom(room);
    setPartner(mockHost);
    setIsHost(false);
    setJoinRoomCode('');
  };

  const leaveRoom = () => {
    setGameRoom(null);
    setPartner(null);
    setIsHost(false);
    setWaitingForPartner(false);
    setCurrentGame('menu');
  };

  // Game functions with real-time sync simulation
  const startTruthOrDare = () => {
    setCurrentGame('truthordare');
    const randomType = Math.random() > 0.5 ? 'truth' : 'dare';
    const questions = randomType === 'truth' ? truthQuestions : dareQuestions;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const currentPlayer = Math.random() > 0.5 ? user.id : partner.id;
    
    setGameState(prev => ({
      ...prev,
      truthOrDare: {
        currentPlayer,
        currentType: randomType,
        currentQuestion: randomQuestion,
        score: { [user.id]: 0, [partner.id]: 0 }
      }
    }));
  };

  const nextTruthOrDare = () => {
    const currentPlayerId = gameState.truthOrDare.currentPlayer;
    const nextPlayer = currentPlayerId === user.id ? partner.id : user.id;
    const randomType = Math.random() > 0.5 ? 'truth' : 'dare';
    const questions = randomType === 'truth' ? truthQuestions : dareQuestions;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    setGameState(prev => ({
      ...prev,
      truthOrDare: {
        ...prev.truthOrDare,
        currentPlayer: nextPlayer,
        currentType: randomType,
        currentQuestion: randomQuestion
      }
    }));
  };

  const completeTruthOrDare = () => {
    const currentPlayerId = gameState.truthOrDare.currentPlayer;
    setGameState(prev => ({
      ...prev,
      truthOrDare: {
        ...prev.truthOrDare,
        score: {
          ...prev.truthOrDare.score,
          [currentPlayerId]: prev.truthOrDare.score[currentPlayerId] + 1
        }
      }
    }));
    
    setTimeout(nextTruthOrDare, 1000);
  };

  const startQuiz = () => {
    setCurrentGame('quiz');
    const firstQuestion = coupleQuizQuestions[0];
    const currentPlayer = Math.random() > 0.5 ? user.id : partner.id;
    
    setGameState(prev => ({
      ...prev,
      quiz: {
        currentPlayer,
        currentQuestion: firstQuestion.question,
        answers: firstQuestion.answers,
        correctAnswer: firstQuestion.correct,
        score: { [user.id]: 0, [partner.id]: 0 },
        questionIndex: 0,
        showResult: false
      }
    }));
  };

  const answerQuiz = (answerIndex) => {
    const isCorrect = answerIndex === gameState.quiz.correctAnswer;
    const currentPlayerId = gameState.quiz.currentPlayer;
    
    setGameState(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        showResult: true,
        score: {
          ...prev.quiz.score,
          [currentPlayerId]: isCorrect ? prev.quiz.score[currentPlayerId] + 1 : prev.quiz.score[currentPlayerId]
        }
      }
    }));
    
    setTimeout(() => {
      const nextQuestionIndex = (gameState.quiz.questionIndex + 1) % coupleQuizQuestions.length;
      const nextQuestion = coupleQuizQuestions[nextQuestionIndex];
      const nextPlayer = currentPlayerId === user.id ? partner.id : user.id;
      
      setGameState(prev => ({
        ...prev,
        quiz: {
          currentPlayer: nextPlayer,
          currentQuestion: nextQuestion.question,
          answers: nextQuestion.answers,
          correctAnswer: nextQuestion.correct,
          score: prev.quiz.score,
          questionIndex: nextQuestionIndex,
          showResult: false
        }
      }));
    }, 2000);
  };

  const startWouldYouRather = () => {
    setCurrentGame('wouldyourather');
    const randomQuestion = wouldYouRatherQuestions[Math.floor(Math.random() * wouldYouRatherQuestions.length)];
    
    setGameState(prev => ({
      ...prev,
      wouldYouRather: {
        currentQuestion: randomQuestion,
        votes: { option1: 0, option2: 0 },
        playerVotes: {},
        hasVoted: false
      }
    }));
  };

  const voteWouldYouRather = (option) => {
    if (gameState.wouldYouRather.playerVotes[user.id]) return;
    
    setGameState(prev => ({
      ...prev,
      wouldYouRather: {
        ...prev.wouldYouRather,
        votes: {
          ...prev.wouldYouRather.votes,
          [option]: prev.wouldYouRather.votes[option] + 1
        },
        playerVotes: {
          ...prev.wouldYouRather.playerVotes,
          [user.id]: option
        },
        hasVoted: Object.keys(prev.wouldYouRather.playerVotes).length + 1 >= 2
      }
    }));
  };

  const nextWouldYouRather = () => {
    const randomQuestion = wouldYouRatherQuestions[Math.floor(Math.random() * wouldYouRatherQuestions.length)];
    setGameState(prev => ({
      ...prev,
      wouldYouRather: {
        currentQuestion: randomQuestion,
        votes: { option1: 0, option2: 0 },
        playerVotes: {},
        hasVoted: false
      }
    }));
  };

  // Authentication screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Heart className="mx-auto text-pink-500 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Couples Games</h1>
            <p className="text-gray-600">Play together from anywhere!</p>
          </div>
          
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                authMode === 'login' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <LogIn size={16} className="inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                authMode === 'signup' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus size={16} className="inline mr-2" />
              Sign Up
            </button>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={authForm.username}
                onChange={(e) => setAuthForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
            
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Confirm password"
                  required
                />
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Room selection screen
  if (!gameRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Online' : 'Reconnecting...'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
            
            <div className="text-center mb-8">
              <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentPlayerName}'s Turn {isMyTurn && '(You!)'}
              </h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-800 text-center mb-6">
                {gameState.quiz.currentQuestion}
              </p>
              
              {gameState.quiz.showResult ? (
                <div className="text-center">
                  <div className="text-2xl mb-4">
                    {gameState.quiz.correctAnswer === gameState.quiz.answers.length - 1 ? '✓' : '✗'}
                  </div>
                  <p className="text-gray-600">
                    Correct answer: {gameState.quiz.answers[gameState.quiz.correctAnswer]}
                  </p>
                </div>
              ) : isMyTurn ? (
                <div className="space-y-3">
                  {gameState.quiz.answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => answerQuiz(index)}
                      className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all"
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  Waiting for {currentPlayerName} to answer...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Would You Rather game screen
  if (currentGame === 'wouldyourather') {
    const hasUserVoted = gameState.wouldYouRather.playerVotes[user.id];
    const userVote = gameState.wouldYouRather.playerVotes[user.id];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setCurrentGame('menu')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Menu
              </button>
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <button
                  onClick={nextWouldYouRather}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  disabled={!isConnected}
                >
                  <Shuffle size={20} className="mr-2" />
                  New Question
                </button>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <Users className="mx-auto text-blue-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800">Would You Rather?</h2>
              {gameState.wouldYouRather.hasVoted && (
                <p className="text-sm text-gray-600 mt-2">
                  Both players have voted! See the results below.
                </p>
              )}
            </div>
            
            <div className="space-y-4 mb-8">
              <button
                onClick={() => voteWouldYouRather('option1')}
                disabled={hasUserVoted || !isConnected}
                className={`w-full p-6 rounded-xl transition-all disabled:opacity-75 ${
                  userVote === 'option1' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                }`}
              >
                <p className="text-lg font-semibold mb-2">
                  {gameState.wouldYouRather.currentQuestion.option1}
                </p>
                {gameState.wouldYouRather.hasVoted && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm opacity-90">
                      Votes: {gameState.wouldYouRather.votes.option1}
                    </p>
                    {userVote === 'option1' && (
                      <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                        Your choice
                      </span>
                    )}
                  </div>
                )}
              </button>
              
              <div className="text-center text-gray-500 font-semibold">OR</div>
              
              <button
                onClick={() => voteWouldYouRather('option2')}
                disabled={hasUserVoted || !isConnected}
                className={`w-full p-6 rounded-xl transition-all disabled:opacity-75 ${
                  userVote === 'option2'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                }`}
              >
                <p className="text-lg font-semibold mb-2">
                  {gameState.wouldYouRather.currentQuestion.option2}
                </p>
                {gameState.wouldYouRather.hasVoted && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm opacity-90">
                      Votes: {gameState.wouldYouRather.votes.option2}
                    </p>
                    {userVote === 'option2' && (
                      <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                        Your choice
                      </span>
                    )}
                  </div>
                )}
              </button>
            </div>
            
            {!hasUserVoted && (
              <div className="text-center text-gray-600">
                Make your choice! Waiting for you to vote...
              </div>
            )}
            
            {hasUserVoted && !gameState.wouldYouRather.hasVoted && (
              <div className="text-center text-gray-600">
                Waiting for your partner to vote...
              </div>
            )}
            
            {gameState.wouldYouRather.hasVoted && (
              <div className="text-center">
                <button
                  onClick={nextWouldYouRather}
                  disabled={!isConnected}
                  className="bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  Next Question
                </button>
              </div>
            )}
            
            {!isConnected && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <WifiOff size={20} className="text-red-500 mr-2" />
                <span className="text-red-700 text-sm">
                  Connection lost. Trying to reconnect...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CouplesGameApp;-center mb-8">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">{user.username[0].toUpperCase()}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user.username}!</h2>
              <p className="text-gray-600">Games played: {user.gamesPlayed}</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={createRoom}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center"
              >
                <Heart size={20} className="mr-2" />
                Create Game Room
              </button>
              
              <div className="text-center text-gray-500 font-medium">OR</div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center font-mono text-lg"
                  placeholder="Enter room code"
                  maxLength={6}
                />
                <button
                  onClick={joinRoom}
                  disabled={!joinRoomCode || !isConnected}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Users size={20} className="mr-2" />
                  Join Game Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Waiting for partner screen
  if (waitingForPartner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-pulse mb-6">
            <Heart className="mx-auto text-pink-500 mb-4" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Waiting for Partner</h2>
          <p className="text-gray-600 mb-6">Share this room code with your partner:</p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <span className="text-3xl font-bold font-mono text-gray-800">{roomCode}</span>
          </div>
          <button
            onClick={leaveRoom}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Cancel and go back
          </button>
        </div>
      </div>
    );
  }

  // Game menu with partner
  if (currentGame === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">Room: {gameRoom.code}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">{user.username[0].toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <span className="text-gray-400">vs</span>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">{partner.username[0].toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium">{partner.username}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={leaveRoom}
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <LogOut size={16} className="mr-1" />
                Leave
              </button>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <Heart className="mx-auto text-white mb-4" size={48} />
            <h1 className="text-4xl font-bold text-white mb-2">Choose Your Game</h1>
            <p className="text-white opacity-90">Ready to play together!</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={startTruthOrDare}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
            >
              <MessageCircle className="text-pink-500 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Truth or Dare</h3>
              <p className="text-gray-600">Get to know each other better with fun questions and playful challenges!</p>
            </div>
            
            <div 
              onClick={startQuiz}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
            >
              <Star className="text-yellow-500 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Couples Quiz</h3>
              <p className="text-gray-600">Test your relationship knowledge with fun quiz questions!</p>
            </div>
            
            <div 
              onClick={startWouldYouRather}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
            >
              <Users className="text-blue-500 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Would You Rather</h3>
              <p className="text-gray-600">Make tough choices and see if you think alike!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Truth or Dare game screen
  if (currentGame === 'truthordare') {
    const currentPlayerName = gameState.truthOrDare.currentPlayer === user.id ? user.username : partner.username;
    const isMyTurn = gameState.truthOrDare.currentPlayer === user.id;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setCurrentGame('menu')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Menu
              </button>
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="text-sm text-gray-600">
                  {user.username}: {gameState.truthOrDare.score[user.id] || 0} | {partner.username}: {gameState.truthOrDare.score[partner.id] || 0}
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {currentPlayerName}'s Turn {isMyTurn && '(You!)'}
              </h2>
              <div className={`inline-block px-6 py-2 rounded-full text-white font-semibold mb-6 ${
                gameState.truthOrDare.currentType === 'truth' ? 'bg-blue-500' : 'bg-pink-500'
              }`}>
                {gameState.truthOrDare.currentType?.toUpperCase()}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-800 text-center leading-relaxed">
                {gameState.truthOrDare.currentQuestion}
              </p>
            </div>
            
            {isMyTurn ? (
              <div className="flex space-x-4">
                <button
                  onClick={completeTruthOrDare}
                  className="flex-1 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Completed! ✓
                </button>
                <button
                  onClick={nextTruthOrDare}
                  className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Skip
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                Waiting for {currentPlayerName} to complete their turn...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz game screen
  if (currentGame === 'quiz') {
    const currentPlayerName = gameState.quiz.currentPlayer === user.id ? user.username : partner.username;
    const isMyTurn = gameState.quiz.currentPlayer === user.id;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setCurrentGame('menu')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Menu
              </button>
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="text-sm text-gray-600">
                  {user.username}: {gameState.quiz.score[user.id] || 0} | {partner.username}: {gameState.quiz.score[partner.id] || 0}
                </div>
              </div>
            </div>
            
            <div className="text