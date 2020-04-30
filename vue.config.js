const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    publicPath: '/static/app',
    indexPath: path.resolve(__dirname, 'app/view/app.njk'),
    outputDir: path.resolve(__dirname, 'app/public/app/'),
    configureWebpack: {
        externals: {
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            "v-charts": "VeIndex"
        },
        plugins: [
            new BundleAnalyzerPlugin()
        ],
    },
    devServer: {
        port: 9000
    },
    chainWebpack: config => {

        config.plugins.delete('prefetch');
        config.plugins.delete('preload');

        config.plugin('provide')
            .use(webpack.ProvidePlugin, [{
                $: 'jquery',
                _: 'lodash'
            }]);
        config.plugin('html')
            .tap(args => {
                args[0].template = path.join(__dirname, 'src/app.html')
                return args
            })
    },
    css: {
        extract: false,
        sourceMap: false,
    }
};
