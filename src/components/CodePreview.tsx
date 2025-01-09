import Editor from './Editor';
import { useContext, useState, useEffect } from 'react';
import { PlaygroundContext } from '../store/PlaygroundContext';
import { compile } from '../utils/compiler';

function CodePreview() {
	const { files } = useContext(PlaygroundContext);
	const [compiledCode, setCompiledCode] = useState('');

    // files发生变化时，对内容做编译，并展示编译后的代码
	useEffect(() => {
		const result = compile(files);
		setCompiledCode(result);
	}, [files]);

	return (
		<div className="h-full">
			<Editor
				file={{
					name: 'dist.js',
					value: compiledCode,
					language: 'javascript',
				}}
			/>
		</div>
	);
}

export default CodePreview;
