-- =========================================
-- 乌东文旅平台 - 数据库初始化脚本
-- 版本: V1.0
-- 日期: 2026-09-09
-- =========================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS wudong_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wudong_platform;

-- =========================================
-- 用户相关表
-- =========================================

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别: 0-未知, 1-男, 2-女',
  `role` VARCHAR(20) DEFAULT 'user' COMMENT '角色: user-用户, merchant-商家, admin-管理员',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 用户地址表
CREATE TABLE IF NOT EXISTS `user_address` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '收货人姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `province` VARCHAR(50) DEFAULT NULL COMMENT '省份',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
  `district` VARCHAR(50) DEFAULT NULL COMMENT '区县',
  `address` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `is_default` TINYINT DEFAULT 0 COMMENT '是否默认: 0-否, 1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收货地址表';

-- =========================================
-- 管理员相关表
-- =========================================

-- 管理员表
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
  `role` VARCHAR(20) DEFAULT 'admin' COMMENT '角色',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- 系统配置表
CREATE TABLE IF NOT EXISTS `sys_config` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
  `config_value` TEXT COMMENT '配置值',
  `config_name` VARCHAR(100) DEFAULT NULL COMMENT '配置名称',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 操作日志表
CREATE TABLE IF NOT EXISTS `operation_log` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `admin_id` INT DEFAULT NULL COMMENT '管理员ID',
  `operation` VARCHAR(100) DEFAULT NULL COMMENT '操作名称',
  `content` TEXT COMMENT '操作内容',
  `ip` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- =========================================
-- 商品模块 (衣 - 非遗商品)
-- =========================================

-- 商品分类表
CREATE TABLE IF NOT EXISTS `product_category` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '分类图标',
  `parent_id` INT DEFAULT 0 COMMENT '父级ID',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- 商品表
CREATE TABLE IF NOT EXISTS `product` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `title` VARCHAR(200) NOT NULL COMMENT '商品标题',
  `subtitle` VARCHAR(500) DEFAULT NULL COMMENT '副标题',
  `category_id` INT DEFAULT NULL COMMENT '分类ID',
  `merchant_id` INT DEFAULT NULL COMMENT '商家ID',
  `price` DECIMAL(10,2) NOT NULL COMMENT '售价',
  `market_price` DECIMAL(10,2) DEFAULT NULL COMMENT '市场价',
  `cost_price` DECIMAL(10,2) DEFAULT NULL COMMENT '成本价',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `main_image` VARCHAR(500) DEFAULT NULL COMMENT '主图',
  `images` TEXT COMMENT '图片列表(JSON)',
  `description` TEXT COMMENT '商品描述',
  `specs` TEXT COMMENT '规格信息(JSON)',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-上架, 0-下架',
  `is_recommend` TINYINT DEFAULT 0 COMMENT '是否推荐: 0-否, 1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_sales` (`sales`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 商品评价表
CREATE TABLE IF NOT EXISTS `product_review` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `product_id` INT NOT NULL COMMENT '商品ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `order_id` INT DEFAULT NULL COMMENT '订单ID',
  `rating` TINYINT NOT NULL COMMENT '评分(1-5)',
  `content` TEXT COMMENT '评价内容',
  `images` TEXT COMMENT '评价图片(JSON)',
  `reply` TEXT COMMENT '商家回复',
  `reply_time` DATETIME DEFAULT NULL COMMENT '回复时间',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-显示, 0-隐藏',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品评价表';

-- =========================================
-- 餐饮模块 (食)
-- =========================================

-- 餐厅表
CREATE TABLE IF NOT EXISTS `restaurant` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '餐厅ID',
  `name` VARCHAR(100) NOT NULL COMMENT '餐厅名称',
  `merchant_id` INT DEFAULT NULL COMMENT '商家ID',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '餐厅分类',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
  `longitude` DECIMAL(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` DECIMAL(10,6) DEFAULT NULL COMMENT '纬度',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `description` TEXT COMMENT '餐厅介绍',
  `images` TEXT COMMENT '图片列表(JSON)',
  `rating` DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `人均价格` DECIMAL(10,2) DEFAULT NULL COMMENT '人均价格',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-营业, 0-休息',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='餐厅表';

-- 菜品表
CREATE TABLE IF NOT EXISTS `dish` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '菜品ID',
  `restaurant_id` INT NOT NULL COMMENT '餐厅ID',
  `name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `image` VARCHAR(500) DEFAULT NULL COMMENT '图片',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '描述',
  `is_recommend` TINYINT DEFAULT 0 COMMENT '是否推荐: 0-否, 1-是',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-在售, 0-停售',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜品表';

-- 餐位表
CREATE TABLE IF NOT EXISTS `restaurant_table` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '餐位ID',
  `restaurant_id` INT NOT NULL COMMENT '餐厅ID',
  `name` VARCHAR(50) NOT NULL COMMENT '桌位名称/编号',
  `capacity` INT DEFAULT 4 COMMENT '容纳人数',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-可用, 0-不可用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='餐位表';

-- 餐厅评价表
CREATE TABLE IF NOT EXISTS `restaurant_review` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `restaurant_id` INT NOT NULL COMMENT '餐厅ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `order_id` INT DEFAULT NULL COMMENT '订单ID',
  `rating` TINYINT NOT NULL COMMENT '评分(1-5)',
  `content` TEXT COMMENT '评价内容',
  `images` TEXT COMMENT '评价图片(JSON)',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_restaurant_id` (`restaurant_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='餐厅评价表';

-- =========================================
-- 住宿模块 (住)
-- =========================================

-- 民宿表
CREATE TABLE IF NOT EXISTS `hotel` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '民宿ID',
  `name` VARCHAR(100) NOT NULL COMMENT '民宿名称',
  `merchant_id` INT DEFAULT NULL COMMENT '商家ID',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
  `longitude` DECIMAL(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` DECIMAL(10,6) DEFAULT NULL COMMENT '纬度',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `description` TEXT COMMENT '民宿介绍',
  `facilities` TEXT COMMENT '设施(JSON): WiFi, 空调, 停车场等',
  `images` TEXT COMMENT '图片列表(JSON)',
  `rating` DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-营业, 0-休息',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='民宿表';

-- 房型表
CREATE TABLE IF NOT EXISTS `room_type` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '房型ID',
  `hotel_id` INT NOT NULL COMMENT '民宿ID',
  `name` VARCHAR(100) NOT NULL COMMENT '房型名称',
  `bed_type` VARCHAR(50) DEFAULT NULL COMMENT '床型',
  `capacity` INT DEFAULT 2 COMMENT '可住人数',
  `area` VARCHAR(50) DEFAULT NULL COMMENT '面积',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格/晚',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `images` TEXT COMMENT '图片列表(JSON)',
  `facilities` TEXT COMMENT '设施',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-可订, 0-不可订',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_hotel_id` (`hotel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房型表';

-- 民宿评价表
CREATE TABLE IF NOT EXISTS `hotel_review` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `hotel_id` INT NOT NULL COMMENT '民宿ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `order_id` INT DEFAULT NULL COMMENT '订单ID',
  `rating` TINYINT NOT NULL COMMENT '评分(1-5)',
  `content` TEXT COMMENT '评价内容',
  `images` TEXT COMMENT '评价图片(JSON)',
  `reply` TEXT COMMENT '商家回复',
  `reply_time` DATETIME DEFAULT NULL COMMENT '回复时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_hotel_id` (`hotel_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='民宿评价表';

-- =========================================
-- 票务模块 (行)
-- =========================================

-- 景区表
CREATE TABLE IF NOT EXISTS `scenic` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '景区ID',
  `name` VARCHAR(100) NOT NULL COMMENT '景区名称',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
  `longitude` DECIMAL(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` DECIMAL(10,6) DEFAULT NULL COMMENT '纬度',
  `open_time` VARCHAR(100) DEFAULT NULL COMMENT '开放时间',
  `description` TEXT COMMENT '景区介绍',
  `images` TEXT COMMENT '图片列表(JSON)',
  `rating` DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-开放, 0-关闭',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='景区表';

-- 票种表
CREATE TABLE IF NOT EXISTS `ticket` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '票种ID',
  `scenic_id` INT NOT NULL COMMENT '景区ID',
  `name` VARCHAR(100) NOT NULL COMMENT '票种名称',
  `type` VARCHAR(50) DEFAULT NULL COMMENT '类型: adult-成人票, child-儿童票, student-学生票',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `valid_days` INT DEFAULT 1 COMMENT '有效天数',
  `description` TEXT COMMENT '说明',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-可售, 0-不可售',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_scenic_id` (`scenic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='票种表';

-- 路线套餐表
CREATE TABLE IF NOT EXISTS `route` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '路线ID',
  `title` VARCHAR(200) NOT NULL COMMENT '路线标题',
  `subtitle` VARCHAR(500) DEFAULT NULL COMMENT '副标题',
  `days` INT DEFAULT 1 COMMENT '行程天数',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `includes` TEXT COMMENT '包含项目(JSON)',
  `schedule` TEXT COMMENT '行程安排(JSON)',
  `highlights` TEXT COMMENT '亮点',
  `images` TEXT COMMENT '图片列表(JSON)',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-上架, 0-下架',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='路线套餐表';

-- =========================================
-- 社区模块
-- =========================================

-- 帖子表
CREATE TABLE IF NOT EXISTS `post` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '帖子ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) DEFAULT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `images` TEXT COMMENT '图片列表(JSON)',
  `video_url` VARCHAR(500) DEFAULT NULL COMMENT '视频URL',
  `topic_id` INT DEFAULT NULL COMMENT '话题ID',
  `location` VARCHAR(100) DEFAULT NULL COMMENT '关联地点',
  `likes` INT DEFAULT 0 COMMENT '点赞数',
  `views` INT DEFAULT 0 COMMENT '浏览数',
  `comments` INT DEFAULT 0 COMMENT '评论数',
  `favorites` INT DEFAULT 0 COMMENT '收藏数',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-审核中, -1-已下架',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_topic_id` (`topic_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子表';

-- 评论表
CREATE TABLE IF NOT EXISTS `comment` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `post_id` INT NOT NULL COMMENT '帖子ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `parent_id` INT DEFAULT NULL COMMENT '父评论ID(回复)',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `likes` INT DEFAULT 0 COMMENT '点赞数',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 点赞表
CREATE TABLE IF NOT EXISTS `like` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型: post-帖子, comment-评论',
  `target_id` INT NOT NULL COMMENT '目标ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`),
  KEY `idx_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- 收藏表
CREATE TABLE IF NOT EXISTS `favorite` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型: post-帖子, product-商品, hotel-民宿',
  `target_id` INT NOT NULL COMMENT '目标ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- =========================================
-- 订单相关表
-- =========================================

-- 购物车表
CREATE TABLE IF NOT EXISTS `cart` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `product_id` INT NOT NULL COMMENT '商品ID',
  `quantity` INT DEFAULT 1 COMMENT '数量',
  `selected` TINYINT DEFAULT 1 COMMENT '是否选中: 0-否, 1-是',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- 订单主表
CREATE TABLE IF NOT EXISTS `order` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单编号',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `type` VARCHAR(20) NOT NULL COMMENT '订单类型: product-商品, hotel-住宿, ticket-门票, route-路线, restaurant-餐位',
  `status` VARCHAR(20) NOT NULL COMMENT '订单状态: pending-待支付, paid-已支付, confirmed-已确认, completed-已完成, cancelled-已取消, refunded-已退款',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '总金额',
  `pay_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '实付金额',
  `discount_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
  `pay_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `pay_type` VARCHAR(20) DEFAULT NULL COMMENT '支付方式',
  `contact_name` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `extra_data` TEXT COMMENT '扩展数据(JSON)',
  `cancel_time` DATETIME DEFAULT NULL COMMENT '取消时间',
  `cancel_reason` VARCHAR(255) DEFAULT NULL COMMENT '取消原因',
  `refund_time` DATETIME DEFAULT NULL COMMENT '退款时间',
  `refund_amount` DECIMAL(10,2) DEFAULT NULL COMMENT '退款金额',
  `refund_reason` VARCHAR(255) DEFAULT NULL COMMENT '退款原因',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单主表';

-- 订单明细表
CREATE TABLE IF NOT EXISTS `order_item` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `order_id` INT NOT NULL COMMENT '订单ID',
  `product_id` INT DEFAULT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `product_image` VARCHAR(500) DEFAULT NULL COMMENT '商品图片',
  `specs` VARCHAR(500) DEFAULT NULL COMMENT '规格',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `quantity` INT NOT NULL COMMENT '数量',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- =========================================
-- 运营相关表
-- =========================================

-- Banner表
CREATE TABLE IF NOT EXISTS `banner` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'BannerID',
  `title` VARCHAR(100) DEFAULT NULL COMMENT '标题',
  `image` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `link` VARCHAR(500) DEFAULT NULL COMMENT '跳转链接',
  `link_type` VARCHAR(20) DEFAULT NULL COMMENT '链接类型: product-商品, hotel-民宿, scenic-景区, url-外部链接',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-显示, 0-隐藏',
  `start_time` DATETIME DEFAULT NULL COMMENT '展示开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '展示结束时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_sort` (`sort`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner表';

-- 公告表
CREATE TABLE IF NOT EXISTS `notice` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `type` VARCHAR(20) DEFAULT 'notice' COMMENT '类型: notice-公告, activity-活动',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-发布, 0-草稿',
  `publish_time` DATETIME DEFAULT NULL COMMENT '发布时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公告表';

-- =========================================
-- 初始化数据
-- =========================================

-- 插入管理员账号 (密码: 123456, bcrypt加密)
INSERT INTO `admin` (`username`, `password`, `real_name`, `role`) VALUES
('admin', '$2a$10$rS5h5qM8rP1rQ0rQ0rQ0rO.rQ0rQ0rQ0rQ0rQ0rQ0rQ0rQ0rQ0rQ0r', '系统管理员', 'super_admin');

-- 插入用户测试账号 (密码: 123456)
INSERT INTO `user` (`phone`, `password`, `nickname`, `role`) VALUES
('13800138000', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '游客管理员', 'admin'),
('13800138001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '游客小明', 'user'),
('13900139001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '测试商家', 'merchant');

-- 插入商品分类
INSERT INTO `product_category` (`name`, `icon`, `sort`) VALUES
('苗族银饰', '/icons/silver.png', 1),
('蜡染刺绣', '/icons/wax.png', 2),
('苗族服饰', '/icons/clothes.png', 3),
('农特产品', '/icons/farm.png', 4);

-- 插入Banner
INSERT INTO `banner` (`title`, `image`, `link`, `link_type`, `sort`, `status`) VALUES
('乌东苗寨', 'https://picsum.photos/1920/600?random=1', NULL, NULL, 1, 1),
('苗族银饰', 'https://picsum.photos/1920/600?random=2', NULL, NULL, 2, 1),
('特色民宿', 'https://picsum.photos/1920/600?random=3', NULL, NULL, 3, 1);

-- 插入公告
INSERT INTO `notice` (`title`, `content`, `type`, `status`) VALUES
('欢迎来到乌东文旅平台', '乌东村是贵州黔东南苗族侗族自治州特色苗寨，欢迎各位游客前来体验！', 'notice', 1);

-- 插入系统配置
INSERT INTO `sys_config` (`config_key`, `config_value`, `config_name`) VALUES
('platform_name', '乌东文旅平台', '平台名称'),
('platform_logo', '/logo.png', '平台Logo'),
('contact_phone', '400-888-8888', '联系电话'),
('commission_rate', '0.05', '平台抽佣比例');

SELECT '数据库初始化完成!' AS result;
