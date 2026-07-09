export const AURA_TODAY_TEST_ANSWERS_KEY = "auraTodayTestAnswers";
export const AURA_TODAY_TEST_RESULT_KEY = "auraTodayTestResult";
export const AURA_TODAY_TEST_DATE_KEY = "auraTodayTestDate";

export type TestOptionKey = "A" | "B" | "C" | "D";
export type StatusDimension = "recovery" | "relationship" | "action" | "flow";

export type TodayStatusQuestion = {
  id: number;
  title: string;
  options: Array<{
    key: TestOptionKey;
    text: string;
    dimension: StatusDimension;
  }>;
};

export type TodayStatusType = {
  id: string;
  name: string;
  icon: string;
  resultTitle: string;
  shortDesc: string;
  traits: string[];
  deepAnalysis: string;
  influences: string[];
  suitable: string[];
  avoid: string[];
  quote: string;
  funComment: string;
  appReason: string;
};

export type TodayTestProfile = {
  energyPattern: string;
  relationshipPattern: string;
  pressurePattern: string;
  actionPattern: string;
  innerTrigger: string;
  answerPattern: string;
};

export type TodayStatusResult = {
  status: TodayStatusType;
  scores: Record<StatusDimension, number>;
  primaryDimension: StatusDimension;
  secondaryDimension: StatusDimension;
  answerKeys: TestOptionKey[];
  testProfile: TodayTestProfile;
  completedAt: string;
};

const dimensionByOption: Record<TestOptionKey, StatusDimension> = {
  A: "recovery",
  B: "relationship",
  C: "action",
  D: "flow",
};

export const todayStatusQuestions: TodayStatusQuestion[] = [
  {
    id: 1,
    title: "今天最像哪一句？",
    options: [
      { key: "A", text: "感觉一直很累", dimension: "recovery" },
      { key: "B", text: "心里有很多话，但不想说", dimension: "relationship" },
      { key: "C", text: "想做很多事，却不知道先做什么", dimension: "action" },
      { key: "D", text: "状态还不错，想顺着感觉走", dimension: "flow" },
    ],
  },
  {
    id: 2,
    title: "今天最容易让你烦的是？",
    options: [
      { key: "A", text: "别人误会你", dimension: "recovery" },
      { key: "B", text: "没有人回应你", dimension: "relationship" },
      { key: "C", text: "事情太多压着你", dimension: "action" },
      { key: "D", text: "自己想太多停不下来", dimension: "flow" },
    ],
  },
  {
    id: 3,
    title: "如果今天突然收到一句“我们聊聊”，你的第一反应是？",
    options: [
      { key: "A", text: "是不是我哪里做错了", dimension: "recovery" },
      { key: "B", text: "先看看对方想说什么", dimension: "relationship" },
      { key: "C", text: "有点紧张，但会装作没事", dimension: "action" },
      { key: "D", text: "没什么感觉，顺其自然", dimension: "flow" },
    ],
  },
  {
    id: 4,
    title: "今天你最希望有人对你说？",
    options: [
      { key: "A", text: "辛苦了", dimension: "recovery" },
      { key: "B", text: "我懂你", dimension: "relationship" },
      { key: "C", text: "你已经很好了", dimension: "action" },
      { key: "D", text: "慢一点也没关系", dimension: "flow" },
    ],
  },
  {
    id: 5,
    title: "今天面对压力，你更像？",
    options: [
      { key: "A", text: "先扛着，等没人时再崩一下", dimension: "recovery" },
      { key: "B", text: "想找人说，但又怕打扰别人", dimension: "relationship" },
      { key: "C", text: "想立刻解决，不想拖着", dimension: "action" },
      { key: "D", text: "先放一放，等状态回来再说", dimension: "flow" },
    ],
  },
  {
    id: 6,
    title: "今天如果计划被打乱，你会？",
    options: [
      { key: "A", text: "表面接受，心里不舒服", dimension: "recovery" },
      { key: "B", text: "反复想是不是自己哪里没做好", dimension: "relationship" },
      { key: "C", text: "重新安排，但会有点急", dimension: "action" },
      { key: "D", text: "干脆换个节奏走", dimension: "flow" },
    ],
  },
  {
    id: 7,
    title: "今天你最想逃离什么？",
    options: [
      { key: "A", text: "被期待", dimension: "recovery" },
      { key: "B", text: "被忽视", dimension: "relationship" },
      { key: "C", text: "被催促", dimension: "action" },
      { key: "D", text: "被安排", dimension: "flow" },
    ],
  },
  {
    id: 8,
    title: "今天你最需要的能量是？",
    options: [
      { key: "A", text: "安静", dimension: "recovery" },
      { key: "B", text: "被理解", dimension: "relationship" },
      { key: "C", text: "行动力", dimension: "action" },
      { key: "D", text: "自由感", dimension: "flow" },
    ],
  },
  {
    id: 9,
    title: "如果把今天比作一种天气，你觉得更像？",
    options: [
      { key: "A", text: "雾天", dimension: "recovery" },
      { key: "B", text: "小雨", dimension: "relationship" },
      { key: "C", text: "有风", dimension: "action" },
      { key: "D", text: "晴间多云", dimension: "flow" },
    ],
  },
  {
    id: 10,
    title: "今天你最想守住什么？",
    options: [
      { key: "A", text: "自己的情绪", dimension: "recovery" },
      { key: "B", text: "一段关系", dimension: "relationship" },
      { key: "C", text: "一个目标", dimension: "action" },
      { key: "D", text: "一点自由", dimension: "flow" },
    ],
  },
];

const names = [
  "月光恢复期",
  "微光积蓄期",
  "情绪整理期",
  "关系敏感期",
  "低耗保护期",
  "边界修复期",
  "行动蓄力期",
  "心流连接期",
  "表达欲上升期",
  "思考过载期",
  "自我怀疑期",
  "静默观察期",
  "柔软防御期",
  "能量外放期",
  "慢恢复期",
  "安全感缺口期",
  "回应需求期",
  "节奏重建期",
  "轻松流动期",
  "内在拉扯期",
  "压力转化期",
  "关系降噪期",
  "自我确认期",
  "情绪降温期",
  "计划重排期",
  "温柔清醒期",
  "独处回血期",
  "社交试探期",
  "目标校准期",
  "心绪松绑期",
];

const traitSets = [
  [
    "你正在努力把自己从消耗里领出来，所以今天不适合再用硬撑证明自己没事。",
    "你对外界期待比平时更敏感，别人一句普通的话也可能牵动你的情绪反应。",
    "你需要先恢复一点安全感，才会重新相信自己可以慢慢把事情处理好。",
  ],
  [
    "你很容易先照顾别人的感受，所以常常把自己的委屈和疲惫往后放。",
    "你对回应比平时更敏感，不是因为矫情，而是你真的很在意关系里的确定感。",
    "你正在努力保持体面，但内在其实有点累，需要被理解而不是被催着振作。",
  ],
  [
    "你有想推进的事，也有被压力追着走的感觉，所以越想做好越容易乱了节奏。",
    "你需要重新确认优先级，把今天最重要的一件事从一堆声音里拎出来。",
    "你适合把目标拆小，因为完成感会比空想和自责更快帮你找回控制感。",
  ],
  [
    "你比想象中更需要自由呼吸，不想再被安排、被定义或被别人的节奏推着走。",
    "你适合顺势调整节奏，给自己一点选择权，而不是把所有事都变成必须。",
    "你正在找回自己的轻盈感，那不是逃避，而是在给心理能量重新留出空间。",
  ],
];

const defaultInfluences = [
  "你会比平时更在意别人说话的语气和回应速度。",
  "你会想把事情做好，但身体和情绪都在提醒你别太急。",
  "你容易在独处时反复复盘白天发生的小细节。",
  "你会更需要一个不用解释太多也能安静待着的空间。",
];

const defaultSuitable = ["做一件低难度但能完成的小事", "把最消耗你的沟通往后放", "给自己一个不解释的空间"];
const defaultAvoid = ["立刻做情绪化决定", "为了证明自己而硬撑", "和不理解你的人反复解释"];

const deepStatusOverrides: Record<string, Partial<TodayStatusType>> = {
  关系敏感期: {
    resultTitle: "习惯照顾别人，却忘了照顾自己",
    shortDesc: "你今天对关系里的语气、回应和距离格外敏感，真正需要的是被认真理解。",
    traits: [
      "你很容易先考虑别人的感受，所以经常把自己的委屈和失落往后放。",
      "你不是不想表达，只是太清楚表达之后可能还要解释更多，反而更累。",
      "你现在最缺的不是道理，而是一种确定感：有人愿意认真接住你的情绪。",
    ],
    deepAnalysis:
      "你最近的状态，更像是长期关系压力下形成的一种敏感反应。你并不是小题大做，而是心理能量被反复消耗后，大脑会自动去捕捉语气、表情和回应速度，试图提前判断关系是否安全。高责任感和过度共情会让你习惯先理解别人，却把自己的需要放到最后。久了以后，自我价值感就容易和外界回应绑在一起：对方冷一点，你就怀疑是不是自己不够好。今天适合先把注意力从“他怎么想”拉回“我真实感觉是什么”，给自己一点边界感。",
    influences: [
      "你会更容易把别人的语气理解成否定或疏远。",
      "你会在关系里变得小心，明明在意，却装作没事。",
      "你可能会反复回想某句话，想确认自己有没有被忽视。",
      "你会更渴望被主动回应，而不是一直靠猜来维持安心。",
    ],
    quote: "你不是越来越敏感，你只是太久没有在关系里安心地做自己。",
    funComment: "今天的你像开了关系雷达，信号很强，但也记得给自己关一会儿静音。",
  },
  低耗保护期: {
    resultTitle: "表面平静，内心其实很累",
    shortDesc: "你今天不是没有能力处理事情，而是心理能量正在提醒你先降耗。",
    traits: [
      "你看起来还能正常应付，但内在已经不太想再接收新的压力和要求。",
      "你不是懒，也不是逃避，只是身体和情绪都在要求进入低消耗模式。",
      "你现在最需要的是减少解释、减少证明，把力气留给真正重要的事。",
    ],
    deepAnalysis:
      "低耗保护期通常不是突然出现的，它更像情绪耗竭后的自我保护。你可能已经连续一段时间承担了太多期待：工作要稳、关系要顾、家里要照应，连自己的脆弱都要安排在没人看见的时候。大脑为了避免继续过载，会自动降低行动欲和表达欲，让你变得不想说、不想争、也不想解释。这不是你变差了，而是心理能量在提醒你需要恢复。今天最重要的不是逼自己恢复高效率，而是把消耗源降下来，允许自己用更小的步伐前进。",
    influences: [
      "你会对临时任务和突然沟通更容易烦躁。",
      "你会想独处，不是讨厌别人，而是不想继续被消耗。",
      "你可能对很多事失去兴致，只想把自己安静放一会儿。",
      "你会更抗拒被催促，因为那会让你觉得连恢复都不被允许。",
    ],
    quote: "你不是没用力，你只是已经用力太久了。",
    funComment: "今天的你适合开启省电模式，能不强撑的地方就别偷偷加班内耗。",
  },
  情绪整理期: {
    resultTitle: "有很多感受，正在慢慢理清",
    shortDesc: "你今天的情绪不是混乱，而是很多被压下去的感受开始浮上来。",
    traits: [
      "你心里有一些话没有说完，所以情绪会在安静时自己冒出来。",
      "你不是想太多，而是在把最近积累的委屈、压力和期待重新分类。",
      "你需要一个能慢慢表达的空间，不必马上给每种感受下结论。",
    ],
    deepAnalysis:
      "情绪整理期常发生在你撑过一段压力之后。人在忙着解决问题时，会把很多感受先放到一边，等环境稍微安静下来，那些没被处理的委屈、担心和不甘就会重新出现。它们不是来拖累你的，而是在提醒你：有些需要已经被忽略太久。这个阶段如果急着压下去，反而容易变成内耗；如果能用写下来、说清楚、慢一点回应的方式整理，你会更容易找回控制感。今天不需要把自己解释得很完整，只要先承认“我确实有点累、有点乱”，就已经是在恢复。",
    influences: [
      "你会在某个瞬间突然想起旧事，情绪跟着被带动。",
      "你会更想把话说清楚，但又担心说出来会变得更复杂。",
      "你可能会对自己的反应不满意，觉得不该这么容易受影响。",
      "你会需要更多安静时间，来分辨哪些是事实，哪些只是压力放大了感受。",
    ],
    quote: "情绪不是来打败你的，它只是提醒你有些地方需要被看见。",
    funComment: "今天的大脑像开了多标签页，别急着全关，先保存最重要的那一个。",
  },
  安全感缺口期: {
    resultTitle: "很想安心，却总忍不住确认",
    shortDesc: "你今天更需要稳定、回应和确定感，因为心里有一块地方正在缺安全感。",
    traits: [
      "你会比平时更想确认对方的态度，哪怕表面上装得很淡定。",
      "你不是非要别人围着你转，只是需要知道自己没有被随便放下。",
      "你现在容易把沉默理解成冷淡，把距离理解成不被在乎。",
    ],
    deepAnalysis:
      "安全感缺口期并不代表你脆弱，它更像是在关系和压力叠加时，内在防御模式被启动了。当一个人长期靠自己扛事，又缺少稳定回应时，大脑会变得很擅长寻找风险：消息慢了、语气淡了、计划变了，都会被解读成“是不是我不重要”。这其实和自我价值感、关系经验以及控制感缺失有关。你想确认的不是一件小事，而是自己在别人心里的位置。今天适合把确认感先还给自己：我可以在意，但不必用反复试探来证明我值得被爱。",
    influences: [
      "你会更容易因为消息迟迟不回而心里发紧。",
      "你会想靠猜测判断关系状态，却越猜越不安。",
      "你可能会压着需求不说，最后变成突然爆发或冷下来。",
      "你会更需要稳定的小承诺，让自己重新落回现实。",
    ],
    quote: "真正的安全感，不是永远没人离开，而是你知道自己不会被自己丢下。",
    funComment: "今天的你像反复刷新页面的人，其实想看的不是消息，是一句“你很重要”。",
  },
  回应需求期: {
    resultTitle: "很想被懂，却又怕显得麻烦",
    shortDesc: "你今天很在意回应，因为你需要的不只是答案，而是被认真对待的感觉。",
    traits: [
      "你想被看见，但又担心自己的需要会给别人造成负担。",
      "你会在关系里反复权衡：要不要说、该怎么说、说了会不会被嫌烦。",
      "你真正渴望的不是热闹，而是有人能准确理解你没说出口的部分。",
    ],
    deepAnalysis:
      "回应需求期通常出现在你长期习惯自己消化情绪之后。你可能很会体谅别人，也很少直接索取，于是当你真的需要回应时，反而会先怀疑自己是不是太敏感、太麻烦。这种类似讨好型反应的状态，会让你把别人的方便放在自己的感受前面。可是关系里的回应并不是奢侈品，它是让人确认连接还在的基本信号。今天你需要练习更温和地表达需求，不必把话包装得完美，也不必等到崩溃才允许自己被理解。清楚说出一句“我现在需要你回应我”，就已经是边界感的开始。",
    influences: [
      "你会更关注别人有没有主动问你、记得你、回应你。",
      "你会在想表达时又退回去，担心自己显得太需要。",
      "你可能会把失望藏起来，最后变成冷淡或疏离。",
      "你会更容易被一句及时的理解安抚，也更容易被沉默刺痛。",
    ],
    quote: "你需要回应，不是因为你不独立，而是因为你也值得被认真对待。",
    funComment: "今天的你不是要满屏消息，只是想收到一条真正读懂你的回复。",
  },
  边界修复期: {
    resultTitle: "终于想把自己放回重要位置",
    shortDesc: "你今天开始意识到，有些关系和责任不能再无限透支你。",
    traits: [
      "你正在分辨哪些事真的属于你，哪些只是别人习惯性丢给你的期待。",
      "你不是突然冷漠，而是终于发现自己也需要被尊重、被照顾。",
      "你会想减少无效解释，因为你不想再为了让别人舒服而委屈自己。",
    ],
    deepAnalysis:
      "边界修复期往往发生在你忍了很久之后。以前你可能习惯把“懂事”当成安全策略：多承担一点、多退让一点、少表达一点，关系好像就能少一些冲突。但长期这样做，心理能量会被慢慢掏空，甚至让你分不清自己到底想要什么。边界感不是对别人不好，而是让关系回到更健康的位置。今天你会对被安排、被要求、被情绪绑架更敏感，这是防御模式在提醒你：你不能一直靠牺牲自己维持平衡。温和但坚定地说“不”，也是一种自我照顾。",
    influences: [
      "你会更容易对别人理所当然的要求感到不舒服。",
      "你会开始审视某些关系是不是一直由你单方面承担。",
      "你可能会因为拒绝别人而内疚，但内心又知道自己需要这样做。",
      "你会更想保留自己的时间、情绪和选择权。",
    ],
    quote: "你可以温柔，但不必把自己让到没有位置。",
    funComment: "今天的你适合给人生装个门铃：不是谁想进来都能直接推门。",
  },
  自我怀疑期: {
    resultTitle: "想变好，却总先怀疑自己",
    shortDesc: "你今天容易把问题归到自己身上，但这不代表你真的不够好。",
    traits: [
      "你会下意识复盘自己哪里没做好，甚至把别人的反应也算进自己的责任里。",
      "你不是没有能力，而是最近的压力削弱了你对自己的确认感。",
      "你需要重新看见已经做成的部分，而不是只盯着还没做到的地方。",
    ],
    deepAnalysis:
      "自我怀疑期常常和长期压力、外界评价以及控制感缺失有关。当你一直努力却没有得到稳定反馈时，大脑会试图通过“是不是我不够好”来解释不确定，因为责怪自己看起来比承认环境复杂更容易掌控。可这种解释会不断消耗自我价值感，让你越想证明自己，越觉得还不够。今天的你需要把事实和评价分开：一件事没做好，不等于你这个人不好；别人不理解，也不等于你的感受不成立。真正的调整不是立刻变强，而是先停止用最苛刻的方式审判自己。",
    influences: [
      "你会更容易把别人的否定当成对整个人的评价。",
      "你会反复检查自己的选择，担心一步错就全盘否定。",
      "你可能明明很努力，却还是觉得自己不够好。",
      "你会更需要具体的小成果，来重新建立对自己的信任。",
    ],
    quote: "你不是不够好，你只是太习惯用别人的标准检查自己。",
    funComment: "今天请把内心评委席撤掉一半，你已经不是来参加无尽答辩的。",
  },
  行动蓄力期: {
    resultTitle: "想把日子推进，但需要先找准发力点",
    shortDesc: "你今天有想变好的愿望，只是行动前需要更清楚的节奏和优先级。",
    traits: [
      "你心里有目标，也有压力，所以越想快点做好，越容易不知道从哪里开始。",
      "你不是没有行动力，而是同时背着太多期待，导致心理能量被分散。",
      "你今天适合先抓住一个最小突破口，用完成感带回控制感。",
    ],
    deepAnalysis:
      "行动蓄力期不是停滞，而是行动系统正在重新校准。你可能最近一直想把工作、生活或关系处理得更好，但任务一多、评价一多，控制感就会被削弱。人在这种状态下容易出现两种反应：要么逼自己立刻高效，要么因为压力太满而迟迟不动。其实你需要的不是更狠地催自己，而是把目标拆到足够具体，让大脑重新相信“我能完成”。今天适合减少宏大计划，选择一个能在短时间内结束的小行动。它会像一个支点，把你从内耗里慢慢带出来。",
    influences: [
      "你会想推进很多事，却容易被优先级拖住。",
      "你会因为担心结果不够好，而迟迟不敢真正开始。",
      "你可能会对自己要求变高，休息时也觉得有负担。",
      "你会更需要清晰步骤，而不是更多抽象鼓励。",
    ],
    quote: "你不需要一下子翻盘，今天先把一个小动作做完就很好。",
    funComment: "今天的你像正在加载进度条，别狂点刷新，先让第一格跑起来。",
  },
};

function ensureDeepAnalysisLength(text: string) {
  if (text.length >= 250) return text;

  return `${text}这不是性格缺陷，也不是你不够成熟，而是身心在提醒你：过去那套一直忍、一直扛、一直理解别人的方式，今天需要被重新调整。先把自己放回感受的中心，再决定要不要回应外界，会比急着证明自己更有力量。`;
}

function makeStatus(name: string, index: number): TodayStatusType {
  const set = traitSets[index % traitSets.length];
  const icon = ["☾", "✦", "◇", "○"][index % 4];
  const base: TodayStatusType = {
    id: `status-${index + 1}`,
    name,
    icon,
    resultTitle: "在压力里重新寻找自己节奏",
    shortDesc: `${name}的你，需要先看见当下真实的反应，再决定今天怎么用力。`,
    traits: set,
    deepAnalysis:
      `今天的你并不是简单的好或不好，而是在情绪、关系和行动之间寻找一个更舒服的位置。${name}说明你对外界变化有反应，也在试着保护自己的节奏。这更像长期压力下形成的反应模式：当心理能量不足时，人会更在意回应、更想找回控制感，也更容易进入内耗。你不需要急着证明状态正常，可以先承认此刻的需要，把注意力放回最值得处理的一两件事上。给自己一点边界感和恢复空间，反而会让今天更稳。`,
    influences: defaultInfluences,
    suitable: defaultSuitable,
    avoid: defaultAvoid,
    quote: "你不用马上变得很强，先把自己慢慢带回身边。",
    funComment: `今天的你像手机低电量但还开着省电模式，不是不能战斗，是要聪明分配电量。`,
    appReason: `建立完整人生档案后，我才能判断你为什么总会进入${name}，以及它和你的固定人格、关系模式、长期情绪轨迹有什么关联。`,
  };

  const status = {
    ...base,
    ...deepStatusOverrides[name],
  };

  return {
    ...status,
    deepAnalysis: ensureDeepAnalysisLength(status.deepAnalysis),
  };
}

export const todayStatusTypes: TodayStatusType[] = names.map(makeStatus);

const statusPools: Record<string, string[]> = {
  "recovery-relationship": ["低耗保护期", "安全感缺口期", "柔软防御期"],
  "recovery-action": ["月光恢复期", "微光积蓄期", "节奏重建期"],
  "recovery-flow": ["慢恢复期", "独处回血期", "心绪松绑期"],
  "relationship-recovery": ["关系敏感期", "回应需求期", "边界修复期"],
  "relationship-action": ["回应需求期", "社交试探期", "表达欲上升期"],
  "relationship-flow": ["心流连接期", "关系降噪期", "轻松流动期"],
  "action-recovery": ["行动蓄力期", "压力转化期", "节奏重建期"],
  "action-relationship": ["目标校准期", "自我确认期", "社交试探期"],
  "action-flow": ["计划重排期", "能量外放期", "压力转化期"],
  "flow-recovery": ["温柔清醒期", "心绪松绑期", "慢恢复期"],
  "flow-relationship": ["心流连接期", "轻松流动期", "关系降噪期"],
  "flow-action": ["计划重排期", "目标校准期", "能量外放期"],
};

function getRankedDimensions(scores: Record<StatusDimension, number>) {
  const order: StatusDimension[] = ["recovery", "relationship", "action", "flow"];
  return [...order].sort((left, right) => scores[right] - scores[left] || order.indexOf(left) - order.indexOf(right));
}

function uniqueStatusNames(statusNames: string[]) {
  return Array.from(new Set(statusNames));
}

function getAnswerFingerprint(answerKeys: TestOptionKey[]) {
  const optionWeights: Record<TestOptionKey, number> = {
    A: 1,
    B: 3,
    C: 5,
    D: 7,
  };

  return answerKeys.reduce((total, key, index) => total + optionWeights[key] * (index + 1), 0);
}

function getCandidateStatusNames(
  scores: Record<StatusDimension, number>,
  primaryDimension: StatusDimension,
  secondaryDimension: StatusDimension,
) {
  const basePool = statusPools[`${primaryDimension}-${secondaryDimension}`] ?? names;
  const rankedDimensions = getRankedDimensions(scores);
  const expandedPool = [...basePool];

  rankedDimensions.forEach((dimension) => {
    if (dimension === primaryDimension || scores[primaryDimension] - scores[dimension] > 1) return;

    const mixedPool = statusPools[`${primaryDimension}-${dimension}`];
    if (mixedPool) expandedPool.push(...mixedPool);
  });

  return uniqueStatusNames(expandedPool);
}

const profileLabels = {
  energy: {
    A: "低能恢复型：当前更需要安静回血，身体和情绪都在提醒你先降消耗",
    B: "情绪压住型：心里有话但暂时不想摊开，更需要被温和理解",
    C: "行动卡顿型：想推进很多事，但需要先找到最小发力点",
    D: "轻盈顺势型：状态有流动感，适合保留选择权和自由节奏",
  },
  relationship: {
    A: "自责预警型：关系一有波动，你容易先检查自己是不是哪里没做好",
    B: "回应确认型：你更在意对方有没有认真回应你、理解你",
    C: "体面防御型：紧张时会装作没事，但内在其实需要被安抚",
    D: "顺其自然型：你更愿意先观察，不急着把关系下结论",
  },
  pressure: {
    A: "硬撑消化型：压力来时会先扛住，等独处时才释放真实感受",
    B: "求助犹豫型：想找人说，又担心打扰别人或显得麻烦",
    C: "解决导向型：压力越来，你越想立刻处理、重新掌控局面",
    D: "延后恢复型：你需要先把状态放回来，再决定怎么处理压力",
  },
  action: {
    A: "期待承压型：你最想逃离被期待，行动容易被责任感牵住",
    B: "理解补能型：你需要被理解，一旦有人接住你，行动感会回来",
    C: "目标推进型：你需要行动力和明确目标，越清晰越能推进",
    D: "自由调频型：你需要自由感，太多安排会削弱你的内在能量",
  },
  trigger: {
    A: "情绪守护型：今天最容易被自身情绪波动牵动，需要先守住内在稳定",
    B: "关系牵引型：今天最容易被一段关系牵动，回应和距离会影响你",
    C: "目标牵引型：今天最容易被目标结果牵动，成败感会影响你",
    D: "自由牵引型：今天最容易被自由空间牵动，不想被过度安排",
  },
} satisfies Record<string, Record<TestOptionKey, string>>;

function summarizePair(
  answerKeys: TestOptionKey[],
  startIndex: number,
  labels: Record<TestOptionKey, string>,
) {
  const first = answerKeys[startIndex];
  const second = answerKeys[startIndex + 1];

  if (!first || !second) return "";
  if (first === second) return labels[first];

  return `${labels[first]}；同时带有「${labels[second]}」的次级牵引`;
}

function buildTodayTestProfile(answerKeys: TestOptionKey[]): TodayTestProfile {
  return {
    energyPattern: summarizePair(answerKeys, 0, profileLabels.energy),
    relationshipPattern: summarizePair(answerKeys, 2, profileLabels.relationship),
    pressurePattern: summarizePair(answerKeys, 4, profileLabels.pressure),
    actionPattern: summarizePair(answerKeys, 6, profileLabels.action),
    innerTrigger: summarizePair(answerKeys, 8, profileLabels.trigger),
    answerPattern: answerKeys.join(""),
  };
}

export function calculateTodayStatusResult(answerKeys: TestOptionKey[]): TodayStatusResult {
  const scores: Record<StatusDimension, number> = {
    recovery: 0,
    relationship: 0,
    action: 0,
    flow: 0,
  };

  answerKeys.forEach((key) => {
    scores[dimensionByOption[key]] += 1;
  });

  const [primaryDimension, secondaryDimension] = getRankedDimensions(scores);
  const pool = getCandidateStatusNames(scores, primaryDimension, secondaryDimension);
  const statusName = pool[getAnswerFingerprint(answerKeys) % pool.length];
  const status = todayStatusTypes.find((item) => item.name === statusName) ?? todayStatusTypes[0];

  return {
    status,
    scores,
    primaryDimension,
    secondaryDimension,
    answerKeys,
    testProfile: buildTodayTestProfile(answerKeys),
    completedAt: new Date().toISOString(),
  };
}
