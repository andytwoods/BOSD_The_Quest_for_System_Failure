
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, AppState, Achievement, ComputerTier, Theme, BossPart, CustomApp, SystemSettings } from './types';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import BOSDApp from './components/BOSDApp';
import BOSDScreen from './components/BOSDScreen';
import CrashScreen from './components/CrashScreen';
import MSPaint from './components/MSPaint';
import LogsWindow from './components/LogsWindow';
import ReadmeWindow from './components/ReadmeWindow';
import VirusBoss from './components/VirusBoss';
import WindowsHub from './components/WindowsHub';
import DarkWeb from './components/DarkWeb';
import DarkWebHub from './components/DarkWebHub';
import AmazonApp from './components/AmazonApp';
import FilesApp from './components/FilesApp';
import TitanBSDBoss from './components/TitanBSDBoss';
import GoogleWindow from './components/GoogleWindow';
import NewYearApp from './components/NewYearApp';
import ArcadeWindow from './components/ArcadeWindow';
import YouTubeWindow from './components/YouTubeWindow';
import AnimateWindow from './components/AnimateWindow';
import PD6Window from './components/PD6Window';
import DesktopPet from './components/DesktopPet';
import VirusTripleBoss from './components/VirusTripleBoss';
import AntivirusWorkbench from './components/AntivirusWorkbench';
import VirusPopup from './components/VirusPopup';
import BODBoss from './components/BODBoss';
import FinalWinDialog from './components/FinalWinDialog';
import UltimateVictoryScreen from './components/UltimateVictoryScreen';
import AdminPanel from './components/AdminPanel';
import InternetBoss from './components/InternetBoss';
import DSODApp from './components/DSODApp';
import GlitchBoss from './components/GlitchBoss';
import BSTFinalBoss from './components/BSTFinalBoss';
import CustomBossContainer from './components/CustomBossContainer';
import RegistryWindow from './components/RegistryWindow';
import { ShieldAlert, Crosshair, Zap, User, Loader2, Globe, Skull, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const getInitialTime = (tier: ComputerTier) => 300;

interface Dragon {
  id: number;
  x: number;
  y: number;
  vx: number;
}

interface Pet {
  id: string;
  type: string;
  color: string;
}

interface Popup {
  id: string;
  x: number;
  y: number;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'app_open', name: 'Curiosity', description: 'Open the BOSD App', unlocked: false },
  { id: 'phase_one', name: 'Persistent', description: 'Click the BOSD icon 10 times', unlocked: false },
  { id: 'bosd_achieved', name: 'The BOSD Achievement', description: 'Defeat the BOSD boss with 10 shots', unlocked: false },
  { id: 'won', name: 'Ultimate Failure', description: 'Trigger the BOSD', unlocked: false },
  { id: 'paint_face', name: 'Digital Art', description: 'Paint the unhappy face', unlocked: false },
  { id: 'recycled', name: 'E-Waste King', description: 'Recycle your computer', unlocked: false },
  { id: 'logs_recycled', name: 'Data Shredder', description: 'Recycle the system logs', unlocked: false },
  { id: 'ultra_pc', name: 'God Mode', description: 'Obtain the Ultra PC', unlocked: false },
  { id: 'bin_deleted', name: 'Deep Clean', description: 'Delete the Recycle Bin itself', unlocked: false },
  { id: 'dark_web_reach', name: 'Void Walker', description: 'Enter the Dark Web', unlocked: false },
  { id: 'titan_slayer', name: 'Titan Slayer', description: 'Defeat the Titan BSD Boss', unlocked: false },
  { id: 'googled', name: 'Researcher', description: 'Used the Google App', unlocked: false },
  { id: 'spooky', name: 'Spooky Season', description: 'Unlocked Halloween Mode', unlocked: false },
  { id: 'festive', name: 'Holiday Spirit', description: 'Unlocked Christmas Mode', unlocked: false },
  { id: 'new_year_master', name: 'Dragon Caller', description: 'Unlocked New Year Celebration', unlocked: false },
  { id: 'gamer', name: 'Arcade Rat', description: 'Entered the Secret Arcade', unlocked: false },
  { id: 'pd6_master', name: 'Tower Commander', description: 'Played PD6 Tower Defense', unlocked: false },
  { id: 'triple_threat', name: 'Anti-Virus', description: 'Defeated the Chimera Virus', unlocked: false },
  { id: 'av_built', name: 'Software Engineer', description: 'Built the Custom Antivirus', unlocked: false },
  { id: 'dsod_master', name: 'Green Master', description: 'Opened the DSOD reverse app', unlocked: false },
  { id: 'glitch_slayer', name: 'Bug Hunter', description: 'Defeated The Glitch', unlocked: false },
  { id: 'hacker', name: 'Root Explorer', description: 'Entered the system as "hacker"', unlocked: false },
  { id: 'bst_neutralized', name: 'The Sensitizer', description: 'Neutralized the BST consciousness', unlocked: false },
];

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.RUNNING);
  const [appState, setAppState] = useState<AppState>(AppState.CLOSED);
  const [bosdCount, setBosdCount] = useState<number>(0);
  const [computerTier, setComputerTier] = useState<ComputerTier>(ComputerTier.OLD);
  const [timeLeft, setTimeLeft] = useState<number>(getInitialTime(ComputerTier.OLD));
  const [isInfiniteTimer, setIsInfiniteTimer] = useState(false);
  const [isGodMode, setIsGodMode] = useState(false);
  const [isVirusShieldActive, setIsVirusShieldActive] = useState(false);
  const [timerMultiplier, setTimerMultiplier] = useState(1);
  const [damageMultiplier, setDamageMultiplier] = useState(1);
  const [isBstDefeated, setIsBstDefeated] = useState(false);
  
  const [bosdBossHealth, setBosdBossHealth] = useState(1000);
  const [bodBossHealth, setBodBossHealth] = useState(1000);
  const [glitchBossHealth, setGlitchBossHealth] = useState(5000);

  const [clipboard, setClipboard] = useState<string | null>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [isGoogleOpen, setIsGoogleOpen] = useState(false);
  const [isAmazonOpen, setIsAmazonOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [hasRootAccess, setHasRootAccess] = useState(false);
  const [currentUser, setCurrentUser] = useState("User_01");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [animalTheme, setAnimalTheme] = useState<string | null>(null);
  const [animalBg, setAnimalBg] = useState<string | null>(null);
  const [isThemeLoading, setIsThemeLoading] = useState(false);
  
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isYouTubeOpen, setIsYouTubeOpen] = useState(false);
  const [isAnimateOpen, setIsAnimateOpen] = useState(false);
  const [isPD6Open, setIsPD6Open] = useState(false);
  const [isNewYearOpen, setIsNewYearOpen] = useState(false);
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [isLogsRecycled, setIsLogsRecycled] = useState(false);
  const [isBinDeleted, setIsBinDeleted] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [gladToast, setGladToast] = useState(false);
  const [hasSearchedPaint, setHasSearchedPaint] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.NORMAL);
  const [dragons, setDragons] = useState<Dragon[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [collectedParts, setCollectedParts] = useState<Set<BossPart>>(new Set());
  const [isAntivirusActive, setIsAntivirusActive] = useState(false);
  const [arePopupsEnabled, setArePopupsEnabled] = useState(true);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [isBlasterEquipped, setIsBlasterEquipped] = useState(false);
  const [dPressCount, setDPressCount] = useState(0);
  const [showFinalChoice, setShowFinalChoice] = useState(false);
  const [hasDeclinedWin, setHasDeclinedWin] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDSODOpen, setIsDSODOpen] = useState(false);
  const [isBosOpen, setIsBosOpen] = useState(false);
  const [customApps, setCustomApps] = useState<CustomApp[]>([]);
  const [activeCustomApp, setActiveCustomApp] = useState<CustomApp | null>(null);
  
  const [settings, setSettings] = useState<SystemSettings>({
    resetKey: 'Escape',
    glitchVisuals: true,
    highContrast: false
  });

  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const timerRef = useRef<number | null>(null);
  const popupTimerRef = useRef<number | null>(null);
  const dragonIdRef = useRef(0);
  const dPressTimeoutRef = useRef<number | null>(null);

  const handleClockSecret = useCallback(() => {
    if (confirm("Well, you're lucky. But if you're lucky, can you defeat this?")) {
      setIsBlasterEquipped(true);
      setStatus(GameStatus.GLITCH_BOSS);
    }
  }, []);

  const handleFullReset = useCallback(() => {
    if (confirm("WARNING: This will completely wipe your BOSD count, achievements, and system upgrades. Are you sure you want a factory reset?")) {
      setBosdCount(0);
      setAchievements(INITIAL_ACHIEVEMENTS);
      setComputerTier(ComputerTier.OLD);
      setCollectedParts(new Set());
      setIsAdminUnlocked(false);
      setAnimalTheme(null);
      setAnimalBg(null);
      setCustomApps([]);
      handleRestart();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Custom reset key logic
      if (e.key === settings.resetKey) {
        handleFullReset();
        return;
      }

      if (e.key === '9') {
        setStatus(GameStatus.BST_FINAL_BOSS);
        return;
      }
      if (e.key === '0') {
        setIsBlasterEquipped(true);
        setStatus(GameStatus.GLITCH_BOSS);
        return;
      }
      if (e.key === '1') {
        setCustomBackground('#1e3a8a');
        setPopups([]); 
        setArePopupsEnabled(false); 
        setIsVirusShieldActive(true);
        setGladToast(true);
        setTimeout(() => setGladToast(false), 2000);
      }
      if (e.key.toLowerCase() === 'd') {
        const specialStatuses = [GameStatus.WINDOWS_HUB, GameStatus.DARK_WEB, GameStatus.VIRUS_BOSS, GameStatus.TITAN_BSD, GameStatus.TRIPLE_VIRUS_BOSS, GameStatus.BOD_BOSS, GameStatus.INTERNET_BOSS, GameStatus.GLITCH_BOSS, GameStatus.BST_FINAL_BOSS, GameStatus.CUSTOM_BOSS];
        if (specialStatuses.includes(status)) {
          setGladToast(true);
          setTimeout(() => setGladToast(false), 2000);
          setStatus(GameStatus.RUNNING);
          setDPressCount(0);
        } else if (status === GameStatus.RUNNING && !isBinDeleted) {
          setDPressCount(prev => {
            const next = prev + 1;
            if (next >= 3) {
              setIsBinDeleted(true);
              setStatus(GameStatus.BOD_BOSS);
              unlockAchievement('bin_deleted');
              return 0;
            }
            return next;
          });
          if (dPressTimeoutRef.current) window.clearTimeout(dPressTimeoutRef.current);
          dPressTimeoutRef.current = window.setTimeout(() => {
            setDPressCount(0);
          }, 1000);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isBinDeleted, settings.resetKey, handleFullReset]);

  useEffect(() => {
    if (bosdCount >= 10 && computerTier < ComputerTier.ULTRA) {
      setComputerTier(ComputerTier.ULTRA);
      unlockAchievement('ultra_pc');
      if (!hasDeclinedWin) setShowFinalChoice(true);
    } else if (bosdCount >= 5 && computerTier < ComputerTier.NEW) {
      setComputerTier(ComputerTier.NEW);
    }
  }, [bosdCount, computerTier, hasDeclinedWin]);

  useEffect(() => {
    if (computerTier === ComputerTier.ULTRA && bosdCount >= 1) setIsAdminUnlocked(true);
  }, [computerTier, bosdCount]);

  useEffect(() => {
    if (status === GameStatus.RUNNING && arePopupsEnabled && !isVirusShieldActive) {
      const spawnPopup = () => {
        const delay = Math.random() * 15000 + 5000;
        popupTimerRef.current = window.setTimeout(() => {
          if (arePopupsEnabled && !isVirusShieldActive) {
            setPopups(prev => [...prev, { id: Math.random().toString(), x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 }]);
            spawnPopup();
          }
        }, delay);
      };
      spawnPopup();
    } else {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    }
    return () => { if (popupTimerRef.current) clearTimeout(popupTimerRef.current); };
  }, [status, arePopupsEnabled, isVirusShieldActive]);

  useEffect(() => {
    if (isAntivirusActive && popups.length > 0) {
      const timer = setTimeout(() => { setPopups(prev => prev.slice(1)); }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAntivirusActive, popups]);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (isInfiniteTimer) return prev;
        if (prev <= 1) {
          if (timerRef.current !== null) window.clearInterval(timerRef.current);
          setStatus(GameStatus.CRASHED);
          return 0;
        }
        return prev - 1;
      });
    }, 1000 / timerMultiplier);
  }, [isInfiniteTimer, timerMultiplier]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current !== null) window.clearInterval(timerRef.current); };
  }, [startTimer]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
  };

  const handleRestart = () => {
    setTimeLeft(300);
    setStatus(GameStatus.RUNNING);
    setAppState(AppState.CLOSED);
    setIsBinDeleted(false);
    setIsBlasterEquipped(false);
    setIsInfiniteTimer(false);
    setIsGodMode(false);
    setIsVirusShieldActive(false);
    setArePopupsEnabled(true);
    setDPressCount(0);
    setPopups([]);
    setShowFinalChoice(false);
    setHasDeclinedWin(false);
    setIsAdminOpen(false);
    setIsDSODOpen(false);
    setIsBosOpen(false);
    setIsDeleteMode(false);
    setBosdBossHealth(1000);
    setBodBossHealth(1000);
    setGlitchBossHealth(5000);
    setTimerMultiplier(1);
    setDamageMultiplier(1);
    setIsBstDefeated(false);
    setActiveCustomApp(null);
    startTimer();
  };

  const handleWin = (countIncrement = 1, part?: BossPart) => {
    setBosdCount(prev => prev + countIncrement);
    if (part) {
      setCollectedParts(prev => new Set([...prev, part]));
    }
    
    if (status === GameStatus.DSOD_BOSS || (part === 'DARK_CORE' && isDSODOpen)) {
        setHasRootAccess(true);
        setGladToast(true);
        setTimeout(() => setGladToast(false), 3000);
    }

    if (status === GameStatus.BST_FINAL_BOSS) {
      unlockAchievement('bst_neutralized');
      setIsBstDefeated(true);
      setStatus(GameStatus.ULTIMATE_VICTORY);
      return;
    }

    setStatus(GameStatus.WON);
    unlockAchievement('won');
    unlockAchievement('bosd_achieved');
    setBosdBossHealth(1000);
    setBodBossHealth(1000);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
  };

  const handleAppOpen = () => {
    if (appState === AppState.CLOSED) {
      setAppState(AppState.PHASE_ONE);
      unlockAchievement('app_open');
    }
  };

  const handleCommand = (cmd: string) => {
    unlockAchievement('googled');
    const normalized = cmd.toLowerCase().trim();
    if (normalized.includes('bosd.exe')) {
      setIsGodMode(true);
      setIsBlasterEquipped(true);
      setGladToast(true);
      setTimeout(() => setGladToast(false), 3000);
    } else if (normalized.includes('infinity')) {
      setIsInfiniteTimer(true);
    } else if (normalized.includes('dsod.exe')) {
      setIsDSODOpen(true);
      unlockAchievement('dsod_master');
    } else if (normalized.includes('cleaner.exe')) {
      setIsDeleteMode(true);
    } else if (normalized.includes('registry.exe')) {
      setIsRegistryOpen(true);
    } else if (normalized.includes('bsd') || normalized.includes('bsod')) {
      setIsGoogleOpen(false);
      setStatus(GameStatus.TITAN_BSD);
    } else if (normalized.includes('bg')) {
      const colors = ['#1e3a8a', '#1a0f00', '#4a0404', '#000000', '#002b1a', '#4c1d95'];
      setCustomBackground(colors[Math.floor(Math.random() * colors.length)]);
    } else if (normalized.includes('no virus')) {
      setArePopupsEnabled(false);
      setPopups([]);
      setIsGoogleOpen(false);
    } else if (normalized.includes('halloween')) {
      setTheme(Theme.HALLOWEEN);
      unlockAchievement('spooky');
      setIsGoogleOpen(false);
    } else if (normalized.includes('christmas')) {
      setTheme(Theme.CHRISTMAS);
      unlockAchievement('festive');
      setIsGoogleOpen(false);
    } else if (normalized.includes('new year')) {
      setTheme(Theme.NEW_YEAR);
      setIsNewYearOpen(true);
      setIsGoogleOpen(false);
    } else if (normalized.includes('arcade')) {
      setIsArcadeOpen(true);
      unlockAchievement('gamer');
      setIsGoogleOpen(false);
    } else if (normalized.includes('youtube')) {
      setIsYouTubeOpen(true);
      setIsGoogleOpen(false);
    } else if (normalized.includes('animate')) {
      setIsAnimateOpen(true);
      setIsGoogleOpen(false);
    } else if (normalized.includes('pd6')) {
      setIsPD6Open(true);
      unlockAchievement('pd6_master');
      setIsGoogleOpen(false);
    } else if (computerTier === ComputerTier.ULTRA || isGodMode) {
      if (normalized.includes('explode')) handleWin();
    }
  };

  const handleLaunchCustomApp = (app: CustomApp) => {
    if (isDeleteMode) {
      setCustomApps(prev => prev.filter(a => a.id !== app.id));
      return;
    }
    setActiveCustomApp(app);
    if (app.type === 'boss') {
        setStatus(GameStatus.CUSTOM_BOSS);
    } else {
        alert(`Opening ${app.name}... it's just a regular image file.`);
    }
  };

  const handleDeleteIcon = (type: string) => {
    if (!isDeleteMode) return;
    switch (type) {
      case 'logs': setIsLogsRecycled(true); break;
      case 'bin': setIsBinDeleted(true); break;
      // Add more specific icon deletions if needed
    }
  };

  const getThemeBgStyle = () => {
    if (animalBg) return { backgroundImage: `url(${animalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    if (customBackground) return { backgroundColor: customBackground };
    const colors: any = {
      [Theme.HALLOWEEN]: '#1a0f00',
      [Theme.CHRISTMAS]: '#002b1a',
      [Theme.NEW_YEAR]: '#4a0404',
      DEFAULT: '#1e3a8a'
    };
    if (computerTier === ComputerTier.ULTRA) return { backgroundColor: '#1e1b4b' };
    if (computerTier === ComputerTier.NEW) return { backgroundColor: '#0f172a' };
    return { backgroundColor: colors[theme] || colors.DEFAULT };
  };

  const handleAmazonPurchase = (item: any) => {
    if (timeLeft < item.cost) return;
    setTimeLeft(prev => prev - item.cost);
    setIsAmazonOpen(false);
    switch (item.id) {
        case 'chaos_pack':
            setPopups(prev => [...prev, ...Array.from({ length: 5 }).map(() => ({ id: Math.random().toString(), x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 }))]);
            break;
        case 'time_freeze':
            setIsInfiniteTimer(true);
            setTimeout(() => setIsInfiniteTimer(false), 15000);
            break;
        case 'damage_boost':
            setDamageMultiplier(2);
            setTimeout(() => setDamageMultiplier(1), 30000);
            break;
        case 'random_boss':
            const bossPool = [GameStatus.VIRUS_BOSS, GameStatus.TITAN_BSD, GameStatus.TRIPLE_VIRUS_BOSS, GameStatus.INTERNET_BOSS];
            setIsBlasterEquipped(true);
            setStatus(bossPool[Math.floor(Math.random() * bossPool.length)]);
            break;
        case 'void_portal':
            setIsBlasterEquipped(true);
            setStatus(GameStatus.GLITCH_BOSS);
            break;
    }
  };

  // Fixed Missing Handlers
  const handleLoginSubmit = (username: string) => {
    setCurrentUser(username);
    setIsLoginOpen(false);
    if (username.toLowerCase() === 'hacker') {
      setHasRootAccess(true);
      unlockAchievement('hacker');
    }
  };

  const spawnDragon = () => {
    const newDragon: Dragon = {
      id: dragonIdRef.current++,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      vx: (Math.random() - 0.5) * 2,
    };
    setDragons(prev => [...prev, newDragon]);
    unlockAchievement('new_year_master');
  };

  const catchPet = (type: string, color: string) => {
    const newPet: Pet = {
      id: Math.random().toString(),
      type,
      color
    };
    setPets(prev => [...prev, newPet]);
  };

  const handleSearchPaint = () => {
    setStatus(GameStatus.PAINTING);
    setHasSearchedPaint(true);
  };

  if (status === GameStatus.WON) return <BOSDScreen onRestart={handleRestart} bosdCount={bosdCount} />;
  if (status === GameStatus.ULTIMATE_VICTORY) return <UltimateVictoryScreen onRestart={handleRestart} onFullReset={handleFullReset} onBackToDesktop={() => setStatus(GameStatus.RUNNING)} bosdCount={bosdCount} />;
  if (status === GameStatus.CRASHED) return <CrashScreen onRestart={handleRestart} />;
  if (status === GameStatus.VIRUS_BOSS) return <VirusBoss onWin={() => handleWin(3, 'VIRUS_SPIKE')} onFail={() => setStatus(GameStatus.CRASHED)} />;
  if (status === GameStatus.BOD_BOSS) return <BODBoss hp={bodBossHealth} setHp={setBodBossHealth} onWin={() => { handleWin(5); }} onFail={() => setStatus(GameStatus.CRASHED)} isBlasterEquipped={isBlasterEquipped} isLogsRecycled={isLogsRecycled || isGodMode} godMode={isGodMode} />;
  if (status === GameStatus.GLITCH_BOSS) return <GlitchBoss hp={glitchBossHealth} setHp={setGlitchBossHealth} onWin={() => { setIsVirusShieldActive(true); setArePopupsEnabled(false); unlockAchievement('glitch_slayer'); setStatus(GameStatus.RUNNING); }} onFail={() => setStatus(GameStatus.CRASHED)} isBlasterEquipped={isBlasterEquipped} playerDamage={(isGodMode ? 1000 : (isLogsRecycled ? 100 : 10)) * damageMultiplier} />;
  if (status === GameStatus.INTERNET_BOSS) return <InternetBoss onWin={() => setStatus(GameStatus.RUNNING)} onFail={() => setStatus(GameStatus.CRASHED)} isBlasterEquipped={isBlasterEquipped} playerDamage={(isGodMode ? 9999 : (isLogsRecycled ? 100 : 10)) * damageMultiplier} />;
  if (status === GameStatus.TRIPLE_VIRUS_BOSS) return <VirusTripleBoss onWin={() => { handleWin(10, 'CHIMERA_CLAW'); unlockAchievement('triple_threat'); }} onFail={() => setStatus(GameStatus.CRASHED)} />;
  if (status === GameStatus.WINDOWS_HUB) return <WindowsHub onDefeat={() => setStatus(GameStatus.DARK_WEB)} onFail={() => setStatus(GameStatus.CRASHED)} />;
  if (status === GameStatus.DARK_WEB) return <DarkWeb onWin={() => handleWin(5, 'DARK_CORE')} onFail={() => setStatus(GameStatus.CRASHED)} />;
  if (status === GameStatus.DARK_WEB_HUB) return <DarkWebHub onClose={() => setStatus(GameStatus.RUNNING)} onLaunchBoss={(newStatus) => { setIsBlasterEquipped(true); setStatus(newStatus); }} />;
  if (status === GameStatus.TITAN_BSD) return <TitanBSDBoss computerTier={computerTier} theme={theme} onWin={() => { unlockAchievement('titan_slayer'); handleWin(10, 'TITAN_PLATE'); }} onFail={() => setStatus(GameStatus.CRASHED)} />;
  if (status === GameStatus.BST_FINAL_BOSS) return <BSTFinalBoss onWin={() => handleWin(100)} onFail={() => setStatus(GameStatus.CRASHED)} />;
  if (status === GameStatus.CUSTOM_BOSS && activeCustomApp?.bossStats) return <CustomBossContainer stats={activeCustomApp.bossStats} icon={activeCustomApp.iconData} onWin={() => { handleWin(1); setStatus(GameStatus.RUNNING); }} onFail={() => setStatus(GameStatus.CRASHED)} isBlasterEquipped={isBlasterEquipped} playerDamage={(isGodMode ? 1000 : 25) * damageMultiplier} />;

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden select-none transition-all duration-1000 ${computerTier === ComputerTier.ULTRA ? 'ring-inset ring-8 ring-blue-500/20' : ''} ${isBlasterEquipped ? 'cursor-none' : ''} ${isDeleteMode ? 'cursor-none' : ''} ${settings.glitchVisuals && bosdCount > 5 ? 'animate-glitch' : ''}`} 
      style={getThemeBgStyle()}
    >
      <Desktop 
        onOpenApp={handleAppOpen} 
        onOpenVirusExe={() => !isDeleteMode && setStatus(GameStatus.TRIPLE_VIRUS_BOSS)}
        onOpenLogs={() => !isLogsRecycled && !isDeleteMode && setIsLogsOpen(true)}
        onOpenReadme={() => !isDeleteMode && setIsReadmeOpen(true)}
        onOpenGoogle={() => !isDeleteMode && setIsGoogleOpen(true)}
        onOpenAmazon={() => !isDeleteMode && setIsAmazonOpen(true)}
        onOpenFiles={() => hasRootAccess && !isDeleteMode && setIsFilesOpen(true)}
        hasRootAccess={hasRootAccess}
        onOpenWorkbench={() => (bosdCount >= 1) && !isDeleteMode && setIsWorkbenchOpen(true)}
        onRecycleLogs={() => { setIsLogsRecycled(true); setIsLogsOpen(false); unlockAchievement('logs_recycled'); }}
        onRestoreLogs={() => setIsLogsRecycled(false)}
        onDeleteBin={() => { setIsBinDeleted(true); setStatus(GameStatus.BOD_BOSS); }}
        onOpenBos={() => !isDeleteMode && setIsBosOpen(true)}
        onOpenDSOD={() => !isDeleteMode && setIsDSODOpen(true)}
        isLogsRecycled={isLogsRecycled}
        isBinDeleted={isBinDeleted}
        isDeleteMode={isDeleteMode}
        onIconDelete={handleDeleteIcon}
        bosdCount={bosdCount} 
        onRecycle={() => { if(bosdCount >= 10) handleRestart(); }}
        computerTier={computerTier}
        theme={theme}
        canBuildAV={bosdCount >= 1}
        onUltimateWin={() => setShowFinalChoice(true)}
        animalTheme={animalTheme}
        customApps={customApps}
        onLaunchCustomApp={handleLaunchCustomApp}
      />

      {isRegistryOpen && <RegistryWindow settings={settings} onUpdateSettings={setSettings} onClose={() => setIsRegistryOpen(false)} onFullReset={handleFullReset} />}
      
      {isDeleteMode && (
          <div className="absolute top-4 right-20 bg-red-600 text-white px-4 py-2 rounded-full font-black text-xs animate-bounce shadow-xl flex items-center gap-2 z-[200]">
              <Trash2 className="w-4 h-4" /> DELETE_MODE_ACTIVE - CLICK ICONS TO PURGE
              <button onClick={() => setIsDeleteMode(false)} className="bg-white text-red-600 px-2 rounded-sm ml-2 font-bold uppercase">Exit</button>
          </div>
      )}

      {isThemeLoading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center z-[200]">
              <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
              <p className="text-white font-black uppercase tracking-widest animate-pulse italic">Synchronizing Animal Vectors...</p>
          </div>
      )}

      {isBstDefeated && (
        <>
            <DesktopPet pet={{ id: 'internet_ally', type: 'internet', color: 'text-blue-400' }} />
            <DesktopPet pet={{ id: 'glitch_ally', type: 'glitch', color: 'text-red-400' }} />
        </>
      )}

      {isBosOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-zinc-800 border-2 border-zinc-500 shadow-2xl z-[90] p-4 flex flex-col items-center gap-4 animate-in zoom-in">
           <div className="w-full flex justify-between items-center border-b border-zinc-600 pb-2">
              <span className="text-white font-mono text-xs font-bold tracking-widest uppercase">bos.exe - Cheat Console</span>
              <button onClick={() => setIsBosOpen(false)} className="text-zinc-400 hover:text-white"><ShieldAlert className="w-4 h-4"/></button>
           </div>
           <input type="text" placeholder="Enter sequence..." autoFocus className="w-full bg-black border border-zinc-600 text-green-500 font-mono text-sm px-3 py-2 focus:outline-none" onChange={(e) => { if (e.target.value.toLowerCase() === 'bosd.exe') { handleWin(); setIsBosOpen(false); } }} />
           <p className="text-[10px] text-zinc-500 font-mono italic">Enter 'bosd.exe' for instant win.</p>
        </div>
      )}

      {isLoginOpen && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[110]">
           <div className="bg-gray-200 border-2 border-white w-72 p-6 shadow-2xl flex flex-col gap-4 font-sans">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white shadow-inner">
                    <User className="w-10 h-10 text-gray-200" />
                 </div>
                 <span className="text-sm font-bold text-gray-700">System Login</span>
              </div>
              <input type="text" placeholder="Username..." autoFocus className="w-full p-2 border-2 border-inset bg-white text-xs font-mono" onKeyDown={(e) => { if (e.key === 'Enter') handleLoginSubmit((e.target as HTMLInputElement).value); }} />
              <div className="flex justify-end gap-2 text-[10px]">
                <button onClick={() => setIsLoginOpen(false)} className="px-4 py-1 border border-gray-400 bg-white">Cancel</button>
                <button className="px-4 py-1 bg-blue-600 text-white font-bold">Login</button>
              </div>
           </div>
        </div>
      )}

      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} onSpawnInternet={() => { setStatus(GameStatus.INTERNET_BOSS); setIsAdminOpen(false); }} onFullReset={handleFullReset} />}
      {showFinalChoice && <FinalWinDialog onWin={() => setStatus(GameStatus.ULTIMATE_VICTORY)} onContinue={() => { setShowFinalChoice(false); setHasDeclinedWin(true); }} />}
      {isWorkbenchOpen && <AntivirusWorkbench onClose={() => setIsWorkbenchOpen(false)} collectedParts={collectedParts} bosdCount={bosdCount} onBuild={() => { setIsAntivirusActive(true); unlockAchievement('av_built'); }} />}
      {popups.map(p => <VirusPopup key={p.id} x={p.x} y={p.y} onClose={() => { 
          if(isBstDefeated) { setPopups(prev => prev.filter(x => x.id !== p.id)); setGladToast(true); setTimeout(()=>setGladToast(false),500); }
          else setPopups(prev => prev.filter(x => x.id !== p.id));
      }} />)}
      {isAntivirusActive && (
        <div className="absolute top-20 right-20 w-12 h-12 bg-blue-500/80 border-2 border-white rounded-full flex items-center justify-center shadow-lg animate-bounce z-50">
          <ShieldAlert className="text-white w-8 h-8" />
        </div>
      )}
      {isReadmeOpen && <ReadmeWindow onClose={() => setIsReadmeOpen(false)} />}
      {isGoogleOpen && <GoogleWindow onClose={() => setIsGoogleOpen(false)} onSearch={handleCommand} onNavigateToHub={() => { setIsGoogleOpen(false); setStatus(GameStatus.DARK_WEB_HUB); }} />}
      {isAmazonOpen && <AmazonApp onClose={() => setIsAmazonOpen(false)} timeLeft={timeLeft} onPurchase={handleAmazonPurchase} />}
      {isFilesOpen && <FilesApp onClose={() => setIsFilesOpen(false)} onTriggerBST={() => setStatus(GameStatus.BST_FINAL_BOSS)} />}
      {isArcadeOpen && <ArcadeWindow onClose={() => setIsArcadeOpen(false)} bosdCount={bosdCount} />}
      {isYouTubeOpen && <YouTubeWindow onClose={() => setIsYouTubeOpen(false)} />}
      {isAnimateOpen && <AnimateWindow onClose={() => setIsAnimateOpen(false)} bosdCount={bosdCount} isResearcher={achievements.find(a => a.id === 'googled')?.unlocked || false} />}
      {isPD6Open && <PD6Window onClose={() => setIsPD6Open(false)} bosdCount={bosdCount} onCatch={catchPet} />}
      {isNewYearOpen && <NewYearApp onClose={() => setIsNewYearOpen(false)} onCelebrate={() => spawnDragon()} />}
      {isLogsOpen && !isLogsRecycled && <LogsWindow onClose={() => setIsLogsOpen(false)} onCopy={setClipboard} canCopy={achievements.find(a => a.id === 'paint_face')?.unlocked || false} />}
      {isDSODOpen && <DSODApp onClose={() => setIsDSODOpen(false)} onWin={() => handleWin(2, 'DARK_CORE')} />}
      {dragons.map(dragon => <div key={dragon.id} className="absolute z-[100]" style={{ left: `${dragon.x}%`, top: `${dragon.y}%` }}><div className="text-red-500 font-bold bg-yellow-400 px-2 rounded-full border border-red-600 animate-bounce">🐉 DRAGON</div></div>)}
      {pets.map(pet => <DesktopPet key={pet.id} pet={pet} />)}
      {/* Fixed: replaced setBossHealth with setBosdBossHealth */}
      {appState !== AppState.CLOSED && <BOSDApp state={appState} onStateChange={setAppState} onWin={() => handleWin(1, 'BOSD_SHIELD')} onClose={() => setAppState(AppState.CLOSED)} unlockAchievement={unlockAchievement} difficulty={computerTier} clipboard={clipboard} canPaste={achievements.find(a => a.id === 'paint_face')?.unlocked || false} isLogsRecycled={isLogsRecycled || isGodMode} theme={theme} godMode={isGodMode} bossHealth={bosdBossHealth} setBossHealth={setBosdBossHealth} playerDamageOverride={(isGodMode ? 1000 : (isLogsRecycled ? 100 : 10)) * damageMultiplier} />}
      {status === GameStatus.PAINTING && <MSPaint onClose={() => setStatus(GameStatus.RUNNING)} onAchievement={() => unlockAchievement('paint_face')} isArtist={achievements.find(a => a.id === 'paint_face')?.unlocked || false} onSaveApp={(app) => { setCustomApps(prev => [...prev, app]); setStatus(GameStatus.RUNNING); }} />}

      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-white font-mono flex flex-col items-end z-50">
        <span className={`text-2xl font-bold ${timeLeft < 60 && !isInfiniteTimer ? 'text-red-500 animate-pulse' : 'text-blue-200'}`}>
          {isInfiniteTimer ? '∞:∞' : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
        </span>
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[100]">
        <div className="flex items-center gap-4 bg-white/10 px-6 py-2 rounded-full border border-white/20 text-white backdrop-blur-md">
            <span className="text-sm font-bold">BODS: <span className="text-blue-400">{bosdCount}</span></span>
        </div>
        <button onClick={() => setIsBlasterEquipped(!isBlasterEquipped)} className={`group flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${isBlasterEquipped ? 'bg-blue-600 border-white text-white shadow-[0_0_20px_blue] animate-pulse' : 'bg-black/60 border-blue-500/50 text-blue-400 hover:border-blue-400'}`} title="Grab the Kernel Blaster">
          <Crosshair className={`w-5 h-5 ${isBlasterEquipped ? 'animate-spin-slow' : 'group-hover:rotate-45 transition-transform'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">{isBlasterEquipped ? 'Blaster Active' : 'Grab Blaster'}</span>
          <Zap className="w-3 h-3 text-yellow-400" />
        </button>
        {gladToast && <div className="bg-yellow-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce shadow-lg">{isVirusShieldActive ? 'VIRUS_SHIELD FOREVER ACTIVE' : hasRootAccess ? 'ROOT ACCESS GRANTED' : 'GOD MODE AUTHORIZED'}</div>}
      </div>

      <Taskbar 
        onSearchPaint={handleSearchPaint} 
        onCommand={handleCommand} 
        onVolumeClick={() => setStatus(GameStatus.WINDOWS_HUB)} 
        onDeleteWindowsIcon={() => { if(hasSearchedPaint) setComputerTier(ComputerTier.ULTRA); }} 
        canDeleteWindowsIcon={hasSearchedPaint} 
        isUltra={computerTier === ComputerTier.ULTRA} 
        theme={theme} 
        isAdminUnlocked={isAdminUnlocked} 
        onAdminOpen={() => setIsAdminOpen(true)} 
        onClockClick={handleClockSecret} 
        onLoginClick={() => setIsLoginOpen(true)} 
        onRegistryOpen={() => setIsRegistryOpen(true)}
        currentUser={currentUser} 
        animalTheme={animalTheme} 
      />

      <button onClick={handleRestart} className="absolute bottom-20 right-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-500 px-3 py-1 rounded-sm text-xs uppercase z-50">Emergency Restart</button>
      <div className="absolute bottom-20 left-4 space-y-2 z-50 max-h-60 overflow-y-auto pr-2">
        {achievements.filter(a => a.unlocked).map((a) => (<div key={a.id} className="bg-green-600/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-sm text-[10px] animate-in fade-in">[A] {a.name}</div>))}
      </div>
      {isBlasterEquipped && <BlasterCursor />}
      {isDeleteMode && <DeleterCursor />}
    </div>
  );
};

const BlasterCursor: React.FC = () => {
    const [mPos, setMPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const move = (e: MouseEvent) => setMPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);
    return (<div className="fixed pointer-events-none z-[9999] transition-transform duration-75" style={{ left: mPos.x, top: mPos.y, transform: 'translate(-50%, -50%)' }}><div className="relative"><Crosshair className="w-8 h-8 text-blue-400 drop-shadow-[0_0_5px_cyan]" /><div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" /></div></div>);
};

const DeleterCursor: React.FC = () => {
  const [mPos, setMPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
      const move = (e: MouseEvent) => setMPos({ x: e.clientX, y: e.clientY });
      window.addEventListener('mousemove', move);
      return () => window.removeEventListener('mousemove', move);
  }, []);
  return (<div className="fixed pointer-events-none z-[9999]" style={{ left: mPos.x, top: mPos.y, transform: 'translate(-50%, -50%)' }}><div className="relative"><Trash2 className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_red] animate-bounce" /></div></div>);
};

export default App;
