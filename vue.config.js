const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    configureWebpack: {
        externals: {
            vue: 'Vue',
            'element-ui': 'ELEMENT',
            "v-charts": "VeIndex",
            jquery: "jQuery",
            lodash: '_',
            xlsx: 'XLSX',
            'video.js': 'videojs',
            html2canvas: 'html2canvas'
        },
        plugins: [
            // new BundleAnalyzerPlugin()
        ],
    },
    productionSourceMap: false,
    chainWebpack: config => {
        config.plugins.delete('prefetch');
        config.plugins.delete('preload');
    },
    css: {
        extract: false,
        sourceMap: false,
    }
};


