import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import type { ColorSchemeName, StatusBarStyle } from 'react-native';

const COLORS = {
  white: '#ffffff',
  ink: '#182033',
  slate: '#354258',
  muted: '#5a6475',
  softMuted: '#758195',
  lightBackground: '#f4f7fb',
  lightSurface: '#ffffff',
  lightSurfaceRaised: '#f9fbfd',
  lightBorder: '#dfe5ee',
  lightInputBorder: '#d7dde8',
  lightFocusBorder: '#cbd4e1',
  lightSubtle: '#eef2f7',
  lightProgressTrack: '#dfe7e3',
  placeholder: '#8a94a6',
  primary: '#226f54',
  primaryDisabled: '#9fb2aa',
  danger: '#a43030',
  dangerSurface: '#f8e8e8',
  darkBackground: '#10141d',
  darkSurface: '#171d29',
  darkSurfaceRaised: '#202838',
  darkBorder: '#303a4d',
  darkInputBorder: '#3a465c',
  darkFocusBorder: '#53617a',
  darkSubtle: '#283143',
  darkProgressTrack: '#2d3a35',
  darkText: '#f3f6fb',
  darkMuted: '#a9b2c2',
  darkSoftMuted: '#8791a3',
  darkSnackbar: '#eef2f7',
  darkSnackbarText: '#10141d',
  darkDangerSurface: '#3b2227',
  darkDanger: '#ff9a9a',
} as const;

export type AppTheme = {
  isDark: boolean;
  statusBarStyle: StatusBarStyle;
  colors: {
    background: string;
    surface: string;
    surfaceRaised: string;
    border: string;
    inputBorder: string;
    focusBorder: string;
    text: string;
    mutedText: string;
    softText: string;
    placeholder: string;
    primary: string;
    primaryDisabled: string;
    primaryText: string;
    subtleSurface: string;
    progressTrack: string;
    snackbarBackground: string;
    snackbarText: string;
    snackbarButtonBackground: string;
    snackbarButtonText: string;
    danger: string;
    dangerSurface: string;
  };
};

const createTheme = (colorScheme: ColorSchemeName): AppTheme => {
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    statusBarStyle: isDark ? 'light-content' : 'dark-content',
    colors: isDark
      ? {
          background: COLORS.darkBackground,
          surface: COLORS.darkSurface,
          surfaceRaised: COLORS.darkSurfaceRaised,
          border: COLORS.darkBorder,
          inputBorder: COLORS.darkInputBorder,
          focusBorder: COLORS.darkFocusBorder,
          text: COLORS.darkText,
          mutedText: COLORS.darkMuted,
          softText: COLORS.darkSoftMuted,
          placeholder: COLORS.darkSoftMuted,
          primary: COLORS.primary,
          primaryDisabled: COLORS.primaryDisabled,
          primaryText: COLORS.white,
          subtleSurface: COLORS.darkSubtle,
          progressTrack: COLORS.darkProgressTrack,
          snackbarBackground: COLORS.darkSnackbar,
          snackbarText: COLORS.darkSnackbarText,
          snackbarButtonBackground: COLORS.darkBackground,
          snackbarButtonText: COLORS.white,
          danger: COLORS.darkDanger,
          dangerSurface: COLORS.darkDangerSurface,
        }
      : {
          background: COLORS.lightBackground,
          surface: COLORS.lightSurface,
          surfaceRaised: COLORS.lightSurfaceRaised,
          border: COLORS.lightBorder,
          inputBorder: COLORS.lightInputBorder,
          focusBorder: COLORS.lightFocusBorder,
          text: COLORS.ink,
          mutedText: COLORS.muted,
          softText: COLORS.softMuted,
          placeholder: COLORS.placeholder,
          primary: COLORS.primary,
          primaryDisabled: COLORS.primaryDisabled,
          primaryText: COLORS.white,
          subtleSurface: COLORS.lightSubtle,
          progressTrack: COLORS.lightProgressTrack,
          snackbarBackground: COLORS.ink,
          snackbarText: COLORS.white,
          snackbarButtonBackground: COLORS.white,
          snackbarButtonText: COLORS.ink,
          danger: COLORS.danger,
          dangerSurface: COLORS.dangerSurface,
        },
  };
};

const ThemeContext = createContext<AppTheme | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  colorScheme: ColorSchemeName;
}>;

export function ThemeProvider({ children, colorScheme }: ThemeProviderProps) {
  const theme = useMemo(() => createTheme(colorScheme), [colorScheme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return theme;
};
