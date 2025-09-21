import {
  PerformanceRecord,
  ReviewSession,
  SpacedRepetitionCard,
  ReviewResult,
  ContentType,
} from '@/types';

/**
 * Spaced Repetition Engine
 * Implements SM-2 algorithm with educational adaptations for children
 */
export class SpacedRepetitionEngine {
  private readonly MINIMUM_INTERVAL = 1; // 1 day
  private readonly MAXIMUM_INTERVAL = 180; // 6 months
  private readonly DEFAULT_EASE_FACTOR = 2.5;
  private readonly MIN_EASE_FACTOR = 1.3;
  private readonly MAX_EASE_FACTOR = 4.0;

  // Age-specific adjustments
  private readonly AGE_MULTIPLIERS = {
    '3-5': 0.7, // Shorter intervals for younger children
    '6-8': 0.85,
    '9+': 1.0,
  };

  /**
   * Calculate when a card should be reviewed next based on performance
   */
  calculateNextReview(
    card: SpacedRepetitionCard,
    performance: ReviewResult,
    ageGroup: '3-5' | '6-8' | '9+'
  ): SpacedRepetitionCard {
    const ageMultiplier = this.AGE_MULTIPLIERS[ageGroup];

    // Clone the card to avoid mutations
    const updatedCard: SpacedRepetitionCard = {
      ...card,
      lastReviewed: new Date(),
      reviewCount: card.reviewCount + 1,
    };

    // Calculate quality score (0-5 based on SM-2)
    const quality = this.calculateQuality(performance);

    // Update ease factor based on performance
    updatedCard.easeFactor = this.updateEaseFactor(card.easeFactor, quality);

    // Calculate new interval
    updatedCard.interval = this.calculateNewInterval(
      card.interval,
      card.reviewCount,
      quality,
      updatedCard.easeFactor,
      ageMultiplier
    );

    // Set next review date
    updatedCard.nextReview = new Date(
      Date.now() + updatedCard.interval * 24 * 60 * 60 * 1000
    );

    // Update success streak
    if (quality >= 3) {
      updatedCard.successStreak = (card.successStreak || 0) + 1;
      updatedCard.totalCorrect = (card.totalCorrect || 0) + 1;
    } else {
      updatedCard.successStreak = 0;
    }

    updatedCard.totalAttempts = (card.totalAttempts || 0) + 1;

    // Calculate retention strength
    updatedCard.retentionStrength = this.calculateRetentionStrength(updatedCard);

    return updatedCard;
  }

  /**
   * Get cards due for review
   */
  getCardsForReview(
    cards: SpacedRepetitionCard[],
    maxCards: number = 20
  ): SpacedRepetitionCard[] {
    const now = new Date();

    return cards
      .filter(card => card.nextReview <= now)
      .sort((a, b) => {
        // Prioritize by urgency (overdue cards first)
        const aOverdue = now.getTime() - a.nextReview.getTime();
        const bOverdue = now.getTime() - b.nextReview.getTime();

        if (aOverdue !== bOverdue) {
          return bOverdue - aOverdue;
        }

        // Then by retention strength (weaker cards first)
        return (a.retentionStrength || 0.5) - (b.retentionStrength || 0.5);
      })
      .slice(0, maxCards);
  }

  /**
   * Schedule new content for spaced repetition
   */
  scheduleNewCard(
    contentId: string,
    contentType: ContentType,
    subject: string,
    difficulty: number,
    ageGroup: '3-5' | '6-8' | '9+'
  ): SpacedRepetitionCard {
    const ageMultiplier = this.AGE_MULTIPLIERS[ageGroup];
    const initialInterval = Math.max(1, Math.round(1 * ageMultiplier));

    return {
      id: `${contentId}_sr_${Date.now()}`,
      contentId,
      contentType,
      subject: subject as 'mathematics' | 'english' | 'science',
      difficulty,
      interval: initialInterval,
      easeFactor: this.DEFAULT_EASE_FACTOR,
      reviewCount: 0,
      nextReview: new Date(Date.now() + initialInterval * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastReviewed: new Date(),
      successStreak: 0,
      totalAttempts: 0,
      totalCorrect: 0,
      retentionStrength: 0.5,
    };
  }

  /**
   * Analyze spaced repetition performance
   */
  analyzePerformance(cards: SpacedRepetitionCard[]): {
    retention: number;
    averageInterval: number;
    masteredCards: number;
    strugglingCards: SpacedRepetitionCard[];
    streakDistribution: Record<string, number>;
  } {
    if (cards.length === 0) {
      return {
        retention: 0,
        averageInterval: 0,
        masteredCards: 0,
        strugglingCards: [],
        streakDistribution: {},
      };
    }

    const totalCorrect = cards.reduce((sum, card) => sum + (card.totalCorrect || 0), 0);
    const totalAttempts = cards.reduce((sum, card) => sum + (card.totalAttempts || 0), 0);
    const retention = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

    const averageInterval = cards.reduce((sum, card) => sum + card.interval, 0) / cards.length;

    const masteredCards = cards.filter(card =>
      card.interval >= 30 &&
      (card.successStreak || 0) >= 5 &&
      (card.retentionStrength || 0) >= 0.8
    ).length;

    const strugglingCards = cards.filter(card =>
      (card.successStreak || 0) < 2 &&
      card.reviewCount >= 3 &&
      (card.retentionStrength || 0) < 0.4
    );

    const streakDistribution: Record<string, number> = {};
    cards.forEach(card => {
      const streak = card.successStreak || 0;
      const key = streak >= 10 ? '10+' : streak.toString();
      streakDistribution[key] = (streakDistribution[key] || 0) + 1;
    });

    return {
      retention,
      averageInterval,
      masteredCards,
      strugglingCards,
      streakDistribution,
    };
  }

  /**
   * Generate review session with optimal card selection
   */
  generateReviewSession(
    availableCards: SpacedRepetitionCard[],
    targetDuration: number = 15, // minutes
    ageGroup: '3-5' | '6-8' | '9+'
  ): ReviewSession {
    const cardsPerMinute = {
      '3-5': 2, // Slower pace for younger children
      '6-8': 3,
      '9+': 4,
    };

    const maxCards = Math.min(
      targetDuration * cardsPerMinute[ageGroup],
      availableCards.length
    );

    const dueCards = this.getCardsForReview(availableCards, maxCards);

    // Balance the session with different difficulty levels
    const balancedCards = this.balanceSessionDifficulty(dueCards, ageGroup);

    return {
      id: `session_${Date.now()}`,
      cards: balancedCards,
      estimatedDuration: Math.ceil(balancedCards.length / cardsPerMinute[ageGroup]),
      createdAt: new Date(),
      ageGroup,
      targetRetention: this.getTargetRetention(ageGroup),
    };
  }

  /**
   * Private helper methods
   */

  private calculateQuality(performance: ReviewResult): number {
    let quality = 3; // Default (correct with effort)

    if (!performance.correct) {
      quality = performance.hintsUsed > 2 ? 0 : 1;
    } else {
      // Correct answer - adjust based on confidence and speed
      if (performance.responseTime < 3000 && performance.hintsUsed === 0) {
        quality = 5; // Perfect
      } else if (performance.responseTime < 8000 && performance.hintsUsed <= 1) {
        quality = 4; // Good
      } else if (performance.hintsUsed <= 2) {
        quality = 3; // Correct with effort
      } else {
        quality = 2; // Difficult but correct
      }
    }

    return Math.max(0, Math.min(5, quality));
  }

  private updateEaseFactor(currentEase: number, quality: number): number {
    // SM-2 algorithm ease factor adjustment
    const newEase = currentEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    return Math.max(this.MIN_EASE_FACTOR, Math.min(this.MAX_EASE_FACTOR, newEase));
  }

  private calculateNewInterval(
    currentInterval: number,
    reviewCount: number,
    quality: number,
    easeFactor: number,
    ageMultiplier: number
  ): number {
    let newInterval: number;

    if (quality < 3) {
      // Failed - restart interval but reduce it
      newInterval = Math.max(1, Math.round(currentInterval * 0.5 * ageMultiplier));
    } else if (reviewCount === 1) {
      newInterval = Math.round(1 * ageMultiplier);
    } else if (reviewCount === 2) {
      newInterval = Math.round(6 * ageMultiplier);
    } else {
      // Standard SM-2 calculation
      newInterval = Math.round(currentInterval * easeFactor * ageMultiplier);
    }

    // Apply bounds
    return Math.max(this.MINIMUM_INTERVAL, Math.min(this.MAXIMUM_INTERVAL, newInterval));
  }

  private calculateRetentionStrength(card: SpacedRepetitionCard): number {
    const successRate = card.totalAttempts > 0 ?
      (card.totalCorrect || 0) / card.totalAttempts : 0.5;

    const streakBonus = Math.min(0.3, (card.successStreak || 0) * 0.05);
    const recencyPenalty = this.calculateRecencyPenalty(card.lastReviewed);

    return Math.max(0, Math.min(1, successRate + streakBonus - recencyPenalty));
  }

  private calculateRecencyPenalty(lastReviewed: Date): number {
    const daysSince = (Date.now() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24);
    // Gradual forgetting curve
    return Math.min(0.3, daysSince * 0.01);
  }

  private balanceSessionDifficulty(
    cards: SpacedRepetitionCard[],
    ageGroup: '3-5' | '6-8' | '9+'
  ): SpacedRepetitionCard[] {
    // Sort by difficulty and retention strength
    const easy = cards.filter(c => (c.retentionStrength || 0.5) > 0.7);
    const medium = cards.filter(c => {
      const strength = c.retentionStrength || 0.5;
      return strength >= 0.4 && strength <= 0.7;
    });
    const hard = cards.filter(c => (c.retentionStrength || 0.5) < 0.4);

    // Age-appropriate difficulty distribution
    const distributions = {
      '3-5': { easy: 0.6, medium: 0.3, hard: 0.1 },
      '6-8': { easy: 0.5, medium: 0.4, hard: 0.1 },
      '9+': { easy: 0.4, medium: 0.4, hard: 0.2 },
    };

    const dist = distributions[ageGroup];
    const totalCards = cards.length;

    const targetEasy = Math.round(totalCards * dist.easy);
    const targetMedium = Math.round(totalCards * dist.medium);
    const targetHard = Math.round(totalCards * dist.hard);

    const selectedCards = [
      ...easy.slice(0, targetEasy),
      ...medium.slice(0, targetMedium),
      ...hard.slice(0, targetHard),
    ];

    // Fill remaining slots if needed
    const remaining = totalCards - selectedCards.length;
    if (remaining > 0) {
      const unusedCards = cards.filter(c => !selectedCards.includes(c));
      selectedCards.push(...unusedCards.slice(0, remaining));
    }

    // Shuffle for better user experience
    return this.shuffleArray(selectedCards);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private getTargetRetention(ageGroup: '3-5' | '6-8' | '9+'): number {
    // Age-appropriate retention targets
    const targets = {
      '3-5': 0.75, // 75% retention
      '6-8': 0.80, // 80% retention
      '9+': 0.85,  // 85% retention
    };
    return targets[ageGroup];
  }
}

// Export singleton instance
export const spacedRepetitionEngine = new SpacedRepetitionEngine();