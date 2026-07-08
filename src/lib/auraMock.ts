export type SleepOption = "很好" | "一般" | "很差";
export type MoodOption = "平静" | "有点烦" | "很焦虑" | "状态不错";
export type ConcernOption = "感情" | "工作" | "人际" | "财运" | "穿搭" | "出行";
export type WeatherOption = "晴天" | "阴天" | "下雨" | "很热" | "很冷";

export type TodaySelection = {
  sleep: SleepOption;
  mood: MoodOption;
  concern: ConcernOption;
  weather: WeatherOption;
};

export type TodayGuide = {
  status: string;
  overview: string;
  why: string;
  eventInsight?: {
    title: string;
    content: string;
  };
  doList: string[];
  avoidList: string[];
  funComment: string;
  questionAnswers: TodayQuestionAnswer[];
};

export type TodayQuestionAnswer = {
  title: string;
  answer: string;
};

export type Story = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  fullText: string;
  aiInsight: string;
  masterComment: string;
  resonance: number;
};

export const questionOptions = {
  sleep: ["很好", "一般", "很差"] as SleepOption[],
  mood: ["平静", "有点烦", "很焦虑", "状态不错"] as MoodOption[],
  concern: ["感情", "工作", "人际", "财运", "穿搭", "出行"] as ConcernOption[],
  weather: ["晴天", "阴天", "下雨", "很热", "很冷"] as WeatherOption[],
};

export const statusTags = {
  recovery: "恢复日",
  lightSocial: "轻社交日",
  emotionSorting: "情绪整理日",
  actionCharging: "行动蓄力日",
};

export const overviewTemplates = {
  recovery: "今天不适合硬撑，适合把节奏放慢一点。你不是没状态，只是需要换一种发力方式。",
  lightSocial: "今天适合主动靠近，但不用把话说满。轻轻递出一个信号，比反复试探更有气场。",
  emotionSorting: "今天不适合硬冲，先把情绪放回自己的位置。稳住节奏，事情会比想象中好处理。",
  actionCharging: "今天适合把能量用在确定的小行动上。不要追求一口气翻盘，先让自己重新进入状态。",
};

export const concernAdvice: Record<ConcernOption, { doList: string[]; avoidList: string[]; detail: string }> = {
  感情: {
    doList: ["适合发起一次轻松联系", "适合表达真实感受", "适合给关系留一点余地"],
    avoidList: ["避免用试探代替表达", "避免翻旧账", "避免把对方的慢回复理解成否定"],
    detail: "感情上今天更适合柔软一点的主动。你不用装作完全不在意，也不用把自己交出去太多。",
  },
  工作: {
    doList: ["把重要工作拆成小步骤", "适合轻沟通确认边界", "适合处理不需要强冲刺的事情"],
    avoidList: ["避免和同事或老板硬碰硬", "避免临时接下所有锅", "避免用情绪回复工作消息"],
    detail: "工作上今天先别追求一拳打穿全场。把任务拆小，反而会让你更快找回掌控感。",
  },
  人际: {
    doList: ["适合筛选真正舒服的关系", "适合把话说得更清楚", "适合减少无效应酬"],
    avoidList: ["避免为了合群委屈自己", "避免过度解释", "避免替别人消化所有情绪"],
    detail: "人际关系今天需要一点边界感。不是你变冷了，是你终于开始把自己也算进关系里。",
  },
  财运: {
    doList: ["适合复盘近期消费", "适合设置小额预算", "适合把想买的东西先放进收藏夹"],
    avoidList: ["避免情绪性下单", "避免被限时优惠催着走", "避免借钱或冲动投资"],
    detail: "财运今天的关键词是稳。钱包不是不能打开，是别在情绪上头时让它自动驾驶。",
  },
  穿搭: {
    doList: ["适合选择舒服又有质感的单品", "适合用配饰提气色", "适合穿让自己走路更稳的鞋"],
    avoidList: ["避免为了讨好别人穿得不自在", "避免过度堆叠元素", "避免选择会让你反复整理的衣服"],
    detail: "穿搭今天不必用力证明什么。让衣服服务你的状态，你自然会有一种不解释的好看。",
  },
  出行: {
    doList: ["适合提前预留时间", "适合选择熟悉路线", "适合带上能安抚自己的小物件"],
    avoidList: ["避免卡点出门", "避免临时改变太多计划", "避免在路上处理高压对话"],
    detail: "出行上今天适合给自己留缓冲。路顺不顺先不说，你的心情值得有备用方案。",
  },
};

export const funCommentTemplates = {
  work: "今天不建议和老板正面硬刚，容易触发“加班暴击”。如果可以，建议让老板亲力亲为，体验一下当牛马的甜。",
  love: "今天适合发消息，但不适合发三段小作文。你的魅力可以上线，侦探模式先下班。",
  money: "今天看到优惠先深呼吸三秒。不是不让你买，是让钱包也拥有一点被尊重的体面。",
  outfit: "今天穿搭可以温柔，但气势别太客气。你不是来凑合一天的，你是来轻轻拿捏氛围的。",
  default: "今天先别和世界拼嗓门。你只要稳住一点点，很多事就会自动露出好商量的样子。",
};

export const todayQuestions: TodayQuestionAnswer[] = [
  {
    title: "今天的人际关系要注意什么？",
    answer: "今天的人际重点是少解释、多观察。舒服的人会理解你的节奏，不舒服的关系也会在你的沉默里露出边界。",
  },
  {
    title: "今天适合什么穿搭？",
    answer: "适合柔软材质、低饱和色和一点金色或珍珠感点缀。不要穿太勒、太响、太需要被照顾的衣服。",
  },
  {
    title: "今天的桃花状态怎么样？",
    answer: "桃花不是没有，但更吃轻松感。越自然越容易被看见，越用力反而容易让气氛变成面试。",
  },
  {
    title: "今天工作上怎么顺势？",
    answer: "先做最确定的一件事，再沟通最容易误会的一句话。今天不靠爆发取胜，靠稳定推进加分。",
  },
  {
    title: "今天容易在哪方面破财？",
    answer: "容易在情绪补偿和即时满足上破财。购物车可以加，付款键建议晚一点再宠幸。",
  },
];

export const stories: Story[] = [
  {
    id: 1,
    category: "感情",
    title: "《今天，我突然不想回消息了》",
    excerpt: "不是不喜欢，也不是故意冷淡，只是每次打开聊天框，都觉得自己又要开始表演一个“情绪稳定的大人”。",
    fullText:
      "早上醒来看到他的消息，我盯着屏幕看了很久。其实没有吵架，也没有发生什么大事，可我就是不想回。以前我会马上解释、安抚、找话题，现在只觉得累。我怕自己一回复，就又要照顾对方的情绪，证明我没有变，证明我还在乎。",
    aiInsight: "AI 看见的是：你不是冷漠，而是长期消耗后的自我保护。",
    masterComment: "大师说：真正的顺势，不是逃避，而是不再强迫自己逆着心走。",
    resonance: 2187,
  },
  {
    id: 2,
    category: "工作",
    title: "《我想辞职，但又怕自己后悔》",
    excerpt: "每天都说再忍忍，可每次走进办公室，身体已经先替我叹气了。",
    fullText:
      "我并不是完全做不了这份工作，只是越来越感觉自己被消耗。领导说成长都要痛苦，可我已经分不清这是成长，还是被迫适应不合理。想辞职，又怕没有更好的选择；不辞，又怕自己慢慢变得麻木。",
    aiInsight: "AI 看见的是：你真正害怕的不是辞职，而是做决定后没有人接住你。",
    masterComment: "大师说：先给自己准备退路，再谈勇气。顺势不是裸奔式勇敢，是带着灯往前走。",
    resonance: 1846,
  },
  {
    id: 3,
    category: "家庭",
    title: "《她说我变冷淡了，可我只是太累了》",
    excerpt: "家人总说我话少了，但他们好像忘了，我以前说很多话的时候，并没有真的被听见。",
    fullText:
      "妈妈说我现在越来越冷漠，不像以前什么都跟她讲。可我不是突然变了，是慢慢学会了不再解释。很多话说出口只会变成争论，很多委屈说出来也会被教育。所以我选择安静，不是因为没感情，而是因为没有力气再证明自己。",
    aiInsight: "AI 看见的是：你沉默的背后，是一次次表达无效后的撤退。",
    masterComment: "大师说：有些边界不是疏远亲人，而是把自己从旧剧本里领出来。",
    resonance: 2634,
  },
  {
    id: 4,
    category: "情绪",
    title: "《为什么越懂事的人，越容易委屈自己》",
    excerpt: "我好像总能理解别人，却很少有人问我一句：那你呢？",
    fullText:
      "我一直觉得懂事是优点。后来才发现，我的懂事常常是自动把自己的需求排到最后。朋友失约我说没关系，同事甩锅我说我来处理，家人误会我也先解释。可有一天我突然很累，累到不想再做那个好说话的人。",
    aiInsight: "AI 看见的是：你的委屈不是脆弱，而是长期压缩自我后的回弹。",
    masterComment: "大师说：真正的好脾气，应该先对自己好。否则温柔会变成内耗。",
    resonance: 3092,
  },
  {
    id: 5,
    category: "成长",
    title: "《我开始允许自己没那么厉害》",
    excerpt: "以前总怕慢下来就会被甩开，现在才发现，我也可以不用每天都赢。",
    fullText:
      "我曾经很迷恋效率，工作要快，回复要快，成长也要快。可最近我发现，自己像一台一直开着的机器。某天晚上我什么都没做，只是洗了澡、吹了头发、认真吃了一碗面，突然觉得这也算一种恢复。",
    aiInsight: "AI 看见的是：你正在从“必须证明自己”转向“愿意照顾自己”。",
    masterComment: "大师说：能量不是靠逼出来的，是靠允许自己喘口气慢慢回来。",
    resonance: 1765,
  },
  {
    id: 6,
    category: "财富",
    title: "《我又在情绪不好时买了一堆东西》",
    excerpt: "付款那一刻很爽，快递到的时候却只剩下：我当时到底在想什么？",
    fullText:
      "我知道自己不是特别需要那些东西，可每次情绪低落的时候，购物车就像一个临时避难所。买完会开心一小会儿，然后开始后悔。我好像不是在买东西，是想买一个“我值得被好好对待”的感觉。",
    aiInsight: "AI 看见的是：消费在替你完成一次短暂的自我安抚。",
    masterComment: "大师说：钱不是不能花，但别让委屈替你做决定。先安抚人，再安排行动。",
    resonance: 1429,
  },
];
