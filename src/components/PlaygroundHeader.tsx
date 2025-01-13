import { useContext } from 'react';
import { MoonStar, Sun } from 'lucide-react';
import logoSvg from '../assets/react.svg'
import { PlaygroundContext } from '../store/PlaygroundContext';

function PlaygroundHeader() {
    const { theme, setTheme } = useContext(PlaygroundContext)

    return <div className="flex items-center justify-between p-4 dark:bg-slate-900">
        <div className='flex gap-4'>
            <img src={logoSvg} alt="logo" />
            <h1 className="text-2xl dark:text-white">React Playground</h1>
        </div>
        <div>
            {
                theme === 'light' && <MoonStar className='cursor-pointer' onClick={() => setTheme('dark')} />
            }
            {
                theme === 'dark' && <Sun className='text-white cursor-pointer' onClick={() => setTheme('light')} />
            }
        </div>
        
    </div>;
}

export default PlaygroundHeader;