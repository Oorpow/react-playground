import MonacoEditor, { OnMount } from '@monaco-editor/react';

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
