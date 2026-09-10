import * as orm from '@midwayjs/typeorm';
import {
  Configuration,
  App,
  IMidwayApplication,
  Inject,
  ILogger,
} from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as staticFile from '@midwayjs/static-file';
import * as upload from '@midwayjs/upload';
import * as DefaultConfig from './config/config.default';
import * as LocalConfig from './config/config.local';
import * as ProdConfig from './config/config.prod';

@Configuration({
  imports: [
    koa,
    staticFile,
    orm,
    validate,
    upload,
    {
      component: info,
      enabledEnvironment: ['local', 'prod'],
    },
  ],
  importConfigs: [
    {
      default: DefaultConfig,
      local: LocalConfig,
      prod: ProdConfig,
    },
  ],
})
export class MainConfiguration {
  @App()
  app: IMidwayApplication;

  @Inject()
  logger: ILogger;

  async onReady() {
    this.logger.info('乌东文旅平台服务启动完成 - 贵州黔东南苗族侗族自治州乌东村');
  }
}
