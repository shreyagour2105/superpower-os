import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Cpu,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  FORTUNE_MESSAGES,
  SCRATCH_CARDS,
  VENDING_ITEMS,
  VendingCategory,
  VendingItem,
} from '../data/portfolioData';

export const InteractiveLabSection: React.FC = () => {
  // --- 1. Superpower Vending Machine State ---
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | VendingCategory>('ALL');
  const [dispensedItem, setDispensedItem] = useState<VendingItem>(VENDING_ITEMS[0]);
  const [isDispensing, setIsDispensing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispenseCount, setDispenseCount] = useState(1);

  const filteredItems =
    selectedCategory === 'ALL'
      ? VENDING_ITEMS
      : VENDING_ITEMS.filter((item) => item.category === selectedCategory);

  const handleGenerateSuperpower = () => {
    setIsDispensing(true);
    const pool = filteredItems.length > 0 ? filteredItems : VENDING_ITEMS;
    const candidates = pool.filter((i) => i.id !== dispensedItem.id);
    const source = candidates.length > 0 ? candidates : pool;
    const picked = source[Math.floor(Math.random() * source.length)];

    setTimeout(() => {
      setDispensedItem(picked);
      setDispenseCount((c) => c + 1);
      setIsDispensing(false);
    }, 180);
  };

  const handleCopyFact = async () => {
    const text = `[SUPERPOWER.OS // ${dispensedItem.category}] ${dispensedItem.title}: ${dispensedItem.description}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(dispensedItem.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(dispensedItem.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // --- 2. Digital Scratch Card State ---
  const [cardIndex, setCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const currentScratchCard = SCRATCH_CARDS[cardIndex % SCRATCH_CARDS.length];

  const initScratchFoil = useCallback(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#1b262d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pattern on foil
    ctx.strokeStyle = '#2d3f4a';
    ctx.lineWidth = 1;
    for (let x = -canvas.height; x < canvas.width; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + canvas.height, canvas.height);
      ctx.stroke();
    }

    ctx.fillStyle = '#00f57a';
    ctx.font = 'bold 12px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ENCRYPTED FOIL LAYER // SCRATCH TO DECRYPT', canvas.width / 2, canvas.height / 2 - 6);
    ctx.fillStyle = '#a8b5bd';
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillText('Drag cursor/finger across surface or click REVEAL below', canvas.width / 2, canvas.height / 2 + 16);

    setScratchPercent(0);
    setIsRevealed(false);
  }, []);

  useEffect(() => {
    initScratchFoil();
  }, [cardIndex, initScratchFoil]);

  const scratchAtPoint = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    // Sample alpha channel every scratch stroke (low CPU stride)
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentPixels = 0;
    let totalSampled = 0;
    for (let i = 3; i < imgData.length; i += 64) {
      totalSampled++;
      if (imgData[i] < 128) transparentPixels++;
    }
    const pct = Math.min(100, Math.round((transparentPixels / Math.max(1, totalSampled)) * 100));
    setScratchPercent(pct);
    if (pct >= 48) {
      setIsRevealed(true);
    }
  };

  // --- 3. Virtual Fortune Cookie State ---
  const [fortuneIdx, setFortuneIdx] = useState(0);
  const [cookieCracked, setCookieCracked] = useState(false);

  const handleCrackCookie = () => {
    if (!cookieCracked) {
      setCookieCracked(true);
    } else {
      const nextIdx = (fortuneIdx + 1) % FORTUNE_MESSAGES.length;
      setFortuneIdx(nextIdx);
      setCookieCracked(true);
    }
  };

  const categories: Array<'ALL' | VendingCategory> = [
    'ALL',
    'SKILL',
    'PROJECT',
    'ACHIEVEMENT',
    'FUN FACT',
    'CURRENT MISSION',
  ];

  return (
    <div className="space-y-8">
      {/* Feature 3: Superpower Vending Machine */}
      <div
        className="os-panel border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-5 sm:p-7"
        style={{ boxShadow: 'var(--shadow-panel)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[var(--border-color)]">
          <div>
            <div className="font-mono-code text-xs uppercase tracking-widest text-[var(--accent-primary)]">
              MODULE 03 · AUTOMATED FACT DISPENSER
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mt-1">
              Superpower Vending Machine
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Select a category slot or press <span className="font-mono-code text-[var(--text-primary)]">GENERATE SUPERPOWER</span> to dispense a verified portfolio fact.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div
            role="group"
            aria-label="Filter vending machine categories"
            className="flex flex-wrap gap-1.5"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 text-xs font-mono-code border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] font-bold'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
          {/* Left: Vending Slot Grid */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)] border-b border-[var(--border-color)] pb-2">
              <span>SLOT MATRIX · READY</span>
              <span>DISPENSED #{dispenseCount}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {VENDING_ITEMS.map((item) => {
                const isSelected = dispensedItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDispensedItem(item);
                      setDispenseCount((c) => c + 1);
                    }}
                    aria-label={`Select vending slot ${item.slot}: ${item.title}`}
                    className={`p-2.5 border text-left font-mono-code transition-all ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--text-primary)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-secondary)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--accent-primary)]">
                      {item.slot}
                    </div>
                    <div className="text-[10px] truncate mt-0.5">{item.category}</div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleGenerateSuperpower}
              className="w-full py-3.5 px-4 bg-[var(--accent-primary)] text-black font-mono-code text-xs sm:text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>GENERATE SUPERPOWER</span>
            </button>
          </div>

          {/* Right: Dispensed Reveal Card */}
          <div className="lg:col-span-7 border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-mono-code text-[var(--text-muted)]">
                <span>
                  SLOT {dispensedItem.slot} · {dispensedItem.category}
                </span>
                <span>VERIFIED RECORD</span>
              </div>

              <h4
                data-testid="vending-card-title"
                className={`text-lg sm:text-xl font-bold text-[var(--text-primary)] transition-opacity ${
                  isDispensing ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {dispensedItem.title}
              </h4>

              <p
                data-testid="vending-card-desc"
                className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
              >
                {dispensedItem.description}
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleGenerateSuperpower}
                className="px-3.5 py-2 border border-[var(--border-strong)] hover:border-[var(--accent-primary)] font-mono-code text-xs uppercase tracking-wider flex items-center gap-1.5 text-[var(--text-primary)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>DISPENSE ANOTHER</span>
              </button>

              <button
                type="button"
                onClick={handleCopyFact}
                aria-label="Copy dispensed fact to clipboard"
                className="px-3.5 py-2 border border-[var(--border-color)] hover:border-[var(--accent-secondary)] font-mono-code text-xs uppercase tracking-wider flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {copiedId === dispensedItem.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY FACT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 4 & Feature 5 Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature 4: Digital Scratch Card */}
        <div
          className="os-panel border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-5 sm:p-6 flex flex-col justify-between space-y-5"
          style={{ boxShadow: 'var(--shadow-panel)' }}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono-code text-[var(--accent-secondary)]">
              <span>MODULE 04 · DIGITAL SCRATCH CARD</span>
              <span>DECRYPTED: {isRevealed ? '100%' : `${scratchPercent}%`}</span>
            </div>
            <h3 className="text-xl font-bold">Classified Builder Insight</h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Scratch the metallic foil with your mouse or finger, or use the accessible{' '}
              <span className="font-mono-code text-[var(--text-primary)]">REVEAL</span> button.
            </p>
          </div>

          {/* Scratchable Area */}
          <div className="relative border border-[var(--border-strong)] bg-[var(--bg-primary)] p-5 min-h-[170px] flex flex-col justify-center overflow-hidden">
            <div className="space-y-2 z-10">
              <div className="font-mono-code text-xs text-[var(--accent-primary)]">
                {currentScratchCard.label}
              </div>
              <h4
                data-testid="scratch-card-headline"
                className="text-lg font-bold text-[var(--text-primary)]"
              >
                {currentScratchCard.headline}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {currentScratchCard.message}
              </p>
              <div className="text-xs font-mono-code text-[var(--text-muted)] pt-1">
                {currentScratchCard.subtext}
              </div>
            </div>

            {!isRevealed && (
              <canvas
                ref={scratchCanvasRef}
                width={520}
                height={180}
                aria-label="Interactive scratch card foil surface"
                onPointerDown={(e) => {
                  isDrawingRef.current = true;
                  scratchAtPoint(e.clientX, e.clientY);
                }}
                onPointerMove={(e) => {
                  if (!isDrawingRef.current) return;
                  scratchAtPoint(e.clientX, e.clientY);
                }}
                onPointerUp={() => {
                  isDrawingRef.current = false;
                }}
                onPointerLeave={() => {
                  isDrawingRef.current = false;
                }}
                className="absolute inset-0 w-full h-full z-20 cursor-crosshair touch-none"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRevealed(true);
                setScratchPercent(100);
              }}
              className="px-4 py-2 bg-[var(--accent-secondary)] text-black font-mono-code text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>REVEAL MESSAGE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCardIndex((c) => c + 1);
              }}
              className="px-3.5 py-2 border border-[var(--border-color)] hover:border-[var(--accent-primary)] font-mono-code text-xs uppercase tracking-wider flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>NEXT CARD ({((cardIndex + 1) % SCRATCH_CARDS.length) + 1}/{SCRATCH_CARDS.length})</span>
            </button>
          </div>
        </div>

        {/* Feature 5: Virtual Fortune Cookie */}
        <div
          className="os-panel border border-[var(--border-strong)] bg-[var(--bg-secondary)] p-5 sm:p-6 flex flex-col justify-between space-y-5"
          style={{ boxShadow: 'var(--shadow-panel)' }}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono-code text-[var(--accent-tertiary)]">
              <span>MODULE 05 // VIRTUAL FORTUNE COOKIE</span>
              <span>MOTTO #{fortuneIdx + 1}</span>
            </div>
            <h3 className="text-xl font-bold">Cybersecurity &amp; Systems Fortune</h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Crack open a virtual fortune cookie for an original engineering or debugging motto.
            </p>
          </div>

          <div className="border border-[var(--border-strong)] bg-[var(--bg-primary)] p-5 min-h-[170px] flex flex-col items-center justify-center text-center space-y-4">
            {/* Custom SVG Fortune Cookie Visual */}
            <button
              type="button"
              onClick={handleCrackCookie}
              aria-label="Crack virtual fortune cookie"
              className="group focus:outline-none flex flex-col items-center gap-2 cursor-pointer"
            >
              <svg
                viewBox="0 0 120 64"
                className="w-28 h-14 transition-transform group-hover:scale-105"
                aria-hidden="true"
              >
                {!cookieCracked ? (
                  <path
                    d="M25 48 C15 24, 45 8, 60 22 C75 8, 105 24, 95 48 C82 54, 68 42, 60 40 C52 42, 38 54, 25 48 Z"
                    fill="none"
                    stroke="var(--accent-warn)"
                    strokeWidth="3"
                  />
                ) : (
                  <>
                    <path
                      d="M14 48 C6 26, 32 10, 48 24 L42 46 Z"
                      fill="none"
                      stroke="var(--accent-warn)"
                      strokeWidth="3"
                    />
                    <path
                      d="M106 48 C114 26, 88 10, 72 24 L78 46 Z"
                      fill="none"
                      stroke="var(--accent-warn)"
                      strokeWidth="3"
                    />
                    <rect
                      x="38"
                      y="18"
                      width="44"
                      height="20"
                      fill="#f8fafc"
                      stroke="var(--accent-primary)"
                      strokeWidth="1.5"
                    />
                  </>
                )}
              </svg>
            </button>

            {cookieCracked ? (
              <div
                data-testid="fortune-text"
                className="w-full max-w-md bg-[var(--bg-elevated)] border-l-4 border-[var(--accent-primary)] px-4 py-3 text-left"
              >
                <div className="font-mono-code text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                  SYSTEM FORTUNE SLIP // DECRYPTED
                </div>
                <p className="font-mono-code text-sm sm:text-base font-medium text-[var(--text-primary)] mt-1">
                  “{FORTUNE_MESSAGES[fortuneIdx]}”
                </p>
              </div>
            ) : (
              <div className="font-mono-code text-xs text-[var(--text-muted)]">
                Cookie intact. Click the cookie or the button below to reveal your fortune.
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={handleCrackCookie}
              className="px-4 py-2 bg-[var(--accent-primary)] text-black font-mono-code text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cookieCracked ? 'GENERATE ANOTHER FORTUNE' : 'OPEN FORTUNE COOKIE'}</span>
            </button>

            {cookieCracked && (
              <button
                type="button"
                onClick={() => setCookieCracked(false)}
                className="px-3 py-2 border border-[var(--border-color)] font-mono-code text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                FOLD COOKIE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
