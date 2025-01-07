import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { setupTypeAcquisition } from '@typescript/ata'
import typescript from 'typescript'

/**
 * ata(自动类型获取)
 * 通过传入源码，自动分析出需要的ts类型包，然后自动下载
 * @param onDownloadFile 
 * @returns 
 */
function createATA(onDownloadFile: (code: string, path: string) => void) {
    const ata = setupTypeAcquisition({
        projectName: 'test-ata',
        typescript,
        logger: console,
        delegate: {
            receivedFile: (code, path) => {
                console.log('自动下载包: ', path)
                onDownloadFile(code, path)
            }
        }
    })

    return ata
}

/* 编辑器 */
function Editor() {
	const code = `
    export default function App() {
        return <div>hahahah</div>
    }
    `;

	const editorOnMount: OnMount = (editor, monaco) => {
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			jsx: monaco.languages.typescript.JsxEmit.Preserve, // 处理tsconfig对jsx的报错
			esModuleInterop: true,
		});
		// 快捷键（CMD + K）实现代码格式化
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
			// 底层是执行预设好的action
			editor.getAction('editor.action.formatDocument')?.run();
		});

        const ata = createATA((code, path) => {
            // 类型获取完后，通过addExtraLib加到ts里
            monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
        })
        // 代码内容发生改变后，再获取一次ts类型
        editor.onDidChangeModelContent(() => {
            ata(editor.getValue())
        })
        // 一开始就获取一次类型
        ata(editor.getValue())
	};

	return (
		<MonacoEditor
			height="100%"
			path="test.tsx"
			language="typescript"
			options={{
				scrollBeyondLastLine: false,
				minimap: {
					enabled: false,
				},
				scrollbar: {
					verticalScrollbarSize: 6,
					horizontalScrollbarSize: 6,
				},
			}}
			value={code}
			onMount={editorOnMount}
		/>
	);
}

export default Editor;
