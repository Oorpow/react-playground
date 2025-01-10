import { useContext, useEffect, useRef, useState } from 'react';
import { PlaygroundContext } from '../store/PlaygroundContext';

export interface FileItemProps {
	/** 文件名 */
	value: string;
	/** 选中状态  */
	isActive: boolean;
	onClick: () => void;
	/**
	 * 编辑事件
	 * @param name 新的文件名
	 * @returns 
	 */
	onEditFinished: (name: string) => void
}

function FileItem(props: FileItemProps) {
	const { value, onClick, isActive = false, onEditFinished } = props;
	// 文件名
	const [name, setName] = useState(value);
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	/** 双击文件区item，变成输入框，允许修改文件名 */
	const handleDoubleClick = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};

	/** 失焦时，文件区item恢复原状 */
	const handleBlur = () => {
		onEditFinished(name);
		setIsEditing(false);
	};

	return (
		<div
			onClick={onClick}
			className={`p-2 transition duration-200 ease-in-out cursor-pointer ${
				isActive ? 'border-b-2 border-red-500' : 'border-b-0'
			}`}
		>
			{isEditing ? (
				<input
					ref={inputRef}
					value={name}
					onChange={(e) => setName(e.target.value)}
					onBlur={handleBlur}
				/>
			) : (
				<span onDoubleClick={handleDoubleClick}>{name}</span>
			)}
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


	/**
	 * 文件区 文件名编辑事件
	 * @param oldFileName 
	 * @param newFileName 
	 */
	function handleEditFinished(oldFileName: string, newFileName: string) {
		updateFileName(oldFileName, newFileName)
		setSelectedFileName(newFileName)
	}

	return (
		<div className="flex m-1 overflow-x-auto overflow-y-hidden flex-nowrap">
			{tabs.map((item, idx) => {
				// 如果不过滤空值，则会导致首次渲染时，第一项不渲染
				if (!item) return null;
				// 选中时修改文件名，随着文件名发生变化，其他组件追踪到文件名变化会自动查找文件名对应的文件
				return (
					<FileItem
						value={item}
						key={idx}
						isActive={selectedFileName === item}
						onClick={() => setSelectedFileName(item)}
						onEditFinished={(name: string) => handleEditFinished(item, name)}
					/>
				);
			})}
		</div>
	);
}

export default EditorFileList;
