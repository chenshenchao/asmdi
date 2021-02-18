export default [{
    input: 'main/browser.js',
    output: {
        file: 'dist/iife.js',
        name: 'asmdi',
        format: 'iife',
    },
}, {
    input: 'main/node.js',
    output: {
        file: 'dist/umd.js',
        name: 'asmdi',
        format: 'umd',
    },
}]