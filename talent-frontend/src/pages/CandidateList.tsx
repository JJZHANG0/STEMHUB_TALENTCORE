import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/global.css';

interface Candidate {
  id: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
  degree: string;
  university: string;
  major: string;
  experience_1?: string;
  experience_2?: string;
  experience_3?: string;
  resume_pdf: string;
  created_at: string;
}

type ApiResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Candidate[];
} | Candidate[];

export default function CandidateList() {
  const [list, setList]           = useState<Candidate[]>([]);
  const [page, setPage]           = useState(1);
  const [hasNext, setHasNext]     = useState(false);
  const [hasPrev, setHasPrev]     = useState(false);
  const [gender, setGender]       = useState('');
  const [major, setMajor]         = useState('');
  const [allGenders, setAllGenders] = useState<string[]>([]);
  const [allMajors, setAllMajors]   = useState<string[]>([]);
  const [selected, setSelected]   = useState<Candidate | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(gender ? { gender } : {}),
      ...(major   ? { major } : {}),
    }).toString();

    axios.get<ApiResponse>(`/api/candidates/?${params}`)
      .then(res => {
        const data = res.data;
        const arr  = Array.isArray(data) ? data : data.results ?? [];

        // 按 created_at 倒序
        const sorted = [...arr].sort((a,b) =>
          new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
        );
        setList(sorted);
        setHasPrev(!Array.isArray(data) && !!data.previous);
        setHasNext(!Array.isArray(data) && !!data.next);

        // 提取下拉选项
        const uniq = (arr: Candidate[], key: keyof Candidate) =>
          Array.from(new Set(arr.map(i => i[key] as string).filter(Boolean)));
        setAllGenders(uniq(arr,'gender'));
        setAllMajors(  uniq(arr,'major'));
      })
      .catch(err => {
        console.error('获取失败', err);
        setList([]); setHasPrev(false); setHasNext(false);
      });
  }, [page, gender, major]);

  return (
    <div className="candidate-bg">
      {/* 筛选 + 卡片 + 分页 */}
      <div className="candidate-main">
        <div className="candidate-filter-bar">
          <select
            value={gender}
            onChange={e => { setPage(1); setGender(e.target.value); }}
          >
            <option value="">全部性别</option>
            {allGenders.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            value={major}
            onChange={e => { setPage(1); setMajor(e.target.value); }}
          >
            <option value="">全部专业</option>
            {allMajors.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="candidate-cards">
          {list.map(c => (
            <div
              key={c.id}
              className="candidate-card"
              onClick={() => setSelected(c)}
            >
              <h3>{c.name}</h3>
              <p>{c.university}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setPage(p => Math.max(1,p-1))}
            disabled={!hasPrev}
          >
            上一页
          </button>
          <button
            onClick={() => setPage(p => p+1)}
            disabled={!hasNext}
            style={{ marginLeft: 12 }}
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
            <p><strong>学校：</strong>{selected.university}</p>
            <p><strong>专业：</strong>{selected.major}</p>
            {selected.experience_1 && <p><strong>经验1：</strong>{selected.experience_1}</p>}
            {selected.experience_2 && <p><strong>经验2：</strong>{selected.experience_2}</p>}
            {selected.experience_3 && <p><strong>经验3：</strong>{selected.experience_3}</p>}
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
          </div>
        </>
      )}
    </div>
  );
}
