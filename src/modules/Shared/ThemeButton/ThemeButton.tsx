import { useContext } from "react"
import { ThemeContext } from "../../../context/ThemeContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function ThemeButton() {
    const themeContext = useContext(ThemeContext);

    if(!themeContext) return null ;

    const {darkMode, setDarkMode} = themeContext;

  return <>

  <button 
  className="theme-btn"
  onClick={() => setDarkMode(!darkMode)}>
    <FontAwesomeIcon icon={darkMode ? faSun : faMoon}/> 
  </button>

  </>
}
