import { useCallback, useEffect } from "react";

interface HotkeyOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
}

/**
 * Custom hook for handling keyboard shortcuts
 */
export function useHotkeys(
  keys: string,
  callback: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {},
) {
  const { preventDefault = true, stopPropagation = false, enabled = true } = options;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const hotkey = keys.toLowerCase();
      const pressed: string[] = [];

      if (event.ctrlKey || event.metaKey) pressed.push("mod");
      if (event.shiftKey) pressed.push("shift");
      if (event.altKey) pressed.push("alt");
      pressed.push(event.key.toLowerCase());

      const pressedKey = pressed.join("+");

      // Handle different formats
      const normalizedHotkey = hotkey
        .replace("cmd", "mod")
        .replace("ctrl", "mod")
        .replace("command", "mod")
        .replace("control", "mod");

      if (pressedKey === normalizedHotkey || event.key.toLowerCase() === hotkey) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        callback(event);
      }
    },
    [keys, callback, preventDefault, stopPropagation, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, enabled]);
}

/**
 * Hook for handling common dialog/modal hotkeys
 */
export function useDialogHotkeys(onClose?: () => void, enabled = true) {
  useHotkeys("escape", () => onClose?.(), { enabled });
}

/**
 * Hook for handling common form hotkeys
 */
export function useFormHotkeys(onSubmit?: () => void, onCancel?: () => void, enabled = true) {
  useHotkeys("mod+enter", () => onSubmit?.(), { enabled });
  useHotkeys("escape", () => onCancel?.(), { enabled });
}
