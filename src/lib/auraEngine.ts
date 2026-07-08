import {
  concernAdvice,
  funCommentTemplates,
  overviewTemplates,
  statusTags,
  todayQuestions,
  type ConcernOption,
  type TodayGuide,
  type TodaySelection,
} from "./auraMock";

type StatusKey = keyof typeof statusTags;

function getStatusKey(selection: TodaySelection): StatusKey {
  if (selection.mood === "很焦虑") {
    return "emotionSorting";
  }

  if (selection.sleep === "很差") {
    return "recovery";
  }

  if (selection.mood === "状态不错" && ["感情", "人际", "穿搭"].includes(selection.concern)) {
    return "lightSocial";
  }

  if (selection.concern === "工作" || selection.concern === "财运") {
    return "actionCharging";
  }

  return selection.mood === "有点烦" ? "emotionSorting" : "recovery";
}

function getWeatherTone(weather: TodaySelection["weather"]) {
  const tones = {
    晴天: "外部环境比较明亮，适合让自己稍微走出去一点",
    阴天: "天气本身偏钝，情绪也容易被拖慢半拍",
    下雨: "雨天会放大敏感度，适合把安排做得更柔软",
    很热: "炎热容易让耐心变薄，今天更需要给自己降噪",
    很冷: "寒冷会让人更想收回能量，慢一点反而更稳",
  };

  return tones[weather];
}

function getSleepTone(sleep: TodaySelection["sleep"]) {
  const tones = {
    很好: "睡眠给了你不错的底气",
    一般: "睡眠不算满格，但还能支撑你稳稳推进",
    很差: "睡眠已经在提醒你：今天别把自己当满电模式使用",
  };

  return tones[sleep];
}

function getMoodTone(mood: TodaySelection["mood"]) {
  const tones = {
    平静: "你的情绪底色比较平，适合做清晰但不费力的决定",
    有点烦: "心里有点毛边，越急着解决越容易被小事点燃",
    很焦虑: "焦虑感偏强，说明你现在最需要的是先稳住身体和节奏",
    状态不错: "状态是亮的，但也别把好状态一次性透支完",
  };

  return tones[mood];
}

function getFunComment(concern: ConcernOption) {
  if (concern === "工作") return funCommentTemplates.work;
  if (concern === "感情") return funCommentTemplates.love;
  if (concern === "财运") return funCommentTemplates.money;
  if (concern === "穿搭") return funCommentTemplates.outfit;
  return funCommentTemplates.default;
}

function getEventInsight(eventText: string) {
  if (eventText.includes("老板") || eventText.includes("批评") || eventText.includes("领导")) {
    return {
      label: "被批评",
      title: "我看到你今天最在意的是",
      content: "你今天最在意的，不只是被批评，而是自己的努力有没有被看见。",
      overview:
        "今天不适合急着证明自己。先把节奏稳住，再处理外界反馈，你会更容易重新拿回判断力。",
      why: "而“被批评”这件事会让你更在意自己的价值有没有被看见",
    };
  }

  if (eventText.includes("男朋友") || eventText.includes("女朋友") || eventText.includes("吵架") || eventText.includes("对象")) {
    return {
      label: "关系冲突",
      title: "我看到你今天最在意的是",
      content: "你今天最在意的，不只是吵架本身，而是对方有没有真正理解你的感受。",
      overview:
        "今天不适合马上把关系推向输赢。先确认自己的感受，再决定要不要继续沟通，会比急着解释更稳。",
      why: "而这次关系冲突会让你更在意对方有没有真正理解你的感受",
    };
  }

  if (eventText.includes("提不起精神") || eventText.includes("没精神") || eventText.includes("没动力") || eventText.includes("很累")) {
    return {
      label: "低能量",
      title: "我看到你今天最在意的是",
      content: "你今天最在意的，不只是没动力，而是明明想变好，却暂时找不到发力点。",
      overview:
        "今天不适合强行把自己拽起来。先降低任务颗粒度，找到一个能开始的小动作，比硬撑更有效。",
      why: "而低能量这件事会让你更在意自己为什么暂时找不到发力点",
    };
  }

  if (eventText.includes("客户") || eventText.includes("面试") || eventText.includes("见") || eventText.includes("重要")) {
    return {
      label: "重要场合",
      title: "我看到你今天最在意的是",
      content: "你今天最在意的，不只是事情能不能顺利，而是自己能不能被认可、被认真对待。",
      overview:
        "今天适合把准备做得具体一点。把注意力放回可控细节，会比反复预演结果更有气场。",
      why: "而这个重要场合会让你更在意自己能不能被认可、被认真对待",
    };
  }

  return {
    label: "这件事",
    title: "我看到你今天最在意的是",
    content: "你今天最在意的，不只是事情本身，而是它触动了你心里某个很想被理解的位置。",
    overview:
      "今天不必急着给这件事下结论。先稳住身体和节奏，再看它真正触动了你哪里。",
    why: "而这件事会让你更在意自己内心那个想被理解的位置",
  };
}

export function generateTodayGuide(selection: TodaySelection, todayEventText = ""): TodayGuide {
  const statusKey = getStatusKey(selection);
  const advice = concernAdvice[selection.concern];
  const status = statusTags[statusKey];
  const eventText = todayEventText.trim();
  const eventInsight = eventText ? getEventInsight(eventText) : null;
  const why = eventInsight
    ? `${getSleepTone(selection.sleep)}；${getMoodTone(selection.mood)}。${getWeatherTone(selection.weather)}，${eventInsight.why}。今天更适合先稳定节奏，再处理${selection.concern}相关的反馈。${advice.detail}`
    : `${getSleepTone(selection.sleep)}；${getMoodTone(selection.mood)}。你今天最在意的是${selection.concern}，所以真正要顺的不是外界节奏，而是你自己的承受力。${getWeatherTone(selection.weather)}。${advice.detail}`;

  return {
    status,
    overview: eventInsight ? `${eventInsight.overview}${overviewTemplates[statusKey]}` : overviewTemplates[statusKey],
    why,
    eventInsight: eventInsight
      ? {
          title: eventInsight.title,
          content: eventInsight.content,
        }
      : undefined,
    doList: advice.doList,
    avoidList: advice.avoidList,
    funComment: getFunComment(selection.concern),
    questionAnswers: todayQuestions,
  };
}
