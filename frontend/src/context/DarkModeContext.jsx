import {
    createContext,
    useEffect,
    useState
} from 'react';

export const DarkModeContext = createContext();

function DarkModeProvider({ children }) {

    const [darkMode, setDarkMode] = useState(() => {

        const modoGuardado =
            localStorage.getItem('darkMode');

        return modoGuardado === 'true';

    });

    useEffect(() => {

        localStorage.setItem(
            'darkMode',
            darkMode
        );

        if(darkMode){

            document.documentElement.classList.add('dark');

        }else{

            document.documentElement.classList.remove('dark');

        }

    }, [darkMode]);

    const toggleDarkMode = () => {

        setDarkMode(!darkMode);

    };

    return (

        <DarkModeContext.Provider
            value={{
                darkMode,
                toggleDarkMode
            }}
        >

            {children}

        </DarkModeContext.Provider>

    )
}

export default DarkModeProvider;