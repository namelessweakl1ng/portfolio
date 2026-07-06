"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCRTStore } from "@/hooks/useCRTStore";
import { useSound } from "@/hooks/useSound";

/**
 * EasterEggs.tsx
 * ----------------------------------------------------------------------------
 * Hidden interactions woven into the monitor:
 *   • Konami code (↑↑↓↓←→←→ B A) → the CRT CAT wakes up.
 *   • Press R (when not typing) → fake ROOT SHELL with a fake filesystem.
 *   • Random key presses occasionally trigger a tiny glitch response.
 *   • A random secret message flashes every ~25-45s.
 *   • ACCESS DENIED / ROOT ACCESS GRANTED flavor.
 *
 * Also renders the global <GlitchOverlay> that surfaces flashGlitch() msgs.
 * ----------------------------------------------------------------------------
 */

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function EasterEggs() {
  const { rootMode, setRootMode, flashGlitch } = useCRTStore();
  const { play } = useSound();
  const konamiIdx = useRef(0);
  const [catOn, setCatOn] = useState(false);

  // Konami + R + random glitch
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

      // Konami tracking (works even while typing — it's a secret)
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[konamiIdx.current]) {
        konamiIdx.current += 1;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          setCatOn(true);
          play("beep");
          flashGlitch("ROOT ACCESS GRANTED");
          setTimeout(() => setCatOn(false), 7000);
        }
      } else {
        konamiIdx.current = key === KONAMI[0] ? 1 : 0;
      }

      // R → root shell (not while typing in our own terminal input)
      if (!typing && e.key.toLowerCase() === "r" && !rootMode) {
        e.preventDefault();
        setRootMode(true);
        play("relayClick");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rootMode, setRootMode, play, flashGlitch]);

  return (
    <>
      <GlitchOverlay />
      <AnimatePresence>{catOn && <CrtCat />}</AnimatePresence>
      <AnimatePresence>{rootMode && <RootShell />}</AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Glitch overlay — flashes store.glitchMessage                         */
/* ------------------------------------------------------------------ */
function GlitchOverlay() {
  const glitchMessage = useCRTStore((s) => s.glitchMessage);
  return (
    <AnimatePresence>
      {glitchMessage && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <div
            className="border border-[var(--crt-cyan)] bg-black px-8 py-4 font-mono-crt text-lg tracking-[0.3em] text-[var(--crt-cyan)] text-glow-cyan sm:text-2xl"
            style={{ boxShadow: "0 0 30px rgba(0,229,255,0.4)" }}
          >
            {glitchMessage}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* CRT CAT — the ASCII cat that wakes up with the Konami code          */
/* ------------------------------------------------------------------ */
function CrtCat() {
  return (
    <motion.div
      className="pointer-events-none fixed bottom-20 right-6 z-[85] sm:bottom-24 sm:right-12"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4 }}
    >
      <pre className="font-mono-crt text-[10px] leading-tight text-[var(--crt-green)] text-glow sm:text-xs">
{`  /\\_/\\
 ( o.o )  < MEOW.
  > ^ <    THE PHOSPHOR REMEMBERS.
 /|   |\\
(_|   |_)`}
      </pre>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* ROOT SHELL — fake terminal with a fake filesystem                   */
/* ------------------------------------------------------------------ */
type FSNode =
  | { type: "dir"; children: Record<string, FSNode> }
  | { type: "file"; content: string };

const FS: FSNode = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        "kai.ardent": {
          type: "dir",
          children: {
            "readme.txt": {
              type: "file",
              content:
                "YOU FOUND THE SHELL.\nNOTHING HERE IS HIDDEN. EVERYTHING HERE IS WAITING.\nTRY: cat /secrets/flag",
            },
            "manifesto.txt": {
              type: "file",
              content:
                "BUILD THINGS THAT SHOULD EXIST.\nBREAK THINGS THAT SHOULDN'T.\nUNDERSTAND EVERYTHING IN BETWEEN.",
            },
          },
        },
      },
    },
    secrets: {
      type: "dir",
      children: {
        flag: {
          type: "file",
          content:
            "FLAG{THE_MACHINE_IS_WATCHING_BACK}\nYOU WERE NEVER ALONE IN HERE.",
        },
        "message.log": {
          type: "file",
          content:
            "1983-11-04 02:11: UNIT T-07 LAST ACTIVE.\n1983-11-04 02:14: FACILITY EVACUATED.\n1983-11-04 02:14: SIGNAL NEVER STOPPED.",
        },
      },
    },
    etc: {
      type: "dir",
      children: {
        hostname: { type: "file", content: "terminal-07\n" },
        "os-release": {
          type: "file",
          content: 'NAME="Blackwood CRT OS"\nVERSION="1983.11"\n',
        },
      },
    },
    bin: { type: "dir", children: {} },
  },
};

function resolvePath(cwd: string[], input: string): string[] | null {
  let parts: string[];
  if (input.startsWith("/")) parts = input.slice(1).split("/").filter(Boolean);
  else parts = [...cwd, ...input.split("/").filter(Boolean)];
  const out: string[] = [];
  for (const p of parts) {
    if (p === ".") continue;
    if (p === "..") out.pop();
    else out.push(p);
  }
  return out;
}

function getNode(path: string[]): FSNode | null {
  let node: FSNode = FS;
  for (const p of path) {
    if (node.type !== "dir") return null;
    const next = node.children[p];
    if (!next) return null;
    node = next;
  }
  return node;
}

function RootShell() {
  const { setRootMode, flashGlitch } = useCRTStore();
  const { play } = useSound();
  const [cwd, setCwd] = useState<string[]>(["home", "kai.ardent"]);
  const [history, setHistory] = useState<{ kind: "in" | "out"; text: string }[]>([
    { kind: "out", text: "BLACKWOOD CRT OS [VERSION 1983.11]" },
    { kind: "out", text: "(c) BLACKWOOD CYBERNETICS LAB. ALL RIGHTS ECHOED." },
    { kind: "out", text: "ROOT SHELL ENGAGED · TYPE 'help' FOR COMMANDS." },
    { kind: "out", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  const prompt = `root@terminal-07:/${cwd.join("/")}$`;

  const run = (raw: string) => {
    const line = raw.trim();
    setHistory((h) => [...h, { kind: "in", text: `${prompt} ${line}` }]);
    if (line) setCmdHist((c) => [...c, line]);
    setHistIdx(-1);
    const [cmd, ...args] = line.split(/\s+/);
    const out: string[] = [];

    switch (cmd) {
      case "":
        break;
      case "help":
        out.push(
          "AVAILABLE COMMANDS:",
          "  help        list commands",
          "  ls [path]   list directory",
          "  cd <path>   change directory",
          "  cat <file>  print file",
          "  pwd         print working directory",
          "  whoami      print user",
          "  uname       print system info",
          "  date        print date",
          "  echo <txt>  print text",
          "  tree        show filesystem",
          "  clear       clear screen",
          "  exit        close shell"
        );
        break;
      case "ls": {
        const target = args[0]
          ? resolvePath(cwd, args[0])
          : cwd;
        if (!target) {
          out.push(`ls: cannot access '${args[0]}': NO SUCH FILE`);
          break;
        }
        const node = getNode(target);
        if (!node) out.push(`ls: ${args[0] || "."}: NO SUCH FILE`);
        else if (node.type === "dir")
          out.push(
            Object.keys(node.children)
              .map((k) => (node.children[k].type === "dir" ? k + "/" : k))
              .join("   ") || "(empty)"
          );
        else out.push(args[0] || ".");
        break;
      }
      case "cd": {
        if (!args[0] || args[0] === "~") {
          setCwd(["home", "kai.ardent"]);
          break;
        }
        const target = resolvePath(cwd, args[0]);
        if (!target) {
          out.push(`cd: ${args[0]}: NO SUCH FILE`);
          break;
        }
        const node = getNode(target);
        if (!node) out.push(`cd: ${args[0]}: NO SUCH FILE`);
        else if (node.type !== "dir") out.push(`cd: ${args[0]}: NOT A DIRECTORY`);
        else setCwd(target);
        break;
      }
      case "cat": {
        if (!args[0]) {
          out.push("cat: MISSING OPERAND");
          break;
        }
        const target = resolvePath(cwd, args[0]);
        const node = target && getNode(target);
        if (!node) out.push(`cat: ${args[0]}: NO SUCH FILE`);
        else if (node.type !== "file") out.push(`cat: ${args[0]}: IS A DIRECTORY`);
        else out.push(...node.content.split("\n"));
        break;
      }
      case "pwd":
        out.push("/" + cwd.join("/"));
        break;
      case "whoami":
        out.push("root");
        break;
      case "uname":
        out.push("Blackwood CRT OS 1983.11 #1 CRT-SMP x86_phosphor");
        break;
      case "date":
        out.push(new Date().toString().toUpperCase());
        break;
      case "echo":
        out.push(args.join(" "));
        break;
      case "tree":
        out.push(...tree(FS, "", []));
        break;
      case "sudo":
        out.push("root@terminal-07: YOU ARE ALREADY ROOT. ALWAYS WERE.");
        flashGlitch("ROOT ACCESS GRANTED");
        play("beep");
        break;
      case "clear":
        setHistory([]);
        return;
      case "exit":
        setRootMode(false);
        play("relayClick");
        return;
      case "rm":
      case "rm-rf":
        out.push(`rm: OPERATION DENIED · THE MACHINE PROTECTS ITSELF.`);
        flashGlitch("ACCESS DENIED");
        play("denied");
        break;
      default:
        out.push(`${cmd}: COMMAND NOT FOUND · TRY 'help'`);
        play("denied");
    }
    setHistory((h) => [...h, ...out.map((t) => ({ kind: "out" as const, text: t }))]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
      play("keyClick");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHist.length) {
        const ni = histIdx === -1 ? cmdHist.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(ni);
        setInput(cmdHist[ni]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const ni = histIdx + 1;
      if (ni >= cmdHist.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(ni);
        setInput(cmdHist[ni]);
      }
    } else if (e.key === "Escape") {
      setRootMode(false);
      play("relayClick");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-3 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setRootMode(false);
        play("relayClick");
      }}
    >
      <motion.div
        className="relative flex h-full max-h-[88vh] w-full max-w-3xl flex-col border border-[var(--crt-green)] bg-black"
        initial={{ scale: 0.98, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 0 40px rgba(0,255,102,0.25)" }}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-[var(--crt-green)] border-opacity-40 px-3 py-1.5 font-mono-crt text-[10px] tracking-[0.3em] text-[var(--crt-green)] text-glow sm:text-xs">
          <span>ROOT SHELL · TERMINAL_07</span>
          <button
            data-crt-nav
            onClick={() => {
              setRootMode(false);
              play("relayClick");
            }}
            className="opacity-70 hover:opacity-100"
          >
            [ESC] CLOSE
          </button>
        </div>
        {/* scanlines */}
        <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-40" />
        {/* body */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto px-3 py-2 font-mono-crt text-xs leading-relaxed text-[var(--crt-green)] text-glow sm:text-sm"
        >
          {history.map((h, i) => (
            <div
              key={i}
              className={h.kind === "in" ? "text-[var(--crt-soft)] opacity-90" : "whitespace-pre-wrap"}
            >
              {h.text || "\u00A0"}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[var(--crt-soft)]">{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 border-none bg-transparent font-mono-crt text-xs text-[var(--crt-green)] text-glow caret-[var(--crt-green)] outline-none sm:text-sm"
              aria-label="root shell input"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function tree(node: FSNode, prefix: string, acc: string[]): string[] {
  if (node.type !== "dir") return acc;
  const keys = Object.keys(node.children);
  keys.forEach((k, i) => {
    const last = i === keys.length - 1;
    acc.push(`${prefix}${last ? "└─ " : "├─ "}${k}${node.children[k].type === "dir" ? "/" : ""}`);
    tree(node.children[k], prefix + (last ? "   " : "│  "), acc);
  });
  return acc;
}
