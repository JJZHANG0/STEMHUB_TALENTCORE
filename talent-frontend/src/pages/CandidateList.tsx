import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../styles/global.css';

interface Candidate {
    id: number;
    name: string;
    gender: string;
    age?: number;
    phone: string;
    email: string;

    degree: string;
    graduation_date?: string;

    major: string;
    bachelor_university: string;
    master_university: string;
    phd_university: string;

    experience_1?: string;
    experience_1_time?: string;
    experience_2?: string;
    experience_2_time?: string;
    experience_3?: string;
    experience_3_time?: string;

    base?: string;
    collaborated?: boolean;
    quality_score?: number;

    resume_pdf: string;
    created_at: string;
}

type ApiResponse = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Candidate[];
} | Candidate[];

const scoreColor = (score: number): string => {
    const hue = 270; // 紫色
    const lightness = 30 + (5 - score) * 10; // 分数越低越浅
    return `hsl(${hue}, 50%, ${lightness}%)`;
};

const baseColor = (city: string) => {
    switch (city) {
        case '上海':
            return '#ffa940';  // 橙
        case '杭州':
            return '#40a9ff'; // 蓝
        case '广州':
            return '#73d13d'; // 绿
        case '南京':
            return '#ff7875'; // 粉
        case '宁波':
            return '#9254de'; // 紫
        default:
            return '#8c8c8c';  // 远程/其它
    }
};

// const city = ['上海', '杭州', '广州', '南京', '宁波'].includes(c.base ?? '') ? c.base! : '远程';
// const cityColor = baseColor(city);


export default function CandidateList() {
    const [list, setList] = useState<Candidate[]>([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const [gender, setGender] = useState('');
    const [major, setMajor] = useState('');
    const [allGenders, setAllGenders] = useState<string[]>([]);
    const [allMajors, setAllMajors] = useState<string[]>([]);
    const [degree, setDegree] = useState('');
    const [score, setScore] = useState('');

    const [showScoreModal, setShowScoreModal] = useState(false);
    const [pendingScore, setPendingScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);   // PATCH 时可禁用按钮

    const [base, setBase] = useState('');
    const bases = ['上海', '杭州', '广州', '南京', '宁波', '远程'];


    const [selected, setSelected] = useState<Candidate | null>(null);

    useEffect(() => {
        const params = new URLSearchParams({
            page: page.toString(),
            ...(gender ? {gender} : {}),
            ...(major ? {major} : {}),
            ...(degree ? {degree} : {}),
            ...(base ? {base} : {}),
            ...(score ? {quality_score: score} : {}),
        }).toString();

        axios.get<ApiResponse>(`/api/candidates/?${params}`)
            .then(res => {
                const data = res.data;
                const arr = Array.isArray(data) ? data : data.results ?? [];

                // 按 created_at 倒序
                const sorted = [...arr].sort((a, b) =>
                    new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
                );
                setList(sorted);
                setHasPrev(!Array.isArray(data) && !!data.previous);
                setHasNext(!Array.isArray(data) && !!data.next);

                // 提取下拉选项
                const uniq = (arr: Candidate[], key: keyof Candidate) =>
                    Array.from(new Set(arr.map(i => i[key] as string).filter(Boolean)));
                setAllGenders(uniq(arr, 'gender'));
                setAllMajors(uniq(arr, 'major'));
            })
            .catch(err => {
                console.error('获取失败', err);
                setList([]);
                setHasPrev(false);
                setHasNext(false);
            });
    }, [page, gender, major, degree, base, score]);


    // 更新合作状态
    const toggleCollaboration = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            const res = await axios.patch(`/api/candidates/${selected.id}/`, {
                collaborated: !selected.collaborated,
            });
            // 1) 更新弹窗
            setSelected(res.data);
            // 2) 更新卡片列表
            setList(prev =>
                prev.map(c => (c.id === res.data.id ? res.data : c))
            );
        } finally {
            setLoading(false);
        }
    };

// 提交评分
    const submitScore = async (score: number) => {
        if (!selected) return;
        setLoading(true);
        try {
            const res = await axios.patch(`/api/candidates/${selected.id}/`, {
                quality_score: score,
            });
            setSelected(res.data);
            setList(prev =>
                prev.map(c => (c.id === res.data.id ? res.data : c))
            );
            setShowScoreModal(false);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="candidate-bg">
            {/* 筛选 + 卡片 + 分页 */}
            <div className="candidate-main">
                <div className="candidate-filter-bar">
                    <select
                        value={gender}
                        onChange={e => {
                            setPage(1);
                            setGender(e.target.value);
                        }}
                    >
                        <option value="">全部性别</option>
                        {allGenders.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    <select
                        value={major}
                        onChange={e => {
                            setPage(1);
                            setMajor(e.target.value);
                        }}
                    >
                        <option value="">全部专业</option>
                        {allMajors.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        value={degree}
                        onChange={e => {
                            setPage(1);
                            setDegree(e.target.value);
                        }}
                    >
                        <option value="">全部学历</option>
                        <option value="本科">本科</option>
                        <option value="硕士">硕士</option>
                        <option value="博士">博士</option>
                    </select>

                    <select
                        value={base}
                        onChange={e => {
                            setPage(1);
                            setBase(e.target.value);
                        }}
                    >
                        <option value="">全部地区</option>
                        {bases.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>

                    <select
                        value={score}
                        onChange={e => {
                            setPage(1);
                            setScore(e.target.value);
                        }}
                    >
                        <option value="">全部评分</option>
                        <option value="5">5分</option>
                        <option value="4">4分</option>
                        <option value="3">3分</option>
                        <option value="2">2分</option>
                        <option value="1">1分</option>
                    </select>


                </div>

                <div className="candidate-cards">
                    {list.map(c => {
                        // 👇 放在 map 内部，定义城市和颜色
                        const city = ['上海', '杭州', '广州', '南京', '宁波'].includes(c.base ?? '') ? c.base! : '远程';
                        const cityColor = baseColor(city);

                        return (
                            <div
                                key={c.id}
                                className="candidate-card"
                                onClick={() => setSelected(c)}
                                style={{
                                    border: c.quality_score === 5 ? '2px solid gold' : '1px solid #e0e0e0',
                                    boxShadow: c.quality_score === 5 ? '0 0 10px rgba(255, 215, 0, 0.4)' : 'none',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    background: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                <h3>{c.name}</h3>
                                <p>{c.degree}</p>

                                <div style={{display: 'flex', gap: '6px', marginTop: '8px'}}>
                                    {/* 合作标签 */}
                                    <span
                                        className="tag"
                                        style={{
                                            backgroundColor: c.collaborated ? '#d2f4dc' : '#fcdede',
                                            color: c.collaborated ? '#248a3d' : '#d10000'
                                        }}
                                    >
            {c.collaborated ? '合作' : '未合'}
          </span>

                                    {/* 评分标签 */}
                                    {c.quality_score && (
                                        <span
                                            className="tag"
                                            style={{
                                                backgroundColor: scoreColor(c.quality_score),
                                                color: '#fff'
                                            }}
                                        >
              {c.quality_score}分
            </span>
                                    )}

                                    {/* 城市/远程标签 */}
                                    <span
                                        className="tag"
                                        style={{
                                            backgroundColor: cityColor,
                                            color: '#fff'
                                        }}
                                    >
            {city}
          </span>
                                </div>
                            </div>
                        );
                    })}
                </div>


                <div style={{marginTop: 20}}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={!hasPrev}
                    >
                        上一页
                    </button>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={!hasNext}
                        style={{marginLeft: 12}}
                    >
                        下一页
                    </button>
                </div>
            </div>

            {/* 底部弹起详情 + 遮罩 */}
            {selected && (
                <>
                    <div
                        className="modal-backdrop"
                        onClick={() => setSelected(null)}
                    />
                    <div className="candidate-detail-panel open">
                        <button
                            className="close-btn"
                            onClick={() => setSelected(null)}
                        >
                            ×
                        </button>
                        <h2>{selected.name}</h2>
                        <p><strong>学历：</strong>{selected.degree}</p>
                        <p><strong>性别：</strong>{selected.gender}</p>
                        <p><strong>年龄：</strong>{selected.age ?? '—'}</p>
                        <p><strong>毕业时间：</strong>{selected.graduation_date ?? '—'}</p>

                        <p><strong>本科院校：</strong>{selected.bachelor_university}</p>
                        <p><strong>硕士院校：</strong>{selected.master_university}</p>
                        <p><strong>博士院校：</strong>{selected.phd_university}</p>

                        <p><strong>专业：</strong>{selected.major}</p>
                        <p><strong>常驻地：</strong>{selected.base}</p>
                        <p><strong>合作过：</strong>{selected.collaborated ? '是' : '否'}</p>
                        <p><strong>简历评分：</strong>{selected.quality_score ?? '—'} / 5</p>

                        {selected.experience_1 &&
                            <p><strong>经验1：</strong>{selected.experience_1}（{selected.experience_1_time}）</p>}
                        {selected.experience_2 &&
                            <p><strong>经验2：</strong>{selected.experience_2}（{selected.experience_2_time}）</p>}
                        {selected.experience_3 &&
                            <p><strong>经验3：</strong>{selected.experience_3}（{selected.experience_3_time}）</p>}

                        <p><strong>电话：</strong>{selected.phone}</p>
                        <p><strong>邮箱：</strong>{selected.email}</p>

                        <a
                            className="download-btn"
                            href={selected.resume_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            下载简历
                        </a>
                        <button className="action-btn" onClick={toggleCollaboration}>
                            {selected.collaborated ? '标记未合作' : '标记已合作'}
                        </button>

                        <button
                            className="action-btn"
                            onClick={() => {
                                setPendingScore(null);
                                setShowScoreModal(true);
                            }}
                        >
                            更改评分
                        </button>
                    </div>
                    {/* ✅ 插入评分弹窗组件 */}
                    {showScoreModal && (
                        <>
                            <div className="modal-backdrop" onClick={() => setShowScoreModal(false)}/>
                            <div className="score-modal">
                                <h3>设置新评分</h3>
                                <div style={{display: 'flex', gap: 12, margin: '12px 0'}}>
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button
                                            key={n}
                                            className={pendingScore === n ? 'score-btn selected' : 'score-btn'}
                                            style={{background: scoreColor(n)}}
                                            onClick={() => setPendingScore(n)}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={pendingScore === null || loading}
                                    onClick={() => pendingScore && submitScore(pendingScore)}
                                >
                                    确认
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
