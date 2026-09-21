"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Accessibility,
  AudioLines,
  Brain,
  CircleUserRound,
  Contrast,
  Eye,
  ImageOff,
  Info,
  Languages,
  Link2,
  MousePointer2,
  PauseCircle,
  RotateCcw,
  Settings2,
  Sparkles,
  Target,
  TextCursorInput,
  Type,
  X,
} from "lucide-react";

const profiles = [
  ["Motor Impaired", Accessibility],
  ["Blind", AudioLines],
  ["Color Blind", Sparkles],
  ["Dyslexia", Type],
  ["Low vision", Eye],
  ["Cognitive & Learning", Brain],
  ["Seizure & Epileptic", Brain],
  ["ADHD", Target],
] as const;

const tools = [
  ["Screen Reader", AudioLines],
  ["Contrast +", Contrast],
  ["Smart Contrast", Contrast],
  ["Highlight Links", Link2],
  ["Bigger Text", Type],
  ["Text Spacing", TextCursorInput],
  ["Pause Animations", PauseCircle],
  ["Hide Images", ImageOff],
  ["Dyslexia Friendly", Type],
  ["Cursor", MousePointer2],
  ["Tooltips", Info],
  ["Page Structure", LayersIcon],
  ["Line Height", TextCursorInput],
  ["Text Align", AlignIcon],
  ["Dictionary", Languages],
  ["Saturation", Sparkles],
] as const;

function LayersIcon({ className }: { className?: string }) {
  return <Settings2 className={className} />;
}

function AlignIcon({ className }: { className?: string }) {
  return <Type className={className} />;
}

export function AccessibilityWidgetPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOversized, setIsOversized] = useState(false);

  return (
    <div className="  fixed bottom-5 right-5 z-[80] sm:bottom-7 sm:right-7">
      {isOpen && (
        <div className={`absolute bottom-[calc(100%+14px)] right-0 flex h-[min(760px,calc(100vh-100px))] ${isOversized ? "w-[min(500px,calc(100vw-24px))]" : "w-[min(430px,calc(100vw-24px))]"} flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#f1f2f6] shadow-[0_24px_70px_rgba(15,23,42,0.28)]`}>
          <div className="flex shrink-0 items-center justify-between bg-[#f04a0b] px-5 py-4 text-white">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Accessibility className="h-6 w-6" />
              Accessibility Menu (CTRL+U)
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close accessibility menu" className="rounded-full bg-black/20 p-1.5 transition-colors hover:bg-black/30">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="overflow-y-auto px-4 pb-5 pt-4">
            <section className="pt-5">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><CircleUserRound className="h-7 w-7" /> Accessibility Profiles <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs"><Info className="h-3.5 w-3.5" /></span></div>
              <div className="grid grid-cols-2 gap-3">
                {profiles.map(([label, Icon]) => <button type="button" key={label} className={`flex ${isOversized ? "min-h-24 text-lg" : "min-h-20 text-base"} items-center gap-3 rounded-2xl bg-white px-4 text-left text-slate-900 shadow-sm`}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100"><Icon className="h-6 w-6" /></span>{label}</button>)}
              </div>
            </section>

            <section className="mt-7 border-t border-slate-300 pt-4">
              <div className="mb-4 flex items-center justify-between text-lg font-semibold text-slate-900">
                <span className="flex items-center gap-2"><span className="text-2xl font-normal">XL</span> Oversized Widget</span>
                <button type="button" role="switch" aria-checked={isOversized} aria-label="Toggle oversized widget" onClick={() => setIsOversized(!isOversized)} className={`flex h-9 w-16 items-center rounded-full border-2 p-1 transition-colors ${isOversized ? "justify-end border-[#f04a0b] bg-[#f04a0b]" : "justify-start border-slate-500 bg-slate-700"}`}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"><span className="text-lg leading-none">{isOversized ? "✓" : "×"}</span></span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {tools.map(([label, Icon]) => <button type="button" key={label} className={`flex ${isOversized ? "min-h-36 text-base" : "min-h-28 text-sm"} flex-col items-center justify-center gap-3 rounded-2xl bg-white px-2 text-center font-semibold text-slate-900 shadow-sm`}><Icon className={`${isOversized ? "h-11 w-11" : "h-9 w-9"} stroke-[1.7]`} />{label}</button>)}
              </div>
            </section>

            <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f04a0b] px-4 py-3 font-semibold text-white"><RotateCcw className="h-5 w-5" /> Reset All Accessibility Settings</button>
            <div className="mt-5 flex items-center gap-3 border-t border-slate-300 pt-4 text-sm font-semibold text-slate-900"><Settings2 className="h-7 w-7 rounded-full bg-[#f04a0b] p-1 text-white" /> Move/Hide Accessibility Widget</div>
          </div>
        </div>
      )}

      <button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Open accessibility menu" className="rounded-full p-1">

        <span className="flex h-full w-full items-center justify-center ">

          <Image
                                          src="/images/logo.png"
                                          alt="Access"
                                          width={144}
                                          height={144}
                                          className="h-[72px] w-[72px] object-contain"
                                      />
        </span>
      </button>
    </div>
  );
}
