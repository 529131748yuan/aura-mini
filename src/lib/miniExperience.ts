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
