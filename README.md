# 🚀 TalentHunter 人才甄选系统

> 高效 · 智能 · 直观 —— 你的 AI 招聘助手

![screenshot](./public/banner.png)

TalentHunter 是一套专为STEMHUB人力资源部门打造的智能人才筛选系统。集成了现代化前端界面与灵活强大的后端接口，助你快速筛选、管理、评价潜力人才。

---

## 项目亮点 Features

- **精准筛选**：支持性别、学历、专业、评分、地区多维度筛选
- **智能打分**：AI 自动简历打分，支持自定义评分和标记合作状态
- **标签视觉化**：评分、合作状态、城市归属等信息以色彩标签清晰展示
- **简历下载**：一键导出候选人完整简历
- **分页与性能优化**：自定义分页器，支持大量数据加载
- **后续可拓展模块**：如面试评价、职位匹配推荐、自动通知等

---

## 技术栈 Technology Stack

| 前端 Frontend     | 后端 Backend       | 数据库 Database   |
|-------------------|---------------------|--------------------|
| React + TypeScript| Django Rest Framework (DRF) | SQLite / MySQL     |
| Tailwind CSS / 自定义 CSS | Django Filters + Pagination |                    |

---

## 快速开始 Getting Started

### 后端 Backend

```bash
cd backend/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 前端 Frontend
```bash
cd talent-frontend/
npm install
npm run dev
访问地址：http://localhost:5173
```

### 项目结构 Structure
```bash
├── backend
│   ├── candidates/            # 候选人模型与接口
│   ├── serializers.py
│   ├── views.py
│   └── pagination.py
├── talent-frontend
│   ├── components/            # 卡片、筛选栏、弹窗组件
│   ├── pages/
│   ├── styles/
│   └── App.tsx
```


### 开发者 Developer
STEMHUB 团队出品
Created by JJ & Team


### License
本项目基于 MIT License 开源发布。

