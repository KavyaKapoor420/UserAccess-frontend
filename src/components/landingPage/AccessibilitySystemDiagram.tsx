"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  Accessibility,
  BarChart3,
  Code2,
  Database,
  FileText,
  Globe2,
  Languages,
  Settings2,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { AnimatedBeam } from "./AnimatedBeam";

type NodeProps = { icon: ReactNode; children: ReactNode; popover?: string };

function InfoNode({ icon, children, popover }: NodeProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={() => popover && setOpen(!open)}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 shadow-[0_4px_15px_rgba(148,163,184,0.55)] transition-transform hover:scale-105"
        aria-label={popover ? "Show system detail" : undefined}
      >
        {icon}
      </button>
      {children}
      {open && popover && (
        <div className="absolute left-14 top-0 z-50 w-64 rounded-xl border border-slate-100 bg-white p-4 text-left text-xs leading-relaxed text-slate-600 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          {popover}
        </div>
      )}
    </div>
  );
}

function WorkflowCard({ title, items = [] }: { title: string; items?: string[] }) {
  return (
    <div className="w-[210px]">
      <div className="relative z-10 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
        <span className="text-xs font-semibold text-slate-800">{title}</span>
      </div>
      {items.length > 0 && (
        <div className="ml-7 border-l border-dashed border-slate-300 pl-4 pt-2 text-left">
          {items.map((item) => (
            <div key={item} className="relative mb-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] leading-tight text-slate-500 shadow-[0_2px_8px_rgba(15,23,42,0.03)] last:mb-0">
              <span className="absolute -left-[17px] top-1/2 h-px w-4 border-t border-dashed border-slate-300" />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SystemCard({ title, subtitle, icon }: { title: string; subtitle: string; icon: ReactNode }) {
  return (
    <div className="flex w-max items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5 pr-3 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50">{icon}</div>
      <div className="text-left"><div className="text-sm font-medium text-slate-800">{title}</div><div className="text-xs font-medium text-slate-500">{subtitle}</div></div>
    </div>
  );
}

export function AccessibilitySystemDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = {
    visitor: useRef<HTMLDivElement>(null),
    website: useRef<HTMLDivElement>(null),
    local: useRef<HTMLDivElement>(null),
    assistive: useRef<HTMLDivElement>(null),
    memory: useRef<HTMLDivElement>(null),
    report: useRef<HTMLDivElement>(null),
    engine: useRef<HTMLDivElement>(null),
    improvement: useRef<HTMLDivElement>(null),
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-1 flex items-center justify-end gap-1 text-xs text-slate-400">*Click on <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> to know more!</div>
      <div ref={containerRef} className="relative min-h-[560px] overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/50 p-8">
        <div className="relative z-10 flex min-w-[760px] flex-col gap-14">
          <div className="flex items-start justify-around">
            <div ref={refs.visitor}><InfoNode icon={<Accessibility className="h-5 w-5" />} popover="Visitors choose the accessibility tools that fit how they browse."><WorkflowCard title="Starts browsing" items={["Chooses accessibility profile", "Opens widget controls"]} /></InfoNode></div>
            <div className="flex flex-col items-center gap-24">
              <div ref={refs.website}><InfoNode icon={<Globe2 className="h-5 w-5" />}><WorkflowCard title="Website experience" /></InfoNode></div>
              <div className="flex gap-10">
                <div ref={refs.local}><InfoNode icon={<ShieldCheck className="h-5 w-5" />} popover="These adjustments run locally in the browser for quick, private interaction."><WorkflowCard title="Local adjustments" items={["Runs in the browser", "Keeps interaction quick and private"]} /></InfoNode></div>
                <div ref={refs.assistive}><InfoNode icon={<Volume2 className="h-5 w-5" />}><WorkflowCard title="Assistive layer" items={["Text-to-speech and reading tools", "Guides keyboard navigation"]} /></InfoNode></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]"><div className="border-b border-slate-100 px-4 py-2 text-center text-xs font-semibold text-slate-800">settings</div><div className="space-y-2 p-3 text-[11px] text-slate-500"><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />language</p><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-300" />profile</p><p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-300" />preferences</p></div></div>
          </div>
          <div className="flex items-start justify-around gap-10">
            <div ref={refs.memory}><InfoNode icon={<Database className="h-5 w-5 text-emerald-600" />}><SystemCard title="Preference memory" subtitle="Visitor choices" icon={<Database className="h-4 w-4 text-emerald-600" />} /></InfoNode></div>
            <div ref={refs.report}><InfoNode icon={<FileText className="h-5 w-5 text-orange-500" />}><SystemCard title="Accessibility report" subtitle="Improvement summary" icon={<FileText className="h-4 w-4 text-orange-500" />} /></InfoNode></div>
            <div ref={refs.engine}><InfoNode icon={<Code2 className="h-5 w-5 text-cyan-500" />} popover="The widget engine coordinates tools, language, and profiles for each visitor."><SystemCard title="Widget engine" subtitle="Orchestration" icon={<Code2 className="h-4 w-4 text-cyan-500" />} /></InfoNode></div>
          </div>
          <div className="flex justify-center" ref={refs.improvement}><InfoNode icon={<BarChart3 className="h-5 w-5 text-fuchsia-600" />}><WorkflowCard title="Continuous improvement" items={["Helps teams understand accessibility needs"]} /></InfoNode></div>
        </div>
        <AnimatedBeam containerRef={containerRef} fromRef={refs.visitor} toRef={refs.website} pathType="straight-horizontal" duration={3} startAnchor="top" startYOffset={68} endAnchor="top" />
        <AnimatedBeam containerRef={containerRef} fromRef={refs.website} toRef={refs.local} duration={3} />
        <AnimatedBeam containerRef={containerRef} fromRef={refs.website} toRef={refs.assistive} duration={3} />
        <AnimatedBeam containerRef={containerRef} fromRef={refs.local} toRef={refs.report} duration={4} />
        <AnimatedBeam containerRef={containerRef} fromRef={refs.assistive} toRef={refs.engine} duration={3} />
        <AnimatedBeam containerRef={containerRef} fromRef={refs.engine} toRef={refs.report} duration={3} />
        <AnimatedBeam containerRef={containerRef} fromRef={refs.report} toRef={refs.improvement} duration={4} reverse />
        <AnimatedBeam containerRef={containerRef} fromRef={refs.improvement} toRef={refs.memory} duration={4} />
        <AnimatedBeam containerRef={containerRef} fromRef={refs.memory} toRef={refs.website} duration={5} pathType="l-shape-up-right" />
      </div>
      <p className="mt-5 text-xs leading-relaxed text-slate-500">UserAccess is designed as a practical accessibility system: preferences begin with the visitor, adjustments happen close to the page, and teams get a clearer path from everyday accessibility needs to measurable improvement.</p>
    </div>
  );
}
