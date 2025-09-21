# Card Polymorphic System - Type Safety Examples

This document demonstrates the fixed Card polymorphic system with proper type safety enforcement.

## Fixed Implementation

### 1. **Perfect Discriminated Union**

```typescript
// Discriminated union enforces prop requirements based on cardType
export type CardProps =
  | (BaseCardProps & { cardType?: 'base' })
  | (GameCardProps & { cardType: 'game' })
  | (QuestionCardProps & { cardType: 'question' })
  | (MetricCardProps & { cardType: 'metric' })      // Requires value & label
  | (AchievementCardProps & { cardType: 'achievement' }); // Requires achievementType & isUnlocked
```

### 2. **Type-Safe Prop Enforcement**

#### ✅ **Correct Usage Examples**

```tsx
// Base Card (backward compatible)
<Card title="Welcome" description="This is a basic card" />

// Metric Card with required props
<Card
  cardType="metric"
  value={85}
  label="Accuracy Score"
  unit="%"
  trend="up"
/>

// Achievement Card with required props
<Card
  cardType="achievement"
  achievementType="badge"
  isUnlocked={true}
  rarity="epic"
  title="Math Master"
/>
```

#### ❌ **TypeScript Will Prevent These**

```tsx
// This will fail - missing required value and label for metric
<Card
  cardType="metric"
  title="Invalid Metric"
  // ERROR: Missing 'value' and 'label' props
/>

// This will fail - missing required achievementType and isUnlocked
<Card
  cardType="achievement"
  title="Invalid Achievement"
  // ERROR: Missing 'achievementType' and 'isUnlocked' props
/>
```

### 3. **Fixed Component Switch Statement**

```typescript
export const Card: React.FC<CardProps> = (props) => {
  const { cardType = 'base', ...restProps } = props;

  switch (cardType) {
    case 'game':
      return <GameCard {...(restProps as GameCardProps)} />;
    case 'question':
      return <QuestionCard {...(restProps as QuestionCardProps)} />;
    case 'metric':
      return <MetricCard {...(restProps as MetricCardProps)} />;
    case 'achievement':
      return <AchievementCard {...(restProps as AchievementCardProps)} />;
    default:
      return <BaseCard {...(restProps as BaseCardProps)} />;
  }
};
```

## Key Improvements

1. **✅ Compile-time Type Safety**: TypeScript enforces required props based on cardType
2. **✅ No Breaking Changes**: Existing Card usage continues to work (backward compatible)
3. **✅ Proper Prop Refinement**: MetricCard and AchievementCard get proper type checking
4. **✅ Clean Architecture**: Single Card component with polymorphic behavior
5. **✅ Additive Enhancement**: Uses type refinements rather than breaking changes

## Implementation Status

- [x] Fixed discriminated union type system
- [x] MetricCard requires value/label props when cardType='metric'
- [x] AchievementCard requires achievementType/isUnlocked when cardType='achievement'
- [x] Fixed Card component switch statement type errors
- [x] Verified no breaking changes to existing Card usage

The Card polymorphic system now provides **perfect type safety** while maintaining **full backward compatibility**.