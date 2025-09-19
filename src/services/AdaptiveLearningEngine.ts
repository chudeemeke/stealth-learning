import {
  StudentModel,
  Content,
  LearningContext,
  PerformanceRecord,
  ZoneOfProximalDevelopment,
  SkillLevel,
  AdaptiveResponse,
  ContentType,
} from '@/types';

/**
 * Adaptive Learning Engine
 * Implements the Elo-rating based adaptive algorithm for personalized learning
 */
export class AdaptiveLearningEngine {
  private readonly K_FACTOR = 32; // Elo K-factor for sensitivity
  private readonly ZPD_RANGE = 0.3; // ±30% of current ability for Zone of Proximal Development
  private readonly MIN_CONFIDENCE = 0.3;
  private readonly MAX_CONFIDENCE = 0.95;
  private readonly MASTERY_THRESHOLD = 0.85;
  
  /**
   * Calculate the next content recommendation for a student
   */
  calculateNextContent(
    student: StudentModel,
    availableContent: Content[],
    context: LearningContext
  ): AdaptiveResponse {
    // Calculate student's current composite ability
    const currentAbility = this.calculateCompositeAbility(student, context.subject);
    
    // Get student's ZPD
    const zpd = this.calculateZPD(student, currentAbility);
    
    // Filter content within ZPD
    const zpdContent = availableContent.filter(content =>
      this.isWithinZPD(content.difficulty, zpd) &&
      this.meetsPrerequisites(content, student) &&
      this.matchesAgeGroup(content, student.ageGroup)
    );
    
    // Apply learning style preferences
    const styledContent = this.applyLearningStylePreferences(
      zpdContent,
      student.learningStyle
    );
    
    // Score and rank content
    const scoredContent = this.scoreContent(
      styledContent,
      student,
      context
    );
    
    // Select optimal content
    const selectedContent = scoredContent[0];
    
    // Calculate success probability
    const successProbability = this.calculateSuccessProbability(
      currentAbility,
      selectedContent.difficulty
    );
    
    // Generate reasoning
    const reasoning = this.generateReasoning(
      selectedContent,
      student,
      currentAbility,
      successProbability
    );
    
    return {
      recommendedContent: selectedContent,
      difficulty: selectedContent.difficulty,
      estimatedSuccessProbability: successProbability,
      reasoning,
      alternativeOptions: scoredContent.slice(1, 4), // Top 3 alternatives
    };
  }
  
  /**
   * Update student model based on performance
   */
  updateStudentModel(
    student: StudentModel,
    performance: PerformanceRecord
  ): StudentModel {
    const { skill, correct, responseTime, hintsUsed, contentDifficulty } = performance;
    
    // Calculate performance score (0-1)
    const performanceScore = this.calculatePerformanceScore(
      correct,
      responseTime,
      hintsUsed
    );
    
    // Get current skill level
    const currentSkillLevel = student.skillLevels.get(skill);
    if (!currentSkillLevel) {
      // Initialize skill if not present
      student.skillLevels.set(skill, {
        skill,
        subject: performance.subject,
        currentRating: 1200,
        confidence: 0.5,
        lastAssessed: new Date(),
        masteryLevel: 'novice',
        totalAttempts: 1,
        successfulAttempts: correct ? 1 : 0,
      });
      return student;
    }
    
    // Update Elo rating
    const newRating = this.updateEloRating(
      currentSkillLevel.currentRating,
      contentDifficulty,
      performanceScore
    );
    
    // Update confidence
    const newConfidence = this.updateConfidence(
      currentSkillLevel.confidence,
      performanceScore,
      responseTime
    );
    
    // Update skill level
    const updatedSkillLevel: SkillLevel = {
      ...currentSkillLevel,
      currentRating: newRating,
      confidence: newConfidence,
      lastAssessed: new Date(),
      masteryLevel: this.calculateMasteryLevel(newRating, newConfidence),
      totalAttempts: currentSkillLevel.totalAttempts + 1,
      successfulAttempts: currentSkillLevel.successfulAttempts + (correct ? 1 : 0),
    };
    
    // Update student model
    student.skillLevels.set(skill, updatedSkillLevel);
    
    // Update performance history
    student.performanceHistory.push(performance);
    
    // Keep only last 100 performance records
    if (student.performanceHistory.length > 100) {
      student.performanceHistory = student.performanceHistory.slice(-100);
    }
    
    // Recalculate ZPD
    student.currentZPD = this.recalculateZPD(student);
    
    // Update learning style if patterns emerge
    this.updateLearningStyle(student, performance);
    
    student.updatedAt = new Date();
    
    return student;
  }
  
  /**
   * Private helper methods
   */
  
  private calculateCompositeAbility(student: StudentModel, subject?: string): number {
    let totalRating = 0;
    let totalWeight = 0;
    
    student.skillLevels.forEach((skillLevel, skill) => {
      // Filter by subject if provided
      if (subject && skillLevel.subject !== subject) return;
      
      // Weight by confidence and recency
      const recencyWeight = this.calculateRecencyWeight(skillLevel.lastAssessed);
      const weight = skillLevel.confidence * recencyWeight;
      
      totalRating += skillLevel.currentRating * weight;
      totalWeight += weight;
    });
    
    // Return default rating if no skills found
    return totalWeight > 0 ? totalRating / totalWeight : 1200;
  }
  
  private calculateZPD(student: StudentModel, currentAbility: number): ZoneOfProximalDevelopment {
    const lowerBound = currentAbility * (1 - this.ZPD_RANGE);
    const upperBound = currentAbility * (1 + this.ZPD_RANGE);
    const optimalDifficulty = currentAbility * 1.1; // Slightly above current ability
    
    // Get recommended skills based on performance
    const recommendedSkills = this.getRecommendedSkills(student);
    
    return {
      lowerBound,
      upperBound,
      optimalDifficulty,
      recommendedSkills,
    };
  }
  
  private recalculateZPD(student: StudentModel): ZoneOfProximalDevelopment {
    const currentAbility = this.calculateCompositeAbility(student);
    return this.calculateZPD(student, currentAbility);
  }
  
  private isWithinZPD(contentDifficulty: number, zpd: ZoneOfProximalDevelopment): boolean {
    return contentDifficulty >= zpd.lowerBound && contentDifficulty <= zpd.upperBound;
  }
  
  private meetsPrerequisites(content: Content, student: StudentModel): boolean {
    if (!content.prerequisites || content.prerequisites.length === 0) {
      return true;
    }
    
    // Check if student has mastered all prerequisites
    return content.prerequisites.every(prereq => {
      const skillLevel = student.skillLevels.get(prereq);
      return skillLevel && skillLevel.masteryLevel !== 'novice';
    });
  }
  
  private matchesAgeGroup(content: Content, ageGroup: string): boolean {
    return !content.ageGroup || content.ageGroup === ageGroup;
  }
  
  private applyLearningStylePreferences(
    content: Content[],
    learningStyle: string
  ): Content[] {
    // Sort content based on learning style preferences
    return content.sort((a, b) => {
      const aScore = this.getLearningStyleScore(a, learningStyle);
      const bScore = this.getLearningStyleScore(b, learningStyle);
      return bScore - aScore;
    });
  }
  
  private getLearningStyleScore(content: Content, learningStyle: string): number {
    let score = 0;
    
    switch (learningStyle) {
      case 'visual':
        if (content.type === 'game' || content.metadata?.visualElements) score += 2;
        break;
      case 'auditory':
        if (content.metadata?.hasAudio || content.metadata?.hasNarration) score += 2;
        break;
      case 'kinesthetic':
        if (content.type === 'game' || content.metadata?.interactive) score += 2;
        break;
      case 'mixed':
        score += 1; // All content types are suitable
        break;
    }
    
    return score;
  }
  
  private scoreContent(
    content: Content[],
    student: StudentModel,
    context: LearningContext
  ): Content[] {
    return content
      .map(item => ({
        content: item,
        score: this.calculateContentScore(item, student, context),
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.content);
  }
  
  private calculateContentScore(
    content: Content,
    student: StudentModel,
    context: LearningContext
  ): number {
    let score = 0;
    
    // Difficulty match (highest weight)
    const difficultyMatch = 1 - Math.abs(
      content.difficulty - student.currentZPD.optimalDifficulty
    ) / student.currentZPD.optimalDifficulty;
    score += difficultyMatch * 40;
    
    // Subject relevance
    if (content.subject === context.subject) score += 20;
    
    // Recency penalty (avoid repeating recent content)
    const wasRecentlyPlayed = context.recentPerformance.some(
      perf => perf.id === content.id
    );
    if (wasRecentlyPlayed) score -= 30;
    
    // Learning objective alignment
    const objectiveAlignment = this.calculateObjectiveAlignment(
      content,
      student.currentZPD.recommendedSkills
    );
    score += objectiveAlignment * 20;
    
    // Time of day optimization
    const timeScore = this.getTimeOfDayScore(content, context.timeOfDay);
    score += timeScore * 10;
    
    // Engagement prediction
    const engagementScore = this.predictEngagement(content, student);
    score += engagementScore * 10;
    
    return Math.max(0, score);
  }
  
  private calculateObjectiveAlignment(content: Content, recommendedSkills: string[]): number {
    if (!content.learningObjectives || recommendedSkills.length === 0) return 0;
    
    const matchingObjectives = content.learningObjectives.filter(obj =>
      recommendedSkills.some(skill => obj.skill === skill)
    ).length;
    
    return matchingObjectives / Math.max(content.learningObjectives.length, recommendedSkills.length);
  }
  
  private getTimeOfDayScore(content: Content, timeOfDay: string): number {
    // Morning: prefer cognitive challenges
    // Afternoon: balanced content
    // Evening: lighter, more engaging content
    
    const hour = parseInt(timeOfDay.split(':')[0]);
    
    if (hour < 12) {
      // Morning
      return content.type === 'quiz' || content.type === 'challenge' ? 1 : 0.5;
    } else if (hour < 17) {
      // Afternoon
      return 0.8; // All content types suitable
    } else {
      // Evening
      return content.type === 'game' || content.type === 'story' ? 1 : 0.5;
    }
  }
  
  private predictEngagement(content: Content, student: StudentModel): number {
    // Simple engagement prediction based on content metadata
    let engagement = 0.5;
    
    // Age-appropriate content is more engaging
    if (content.ageGroup === student.ageGroup) engagement += 0.2;
    
    // New content types are more engaging
    const recentTypes = student.performanceHistory
      .slice(-10)
      .map(p => p.contentType)
      .filter(Boolean);
    
    if (!recentTypes.includes(content.type)) engagement += 0.2;
    
    // Shorter content for younger children
    if (student.ageGroup === '3-5' && content.estimatedDuration <= 5) {
      engagement += 0.1;
    }
    
    return Math.min(1, engagement);
  }
  
  private updateEloRating(
    currentRating: number,
    contentDifficulty: number,
    performance: number
  ): number {
    const expected = 1 / (1 + Math.pow(10, (contentDifficulty - currentRating) / 400));
    return currentRating + this.K_FACTOR * (performance - expected);
  }
  
  private calculatePerformanceScore(
    correct: boolean,
    responseTime: number,
    hintsUsed: number
  ): number {
    let score = correct ? 1 : 0;
    
    // Adjust for hints used
    score *= Math.pow(0.9, hintsUsed); // 10% penalty per hint
    
    // Adjust for response time (bonus for quick correct answers)
    if (correct && responseTime < 5000) {
      score *= 1.1; // 10% bonus for quick response
    } else if (responseTime > 30000) {
      score *= 0.9; // 10% penalty for very slow response
    }
    
    return Math.min(1, Math.max(0, score));
  }
  
  private updateConfidence(
    currentConfidence: number,
    performanceScore: number,
    responseTime: number
  ): number {
    // Confidence increases with good performance, decreases with poor performance
    const confidenceChange = (performanceScore - 0.5) * 0.1;
    
    // Quick responses indicate higher confidence
    const timeBonus = responseTime < 5000 ? 0.05 : 0;
    
    const newConfidence = currentConfidence + confidenceChange + timeBonus;
    
    return Math.max(this.MIN_CONFIDENCE, Math.min(this.MAX_CONFIDENCE, newConfidence));
  }
  
  private calculateMasteryLevel(rating: number, confidence: number): string {
    if (rating >= 1600 && confidence >= 0.8) return 'advanced';
    if (rating >= 1400 && confidence >= 0.6) return 'proficient';
    if (rating >= 1200 && confidence >= 0.4) return 'developing';
    return 'novice';
  }
  
  private calculateRecencyWeight(lastAssessed: Date): number {
    const daysSince = (Date.now() - lastAssessed.getTime()) / (1000 * 60 * 60 * 24);
    // Exponential decay: weight = e^(-days/30)
    return Math.exp(-daysSince / 30);
  }
  
  private getRecommendedSkills(student: StudentModel): string[] {
    const recommendations: string[] = [];
    
    // Find skills that are developing but not mastered
    student.skillLevels.forEach((level, skill) => {
      if (level.masteryLevel === 'developing' || 
          (level.masteryLevel === 'novice' && level.confidence > 0.4)) {
        recommendations.push(skill);
      }
    });
    
    // Sort by potential for improvement
    return recommendations.sort((a, b) => {
      const aLevel = student.skillLevels.get(a)!;
      const bLevel = student.skillLevels.get(b)!;
      return bLevel.confidence - aLevel.confidence;
    });
  }
  
  private calculateSuccessProbability(
    studentAbility: number,
    contentDifficulty: number
  ): number {
    // Elo-based probability calculation
    return 1 / (1 + Math.pow(10, (contentDifficulty - studentAbility) / 400));
  }
  
  private generateReasoning(
    content: Content,
    student: StudentModel,
    currentAbility: number,
    successProbability: number
  ): string {
    const reasons = [];
    
    // Difficulty match
    if (Math.abs(content.difficulty - currentAbility) < 100) {
      reasons.push('perfectly matched to current skill level');
    } else if (content.difficulty > currentAbility) {
      reasons.push('provides appropriate challenge');
    } else {
      reasons.push('reinforces foundational skills');
    }
    
    // Success probability
    if (successProbability > 0.7) {
      reasons.push('high likelihood of success');
    } else if (successProbability > 0.5) {
      reasons.push('balanced difficulty');
    } else {
      reasons.push('challenging but achievable');
    }
    
    // Learning objectives
    const targetSkills = content.learningObjectives
      ?.map(obj => obj.skill)
      .filter(skill => student.currentZPD.recommendedSkills.includes(skill));
    
    if (targetSkills && targetSkills.length > 0) {
      reasons.push(`targets recommended skills: ${targetSkills.join(', ')}`);
    }
    
    // Age appropriateness
    if (content.ageGroup === student.ageGroup) {
      reasons.push('age-appropriate content');
    }
    
    return `Selected because it ${reasons.join(', ')}.`;
  }
  
  private updateLearningStyle(student: StudentModel, performance: PerformanceRecord): void {
    // This is a simplified implementation
    // In production, you'd use more sophisticated pattern recognition
    
    // Track successful content types
    if (performance.correct && performance.contentType) {
      // Update learning style based on successful interactions
      // This would involve more complex analysis in production
    }
  }
}

// Export singleton instance
export const adaptiveLearningEngine = new AdaptiveLearningEngine();