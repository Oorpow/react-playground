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

### 代码预览

原理: 
- `iframe` + 通信机制
- 代码编辑器将结果用babel编译后，传到iframe渲染
- 在预览生成的内容时，url同样是将内容内嵌到src，生成blob url


## 布局

### 编辑器和预览部分宽度拖拽实现

原理
- absolute 布局，拖动时改变width

现成库: `allotment`