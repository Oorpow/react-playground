import { useContext } from 'react';
import copy from 'copy-to-clipboard';
import { Link, MoonStar, Sun } from 'lucide-react';
import logoSvg from '../assets/react.svg';
import { PlaygroundContext } from '../store/PlaygroundContext';

function PlaygroundHeader() {
	const { theme, setTheme } = useContext(PlaygroundContext);

	function copyLinkAndShare() {
		copy(window.location.href);
		alert('链接copy成功，请将链接分享给他人');
	}

	return (
		<div className="flex items-center justify-between p-4 dark:bg-slate-900">
			<div className="flex gap-4">
				<img src={logoSvg} alt="logo" />
				<h1 className="text-2xl dark:text-white">React Playground</h1>
			</div>
			<div className="flex items-center gap-2">
				{theme === 'light' && (
					<MoonStar
						className="cursor-pointer"
						onClick={() => setTheme('dark')}
					/>
				)}
				{theme === 'dark' && (
					<Sun
						className="text-white cursor-pointer"
						onClick={() => setTheme('light')}
					/>
				)}
				<Link
					className="cursor-pointer dark:text-white"
					onClick={copyLinkAndShare}
				/>
			</div>
		</div>
	);
}

export default PlaygroundHeader;
