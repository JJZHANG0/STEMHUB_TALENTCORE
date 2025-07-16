import os
import django
import requests
import json
import shutil
import time
from pdfminer.high_level import extract_text
from django.core.files import File

# === 初始化 Django 项目 ===
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "talent_core.settings")
django.setup()

from resumes.models import Candidate

# === 配置 ===
API_KEY = "sk-a99ede93ae2948928ea5b10133538a9b"
API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
RESUME_FOLDER = "./all_resumes"
UNQUALIFIED_FOLDER = "./unqualified_resumes"
PASSED_FOLDER = "./passed"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

# === 创建输出文件夹 ===
for folder in [UNQUALIFIED_FOLDER, PASSED_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)


# === 通义千问字段提取 ===
def call_qwen(text):
    prompt = f"""
你是一个简历分析助手，请从下面简历中提取以下字段，返回标准 JSON（字段名使用英文）：
- name
- gender
- phone
- email
- degree
- university
- major
- experience_1
- experience_2
- experience_3

请以纯 JSON 格式输出，不要加任何解释说明。不要包裹 markdown 代码块。

简历如下：
{text}
"""
    payload = {
        "model": "qwen-plus",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post(API_URL, headers=HEADERS, data=json.dumps(payload))
        print("🔍 [DEBUG] HTTP 状态码：", response.status_code)
        print("🔍 [DEBUG] 返回内容前 300 字：", response.text[:300])

        if response.status_code == 200:
            content = response.json()["choices"][0]["message"]["content"]
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        else:
            print("❌ 通义 API 返回非 200 状态码：", response.status_code)
            return None

    except Exception as e:
        print("❌ 请求异常: ", e)
        return None


# === 主处理逻辑 ===
def process_all_resumes():
    files = [f for f in os.listdir(RESUME_FOLDER) if f.lower().endswith(".pdf")]
    total = len(files)
    print(f"📁 共发现 {total} 份简历待处理...\n")

    for idx, filename in enumerate(files, 1):
        file_path = os.path.join(RESUME_FOLDER, filename)
        print(f"📄 [{idx}/{total}] 正在处理：{filename}")

        try:
            text = extract_text(file_path).strip()

            if len(text) <= 3:
                print("⚠️ 内容太短，视为无效简历，移动到 unqualified_resumes/")
                shutil.move(file_path, os.path.join(UNQUALIFIED_FOLDER, filename))
                continue

            result = call_qwen(text)
            if not result:
                print("⚠️ 无法提取字段，移动到 unqualified_resumes/")
                shutil.move(file_path, os.path.join(UNQUALIFIED_FOLDER, filename))
                continue

            with open(file_path, "rb") as f:
                django_file = File(f)
                candidate = Candidate(
                    name=result.get("name", ""),
                    gender=result.get("gender", ""),
                    phone=result.get("phone", ""),
                    email=result.get("email", ""),
                    degree=result.get("degree", ""),
                    university=result.get("university", ""),
                    major=result.get("major", ""),
                    experience_1=result.get("experience_1", ""),
                    experience_2=result.get("experience_2", ""),
                    experience_3=result.get("experience_3", "")
                )
                candidate.resume_pdf.save(filename, django_file, save=True)

            print(f"✅ [{idx}/{total}] 成功导入：{filename}")
            shutil.move(file_path, os.path.join(PASSED_FOLDER, filename))

        except Exception as e:
            print(f"❌ [{idx}/{total}] 未知异常，移动到 unqualified_resumes/: {e}")
            shutil.move(file_path, os.path.join(UNQUALIFIED_FOLDER, filename))

        time.sleep(1)


if __name__ == "__main__":
    process_all_resumes()
