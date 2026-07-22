import path from "node:path"
import { fileURLToPath } from "node:url"

import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"

const dirname = path.dirname(fileURLToPath(import.meta.url))

const sharedPlugins = [
  alias({
    entries: [{ find: "@", replacement: dirname }],
  }),
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify("production"),
  }),
  nodeResolve({
    browser: true,
    extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx"],
  }),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json",
    compilerOptions: {
      jsx: "react-jsx",
      noEmit: false,
      noEmitOnError: false,
      outDir: "out",
      declaration: false,
      declarationMap: false,
    },
  }),
  terser({
    format: {
      comments: false,
    },
  }),
]

const onwarn = (warning, defaultHandler) => {
  if (warning.code === "MODULE_LEVEL_DIRECTIVE") return
  if (warning.code === "CIRCULAR_DEPENDENCY") return

  defaultHandler(warning)
}

const qiankunConfig = [
  {
    input: "qiankun/react-vendor.js",
    onwarn,
    output: {
      file: "out/qiankun-react-vendor.js",
      format: "iife",
      name: "elogQiankunReactVendor",
      sourcemap: false,
    },
    plugins: sharedPlugins,
  },
  {
    input: "qiankun/qiankun-app.tsx",
    external: ["react", "react-dom/client", "react/jsx-runtime"],
    onwarn,
    output: {
      file: "out/qiankun-app.js",
      format: "iife",
      name: "elogQiankunApp",
      globals: {
        react: "globalThis.React",
        "react-dom/client": "globalThis.ReactDOMClient",
        "react/jsx-runtime": "globalThis.ReactJSXRuntime",
      },
      sourcemap: false,
    },
    plugins: sharedPlugins,
  },
]

export default qiankunConfig
