import { useContext, useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { PlaygroundContext } from '../store/PlaygroundContext';

export interface FileItemProps {
	/** 文件名 */
	value: string;
	/** 选中状态  */
	isActive: boolean;
	/** 是否点击创建按钮，添加文件至文件区 */
	isCreating: boolean;
	onClick: () => void;
	/**
	 * 编辑事件
	 * @param name 新的文件名
	 * @returns
	 */
	onEditFinished: (name: string) => void;
}

function FileItem(props: FileItemProps) {
	const {
		value,
		onClick,
		isActive = false,
		isCreating: propsIsCreating,
		onEditFinished,
	} = props;
	// 文件名
	const [name, setName] = useState(value);
	const [isEditing, setIsEditing] = useState(propsIsCreating);
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

	// 默认将最后一个tab作为编辑状态
	useEffect(() => {
		if (propsIsCreating) {
			inputRef.current?.focus();
		}
	}, [propsIsCreating]);

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
	const [isCreating, setIsCreating] = useState(false);

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
		updateFileName(oldFileName, newFileName);
		setSelectedFileName(newFileName);
		setIsCreating(false);
	}

	/**
	 * 添加文件到文件区
	 * 点击 + 时，进入isCreating状态，添加一个file到文件区，并将最后一个tab设为编辑状态
	 */
	function addFileToTabs() {
		const newFileName =
			'Comp' + Math.random().toString().slice(2, 8) + '.tsx';
		addFile(newFileName);
		setSelectedFileName(newFileName);
		setIsCreating(true);
	}

	return (
		<div className="flex items-center m-1 overflow-x-auto overflow-y-hidden flex-nowrap">
			{tabs.map((item, idx, arr) => {
				// 如果不过滤空值，则会导致首次渲染时，第一项不渲染
				if (!item) return null;
				// 选中时修改文件名，随着文件名发生变化，其他组件追踪到文件名变化会自动查找文件名对应的文件
				return (
					<FileItem
						value={item}
						key={idx}
						isActive={selectedFileName === item}
						// 默认将最后一个tab作为编辑状态
						isCreating={isCreating && idx === arr.length - 1}
						onClick={() => setSelectedFileName(item)}
						onEditFinished={(name: string) =>
							handleEditFinished(item, name)
						}
					/>
				);
			})}
			<div
				className="cursor-pointer hover:bg-slate-400"
				onClick={addFileToTabs}
			>
				<Plus />
			</div>
		</div>
	);
}

export default EditorFileList;
