/**
 * Game States
 */
const GameState = {
  START_SCREEN: "start_screen",
  TWO_PLAYER_IDLE: "two_player_idle",
  TWO_PLAYER_HIT: "two_player_hit",
  TWO_PLAYER_BALL_MOVING: "two_player_ball_moving",
  SANDBOX_IDLE: "sandbox_idle",
  SANDBOX_HIT: "sandbox_hit",
  SANDBOX_BALL_MOVING: "sandbox_ball_moving",
};

const ScoreState = {
  NO_SCORE: "no_score",
  SCORE_P1_STRIPE: "p1_stripe",
  SCORE_P1_FILLED: "p1_filled",
};

export { GameState, ScoreState };
