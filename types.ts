
export enum GameStatus {
  RUNNING = 'RUNNING',
  WON = 'WON',
  CRASHED = 'CRASHED',
  PAINTING = 'PAINTING',
  VIRUS_BOSS = 'VIRUS_BOSS',
  WINDOWS_HUB = 'WINDOWS_HUB',
  DARK_WEB = 'DARK_WEB',
  DARK_WEB_HUB = 'DARK_WEB_HUB',
  TITAN_BSD = 'TITAN_BSD',
  TRIPLE_VIRUS_BOSS = 'TRIPLE_VIRUS_BOSS',
  BOD_BOSS = 'BOD_BOSS',
  ULTIMATE_VICTORY = 'ULTIMATE_VICTORY',
  INTERNET_BOSS = 'INTERNET_BOSS',
  DSOD_BOSS = 'DSOD_BOSS',
  GLITCH_BOSS = 'GLITCH_BOSS',
  BST_FINAL_BOSS = 'BST_FINAL_BOSS',
  CUSTOM_BOSS = 'CUSTOM_BOSS'
}

export enum AppState {
  CLOSED = 'CLOSED',
  PHASE_ONE = 'PHASE_ONE',
  PHASE_TWO = 'PHASE_TWO',
  OVERCONTROL = 'OVERCONTROL'
}

export enum ComputerTier {
  OLD = 1,
  NEW = 2,
  ULTRA = 3
}

export enum Theme {
  NORMAL = 'NORMAL',
  HALLOWEEN = 'HALLOWEEN',
  CHRISTMAS = 'CHRISTMAS',
  NEW_YEAR = 'NEW_YEAR'
}

export type BossPart = 'BOSD_SHIELD' | 'VIRUS_SPIKE' | 'CHIMERA_CLAW' | 'TITAN_PLATE' | 'DARK_CORE';

export interface BossStats {
  hp: number;
  maxHp: number;
  name: string;
  speed: 'low' | 'med' | 'high';
  projectileType: string;
  description: string;
}

export interface CustomApp {
  id: string;
  name: string;
  type: 'boss' | 'image' | 'file';
  iconData: string;
  bossStats?: BossStats;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  type: 'emergency' | 'overcontrol' | 'virus' | 'hacker' | 'glitch' | 'titan_shard' | 'virus_splat' | 'blaster' | 'omega_punch' | 'bst_pulse' | 'custom';
  vx: number;
  vy: number;
}

export interface SystemSettings {
  resetKey: string;
  glitchVisuals: boolean;
  highContrast: boolean;
}
