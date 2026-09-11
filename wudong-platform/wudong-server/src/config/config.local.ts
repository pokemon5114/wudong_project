import { MidwayConfig } from '@midwayjs/core';

export default {
  koa: {
    port: Number(process.env.PORT) || 8001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        // 本地 MySQL 默认端口为 3306，也允许通过环境变量覆盖。
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_DATABASE || 'wudong_platform',
        synchronize: true,
        logging: true,
        charset: 'utf8mb4',
      },
    },
  },
} as MidwayConfig;
