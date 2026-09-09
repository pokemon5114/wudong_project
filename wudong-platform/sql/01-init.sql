-- =========================================
-- 乌东文旅平台 - 数据库初始化脚本（含测试数据）
-- 版本: V1.0
-- 日期: 2026-09-09
-- =========================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS wudong_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wudong_platform;

-- =========================================
-- 关闭外键检查（方便导入）
-- =========================================
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================
-- 用户表
-- =========================================
DROP TABLE IF EXISTS `app_user`;
CREATE TABLE `app_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `password` varchar(100) NOT NULL COMMENT '密码(加密)',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint DEFAULT '0' COMMENT '性别: 0-未知, 1-男, 2-女',
  `region` varchar(100) DEFAULT NULL COMMENT '地区',
  `bio` varchar(500) DEFAULT NULL COMMENT '个人简介',
  `role` varchar(20) DEFAULT 'visitor' COMMENT '角色: visitor-游客, merchant-商家',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-禁用, 1-启用',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =========================================
-- 用户地址表
-- =========================================
DROP TABLE IF EXISTS `app_address`;
CREATE TABLE `app_address` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `district` varchar(50) DEFAULT NULL COMMENT '区县',
  `address` varchar(255) NOT NULL COMMENT '详细地址',
  `isDefault` tinyint DEFAULT '0' COMMENT '是否默认: 0-否, 1-是',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收货地址表';

-- =========================================
-- 商品分类表
-- =========================================
DROP TABLE IF EXISTS `app_category`;
CREATE TABLE `app_category` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `icon` varchar(255) DEFAULT NULL COMMENT '分类图标',
  `description` varchar(255) DEFAULT NULL COMMENT '分类描述',
  `sort` int DEFAULT '0' COMMENT '排序',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-禁用, 1-启用',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- =========================================
-- 商品表
-- =========================================
DROP TABLE IF EXISTS `app_product`;
CREATE TABLE `app_product` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` varchar(100) NOT NULL COMMENT '商品名称',
  `description` text COMMENT '商品描述',
  `price` int DEFAULT '0' COMMENT '商品价格(分)',
  `originalPrice` int DEFAULT NULL COMMENT '原价(分)',
  `images` text COMMENT '商品图片(JSON数组)',
  `coverImage` varchar(255) DEFAULT NULL COMMENT '商品封面图',
  `stock` int DEFAULT '0' COMMENT '库存数量',
  `unit` varchar(20) DEFAULT '件' COMMENT '单位',
  `categoryId` int DEFAULT NULL COMMENT '分类ID',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `heritageLevel` tinyint DEFAULT '0' COMMENT '非遗级别: 0-普通, 1-县级, 2-州级, 3-省级, 4-国家级',
  `heritageDesc` varchar(255) DEFAULT NULL COMMENT '非遗工艺描述',
  `viewCount` int DEFAULT '0' COMMENT '浏览量',
  `salesCount` int DEFAULT '0' COMMENT '销量',
  `detail` text COMMENT '商品详情(富文本)',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-下架, 1-上架',
  `isRecommend` tinyint DEFAULT '0' COMMENT '是否推荐: 0-否, 1-是',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_categoryId` (`categoryId`),
  KEY `idx_merchantId` (`merchantId`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- =========================================
-- 餐厅表
-- =========================================
DROP TABLE IF EXISTS `app_restaurant`;
CREATE TABLE `app_restaurant` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '餐厅ID',
  `name` varchar(100) NOT NULL COMMENT '餐厅名称',
  `description` text COMMENT '餐厅描述',
  `coverImage` varchar(255) DEFAULT NULL COMMENT '餐厅封面图',
  `images` text COMMENT '餐厅图片(JSON)',
  `avgPrice` int DEFAULT NULL COMMENT '人均价格(分)',
  `address` varchar(200) DEFAULT NULL COMMENT '地址',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `businessHours` varchar(100) DEFAULT NULL COMMENT '营业时间',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `rating` decimal(2,1) DEFAULT '5.0' COMMENT '评分: 1-5',
  `ratingCount` int DEFAULT '0' COMMENT '评分数量',
  `favoriteCount` int DEFAULT '0' COMMENT '收藏数量',
  `tags` text COMMENT '餐厅特色标签(JSON)',
  `environment` varchar(255) DEFAULT NULL COMMENT '环境描述',
  `specialties` text COMMENT '特色菜品(JSON)',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-歇业, 1-营业',
  `isRecommend` tinyint DEFAULT '0' COMMENT '是否推荐: 0-否, 1-是',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchantId` (`merchantId`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='餐厅表';

-- =========================================
-- 菜品表
-- =========================================
DROP TABLE IF EXISTS `app_dish`;
CREATE TABLE `app_dish` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '菜品ID',
  `name` varchar(100) NOT NULL COMMENT '菜品名称',
  `description` varchar(255) DEFAULT NULL COMMENT '菜品描述',
  `coverImage` varchar(255) DEFAULT NULL COMMENT '菜品图片',
  `price` int DEFAULT '0' COMMENT '价格(分)',
  `originalPrice` int DEFAULT NULL COMMENT '原价(分)',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `category` varchar(50) DEFAULT NULL COMMENT '菜品分类',
  `stock` int DEFAULT '0' COMMENT '库存',
  `salesCount` int DEFAULT '0' COMMENT '销量',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-售罄, 1-在售',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_restaurantId` (`restaurantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜品表';

-- =========================================
-- 餐桌表
-- =========================================
DROP TABLE IF EXISTS `app_table`;
CREATE TABLE `app_table` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '餐桌ID',
  `tableNo` varchar(20) NOT NULL COMMENT '餐桌编号',
  `tableType` varchar(20) DEFAULT '中桌' COMMENT '餐桌类型',
  `capacity` int DEFAULT '4' COMMENT '容纳人数',
  `price` int DEFAULT '0' COMMENT '价格(分)',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-不可用, 1-可用',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_restaurantId` (`restaurantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='餐桌表';

-- =========================================
-- 餐厅评价表
-- =========================================
DROP TABLE IF EXISTS `app_restaurant_review`;
CREATE TABLE `app_restaurant_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `rating` tinyint NOT NULL COMMENT '评分: 1-5',
  `content` text COMMENT '评论内容',
  `images` text COMMENT '评论图片(JSON)',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-隐藏, 1-显示',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_restaurantId` (`restaurantId`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='餐厅评价表';

-- =========================================
-- 民宿表
-- =========================================
DROP TABLE IF EXISTS `app_hotel`;
CREATE TABLE `app_hotel` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '民宿ID',
  `name` varchar(100) NOT NULL COMMENT '民宿名称',
  `description` text COMMENT '民宿描述',
  `coverImage` varchar(255) DEFAULT NULL COMMENT '封面图',
  `images` text COMMENT '图片(JSON)',
  `address` varchar(200) DEFAULT NULL COMMENT '地址',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `merchantId` int DEFAULT NULL COMMENT '商家ID',
  `hotelType` varchar(50) DEFAULT NULL COMMENT '民宿类型',
  `tags` text COMMENT '特色标签(JSON)',
  `checkInTime` varchar(20) DEFAULT '14:00' COMMENT '入住时间',
  `checkOutTime` varchar(20) DEFAULT '12:00' COMMENT '退房时间',
  `minPrice` int DEFAULT NULL COMMENT '最低价格(分)',
  `rating` decimal(2,1) DEFAULT '5.0' COMMENT '评分: 1-5',
  `ratingCount` int DEFAULT '0' COMMENT '评分数量',
  `favoriteCount` int DEFAULT '0' COMMENT '收藏数量',
  `environment` varchar(255) DEFAULT NULL COMMENT '环境描述',
  `facilities` text COMMENT '配套设施(JSON)',
  `nearbyScenery` varchar(255) DEFAULT NULL COMMENT '周围景观',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-歇业, 1-营业',
  `isRecommend` tinyint DEFAULT '0' COMMENT '是否推荐: 0-否, 1-是',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchantId` (`merchantId`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='民宿表';

-- =========================================
-- 房间表
-- =========================================
DROP TABLE IF EXISTS `app_room`;
CREATE TABLE `app_room` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `name` varchar(100) NOT NULL COMMENT '房间名称/房型',
  `description` varchar(255) DEFAULT NULL COMMENT '房间描述',
  `coverImage` varchar(255) DEFAULT NULL COMMENT '封面图',
  `images` text COMMENT '图片(JSON)',
  `price` int DEFAULT '0' COMMENT '价格(分)/晚',
  `originalPrice` int DEFAULT NULL COMMENT '原价(分)',
  `hotelId` int NOT NULL COMMENT '民宿ID',
  `capacity` int DEFAULT '2' COMMENT '容纳人数',
  `bedType` varchar(50) DEFAULT NULL COMMENT '床型',
  `area` int DEFAULT NULL COMMENT '房间面积(平方米)',
  `floor` int DEFAULT NULL COMMENT '楼层',
  `stock` int DEFAULT '0' COMMENT '库存(房间数)',
  `facilities` text COMMENT '配套设施(JSON)',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-不可预订, 1-可预订',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_hotelId` (`hotelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间表';

-- =========================================
-- 民宿评价表
-- =========================================
DROP TABLE IF EXISTS `app_hotel_review`;
CREATE TABLE `app_hotel_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `hotelId` int NOT NULL COMMENT '民宿ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `rating` tinyint NOT NULL COMMENT '评分: 1-5',
  `content` text COMMENT '评论内容',
  `images` text COMMENT '评论图片(JSON)',
  `checkInDate` date DEFAULT NULL COMMENT '入住日期',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-隐藏, 1-显示',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_hotelId` (`hotelId`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='民宿评价表';

-- =========================================
-- 景区表
-- =========================================
DROP TABLE IF EXISTS `app_scenic`;
CREATE TABLE `app_scenic` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '景区ID',
  `name` varchar(100) NOT NULL COMMENT '景区名称',
  `description` text COMMENT '景区介绍',
  `coverImage` varchar(255) DEFAULT NULL COMMENT '封面图',
  `images` text COMMENT '图片(JSON)',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `openTime` varchar(100) DEFAULT NULL COMMENT '开放时间',
  `rating` decimal(2,1) DEFAULT '5.0' COMMENT '评分: 1-5',
  `ticketPrice` int DEFAULT NULL COMMENT '门票价格(分)',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-关闭, 1-开放',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='景区表';

-- =========================================
-- 路线套餐表
-- =========================================
DROP TABLE IF EXISTS `app_route`;
CREATE TABLE `app_route` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '路线ID',
  `title` varchar(200) NOT NULL COMMENT '路线标题',
  `subtitle` varchar(500) DEFAULT NULL COMMENT '副标题',
  `days` int DEFAULT '1' COMMENT '行程天数',
  `price` int NOT NULL COMMENT '价格(分)',
  `includes` text COMMENT '包含项目(JSON)',
  `schedule` text COMMENT '行程安排(JSON)',
  `highlights` text COMMENT '亮点',
  `images` text COMMENT '图片列表(JSON)',
  `coverImage` varchar(255) DEFAULT NULL COMMENT '封面图',
  `maxPeople` int DEFAULT NULL COMMENT '最大人数',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-下架, 1-上架',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='路线套餐表';

-- =========================================
-- 帖子表
-- =========================================
DROP TABLE IF EXISTS `app_post`;
CREATE TABLE `app_post` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '帖子ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `content` text NOT NULL COMMENT '内容',
  `images` text COMMENT '图片列表(JSON)',
  `video` varchar(500) DEFAULT NULL COMMENT '视频URL',
  `postType` varchar(20) DEFAULT 'photo' COMMENT '类型: photo-图文, video-视频',
  `tags` text COMMENT '标签(JSON)',
  `likeCount` int DEFAULT '0' COMMENT '点赞数',
  `commentCount` int DEFAULT '0' COMMENT '评论数',
  `favoriteCount` int DEFAULT '0' COMMENT '收藏数',
  `viewCount` int DEFAULT '0' COMMENT '浏览数',
  `location` varchar(100) DEFAULT NULL COMMENT '关联地点',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-审核中, 1-正常, -1-已下架',
  `isFeatured` tinyint DEFAULT '0' COMMENT '是否精选: 0-否, 1-是',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`),
  KEY `idx_createTime` (`createTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子表';

-- =========================================
-- 评论表
-- =========================================
DROP TABLE IF EXISTS `app_comment`;
CREATE TABLE `app_comment` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `postId` int NOT NULL COMMENT '帖子ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `content` text NOT NULL COMMENT '评论内容',
  `likeCount` int DEFAULT '0' COMMENT '点赞数',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-删除, 1-正常',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_postId` (`postId`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- =========================================
-- 点赞表
-- =========================================
DROP TABLE IF EXISTS `app_like`;
CREATE TABLE `app_like` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `targetType` varchar(20) NOT NULL COMMENT '目标类型: post-帖子, comment-评论',
  `targetId` int NOT NULL COMMENT '目标ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '点赞时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`userId`, `targetType`, `targetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- =========================================
-- 收藏表
-- =========================================
DROP TABLE IF EXISTS `app_favorite`;
CREATE TABLE `app_favorite` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `targetType` varchar(20) NOT NULL COMMENT '目标类型: post-帖子, product-商品, hotel-民宿',
  `targetId` int NOT NULL COMMENT '目标ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '收藏时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`userId`, `targetType`, `targetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- =========================================
-- 购物车表
-- =========================================
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `quantity` int DEFAULT '1' COMMENT '数量',
  `selected` tinyint DEFAULT '1' COMMENT '是否选中: 0-否, 1-是',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_productId` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- =========================================
-- 订单主表
-- =========================================
DROP TABLE IF EXISTS `app_order`;
CREATE TABLE `app_order` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `orderNo` varchar(32) NOT NULL COMMENT '订单编号',
  `userId` int NOT NULL COMMENT '用户ID',
  `type` varchar(20) NOT NULL COMMENT '订单类型: product-商品, hotel-住宿, ticket-门票, route-路线, restaurant-餐位',
  `status` varchar(20) NOT NULL COMMENT '订单状态: pending-待支付, paid-已支付, confirmed-已确认, completed-已完成, cancelled-已取消',
  `totalAmount` decimal(10,2) NOT NULL COMMENT '总金额',
  `payAmount` decimal(10,2) DEFAULT '0.00' COMMENT '实付金额',
  `discountAmount` decimal(10,2) DEFAULT '0.00' COMMENT '优惠金额',
  `payTime` datetime DEFAULT NULL COMMENT '支付时间',
  `payType` varchar(20) DEFAULT NULL COMMENT '支付方式',
  `contactName` varchar(50) DEFAULT NULL COMMENT '联系人',
  `contactPhone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `extraData` text COMMENT '扩展数据(JSON)',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_orderNo` (`orderNo`),
  KEY `idx_userId` (`userId`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单主表';

-- =========================================
-- 订单明细表
-- =========================================
DROP TABLE IF EXISTS `app_order_item`;
CREATE TABLE `app_order_item` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `productId` int DEFAULT NULL COMMENT '商品ID',
  `productName` varchar(200) NOT NULL COMMENT '商品名称',
  `productImage` varchar(500) DEFAULT NULL COMMENT '商品图片',
  `specs` varchar(500) DEFAULT NULL COMMENT '规格',
  `price` decimal(10,2) NOT NULL COMMENT '单价',
  `quantity` int NOT NULL COMMENT '数量',
  `subtotal` decimal(10,2) NOT NULL COMMENT '小计',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_orderId` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- =========================================
-- 管理员表
-- =========================================
DROP TABLE IF EXISTS `app_admin`;
CREATE TABLE `app_admin` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `realName` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `role` varchar(20) DEFAULT 'admin' COMMENT '角色',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-禁用, 1-正常',
  `lastLoginTime` datetime DEFAULT NULL COMMENT '最后登录时间',
  `lastLoginIp` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- =========================================
-- 系统配置表
-- =========================================
DROP TABLE IF EXISTS `app_config`;
CREATE TABLE `app_config` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `configKey` varchar(100) NOT NULL COMMENT '配置键',
  `configValue` text COMMENT '配置值',
  `configName` varchar(100) DEFAULT NULL COMMENT '配置名称',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configKey` (`configKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- =========================================
-- 操作日志表
-- =========================================
DROP TABLE IF EXISTS `app_log`;
CREATE TABLE `app_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `adminId` int DEFAULT NULL COMMENT '管理员ID',
  `action` varchar(100) DEFAULT NULL COMMENT '操作名称',
  `content` text COMMENT '操作内容',
  `ip` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `userAgent` varchar(500) DEFAULT NULL COMMENT '用户代理',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_adminId` (`adminId`),
  KEY `idx_createTime` (`createTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- =========================================
-- 开启外键检查
-- =========================================
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- 插入测试数据
-- =========================================

-- 插入测试用户 (密码都是 123456，使用 bcrypt 加密)
INSERT INTO `app_user` (`phone`, `password`, `nickname`, `avatar`, `role`) VALUES
('13800138000', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '游客管理员', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'admin'),
('13800138001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '游客小明', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', 'visitor'),
('13800138002', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '苗族姑娘', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', 'visitor'),
('13900139001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '银饰匠人', 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant', 'merchant'),
('13900139002', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '民宿老板', 'https://api.dicebear.com/7.x/avataaars/svg?seed=merchant2', 'merchant');

-- 插入管理员 (用户名: admin, 密码: admin123)
INSERT INTO `app_admin` (`username`, `password`, `realName`, `role`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '系统管理员', 'super_admin');

-- 插入商品分类
INSERT INTO `app_category` (`name`, `icon`, `description`, `sort`) VALUES
('银饰', 'yinshi', '苗族银饰精美的传统手工艺品', 1),
('蜡染', 'laran', '古老的防染工艺，布料上的艺术', 2),
('刺绣', 'cixiu', '苗族刺绣图案精美色彩绚丽', 3),
('芦笙', 'lusheng', '苗族传统乐器', 4),
('竹编', 'zhubian', '竹子编织的生活用品', 5),
('服饰', 'fushi', '苗族传统服饰和盛装', 6);

-- 插入商品
INSERT INTO `app_product` (`name`, `description`, `price`, `originalPrice`, `stock`, `unit`, `categoryId`, `coverImage`, `heritageLevel`, `heritageDesc`, `isRecommend`) VALUES
('苗族银凤冠', '纯手工打造的传统苗族银凤冠，象征吉祥如意，采用千年传承的苗族银饰锻造技艺', 128800, 158800, 5, '顶', 1, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', 3, '省级非物质文化遗产', 1),
('手工蜡染布匹', '采用古法蓝靛蜡染技艺，天然植物染料，每一寸布料都承载着苗族古老的智慧', 3800, 4800, 50, '米', 2, 'https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg?auto=compress&cs=tinysrgb&w=800', 2, '州级非物质文化遗产', 1),
('苗绣披肩', '精湛的苗族刺绣技艺，图案取材于苗族古歌，每一针都是对传统的致敬', 68800, 88800, 30, '条', 3, 'https://images.pexels.com/photos/372748/pexels-photo-372748.jpeg?auto=compress&cs=tinysrgb&w=800', 2, '州级非物质文化遗产', 1),
('六管芦笙', '传统苗族六管芦笙，音质浑厚悠扬，是苗族文化的重要符号', 128000, 158000, 15, '支', 4, 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=800', 3, '省级非物质文化遗产', 0),
('竹编手提篮', '精选楠竹手工编织，环保实用，传承千年的竹编工艺', 16800, 19800, 80, '个', 5, 'https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800', 1, '县级非物质文化遗产', 0),
('苗族百鸟衣', '苗族盛装礼服，刺绣精美工艺精湛，被誉为穿在身上的史书', 2680000, 3280000, 3, '套', 6, 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=800', 4, '国家级非物质文化遗产', 1),
('银饰耳环套装', '苗族传统银耳环，蝴蝶纹样寓意吉祥，精美大方', 58000, 68000, 40, '对', 1, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', 2, '州级非物质文化遗产', 1),
('蜡染桌布套装', '手工蜡染工艺，可用于家居装饰，独特的蓝白之美', 26800, 32800, 60, '套', 2, 'https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg?auto=compress&cs=tinysrgb&w=800', 1, '县级非物质文化遗产', 0);

-- 插入餐厅
INSERT INTO `app_restaurant` (`name`, `description`, `coverImage`, `avgPrice`, `address`, `longitude`, `latitude`, `phone`, `businessHours`, `environment`, `tags`, `specialties`, `isRecommend`) VALUES
('苗家酸汤鱼庄', '正宗苗家酸汤鱼，采用苗族传统酸汤工艺，鲜美开胃，是体验苗族饮食文化的绝佳去处', 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=800', 5800, '乌东村一组', 108.6832, 26.4876, '0855-8234567', '09:00-21:00', '依山傍水，吊脚楼风格', '["特色美食","苗族风味","酸汤系列"]', '["酸汤鱼","苗家腊肉","腌鱼"]', 1),
('侗寨农家乐', '侗族特色农家菜，食材取自当地农户，新鲜健康，体验侗族饮食智慧', 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800', 4500, '乌东村二组', 108.6856, 26.4891, '0855-8234568', '10:00-20:00', '侗族木楼，庭院宽敞', '["农家菜","侗族风味","健康食材"]', '["侗家腌肉","糯米糍粑","香禾糯米饭"]', 1),
('乌东牛瘪馆', '黔东南特色牛瘪火锅，是待客上品，体验独特的民族美食', 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800', 6800, '乌东村三组', 108.6812, 26.4856, '0855-8234569', '11:00-22:00', '古朴典雅，民族特色装饰', '["特色火锅","必吃推荐","传统美食"]', '["牛瘪火锅","黄牛肉","牛杂"]', 1),
('禾花鱼农家院', '稻田禾花鱼特色餐厅，体验苗寨田园风味，新鲜食材直供', 'https://images.pexels.com/photos/2230285/pexels-photo-2230285.jpeg?auto=compress&cs=tinysrgb&w=800', 5200, '乌东村四组', 108.6878, 26.4912, '0855-8234570', '09:30-20:30', '稻田环绕，田园风光', '["田园风味","禾花鱼","时令蔬菜"]', '["禾花鱼","稻田鸭","时令野菜"]', 0);

-- 插入菜品
INSERT INTO `app_dish` (`name`, `description`, `price`, `restaurantId`, `category`, `stock`) VALUES
('酸汤鱼', '苗家招牌酸汤鱼', 8800, 1, '招牌菜', 50),
('苗家腊肉', '传统苗族腌制腊肉', 4800, 1, '特色菜', 50),
('腌鱼', '苗家传统腌鱼', 5800, 1, '特色菜', 30),
('野菜汤', '新鲜山野蔬菜汤', 1800, 1, '汤类', 100),
('侗家腌肉', '侗族特色腌肉', 5800, 2, '招牌菜', 40),
('糯米糍粑', '手工糯米糍粑', 2800, 2, '主食', 80),
('香禾糯米饭', '从江香禾糯米', 1500, 2, '主食', 100),
('酸菜扣肉', '侗家酸菜扣肉', 6800, 2, '招牌菜', 30),
('牛瘪火锅', '黔东南特色牛瘪', 12800, 3, '招牌菜', 20),
('黄牛肉片', '新鲜黄牛肉', 8800, 3, '涮菜', 40),
('牛杂拼盘', '牛下水拼盘', 5800, 3, '涮菜', 30),
('野菜拼盘', '新鲜野菜', 2200, 3, '涮菜', 50),
('禾花鱼', '稻田禾花鱼', 6800, 4, '招牌菜', 30),
('稻田鸭', '稻田放养鸭', 8800, 4, '招牌菜', 20),
('时令野菜', '当日新鲜野菜', 1200, 4, '素菜', 100),
('糯米酒', '苗家糯米酒', 2000, 4, '酒水', 50);

-- 插入民宿
INSERT INTO `app_hotel` (`name`, `description`, `coverImage`, `address`, `longitude`, `latitude`, `phone`, `hotelType`, `tags`, `checkInTime`, `checkOutTime`, `minPrice`, `environment`, `facilities`, `nearbyScenery`, `isRecommend`) VALUES
('乌东吊脚楼客栈', '依山而建的苗家吊脚楼，推窗可见层层梯田，体验原生态苗寨生活', 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800', '乌东村一组观景台旁', 108.6838, 26.4882, '0855-8234561', '吊脚楼', '["观景","苗族特色","原生态"]', '14:00', '12:00', 29800, '依山傍水，梯田环绕', '["免费WiFi","热水","早餐","停车场"]', '观景台、梯田风光', 1),
('侗家木楼民宿', '传统侗族木楼建筑，冬暖夏凉，感受侗族人民的热情好客', 'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=800', '乌东村二组侗寨鼓楼旁', 108.6862, 26.4902, '0855-8234562', '木楼', '["侗族特色","鼓楼旁","文化体验"]', '14:00', '12:00', 19800, '侗寨中心，鼓楼为伴', '["免费WiFi","热水","侗族歌舞表演"]', '侗族鼓楼、风雨桥', 1),
('乌东梯田观景民宿', '位于半山腰的精品民宿，视野开阔，是观赏日出云海的绝佳位置', 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800', '乌东村三组半山', 108.6818, 26.4868, '0855-8234563', '现代与传统结合', '["观日出","云海","摄影胜地"]', '14:00', '12:00', 39800, '半山之巅，视野绝佳', '["免费WiFi","热水","观景平台","摄影指导"]', '日出云海、梯田全景', 1),
('苗家田园客栈', '稻田环绕的田园民宿，清晨闻鸡鸣而起，夜晚听蛙声入睡', 'https://images.pexels.com/photos/2322446/pexels-photo-2322446.jpeg?auto=compress&cs=tinysrgb&w=800', '乌东村四组农田旁', 108.6885, 26.4918, '0855-8234564', '田园风格', '["田园风光","农耕体验","亲子游"]', '14:00', '12:00', 16800, '稻田环绕，蛙鸣阵阵', '["免费WiFi","热水","农家早餐","农耕体验"]', '稻田、菜园、溪流', 0);

-- 插入房间
INSERT INTO `app_room` (`name`, `description`, `price`, `hotelId`, `bedType`, `capacity`, `area`, `stock`) VALUES
('观景大床房', '推窗即见梯田', 39800, 1, '大床', 2, 25, 3),
('家庭套房', '适合家庭入住', 59800, 1, '大床+小床', 4, 40, 2),
('标准双人间', '经济实惠之选', 29800, 1, '双床', 2, 20, 5),
('鼓楼景观房', '可观鼓楼全景', 32800, 2, '大床', 2, 22, 4),
('侗家特色房', '体验侗族文化', 24800, 2, '大床', 2, 20, 6),
('三人间', '朋友出行首选', 35800, 2, '三床', 3, 28, 3),
('日出观景套房', '最佳日出观赏点', 68800, 3, '大床', 2, 35, 2),
('云海景观房', '云海奇观尽收眼底', 49800, 3, '大床', 2, 28, 3),
('摄影主题房', '专为摄影爱好者设计', 42800, 3, '双床', 2, 25, 2),
('田园标准间', '亲近自然的体验', 19800, 4, '双床', 2, 18, 8),
('亲子家庭房', '带孩子体验农耕', 28800, 4, '大床+小床', 3, 30, 4),
('阳光大床房', '阳光充沛的温馨房间', 21800, 4, '大床', 2, 20, 5);

-- 插入景区
INSERT INTO `app_scenic` (`name`, `description`, `coverImage`, `address`, `openTime`, `ticketPrice`) VALUES
('乌东梯田', '层层叠叠的苗族梯田，四季变换不同美景，被誉为"挂在山间的天梯"', 'https://images.pexels.com/photos/2310713/pexels-photo-2310713.jpeg?auto=compress&cs=tinysrgb&w=800', '乌东村', '全天开放', 0),
('苗族博物馆', '展示苗族历史文化，了解苗族的发展历程和灿烂文明', 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=800', '乌东村文化中心', '09:00-18:00', 5000),
('乌东古寨', '保存完好的苗族古寨，几百年的吊脚楼群诉说着历史', 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800', '乌东村古寨区', '全天开放', 0),
('侗族鼓楼', '侗族标志性建筑，是侗寨的象征，也是社交和娱乐中心', 'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=800', '侗寨鼓楼广场', '全天开放', 0),
('苗族歌舞表演', '每晚举行的苗族歌舞表演，感受苗族人民的热情', 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800', '乌东村文化广场', '20:00-21:30', 8000);

-- 插入路线
INSERT INTO `app_route` (`title`, `subtitle`, `days`, `price`, `includes`, `highlights`, `coverImage`, `status`) VALUES
('乌东梯田日出游', '清晨登顶观赏云海日出，体验苗寨晨曦之美', 1, 29900, '["往返交通","早餐","景区门票","导游服务"]', '["日出云海","梯田全景","摄影指导"]', 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('苗族文化深度体验一日游', '全方位体验苗族文化，蜡染、刺绣、银饰应有尽有', 1, 39900, '["往返交通","午餐","蜡染体验","刺绣体验","银饰参观"]', '["非遗体验","苗族服饰","苗族美食"]', 'https://images.pexels.com/photos/372748/pexels-photo-372748.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('古寨探秘两日游', '深度探索乌东古寨，感受百年吊脚楼的魅力', 2, 69900, '["往返交通","住宿一晚","三餐","景区门票","民俗体验"]', '["古寨探秘","吊脚楼体验","篝火晚会"]', 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('侗苗文化双体验周末游', '周末两日游，同时体验侗族和苗族的独特文化', 2, 79900, '["往返交通","住宿一晚","三餐","侗族体验","苗族体验"]', '["侗族鼓楼","苗族歌舞","民族美食"]', 'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=800', 1);

-- 插入帖子
INSERT INTO `app_post` (`userId`, `content`, `tags`, `likeCount`, `commentCount`, `viewCount`, `location`, `isFeatured`) VALUES
(2, '乌东梯田的日出真的太美了！清晨五点半登山，看到云海翻涌，太阳从山间升起，金色的阳光洒在层层梯田上，简直就是人间仙境！强烈推荐摄影爱好者来打卡！', '["乌东梯田","日出","摄影"]', 156, 23, 1024, '乌东梯田', 1),
(2, '今天在苗家体验了蜡染技艺，太有意思了！老师傅手把手教，从绘制图案到浸染晾晒，每一个步骤都很有讲究。最后带走了自己亲手做的蜡染方巾，超级有成就感！', '["蜡染体验","非遗传承","手工艺"]', 89, 15, 568, '苗家蜡染坊', 1),
(3, '住在吊脚楼客栈的第一晚，听着窗外的蛙鸣和溪水声入睡，这种感觉太治愈了！清晨被鸟叫声唤醒，推开窗户就是满眼的梯田，感觉整个人都被大自然治愈了。', '["吊脚楼","民宿推荐","梯田风光"]', 234, 42, 1856, '乌东吊脚楼客栈', 1),
(2, '苗家酸汤鱼，味道绝了！酸辣开胃，鱼肉鲜嫩，配上当地的野菜，一口下去满满的都是苗家的味道。老板人很热情，还教我们唱苗族敬酒歌，太开心了！', '["苗家酸汤鱼","美食推荐","苗族美食"]', 178, 31, 1234, '苗家酸汤鱼庄', 0),
(3, '篝火晚会上和当地苗族同胞一起跳舞，太欢乐了！他们都很热情好客，歌声嘹亮，舞姿优美。虽然动作笨拙，但是很开心！这种体验只有在乌东才能有。', '["篝火晚会","苗族歌舞","文化体验"]', 312, 56, 2456, '乌东村文化广场', 1),
(2, '乌东古寨真的太有历史感了！几百年的吊脚楼保存完好，斑驳的木墙诉说着岁月的故事。走在青石板路上，仿佛穿越回了过去，感受到了苗族先民的智慧。', '["乌东古寨","吊脚楼","历史遗迹"]', 145, 28, 987, '乌东古寨', 0);

-- 插入评论
INSERT INTO `app_comment` (`postId`, `userId`, `content`) VALUES
(1, 3, '太美了！我也想去看看，求攻略！'),
(1, 2, '早上四点就要起床，但是值得！'),
(2, 2, '下次也要去体验一下，看起来很有趣'),
(5, 2, '篝火晚会的气氛太好了，还想再去一次！');

-- 插入系统配置
INSERT INTO `app_config` (`configKey`, `configValue`, `configName`) VALUES
('platform_name', '乌东文旅平台', '平台名称'),
('platform_logo', '/logo.png', '平台Logo'),
('contact_phone', '400-888-8888', '联系电话'),
('commission_rate', '0.05', '平台抽佣比例');

SELECT '数据库初始化完成！' AS result;
