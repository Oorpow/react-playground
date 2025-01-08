import { useContext } from 'react';
import { debounce } from 'lodash-es';
import Editor from './Editor';
import EditorFileList from './EditorFileList';
import { PlaygroundContext } from '../store/PlaygroundContext';

function EditorWrapper() {
	const { files, selectedFileName, setFiles } = useContext(PlaygroundContext);
	// 读取文件区选中的文件作为MonocoEditor的编辑区内容（文件名selectedFileName发生变化，会自动刷新，更新文件内容）
	const file = files[selectedFileName];

	// 保证tab切换文件后，文件内容会缓存
	function onEditorValueChange(value?: string) {
		files[file.name].value = value!;
		setFiles({ ...files });
	}

	return (
		<div className="flex flex-col h-full">
			<EditorFileList />
			<Editor file={file} onChange={debounce(onEditorValueChange, 500)} />
		</div>
	);
}

export default EditorWrapper;
