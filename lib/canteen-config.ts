import React from 'react';
import defaultConfigData from '@/config.json';
import { CanteenConfig } from '@/types/canteen';

export const defaultConfig = defaultConfigData as unknown as CanteenConfig;

let inMemoryConfig: CanteenConfig | null = null;
const configListeners = new Set<() => void>();

function subscribeConfig(listener: () => void) {
  configListeners.add(listener);
  return () => {
    configListeners.delete(listener);
  };
}

function getConfigSnapshot(): CanteenConfig {
  if (typeof window === 'undefined') {
    return defaultConfig;
  }

  // Always use the latest defaultConfig from config.json
  return defaultConfig;
}

function getServerSnapshot(): CanteenConfig {
  return defaultConfig;
}

/**
 * React 19 hook to read and subscribe to the canteen config store safely
 */
export function useCanteenConfig(): CanteenConfig {
  return React.useSyncExternalStore(subscribeConfig, getConfigSnapshot, getServerSnapshot);
}

/**
 * Reset configuration
 */
export function resetCustomConfig(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('gerze_canteen_custom_config');
    } catch {
      // Ignore
    }
  }
  configListeners.forEach((listener) => listener());
}

/**
 * Check if the canteen is currently within working hours
 */
export function isCanteenOpen(config: CanteenConfig): {
  isOpen: boolean;
  message: string;
} {
  // Developer mode in config.json keeps canteen always active for ordering
  if (config?.settings?.devMode) {
    return { isOpen: true, message: 'Siparişe Açık' };
  }

  if (!config.settings.ordersEnabled) {
    return {
      isOpen: false,
      message: config.settings.disabledMessage || 'Şu anda sipariş alınmıyor.',
    };
  }

  const { open, close } = config.canteen.workingHours;
  if (!open || !close) {
    return { isOpen: true, message: 'Açık' };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = open.split(':').map(Number);
  const [closeH, closeM] = close.split(':').map(Number);

  const openMinutes = openH * 60 + (openM || 0);
  const closeMinutes = closeH * 60 + (closeM || 0);

  if (currentMinutes < openMinutes || currentMinutes > closeMinutes) {
    return {
      isOpen: false,
      message: `Kantin kapalı (Çalışma saatleri: ${open} - ${close})`,
    };
  }

  return { isOpen: true, message: 'Siparişe Açık' };
}
