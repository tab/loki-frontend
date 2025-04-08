const THEME_KEY = "theme"

export type APPEARANCE = "light" | "dark"
export const APPEARANCE_LIGHT = "light"
export const APPEARANCE_DARK = "dark"

class ThemeService {
  get = (): APPEARANCE => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem(THEME_KEY)
      if (theme === APPEARANCE_LIGHT || theme === APPEARANCE_DARK) {
        return theme
      }
    }
    return APPEARANCE_LIGHT
  }
  set = (theme: APPEARANCE) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_KEY, theme)
    }
  }
}

export default new ThemeService()
