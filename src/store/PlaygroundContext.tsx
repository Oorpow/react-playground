import { createContext, PropsWithChildren, useState } from 'react';
import { EditorFile } from '../components/Editor';
import { fileName2Language } from '../utils/fileName2Language';
import { initFiles } from '../utils/provideFiles';

export interface Files {
	[key: string]: EditorFile;
}

export interface PlaygroundContextProps {
	files: Files;
	selectedFileName: string;
	setSelectedFileName: (fileName: string) => void;
	// 设置当前正在编辑的文件
	setFiles: (files: Files) => void;
	// 文件区添加文件
	addFile: (fileName: string) => void;
	deleteFile: (fileName: string) => void;
	// 更新文件
	updateFileName: (oldFileName: string, newFileName: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContextProps>({
	selectedFileName: 'App.tsx',
} as PlaygroundContextProps);

// 对Context.Provider做一层封装，注入了PlaygroundContextProps里方法的实现
export const PlaygroundProvider = (props: PropsWithChildren) => {
	const { children } = props;
    // 对象的形式，存储文件区的文件
    /**
     * {
     *      'App.vue': {
     *          name: 'App.vue',
     *          value: '<div></div>',
     *          language: 'vue'
     *      }
     * }
     * 
     */
	const [files, setFiles] = useState<Files>(initFiles);
	const [selectedFileName, setSelectedFileName] = useState('App.tsx');

	const addFile = (name: string) => {
        files[name] = {
            name,
            language: fileName2Language(name),
            value: ''
        }
        setFiles({ ...files })
    };

	const deleteFile = (name: string) => {
        delete files[name]
        setFiles({...files })
    };

	const updateFileName = (oldName: string, newName: string) => {
        if (!files[oldName] || newName == null) return;
        // 从文件集合中，解构出对应文件的value（代码），后面的rest操作符用于防止丢失其他文件信息
        const { [oldName]: value, ...rest } = files
        const newFile = {
            [newName]: {
                ...value,
                language: fileName2Language(newName),
                name: newName,
            }
        }

        setFiles({
            ...rest,
            ...newFile
        }) 
    };

	return (
		<PlaygroundContext.Provider
			value={{
				files,
				selectedFileName,
				setSelectedFileName,
				setFiles,
				addFile,
				deleteFile,
				updateFileName,
			}}
		>
			{children}
		</PlaygroundContext.Provider>
	);
};
