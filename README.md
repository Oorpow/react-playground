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


## 布局

### 编辑器和预览部分宽度拖拽实现

原理
- absolute 布局，拖动时改变width

现成库: `allotment`