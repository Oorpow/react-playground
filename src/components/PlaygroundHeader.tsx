import logoSvg from '../assets/react.svg'

function PlaygroundHeader() {
    return <div className="bg-slate-600 p-4 flex items-center gap-4">
        <img src={logoSvg} alt="logo" />
        <h1 className="text-white text-2xl">React Playground</h1>
    </div>;
}

export default PlaygroundHeader;