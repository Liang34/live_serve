# live_serve
这个项目分为两个模块：

#### 后端管理系统模块

用户管理模块包括：

模板渲染引擎：`egg-view-nunjucks`

- 用户管理
- 直播间管理
- 礼物管理
- 订单管理
- 管理员管理

#### 前端接口处理模块

直播后台接口

https://github.com/Liang34/live_serve.git

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
直播间列表

```
npx sequelize mrgration:generate --name=live
```

```js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    return queryInterface.createTable('live', {
      id: {
        type: INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '直播间标题',
      },
      cover: {
        type: STRING,
        allowNull: true,
        defaultValue: '',
        comment: '直播间封面',
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '用户id',
        references: {
          model: 'user',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'restrict', // 更新时操作
      },
      look_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '总观看人数',
      },
      coin: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '总金币',
      },
      key: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '唯一标识',
      },
      status: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: '直播间状态 0未开播 1直播中 2暂停直播 3直播结束',
      },
      created_time: DATE,
      updated_time: DATE,
    });
  },

  down: async queryInterface => {
    return queryInterface.dropTable('live');
  },
};
```

用户登录

jwt加密鉴权

```js
npm i egg-jwt --save
```

配置

```js
// plugin.js
export.jwt = {
    enable: true,
    package: 'egg-jwt'
}
// config.default.js
config.jwt = {
    secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672',
}
```

token

```js
// app/extend/context.js
// 生成token
  getToken(value) {
    return this.app.jwt.sign(value, this.app.config.jwt.secret);
  },
  // 验证token
  checkToken(token) {
    return this.app.jwt.verify(token, this.app.config.jwt.secret);
  },
  // 验证密码
  async checkPassword(password, hash_password) {
    // 先对需要验证的密码进行加密
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret);
    hmac.update(password);
    password = hmac.digest('hex');
    const res = password === hash_password;
    if (!res) {
      this.throw(400, '密码错误');
    }
    return true;
  }
```

redis缓存token

```js
npm i egg-redis --save
// plugin
redis: {
    enable: true,
    package: 'egg-redis',
},
// config.default.js
// redis存储
config.redis = {
  client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 2,
  },
}   
```

缓存库封装

```js
// app/service/cache.js
'use strict';

const Service = require('egg').Service;

class CacheService extends Service {
  /**
     * 获取列表
     * @param {string} key 键
     * @param {boolean} isChildObject 元素是否为对象
     * @return { array } 返回数组
     */
  async getList(key, isChildObject = false) {
    const { redis } = this.app;
    let data = await redis.lrange(key, 0, -1);
    if (isChildObject) {
      data = data.map(item => {
        return JSON.parse(item);
      });
    }
    return data;
  }
  /**
     * 设置列表
     * @param {string} key 键
     * @param {object|string} value 值
     * @param {string} type 类型：push和unshift
     * @param {Number} expir 过期时间 单位秒
     * @return { Number } 返回索引
     */
  async setList(key, value, type = 'push', expir = 0) {
    const { redis } = this.app;
    if (expir > 0) {
      await redis.expire(key, expir);
    }
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    if (type === 'push') {
      return await redis.rpush(key, value);
    }
    return await redis.lpush(key, value);
  }

  /**
     * 设置 redis 缓存
     * @param { String } key 键
     * @param {String | Object | array} value 值
     * @param { Number } expir 过期时间 单位秒
     * @return { String } 返回成功字符串OK
     */
  async set(key, value, expir = 0) {
    const { redis } = this.app;
    if (expir === 0) {
      return await redis.set(key, JSON.stringify(value));
    }
    return await redis.set(key, JSON.stringify(value), 'EX', expir);

  }

  /**
     * 获取 redis 缓存
     * @param { String } key 键
     * @return { String | array | Object } 返回获取的数据
     */
  async get(key) {
    const { redis } = this.app;
    const result = await redis.get(key);
    return JSON.parse(result);
  }

  /**
     * redis 自增
     * @param { String } key 键
     * @param { Number } value 自增的值
     * @return { Number } 返回递增值
     */
  async incr(key, number = 1) {
    const { redis } = this.app;
    if (number === 1) {
      return await redis.incr(key);
    }
    return await redis.incrby(key, number);
  }

  /**
     * 查询长度
     * @param { String } key
     * @return { Number } 返回数据长度
     */
  async strlen(key) {
    const { redis } = this.app;
    return await redis.strlen(key);
  }

  /**
     * 删除指定key
     * @param {String} key
     */
  async remove(key) {
    const { redis } = this.app;
    return await redis.del(key);
  }

  /**
     * 清空缓存
     */
  async clear() {
    return await this.app.redis.flushall();
  }
}
module.exports = CacheService;
```

权限验证中间键

```js
// app/middleware/auth.js

```

搭建直播服务器

```js
npm install node-media-server --save
```

[文档](https://github.com/illuspas/Node-Media-Server/blob/master/README_CN.md)

配置：config/config.defult.js

```js
// 流媒体配置
config.mediaServer = {
  rtmp: {
    port: 23480,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 23481,
    allow_origin: '*'
  },
  auth: {
    play: true,
    publish: true,
    secret: 'nodemedia2017privatekey',
  },
};
```

创建订单和微信支付

插件：`egg-tenpay`

```
npm i egg-tenpay --save
```

