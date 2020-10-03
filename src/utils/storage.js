// 封装本地存储模块

// 1、存储数据
export const setItem = (key, value) => {
  // 把 数组 或 对象格式的数据 转换成 JSON 格式的字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 2、获取数据
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  // 如果得到的是字符串格式的 会转成对象再返回
  // 否则的话会报错  进入 catch  然后直接返回
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 3、删除数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
