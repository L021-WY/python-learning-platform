const analyzeButton = document.getElementById('analyze-button');
const codeInput = document.getElementById('code-input');
const analysisOutput = document.getElementById('analysis-output');
const hintButton = document.getElementById('hint-button');
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const answerInput = document.getElementById('answer-input');
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const questionFeedback = document.getElementById('question-feedback');
const questionList = document.getElementById('question-list');
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

const questions = [
  {
    title: '题目 1：字符计数',
    text: '请实现一个函数，统计字符串中每个字符出现的次数，并返回包含字符计数的对象。',
    hint: '你可以使用对象或 Map 保存字符计数，遍历字符串并逐个累加。',
    keywords: ['对象', '计数', '遍历', '字符'],
    answer: '使用对象保存字符计数并遍历字符串'
  },
  {
    title: '题目 2：数组求和',
    text: '给定一个数字数组，返回数组中所有元素的总和。',
    hint: '可以使用循环或 reduce 方法累加每个数字。',
    keywords: ['reduce', '循环', '累加', '总和'],
    answer: '累加每个元素并返回总和'
  },
  {
    title: '题目 3：判断回文字符串',
    text: '判断字符串是否为回文。忽略大小写和空格。',
    hint: '将字符串标准化后，比较它与自身逆序是否相同。',
    keywords: ['回文', '逆序', '标准化', '忽略'],
    answer: '标准化字符串并比较其逆序结果'
  }
];

let currentQuestionIndex = 0;

function createAnalysis(code) {
  if (!code.trim()) {
    return '请先输入一个代码片段，然后点击“解析代码”。';
  }
  const lines = code.split(/\n/).length;
  return `AI 解析结果：\n\n` +
    `- 代码长度：${code.length} 字符\n` +
    `- 行数：${lines} 行\n` +
    `- 建议：请关注函数命名、变量命名和逻辑分支；如需优化，可尝试提炼重复逻辑并添加注释。\n\n` +
    `示例解释：\n` +
    `1. 你的代码会依次执行每一条语句。\n` +
    `2. 如果其中包含循环或条件分支，AI 会帮助你理解每个分支的触发条件。\n` +
    `3. 如检测到语法错误，请检查括号、引号和缩进结构。`;
}

function renderQuestion(index) {
  const question = questions[index];
  questionTitle.textContent = question.title;
  questionText.textContent = question.text;
  answerInput.value = '';
  questionFeedback.textContent = '输入你的思路或答案，然后点击“提交答案”。';
  updateQuestionList();
}

function updateQuestionList() {
  questionList.innerHTML = '';
  questions.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.title;
    if (index === currentQuestionIndex) {
      li.classList.add('active');
    }
    li.addEventListener('click', () => {
      currentQuestionIndex = index;
      renderQuestion(currentQuestionIndex);
    });
    questionList.appendChild(li);
  });
}

function getQuestionFeedback(answer, question) {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) {
    return '请先输入你的解题思路或答案。';
  }
  const matchedKeywords = question.keywords.filter(keyword => normalized.includes(keyword));
  if (matchedKeywords.length >= 2) {
    return `回答看上去不错！AI 提示：${question.hint} \n\n标准答案思路：${question.answer}`;
  }
  return `回答暂时不完整。提示：${question.hint} \n\n建议：请补充关键步骤，如${question.keywords.slice(0, 2).join('、')}。`;
}

function showHint() {
  const question = questions[currentQuestionIndex];
  questionFeedback.textContent = `提示：${question.hint}`;
}

analyzeButton.addEventListener('click', () => {
  const code = codeInput.value;
  analysisOutput.textContent = createAnalysis(code);
});

checkButton.addEventListener('click', () => {
  const question = questions[currentQuestionIndex];
  questionFeedback.textContent = getQuestionFeedback(answerInput.value, question);
});

hintButton.addEventListener('click', () => {
  showHint();
});

nextButton.addEventListener('click', () => {
  currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
  renderQuestion(currentQuestionIndex);
});

function appendChat(role, text) {
  const message = document.createElement('div');
  message.className = `chat-message ${role}-message`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getChatResponse(message) {
  const normalized = message.trim().toLowerCase();
  if (!normalized) {
    return '请输入你的问题，我会帮你分析代码、调试逻辑或给出学习建议。';
  }
  if (normalized.includes('错误') || normalized.includes('bug') || normalized.includes('调试')) {
    return '建议先从错误信息入手，定位最早触发的代码行；检查变量类型、循环条件和边界值。';
  }
  if (normalized.includes('优化') || normalized.includes('性能')) {
    return '优化时请优先考虑算法复杂度，避免多余循环，并减少不必要的数据复制。';
  }
  if (normalized.includes('怎么') || normalized.includes('如何') || normalized.includes('建议')) {
    return '你可以先描述遇到的问题或目标，然后我会给出具体的解决方案和学习建议。';
  }
  return '这是一个很好的问题！你可以把相关代码和你当前的想法发给我，我会帮你逐步分析。';
}

function sendChat() {
  const message = chatInput.value.trim();
  if (!message) {
    return;
  }
  appendChat('user', message);
  chatInput.value = '';
  setTimeout(() => {
    appendChat('ai', getChatResponse(message));
  }, 300);
}

chatSend.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendChat();
  }
});

renderQuestion(currentQuestionIndex);
