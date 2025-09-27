/**
 * AAA+ Friend System Service
 * COPPA-compliant social features with parental controls
 * Safe friend connections using unique codes
 */

import { EventEmitter } from 'events';
import { achievementService } from '../gamification/AchievementService';

export interface Friend {
  id: string;
  friendCode: string;
  displayName: string;
  avatar: string;
  status: 'online' | 'playing' | 'away' | 'offline';
  level: number;
  xp: number;
  favoriteSubject?: string;
  lastSeen: Date;
  friendSince: Date;
  sharedGames: number;
  relationship: 'friend' | 'study_buddy' | 'classmate' | 'family';
  isBlocked?: boolean;
  isFavorite?: boolean;
}

export interface FriendRequest {
  id: string;
  fromCode: string;
  fromName: string;
  fromAvatar: string;
  toCode: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  parentApproved: boolean;
  message?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  subject?: string;
  members: GroupMember[];
  maxMembers: number;
  owner: string;
  moderators: string[];
  settings: GroupSettings;
  schedule?: StudySchedule[];
  achievements: string[];
  createdAt: Date;
  isActive: boolean;
  ageGroup: '3-5' | '6-8' | '9+';
}

interface GroupMember {
  friendCode: string;
  displayName: string;
  avatar: string;
  role: 'owner' | 'moderator' | 'member';
  joinedAt: Date;
  contribution: number;
  studyStreak: number;
}

interface GroupSettings {
  isPrivate: boolean;
  requireApproval: boolean;
  parentalControlRequired: boolean;
  allowVoiceChat: boolean;
  allowSharing: boolean;
  studyGoals?: string[];
  weeklyTarget?: number;
}

interface StudySchedule {
  dayOfWeek: number;
  startTime: string;
  duration: number;
  subject?: string;
  recurring: boolean;
}

interface FriendActivity {
  friendCode: string;
  type: 'game_played' | 'achievement_earned' | 'level_up' | 'high_score';
  subject?: string;
  details: string;
  timestamp: Date;
}

export class FriendSystemService extends EventEmitter {
  private static instance: FriendSystemService;
  private friends: Map<string, Friend> = new Map();
  private friendRequests: Map<string, FriendRequest> = new Map();
  private studyGroups: Map<string, StudyGroup> = new Map();
  private blockedUsers: Set<string> = new Set();
  private myFriendCode: string | null = null;
  private activities: FriendActivity[] = [];
  private callbacks: Set<(event: any) => void> = new Set();

  // Safety settings (COPPA compliance)
  private safetySettings = {
    maxFriends: 50,
    maxGroups: 10,
    requireParentalApproval: true,
    autoExpireRequests: true,
    requestExpiryDays: 7,
    minAge: 3,
    maxMessageLength: 100,
    allowCustomMessages: false,
    anonymizeFriendCodes: true,
    blockPersonalInfo: true
  };

  // Friend code generation settings
  private readonly CODE_LENGTH = 8;
  private readonly CODE_PATTERN = 'XXXX-XXXX'; // Format: ABCD-1234

  private constructor() {
    super();
    this.loadFriends();
    this.generateMyFriendCode();
    this.startActivityMonitor();
  }

  public static getInstance(): FriendSystemService {
    if (!FriendSystemService.instance) {
      FriendSystemService.instance = new FriendSystemService();
    }
    return FriendSystemService.instance;
  }

  /**
   * Generate unique friend code for current user
   */
  private generateMyFriendCode(): void {
    // Check if already exists
    const stored = localStorage.getItem('my_friend_code');
    if (stored) {
      this.myFriendCode = stored;
      return;
    }

    // Generate new code
    this.myFriendCode = this.generateFriendCode();
    localStorage.setItem('my_friend_code', this.myFriendCode);

    console.log(`🎫 Your friend code: ${this.myFriendCode}`);
  }

  /**
   * Generate unique friend code
   */
  private generateFriendCode(): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // No I or O to avoid confusion
    const numbers = '0123456789';

    let code = '';

    // First part: 4 letters
    for (let i = 0; i < 4; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    code += '-';

    // Second part: 4 numbers
    for (let i = 0; i < 4; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return code;
  }

  /**
   * Get my friend code
   */
  public getMyFriendCode(): string {
    return this.myFriendCode || this.generateFriendCode();
  }

  /**
   * Send friend request using friend code
   */
  public async sendFriendRequest(
    friendCode: string,
    message?: string
  ): Promise<FriendRequest> {
    // Validate friend code format
    if (!this.validateFriendCode(friendCode)) {
      throw new Error('Invalid friend code format');
    }

    // Check if already friends
    if (this.isFriend(friendCode)) {
      throw new Error('Already friends with this user');
    }

    // Check friend limit
    if (this.friends.size >= this.safetySettings.maxFriends) {
      throw new Error(`Maximum friend limit (${this.safetySettings.maxFriends}) reached`);
    }

    // Check for existing request
    const existing = Array.from(this.friendRequests.values()).find(
      req => req.toCode === friendCode && req.status === 'pending'
    );
    if (existing) {
      throw new Error('Friend request already sent');
    }

    // Create request
    const request: FriendRequest = {
      id: this.generateRequestId(),
      fromCode: this.myFriendCode!,
      fromName: this.generateSafeName(),
      fromAvatar: this.getCurrentUserAvatar(),
      toCode: friendCode,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.safetySettings.requestExpiryDays * 24 * 60 * 60 * 1000),
      parentApproved: !this.safetySettings.requireParentalApproval,
      message: this.sanitizeMessage(message)
    };

    // Store request
    this.friendRequests.set(request.id, request);

    // Save to storage
    this.saveFriendRequests();

    // Emit event
    this.emit('friend_request_sent', request);

    // Simulate server notification (in production, this would be server-side)
    this.simulateServerNotification('friend_request', request);

    return request;
  }

  /**
   * Accept friend request
   */
  public async acceptFriendRequest(
    requestId: string,
    parentalPin?: string
  ): Promise<Friend> {
    const request = this.friendRequests.get(requestId);
    if (!request) {
      throw new Error('Friend request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Friend request already processed');
    }

    // Check parental approval
    if (this.safetySettings.requireParentalApproval && !request.parentApproved) {
      if (!this.verifyParentalPin(parentalPin)) {
        throw new Error('Parental approval required');
      }
      request.parentApproved = true;
    }

    // Create friend entry
    const friend: Friend = {
      id: this.generateFriendId(),
      friendCode: request.fromCode,
      displayName: request.fromName,
      avatar: request.fromAvatar,
      status: 'offline',
      level: 1,
      xp: 0,
      lastSeen: new Date(),
      friendSince: new Date(),
      sharedGames: 0,
      relationship: 'friend'
    };

    // Update request status
    request.status = 'accepted';

    // Add friend
    this.friends.set(friend.friendCode, friend);

    // Save
    this.saveFriends();
    this.saveFriendRequests();

    // Track achievement
    achievementService.trackProgress({
      type: 'friend_added'
    });

    // Emit event
    this.emit('friend_added', friend);

    // Notify other user (simulated)
    this.simulateServerNotification('friend_request_accepted', {
      fromCode: this.myFriendCode,
      toCode: request.fromCode
    });

    return friend;
  }

  /**
   * Reject friend request
   */
  public rejectFriendRequest(requestId: string): void {
    const request = this.friendRequests.get(requestId);
    if (!request) return;

    request.status = 'rejected';
    this.saveFriendRequests();

    this.emit('friend_request_rejected', request);
  }

  /**
   * Remove friend
   */
  public removeFriend(friendCode: string): void {
    const friend = this.friends.get(friendCode);
    if (!friend) return;

    this.friends.delete(friendCode);
    this.saveFriends();

    this.emit('friend_removed', friend);
  }

  /**
   * Block user
   */
  public blockUser(friendCode: string): void {
    this.blockedUsers.add(friendCode);

    // Remove from friends if exists
    if (this.friends.has(friendCode)) {
      this.removeFriend(friendCode);
    }

    // Reject any pending requests
    Array.from(this.friendRequests.values())
      .filter(req => req.fromCode === friendCode && req.status === 'pending')
      .forEach(req => {
        req.status = 'rejected';
      });

    this.saveBlockedUsers();
    this.emit('user_blocked', friendCode);
  }

  /**
   * Unblock user
   */
  public unblockUser(friendCode: string): void {
    this.blockedUsers.delete(friendCode);
    this.saveBlockedUsers();
    this.emit('user_unblocked', friendCode);
  }

  /**
   * Create study group
   */
  public async createStudyGroup(
    name: string,
    settings: Partial<GroupSettings> = {}
  ): Promise<StudyGroup> {
    // Check group limit
    const myGroups = Array.from(this.studyGroups.values()).filter(
      g => g.owner === this.myFriendCode
    );
    if (myGroups.length >= this.safetySettings.maxGroups) {
      throw new Error(`Maximum group limit (${this.safetySettings.maxGroups}) reached`);
    }

    // Create group
    const group: StudyGroup = {
      id: this.generateGroupId(),
      name: this.sanitizeName(name),
      code: this.generateGroupCode(),
      description: '',
      members: [{
        friendCode: this.myFriendCode!,
        displayName: this.generateSafeName(),
        avatar: this.getCurrentUserAvatar(),
        role: 'owner',
        joinedAt: new Date(),
        contribution: 0,
        studyStreak: 0
      }],
      maxMembers: 10,
      owner: this.myFriendCode!,
      moderators: [],
      settings: {
        isPrivate: false,
        requireApproval: true,
        parentalControlRequired: true,
        allowVoiceChat: false,
        allowSharing: false,
        ...settings
      },
      achievements: [],
      createdAt: new Date(),
      isActive: true,
      ageGroup: this.getCurrentAgeGroup()
    };

    // Store group
    this.studyGroups.set(group.id, group);
    this.saveStudyGroups();

    // Emit event
    this.emit('study_group_created', group);

    return group;
  }

  /**
   * Join study group
   */
  public async joinStudyGroup(
    groupCode: string,
    parentalPin?: string
  ): Promise<StudyGroup> {
    // Find group by code
    const group = Array.from(this.studyGroups.values()).find(
      g => g.code === groupCode
    );

    if (!group) {
      throw new Error('Study group not found');
    }

    if (!group.isActive) {
      throw new Error('Study group is not active');
    }

    // Check if already member
    if (group.members.some(m => m.friendCode === this.myFriendCode)) {
      throw new Error('Already a member of this group');
    }

    // Check member limit
    if (group.members.length >= group.maxMembers) {
      throw new Error('Study group is full');
    }

    // Check parental approval
    if (group.settings.parentalControlRequired) {
      if (!this.verifyParentalPin(parentalPin)) {
        throw new Error('Parental approval required');
      }
    }

    // Add member
    group.members.push({
      friendCode: this.myFriendCode!,
      displayName: this.generateSafeName(),
      avatar: this.getCurrentUserAvatar(),
      role: 'member',
      joinedAt: new Date(),
      contribution: 0,
      studyStreak: 0
    });

    // Save
    this.saveStudyGroups();

    // Emit event
    this.emit('study_group_joined', group);

    return group;
  }

  /**
   * Leave study group
   */
  public leaveStudyGroup(groupId: string): void {
    const group = this.studyGroups.get(groupId);
    if (!group) return;

    // Remove member
    group.members = group.members.filter(
      m => m.friendCode !== this.myFriendCode
    );

    // If owner left, assign new owner
    if (group.owner === this.myFriendCode && group.members.length > 0) {
      const newOwner = group.members[0];
      newOwner.role = 'owner';
      group.owner = newOwner.friendCode;
    }

    // If no members, deactivate group
    if (group.members.length === 0) {
      group.isActive = false;
    }

    // Save
    this.saveStudyGroups();

    // Emit event
    this.emit('study_group_left', group);
  }

  /**
   * Get friends list
   */
  public getFriends(): Friend[] {
    return Array.from(this.friends.values());
  }

  /**
   * Get online friends
   */
  public getOnlineFriends(): Friend[] {
    return Array.from(this.friends.values()).filter(
      f => f.status === 'online' || f.status === 'playing'
    );
  }

  /**
   * Get friend requests
   */
  public getFriendRequests(type: 'incoming' | 'outgoing' = 'incoming'): FriendRequest[] {
    return Array.from(this.friendRequests.values()).filter(req => {
      if (type === 'incoming') {
        return req.toCode === this.myFriendCode && req.status === 'pending';
      } else {
        return req.fromCode === this.myFriendCode;
      }
    });
  }

  /**
   * Get study groups
   */
  public getStudyGroups(): StudyGroup[] {
    return Array.from(this.studyGroups.values()).filter(g =>
      g.isActive && g.members.some(m => m.friendCode === this.myFriendCode)
    );
  }

  /**
   * Get friend by code
   */
  public getFriend(friendCode: string): Friend | undefined {
    return this.friends.get(friendCode);
  }

  /**
   * Check if user is friend
   */
  public isFriend(friendCode: string): boolean {
    return this.friends.has(friendCode);
  }

  /**
   * Check if user is blocked
   */
  public isBlocked(friendCode: string): boolean {
    return this.blockedUsers.has(friendCode);
  }

  /**
   * Get friend activities
   */
  public getFriendActivities(limit: number = 20): FriendActivity[] {
    return this.activities.slice(-limit);
  }

  /**
   * Share achievement with friends
   */
  public shareAchievement(achievementId: string, friendCodes?: string[]): void {
    const activity: FriendActivity = {
      friendCode: this.myFriendCode!,
      type: 'achievement_earned',
      details: `Earned achievement: ${achievementId}`,
      timestamp: new Date()
    };

    // Add to activities
    this.addActivity(activity);

    // Notify specific friends or all
    const recipients = friendCodes || Array.from(this.friends.keys());
    recipients.forEach(code => {
      this.notifyFriend(code, activity);
    });

    this.emit('achievement_shared', { achievementId, recipients });
  }

  /**
   * Share high score
   */
  public shareHighScore(
    subject: string,
    score: number,
    friendCodes?: string[]
  ): void {
    const activity: FriendActivity = {
      friendCode: this.myFriendCode!,
      type: 'high_score',
      subject,
      details: `New high score in ${subject}: ${score}`,
      timestamp: new Date()
    };

    this.addActivity(activity);

    const recipients = friendCodes || Array.from(this.friends.keys());
    recipients.forEach(code => {
      this.notifyFriend(code, activity);
    });

    this.emit('high_score_shared', { subject, score, recipients });
  }

  /**
   * Update friend status
   */
  public updateFriendStatus(friendCode: string, status: Friend['status']): void {
    const friend = this.friends.get(friendCode);
    if (!friend) return;

    friend.status = status;
    friend.lastSeen = new Date();

    this.emit('friend_status_changed', { friendCode, status });
  }

  /**
   * Start activity monitor
   */
  private startActivityMonitor(): void {
    // Clean up old activities every hour
    setInterval(() => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      this.activities = this.activities.filter(
        a => a.timestamp.getTime() > oneDayAgo
      );
    }, 60 * 60 * 1000);

    // Check for expired friend requests
    setInterval(() => {
      if (this.safetySettings.autoExpireRequests) {
        const now = Date.now();
        Array.from(this.friendRequests.values()).forEach(req => {
          if (req.status === 'pending' && req.expiresAt.getTime() < now) {
            req.status = 'expired';
          }
        });
        this.saveFriendRequests();
      }
    }, 24 * 60 * 60 * 1000); // Daily
  }

  /**
   * Add activity
   */
  private addActivity(activity: FriendActivity): void {
    this.activities.push(activity);
    if (this.activities.length > 100) {
      this.activities.shift();
    }
  }

  /**
   * Notify friend
   */
  private notifyFriend(friendCode: string, activity: FriendActivity): void {
    // In production, this would send notification through server
    console.log(`📬 Notifying ${friendCode}:`, activity.details);
  }

  /**
   * Validate friend code format
   */
  private validateFriendCode(code: string): boolean {
    return /^[A-Z]{4}-[0-9]{4}$/.test(code);
  }

  /**
   * Generate safe display name
   */
  private generateSafeName(): string {
    const stored = localStorage.getItem('user_display_name');
    if (stored && !this.safetySettings.anonymizeFriendCodes) {
      return this.sanitizeName(stored);
    }

    // Generate anonymous name
    const adjectives = ['Happy', 'Clever', 'Brave', 'Swift', 'Bright'];
    const animals = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Fox'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `${adj}${animal}`;
  }

  /**
   * Sanitize name
   */
  private sanitizeName(name: string): string {
    return name.substring(0, 20).replace(/[^a-zA-Z0-9\s]/g, '');
  }

  /**
   * Sanitize message
   */
  private sanitizeMessage(message?: string): string | undefined {
    if (!message) return undefined;

    if (!this.safetySettings.allowCustomMessages) {
      return undefined; // No custom messages allowed
    }

    // Remove personal information
    let sanitized = message.substring(0, this.safetySettings.maxMessageLength);

    if (this.safetySettings.blockPersonalInfo) {
      // Remove email, phone, address patterns
      sanitized = sanitized.replace(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[removed]');
      sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[removed]');
    }

    return sanitized;
  }

  /**
   * Get current user avatar
   */
  private getCurrentUserAvatar(): string {
    return localStorage.getItem('user_avatar') || '🦊';
  }

  /**
   * Get current age group
   */
  private getCurrentAgeGroup(): '3-5' | '6-8' | '9+' {
    const stored = localStorage.getItem('user_age_group');
    return (stored as any) || '6-8';
  }

  /**
   * Verify parental PIN
   */
  private verifyParentalPin(pin?: string): boolean {
    if (!this.safetySettings.requireParentalApproval) {
      return true;
    }

    const storedPin = localStorage.getItem('parental_pin');
    return pin === storedPin;
  }

  /**
   * Simulate server notification
   */
  private simulateServerNotification(type: string, data: any): void {
    // In production, this would be handled by WebSocket/server
    setTimeout(() => {
      this.emit(`server_${type}`, data);
    }, 1000);
  }

  /**
   * Generate IDs
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFriendId(): string {
    return `friend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateGroupId(): string {
    return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateGroupCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Save/Load methods
   */
  private saveFriends(): void {
    try {
      const data = Array.from(this.friends.entries());
      localStorage.setItem('friends_list', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save friends:', error);
    }
  }

  private loadFriends(): void {
    try {
      const stored = localStorage.getItem('friends_list');
      if (stored) {
        const data = JSON.parse(stored);
        this.friends = new Map(data.map((item: any) => {
          // Convert date strings back to Date objects
          item[1].lastSeen = new Date(item[1].lastSeen);
          item[1].friendSince = new Date(item[1].friendSince);
          return item;
        }));
      }
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  }

  private saveFriendRequests(): void {
    try {
      const data = Array.from(this.friendRequests.entries());
      localStorage.setItem('friend_requests', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save friend requests:', error);
    }
  }

  private saveStudyGroups(): void {
    try {
      const data = Array.from(this.studyGroups.entries());
      localStorage.setItem('study_groups', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save study groups:', error);
    }
  }

  private saveBlockedUsers(): void {
    try {
      const data = Array.from(this.blockedUsers);
      localStorage.setItem('blocked_users', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save blocked users:', error);
    }
  }

  /**
   * Reset all social data (for testing)
   */
  public resetSocialData(): void {
    this.friends.clear();
    this.friendRequests.clear();
    this.studyGroups.clear();
    this.blockedUsers.clear();
    this.activities = [];
    this.saveFriends();
    this.saveFriendRequests();
    this.saveStudyGroups();
    this.saveBlockedUsers();
  }
}

// Export singleton instance
export const friendSystem = FriendSystemService.getInstance();