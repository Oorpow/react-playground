import { transform } from '@babel/standalone';
import { PluginObj } from '@babel/core';
import { Files } from '../store/PlaygroundContext';
import { ENTRY_FILE_NAME } from './provideFiles';
import { EditorFile } from '../components/Editor';

/**
 * 根据路径，提取出对应文件模块
 * 从./App.css此类路径，提取出App.css模块
 * 特殊情况: ./App，需要自动补全，查找到对应App.tsx模块
 * @param files
 * @param modulePath
 * @returns
 */
function getModuleFile(files: Files, modulePath: string) {
	let moduleName = modulePath.split('./').pop() || '';
	// 去掉./后，剩下的如./App这种，需要自动补全为App.xx，就需要在files里过滤同名的模块，按照补全后的模块名来查找file
	if (!moduleName.includes('.')) {
		const realModuleName = Object.keys(files)
			.filter((key) => {
				return (
					key.endsWith('.ts') ||
					key.endsWith('.tsx') ||
					key.endsWith('.js') ||
					key.endsWith('.jsx')
				);
			})
			.find((key) => {
				return key.split('.').includes(moduleName);
			});
		if (realModuleName) {
			moduleName = realModuleName;
		}
	}
	return files[moduleName];
}

/**
 * 处理json文件
 * export一下json，并作为blob url
 * @param file
 * @returns
 */
function json2Js(file: EditorFile) {
	const js = `export default ${file.value}`;
	return URL.createObjectURL(
		new Blob([js], { type: 'application/javascript' })
	);
}

/**
 * 处理css文件
 * 通过js代码将css文件添加到head的style标签
 * @param file
 */
function css2Js(file: EditorFile) {
	const randomId = new Date().getTime();

	const js = `
    (() => {
        const stylesheet = document.createElement('style')
        stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
        document.head.appendChild(stylesheet)

        const styles = document.createTextNode(\`${file.value}\`)
        stylesheet.innerHTML = ''
        stylesheet.appendChild(styles)
    })()
    `;

	return URL.createObjectURL(
		new Blob([js], { type: 'application/javascript' })
	);
}

/**
 * 通过babel插件处理import语句，转换成blob url，这是为了解决import模块时引发的错误
 * @param files
 * @returns
 */
export function customResolver(files: Files): PluginObj {
	return {
		visitor: {
			// ImportDeclaration节点的source.value就是要替换的内容
			ImportDeclaration(path) {
				const modulePath = path.node.source.value;
				if (modulePath.startsWith('.')) {
					const file = getModuleFile(files, modulePath);
					if (!file) return;

					// css、tsx、.jso类的依赖，都通过blob url引入，第三方包会通过import maps引入
					if (file.name.endsWith('.css')) {
						path.node.source.value = css2Js(file);
					} else if (file.name.endsWith('.json')) {
						path.node.source.value = json2Js(file);
					} else {
						path.node.source.value = URL.createObjectURL(
							new Blob(
								[babelTransform(file.name, file.value, files)],
								{
									type: 'application/javascript',
								}
							)
						);
					}
				}
			},
		},
	};
}

/**
 * 在babel转换前，判断文件是否有import react，如果没有则帮助引入
 * @param filename
 * @param code
 * @returns
 */
export const beforeBabelTransform = (filename: string, code: string) => {
	let _code = code;
	const regexReact = /import\s+React/g;
	if (
		(filename.endsWith('.jsx') || filename.endsWith('.tsx')) &&
		!regexReact.test(code)
	) {
		_code = `import React from 'react';\n${code}`;
	}
	return _code;
};

/**
 * babel编译
 * 编译流程：parse transform generate
 * @param filename
 * @param code
 * @param files
 * @returns
 */
export const babelTransform = (
	filename: string,
	code: string,
	files: Files
) => {
	const _code = beforeBabelTransform(filename, code);
	let result = '';

	try {
		result = transform(_code, {
			presets: ['react', 'typescript'],
			filename,
			plugins: [customResolver(files)],
			retainLines: true, // 编译后，保持原行列号不变
		}).code!;
	} catch (error) {
		console.error('babel编译失败', error);
	}
	return result;
};

export const compile = (files: Files) => {
	const app = files[ENTRY_FILE_NAME];
	return babelTransform(ENTRY_FILE_NAME, app.value, files);
};
