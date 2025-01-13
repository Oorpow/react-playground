# React Playground

## 实现原理

### 编译

babel编译流程
- parse
- transform（babel插件在此阶段，增删改AST）
- generate

核心库: `@babel/standalone` 可以将tsx代码编译为js

如何让编译后的代码运行?
- 在运行代码时，如果有import模块，此时会找不到，因此需要使用blob url来作为import的路径
- 再交给babel插件去做import 的source替换

```js
// 如下方式可以将一段JS代码，变成一个URL
URL.createObjectURL(new Blob([code], { type: 'application/javascript' }))
```

如果引入的是react、react-dom这类的包呢?

- 使用import map机制，配合esm.sh网站来引入

```html
<body>
    <script type="importmap">
        {
            "imports": {
                "react": "https://esm.sh/react@18.2.0"
            }
        }
    </script>
    <script type="module">
        import React from "react";
        console.log(React);
    </script>
</body>
```

### 代码编辑器

核心库

```bash
npm install @monaco-editor/react
```

#### tsconfig 配置

> 处理jsx报错

```jsx
const editorOnMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.Preserve, // 处理tsconfig对jsx的报错
        esModuleInterop: true,
    });
};
```

#### 快捷行为

```jsx
const editorOnMount: OnMount = (editor, monaco) => {
    // 快捷键（CMD + K）实现代码格式化
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
        // 底层是执行预设好的action
        editor.getAction('editor.action.formatDocument')?.run();
    });
};
```

#### 引入第三方包没提示

核心库: `@typescript/ata`

```js
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
```

```jsx
const editorOnMount: OnMount = (editor, monaco) => {
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
```

### 代码预览

原理: 
- `iframe` + 通信机制
- 代码编辑器将结果用babel编译后，传到iframe渲染
- 在预览生成的内容时，url同样是将内容内嵌到src，生成blob url

具体实现: 
- 定义一个iframe html文件，提供import maps机制和src内容区
- 替换import maps
- 将编译后的代码，填充到src内容区
- 创建blob url，设置到iframe的src属性，完成渲染

```html
<body>
    <script type="importmap"></script>
    <script type="module" id="appSrc"></script>
    <div id="root"></div>
</body>
```

```jsx
import iframeRaw from 'iframe.html?raw'

const [iframeUrl, setIframeUrl] = useState(getIframeUrl())

function getIframeUrl() {
    const res = iframeRaw
        .replace(
            '<script type="importmap"></script>',
            `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
        )
        .replace(
            '<script type="module" id="appSrc"></script>',
            // compiledCode babel编译后的代码
            `<script type="module" id="appSrc">${compiledCode}</script>`
        );
    return URL.createObjectURL(new Blob([res], { type: 'text/html' }));
};

<iframe src={iframeUrl} />
```


### 多文件切换和文件区操作

> 涉及到多组件数据共享的问题，可以使用Context实现

文件区数据结构：

```js
{
    'App.vue': {
        name: 'App.vue',
        value: '<template><div>app</div></template>',
        language: 'vue'
    }
}
```

多组件共享的数据：
- 文件区
- 选中的文件
- 文件区的操作方法

### 错误提示
编辑器中产生的错误，在iframe预览里不会显示，错误仅出现在devtools里，因此需要提供一个组件给用户提示

实现思路：
- 封装一个组件，用于展示错误信息
- 错误信息来源于iframe，iframe可以将错误信息通过postMessage传递至父窗口，父窗口监听postMessage的通信事件就能拿到错误信息并展示

```html
<body>
    <script>
        // 监听错误，并通过postMessage传递错误信息至父窗口
        window.addEventListener('error', (e) => {
        window.parent.postMessage({
            type: 'ERROR',
            message: e.message
        })
        })
    </script>
</body>
```

```jsx
useEffect(() => {
    // handleErrorInfo 保存error state
    window.addEventListener('message', handleErrorInfo)
    return () => {
        window.removeEventListener('message', handleErrorInfo)
    }
}, [])
```

## 布局

### 编辑器和预览部分宽度拖拽实现

原理
- absolute 布局，拖动时改变width

现成库: `allotment`

## 主题切换

实现思路：
- CSS变量 + 切换html class
    - css变量可以在子元素中生效，子元素写样式时，基于这些变量，在切换class后，也就切换了变量值，从而实现主题切换

<!-- 预先准备好两套CSS主题变量，后续为HTML切换class为对应主题即可 -->
```css
.light {
    --bg-color: #0ea5e9;
}

.dark {
    --bg-color: #0f172a;
}
```

### tailwindcss

切换darkMode为手动

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
}
```

实现方式：
- 通过为body添加class dark即可生效

## 链接分享

原理：
- 分享出去的关键内容就是context中的files（包含所有文件信息）
- 将files JSON字符串化后，放在url后，读取时直接parse一下就能作为文件区的初始化数据

```jsx
const [files] = useState(getFilesFromUrl() || initFiles)

useEffect(() => {
    const hash = JSON.stringify(files)
    window.location.hash = encodeURIComponent(hash)
}, [files])

function getFilesFromUrl() {
    let files
    try {
        const hash = decodeURIComponent(window.location.hash.slice(1))
        files = decodeURIComponent(hash)
    } catch (error) {
        console.error(error)
    }
    return files
}
```

### 优化

文件内容放在url上，太长了，需要压缩

```bash
npm install --save fflate
```

```js
import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate';

/**
 * URL内容压缩
 * @param data
 * @returns ASC码
 */
export function urlCompress(data: string): string {
	// 字符串转字节数组
	const buffer = strToU8(data);
	// zlibSync压缩
	const zipped = zlibSync(buffer, { level: 9 });
	// strFromU8转字符串
	const binary = strFromU8(zipped, true);
	// btoa将base64编码后的字符串转ASC码
	return btoa(binary);
}

/**
 * URL内容解压缩
 * @param base64
 * @returns
 */
export function urlUncompressed(base64: string): string {
	const binary = atob(base64);
	const buffer = strToU8(binary, true);
	const unzipped = unzlibSync(buffer);
	return strFromU8(unzipped);
}
```