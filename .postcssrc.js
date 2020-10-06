// PostCSS 的配置文件

module.exports = {
  // 配置要使用的 PostCSS 插件
  plugins: {
    // 作用：生成浏览器 CSS 样式规则前缀
    // VueCLI 内部已经配置了 autoprefixer 插件
    // 这又配置了一次，所以就产生了冲突， 在运行项目时就会有警告  这里注释掉即可
    // autoprefixer: {
    // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // lib-flexible 的 REM 适配方案： 把一行分为  10份，每份就是  十分之一
      // 所以  rootValue  应该设置为你的设计稿宽的十分之一
      // 本次设计稿 是 750  所以应该设置为  750  /  10  =  75
      // 但是 Vant  建议设置为  37.5  是为什么？  因为 Vant 是基于  375  写的
      // 所以 必须设置为  37.5  但是直接这样写的缺点就是  我们自己量出来的宽高都得 除以2
      // 所以就要想办法区分我们写的样式和Vant 的样式
      // 通过查阅文档，可以发现  rootValue 除了可以接收一个固定的数字之外，还可以直接接收一个函数，
      // postcss-pxtorem  处理每个 CSS 文件的时候都会调用这个函数
      // 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
      // 通过函数中的options 参数 可以区分这两个样式，然后分别设置对应的值
      // ({ file })  这里是 参数结构的写法   完整打印出来的话  这里options 就是一个对象
      // 其中的 file  属性代表处理的 css 文件的路径   可以通过  indexOf 来判断  没有 Vant  的 话  就是 -1
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // 配置要转换的CSS 属性   * 表示所有的
      propList: ['*'],

      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
