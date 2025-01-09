import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '../store/PlaygroundContext';

export interface FileItemProps {
	value: string;
	isActive: boolean;
	onClick: () => void;
}

function FileItem(props: FileItemProps) {
	const { value, onClick, isActive = false } = props;
	const [name] = useState(value);

	return (
		<div
			onClick={onClick}
			className={`p-2 transition duration-200 ease-in-out cursor-pointer ${
				isActive ? 'border-b-2 border-red-500' : 'border-b-0'
			}`}
		>
			<span>{name}</span>
		</div>
	);
}

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
		<div className="flex m-1 overflow-x-auto overflow-y-hidden flex-nowrap">
			{tabs.map((item, idx) => {
                // 如果不过滤空值，则会导致首次渲染时，第一项不渲染
                if (!item) return null
				// 选中时修改文件名，随着文件名发生变化，其他组件追踪到文件名变化会自动查找文件名对应的文件
				return (
					<FileItem
						value={item}
						key={idx}
						isActive={selectedFileName === item}
						onClick={() => setSelectedFileName(item)}
					/>
				);
			})}
		</div>
	);
}

export default EditorFileList;
