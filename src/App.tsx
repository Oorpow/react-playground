import { PlaygroundProvider } from './components/PlaygroundContext';
import ReactPlayground from './pages/ReactPlayground';

function App() {
	return (
		<>
			<PlaygroundProvider>
				<ReactPlayground />
			</PlaygroundProvider>
		</>
	);
}

export default App;
