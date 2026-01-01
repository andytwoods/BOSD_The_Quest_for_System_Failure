
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
import { ShieldAlert, Crosshair, Zap, User, Loader2, Globe, Skull, Trash2, X, Terminal, Cpu } from 'lucide-react';

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

const BiosBoot: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logSteps = [
    "BIOS v2.04.1 (C) 1998 Legacy Systems",
    "CPU: HyperThread Core @ 3.4GHz",
    "Memory Test: 65536K OK",
    "Detecting Primary Master... HDD-0 OK",
    "Detecting Secondary Slave... NONE",
    "Verifying DMI Pool Data... Success",
    "Loading Kernel.sys...",
    "Mounting /system/desktop...",
    "Initializing Graphic UI...",
    "READY."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logSteps.length) {
        setLogs(prev => [...prev, logSteps[currentLog]]);
        currentLog++;
        setProgress(p => Math.min(100, (currentLog / logSteps.length) * 100));
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[999] flex flex-col p-12 font-mono text-gray-300">
      <div className="flex justify-between border-b border-gray-700 pb-4 mb-8">
        <div className="flex items-center gap-4">
          <Terminal className="w-10 h-10 text-white" />
          <h1 className="text-2xl font-bold tracking-tighter text-white">LEGACY_BOOT_LOADER</h1>
        </div>
        <div className="text-right text-xs opacity-50 uppercase">
          System State: Initializing<br/>
          Secure Boot: Disabled
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        {logs.map((log, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-green-500 mr-2">></span> {log}
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
          <span>Loading Progress</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="w-full h-4 bg-gray-900 border border-gray-800 rounded-sm overflow-hidden">
          <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
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

  const [visibleIcons, setVisibleIcons] = useState({
    readme: true,
    google: true,
    amazon: true,
    files: true,
    workbench: true,
    bosd: true,
    bos_terminal: true,
    dsod: true,
    virus: true,
  });

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
  const [isDarkWebHubOpen, setIsDarkWebHubOpen] = useState(false);
  
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
      setPets([]);
      setVisibleIcons({
        readme: true,
        google: true,
        amazon: true,
        files: true,
        workbench: true,
        bosd: true,
        bos_terminal: true,
        dsod: true,
        virus: true,
      });
      handleRestart();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    if (!isBooting) {
        startTimer();
    }
    return () => { if (timerRef.current !== null) window.clearInterval(timerRef.current); };
  }, [startTimer, isBooting]);

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

    // Add boss pet reward
    if (status === GameStatus.VIRUS_BOSS) setPets(prev => [...prev, { id: Date.now().toString(), type: 'virus', color: 'text-green-500' }]);
    if (status === GameStatus.INTERNET_BOSS) setPets(prev => [...prev, { id: Date.now().toString(), type: 'internet', color: 'text-blue-400' }]);
    if (status === GameStatus.GLITCH_BOSS) setPets(prev => [...prev, { id: Date.now().toString(), type: 'glitch', color: 'text-white' }]);

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
      setStatus(GameStatus.RUNNING);
    } else if (normalized.includes('pd6')) {
      setIsPD6Open(true);
    } else if (normalized.includes('arcade')) {
      setIsArcadeOpen(true);
    } else if (normalized.includes('youtube')) {
      setIsYouTubeOpen(true);
    } else if (normalized.includes('registry')) {
      setIsRegistryOpen(true);
    } else if (normalized.includes('cleaner')) {
      setIsDeleteMode(true);
    } else if (normalized.includes('bg')) {
      setIsThemeLoading(true);
      setTimeout(() => {
        setIsThemeLoading(false);
        const animals = ['cat', 'dog', 'bird', 'rabbit', 'fish', 'turtle', 'squirrel', 'snail'];
        setAnimalTheme(animals[Math.floor(Math.random() * animals.length)]);
      }, 1000);
    } else if (normalized.includes('halloween')) {
      setTheme(Theme.HALLOWEEN);
      unlockAchievement('spooky');
    } else if (normalized.includes('christmas')) {
      setTheme(Theme.CHRISTMAS);
      unlockAchievement('festive');
    } else if (normalized.includes('new year')) {
      setIsNewYearOpen(true);
    }
  };

  const handleIconDelete = (type: string) => {
    setVisibleIcons(prev => ({ ...prev, [type]: false }));
  };

  const getBackground = () => {
    if (animalBg) return `url(${animalBg})`;
    if (customBackground) return customBackground;
    if (theme === Theme.HALLOWEEN) return '#1a0a00';
    if (theme === Theme.CHRISTMAS) return '#001a0a';
    if (theme === Theme.NEW_YEAR) return '#8B0000';
    return computerTier === ComputerTier.ULTRA ? '#0f172a' : (computerTier === ComputerTier.NEW ? '#1e293b' : '#0078d7');
  };

  return (
    <div className={`w-full h-screen relative overflow-hidden flex flex-col transition-colors duration-1000 ${settings.highContrast ? 'grayscale contrast-200' : ''}`} style={{ backgroundColor: getBackground() }}>
      
      {isBooting && <BiosBoot onComplete={() => setIsBooting(false)} />}

      {/* Background Decor */}
      {settings.glitchVisuals && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-wrap gap-2 overflow-hidden select-none">
          {Array.from({ length: 1000 }).map((_, i) => (
            <span key={`glitch-${i}`} className="text-[10px] font-mono">0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
          ))}
        </div>
      )}

      {/* Pets Layer */}
      {pets.map(pet => (
        <DesktopPet key={pet.id} pet={pet} />
      ))}

      {status === GameStatus.RUNNING && (
        <>
          <Desktop 
            onOpenApp={handleAppOpen}
            onOpenVirusExe={() => setStatus(GameStatus.VIRUS_BOSS)}
            onOpenLogs={() => setIsLogsOpen(true)}
            onOpenReadme={() => setIsReadmeOpen(true)}
            onOpenGoogle={() => setIsGoogleOpen(true)}
            onOpenAmazon={() => setIsAmazonOpen(true)}
            onOpenFiles={() => setIsFilesOpen(true)}
            onOpenWorkbench={() => setIsWorkbenchOpen(true)}
            onRecycleLogs={() => {
              setIsLogsRecycled(true);
              unlockAchievement('logs_recycled');
            }}
            onRestoreLogs={() => setIsLogsRecycled(false)}
            onDeleteBin={() => setStatus(GameStatus.BOD_BOSS)}
            onOpenBos={() => setIsBosOpen(true)}
            onOpenDSOD={() => setIsDSODOpen(true)}
            isLogsRecycled={isLogsRecycled}
            isBinDeleted={isBinDeleted}
            isDeleteMode={isDeleteMode}
            onIconDelete={handleIconDelete}
            bosdCount={bosdCount}
            onRecycle={() => {
              handleFullReset();
              unlockAchievement('recycled');
            }}
            computerTier={computerTier}
            theme={theme}
            canBuildAV={collectedParts.size > 0 || bosdCount >= 3}
            animalTheme={animalTheme}
            customApps={customApps}
            onLaunchCustomApp={(app) => {
                setActiveCustomApp(app);
                if (app.type === 'boss') setStatus(GameStatus.CUSTOM_BOSS);
            }}
            visibleIcons={visibleIcons}
            hasRootAccess={hasRootAccess}
          />

          {appState !== AppState.CLOSED && (
            <BOSDApp 
              state={appState} 
              onStateChange={setAppState} 
              onWin={() => handleWin(1, 'BOSD_SHIELD')}
              onClose={() => setAppState(AppState.CLOSED)}
              unlockAchievement={unlockAchievement}
              difficulty={computerTier}
              clipboard={clipboard}
              canPaste={achievements.find(a => a.id === 'paint_face')?.unlocked || false}
              isLogsRecycled={isLogsRecycled}
              theme={theme}
              godMode={isGodMode}
              bossHealth={bosdBossHealth}
              setBossHealth={setBosdBossHealth}
            />
          )}

          {isLogsOpen && <LogsWindow onClose={() => setIsLogsOpen(false)} onCopy={setClipboard} canCopy={achievements.find(a => a.id === 'paint_face')?.unlocked || false} />}
          {isReadmeOpen && <ReadmeWindow onClose={() => setIsReadmeOpen(false)} />}
          {isGoogleOpen && <GoogleWindow onClose={() => setIsGoogleOpen(false)} onSearch={handleCommand} onNavigateToHub={() => setStatus(GameStatus.WINDOWS_HUB)} />}
          {isAmazonOpen && <AmazonApp onClose={() => setIsAmazonOpen(false)} timeLeft={timeLeft} onPurchase={(item) => {
              if (item.id === 'time_freeze') setTimeLeft(prev => prev + 15);
              if (item.id === 'chaos_pack') setPopups(prev => [...prev, ...Array.from({ length: 5 }).map(() => ({ id: Math.random().toString(), x: Math.random() * 80, y: Math.random() * 80 }))]);
              if (item.id === 'damage_boost') setDamageMultiplier(prev => prev * 2);
              if (item.id === 'random_boss') setStatus([GameStatus.VIRUS_BOSS, GameStatus.TITAN_BSD, GameStatus.TRIPLE_VIRUS_BOSS][Math.floor(Math.random() * 3)]);
              if (item.id === 'void_portal') setStatus(GameStatus.GLITCH_BOSS);
          }} />}
          {isFilesOpen && <FilesApp onClose={() => setIsFilesOpen(false)} onTriggerBST={() => setStatus(GameStatus.BST_FINAL_BOSS)} />}
          {isWorkbenchOpen && <AntivirusWorkbench onClose={() => setIsWorkbenchOpen(false)} collectedParts={collectedParts} bosdCount={bosdCount} onBuild={() => setIsAntivirusActive(true)} />}
          {isRegistryOpen && <RegistryWindow settings={settings} onUpdateSettings={setSettings} onClose={() => setIsRegistryOpen(false)} onFullReset={handleFullReset} onSetDeleteMode={setIsDeleteMode} />}
          {isNewYearOpen && <NewYearApp onClose={() => setIsNewYearOpen(false)} onCelebrate={() => setStatus(GameStatus.WON)} />}
          {isArcadeOpen && <ArcadeWindow onClose={() => setIsArcadeOpen(false)} bosdCount={bosdCount} />}
          {isYouTubeOpen && <YouTubeWindow onClose={() => setIsYouTubeOpen(false)} />}
          {isAnimateOpen && <AnimateWindow onClose={() => setIsAnimateOpen(false)} bosdCount={bosdCount} isResearcher={achievements.find(a => a.id === 'googled')?.unlocked || false} />}
          {isPD6Open && <PD6Window onClose={() => setIsPD6Open(false)} bosdCount={bosdCount} onCatch={(type, color) => setPets(prev => [...prev, { id: Date.now().toString(), type, color }])} />}

          {hasSearchedPaint && (
            <MSPaint 
              onClose={() => setHasSearchedPaint(false)} 
              onAchievement={() => {
                unlockAchievement('paint_face');
                setHasSearchedPaint(false);
              }}
              isArtist={bosdCount >= 5}
              onSaveApp={(app) => setCustomApps(prev => [...prev, app])}
            />
          )}
        </>
      )}

      {status === GameStatus.WON && <BOSDScreen onRestart={handleRestart} bosdCount={bosdCount} />}
      {status === GameStatus.CRASHED && <CrashScreen onRestart={handleRestart} />}
      {status === GameStatus.VIRUS_BOSS && <VirusBoss onWin={() => handleWin(2, 'VIRUS_SPIKE')} onFail={() => setStatus(GameStatus.CRASHED)} />}
      {status === GameStatus.WINDOWS_HUB && <WindowsHub onDefeat={() => setStatus(GameStatus.DARK_WEB)} onFail={() => setStatus(GameStatus.CRASHED)} />}
      {status === GameStatus.DARK_WEB && <DarkWeb onWin={() => handleWin(3, 'DARK_CORE')} onFail={() => setStatus(GameStatus.CRASHED)} />}
      {status === GameStatus.TITAN_BSD && <TitanBSDBoss onWin={() => handleWin(5, 'TITAN_PLATE')} onFail={() => setStatus(GameStatus.CRASHED)} computerTier={computerTier} theme={theme} />}
      {status === GameStatus.TRIPLE_VIRUS_BOSS && <VirusTripleBoss onWin={() => handleWin(10, 'CHIMERA_CLAW')} onFail={() => setStatus(GameStatus.CRASHED)} />}
      {status === GameStatus.BOD_BOSS && <BODBoss hp={bodBossHealth} setHp={setBodBossHealth} onWin={() => handleWin(15)} onFail={() => setStatus(GameStatus.CRASHED)} isBlasterEquipped={isBlasterEquipped} isLogsRecycled={isLogsRecycled} godMode={isGodMode} />}
      {status === GameStatus.INTERNET_BOSS && <InternetBoss onWin={() => handleWin(20)} onFail={() => setStatus(GameStatus.CRASHED)} isBlasterEquipped={isBlasterEquipped} playerDamage={isLogsRecycled ? 100 : 10} />}
      {status === GameStatus.GLITCH_BOSS && <GlitchBoss hp={glitchBossHealth} setHp={setGlitchBossHealth} onWin={() => handleWin(50)} onFail={() => setStatus(GameStatus.CRASHED)} isBlasterEquipped={isBlasterEquipped} playerDamage={isLogsRecycled ? 500 : 50} />}
      {status === GameStatus.BST_FINAL_BOSS && <BSTFinalBoss onWin={() => handleWin(100)} onFail={() => setStatus(GameStatus.CRASHED)} />}
      {status === GameStatus.ULTIMATE_VICTORY && <UltimateVictoryScreen onRestart={handleRestart} onFullReset={handleFullReset} onBackToDesktop={() => setStatus(GameStatus.RUNNING)} bosdCount={bosdCount} />}
      {status === GameStatus.CUSTOM_BOSS && activeCustomApp?.bossStats && <CustomBossContainer stats={activeCustomApp.bossStats} icon={activeCustomApp.iconData} onWin={() => handleWin(5)} onFail={() => setStatus(GameStatus.CRASHED)} isBlasterEquipped={isBlasterEquipped} playerDamage={isLogsRecycled ? 100 : 25} />}
      {status === GameStatus.DSOD_BOSS && <DSODApp onClose={() => setStatus(GameStatus.RUNNING)} onWin={() => handleWin(5)} />}
      {isDarkWebHubOpen && <DarkWebHub onClose={() => setIsDarkWebHubOpen(false)} onLaunchBoss={(bossStatus) => { setStatus(bossStatus); setIsDarkWebHubOpen(false); }} />}

      {/* Popups */}
      {popups.map(p => (
        <VirusPopup key={p.id} x={p.x} y={p.y} onClose={() => setPopups(prev => prev.filter(v => v.id !== p.id))} />
      ))}

      {/* Taskbar */}
      {status === GameStatus.RUNNING && (
        <Taskbar 
          onSearchPaint={() => setHasSearchedPaint(true)} 
          onCommand={handleCommand}
          onVolumeClick={() => alert("Volume controller corrupted by kernel jump.")}
          onDeleteWindowsIcon={() => setStatus(GameStatus.BOD_BOSS)}
          canDeleteWindowsIcon={bosdCount >= 5}
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
      )}

      {/* Global Modals */}
      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} onSpawnInternet={() => setStatus(GameStatus.INTERNET_BOSS)} onFullReset={handleFullReset} />}
      {showFinalChoice && <FinalWinDialog onWin={() => setStatus(GameStatus.ULTIMATE_VICTORY)} onContinue={() => { setShowFinalChoice(false); setHasDeclinedWin(true); }} />}
      {isDeleteMode && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-4 py-2 rounded-full font-black flex items-center gap-3 animate-bounce border-2 border-white shadow-2xl">
           <Trash2 className="w-5 h-5" /> 
           SYSTEM_PURGE_MODE: ACTIVE (CLICK ICONS)
           <button onClick={() => setIsDeleteMode(false)} className="bg-white text-red-600 rounded-full p-1 hover:scale-110"><X className="w-4 h-4"/></button>
        </div>
      )}
    </div>
  );
};

export default App;