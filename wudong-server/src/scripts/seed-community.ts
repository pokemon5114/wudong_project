import { DataSource } from 'typeorm';
import { AppPostEntity, AppCommentEntity } from '../modules/community/entity/community';
import { AppUserEntity } from '../modules/user/entity/user';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'wudong_platform',
  entities: [AppPostEntity, AppCommentEntity, AppUserEntity],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('数据库连接成功');

  // 清理旧数据
  await dataSource.getRepository(AppCommentEntity).delete({});
  await dataSource.getRepository(AppPostEntity).delete({});
  console.log('旧数据已清理');

  // 获取用户
  const userRepo = dataSource.getRepository(AppUserEntity);
  const users = await userRepo.find();

  if (users.length === 0) {
    console.log('没有用户，跳过种子数据创建');
    await dataSource.destroy();
    return;
  }

  const userId = users[0].id;

  // 创建帖子
  const posts = [
    {
      userId,
      content: '乌东梯田的日出真的太美了！清晨五点半登山，看到云海翻涌，太阳从山那边慢慢升起，金色的阳光洒在层层梯田上，简直像仙境一样。下次还要再来！',
      images: JSON.stringify(['/uploads/post/titian-sunrise-1.jpg', '/uploads/post/titian-sunrise-2.jpg']),
      postType: 'photo',
      tags: JSON.stringify(['乌东梯田', '日出', '摄影']),
      location: '乌东村',
      likeCount: 45,
      commentCount: 8,
      viewCount: 156,
      isFeatured: 1,
    },
    {
      userId,
      content: '今天在苗家体验了蜡染技艺，太有意思了！老师傅手把手教，从绘制图案到染色，每一步都很有讲究。做出了自己专属的蜡染方巾，带回家做纪念！',
      images: JSON.stringify(['/uploads/post/laran-1.jpg']),
      postType: 'photo',
      tags: JSON.stringify(['蜡染', '非遗体验', '苗族']),
      location: '苗家蜡染体验坊',
      likeCount: 38,
      commentCount: 5,
      viewCount: 89,
      isFeatured: 1,
    },
    {
      userId,
      content: '住在吊脚楼客栈的第一晚，听着窗外的蛙鸣和溪水声入睡，这种感觉太治愈了。远离城市的喧嚣，回归大自然，这就是向往的生活吧。',
      images: JSON.stringify(['/uploads/post/diaojiaolou-night-1.jpg']),
      postType: 'photo',
      tags: JSON.stringify(['吊脚楼', '民宿', '田园生活']),
      location: '乌东吊脚楼客栈',
      likeCount: 56,
      commentCount: 12,
      viewCount: 203,
      isFeatured: 1,
    },
    {
      userId,
      content: '苗家酸汤鱼，味道绝了！酸辣开胃，鱼肉鲜嫩，配上当地的野菜，一口气吃了两碗饭。强烈推荐大家来尝尝！',
      images: JSON.stringify(['/uploads/post/suantangyu-1.jpg']),
      postType: 'photo',
      tags: JSON.stringify(['酸汤鱼', '苗族美食', '美食推荐']),
      location: '苗家酸汤鱼庄',
      likeCount: 32,
      commentCount: 6,
      viewCount: 78,
      isFeatured: 0,
    },
    {
      userId,
      content: '篝火晚会上和当地苗族同胞一起跳舞，太欢乐了！他们都很热情好客，歌声嘹亮，舞姿优美。虽然动作笨拙，但是很开心！',
      images: JSON.stringify(['/uploads/post/bonfire-1.jpg', '/uploads/post/bonfire-2.jpg']),
      postType: 'photo',
      tags: JSON.stringify(['篝火晚会', '苗族歌舞', '文化体验']),
      location: '乌东村文化广场',
      likeCount: 67,
      commentCount: 15,
      viewCount: 245,
      isFeatured: 1,
    },
    {
      userId,
      content: '乌东古寨真的太有历史感了！几百年的吊脚楼保存完好，斑驳的木墙诉说着岁月的故事。漫步在青石板路上，仿佛穿越到了过去。',
      images: JSON.stringify(['/uploads/post/guzhai-1.jpg']),
      postType: 'photo',
      tags: JSON.stringify(['古寨', '吊脚楼', '历史']),
      location: '乌东古寨',
      likeCount: 41,
      commentCount: 7,
      viewCount: 112,
      isFeatured: 0,
    },
  ];

  const postRepo = dataSource.getRepository(AppPostEntity);
  const savedPosts: AppPostEntity[] = [];

  for (const post of posts) {
    const entity = postRepo.create(post);
    const saved = await postRepo.save(entity);
    savedPosts.push(saved);
    console.log(`帖子已创建: ${post.content.slice(0, 30)}...`);
  }

  // 为部分帖子创建评论
  const commentRepo = dataSource.getRepository(AppCommentEntity);
  const commentsData = [
    { postIdx: 0, comments: [
      { userId, content: '太美了！求攻略，下次也想去' },
      { userId, content: '请问几点起床合适？需要带什么装备吗？' },
      { userId, content: '这个角度拍得真好！' },
    ]},
    { postIdx: 1, comments: [
      { userId, content: '蜡染体验看起来很有趣！价格贵吗？' },
      { userId, content: '我也想体验！可以预约吗？' },
    ]},
    { postIdx: 4, comments: [
      { userId, content: '篝火晚会太好玩了！' },
      { userId, content: '每周都有吗？' },
      { userId, content: '能教教我那个舞步吗？' },
      { userId, content: '氛围太好了！' },
    ]},
  ];

  for (const cd of commentsData) {
    for (const comment of cd.comments) {
      const entity = commentRepo.create({
        postId: savedPosts[cd.postIdx].id,
        ...comment,
      });
      await commentRepo.save(entity);
    }
    console.log(`评论已创建: ${savedPosts[cd.postIdx].content.slice(0, 20)}...`);
  }

  console.log('\n社区种子数据初始化完成！');
  console.log(`- 帖子: ${savedPosts.length} 个`);
  console.log(`- 评论: ${commentsData.reduce((sum, c) => sum + c.comments.length, 0)} 条`);

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('种子数据初始化失败:', err);
  process.exit(1);
});
