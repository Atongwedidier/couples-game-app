import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, MessageCircle, Star, Trophy, ArrowLeft, Shuffle, Target, Music, Camera, Gamepad2, UserPlus, LogIn, LogOut, Crown, Timer, Send, Eye, EyeOff } from 'lucide-react';

const OnlineCouplesGamePlatform = () => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Game state
  const [currentGame, setCurrentGame] = useState('lobby');
  const [gameRoom, setGameRoom] = useState(null);
  const [partner, setPartner] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [gameInvites, setGameInvites] = useState([]);
  
  // Game scores and progress
  const [gameStats, setGameStats] = useState({
    truthOrDare: { wins: 0, completed: 0 },
    quiz: { wins: 0, score: 0 },
    wouldYouRather: { agreements: 0, total: 0 },
    charades: { wins: 0, guessed: 0 },
    drawingGuess: { wins: 0, drawings: 0 },
    storyBuilding: { stories: 0, words: 0 },
    memoryMatch: { wins: 0, matches: 0 },
    quickFire: { wins: 0, answered: 0 }
  });

  // Individual game states
  const [truthOrDare, setTruthOrDare] = useState({
    currentPlayer: 1,
    currentType: null,
    currentQuestion: '',
    score: { player1: 0, player2: 0 }
  });

  const [quiz, setQuiz] = useState({
    currentPlayer: 1,
    currentQuestion: '',
    answers: [],
    correctAnswer: 0,
    score: { player1: 0, player2: 0 },
    questionIndex: 0
  });

  const [wouldYouRather, setWouldYouRather] = useState({
    currentQuestion: '',
    votes: { option1: [], option2: [] },
    hasVoted: false,
    playerVote: null
  });

  const [charades, setCharades] = useState({
    currentActor: 1,
    currentWord: '',
    timeLeft: 60,
    isActive: false,
    score: { player1: 0, player2: 0 },
    guessed: false
  });

  const [drawingGuess, setDrawingGuess] = useState({
    currentArtist: 1,
    currentWord: '',
    timeLeft: 90,
    isDrawing: false,
    canvas: null,
    guesses: [],
    score: { player1: 0, player2: 0 }
  });

  const [storyBuilding, setStoryBuilding] = useState({
    story: [],
    currentPlayer: 1,
    wordLimit: 10,
    isComplete: false,
    theme: ''
  });

  const [memoryMatch, setMemoryMatch] = useState({
    cards: [],
    flippedCards: [],
    matchedPairs: [],
    currentPlayer: 1,
    score: { player1: 0, player2: 0 },
    gameStarted: false
  });

  const [quickFire, setQuickFire] = useState({
    questions: [],
    currentQuestion: 0,
    timeLeft: 30,
    isActive: false,
    answers: [],
    score: { player1: 0, player2: 0 }
  });

  // Mock user database
  const [users] = useState([
    { id: 1, username: 'lovebird1', email: 'love@example.com', password: 'password123', online: true },
    { id: 2, username: 'sweetheart', email: 'sweet@example.com', password: 'password123', online: true },
    { id: 3, username: 'romantic', email: 'romantic@example.com', password: 'password123', online: false }
  ]);

  // Timers
  const charadesTimer = useRef(null);
  const drawingTimer = useRef(null);
  const quickFireTimer = useRef(null);

  // Game content
  const truthQuestions = [
    "What's your biggest fear in our relationship?",
    "What's the most romantic thing you've ever done?",
    "What's one thing you've never told me?",
    "What's your favorite memory of us together?",
    "What's something you want to try together?",
    "What initially attracted you to me?",
    "What's your biggest relationship goal?",
    "What's the best compliment you've ever received?",
    "What's one thing you'd change about yourself?",
    "What's your dream date scenario?"
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

  const charadesWords = [
    "First Kiss", "Wedding Day", "Cooking Together", "Movie Night", "Dancing", 
    "Laughing", "Cuddling", "Surprise", "Anniversary", "Vacation",
    "Breakfast in Bed", "Love Letter", "Holding Hands", "Sunset", "Picnic"
  ];

  const drawingWords = [
    "Heart", "Home", "Future", "Adventure", "Dreams", "Together",
    "Family", "Happiness", "Love", "Forever", "Journey", "Memories"
  ];

  const storyThemes = [
    "Our First Date", "A Magical Adventure", "Future Plans", "Dream Vacation",
    "Perfect Day Together", "Silly Mishap", "Romantic Evening", "Unexpected Journey"
  ];

  const quickFireQuestions = [
    "Favorite color?", "Dream destination?", "Favorite food?", "Biggest fear?",
    "Favorite movie?", "Dream job?", "Favorite season?", "Pet peeve?",
    "Favorite song?", "Childhood dream?", "Favorite hobby?", "Perfect day?"
  ];

  // Authentication functions
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setOnlineUsers(users.filter(u => u.online && u.id !== user.id));
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (users.find(u => u.username === registerForm.username)) {
      alert('Username already exists');
      return;
    }
    const newUser = {
      id: users.length + 1,
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      online: true
    };
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setOnlineUsers(users.filter(u => u.online));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentGame('lobby');
    setGameRoom(null);
    setPartner(null);
  };

  // Game room functions
  const inviteUser = (user) => {
    // In a real app, this would send an invite through websockets
    setGameInvites([...gameInvites, { from: currentUser.username, to: user.username, timestamp: Date.now() }]);
    alert(`Invite sent to ${user.username}!`);
  };

  const acceptInvite = (invite) => {
    setPartner({ username: invite.from });
    setGameRoom(`room_${Date.now()}`);
    setCurrentGame('menu');
    setGameInvites(gameInvites.filter(i => i !== invite));
  };

  // Memory Match game setup
  const setupMemoryGame = () => {
    const symbols = ['❤️', '💕', '🌹', '💐', '🎁', '🌟', '💫', '🦋'];
    const cards = [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    })).sort(() => Math.random() - 0.5);
    
    setMemoryMatch({
      ...memoryMatch,
      cards,
      gameStarted: true,
      flippedCards: [],
      matchedPairs: []
    });
  };

  const flipCard = (cardId) => {
    if (memoryMatch.flippedCards.length >= 2) return;
    
    const newCards = memoryMatch.cards.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    
    const newFlipped = [...memoryMatch.flippedCards, cardId];
    
    setMemoryMatch({
      ...memoryMatch,
      cards: newCards,
      flippedCards: newFlipped
    });

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);
      
      setTimeout(() => {
        if (firstCard.symbol === secondCard.symbol) {
          const matchedCards = newCards.map(card => 
            card.id === first || card.id === second ? { ...card, isMatched: true } : card
          );
          const newScore = { ...memoryMatch.score };
          newScore[`player${memoryMatch.currentPlayer}`]++;
          
          setMemoryMatch({
            ...memoryMatch,
            cards: matchedCards,
            flippedCards: [],
            matchedPairs: [...memoryMatch.matchedPairs, firstCard.symbol],
            score: newScore
          });
        } else {
          const unflippedCards = newCards.map(card => 
            card.id === first || card.id === second ? { ...card, isFlipped: false } : card
          );
          setMemoryMatch({
            ...memoryMatch,
            cards: unflippedCards,
            flippedCards: [],
            currentPlayer: memoryMatch.currentPlayer === 1 ? 2 : 1
          });
        }
      }, 1000);
    }
  };

  // Charades timer
  useEffect(() => {
    if (charades.isActive && charades.timeLeft > 0) {
      charadesTimer.current = setTimeout(() => {
        setCharades(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (charades.timeLeft === 0) {
      setCharades(prev => ({ 
        ...prev, 
        isActive: false,
        currentActor: prev.currentActor === 1 ? 2 : 1
      }));
    }
    return () => clearTimeout(charadesTimer.current);
  }, [charades.isActive, charades.timeLeft]);

  // Login/Register screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Heart className="mx-auto text-pink-500 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Couples Gaming Platform</h1>
            <p className="text-gray-600">Connect and play together online!</p>
          </div>
          
          <div className="flex mb-6">
            <button
              onClick={() => setShowLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-semibold rounded-l-lg ${
                showLogin ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-semibold rounded-r-lg ${
                !showLogin ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          {showLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                <LogIn className="inline mr-2" size={20} />
                Login
              </button>
              <div className="text-sm text-gray-600 text-center mt-4">
                Demo: Use username "lovebird1" or "sweetheart" with password "password123"
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                <UserPlus className="inline mr-2" size={20} />
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Lobby - find partners
  if (currentGame === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <Crown className="text-yellow-500 mr-3" size={32} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Welcome, {currentUser.username}!</h1>
                  <p className="text-gray-600">Find a partner to start playing</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-100 px-4 py-2 rounded-lg"
              >
                <LogOut className="mr-2" size={20} />
                Logout
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">👥 Online Users</h3>
                <div className="space-y-3">
                  {onlineUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-semibold text-gray-800">{user.username}</span>
                      </div>
                      <button
                        onClick={() => inviteUser(user)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  ))}
                  {onlineUsers.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No other users online right now</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">💌 Game Invites</h3>
                <div className="space-y-3">
                  {gameInvites.map((invite, index) => (
                    <div key={index} className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                      <p className="text-gray-800 mb-3">
                        <strong>{invite.from}</strong> wants to play with you!
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => acceptInvite(invite)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => setGameInvites(gameInvites.filter(i => i !== invite))}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                  {gameInvites.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No pending invites</p>
                  )}
                </div>
              </div>
            </div>

            {partner && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <h3 className="text-xl font-bold text-green-800 mb-2">🎮 Ready to Play!</h3>
                <p className="text-green-700 mb-4">You're connected with <strong>{partner.username}</strong></p>
                <button
                  onClick={() => setCurrentGame('menu')}
                  className="bg-green-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Gaming
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Game menu
  if (currentGame === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">🎮 Game Room</h1>
                <p className="text-gray-600">Playing with {partner?.username}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {setCurrentGame('lobby'); setPartner(null); setGameRoom(null);}}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Leave Room
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="mr-2" size={20} />
                  Logout
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GameCard
                icon={<MessageCircle className="text-pink-500" size={40} />}
                title="Truth or Dare"
                description="Get to know each other with fun questions and challenges!"
                onClick={() => setCurrentGame('truthordare')}
              />
              
              <GameCard
                icon={<Star className="text-yellow-500" size={40} />}
                title="Couples Quiz"
                description="Test your relationship knowledge!"
                onClick={() => setCurrentGame('quiz')}
              />
              
              <GameCard
                icon={<Users className="text-blue-500" size={40} />}
                title="Would You Rather"
                description="Make tough choices together!"
                onClick={() => setCurrentGame('wouldyourather')}
              />
              
              <GameCard
                icon={<Target className="text-green-500" size={40} />}
                title="Charades"
                description="Act out romantic words and phrases!"
                onClick={() => setCurrentGame('charades')}
              />
              
              <GameCard
                icon={<Camera className="text-purple-500" size={40} />}
                title="Drawing & Guessing"
                description="Draw and guess romantic concepts!"
                onClick={() => setCurrentGame('drawing')}
              />
              
              <GameCard
                icon={<Music className="text-red-500" size={40} />}
                title="Story Building"
                description="Create romantic stories together!"
                onClick={() => setCurrentGame('story')}
              />
              
              <GameCard
                icon={<Gamepad2 className="text-indigo-500" size={40} />}
                title="Memory Match"
                description="Match romantic symbols together!"
                onClick={() => {setCurrentGame('memory'); setupMemoryGame();}}
              />
              
              <GameCard
                icon={<Timer className="text-orange-500" size={40} />}
                title="Quick Fire"
                description="Fast-paced question rounds!"
                onClick={() => setCurrentGame('quickfire')}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Truth or Dare Game
  if (currentGame === 'truthordare') {
    const startTruthOrDare = () => {
      const randomType = Math.random() > 0.5 ? 'truth' : 'dare';
      const questions = randomType === 'truth' ? truthQuestions : dareQuestions;
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      setTruthOrDare({
        ...truthOrDare,
        currentType: randomType,
        currentQuestion: randomQuestion
      });
    };

    const nextTruthOrDare = () => {
      const nextPlayer = truthOrDare.currentPlayer === 1 ? 2 : 1;
      const randomType = Math.random() > 0.5 ? 'truth' : 'dare';
      const questions = randomType === 'truth' ? truthQuestions : dareQuestions;
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      setTruthOrDare({
        ...truthOrDare,
        currentPlayer: nextPlayer,
        currentType: randomType,
        currentQuestion: randomQuestion
      });
    };

    const completeTruthOrDare = () => {
      const newScore = { ...truthOrDare.score };
      newScore[`player${truthOrDare.currentPlayer}`]++;
      
      setTruthOrDare({
        ...truthOrDare,
        score: newScore
      });
      
      nextTruthOrDare();
    };

    if (!truthOrDare.currentQuestion) {
      startTruthOrDare();
    }

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
              <div className="text-sm text-gray-600">
                You: {truthOrDare.score.player1} | {partner?.username}: {truthOrDare.score.player2}
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {truthOrDare.currentPlayer === 1 ? 'Your' : `${partner?.username}'s`} Turn
              </h2>
              <div className={`inline-block px-6 py-2 rounded-full text-white font-semibold mb-6 ${
                truthOrDare.currentType === 'truth' ? 'bg-blue-500' : 'bg-pink-500'
              }`}>
                {truthOrDare.currentType?.toUpperCase()}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-800 text-center leading-relaxed">
                {truthOrDare.currentQuestion}
              </p>
            </div>
            
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
          </div>
        </div>
      </div>
    );
  }

  // Memory Match Game
  if (currentGame === 'memory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-600 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setCurrentGame('menu')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Menu
              </button>
              <div className="text-sm text-gray-600">
                You: {memoryMatch.score.player1} | {partner?.username}: {memoryMatch.score.player2}
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">💕 Memory Match</h2>
              <p className="text-gray-600">
                {memoryMatch.currentPlayer === 1 ? 'Your' : `${partner?.username}'s`} Turn
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {memoryMatch.cards.map(card => (
                <button
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  disabled={card.isFlipped || card.isMatched || memoryMatch.flippedCards.length >= 2}
                  className={`w-20 h-20 rounded-lg text-2xl font-bold transition-all transform hover:scale-105 ${
                    card.isFlipped || card.isMatched 
                      ? 'bg-pink-100 text-pink-600' 
                      : 'bg-gradient-to-br from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600'
                  } ${card.isMatched ? 'opacity-75' : ''}`}
                >
                  {card.isFlipped || card.isMatched ? card.symbol : '💝'}
                </button>
              ))}
            </div>
            
            {memoryMatch.matchedPairs.length === 8 && (
              <div className="text-center mt-8">
                <h3 className="text-2xl font-bold text-green-600 mb-4">🎉 Game Complete!</h3>
                <p className="text-gray-700 mb-4">
                  Winner: {memoryMatch.score.player1 > memoryMatch.score.player2 ? 'You' : partner?.username}!
                </p>
                <button
                  onClick={setupMemoryGame}
                  className="bg-pink-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Charades Game
  if (currentGame === 'charades') {
    const startCharades = () => {
      const randomWord = charadesWords[Math.floor(Math.random() * charadesWords.length)];
      setCharades({
        ...charades,
        currentWord: randomWord,
        timeLeft: 60,
        isActive: true,
        guessed: false
      });
    };

    const guessedCorrect = () => {
      const newScore = { ...charades.score };
      newScore[`player${charades.currentActor}`]++;
      
      setCharades({
        ...charades,
        score: newScore,
        isActive: false,
        guessed: true,
        currentActor: charades.currentActor === 1 ? 2 : 1
      });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 p-4">
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
              <div className="text-sm text-gray-600">
                You: {charades.score.player1} | {partner?.username}: {charades.score.player2}
              </div>
            </div>
            
            <div className="text-center mb-8">
              <Target className="mx-auto text-green-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎭 Charades</h2>
              <p className="text-gray-600">
                {charades.currentActor === 1 ? 'You are' : `${partner?.username} is`} acting!
              </p>
            </div>
            
            {!charades.isActive && !charades.currentWord && (
              <div className="text-center">
                <button
                  onClick={startCharades}
                  className="bg-green-500 text-white font-semibold py-4 px-8 rounded-lg hover:bg-green-600 transition-colors text-lg"
                >
                  Start Acting!
                </button>
              </div>
            )}
            
            {charades.currentWord && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-green-600 mb-2">
                    {charades.currentActor === 1 ? 'Your word to act:' : 'Guess what they\'re acting:'}
                  </p>
                  <h3 className="text-2xl font-bold text-green-800">
                    {charades.currentActor === 1 ? charades.currentWord : '???'}
                  </h3>
                </div>
                
                {charades.isActive && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-500 mb-4">
                      ⏰ {charades.timeLeft}s
                    </div>
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={guessedCorrect}
                        className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Guessed Correctly! ✓
                      </button>
                      <button
                        onClick={() => setCharades({...charades, isActive: false, currentActor: charades.currentActor === 1 ? 2 : 1})}
                        className="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Skip ✗
                      </button>
                    </div>
                  </div>
                )}
                
                {!charades.isActive && (
                  <div className="text-center">
                    <button
                      onClick={startCharades}
                      className="bg-green-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Next Round
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Story Building Game
  if (currentGame === 'story') {
    const startStory = () => {
      const randomTheme = storyThemes[Math.floor(Math.random() * storyThemes.length)];
      setStoryBuilding({
        ...storyBuilding,
        theme: randomTheme,
        story: [],
        currentPlayer: 1,
        isComplete: false
      });
    };

    const addToStory = (words) => {
      const newStory = [...storyBuilding.story, {
        player: storyBuilding.currentPlayer,
        words: words,
        playerName: storyBuilding.currentPlayer === 1 ? currentUser.username : partner?.username
      }];
      
      setStoryBuilding({
        ...storyBuilding,
        story: newStory,
        currentPlayer: storyBuilding.currentPlayer === 1 ? 2 : 1
      });
    };

    const completeStory = () => {
      setStoryBuilding({
        ...storyBuilding,
        isComplete: true
      });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setCurrentGame('menu')}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Menu
              </button>
            </div>
            
            <div className="text-center mb-8">
              <Music className="mx-auto text-red-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Story Building</h2>
              {storyBuilding.theme && (
                <p className="text-gray-600">Theme: <strong>{storyBuilding.theme}</strong></p>
              )}
            </div>
            
            {!storyBuilding.theme && (
              <div className="text-center">
                <button
                  onClick={startStory}
                  className="bg-red-500 text-white font-semibold py-4 px-8 rounded-lg hover:bg-red-600 transition-colors text-lg"
                >
                  Start New Story
                </button>
              </div>
            )}
            
            {storyBuilding.theme && !storyBuilding.isComplete && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Our Story So Far:</h3>
                  <div className="space-y-2">
                    {storyBuilding.story.map((part, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        part.player === 1 ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        <span className="font-semibold">{part.playerName}:</span> {part.words}
                      </div>
                    ))}
                    {storyBuilding.story.length === 0 && (
                      <p className="text-gray-500 italic">Story will appear here as you build it together...</p>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    <strong>
                      {storyBuilding.currentPlayer === 1 ? 'Your' : `${partner?.username}'s`} turn
                    </strong> - Add 5-15 words to continue the story
                  </p>
                  {storyBuilding.currentPlayer === 1 && (
                    <StoryInput onSubmit={addToStory} />
                  )}
                  {storyBuilding.currentPlayer === 2 && (
                    <p className="text-gray-500">Waiting for {partner?.username} to add to the story...</p>
                  )}
                </div>
                
                {storyBuilding.story.length >= 4 && (
                  <div className="text-center">
                    <button
                      onClick={completeStory}
                      className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Complete Story
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {storyBuilding.isComplete && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎉 Your Completed Story!</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-800 leading-relaxed">
                      {storyBuilding.story.map(part => part.words).join(' ')}
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={startStory}
                    className="bg-red-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Create Another Story
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Helper Components
const GameCard = ({ icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const StoryInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex space-x-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add 5-15 words to continue the story..."
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        maxLength={100}
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  );
};

export default OnlineCouplesGamePlatform; 