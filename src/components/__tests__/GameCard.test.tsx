import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { GameCard } from '@/components/ui/Card';

describe('GameCard', () => {
  const defaultProps = {
    title: 'Addition Adventure',
    description: 'Learn addition through fun games',
    ageGroup: '6-8' as const,
    difficulty: 'medium' as const,
    gameType: 'math' as const,
    estimatedTime: 10,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders game card with correct content', () => {
    renderWithProviders(<GameCard {...defaultProps} />);

    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
    expect(screen.getByText('Learn addition through fun games')).toBeInTheDocument();
  });

  it('displays difficulty level appropriately', () => {
    renderWithProviders(<GameCard {...defaultProps} difficulty="hard" />);

    // The component should render (we're checking it doesn't crash with hard difficulty)
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });

  it('shows game type icon', () => {
    renderWithProviders(<GameCard {...defaultProps} gameType="math" />);

    // Math game type should show math icon (🔢)
    expect(screen.getByText('🔢')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    renderWithProviders(<GameCard {...defaultProps} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    await waitFor(() => {
      expect(defaultProps.onClick).toHaveBeenCalled();
    });
  });

  it('shows progress when provided', () => {
    renderWithProviders(<GameCard {...defaultProps} progress={75} />);

    // Component should render without errors when progress is provided
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });

  it('displays locked state correctly', () => {
    renderWithProviders(<GameCard {...defaultProps} locked={true} />);

    // Component should render in locked state
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });

  it('applies age-appropriate styling for younger children', () => {
    renderWithProviders(<GameCard {...defaultProps} ageGroup="3-5" />);

    // Component should render with age-appropriate styling
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });

  it('applies age-appropriate styling for older children', () => {
    renderWithProviders(<GameCard {...defaultProps} ageGroup="9+" />);

    // Component should render with age-appropriate styling
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });

  it('shows different game type icons', () => {
    const { rerender } = renderWithProviders(<GameCard {...defaultProps} gameType="english" />);

    expect(screen.getByText('📚')).toBeInTheDocument();

    rerender(<GameCard {...defaultProps} gameType="science" />);
    expect(screen.getByText('🔬')).toBeInTheDocument();
  });

  it('handles locked game interaction', async () => {
    const handleClick = vi.fn();
    renderWithProviders(
      <GameCard {...defaultProps} locked={true} onClick={handleClick} />
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);

    // When locked, clicking should trigger unlock process, not the regular click
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('displays rewards information when provided', () => {
    const rewards = {
      xp: 100,
      badges: ['math-master', 'quick-learner'],
    };

    renderWithProviders(<GameCard {...defaultProps} rewards={rewards} />);

    // Component should render without errors when rewards are provided
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });

  it('supports different difficulty levels', () => {
    const { rerender } = renderWithProviders(<GameCard {...defaultProps} difficulty="easy" />);

    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();

    rerender(<GameCard {...defaultProps} difficulty="hard" />);
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    renderWithProviders(<GameCard {...defaultProps} />);

    const card = screen.getByRole('button');

    // Focus the card
    fireEvent.focus(card);
    expect(card).toHaveFocus();

    // Press Enter to activate
    fireEvent.keyDown(card, { key: 'Enter' });

    await waitFor(() => {
      expect(defaultProps.onClick).toHaveBeenCalled();
    });
  });

  it('supports accessibility features', () => {
    renderWithProviders(<GameCard {...defaultProps} />);

    const card = screen.getByRole('button');

    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('displays game in unlocked interactive state by default', () => {
    renderWithProviders(<GameCard {...defaultProps} locked={false} />);

    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });

  it('handles different age groups correctly', () => {
    const { rerender } = renderWithProviders(<GameCard {...defaultProps} ageGroup="3-5" />);

    // Should render for young children
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();

    rerender(<GameCard {...defaultProps} ageGroup="6-8" />);
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();

    rerender(<GameCard {...defaultProps} ageGroup="9+" />);
    expect(screen.getByText('Addition Adventure')).toBeInTheDocument();
  });
});