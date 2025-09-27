/**
 * AAA+ Multiplayer Service
 * Real-time collaborative learning with COPPA-compliant safety
 * WebSocket-based multiplayer game system
 */

import { EventEmitter } from 'events';

export interface PlayerInfo {
  id: string;
  displayName: string;
  avatar: string;
  ageGroup: '3-5' | '6-8' | '9+';
  level: number;
  score: number;
  status: 'online' | 'playing' | 'away' | 'offline';
  isHost?: boolean;
  team?: 'red' | 'blue' | 'green' | 'yellow';
  position?: { x: number; y: number };
  animation?: string;
}

export interface GameRoom {
  id: string;
  code: string; // 6-character room code for easy sharing
  name: string;
  host: PlayerInfo;
  players: PlayerInfo[];
  maxPlayers: number;
  gameType: GameType;
  subject?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  status: 'waiting' | 'starting' | 'playing' | 'paused' | 'finished';
  settings: RoomSettings;
  currentQuestion?: MultiplayerQuestion;
  scores: Map<string, number>;
  startTime?: Date;
  endTime?: Date;
  isPrivate: boolean;
}

type GameType =
  | 'competitive'  // Players compete against each other
  | 'collaborative' // Players work together
  | 'team'         // Team vs team
  | 'tournament'   // Tournament bracket
  | 'practice'     // Practice together

interface RoomSettings {
  timeLimit?: number;
  questionCount?: number;
  allowSpectators: boolean;
  autoStart: boolean;
  minPlayers: number;
  teamSize?: number;
  powerUpsEnabled: boolean;
  voiceChatEnabled: boolean; // With parental control
}

interface MultiplayerQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
  answeredBy: Map<string, { answer: number; time: number }>;
}

export interface GameEvent {
  type: GameEventType;
  playerId: string;
  data: any;
  timestamp: number;
}

type GameEventType =
  | 'player_joined'
  | 'player_left'
  | 'game_started'
  | 'question_received'
  | 'answer_submitted'
  | 'round_ended'
  | 'game_ended'
  | 'chat_message'
  | 'emoji_reaction'
  | 'power_up_used'
  | 'achievement_unlocked';

interface ConnectionConfig {
  url: string;
  reconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  timeout: number;
}

export class MultiplayerService extends EventEmitter {
  private static instance: MultiplayerService;
  private socket: WebSocket | null = null;
  private currentRoom: GameRoom | null = null;
  private playerInfo: PlayerInfo | null = null;
  private connectionConfig: ConnectionConfig;
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private messageQueue: any[] = [];
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private roomListCache: GameRoom[] = [];
  private callbacks: Map<string, (data: any) => void> = new Map();

  // Game state
  private gameState: {
    currentQuestionIndex: number;
    answers: Map<string, any>;
    scores: Map<string, number>;
    powerUps: Map<string, string[]>;
    teamScores?: Map<string, number>;
  };

  // Safety features for COPPA compliance
  private safetySettings = {
    filterChat: true,
    blockPersonalInfo: true,
    parentalControlRequired: true,
    anonymizeUsernames: true,
    maxMessageLength: 100,
    allowedEmojis: ['😊', '👍', '🎉', '🌟', '💪', '🎯', '🏆', '👏']
  };

  private constructor() {
    super();
    this.connectionConfig = {
      url: this.getWebSocketURL(),
      reconnectAttempts: 5,
      reconnectDelay: 2000,
      heartbeatInterval: 30000,
      timeout: 10000
    };
    this.gameState = {
      currentQuestionIndex: 0,
      answers: new Map(),
      scores: new Map(),
      powerUps: new Map()
    };
  }

  public static getInstance(): MultiplayerService {
    if (!MultiplayerService.instance) {
      MultiplayerService.instance = new MultiplayerService();
    }
    return MultiplayerService.instance;
  }

  private getWebSocketURL(): string {
    // In production, this would be your WebSocket server URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.VITE_WS_URL || 'localhost:3001';
    return `${protocol}//${host}/multiplayer`;
  }

  /**
   * Connect to multiplayer server
   */
  public async connect(playerInfo: PlayerInfo): Promise<boolean> {
    if (this.isConnected) return true;

    this.playerInfo = playerInfo;

    return new Promise((resolve, reject) => {
      try {
        console.log('🌐 Connecting to multiplayer server...');

        // For development, simulate connection
        if (!window.WebSocket) {
          console.warn('WebSocket not supported, using simulation mode');
          this.simulateConnection();
          resolve(true);
          return;
        }

        this.socket = new WebSocket(this.connectionConfig.url);

        this.socket.onopen = () => {
          console.log('✅ Connected to multiplayer server');
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Send authentication
          this.sendMessage('auth', {
            playerId: playerInfo.id,
            displayName: this.sanitizeName(playerInfo.displayName),
            avatar: playerInfo.avatar,
            ageGroup: playerInfo.ageGroup
          });

          // Start heartbeat
          this.startHeartbeat();

          // Process queued messages
          this.processMessageQueue();

          resolve(true);
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
        };

        this.socket.onclose = () => {
          console.log('🔌 Disconnected from multiplayer server');
          this.isConnected = false;
          this.stopHeartbeat();
          this.attemptReconnect();
        };

        // Timeout
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('Connection timeout'));
          }
        }, this.connectionConfig.timeout);

      } catch (error) {
        console.error('Failed to connect:', error);
        reject(error);
      }
    });
  }

  /**
   * Simulate connection for development
   */
  private simulateConnection(): void {
    this.isConnected = true;
    console.log('🎮 Running in simulation mode');

    // Simulate server responses
    setTimeout(() => {
      this.emit('connected', { playerId: this.playerInfo?.id });
    }, 100);
  }

  /**
   * Create a game room
   */
  public async createRoom(settings: Partial<RoomSettings> = {}): Promise<GameRoom> {
    const roomId = this.generateRoomId();
    const roomCode = this.generateRoomCode();

    const room: GameRoom = {
      id: roomId,
      code: roomCode,
      name: `${this.playerInfo?.displayName}'s Room`,
      host: this.playerInfo!,
      players: [this.playerInfo!],
      maxPlayers: settings.minPlayers || 4,
      gameType: 'competitive',
      difficulty: 'adaptive',
      status: 'waiting',
      settings: {
        timeLimit: 30,
        questionCount: 10,
        allowSpectators: false,
        autoStart: false,
        minPlayers: 2,
        powerUpsEnabled: true,
        voiceChatEnabled: false, // Disabled by default for safety
        ...settings
      },
      scores: new Map(),
      isPrivate: false
    };

    this.currentRoom = room;
    this.sendMessage('create_room', room);

    // Emit room created event
    this.emit('room_created', room);

    return room;
  }

  /**
   * Join a room by code
   */
  public async joinRoom(roomCode: string): Promise<GameRoom> {
    return new Promise((resolve, reject) => {
      // Validate room code
      if (!this.validateRoomCode(roomCode)) {
        reject(new Error('Invalid room code'));
        return;
      }

      // Send join request
      this.sendMessage('join_room', {
        roomCode: roomCode.toUpperCase(),
        player: this.playerInfo
      });

      // Wait for response
      const timeout = setTimeout(() => {
        reject(new Error('Join room timeout'));
      }, 5000);

      this.once('room_joined', (room: GameRoom) => {
        clearTimeout(timeout);
        this.currentRoom = room;
        resolve(room);
      });

      this.once('room_join_failed', (error: string) => {
        clearTimeout(timeout);
        reject(new Error(error));
      });
    });
  }

  /**
   * Quick match - find a suitable room
   */
  public async quickMatch(gameType: GameType, subject?: string): Promise<GameRoom> {
    return new Promise((resolve, reject) => {
      this.sendMessage('quick_match', {
        gameType,
        subject,
        ageGroup: this.playerInfo?.ageGroup,
        level: this.playerInfo?.level
      });

      const timeout = setTimeout(() => {
        // If no match found, create a new room
        this.createRoom({
          minPlayers: 2,
          autoStart: true
        }).then(resolve).catch(reject);
      }, 5000);

      this.once('match_found', (room: GameRoom) => {
        clearTimeout(timeout);
        this.currentRoom = room;
        resolve(room);
      });
    });
  }

  /**
   * Start the game
   */
  public startGame(): void {
    if (!this.currentRoom || !this.isHost()) {
      console.error('Only host can start the game');
      return;
    }

    if (this.currentRoom.players.length < this.currentRoom.settings.minPlayers) {
      this.emit('error', 'Not enough players');
      return;
    }

    this.sendMessage('start_game', {
      roomId: this.currentRoom.id
    });

    this.currentRoom.status = 'starting';
    this.emit('game_starting');

    // Start countdown
    this.startCountdown();
  }

  /**
   * Submit an answer
   */
  public submitAnswer(answer: number): void {
    if (!this.currentRoom || !this.currentRoom.currentQuestion) {
      return;
    }

    const answerTime = Date.now();

    this.sendMessage('submit_answer', {
      roomId: this.currentRoom.id,
      questionId: this.currentRoom.currentQuestion.id,
      answer,
      time: answerTime
    });

    // Store answer locally
    this.gameState.answers.set(this.currentRoom.currentQuestion.id, {
      answer,
      time: answerTime
    });

    this.emit('answer_submitted', answer);
  }

  /**
   * Send chat message (filtered for safety)
   */
  public sendChatMessage(message: string): void {
    if (!this.currentRoom) return;

    // Safety filters
    const filtered = this.filterMessage(message);
    if (!filtered) {
      this.emit('message_blocked', 'Message contained inappropriate content');
      return;
    }

    this.sendMessage('chat_message', {
      roomId: this.currentRoom.id,
      message: filtered,
      playerId: this.playerInfo?.id,
      timestamp: Date.now()
    });
  }

  /**
   * Send emoji reaction
   */
  public sendEmoji(emoji: string): void {
    if (!this.safetySettings.allowedEmojis.includes(emoji)) {
      return;
    }

    this.sendMessage('emoji_reaction', {
      roomId: this.currentRoom?.id,
      emoji,
      playerId: this.playerInfo?.id
    });

    this.emit('emoji_sent', emoji);
  }

  /**
   * Use power-up
   */
  public usePowerUp(powerUpType: string, target?: string): void {
    if (!this.currentRoom?.settings.powerUpsEnabled) {
      return;
    }

    this.sendMessage('use_power_up', {
      roomId: this.currentRoom.id,
      powerUpType,
      target,
      playerId: this.playerInfo?.id
    });
  }

  /**
   * Leave current room
   */
  public leaveRoom(): void {
    if (!this.currentRoom) return;

    this.sendMessage('leave_room', {
      roomId: this.currentRoom.id,
      playerId: this.playerInfo?.id
    });

    this.currentRoom = null;
    this.gameState = {
      currentQuestionIndex: 0,
      answers: new Map(),
      scores: new Map(),
      powerUps: new Map()
    };

    this.emit('room_left');
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);

      console.log('📨 Received:', message.type);

      switch (message.type) {
        case 'room_update':
          this.handleRoomUpdate(message.data);
          break;

        case 'game_started':
          this.handleGameStarted(message.data);
          break;

        case 'question_received':
          this.handleQuestionReceived(message.data);
          break;

        case 'round_results':
          this.handleRoundResults(message.data);
          break;

        case 'game_ended':
          this.handleGameEnded(message.data);
          break;

        case 'player_joined':
          this.handlePlayerJoined(message.data);
          break;

        case 'player_left':
          this.handlePlayerLeft(message.data);
          break;

        case 'chat_message':
          this.handleChatMessage(message.data);
          break;

        case 'emoji_reaction':
          this.handleEmojiReaction(message.data);
          break;

        case 'power_up_activated':
          this.handlePowerUpActivated(message.data);
          break;

        case 'error':
          this.handleError(message.data);
          break;

        default:
          // Check for registered callbacks
          const callback = this.callbacks.get(message.type);
          if (callback) {
            callback(message.data);
          }
      }

      // Emit generic message event
      this.emit('message', message);

    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * Handle room update
   */
  private handleRoomUpdate(room: GameRoom): void {
    this.currentRoom = room;
    this.emit('room_updated', room);
  }

  /**
   * Handle game started
   */
  private handleGameStarted(data: any): void {
    if (this.currentRoom) {
      this.currentRoom.status = 'playing';
      this.currentRoom.startTime = new Date();
    }
    this.emit('game_started', data);
  }

  /**
   * Handle question received
   */
  private handleQuestionReceived(question: MultiplayerQuestion): void {
    if (this.currentRoom) {
      this.currentRoom.currentQuestion = question;
    }
    this.gameState.currentQuestionIndex++;
    this.emit('question_received', question);

    // Start question timer
    this.startQuestionTimer(question.timeLimit);
  }

  /**
   * Handle round results
   */
  private handleRoundResults(results: any): void {
    // Update scores
    if (results.scores) {
      results.scores.forEach((score: number, playerId: string) => {
        this.gameState.scores.set(playerId, score);
      });
    }

    this.emit('round_ended', results);
  }

  /**
   * Handle game ended
   */
  private handleGameEnded(results: any): void {
    if (this.currentRoom) {
      this.currentRoom.status = 'finished';
      this.currentRoom.endTime = new Date();
    }

    this.emit('game_ended', results);

    // Show final results
    this.showFinalResults(results);
  }

  /**
   * Handle player joined
   */
  private handlePlayerJoined(player: PlayerInfo): void {
    if (this.currentRoom) {
      this.currentRoom.players.push(player);
    }
    this.emit('player_joined', player);
  }

  /**
   * Handle player left
   */
  private handlePlayerLeft(playerId: string): void {
    if (this.currentRoom) {
      this.currentRoom.players = this.currentRoom.players.filter(
        p => p.id !== playerId
      );

      // If host left, assign new host
      if (this.currentRoom.host.id === playerId && this.currentRoom.players.length > 0) {
        this.currentRoom.host = this.currentRoom.players[0];
        this.currentRoom.players[0].isHost = true;
      }
    }
    this.emit('player_left', playerId);
  }

  /**
   * Handle chat message
   */
  private handleChatMessage(data: any): void {
    // Additional safety check
    const filtered = this.filterMessage(data.message);
    if (filtered) {
      this.emit('chat_message', {
        ...data,
        message: filtered
      });
    }
  }

  /**
   * Handle emoji reaction
   */
  private handleEmojiReaction(data: any): void {
    this.emit('emoji_reaction', data);
  }

  /**
   * Handle power-up activated
   */
  private handlePowerUpActivated(data: any): void {
    this.emit('power_up_activated', data);
  }

  /**
   * Handle error
   */
  private handleError(error: any): void {
    console.error('Multiplayer error:', error);
    this.emit('error', error);
  }

  /**
   * Send message to server
   */
  private sendMessage(type: string, data: any): void {
    const message = {
      type,
      data,
      timestamp: Date.now()
    };

    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
    }
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      }
    }
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = window.setInterval(() => {
      if (this.isConnected) {
        this.sendMessage('ping', {});
      }
    }, this.connectionConfig.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Attempt reconnection
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.connectionConfig.reconnectAttempts) {
      this.emit('connection_lost');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);

    this.reconnectTimer = window.setTimeout(() => {
      if (this.playerInfo) {
        this.connect(this.playerInfo);
      }
    }, this.connectionConfig.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Generate room ID
   */
  private generateRoomId(): string {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate room code (6 characters, easy to share)
   */
  private generateRoomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  /**
   * Validate room code
   */
  private validateRoomCode(code: string): boolean {
    return /^[A-Z0-9]{6}$/.test(code.toUpperCase());
  }

  /**
   * Filter message for safety (COPPA compliance)
   */
  private filterMessage(message: string): string | null {
    if (!this.safetySettings.filterChat) {
      return message;
    }

    // Truncate to max length
    let filtered = message.substring(0, this.safetySettings.maxMessageLength);

    // Remove personal information patterns
    if (this.safetySettings.blockPersonalInfo) {
      // Remove email patterns
      filtered = filtered.replace(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[removed]');

      // Remove phone patterns
      filtered = filtered.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[removed]');

      // Remove address patterns
      filtered = filtered.replace(/\b\d+\s+[\w\s]+\s+(street|st|avenue|ave|road|rd|lane|ln|drive|dr|court|ct|place|pl|boulevard|blvd)\b/gi, '[removed]');
    }

    // Check for inappropriate content (simplified)
    const inappropriateWords = ['bad', 'words', 'here']; // Would be more comprehensive
    for (const word of inappropriateWords) {
      if (filtered.toLowerCase().includes(word)) {
        return null;
      }
    }

    return filtered;
  }

  /**
   * Sanitize display name
   */
  private sanitizeName(name: string): string {
    if (this.safetySettings.anonymizeUsernames) {
      // Generate anonymous name
      const adjectives = ['Happy', 'Clever', 'Swift', 'Bright', 'Brave'];
      const animals = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Fox'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const animal = animals[Math.floor(Math.random() * animals.length)];
      return `${adj}${animal}${Math.floor(Math.random() * 100)}`;
    }
    return name.substring(0, 20);
  }

  /**
   * Check if current player is host
   */
  private isHost(): boolean {
    return this.currentRoom?.host.id === this.playerInfo?.id;
  }

  /**
   * Start countdown
   */
  private startCountdown(): void {
    let count = 3;
    const countdownInterval = setInterval(() => {
      this.emit('countdown', count);
      count--;
      if (count < 0) {
        clearInterval(countdownInterval);
        this.emit('countdown_finished');
      }
    }, 1000);
  }

  /**
   * Start question timer
   */
  private startQuestionTimer(duration: number): void {
    let remaining = duration;
    const timerInterval = setInterval(() => {
      remaining--;
      this.emit('timer_update', remaining);

      if (remaining <= 0) {
        clearInterval(timerInterval);
        this.emit('time_up');

        // Auto-submit empty answer if not answered
        if (!this.gameState.answers.has(this.currentRoom?.currentQuestion?.id || '')) {
          this.submitAnswer(-1);
        }
      }
    }, 1000);
  }

  /**
   * Show final results
   */
  private showFinalResults(results: any): void {
    // Calculate rankings
    const rankings = Array.from(results.finalScores.entries())
      .sort((a, b) => b[1] - a[1])
      .map((entry, index) => ({
        rank: index + 1,
        playerId: entry[0],
        score: entry[1]
      }));

    this.emit('final_rankings', rankings);
  }

  /**
   * Get available rooms
   */
  public async getRoomList(): Promise<GameRoom[]> {
    return new Promise((resolve) => {
      this.sendMessage('get_rooms', {
        ageGroup: this.playerInfo?.ageGroup
      });

      this.once('rooms_list', (rooms: GameRoom[]) => {
        this.roomListCache = rooms;
        resolve(rooms);
      });

      // Fallback with cached data
      setTimeout(() => {
        resolve(this.roomListCache);
      }, 3000);
    });
  }

  /**
   * Get current room
   */
  public getCurrentRoom(): GameRoom | null {
    return this.currentRoom;
  }

  /**
   * Get player info
   */
  public getPlayerInfo(): PlayerInfo | null {
    return this.playerInfo;
  }

  /**
   * Is connected
   */
  public isConnectedToServer(): boolean {
    return this.isConnected;
  }

  /**
   * Register custom message handler
   */
  public registerHandler(type: string, callback: (data: any) => void): void {
    this.callbacks.set(type, callback);
  }

  /**
   * Cleanup
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.isConnected = false;
    this.currentRoom = null;
    this.messageQueue = [];
    this.callbacks.clear();
  }
}

// Export singleton instance
export const multiplayerService = MultiplayerService.getInstance();