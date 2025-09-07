import { defineConfig } from 'vite'

// Using esbuild's React transform without plugin-react. Keep React in scope.
export default defineConfig({
  server: {
    port: 5173
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  }
})

