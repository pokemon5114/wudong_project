import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AppUserEntity } from '../modules/user/entity/user';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'wudong_platform',
  entities: [AppUserEntity],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('数据库连接成功');

  // 按正确顺序清理关联数据
  console.log('清理关联数据...');
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
  await dataSource.query('TRUNCATE TABLE app_comment');
  await dataSource.query('TRUNCATE TABLE app_like');
  await dataSource.query('TRUNCATE TABLE app_favorite');
  await dataSource.query('TRUNCATE TABLE app_post');
  await dataSource.query('TRUNCATE TABLE app_user');
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('旧数据已清理');

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('123456', 10);

  const users = [
    { phone: '13800138000', password: hashedPassword, nickname: '游客管理员', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
    { phone: '13800138001', password: hashedPassword, nickname: '游客小明', role: 'visitor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' },
    { phone: '13800138002', password: hashedPassword, nickname: '苗族姑娘', role: 'visitor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2' },
    { phone: '13900139001', password: hashedPassword, nickname: '银饰匠人', role: 'merchant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant' },
    { phone: '13900139002', password: hashedPassword, nickname: '民宿老板', role: 'merchant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant2' },
  ];

  const userRepo = dataSource.getRepository(AppUserEntity);

  for (const user of users) {
    const entity = userRepo.create(user);
    await userRepo.save(entity);
    console.log(`用户已创建: ${user.nickname} (手机号: ${user.phone}, 密码: 123456)`);
  }

  console.log('\n用户种子数据初始化完成！');
  console.log('测试账号:');
  console.log('  管理员: 13800138000 / 123456');
  console.log('  用户1:  13800138001 / 123456');
  console.log('  用户2:  13800138002 / 123456');
  console.log('  商家1:  13900139001 / 123456');
  console.log('  商家2:  13900139002 / 123456');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('种子数据初始化失败:', err);
  process.exit(1);
});
