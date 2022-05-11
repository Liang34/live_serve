'use strict';

const Controller = require('egg').Controller;
// 引入
const fs = require('fs');
const path = require('path');
// 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
// 管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const dayjs = require('dayjs');

class CommonController extends Controller {
  // 上传文件
  async upload() {
    const stream = await this.ctx.getFileStream();
    // 基础目录
    const uploadBasePath = 'app/public/uploads';
    // 生成唯一文件名
    const filename = `${Date.now()}${path.extname(stream.filename).toLocaleLowerCase()}`;
    // 生成文件夹
    const dirname = dayjs(Date.now()).format('YYYY/MM/DD');
    function mkdirsSync(dirname) {
      if (fs.existsSync(dirname)) {
        return true;
      }
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
    mkdirsSync(path.join(uploadBasePath, dirname));
    // 生成写入路径
    const target = path.join(uploadBasePath, dirname, filename);
    // 写入流
    const writeStream = fs.createWriteStream(target);
    try {
      // 异步把文件流写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (error) {
      // 出现错误，关闭管道
      await sendToWormhole(stream);
      this.ctx.throw(500, error);
    }
    const url = path.join('/public/uploads', dirname, filename).replace(/\\|\//g, '/');
    this.ctx.apiSuccess({ url });
  }
}

module.exports = CommonController;
