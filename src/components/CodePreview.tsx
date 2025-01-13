// import Editor from './Editor';
import iframeRaw from '../assets/iframe.html?raw';
import { useContext, useState, useEffect } from 'react';
import { PlaygroundContext } from '../store/PlaygroundContext';
import { compile } from '../utils/compiler';
import { IMPORT_MAP_FILE_NAME } from '../utils/provideFiles';
import Message from './Message';

interface MessageData {
	data: {
		type: string;
		message: string;
	};
}

function CodePreview() {
	const { files } = useContext(PlaygroundContext);
	const [compiledCode, setCompiledCode] = useState('');
	const [iframeUrl, setIframeUrl] = useState(getIframeUrl());
	const [errorInfo, setErrorInfo] = useState('');

	// files发生变化时，对内容做编译，得到编译后的js代码
	useEffect(() => {
		const result = compile(files);
		setCompiledCode(result);
	}, [files]);

	/**
	 * 替换iframe页中的import maps、src的内容
	 * 创建blob url设置到src中，完成iframe渲染
	 * @returns
	 */
	function getIframeUrl() {
		const res = iframeRaw
			.replace(
				'<script type="importmap"></script>',
				`<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
			)
			.replace(
				'<script type="module" id="appSrc"></script>',
				`<script type="module" id="appSrc">${compiledCode}</script>`
			);
		return URL.createObjectURL(new Blob([res], { type: 'text/html' }));
	}

	useEffect(() => {
		setIframeUrl(getIframeUrl());
	}, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);

	function handleErrorInfo(msg: MessageData) {
		const { type, message } = msg.data;
		if (type === 'ERROR') {
			setErrorInfo(message);
		}
	}

	// 接收iframe传递的错误信息，并进行展示
	useEffect(() => {
		window.addEventListener('message', handleErrorInfo);
		return () => {
			window.removeEventListener('message', handleErrorInfo);
		};
	}, []);

	return (
		<div className="h-full">
			<iframe src={iframeUrl} className="w-full h-full p-0 border-none" />
			<Message type="error" content={errorInfo} />
			{/* <Editor
				file={{
					name: 'dist.js',
					value: compiledCode,
					language: 'javascript',
				}}
			/> */}
		</div>
	);
}

export default CodePreview;
