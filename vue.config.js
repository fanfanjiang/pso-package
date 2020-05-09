const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = {};
if (process.env.BABEL_ENV === 'development') {
    config = {
        configureWebpack: {
            externals: {
                vue: 'Vue',
                'element-ui': 'ELEMENT',
                "v-charts": "VeIndex",
                jquery: "jQuery",
                lodash: '_',
                xlsx: 'XLSX',
                'video.js': 'videojs'
            },
            plugins: [new BundleAnalyzerPlugin()],
        },
        devServer: {
            port: 9009
        },
        chainWebpack: config => {
            config.plugins.delete('prefetch');
            config.plugins.delete('preload');
            config.plugin('html')
                .tap(args => {
                    args[0].template = path.join(__dirname, 'example/app.html')
                    return args
                })
        },
        css: {
            extract: false,
            sourceMap: false,
        }
    }
} else {
    config = {
        configureWebpack: {
            externals: {
                vue: 'Vue',
                'element-ui': 'ELEMENT',
                "v-charts": "VeIndex",
                jquery: "jQuery",
                lodash: '_',
                xlsx: 'XLSX',
                'video.js': 'videojs'
            },
            plugins: [new BundleAnalyzerPlugin()],
        },
        chainWebpack: config => {
            config.plugins.delete('prefetch');
            config.plugins.delete('preload');
        },
        css: {
            extract: false,
            sourceMap: false,
        }
    }
}

module.exports = config;


