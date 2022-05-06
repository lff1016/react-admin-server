// 定义用户相关的数据接口
let Mock = require('mockjs')
let Random = Mock.Random

// 定义用户列表
const userList = {
  users: [{
    id: 1,
    username: 'chenshufeng',
    password: '1234',
    phone: '18508209254',
    email: '123@qq.com',
    roles: 0,
    create_time: '2003-04-3',
    bio: '有志者事竟成',
    avatar: 'https://joeschmoe.io/api/v1/random'
  },
  {
    id: 2,
    username: 'test2',
    password: '1234',
    phone: '18508209254',
    email: '1234@qq.com',
    roles: 1,
    create_time: '2003-04-30',
    bio: '千里之行始于足下',
    avatar: 'https://joeschmoe.io/api/v1/random'
  }]
}

for(let i = 2; i <= 5; i++) {
  userList.users.push(
    Mock.mock({
      id: i+1,
      username: Random.string(4, 12),
      password: Random.string(4, 12),
      phone: Random.string('number', 11),
      email: Random.email(),
      roles: '1',
      create_time: Random.date(), //随机生成时间----"2014-07-01"
      bio: Random.csentence(4,10), // 随机生成句子
      avatar: 'https://joeschmoe.io/api/v1/random'
    })
  )
}


// 导出 userList
module.exports = userList
