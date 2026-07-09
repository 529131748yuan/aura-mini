export const AURA_FULL_PROFILE_UNLOCKED_KEY = "auraFullProfileUnlocked";
export const AURA_FULL_PROFILE_FORM_KEY = "auraFullProfileForm";
export const AURA_FULL_PROFILE_RESULT_KEY = "auraFullProfileData";
export const AURA_FULL_PROFILE_LEGACY_RESULT_KEY = "auraFullProfileResult";
export const FULL_PROFILE_MIN_AGE = 12;
export const FULL_PROFILE_UNDERAGE_MESSAGE = "气场尚未成型，无法提早解读";

export type RelationshipStatus = "单身" | "恋爱中" | "已婚" | "关系复杂" | "不想说";
export type MainConcern = "感情" | "婚姻" | "工作" | "财富" | "家庭" | "情绪" | "自我成长";
export type RecentState = "稳定" | "容易焦虑" | "容易疲惫" | "经常内耗" | "状态变好";
export type FullProfileStage = "locked" | "unlocked" | "generated";

export type FullProfileFormData = {
  birthDate: string;
  birthTime: string;
  city: string;
  relationshipStatus: RelationshipStatus;
  mainConcern: MainConcern;
  recentState: RecentState;
};

export type FullProfileTodayContext = {
  statusName: string;
  statusTitle: string;
  statusSummary: string;
  scores?: Record<string, number>;
  primaryDimension?: string;
  secondaryDimension?: string;
  answerKeys?: string[];
  traits?: string[];
  testProfile?: {
    energyPattern: string;
    relationshipPattern: string;
    pressurePattern: string;
    actionPattern: string;
    innerTrigger: string;
    answerPattern: string;
  };
};

export type FullProfileSection = {
  title: string;
  content: string;
  highlight?: string;
};

export type FullProfileResult = {
  title: string;
  subtitle: string;
  intro: string;
  fixedAura: string;
  currentState: string;
  psychology: string;
  relationshipPattern: string;
  emotionActionPattern: string;
  environmentImpact: string;
  sevenDayAdvice: {
    today: string[];
    threeDays: string[];
    sevenDays: string[];
  };
  masterPrompt: string;
  sections: FullProfileSection[];
  personality: string;
  emotionTrajectory: string;
  advice: string;
  mainConcern: MainConcern;
  generatedAt: string;
};

export const relationshipStatusOptions: RelationshipStatus[] = ["单身", "恋爱中", "已婚", "关系复杂", "不想说"];
export const mainConcernOptions: MainConcern[] = ["感情", "婚姻", "工作", "财富", "家庭", "情绪", "自我成长"];
export const recentStateOptions: RecentState[] = ["稳定", "容易焦虑", "容易疲惫", "经常内耗", "状态变好"];

export function getFullProfileAgeGate(birthDate: string, now = new Date()) {
  const [year, month, day] = birthDate.split("-").map(Number);

  if (!year || !month || !day) {
    return { allowed: false, age: null, message: "请先填写出生日期" };
  }

  let age = now.getFullYear() - year;
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age -= 1;
  }

  return {
    allowed: age >= FULL_PROFILE_MIN_AGE,
    age,
    message: age >= FULL_PROFILE_MIN_AGE ? "" : FULL_PROFILE_UNDERAGE_MESSAGE,
  };
}

export function getFullProfileStage(unlocked: boolean, result: FullProfileResult | null): FullProfileStage {
  if (result) return "generated";
  return unlocked ? "unlocked" : "locked";
}

function getBirthTendency(form: FullProfileFormData) {
  const month = Number(form.birthDate.split("-")[1] ?? "1");
  const hour = Number((form.birthTime || "12:00").split(":")[0] ?? "12");
  const seasonTone = month >= 3 && month <= 5 ? "感知细腻、对变化反应快" : month >= 6 && month <= 8 ? "外柔内热、责任感强" : month >= 9 && month <= 11 ? "重视秩序、容易提前预判" : "慢热深情、需要稳定安全感";
  const timeTone = hour >= 6 && hour < 12 ? "行动力来自清晰目标" : hour >= 12 && hour < 18 ? "行动力来自被认可和被需要" : hour >= 18 && hour < 23 ? "行动力来自关系确定和情绪安稳" : "行动力来自安静、独处和内在确认";

  return { seasonTone, timeTone };
}

function getConcernFocus(form: FullProfileFormData) {
  if (form.mainConcern === "感情" || form.mainConcern === "婚姻") {
    return {
      focus: "关系里的回应、安全感和稳定承诺",
      pressure: "对方态度变淡、表达不明确、关系节奏忽近忽远",
      action: "先确认自己的真实需求，再决定要不要继续解释或等待",
    };
  }

  if (form.mainConcern === "工作" || form.mainConcern === "财富") {
    return {
      focus: "自我价值、行动节奏和对结果的控制感",
      pressure: "任务密集、反馈不稳定、努力没有马上被看见",
      action: "把目标拆小，用可完成的小结果重新建立控制感",
    };
  }

  if (form.mainConcern === "家庭") {
    return {
      focus: "责任边界、家人期待和自己的情绪空间",
      pressure: "被默认承担、被要求懂事、很难把拒绝说出口",
      action: "把能承担的和不该承担的分开，减少习惯性兜底",
    };
  }

  return {
    focus: "情绪稳定、自我确认和长期成长",
    pressure: "反复思考、期待自己变好、却又被内耗拖住",
    action: "先恢复内在能量，再讨论效率和改变",
  };
}

function getRecentStateFocus(recentState: RecentState) {
  if (recentState === "经常内耗") return "最近 30 天的内耗说明你消耗最多的不是体力，而是反复预判、复盘和自我怀疑带来的内在能量。";
  if (recentState === "容易焦虑") return "最近 30 天的焦虑说明你很需要确定感，当事情没有明确答案时，你会本能地想抓住更多信息。";
  if (recentState === "容易疲惫") return "最近 30 天的疲惫说明你的恢复速度正在变慢，很多事并不是做不到，而是能量已经被提前透支。";
  if (recentState === "状态变好") return "最近 30 天状态变好，说明你已经开始找到适合自己的节奏，但仍需要避免被旧模式重新拉回去。";
  return "最近 30 天整体稳定，说明你有一定自我调节能力，只是遇到关键关系或压力时仍会被牵动。";
}

function getImmersiveProfileDetails(form: FullProfileFormData) {
  const relationDetail =
    form.mainConcern === "感情" || form.mainConcern === "婚姻"
      ? "如果消息没有及时回、语气突然变淡、约好的事被临时改变，你表面可能会说没事，心里却会开始反复确认：是不是我哪里做得不够好，是不是对方没有那么在意我。你真正难受的不是一条消息，而是那一刻你感觉自己的位置变得不确定。"
      : "当别人一句评价、一个临时安排、一次没有说明原因的否定落到你这里，你会先把它消化成自己的责任。你不一定会当场反驳，但会在心里快速复盘：我是不是还不够稳，是不是应该再努力一点。";

  const recentDetail =
    form.recentState === "经常内耗"
      ? "你最近最明显的消耗，是白天撑住、晚上复盘。白天你可以把事情处理得像没问题一样，到了安静下来以后，很多细节又会重新浮上来：一句话、一个表情、一个没有解释清楚的停顿，都可能被你在心里反复翻看。"
      : form.recentState === "容易焦虑"
        ? "你最近更容易被不确定牵动，只要事情没有明确结果，你就会想提前准备所有可能性。看起来是在做准备，其实内在能量一直处在被拉紧的状态。"
        : form.recentState === "容易疲惫"
          ? "你最近不是不想变好，而是恢复速度变慢了。很多时候你刚把自己撑起来，又被新的沟通、新的任务、新的期待消耗掉，所以会有一种怎么休息都没真正缓过来的感觉。"
          : "你最近其实已经在努力把自己带回稳定，只是旧的反应还会偶尔出现：一遇到重要关系或重要评价，你还是会本能地先紧一下，再判断自己能不能放松。";

  const relationshipStatusDetail =
    form.relationshipStatus === "关系复杂"
      ? "关系不确定时，你最容易被对方的节奏牵着走：靠近一点你会重新燃起期待，退远一点你又会怀疑自己是不是不该在意。真正需要被整理的，是你在这段关系里有没有足够清楚的位置。"
      : "你在关系里常常想解释又怕麻烦，想表达又怕被说太敏感，于是很多话会被你压成一句“算了”。可那些没说出口的感受并不会消失，它们会变成冷淡、疲惫，或者某一天突然爆发出来。";

  return {
    fixedAura:
      "更深一层看，你的底层气场不是单纯敏感，而是很会读取变化。别人还没有明确表达出来的情绪，你往往已经先感受到了；别人觉得只是小事，你却会自然地把它放进关系、责任和自我价值里一起判断。所以你不是想太多，你只是接收得太细、承接得太快。",
    currentState: `${recentDetail}${relationDetail}这会让你很容易出现一种“外面还在正常运转，里面已经很累”的状态。`,
    psychology:
      "这套反应链路的底层逻辑是：你越在意，就越想提前判断；越想判断，就越容易消耗；越消耗，就越需要确认。于是你会在关系、工作或家庭里反复进入同一种循环：先观察，后忍住，再复盘，最后开始怀疑自己。真正要调整的不是让你变得迟钝，而是让你学会把外界变化和自己的价值分开。",
    relationshipPattern: `${relationshipStatusDetail}你需要的不是被哄一时，而是一种稳定的回应感：对方能不能认真听你说，能不能在关键时刻给你明确态度，能不能让你不用一直靠猜来维持安全感。`,
    emotionActionPattern:
      "当你内在很乱时，强迫自己立刻高效只会让消耗更重。你适合先把情绪里的噪音降下来，再做小动作。比如先回一条必须回的消息、先完成一个十分钟任务、先把今天最卡住你的念头写下来。你一旦重新获得一点点完成感，行动力就会慢慢回来。",
    environmentImpact:
      "如果这段时间沟通密度高、休息被打断、身边人的情绪也不稳定，你会比平时更容易被影响。不是你变脆弱了，而是你的气场本来就容易捕捉环境细节，当环境持续嘈杂时，你需要比别人更多的独处和降噪。",
    masterPrompt:
      "如果你看到这里心里已经浮现出某个人、某句话或某个选择，说明真正牵动你的不是泛泛的状态，而是一个具体结。这个结适合继续追问，因为它往往藏着你反复进入相似状态的入口。",
  };
}

export function getFullProfileReportLength(result: FullProfileResult) {
  return [
    result.title,
    result.subtitle,
    result.intro,
    result.fixedAura,
    result.currentState,
    result.psychology,
    result.relationshipPattern,
    result.emotionActionPattern,
    result.environmentImpact,
    result.sevenDayAdvice.today.join(""),
    result.sevenDayAdvice.threeDays.join(""),
    result.sevenDayAdvice.sevenDays.join(""),
    result.masterPrompt,
  ].join("").length;
}

function sanitizeReportText(text: string) {
  return text
    .replace(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}，[^"，。]+/g, "已结合基础资料")
    .replace(/\d{4}-\d{2}-\d{2}/g, "基础资料")
    .replace(/\d{2}:\d{2}/g, "基础资料")
    .replace(/[（(][^（）()]*基础资料[^（）()]*[）)]/g, "")
    .replace(/出生日期/g, "基础资料")
    .replace(/出生时间/g, "基础资料")
    .replace(/出生信息/g, "基础资料")
    .replace(/所在地区/g, "外部环境")
    .replace(/地区环境/g, "外部环境")
    .replace(/你填写的城市是[^，。]+/g, "已结合外部环境")
    .replace(/从心理学看/g, "从气场流向看")
    .replace(/心理学/g, "气场")
    .replace(/心理推断/g, "气场分析")
    .replace(/心理反应/g, "气场反应")
    .replace(/心理能量/g, "内在能量")
    .replace(/心理/g, "内在")
    .replace(/当前先用\s*mock\s*规则推导出一组固定气场倾向，而不是把它写成“命运决定论”。?/g, "可以看见一组固定气场倾向。")
    .replace(/mock\s*天气数据/g, "体感变化")
    .replace(/mock/g, "气场")
    .replace(/规则推导/g, "气场校准")
    .replace(/命运决定论/g, "单一判断")
    .replace(/当前先用/g, "");
}

export function sanitizeFullProfileResult(result: FullProfileResult): FullProfileResult {
  const sanitized: FullProfileResult = {
    ...result,
    subtitle: sanitizeReportText(result.subtitle),
    intro: sanitizeReportText(result.intro),
    fixedAura: sanitizeReportText(result.fixedAura),
    currentState: sanitizeReportText(result.currentState),
    psychology: sanitizeReportText(result.psychology),
    relationshipPattern: sanitizeReportText(result.relationshipPattern),
    emotionActionPattern: sanitizeReportText(result.emotionActionPattern),
    environmentImpact: sanitizeReportText(result.environmentImpact),
    masterPrompt: sanitizeReportText(result.masterPrompt),
    personality: sanitizeReportText(result.personality),
    emotionTrajectory: sanitizeReportText(result.emotionTrajectory),
    advice: sanitizeReportText(result.advice),
    sections: result.sections.map((section) => ({
      title: sanitizeReportText(section.title),
      content: sanitizeReportText(section.content),
      highlight: section.highlight ? sanitizeReportText(section.highlight) : section.highlight,
    })),
    sevenDayAdvice: {
      today: result.sevenDayAdvice.today.map(sanitizeReportText),
      threeDays: result.sevenDayAdvice.threeDays.map(sanitizeReportText),
      sevenDays: result.sevenDayAdvice.sevenDays.map(sanitizeReportText),
    },
  };

  return sanitized;
}

function getTodayManifestAura(todayContext?: FullProfileTodayContext) {
  if (!todayContext?.testProfile) {
    return `今日显化气场：今天的 10 题测试显示，你当前更接近“${todayContext?.statusName ?? "情绪整理期"}”。这代表此刻浮在表层的状态，主要用于判断你今天怎么反应、怎么消耗、怎么恢复。`;
  }

  const profile = todayContext.testProfile;
  const traits = todayContext.traits?.length ? `测试里还显示出这几个特点：${todayContext.traits.join("；")}。` : "";
  const scoreText = todayContext.scores
    ? `四项分数呈现为恢复 ${todayContext.scores.recovery ?? 0}、关系 ${todayContext.scores.relationship ?? 0}、行动 ${todayContext.scores.action ?? 0}、流动 ${todayContext.scores.flow ?? 0}，主轴是${todayContext.primaryDimension ?? "当前主轴"}，次轴是${todayContext.secondaryDimension ?? "当前次轴"}。`
    : "";

  return `今日显化气场：这部分来自你刚才完成的 10 题选择，不是凭空判断。你的能量状态更接近「${profile.energyPattern}」；关系反应更接近「${profile.relationshipPattern}」；压力处理更接近「${profile.pressurePattern}」；行动节奏更接近「${profile.actionPattern}」；今天真正牵动你的内在触发点是「${profile.innerTrigger}」。${scoreText}${traits}所以完整档案会把它作为“今天浮现出来的状态”，再和天生固有气场、最近 30 天状态、关系处境一起合并判断。`;
}

export function generateFullProfile(form: FullProfileFormData, todayContext?: FullProfileTodayContext): FullProfileResult {
  const city = form.city.trim() || "你所在的城市";
  const privateAreaLabel = "外部环境";
  const todayStatusName = todayContext?.statusName ?? "情绪整理期";
  const todayStatusTitle = todayContext?.statusTitle ?? "正在重新理解自己";
  const todayStatusSummary = todayContext?.statusSummary ?? "你今天更需要先看见自己的真实反应，再决定怎么调整节奏。";
  const { seasonTone, timeTone } = getBirthTendency(form);
  const concern = getConcernFocus(form);
  const recentFocus = getRecentStateFocus(form.recentState);
  const weatherMock = city.includes("上海") || city.includes("杭州") || city.includes("苏州") ? "偏闷、湿度较高" : city.includes("北京") || city.includes("天津") ? "偏干、节奏较快" : "温差和体感变化比较明显";

  const fixedAura =
    `从你的基础资料里，可以看见一组固定气场倾向。你的底层气场更接近“${seasonTone}”这一类：你不是迟钝的人，恰恰相反，你对关系、语气、氛围变化都很敏感。很多时候别人只是随口一句话，你却会自动开始分析背后的态度。你的情绪反应方式不是立刻爆发，而是先观察、先消化、先判断自己该怎么表现得合适。你的行动力来源更接近“${timeTone}”，当目标清楚、关系稳定、内心有确认感时，你会推进得很稳。你的天生优势是会照顾人、会捕捉细节、能提前发现问题；天生消耗点是容易把别人的反应也算成自己的责任，久了就会进入外表正常、内心消耗的状态。`;

  const currentState =
    `二、你现在处在什么状态：结合今日测试，你当前更接近“${todayStatusName}”，也就是一个“${todayStatusTitle}”的阶段。${todayStatusSummary} 再叠加你填写的最近 30 天状态“${form.recentState}”、主要困扰“${form.mainConcern}”、当前感情状态“${form.relationshipStatus}”，可以看出你最近不是单纯心情不好，也不是能力下降，而是内在能量被分配到太多地方。你一边要处理现实里的${concern.focus}，一边还要维持体面、回应别人、压住自己的情绪，所以真正让你累的不是某一件事，而是长期处在“既想做好，又不敢完全放松”的拉扯里。${recentFocus} 这类状态会让你变得更敏感，也更容易把外界反馈理解成对自己的评价。你现在最需要的不是继续硬撑，不是马上证明自己没问题，而是重新建立节奏：先把今天最消耗你的事情降下来，再把可控的小行动放回手里。`;

  const psychology =
    `三、从气场流向看，你为什么会反复这样：你更像处在一种“高感知 + 高责任”的反应模式里。你习惯先捕捉别人的情绪，再决定自己该怎么说、怎么做、要不要退一步。短期看，这会让你显得懂事、体贴、会处理关系；但长期看，它会形成情绪耗竭，因为你一直在替别人预判、替关系兜底、替结果负责。当安全感需求没有被稳定满足时，你会想要更多确认；当控制感缺失时，你会通过反复思考来寻找答案；当边界感不够清晰时，你又会把“不想让别人失望”放在“我是否真的愿意”前面。这不是给你贴标签，而是说你的气场有时会进入一种过度外放、过度承接的状态。它的核心不是软弱，而是你太想把关系和事情都处理好。真正的调整，是学会分辨哪些情绪属于你，哪些责任其实不该由你承担。`;

  const relationshipPattern =
    `四、你的关系模式：为什么你容易在关系里累。你现在的感情状态是“${form.relationshipStatus}”，这会影响你对亲密关系和重要人际的判断。你在关系里真正需要的不是对方时时刻刻陪着你，而是稳定、明确、可感知的回应。${form.relationshipStatus === "关系复杂" ? "尤其当关系处在不确定里，你会更容易被对方的节奏牵引：对方靠近一点，你会重新燃起期待；对方冷一点，你又会开始怀疑自己是不是想多了。" : "当回应变少时，你通常不会立刻发作，而是会先观察、先忍住、先怀疑自己是不是哪里做得不够好。"} 这会让你看起来很懂事，但内心其实已经开始委屈。你最容易失望的地方，是你给出去的理解没有被同等认真地接住。你明明在意却不愿意说，是因为你担心说出口以后，不但得不到回应，还要解释自己为什么会在意。关系里的调整不是让你变冷，而是让你把需求说得更早、更轻、更清楚，不要等到消耗满了才用沉默或爆发保护自己。`;

  const emotionActionPattern =
    `五、你的情绪和行动节奏：你不是没有行动力，而是不适合在混乱情绪中强行冲刺。你的行动力来自“内在确认感”：当你知道自己为什么做、为谁做、做到什么程度就可以时，你会推进得很稳；但当你一边做事一边怀疑自己，行动力就会被大量内耗吃掉。围绕“${form.mainConcern}”这件事，你最容易被${concern.pressure}影响。情绪稳定时，你能很快进入执行；可一旦关系、评价、结果同时变得不确定，你就会开始拖延、逃避或反复复盘。拖延并不一定是懒，它有时是一种防御机制：只要还没开始，就暂时不用面对失败或否定。适合你的行动方式不是逼自己一天改变很多，而是先做一件能完成的小事，让身体重新体验“我能推进”的感觉，再逐步恢复目标感。`;

  const environmentImpact =
    `六、环境正在怎样影响你：环境不会决定你，但会放大或减弱某些状态。结合${privateAreaLabel}节奏和体感变化，当前更接近“${weatherMock}”这一类体感。如果最近体感偏闷、湿度较高、通勤或工作节奏又密集，身体本身就更容易进入低能量状态。再叠加睡眠不足、连续沟通、压力任务和情绪拉扯，你会比平时更容易烦躁、敏感、想逃避。这不是你变差了，而是外部环境降低了你的恢复速度。对你来说，天气、外部节奏和社交密度会影响内在能量：当环境嘈杂、信息太多，你会更想退回自己的空间；当环境稳定、边界清楚，你的判断力和行动力会明显回来。接下来几天，不要把所有不舒服都归因于自己，也要看见环境正在消耗你。`;

  const masterPrompt =
    "如果你还有一个放不下的问题：这份档案能帮你看见自己的模式，但真正困住人的，往往是某一段关系、某一个选择、某一个反复出现的问题。如果你想继续追问“他到底怎么想”“我该不该继续”“这份工作要不要换”“为什么我总是被同一种人影响”，就适合把具体问题交给 AI 大师继续拆解；如果这个问题牵涉多年关系、家庭选择或重要转折，也可以在 App 里找真人大师做一对一分析。";

  const sevenDayAdvice = {
    today: ["少解释一件事，把精力留给真正愿意理解你的人。", "少迎合一个人，先确认自己是不是也愿意。", "做一件能完成的小事，用完成感把自己带回现实。"],
    threeDays: ["记录让你反复内耗的人和事，看清楚消耗从哪里开始。", "减少无效沟通，不在情绪最满的时候反复解释。", "恢复睡眠和饮食节奏，先让身体有一点稳定感。"],
    sevenDays: ["做一次关系边界整理，分清谁值得靠近，谁只是在消耗你。", `明确一个和“${form.mainConcern}”有关的近期目标，拆成可以执行的小步骤。`, "找一个真正能支持你的人聊一次，不需要完美表达，只需要真实一点。"],
  };

  const intro = "结合基础资料、当前状态、关系模式、外部环境与气场反应，生成你的个人气场解析。这不是简单标签，而是关于“你为什么会这样”的分析。";
  const immersiveDetails = getImmersiveProfileDetails(form);
  const enhancedFixedAura = `${fixedAura}${immersiveDetails.fixedAura}`;
  const enhancedCurrentState = `${currentState}${immersiveDetails.currentState}`;
  const enhancedPsychology = `${psychology}${immersiveDetails.psychology}`;
  const enhancedRelationshipPattern = `${relationshipPattern}${immersiveDetails.relationshipPattern}`;
  const enhancedEmotionActionPattern = `${emotionActionPattern}${immersiveDetails.emotionActionPattern}`;
  const enhancedEnvironmentImpact = `${environmentImpact}${immersiveDetails.environmentImpact}`;
  const enhancedMasterPrompt = `${masterPrompt}${immersiveDetails.masterPrompt}`;
  const innateAura = `天生固有气场，会呈现出一组相对稳定的固定命盘倾向，说明你更容易用哪种方式感受世界、回应关系、启动行动。${enhancedFixedAura}`;
  const manifestAura = getTodayManifestAura(todayContext);
  const acquiredAura = `后天形成气场，是最近状态、关系牵引、现实压力和外部环境共同叠加出来的流动状态。它会随着休息、选择、关系回应和节奏调整而变化。${enhancedCurrentState}${manifestAura}`;

  const sections: FullProfileSection[] = [
    { title: "一、天生固有气场：你的固定命盘倾向", content: innateAura, highlight: "敏感不是缺点，它让你更会照顾人，也更容易察觉问题。" },
    { title: "二、后天形成气场：你最近为什么会这样", content: acquiredAura, highlight: "这不是能力问题，而是内在能量分配问题。" },
    { title: "三、从气场流向看，你为什么会反复这样", content: enhancedPsychology, highlight: "你不是软弱，而是太习惯替关系和结果负责。" },
    { title: "四、你的关系模式：为什么你容易在关系里累", content: enhancedRelationshipPattern, highlight: "你真正需要的是稳定、明确、可感知的回应。" },
    { title: "五、你的情绪和行动节奏", content: enhancedEmotionActionPattern, highlight: "你的行动力来自内在确认感，而不是外界催促。" },
    { title: "六、环境正在怎样影响你", content: enhancedEnvironmentImpact, highlight: "环境不会决定你，但会影响你的恢复速度。" },
    { title: "七、接下来 7 天，你应该怎么顺势调整", content: "今天开始、3 天内、7 天内分三层调整：先降消耗，再恢复节奏，最后整理关系和目标。", highlight: "不要急着翻盘，先把自己从内耗里慢慢带回来。" },
    { title: "如果你还有一个放不下的问题", content: enhancedMasterPrompt, highlight: "具体的人、选择和反复出现的问题，适合继续问大师。" },
  ];

  return sanitizeFullProfileResult({
    title: "你的完整人生档案",
    subtitle: "结合基础资料、当前状态、关系模式、外部环境与气场反应，生成你的个人气场解析。",
    intro,
    fixedAura: innateAura,
    currentState: acquiredAura,
    psychology: enhancedPsychology,
    relationshipPattern: enhancedRelationshipPattern,
    emotionActionPattern: enhancedEmotionActionPattern,
    environmentImpact: enhancedEnvironmentImpact,
    sevenDayAdvice,
    masterPrompt: enhancedMasterPrompt,
    sections,
    personality: innateAura,
    emotionTrajectory: acquiredAura,
    advice: sevenDayAdvice.sevenDays.join(""),
    mainConcern: form.mainConcern,
    generatedAt: new Date().toISOString(),
  });
}
