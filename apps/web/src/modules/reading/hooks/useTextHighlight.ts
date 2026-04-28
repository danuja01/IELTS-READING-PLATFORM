"use client";

import { useCallback, useMemo, useRef, useState, type MouseEvent } from "react";
import type { HighlightRange, PassageNote } from "@/types/exam";

// ─────────────────────────────────────────────────────────────────────────────
// DOM helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Walk all text nodes inside `root` and return their cumulative character offset. */
function getTextOffset(root: HTMLElement, node: Node, offset: number): number {
  let count = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    if (walker.currentNode === node) return count + offset;
    count += walker.currentNode.textContent?.length ?? 0;
  }
  return count;
}

/**
 * Wrap every text-node fragment covered by `range` in a <mark> element.
 * Works even when the selection spans multiple block elements.
 */
function applyMarkToRange(range: Range, id: string, extraClass: string = ""): void {
  const ancestor = range.commonAncestorContainer;

  // Collect every text node that intersects the range
  const walker = document.createTreeWalker(
    ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentElement! : (ancestor as Element),
    NodeFilter.SHOW_TEXT,
  );

  const segments: { node: Text; start: number; end: number }[] = [];

  while (walker.nextNode()) {
    const tn = walker.currentNode as Text;
    if (!range.intersectsNode(tn)) continue;

    const start = range.startContainer === tn ? range.startOffset : 0;
    const end = range.endContainer === tn ? range.endOffset : tn.length;
    if (start < end) segments.push({ node: tn, start, end });
  }

  // Wrap each segment (process in reverse to preserve offsets)
  for (const { node, start, end } of segments.reverse()) {
    const markable = node.splitText(start);
    if (end - start < markable.length) markable.splitText(end - start);

    const mark = document.createElement("mark");
    mark.className = `ielts-hl ${extraClass}`.trim();
    mark.dataset.highlightId = id;
    mark.appendChild(markable.cloneNode(true));
    markable.parentNode?.replaceChild(mark, markable);
  }
}

/** Remove all <mark> elements with the given highlightId, unwrapping their text. */
function removeMarkFromDOM(container: HTMLElement, id: string): void {
  container.querySelectorAll<HTMLElement>(`mark[data-highlight-id="${id}"]`).forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useTextHighlight({
  attemptId,
  sectionId,
  onPersistHighlight,
  onPersistNote,
}: {
  attemptId: string;
  sectionId: string;
  onPersistHighlight?: (highlight: HighlightRange) => Promise<void>;
  onPersistNote?: (note: PassageNote) => Promise<void>;
}) {
  const [highlights, setHighlights] = useState<HighlightRange[]>([]);
  const [notes, setNotes] = useState<PassageNote[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    selectedText: string;
    startOffset: number;
    endOffset: number;
  } | null>(null);

  // Saved DOM Range so we can apply the <mark> immediately when user clicks Highlight
  const savedRangeRef = useRef<Range | null>(null);
  // Keep a ref to the passage container so removeMarkFromDOM works
  const containerRef = useRef<HTMLElement | null>(null);

  const openContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>, container: HTMLElement) => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

      const anchorNode = sel.anchorNode;
      const focusNode = sel.focusNode;
      if (!anchorNode || !focusNode) return;
      if (!container.contains(anchorNode) || !container.contains(focusNode)) return;

      const selectedText = sel.toString().trim();
      if (!selectedText) return;

      // Clone the range before preventDefault / other code clears the selection
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      containerRef.current = container;

      // Compute stored offsets for persistence
      const rawRange = sel.getRangeAt(0);
      const s0 = getTextOffset(container, rawRange.startContainer, rawRange.startOffset);
      const s1 = getTextOffset(container, rawRange.endContainer, rawRange.endOffset);

      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        selectedText,
        startOffset: Math.min(s0, s1),
        endOffset: Math.max(s0, s1),
      });
    },
    [],
  );

  const copySelectedText = useCallback(() => {
    if (!contextMenu) return;
    void navigator.clipboard.writeText(contextMenu.selectedText).catch(() => {
      // fallback: use document.execCommand for older environments
      const ta = document.createElement("textarea");
      ta.value = contextMenu.selectedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
    setContextMenu(null);
  }, [contextMenu]);

  const addHighlightFromContextMenu = useCallback(async () => {
    if (!contextMenu || !savedRangeRef.current) return null;

    const id = crypto.randomUUID();

    // Paint on the DOM immediately
    try {
      applyMarkToRange(savedRangeRef.current, id);
    } catch {
      // ignore DOM errors (e.g. range invalidated by re-render)
    }

    savedRangeRef.current = null;
    window.getSelection()?.removeAllRanges();

    const next: HighlightRange = {
      id,
      attemptId,
      sectionId,
      startOffset: contextMenu.startOffset,
      endOffset: contextMenu.endOffset,
      selectedText: contextMenu.selectedText,
      color: "yellow",
      createdAt: new Date().toISOString(),
    };

    setHighlights((prev) => [...prev, next]);
    setContextMenu(null);

    if (onPersistHighlight) await onPersistHighlight(next);
    return next;
  }, [attemptId, contextMenu, onPersistHighlight, sectionId]);

  const addNoteFromContextMenu = useCallback(
    async (content: string) => {
      if (!contextMenu || !content.trim() || !savedRangeRef.current) return null;

      const id = crypto.randomUUID();

      try {
        applyMarkToRange(savedRangeRef.current, id, "highlight-note");
      } catch {
        // ignore DOM errors
      }

      savedRangeRef.current = null;
      window.getSelection()?.removeAllRanges();

      const next: PassageNote = {
        id,
        attemptId,
        sectionId,
        startOffset: contextMenu.startOffset,
        endOffset: contextMenu.endOffset,
        selectedText: contextMenu.selectedText,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [...prev, next]);
      setContextMenu(null);
      if (onPersistNote) await onPersistNote(next);
      return next;
    },
    [attemptId, contextMenu, onPersistNote, sectionId],
  );

  const removeHighlight = useCallback((highlightId: string) => {
    if (containerRef.current) {
      removeMarkFromDOM(containerRef.current, highlightId);
    }
    setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
  }, []);

  const clearContextSelection = useCallback(() => {
    savedRangeRef.current = null;
    setContextMenu(null);
    // Do NOT clear the browser selection here – user may still want to copy
  }, []);

  return useMemo(
    () => ({
      highlights,
      notes,
      contextMenu,
      openContextMenu,
      copySelectedText,
      addHighlightFromContextMenu,
      addNoteFromContextMenu,
      clearContextSelection,
      removeHighlight,
    }),
    [
      highlights,
      notes,
      contextMenu,
      openContextMenu,
      copySelectedText,
      addHighlightFromContextMenu,
      addNoteFromContextMenu,
      clearContextSelection,
      removeHighlight,
    ],
  );
}
