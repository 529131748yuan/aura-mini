export const moreTodayQuestionsSubtitle = "今日问题已全部解锁，点开看看更细的提醒。";

export const profileAppDownloadMessage =
  '今天，我是在分析"和你相似的人"。\n\n建立人生档案后，我才能真正分析"你"。';

export function getTodayQuestionAccess(_index: number) {
  return {
    locked: false,
  };
}

type CategorizedStory = {
  category: string;
};

export const allStoryCategory = "全部";

export function getStoryCategoryTabs(stories: CategorizedStory[]) {
  return [allStoryCategory, ...Array.from(new Set(stories.map((story) => story.category)))];
}

export function selectStoriesByCategory<T extends CategorizedStory>(stories: T[], category: string) {
  if (category === allStoryCategory) {
    return stories;
  }

  return stories.filter((story) => story.category === category);
}

export function getAdjacentStoryCategory(
  categories: string[],
  activeCategory: string,
  direction: "previous" | "next",
) {
  const activeIndex = categories.indexOf(activeCategory);
  if (activeIndex === -1) {
    return categories[0] ?? activeCategory;
  }

  const nextIndex = direction === "next" ? activeIndex + 1 : activeIndex - 1;
  return categories[Math.min(Math.max(nextIndex, 0), categories.length - 1)] ?? activeCategory;
}

export function generateTodayMasterAnswer({
  question,
  statusName,
  resultTitle,
  quote,
}: {
  question: string;
  statusName: string;
  resultTitle: string;
  quote?: string;
}) {
  const normalizedQuestion = question.trim().replace(/[。！？!?]+$/g, "");
  const questionText = normalizedQuestion || "这个问题";

  return `你问的是「${questionText}」。从你今天的「${statusName}」来看，这个问题真正牵动你的，不只是表面发生了什么，而是它碰到了你此刻的气场重心：${resultTitle}。你会特别在意对方的态度、事情的走向，或者自己是不是又要独自消化很多东西。

今天先不要急着把答案逼出来。更适合的做法是：先判断这件事是在消耗你，还是在提醒你重新看清边界；再决定要不要回应、解释或继续投入。${quote ? `也把这句话先放在心里：${quote}` : "你不需要立刻证明自己，也不需要把所有不确定都变成自己的责任。"}如果这个问题反复出现，就说明它已经不只是今天的波动，而是值得继续深挖的固定气场课题。`;
}
