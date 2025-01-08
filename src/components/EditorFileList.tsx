import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '../store/PlaygroundContext';

function EditorFileList() {
	const {
		files,
		addFile,
		deleteFile,
		updateFileName,
		selectedFileName,
		setSelectedFileName,
	} = useContext(PlaygroundContext);

	const [tabs, setTabs] = useState(['']);

	useEffect(() => {
		// 文件名作为tabs数组项
		setTabs(Object.keys(files));
	}, [files]);

	return (
		<div>
			{tabs.map((item, idx) => (
				// 选中时修改文件名，随着文件名发生变化，其他组件追踪到文件名变化会自动查找文件名对应的文件
				<div key={idx} onClick={() => setSelectedFileName(item)}>
					{item}
				</div>
			))}
		</div>
	);
}

export default EditorFileList;
