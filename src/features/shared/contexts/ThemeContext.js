import React, { createContext, useContext, useEffect, useState, useRef } from "react";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [isNightTheme, setIsNightTheme] = useState(null);
  const [isSideBarPinned, setIsSideBarPinned] = useState(false)
  const timeoutId = useRef(null);

  const [isSideBarOpen, setIsSideBarOpen] = useState(setIsSideBarPinned)
  const [isWide, setIsWide] = useState(window.innerWidth > 1100)
  const isWideRef = useRef(window.innerWidth > 1100)

  useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth > 1100);
      isWideRef.current = window.innerWidth > 1100
    };

    window.addEventListener('resize', handleResize);

    return ()=>{window.removeEventListener('resize', handleResize)}
  }, []);
    
  useEffect(()=>{
    if (isWide && isSideBarOpen)
    {
      setIsSideBarPinned(true)
    }
    else{
      setIsSideBarPinned(false)
    }
  },[isWide, isSideBarOpen])

  useEffect(()=>{
    //console.log(isSideBarPinned)
  },[isSideBarPinned])

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsNightTheme(storedTheme === "true");
    } else {
      setIsNightTheme(prefersDarkScheme);
    }
  }, []);

  useEffect(() => {
    const themeStyles = isNightTheme
    ? {
        "--main-blue-color": "#005AAA",
        "--main-red-color": "#E4003A",
        "--main-text-color": "#d4d3cf",
        "--alt-text-color": "#ffffff",
        "--bg-color": "#192227",
        "--card-color": "#1b1c1e",
        "--border-color": "#D9D9D9",
        "--main-gradient": "linear-gradient(270deg, var(--main-red-color), var(--main-blue-color))",
        "--activity-100": "#005AAA",
        "--activity-75": "#337BCC",
        "--activity-50": "#66A3E6",
        "--activity-25": "#99C8FF",
        "--main-green-color": "#009A49",
      }
    : {
        "--main-blue-color": "#005AAA",
        "--main-red-color": "#E4003A",
        "--main-text-color": "#000000",
        "--alt-text-color": "#ffffff",
        "--bg-color": "#F7F9FA",
        "--card-color": "#FFFFFF",
        "--border-color": "#D9D9D9",
        "--main-gradient": "linear-gradient(270deg, var(--main-red-color), var(--main-blue-color))",
        "--activity-100": "#005AAA",
        "--activity-75": "#337BCC",
        "--activity-50": "#66A3E6",
        "--activity-25": "#99C8FF",
        "--main-green-color": "#009A49",
      };

    for (const [key, value] of Object.entries(themeStyles)) {
      document.documentElement.style.setProperty(key, value);
    }

    localStorage.setItem("theme", isNightTheme);
  }, [isNightTheme]);

  const onThemeChange = () => {
    const allElements = document.querySelectorAll("*");
    const allSvgElements = document.querySelectorAll("svg");

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    } else {
      allElements.forEach((element) => element.classList.add("all-trans"));
      allSvgElements.forEach((element) => element.classList.add("svg-trans"));
    }

    setIsNightTheme(!isNightTheme);

    timeoutId.current = setTimeout(() => {
      allElements.forEach((element) => element.classList.remove("all-trans"));
      allSvgElements.forEach((element) => element.classList.remove("svg-trans"));
      timeoutId.current = null;
    }, 1000);
  };
  const value = {
    isNightTheme, setIsNightTheme, 
    onThemeChange, 
    isSideBarPinned, setIsSideBarPinned,
    isSideBarOpen, setIsSideBarOpen,
    isWide, isWideRef
    
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}