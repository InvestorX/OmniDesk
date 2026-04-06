import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ServiceState, ServiceDefinition } from "../types/service";
import { ThemeMode } from "../types/theme";
import { SERVICES } from "../constants/services";

/**
 * アプリケーション全体の状態
 */
export interface AppState {
  services: Record<string, ServiceState>;
  activeServiceId: string | null;
  isSidebarExpanded: boolean;
  isSettingsOpen: boolean;
  currentTheme: ThemeMode;
  customServices: ServiceDefinition[];
}

export type AppAction =
  | { type: "SET_ACTIVE_SERVICE"; serviceId: string }
  | { type: "SET_SERVICE_LOADED"; serviceId: string }
  | { type: "SET_NOTIFICATION_COUNT"; serviceId: string; count: number }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SUSPEND_SERVICE"; serviceId: string }
  | { type: "RESUME_SERVICE"; serviceId: string }
  | { type: "SET_THEME"; theme: ThemeMode }
  | { type: "SET_SETTINGS_OPEN"; isOpen: boolean }
  | { type: "ADD_CUSTOM_SERVICE"; service: ServiceDefinition }
  | { type: "REMOVE_CUSTOM_SERVICE"; serviceId: string };

function createInitialState(): AppState {
  const services: Record<string, ServiceState> = {};
  SERVICES.forEach((s) => {
    services[s.id] = {
      id: s.id,
      isLoaded: false,
      isActive: false,
      isSuspended: false,
      notificationCount: 0,
    };
  });
  return {
    services,
    activeServiceId: null,
    isSidebarExpanded: true,
    isSettingsOpen: false,
    currentTheme: "default",
    customServices: [],
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_ACTIVE_SERVICE": {
      const updatedServices = { ...state.services };
      if (state.activeServiceId && updatedServices[state.activeServiceId]) {
        updatedServices[state.activeServiceId] = {
          ...updatedServices[state.activeServiceId],
          isActive: false,
        };
      }
      if (!updatedServices[action.serviceId]) {
        updatedServices[action.serviceId] = {
            id: action.serviceId,
            isLoaded: true,
            isActive: true,
            isSuspended: false,
            notificationCount: 0,
        };
      } else {
        updatedServices[action.serviceId] = {
            ...updatedServices[action.serviceId],
            isActive: true,
        };
      }
      return {
        ...state,
        services: updatedServices,
        activeServiceId: action.serviceId,
      };
    }
    case "SET_SERVICE_LOADED":
      if (!state.services[action.serviceId]) return state;
      return {
        ...state,
        services: {
          ...state.services,
          [action.serviceId]: { ...state.services[action.serviceId], isLoaded: true },
        },
      };
    case "SET_NOTIFICATION_COUNT":
      if (!state.services[action.serviceId]) return state;
      return {
        ...state,
        services: {
          ...state.services,
          [action.serviceId]: { ...state.services[action.serviceId], notificationCount: action.count },
        },
      };
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarExpanded: !state.isSidebarExpanded };
    case "SUSPEND_SERVICE":
      if (!state.services[action.serviceId]) return state;
      return {
        ...state,
        services: {
          ...state.services,
          [action.serviceId]: { ...state.services[action.serviceId], isSuspended: true },
        },
      };
    case "RESUME_SERVICE":
      if (!state.services[action.serviceId]) return state;
      return {
        ...state,
        services: {
          ...state.services,
          [action.serviceId]: { ...state.services[action.serviceId], isSuspended: false },
        },
      };
    case "SET_THEME":
      return { ...state, currentTheme: action.theme };
    case "SET_SETTINGS_OPEN":
      /**
       * 設定パネルの開閉状態を更新する。
       * @param action.isOpen - パネルを開く場合は true
       * @return 更新された AppState
       */
      return { ...state, isSettingsOpen: action.isOpen };
    case "ADD_CUSTOM_SERVICE": {
      const services = { ...state.services };
      if (!services[action.service.id]) {
        services[action.service.id] = { id: action.service.id, isLoaded: false, isActive: false, isSuspended: false, notificationCount: 0 };
      }
      
      // 重複チェック: すでに同じIDが存在する場合は追加しない
      const alreadyExists = state.customServices.some(s => s.id === action.service.id);
      if (alreadyExists) {
        return { ...state, services };
      }

      return {
        ...state,
        customServices: [...state.customServices, action.service],
        services,
      };
    }
    case "REMOVE_CUSTOM_SERVICE": {
      const updatedServices = { ...state.services };
      delete updatedServices[action.serviceId];
      
      const newActiveId = state.activeServiceId === action.serviceId ? null : state.activeServiceId;

      return {
        ...state,
        services: updatedServices,
        activeServiceId: newActiveId,
        customServices: state.customServices.filter((s) => s.id !== action.serviceId),
      };
    }
    default:
      return state;
  }
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
