const mysql = require('mysql')
const MYSQL_CONF = require('../conf/db')

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

// 统一执行sql语句
const exec = (sql) => {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        console.log('exec_err: ', err)
        reject(err)
        return
      }
      result = JSON.parse(JSON.stringify(result))
      console.log('exec_result: ', result)
      resolve(result)
    })
  })
  return promise
}

module.exports = exec