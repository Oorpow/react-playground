import { useContext } from 'react';
import Editor from './Editor';
import EditorFileList from './EditorFileList';
import { PlaygroundContext } from '../store/PlaygroundContext';

function EditorWrapper() {
	const { files, selectedFileName } = useContext(PlaygroundContext);
	// 读取文件区选中的文件作为MonocoEditor的编辑区内容（文件名selectedFileName发生变化，会自动刷新，更新文件内容）
	const file = files[selectedFileName];

	function onEditorValueChange() {
		// eslint-disable-next-line prefer-rest-params
		console.log(...arguments);
	}

	return (
		<div className="flex flex-col h-full">
			<EditorFileList />
			<Editor file={file} onChange={onEditorValueChange} />
		</div>
	);
}

export default EditorWrapper;
