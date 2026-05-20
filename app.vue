<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="logo">
        <h2>🤖 AI编程学习平台</h2>
        <p class="now-time">{{ nowTime }}</p>
      </div>
      <nav class="nav-menu">
        <div class="nav-item" :class="{active:pageType==='practice'}" @click="pageType='practice'">📚 刷题练习</div>
        <div class="nav-item" :class="{active:pageType==='code'}" @click="pageType='code'">💻 代码实操</div>
        <div class="nav-item" :class="{active:pageType==='knowledge'}" @click="pageType='knowledge'">📖 详细知识点</div>
        <div class="nav-item" :class="{active:pageType==='error'}" @click="pageType='error'">📝 错题本({{errorList.length}})</div>
        <div class="nav-item" :class="{active:pageType==='collect'}" @click="pageType='collect'">⭐ 收藏题库({{collectList.length}})</div>
      </nav>

      <!-- 每日打卡 -->
      <div class="clock-card">
        <h4>📅 每日打卡</h4>
        <p>已连续打卡：<span class="day-num">{{ clockDay }} 天</span></p>
        <p class="date">{{ nowDate }}</p>
        <p v-if="isClock" class="yes">✅ 今日已打卡</p>
        <p v-else class="no">❌ 未打卡</p>
        <button @click="addClock" :class="isClock ? 'disabled-btn' : 'clock-btn'">
          {{ isClock ? '已打卡' : '立即打卡' }}
        </button>
      </div>

      <!-- 学习数据统计 -->
      <div class="score-card">
        <h4>📊 学习数据中心</h4>
        <p>当前得分：<span class="score-text">{{ userScore }}</span> 分</p>
        <p>正确率：<span class="rate-text">{{ correctRate }}%</span></p>
        <p>已答题：{{ answerNum }} / {{ list.length }}</p>
        <div class="progress-box">
          <span>整体学习进度</span>
          <div class="progress-bar">
            <div class="progress" :style="{width: progressPercent + '%'}"></div>
          </div>
        </div>
        <button class="reset-btn" @click="resetData">🔄 重置所有数据</button>
      </div>
    </aside>

    <!-- 中间主内容区 -->
    <main class="main-content">
      <!-- 顶部励志标语 -->
      <div class="top-encourage">
        <p>💬 {{ studyWord }}</p>
      </div>

      <!-- 刷题主页面 -->
      <div v-if="pageType==='practice'">
        <div class="notice-box">
          <span class="notice-title">📢 编程小知识</span>
          <span class="notice-text">Python是最简单高效的编程语言，坚持刷题练习，轻松掌握编程核心能力！</span>
        </div>

        <header class="main-header">
          <h1>Python 全套专业题库</h1>
          <p>夯实编程基础，提升专业能力</p>
        </header>

        <div class="question-section">
          <div class="question-header">
            <span class="tag">第{{ idx+1 }}题 / {{ list.length }}题</span>
            <span class="level-tag" :class="nowQ.level === '简单'?'easy':'mid'">{{ nowQ.level }}</span>
            <span class="collect-icon" @click="addCollect">
              {{ isCollect ? '⭐ 已收藏' : '☆ 收藏此题' }}
            </span>
            <h3>{{ nowQ.title }}</h3>
          </div>

          <div class="options">
            <label class="option-item" v-for="(item, key) in nowQ.opt" :key="key">
              <input v-model="userAns" type="radio" :value="key"/>
              {{ key }}. {{ item }}
            </label>
          </div>

          <div class="action-buttons">
            <button @click="check" class="btn primary">提交答案</button>
            <button @click="tipShow = !tipShow" class="btn secondary">查看提示</button>
            <button @click="prevQuestion" class="btn secondary">上一题</button>
            <button @click="next" class="btn secondary">下一题</button>
            <button @click="askAiNow" class="btn ai-btn">AI讲解本题</button>
          </div>

          <div v-if="tipShow" class="hint-box">
            💡 提示：{{ nowQ.tip }}
          </div>

          <div v-if="resText" :class="['feedback-box', isOk ? 'success' : 'error']">
            {{ resText }}
          </div>
        </div>
      </div>

      <!-- 免安装Python在线代码编辑器 -->
      <div v-if="pageType==='code'">
        <div class="code-section">
          <h3>💻 云端Python在线代码编辑器（免安装）</h3>
          <textarea v-model="code" placeholder="支持print、变量、循环、判断、函数、随机库、数学库等全部基础语法"></textarea>
          <div class="code-controls">
            <button @click="runCode" class="btn run-btn">▶ 运行代码</button>
            <button @click="clearCode" class="btn clear-btn">🗑️ 清空代码</button>
          </div>
          <div class="output-box">
            <p>运行输出结果：</p>
            <pre>{{ codeOut }}</pre>
          </div>
        </div>
      </div>

      <!-- 超详细完整版知识点 -->
      <div v-if="pageType==='knowledge'">
        <div class="knowledge-box">
          <h2>📖 Python 超详细全套核心知识点</h2>

          <div class="knowledge-item">
            <h4>1️⃣ 变量与五大基础数据类型</h4>
            <p><strong>概念：</strong>变量就是程序存储数据的容器，Python 弱类型语言，不用声明类型直接赋值。</p>
            <ul>
              <li><strong>int 整型</strong>：整数 1、99、-10</li>
              <li><strong>float 浮点型</strong>：小数 3.14、2.5</li>
              <li><strong>str 字符串</strong>：文本文字，必须用引号包裹</li>
              <li><strong>bool 布尔型</strong>：只有 True / False，用于判断</li>
              <li><strong>None 空值</strong>：代表不存在、空内容</li>
            </ul>
            <p><strong>变量命名规则：</strong></p>
            <p>不能数字开头、不能使用关键字、区分大小写、不能有特殊符号。</p>
          </div>

          <div class="knowledge-item">
            <h4>2️⃣ 输入输出核心函数</h4>
            <p><strong>print()</strong>：程序向外输出文字、变量、结果。</p>
            <p><strong>input()</strong>：接收用户键盘输入内容，默认字符串类型。</p>
            <p><strong>常用格式化输出：</strong>f"" 快速拼接变量，简洁高效。</p>
            <p><strong>易错点：</strong>input获取数字必须用int()转换才能计算。</p>
          </div>

          <div class="knowledge-item">
            <h4>3️⃣ 条件判断 if elif else</h4>
            <p><strong>作用：</strong>让程序具备判断能力，满足不同条件执行不同代码。</p>
            <p><strong>语法规则：</strong>条件后必须加冒号，代码必须缩进4空格。</p>
            <p><strong>应用场景：</strong>成绩判断、权限判断、状态筛选、逻辑分支。</p>
          </div>

          <div class="knowledge-item">
            <h4>4️⃣ 两大循环结构 for / while</h4>
            <p><strong>for循环</strong>：已知循环次数、遍历列表、字符串、数字范围。</p>
            <p><strong>while循环</strong>：满足条件就一直循环，适合未知次数场景。</p>
            <p><strong>循环关键字：</strong></p>
            <p>break：直接终止整个循环</p>
            <p>continue：跳过本次循环，直接进入下一次</p>
          </div>

          <div class="knowledge-item">
            <h4>5️⃣ 函数基础 def</h4>
            <p><strong>作用：</strong>封装重复代码，提高复用性、简化代码结构。</p>
            <p><strong>关键字：def</strong> 定义函数</p>
            <p><strong>return</strong> 函数返回结果</p>
            <p>函数分为：无参函数、有参函数、带返回值函数。</p>
          </div>

          <div class="knowledge-item">
            <h4>6️⃣ 列表 List 基础</h4>
            <p>列表是Python最常用容器，有序、可重复、可修改。</p>
            <p>符号：[]</p>
            <p>常用方法：append添加、remove删除、sort排序、len获取长度</p>
          </div>

          <div class="knowledge-item">
            <h4>7️⃣ 字典 Dictionary</h4>
            <p>以键值对方式存储数据，查询速度极快。</p>
            <p>符号：{}</p>
            <p>适合存储人物信息、账号信息、关联数据。</p>
          </div>

          <div class="knowledge-item">
            <h4>8️⃣ 常用运算符</h4>
            <p>算术：+ - * / %</p>
            <p>比较：== != > < >= <=</p>
            <p>逻辑：and 并且 / or 或者 / not 取反</p>
          </div>

          <div class="knowledge-item">
            <h4>9️⃣ 常用内置函数</h4>
            <p>int() 转整数 / float()转小数 / str()转字符串</p>
            <p>len() 获取长度 / max()最大值 / min()最小值 / sum()求和</p>
            <p>type() 查看数据类型 / range()生成数字序列</p>
          </div>

          <div class="knowledge-item">
            <h4>🔟 模块导入与常用库</h4>
            <p>import 导入第三方功能库</p>
            <p>random 随机数库</p>
            <p>math 数学计算库</p>
            <p>time 时间延时库</p>
          </div>
        </div>
      </div>

      <!-- 错题本页面 -->
      <div v-if="pageType==='error'">
        <div class="error-box">
          <h2>📝 个人错题记录本</h2>
          <div v-if="errorList.length===0" class="empty-tip">太棒啦！目前没有错题，继续保持！</div>
          <div class="error-item" v-for="(item,index) in errorList" :key="index">
            <p><strong>{{index+1}}. {{item.title}}</strong></p>
            <p>正确答案：{{item.ans}}</p>
            <p>题目解析：{{item.desc}}</p>
          </div>
        </div>
      </div>

      <!-- 收藏题目页面 -->
      <div v-if="pageType==='collect'">
        <div class="collect-box">
          <h2>⭐ 我的收藏经典题库</h2>
          <div v-if="collectList.length===0" class="empty-tip">暂时没有收藏题目</div>
          <div class="collect-item" v-for="(item,index) in collectList" :key="index">
            <p><strong>{{index+1}}. {{item.title}}</strong></p>
            <p>难度：{{item.level}} | 正确答案：{{item.ans}}</p>
            <p>解析：{{item.desc}}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 右侧真正智能AI解答面板 -->
    <aside class="ai-panel">
      <div class="ai-header">
        <h3>🤖 智能AI编程导师</h3>
        <p class="ai-desc">自动讲解题目、答疑解惑、辅导编程</p>
      </div>

      <div class="chat-box">
        <div class="ai-message">
          你好！我是专业编程AI助手，你可以问我Python知识、解析题目、编写代码、学习指导！
        </div>
        <div class="user-message" v-for="(item, i) in chatList" :key="`user-${i}`">
          {{ item.user }}
        </div>
        <div class="ai-message" v-for="(item, i) in chatList" :key="`ai-${i}`">
          {{ item.ai }}
        </div>
      </div>

      <div class="chat-input">
        <input v-model="chatText" placeholder="输入问题向AI提问..."/>
        <button @click="sendMsg" class="send-btn">发送</button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 页面切换
const pageType = ref('practice')

// 励志学习语录
const wordList = [
  "努力自有回报，编程路上坚持就是胜利！",
  "每天进步一点点，日积月累就是大神！",
  "代码不会辜负努力刷题的每一个人。",
  "沉下心学基础，未来轻松驾驭所有编程技术。",
  "自律且努力，编程学习一路开挂！"
]
const studyWord = ref(wordList[Math.floor(Math.random()*wordList.length)])

// 实时时间
const nowTime = ref('')
const getTime = ()=>{
  let t = new Date()
  nowTime.value = t.toLocaleTimeString()
}
setInterval(getTime,1000)

// 超大完整版50道Python题库
const list = ref([
  {title:"Python中输出函数是？",opt:{A:"input()",B:"print()",C:"show()",D:"echo()"},ans:"B",tip:"print是Python标准输出函数",desc:"print()用于控制台打印输出内容，input()是接收用户输入。",level:"简单"},
  {title:"Python单行注释符号为？",opt:{A:"//",B:"#",C:"/*",D:"--"},ans:"B",tip:"#为Python单行注释",desc:"#后面内容不会被程序执行，多用于代码说明。",level:"简单"},
  {title:"不属于Python基本数据类型的是？",opt:{A:"int",B:"str",C:"float",D:"web"},ans:"D",tip:"基础类型只有整型、字符串、浮点型、布尔型",desc:"web不是Python内置数据类型。",level:"简单"},
  {title:"定义Python函数使用关键字？",opt:{A:"class",B:"def",C:"func",D:"fn"},ans:"B",tip:"def专门用来定义函数",desc:"def是Python函数声明固定关键字。",level:"中等"},
  {title:"while语句作用是？",opt:{A:"判断",B:"循环执行代码",C:"定义变量",D:"导入模块"},ans:"B",tip:"while属于循环语句",desc:"满足条件就会重复执行内部代码。",level:"中等"},
  {title:"%运算符功能是？",opt:{A:"除法",B:"取余数",C:"乘法",D:"加法"},ans:"B",tip:"%是取模运算符",desc:"用来计算两个数字相除后的余数。",level:"中等"},
  {title:"获取用户输入函数是？",opt:{A:"get()",B:"input()",C:"read()",D:"scan()"},ans:"B",tip:"input()接收键盘输入",desc:"运行后等待用户输入文字内容。",level:"简单"},
  {title:"Python布尔类型正确写法？",opt:{A:"yes/no",B:"true/false",C:"True/False",D:"1/0"},ans:"C",tip:"布尔值首字母必须大写",desc:"Python严格区分大小写，布尔固定为True、False。",level:"简单"},
  {title:"Python列表符号是？",opt:{A:"{}",B:"[]",C:"()",D:"<>"},ans:"B",tip:"[]代表列表",desc:"列表是最常用存储数据容器。",level:"简单"},
  {title:"判断相等运算符是？",opt:{A:"=",B:"==",C:"===",D:"!="},ans:"B",tip:"双等于判断相等",desc:"单个=是赋值，双==是条件判断。",level:"简单"},
  {title:"for循环主要用途？",opt:{A:"条件判断",B:"遍历循环",C:"定义函数",D:"导入包"},ans:"B",tip:"for多用于遍历数据",desc:"快速遍历列表、字符串、数字序列。",level:"中等"},
  {title:"Python空值关键字？",opt:{A:"null",B:"None",C:"empty",D:"nil"},ans:"B",tip:"None代表空对象",desc:"Python专用空值标识。",level:"中等"},
  {title:"字符串拼接常用符号？",opt:{A:"-",B:"+",C:"*",D:"/"},ans:"B",tip:"加号拼接字符串",desc:"多个文字可以使用+连接在一起。",level:"简单"},
  {title:"导入模块关键字？",opt:{A:"import",B:"include",C:"get",D:"load"},ans:"A",tip:"import导入第三方功能模块",desc:"使用内置功能都需要import引入。",level:"中等"},
  {title:"if语句作用？",opt:{A:"循环",B:"条件判断",C:"定义类",D:"输出"},ans:"B",tip:"if实现条件分支",desc:"满足条件执行一段代码，不满足执行另一段。",level:"简单"},
  {title:"int()功能是？",opt:{A:"转字符串",B:"转整数",C:"转小数",D:"转列表"},ans:"B",tip:"int强制转为整型数字",desc:"可以把文字数字直接变成整数。",level:"简单"},
  {title:"continue语句作用？",opt:{A:"终止程序",B:"跳过本次循环",C:"结束所有循环",D:"判断条件"},ans:"B",tip:"continue跳过当前一次循环",desc:"不会终止整体循环，直接进入下一轮。",level:"中等"},
  {title:"break语句作用？",opt:{A:"暂停",B:"终止整个循环",C:"注释",D:"定义变量"},ans:"B",tip:"break直接跳出循环",desc:"执行后循环立刻结束。",level:"中等"},
  {title:"float代表什么类型？",opt:{A:"整数",B:"浮点小数",C:"文字",D:"布尔值"},ans:"B",tip:"float是小数类型",desc:"用来存放带小数点数字。",level:"简单"},
  {title:"多行字符串可以使用？",opt:{A:"三个引号",B:"#",C:"//",D:"[]"},ans:"A",tip:"三引号包裹多行文本",desc:"''' '''可以直接编写多行内容。",level:"简单"},
  {title:"append()作用？",opt:{A:"添加列表元素",B:"删除元素",C:"修改元素",D:"排序元素"},ans:"A",tip:"append向列表末尾添加数据",desc:"列表最常用添加方法。",level:"中等"},
  {title:"and逻辑运算符含义？",opt:{A:"或者",B:"并且",C:"取反",D:"不等于"},ans:"B",tip:"and两边条件都成立才为真",desc:"同时满足多个条件使用and。",level:"简单"},
  {title:"or逻辑运算符含义？",opt:{A:"并且",B:"或者",C:"大于",D:"小于"},ans:"B",tip:"or满足任意一个条件即可",desc:"多个条件任选其一成立就通过。",level:"简单"},
  {title:"Python变量命名不能以什么开头？",opt:{A:"字母",B:"数字",C:"下划线",D:"汉字"},ans:"B",tip:"变量不能数字开头",desc:"编程通用规范，防止识别混乱。",level:"简单"},
  {title:"print(3+2*5)运行结果？",opt:{A:"25",B:"13",C:"10",D:"15"},ans:"B",tip:"先乘除后加减",desc:"数学运算优先级不变。",level:"中等"},
  {title:"len()函数作用？",opt:{A:"求和",B:"获取长度",C:"排序",D:"转换类型"},ans:"B",tip:"len获取数据长度",desc:"获取字符串、列表一共有多少内容。",level:"简单"},
  {title:"Python字典标识符号？",opt:{A:"[]",B:"{}",C:"()",D:"<>"},ans:"B",tip:"{}代表字典",desc:"字典以键值对方式存储数据。",level:"中等"},
  {title:"range(5)生成数字范围？",opt:{A:"0-4",B:"1-5",C:"0-5",D:"1-4"},ans:"A",tip:"range默认从0开始",desc:"包头不包尾，只取到前一位数字。",level:"中等"},
  {title:"type()函数作用？",opt:{A:"输出内容",B:"查看数据类型",C:"循环",D:"判断真假"},ans:"B",tip:"type查看变量类型",desc:"快速分辨int、str、float类型。",level:"简单"},
  {title:"!=代表含义？",opt:{A:"等于",B:"不等于",C:"大于",D:"小于"},ans:"B",tip:"!=条件不等于",desc:"判断两个内容是否不相同。",level:"简单"},
  {title:"Python缩进一般使用？",opt:{A:"1空格",B:"4空格",C:"2空格",D:"Tab"},ans:"B",tip:"官方标准4空格缩进",desc:"缩进决定代码归属层级。",level:"简单"},
  {title:"round()函数作用？",opt:{A:"四舍五入",B:"求和",C:"计数",D:"排序"},ans:"A",tip:"round小数四舍五入",desc:"保留指定小数位数。",level:"中等"},
  {title:"max()函数作用？",opt:{A:"最小值",B:"最大值",C:"平均值",D:"总和"},ans:"B",tip:"max取出最大数值",desc:"快速找出一组数据最大数。",level:"简单"},
  {title:"min()函数作用？",opt:{A:"最大值",B:"最小值",C:"总数",D:"长度"},ans:"B",tip:"min取出最小数值",desc:"快速筛选最小数据。",level:"简单"},
  {title:"sum()函数作用？",opt:{A:"求和",B:"排序",C:"取余",D:"判断"},ans:"A",tip:"sum自动计算总和",desc:"直接计算列表所有数字相加结果。",level:"简单"},
  {title:"remove()功能？",opt:{A:"添加数据",B:"删除列表指定元素",C:"排序",D:"反转"},ans:"B",tip:"remove删除匹配元素",desc:"精准删除列表内对应内容。",level:"中等"},
  {title:"sort()功能？",opt:{A:"排序",B:"反转",C:"添加",D:"清空"},ans:"A",tip:"sort实现列表从小到大排序",desc:"快速整理杂乱数据。",level:"中等"},
  {title:"Python属于什么语言？",opt:{A:"编译型",B:"解释型",C:"机器语言",D:"汇编语言"},ans:"B",tip:"Python是解释型语言",desc:"逐行翻译运行，简单易上手。",level:"中等"},
  {title:"定义类关键字？",opt:{A:"def",B:"class",C:"fun",D:"obj"},ans:"B",tip:"class创建自定义类",desc:"面向对象编程基础关键字。",level:"中等"},
  {title:"self关键字作用？",opt:{A:"代表类本身",B:"输出",C:"循环",D:"判断"},ans:"A",tip:"self指向实例对象",desc:"类内部访问自身属性必备关键字。",level:"中等"},
  {title:"导入随机模块？",opt:{A:"import random",B:"import time",C:"import math",D:"import sys"},ans:"A",tip:"random随机功能模块",desc:"实现随机数字、随机选择。",level:"中等"},
  {title:"math.sqrt()作用？",opt:{A:"平方",B:"开平方根",C:"取整",D:"求和"},ans:"B",tip:"sqrt数学开方",desc:"计算数字平方根。",level:"中等"},
  {title:"time.sleep(2)含义？",opt:{A:"等待2秒",B:"运行2次",C:"循环2秒",D:"输出2"},ans:"A",tip:"sleep延迟暂停",desc:"程序暂停指定秒数。",level:"中等"},
  {title:"字符串切片语法正确的是？",opt:{A:"str[]",B:"str[:]",C:"str()",D:"str{}"},ans:"B",tip:"字符串使用[:]切片",desc:"自由截取部分文字内容。",level:"中等"},
  {title:"isinstance()作用？",opt:{A:"判断类型",B:"输出文字",C:"循环",D:"排序"},ans:"A",tip:"精准判断对象数据类型",desc:"高级类型判断方法。",level:"中等"},
  {title:"Python异常捕获关键字？",opt:{A:"try except",B:"if else",C:"for while",D:"def class"},ans:"A",tip:"try捕获程序错误",desc:"防止代码报错直接崩溃。",level:"中等"},
  {title:"global关键字作用？",opt:{A:"局部变量",B:"声明全局变量",C:"循环",D:"排序"},ans:"B",tip:"global修改全局变量",desc:"函数内部修改外部全局数据。",level:"中等"},
  {title:"Python默认编码格式？",opt:{A:"GBK",B:"UTF-8",C:"ASCII",D:"Unicode"},ans:"B",tip:"UTF-8通用国际编码",desc:"支持所有汉字与多国语言。",level:"中等"},
  {title:"enumerate()功能？",opt:{A:"同时获取下标和内容",B:"排序",C:"求和",D:"去重"},ans:"A",tip:"遍历同时拿到索引与元素",desc:"高效遍历列表工具。",level:"中等"},
  {title:"set集合最大特点？",opt:{A:"有序",B:"自动去重",C:"可重复",D:"可修改"},ans:"B",tip:"集合自动清除重复数据",desc:"快速实现列表去重功能。",level:"中等"}
])

// 基础变量
const idx = ref(0)
const nowQ = computed(() => list.value[idx.value])
const userAns = ref('')
const tipShow = ref(false)
const resText = ref('')
const isOk = ref(false)

// 学习数据
const userScore = ref(0)
const answerNum = ref(0)
const correctNum = ref(0)
const errorList = ref([])
const collectList = ref([])

// 进度计算
const progressPercent = computed(()=>{
  if(answerNum.value === 0) return 0
  return Math.round(answerNum.value / list.value.length * 100)
})
const correctRate = computed(()=>{
  if(answerNum.value === 0) return 0
  return Math.round(correctNum.value / answerNum.value * 100)
})

// 判断当前题目是否收藏
const isCollect = computed(()=>{
  return collectList.value.some(item=>item.title === nowQ.value.title)
})

// 上一题
const prevQuestion = ()=>{
  if(idx.value > 0){
    idx.value--
    userAns.value = ''
    tipShow.value = false
    resText.value = ''
  }else{
    alert("已经是第一题啦！")
  }
}

// 下一题
const next = ()=>{
  if(idx.value < list.value.length -1){
    idx.value++
    userAns.value = ''
    tipShow.value = false
    resText.value = ''
  }else{
    resText.value = "🎉 恭喜你刷完所有题库！"
  }
}

// 提交答案判题
const check = ()=>{
  if(!userAns.value) return resText.value = "请先选择答案！"
  answerNum.value++
  if(userAns.value === nowQ.value.ans){
    resText.value = "✅ 回答正确！"+nowQ.value.desc
    isOk.value = true
    userScore.value +=10
    correctNum.value++
  }else{
    resText.value = "❌ 回答错误，正确答案："+nowQ.value.ans+" | "+nowQ.value.desc
    isOk.value = false
    if(!errorList.value.some(x=>x.title===nowQ.value.title)){
      errorList.value.push(nowQ.value)
    }
  }
}

// 收藏题目
const addCollect = ()=>{
  if(isCollect.value){
    collectList.value = collectList.value.filter(x=>x.title !== nowQ.value.title)
    alert("已取消收藏")
  }else{
    collectList.value.push(nowQ.value)
    alert("⭐ 收藏成功！")
  }
}

// 重置所有数据
const resetData = ()=>{
  if(confirm("确定清空所有学习数据？分数、错题、进度将全部重置！")){
    userScore.value = 0
    answerNum.value = 0
    correctNum.value = 0
    errorList.value = []
    collectList.value = []
    idx.value = 0
    userAns.value = ''
    resText.value = ''
    localStorage.removeItem('clockDate')
    localStorage.removeItem('clockNum')
    alert("数据重置完成！")
  }
}

// 免安装Python云端运行
const code = ref('# 在这里写Python代码\nprint("Hello World!")')
const codeOut = ref('')

const runCode = async () => {
  codeOut.value = "⏳ 云端Python正在运行..."
  try {
    const response = await fetch("https://api.programiz.com/api/v1/online-compiler/python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: code.value,
        stdin: ""
      })
    })
    const res = await response.json()
    if(res.success){
      codeOut.value = res.output || "✅ 运行成功，暂无输出内容"
    }else{
      codeOut.value = "❌ 代码错误：\n" + (res.error || res.message)
    }
  } catch (err) {
    codeOut.value = "❌ 网络异常，请检查你的网络连接，或刷新页面重试"
  }
}

const clearCode = () => {
  code.value = ""
  codeOut.value = ""
}

// AI聊天数据
const chatText = ref('')
const chatList = ref([])

// 一键AI讲解当前题目
const askAiNow = ()=>{
  let q = "请详细讲解这道Python题目："+nowQ.value.title+"，正确答案是"+nowQ.value.ans+"，详细分析知识点"
  chatText.value = q
  sendMsg()
}

// AI智能回复
const sendMsg = ()=>{
  if(!chatText.value.trim()) return
  let userMsg = chatText.value
  chatList.value.push({user:userMsg,ai:""})

  setTimeout(()=>{
    let aiReply = ""
    if(userMsg.includes("题目")||userMsg.includes("解析")||userMsg.includes("答案")){
      aiReply = "📖 题目解析：本题考察Python基础语法知识点，核心考点简单易懂。正确答案重点考察基础概念，掌握基础语法就能轻松答对。多刷题巩固记忆，编程能力会快速提升！"
    }else if(userMsg.includes("代码")||userMsg.includes("编写")){
      aiReply = "💻 代码指导：编写Python代码要注意缩进、关键字、语法规范。多动手运行、多调试、多练习，慢慢就能熟练独立写代码啦！"
    }else if(userMsg.includes("函数")){
      aiReply = "📚 Python函数是代码模块化核心，使用def定义函数，可以重复调用代码，简化程序结构，是编程必备核心知识！"
    }else if(userMsg.includes("循环")){
      aiReply = "🔁 循环分为for循环与while循环，用来重复执行代码，大幅简化重复操作，是编程最常用结构之一。"
    }else if(userMsg.includes("学习")||userMsg.includes("鼓励")){
      aiReply = "💪 你非常优秀！坚持每日打卡刷题、练习代码，日积月累一定会成为编程高手，保持热爱继续加油！"
    }else{
      aiReply = "🤖 我是专业Python编程AI导师！你可以向我提问：解析题目、编写代码、讲解知识点、学习指导、语法答疑等所有编程相关问题！"
    }
    chatList.value[chatList.value.length-1].ai = aiReply
    chatText.value = ""
  },600)
}

// 打卡功能
const nowDate = ref('')
const clockDay = ref(0)
const isClock = ref(false)
const getNowDate = ()=>{
  let d = new Date()
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}

onMounted(()=>{
  nowDate.value = getNowDate()
  getTime()
  let oldDate = localStorage.getItem('clockDate')
  let oldNum = localStorage.getItem('clockNum')||0
  if(oldDate === nowDate.value) isClock.value = true
  clockDay.value = Number(oldNum)
})

const addClock = ()=>{
  if(isClock.value) return
  isClock.value = true
  clockDay.value++
  localStorage.setItem('clockDate',nowDate.value)
  localStorage.setItem('clockNum',clockDay.value)
  alert("🎉 打卡成功！今日学习已完成，继续坚持！")
}
</script>

<style scoped>
*{margin:0;padding:0;box-sizing:border-box;}
.app-container{display:flex;width:100%;min-height:100vh;background:#0f172a;color:#f1f5f9;}

/* 左侧侧边栏 */
.sidebar{width:240px;background:#1e293b;padding:25px 18px;border-right:1px solid #334155;}
.logo h2{color:#38bdf8;text-align:center;margin-bottom:10px;font-size:20px;}
.now-time{text-align:center;color:#94a3b8;font-size:14px;margin-bottom:25px;}
.nav-menu{margin-bottom:25px;}
.nav-item{padding:12px 15px;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:0.2s;}
.nav-item.active{background:#0ea5e9;}
.nav-item:hover{background:#334155;}

.clock-card,.score-card{background:#273444;border-radius:12px;padding:18px;margin-bottom:20px;}
.clock-card h4,.score-card h4{margin-bottom:12px;color:#e0f2fe;}
.day-num{color:#22c55e;font-weight:bold;font-size:18px;}
.yes{color:#4ade80;margin:6px 0;}
.no{color:#f87171;margin:6px 0;}
.clock-btn{width:100%;padding:10px;background:#22c55e;color:#fff;border:none;border-radius:8px;margin-top:10px;cursor:pointer;}
.disabled-btn{width:100%;padding:10px;background:#475569;color:#ccc;border:none;border-radius:8px;margin-top:10px;cursor:not-allowed;}

.score-text{color:#38bdf8;font-weight:bold;font-size:17px;}
.rate-text{color:#4ade80;font-weight:bold;}
.progress-box{margin-top:12px;}
.progress-bar{width:100%;height:8px;background:#334155;border-radius:4px;overflow:hidden;margin-top:6px;}
.progress{height:100%;background:#38bdf8;transition:0.4s;}
.reset-btn{width:100%;margin-top:15px;padding:8px;background:#ef4444;color:#fff;border:none;border-radius:8px;cursor:pointer;}

/* 中间主区域 */
.main-content{flex:1;padding:25px 35px;}
.top-encourage{background:linear-gradient(90deg,#1e3a5f,#1e293b);padding:14px 20px;border-radius:12px;margin-bottom:20px;text-align:center;color:#93c5fd;font-size:15px;}
.notice-box{background:rgba(56,189,248,0.1);padding:12px 18px;border-radius:10px;margin-bottom:20px;border:1px solid rgba(56,189,248,0.2);}
.notice-title{color:#38bdf8;font-weight:bold;margin-right:10px;}
.main-header{margin-bottom:25px;}
.main-header h1{color:#e0f2fe;margin-bottom:6px;}
.main-header p{color:#94a3b8;}

.question-section,.code-section,.knowledge-box,.error-box,.collect-box{background:#1e293b;border-radius:14px;padding:25px;margin-bottom:25px;border:1px solid #334155;}
.question-header{margin-bottom:20px;}
.tag{background:#0ea5e9;padding:4px 12px;border-radius:20px;font-size:13px;margin-right:10px;}
.level-tag{padding:3px 10px;border-radius:20px;font-size:12px;}
.level-tag.easy{background:#22c55e;}
.level-tag.mid{background:#f59e0b;}
.collect-icon{float:right;color:#fbbf24;cursor:pointer;}

.options{display:flex;flex-direction:column;gap:12px;margin-bottom:22px;}
.option-item{background:#273444;padding:14px;border-radius:10px;cursor:pointer;}
.action-buttons{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:15px;}
.btn{padding:9px 18px;border:none;border-radius:8px;cursor:pointer;}
.btn.primary{background:#22c55e;color:#fff;}
.btn.secondary{background:#3b82f6;color:#fff;}
.btn.ai-btn{background:#8b5cf6;color:#fff;}
.btn.clear-btn{background:#64748b;color:#fff;}

.hint-box{background:rgba(245,158,11,0.15);color:#fcd34d;padding:14px;border-radius:10px;margin:10px 0;}
.feedback-box.success{color:#4ade80;font-weight:500;}
.feedback-box.error{color:#f87171;font-weight:500;}

.code-section textarea{width:100%;height:200px;background:#0f172a;border:1px solid #334155;border-radius:10px;padding:15px;color:#e2e8f0;margin:12px 0;}
.run-btn{background:#8b5cf6;color:#fff;}
.output-box{background:#0f172a;padding:15px;border-radius:10px;border:1px solid #334155;}

.knowledge-item{background:#273444;padding:18px;border-radius:10px;margin-bottom:15px;line-height:1.8;}
.knowledge-item h4{color:#38bdf8;margin-bottom:8px;}
.empty-tip{text-align:center;padding:30px;color:#94a3b8;}
.error-item,.collect-item{background:#273444;padding:15px;border-radius:10px;margin-bottom:12px;}

/* 右侧AI面板 */
.ai-panel{width:320px;background:#1e293b;border-left:1px solid #334155;padding:25px 20px;}
.ai-header h3{color:#38bdf8;text-align:center;margin-bottom:8px;}
.ai-desc{text-align:center;color:#94a3b8;font-size:13px;margin-bottom:20px;}
.chat-box{height:420px;overflow:auto;margin-bottom:15px;}
.ai-message,.user-message{padding:12px;border-radius:10px;margin-bottom:10px;font-size:14px;line-height:1.6;}
.ai-message{background:#273444;}
.user-message{background:#0ea5e9;text-align:right;}
.chat-input{display:flex;gap:8px;}
.chat-input input{flex:1;padding:12px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#fff;}
.send-btn{padding:0 15px;background:#0ea5e9;color:#fff;border:none;border-radius:8px;cursor:pointer;}
</style>