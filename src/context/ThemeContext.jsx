import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext();

export function ThemeProvider({children}){
  const [isDarkMode, setIsDarkMode] = useState(()=>{
    const savedTheme = localStorage.getItem("theme")
    return savedTheme === "dark"
  })
  useEffect(()=>{
    const root = document.documentElement;
    if(isDarkMode){
      root.setAttribute("data-theme", "dark")
      localStorage.setItem("theme","dark")
    }else{
      root.removeAttribute("data-theme")
      localStorage.setItem("theme","light")
    }
  },[isDarkMode])

  const toggleTheme = ()=>{
    setIsDarkMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}
export function useTheme(){
  const cxt = useContext(ThemeContext);
  if(!cxt) throw new Error("useTheme must be used within a ThemeProvider");
  return cxt
}