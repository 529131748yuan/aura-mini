"use client";

import {
  Bookmark,
  Heart,
  Home,
  Lock,
  MessageCircle,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  allStoryCategory,
  getAdjacentStoryCategory,
  getStoryCategoryTabs,
  selectStoriesByCategory,
} from "@/lib/miniExperience";
import { stories, type Story } from "@/lib/auraMock";
import {
  AURA_FULL_PROFILE_FORM_KEY,
  AURA_FULL_PROFILE_LEGACY_RESULT_KEY,
  AURA_FULL_PROFILE_RESULT_KEY,
  AURA_FULL_PROFILE_UNLOCKED_KEY,
  generateFullProfile,
  getFullProfileStage,
  mainConcernOptions,
  recentStateOptions,
  relationshipStatusOptions,
  sanitizeFullProfileResult,
  type FullProfileFormData,
  type FullProfileResult,
} from "@/lib/fullProfile";
import {
  AURA_TODAY_TEST_ANSWERS_KEY,
  AURA_TODAY_TEST_DATE_KEY,
  AURA_TODAY_TEST_RESULT_KEY,
  calculateTodayStatusResult,
  todayStatusQuestions,
  todayStatusTypes,
  type TestOptionKey,
  type TodayStatusResult,
} from "@/lib/todayStatusTest";

type TabKey = "today" | "profile";

function getTodayStorageDate() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const date = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${date}`;
}

function normalizeTodayStatusResult(result: TodayStatusResult): TodayStatusResult {
  const currentStatus = todayStatusTypes.find((status) => status.name === result.status.name);
  const repairedResult =
    result.answerKeys?.length === todayStatusQuestions.length ? calculateTodayStatusResult(result.answerKeys) : null;

  if (!currentStatus) return result;

  return {
    ...result,
    scores: result.scores ?? repairedResult?.scores ?? { recovery: 0, relationship: 0, action: 0, flow: 0 },
    primaryDimension: result.primaryDimension ?? repairedResult?.primaryDimension ?? "recovery",
    secondaryDimension: result.secondaryDimension ?? repairedResult?.secondaryDimension ?? "relationship",
    testProfile:
      result.testProfile ??
      repairedResult?.testProfile ?? {
        energyPattern: "",
        relationshipPattern: "",
        pressurePattern: "",
        actionPattern: "",
        innerTrigger: "",
        answerPattern: result.answerKeys?.join("") ?? "",
      },
    status: {
      ...currentStatus,
      ...result.status,
      id: result.status.id ?? currentStatus.id,
      resultTitle: result.status.resultTitle ?? currentStatus.resultTitle,
      deepAnalysis: result.status.deepAnalysis ?? currentStatus.deepAnalysis,
      influences: result.status.influences ?? currentStatus.influences,
      quote: result.status.quote ?? currentStatus.quote,
    },
  };
}

function getProfileKeywords(result: TodayStatusResult | null) {
  if (!result) return [];

  return result.status.traits
    .map((trait) => trait.split(/[，。]/)[0].replace(/^你/, ""))
    .filter(Boolean)
    .slice(0, 3);
}

const initialFullProfileForm: FullProfileFormData = {
  birthDate: "",
  birthTime: "",
  city: "",
  relationshipStatus: "不想说",
  mainConcern: "情绪",
  recentState: "经常内耗",
};

const fullProfileBenefits = [
  "你的固定气场",
  "当前状态画像",
  "关系模式深度分析",
  "情绪与行动节奏",
  "环境影响解析",
  "7 天顺势调整建议",
  "大师解惑入口",
];

const debugResetStorageKeys = [
  AURA_TODAY_TEST_ANSWERS_KEY,
  AURA_TODAY_TEST_RESULT_KEY,
  AURA_TODAY_TEST_DATE_KEY,
  AURA_FULL_PROFILE_UNLOCKED_KEY,
  AURA_FULL_PROFILE_FORM_KEY,
  AURA_FULL_PROFILE_RESULT_KEY,
  AURA_FULL_PROFILE_LEGACY_RESULT_KEY,
];

function getSummaryText(text: string, maxLength = 72) {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function AppGuideModal({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#5c5266]/28 px-4 pb-5 backdrop-blur-sm">
      <div className="aura-card w-full max-w-[390px] rounded-[24px] p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-[#3478f6]">
          <Sparkles size={20} />
        </div>
        <h3 className="text-lg font-semibold text-[#1d1d1f]">继续在 App 里展开</h3>
        <p className="mt-2 text-sm leading-6 text-[#6e6e73]">{message}</p>
        <button
          className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={onClose}
        >
          我知道了
        </button>
      </div>
    </div>
  );
}

function EventLimitModal({
  open,
  onContinue,
  onClose,
}: {
  open: boolean;
  onContinue: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#5c5266]/28 px-4 pb-5 backdrop-blur-sm">
      <div className="aura-card w-full max-w-[390px] rounded-[24px] p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-[#3478f6]">
          <Sparkles size={20} />
        </div>
        <h3 className="text-lg font-semibold text-[#1d1d1f]">今天的事件分析已完成</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#6e6e73]">
          我已经理解了你今天的一件事。
          {"\n"}但真正影响你的，不只是今天发生了什么，而是为什么类似的事情总会反复影响你。
          {"\n\n"}建立完整人生档案后，我可以结合你的固定人格、关系模式和长期状态，继续分析真正的原因。
        </p>
        <button
          className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={onContinue}
        >
          去 App 继续解答
        </button>
        <button
          className="mt-3 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onClose}
        >
          稍后再说
        </button>
      </div>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-[358px] rounded-full bg-[#1d1d1f] px-5 py-3 text-center text-sm font-semibold text-white shadow-aura">
      {message}
    </div>
  );
}

function PaymentModal({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#5c5266]/28 px-4 pb-5 backdrop-blur-sm">
      <div className="aura-card w-full max-w-[390px] rounded-[24px] p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-[#3478f6]">
          <Lock size={18} />
        </div>
        <h3 className="text-lg font-semibold text-[#1d1d1f]">确认解锁完整人生档案</h3>
        <p className="mt-2 text-sm leading-6 text-[#6e6e73]">
          支付 ¥9.9 后，你可以在小程序内填写验证资料，解锁完整人生档案。
        </p>
        <button
          className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={onConfirm}
        >
          确认支付 ¥9.9
        </button>
        <button
          className="mt-3 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onClose}
        >
          取消
        </button>
      </div>
    </div>
  );
}

function AppUnlockModal({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#5c5266]/28 px-4 pb-5 backdrop-blur-sm">
      <div className="aura-card w-full max-w-[390px] rounded-[24px] p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-[#3478f6]">
          <Sparkles size={20} />
        </div>
        <h3 className="text-lg font-semibold text-[#1d1d1f]">下载 App 免费解锁完整人生档案</h3>
        <p className="mt-2 text-sm leading-6 text-[#6e6e73]">
          在 App 中，你可以免费建立完整人生档案，并获得更长期、更准确的状态分析。
        </p>
        <button
          className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={onConfirm}
        >
          打开 App / 下载 App
        </button>
        <button
          className="mt-3 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onClose}
        >
          稍后再说
        </button>
      </div>
    </div>
  );
}

function ShareModal({
  open,
  result,
  onClose,
}: {
  open: boolean;
  result: TodayStatusResult | null;
  onClose: () => void;
}) {
  if (!open || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5c5266]/28 px-5 backdrop-blur-sm">
      <div className="aura-card w-full max-w-[330px] rounded-[24px] p-5">
        <div className="rounded-[20px] bg-white/62 p-5">
          <p className="text-xs font-semibold text-[#6e6e73]">我的今日状态：{result.status.name}</p>
          <h3 className="mt-3 text-2xl font-semibold leading-8 text-[#1d1d1f]">
            {result.status.resultTitle}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#6e6e73]">{result.status.quote}</p>
          <div className="aura-primary-soft mt-5 rounded-full px-4 py-3 text-center text-sm font-semibold">
            测测你今天是什么状态
          </div>
        </div>
        <button
          className="mt-4 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onClose}
        >
          收起分享卡
        </button>
      </div>
    </div>
  );
}

function QuestionModal({
  answer,
  onClose,
}: {
  answer: { title: string; answer: string } | null;
  onClose: () => void;
}) {
  if (!answer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#5c5266]/28 px-4 pb-5 backdrop-blur-sm">
      <div className="aura-card w-full max-w-[390px] rounded-[24px] p-5">
        <p className="text-xs font-semibold text-[#6e6e73]">今日已解锁</p>
        <h3 className="mt-3 text-lg font-semibold leading-7 text-[#1d1d1f]">{answer.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#6e6e73]">{answer.answer}</p>
        <button
          className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={onClose}
        >
          收起
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-[#1d1d1f]">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm leading-6 text-[#6e6e73]">{subtitle}</p> : null}
    </div>
  );
}

function FullProfileFormModal({
  open,
  form,
  isSubmitting,
  onChange,
  onSubmit,
  onClose,
}: {
  open: boolean;
  form: FullProfileFormData;
  isSubmitting: boolean;
  onChange: (form: FullProfileFormData) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#5c5266]/28 px-4 pb-5 backdrop-blur-sm">
      <div className="aura-card max-h-[88vh] w-full max-w-[390px] overflow-y-auto rounded-[28px] p-5 aura-scrollbar">
        <h3 className="text-xl font-semibold text-[#1d1d1f]">填写验证资料</h3>
        <p className="mt-2 text-sm leading-6 text-[#6e6e73]">
          这些信息会用于提升分析准确度，仅用于生成你的个人档案。
        </p>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-[#1d1d1f]">
            出生日期
            <input
              className="rounded-[16px] border border-white/80 bg-white/68 px-4 py-3 text-sm text-[#1d1d1f] outline-none focus:border-[#3478f6]"
              type="date"
              value={form.birthDate}
              onChange={(event) => onChange({ ...form, birthDate: event.target.value })}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#1d1d1f]">
            出生时间，可选
            <input
              className="rounded-[16px] border border-white/80 bg-white/68 px-4 py-3 text-sm text-[#1d1d1f] outline-none focus:border-[#3478f6]"
              type="time"
              value={form.birthTime}
              onChange={(event) => onChange({ ...form, birthTime: event.target.value })}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#1d1d1f]">
            所在城市
            <input
              className="rounded-[16px] border border-white/80 bg-white/68 px-4 py-3 text-sm text-[#1d1d1f] outline-none focus:border-[#3478f6]"
              placeholder="例如：上海"
              value={form.city}
              onChange={(event) => onChange({ ...form, city: event.target.value })}
            />
          </label>
          <FormSelect
            label="当前感情状态"
            value={form.relationshipStatus}
            options={relationshipStatusOptions}
            onChange={(value) => onChange({ ...form, relationshipStatus: value })}
          />
          <FormSelect
            label="当前主要困扰"
            value={form.mainConcern}
            options={mainConcernOptions}
            onChange={(value) => onChange({ ...form, mainConcern: value })}
          />
          <FormSelect
            label="最近 30 天状态"
            value={form.recentState}
            options={recentStateOptions}
            onChange={(value) => onChange({ ...form, recentState: value })}
          />
        </div>

        <button
          className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-45"
          disabled={!form.birthDate || !form.city.trim() || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "正在生成你的完整人生档案……" : "生成完整人生档案"}
        </button>
        <button
          className="mt-3 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onClose}
        >
          稍后填写
        </button>
      </div>
    </div>
  );
}

function FormSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#1d1d1f]">
      {label}
      <select
        className="rounded-[16px] border border-white/80 bg-white/68 px-4 py-3 text-sm text-[#1d1d1f] outline-none focus:border-[#3478f6]"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FullProfileResultCard({
  result,
  onAppFeature,
}: {
  result: FullProfileResult;
  onAppFeature: () => void;
}) {
  return (
    <section className="space-y-4">
      <div className="aura-card rounded-[24px] p-5">
        <p className="text-xs font-semibold text-[#3478f6]">完整人生档案</p>
        <h2 className="mt-3 text-2xl font-semibold text-[#1d1d1f]">{result.title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#6e6e73]">{result.subtitle}</p>
        <p className="mt-3 rounded-[18px] bg-[#eef4ff] p-4 text-sm font-semibold leading-7 text-[#3a3a3c]">
          这不是简单标签，而是关于“你为什么会这样”的分析。
        </p>
      </div>

      {result.sections.map((section) => (
        <article key={section.title} className="aura-card rounded-[24px] p-5">
          <h3 className="text-xl font-semibold leading-8 text-[#1d1d1f]">{section.title}</h3>
          {section.highlight ? (
            <p className="mt-4 rounded-[18px] bg-[#eef4ff] p-4 text-sm font-semibold leading-7 text-[#3a3a3c]">
              {section.highlight}
            </p>
          ) : null}
          <p className="mt-4 text-sm leading-8 text-[#3a3a3c]">{section.content}</p>
          {section.title.startsWith("七、") ? (
            <div className="mt-4 grid gap-3">
              <AdviceGroup title="今天开始" items={result.sevenDayAdvice.today} />
              <AdviceGroup title="3 天内" items={result.sevenDayAdvice.threeDays} />
              <AdviceGroup title="7 天内" items={result.sevenDayAdvice.sevenDays} />
            </div>
          ) : null}
        </article>
      ))}

      <div className="aura-card sticky bottom-24 z-10 rounded-[24px] p-5">
        <h3 className="text-lg font-semibold text-[#1d1d1f]">如果你还有一个放不下的问题</h3>
        <p className="mt-2 text-sm leading-7 text-[#6e6e73]">
          可以把具体的人、选择或反复出现的问题继续交给大师拆解。
        </p>
        <button
          className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={onAppFeature}
        >
          问 AI 大师继续解惑
        </button>
        <button
          className="mt-3 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onAppFeature}
        >
          真人大师一对一分析
        </button>
      </div>
    </section>
  );
}

function AdviceGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[18px] bg-white/62 p-4">
      <h4 className="text-sm font-semibold text-[#1d1d1f]">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-7 text-[#6e6e73]">
            <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[#3478f6]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FullProfileUnlockCard({
  stage,
  result,
  onPay,
  onFreeUnlock,
  onFillProfile,
  onAppFeature,
}: {
  stage: ReturnType<typeof getFullProfileStage>;
  result: FullProfileResult | null;
  onPay: () => void;
  onFreeUnlock: () => void;
  onFillProfile: () => void;
  onAppFeature: () => void;
}) {
  if (stage === "generated" && result) {
    return <FullProfileResultCard result={result} onAppFeature={onAppFeature} />;
  }

  if (stage === "unlocked") {
    return (
      <section className="aura-card rounded-[24px] p-5">
        <SectionTitle
          title="完整人生档案已解锁"
          subtitle="你已经可以填写验证资料，生成更完整的人生档案。"
        />
        <button
          className="aura-primary mt-2 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={onFillProfile}
        >
          填写验证资料
        </button>
      </section>
    );
  }

  return (
    <section className="aura-card rounded-[24px] p-5">
      <SectionTitle
        title="完整人生档案已锁定"
        subtitle="我已经知道你今天是什么状态，但还不知道为什么你总会进入这种状态。"
      />
      <p className="text-sm leading-7 text-[#6e6e73]">
        小程序只能通过今天的选择，看见你此刻的状态。
        想获得更准确的分析，需要补充基础资料、关系模式、长期状态轨迹和外部环境数据，解锁属于你的完整人生档案。
      </p>
      <div className="mt-4 grid gap-2">
        {fullProfileBenefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-3 rounded-[16px] bg-white/58 px-4 py-3 text-sm font-semibold text-[#3a3a3c]">
            <Lock size={15} className="text-[#3478f6]" />
            {benefit}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3">
        <button
          className="aura-primary w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={onPay}
        >
          ¥9.9 立即解锁
        </button>
        <button
          className="w-full rounded-full border border-[#3478f6]/20 bg-[#eef4ff] px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onFreeUnlock}
        >
          下载 App 免费解锁
        </button>
      </div>
    </section>
  );
}

function TodayPage({
  answers,
  currentQuestionIndex,
  result,
  isTesting,
  isGeneratingTodayAnalysis,
  onStart,
  onAnswer,
  onPrevious,
  onNext,
  onGenerate,
  onShare,
  fullProfileStage,
  fullProfileResult,
  onPayUnlock,
  onFreeUnlock,
  onFillProfile,
  onAppFeature,
}: {
  answers: Array<TestOptionKey | null>;
  currentQuestionIndex: number;
  result: TodayStatusResult | null;
  isTesting: boolean;
  isGeneratingTodayAnalysis: boolean;
  onStart: () => void;
  onAnswer: (answer: TestOptionKey) => void;
  onPrevious: () => void;
  onNext: () => void;
  onGenerate: () => void;
  onShare: () => void;
  fullProfileStage: ReturnType<typeof getFullProfileStage>;
  fullProfileResult: FullProfileResult | null;
  onPayUnlock: () => void;
  onFreeUnlock: () => void;
  onFillProfile: () => void;
  onAppFeature: () => void;
}) {
  const question = todayStatusQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const answeredCount = answers.filter(Boolean).length;
  const canGenerate = answeredCount === todayStatusQuestions.length;

  if (isTesting) {
    return (
      <div className="space-y-5 pb-28 pt-4">
        <section className="aura-card rounded-[24px] p-5">
          <div className="flex items-center justify-between text-sm font-semibold text-[#6e6e73]">
            <span>今日状态测试</span>
            <span>
              {currentQuestionIndex + 1} / {todayStatusQuestions.length}
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/68">
            <div
              className="h-full rounded-full bg-[#3478f6] transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / todayStatusQuestions.length) * 100}%` }}
            />
          </div>
          <h1 className="mt-8 text-2xl font-semibold leading-9 text-[#1d1d1f]">{question.title}</h1>
          <div className="mt-6 grid gap-3">
            {question.options.map((option) => (
              <button
                key={option.key}
                className={`rounded-[18px] border p-4 text-left text-sm font-semibold leading-6 transition active:scale-[0.99] ${
                  selectedAnswer === option.key
                    ? "border-[#3478f6] bg-[#eef4ff] text-[#1d1d1f] shadow-soft"
                    : "border-white/80 bg-white/62 text-[#3a3a3c]"
                }`}
                onClick={() => onAnswer(option.key)}
              >
                <span className="mr-2 text-[#3478f6]">{option.key}.</span>
                {option.text}
              </button>
            ))}
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              className="rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98] disabled:text-[#b0b0b5]"
              disabled={currentQuestionIndex === 0}
              onClick={onPrevious}
            >
              上一题
            </button>
            {currentQuestionIndex === todayStatusQuestions.length - 1 ? (
              <button
                className="aura-primary rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-45"
                disabled={!canGenerate || isGeneratingTodayAnalysis}
                onClick={onGenerate}
              >
                {isGeneratingTodayAnalysis ? "正在分析你现在的状态……" : "生成今日状态报告"}
              </button>
            ) : (
              <button
                className="aura-primary rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-45"
                disabled={!selectedAnswer}
                onClick={onNext}
              >
                下一题
              </button>
            )}
          </div>
        </section>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="space-y-5 pb-28 pt-4">
        <section className="aura-hero rounded-[24px] p-6">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-3 py-1 text-xs text-[#3478f6]">
            <Sparkles size={14} /> 今日状态测试
          </p>
          <h1 className="text-[30px] font-semibold leading-tight text-[#1d1d1f]">今天，你是什么状态？</h1>
          <p className="mt-3 text-lg font-semibold text-[#3a3a3c]">60 秒，看见现在真正的自己。</p>
          <p className="mt-3 text-sm leading-6 text-[#6e6e73]">
            通过几个选择，判断你此刻的情绪反应、关系反应和行动倾向。
          </p>
          <button
            className="aura-primary mt-7 w-full rounded-full px-5 py-3.5 text-sm font-semibold transition active:scale-[0.98]"
            onClick={onStart}
          >
            开始今日状态测试
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28 pt-4">
      <section className="aura-card rounded-[24px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#6e6e73]">今日状态报告</p>
            <h1 className="mt-3 text-2xl font-semibold leading-9 text-[#1d1d1f]">
              今天，我看见了一个「{result.status.resultTitle}」的你
            </h1>
          </div>
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#3478f6] transition active:scale-95"
            aria-label="分享"
            onClick={onShare}
          >
            <Share2 size={18} />
          </button>
        </div>
        <div className="mt-6 rounded-[20px] bg-[#eef4ff] p-5">
          <p className="text-sm font-semibold text-[#3478f6]">你的今日状态：</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#1d1d1f]">
            {result.status.icon} 「{result.status.name}」
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#3a3a3c]">{result.status.shortDesc}</p>
        </div>
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <SectionTitle title="我看见了你这三个特点" />
        <div className="mt-5 grid gap-3">
          {result.status.traits.map((trait) => (
            <div key={trait} className="rounded-[18px] bg-white/62 p-4 text-sm font-semibold leading-7 text-[#3a3a3c]">
              {trait}
            </div>
          ))}
        </div>
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <SectionTitle title="为什么你最近会这样？" />
        <p className="text-sm leading-7 text-[#3a3a3c]">{result.status.deepAnalysis}</p>
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <SectionTitle title="这个状态正在影响你什么？" />
        <ul className="space-y-3">
          {result.status.influences.map((item) => (
            <li key={item} className="rounded-[18px] bg-white/62 p-4 text-sm leading-7 text-[#3a3a3c]">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <SectionTitle title="今天你最该顺势而为的方向" />
        <div className="grid gap-3">
          <StatusList title="今天适合" items={result.status.suitable} tone="do" />
          <StatusList title="今天不适合" items={result.status.avoid} tone="avoid" />
        </div>
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <h2 className="text-xl font-semibold text-[#1d1d1f]">今天，送你一句话</h2>
        <p className="mt-3 text-lg font-semibold leading-8 text-[#3a3a3c]">{result.status.quote}</p>
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <h2 className="text-xl font-semibold text-[#1d1d1f]">今日趣味点评</h2>
        <p className="mt-3 text-sm leading-7 text-[#6e6e73]">{result.status.funComment}</p>
        <button
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onShare}
        >
          <Share2 size={16} /> 生成分享卡
        </button>
      </section>

      <FullProfileUnlockCard
        stage={fullProfileStage}
        result={fullProfileResult}
        onPay={onPayUnlock}
        onFreeUnlock={onFreeUnlock}
        onFillProfile={onFillProfile}
        onAppFeature={onAppFeature}
      />
    </div>
  );
}

function StatusList({ title, items, tone }: { title: string; items: string[]; tone: "do" | "avoid" }) {
  return (
    <div className="rounded-[18px] bg-white/62 p-4">
      <h3 className="text-sm font-semibold text-[#1d1d1f]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-[#6e6e73]">
            <span className={`mt-2 h-1.5 w-1.5 rounded-full ${tone === "do" ? "bg-[#9fbf9e]" : "bg-[#d69ab3]"}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StoriesPage({
  onNeedApp,
}: {
  onNeedApp: (message: string) => void;
}) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeCategory, setActiveCategory] = useState(allStoryCategory);
  const touchStartX = useRef<number | null>(null);
  const storyCategories = useMemo(() => getStoryCategoryTabs(stories), []);
  const visibleStories = useMemo(() => selectStoriesByCategory(stories, activeCategory), [activeCategory]);

  function handleStorySwipe(endX: number) {
    if (touchStartX.current === null) return;

    const deltaX = touchStartX.current - endX;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 48) return;

    setActiveCategory((currentCategory) =>
      getAdjacentStoryCategory(storyCategories, currentCategory, deltaX > 0 ? "next" : "previous"),
    );
  }

  return (
    <div className="space-y-5 pb-28 pt-4">
      <section className="aura-hero rounded-[24px] p-6">
        <p className="mb-3 text-xs font-semibold text-[#3478f6]">每一个故事，都值得被理解</p>
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">众生社区</h1>
        <p className="mt-3 text-sm leading-6 text-[#6e6e73]">看看今天，别人正在经历什么。</p>
        <div className="aura-scrollbar -mx-1 mt-5 flex snap-x gap-2 overflow-x-auto px-1">
          {storyCategories.map((category) => (
            <button
              key={category}
              className={`shrink-0 snap-start rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                activeCategory === category
                  ? "bg-[#1d1d1f] text-white shadow-soft"
                  : "bg-white/72 text-[#6e6e73]"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div
        className="grid grid-cols-2 gap-3"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          handleStorySwipe(event.changedTouches[0]?.clientX ?? 0);
        }}
      >
        {visibleStories.map((story) => (
          <article
            key={story.id}
            className="aura-card flex min-h-[188px] flex-col rounded-[20px] p-4 transition active:scale-[0.98]"
            onClick={() => setSelectedStory(story)}
          >
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#3478f6]">
              {story.category}
            </span>
            <h2 className="mt-3 line-clamp-3 text-[15px] font-semibold leading-6 text-[#1d1d1f]">{story.title}</h2>
            <p className="mt-2 line-clamp-4 text-xs leading-5 text-[#6e6e73]">{story.excerpt}</p>
            <p className="mt-auto pt-4 text-[11px] text-[#86868b]">{story.resonance} 人共鸣</p>
          </article>
        ))}
      </div>

      {selectedStory ? (
        <StoryDetail
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onNeedApp={onNeedApp}
        />
      ) : null}
    </div>
  );
}

function StoryAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: (message: string) => void;
}) {
  return (
    <button
      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-white/72 px-2 text-xs font-semibold text-[#3478f6] transition active:scale-95"
      onClick={(event) => {
        event.stopPropagation();
        onClick("你的故事，也值得被理解。下载 App，分享你的故事，获得 AI 与大师点评。");
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function StoryDetail({
  story,
  onClose,
  onNeedApp,
}: {
  story: Story;
  onClose: () => void;
  onNeedApp: (message: string) => void;
}) {
  const [storyComment, setStoryComment] = useState({
    aiComment: story.aiInsight,
    masterComment: story.masterComment,
  });
  const [isGeneratingStoryComment, setIsGeneratingStoryComment] = useState(false);

  async function handleGenerateStoryComment() {
    setIsGeneratingStoryComment(true);

    try {
      const response = await fetch("/api/aura/story-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: story.title,
          content: story.fullText,
          category: story.category,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setStoryComment({
          aiComment: result.aiComment || story.aiInsight,
          masterComment: result.masterComment || story.masterComment,
        });
      }
    } catch {
      setStoryComment({
        aiComment: story.aiInsight,
        masterComment: story.masterComment,
      });
    } finally {
      setIsGeneratingStoryComment(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#5c5266]/28 px-4 pb-5 backdrop-blur-sm">
      <div className="aura-card max-h-[88vh] w-full max-w-[390px] overflow-y-auto rounded-[28px] p-5 aura-scrollbar">
        <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#3478f6]">{story.category}</span>
        <h2 className="mt-4 text-2xl font-semibold leading-9 text-[#1d1d1f]">{story.title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#3a3a3c]">{story.fullText}</p>
        <div className="mt-5 space-y-3 rounded-[18px] bg-[#f5f7fa] p-4">
          <p className="text-sm leading-6 text-[#3a3a3c]">{storyComment.aiComment}</p>
          <p className="text-sm leading-6 text-[#3a3a3c]">{storyComment.masterComment}</p>
        </div>
        <button
          className="mt-4 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98] disabled:opacity-45"
          disabled={isGeneratingStoryComment}
          onClick={handleGenerateStoryComment}
        >
          {isGeneratingStoryComment ? "正在生成 AI 点评……" : "生成 AI 点评"}
        </button>
        <p className="mt-4 text-xs text-[#86868b]">已有 {story.resonance} 人表示“我也经历过”。</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <StoryAction icon={<Heart size={15} />} label="我也经历过" onClick={onNeedApp} />
          <StoryAction icon={<Bookmark size={15} />} label="收藏" onClick={onNeedApp} />
          <StoryAction icon={<MessageCircle size={15} />} label="评论" onClick={onNeedApp} />
        </div>
        <button
          className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
          onClick={() => onNeedApp("你的故事，也值得被理解。下载 App，分享你的故事，获得 AI 与大师点评。")}
        >
          我也经历过
        </button>
        <button
          className="mt-3 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
}

function ProfilePage({
  todayStatusResult,
  fullProfileStage,
  fullProfileResult,
  onPayUnlock,
  onFreeUnlock,
  onFillProfile,
  onAppFeature,
  onDebugReset,
}: {
  todayStatusResult: TodayStatusResult | null;
  fullProfileStage: ReturnType<typeof getFullProfileStage>;
  fullProfileResult: FullProfileResult | null;
  onPayUnlock: () => void;
  onFreeUnlock: () => void;
  onFillProfile: () => void;
  onAppFeature: () => void;
  onDebugReset: () => void;
}) {
  const profileKeywords = getProfileKeywords(todayStatusResult);

  return (
    <div className="space-y-5 pb-28 pt-4">
      <section className="aura-hero rounded-[24px] p-6">
        <p className="mb-3 text-xs font-semibold text-[#3478f6]">初步气场档案</p>
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">
          {todayStatusResult ? `今日状态：${todayStatusResult.status.name}` : "完成今日状态测试后，我会先认识今天的你。"}
        </h1>
        {todayStatusResult ? (
          <>
            <p className="mt-3 text-sm leading-6 text-[#6e6e73]">一句话描述：{todayStatusResult.status.shortDesc}</p>
            <p className="mt-2 text-sm font-semibold text-[#6e6e73]">档案完整度：28%</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profileKeywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-white/72 px-3 py-1.5 text-xs font-semibold text-[#3478f6]">
                  {keyword}
                </span>
              ))}
            </div>
          </>
        ) : null}
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/68">
          <div className={`h-full rounded-full bg-[#3478f6] ${todayStatusResult ? "w-[28%]" : "w-[8%]"}`} />
        </div>
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <SectionTitle title="已识别" />
        <div className="grid gap-3">
          {(todayStatusResult
            ? ["今日情绪反应", "今日关系倾向", "今日行动节奏"]
            : ["等待今日状态测试"]).map((item) => (
            <div key={item} className="rounded-[18px] bg-white/58 px-4 py-3 text-sm font-semibold text-[#1d1d1f]">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <SectionTitle title="完整人生档案" />
        {fullProfileStage === "locked" ? (
          <>
            <p className="text-sm font-semibold text-[#1d1d1f]">完整人生档案：未解锁</p>
            <p className="mt-2 text-sm leading-7 text-[#6e6e73]">
              小程序测试只是初步结果。完整档案需要更多资料，才能判断你为什么总会进入类似状态。
            </p>
            <button
              className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
              onClick={onPayUnlock}
            >
              ¥9.9 解锁
            </button>
            <button
              className="mt-3 w-full rounded-full border border-[#3478f6]/20 bg-[#eef4ff] px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
              onClick={onFreeUnlock}
            >
              下载 App 免费解锁
            </button>
          </>
        ) : null}
        {fullProfileStage === "unlocked" ? (
          <>
            <p className="text-sm font-semibold text-[#1d1d1f]">完整人生档案：已解锁，待填写资料</p>
            <button
              className="aura-primary mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
              onClick={onFillProfile}
            >
              填写验证资料
            </button>
          </>
        ) : null}
        {fullProfileStage === "generated" && fullProfileResult ? (
          <>
            <p className="text-sm font-semibold text-[#1d1d1f]">完整人生档案：已生成</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[18px] bg-white/58 p-4 text-sm leading-6 text-[#3a3a3c]">
                固定人格：{getSummaryText(fullProfileResult.personality)}
              </div>
              <div className="rounded-[18px] bg-white/58 p-4 text-sm leading-6 text-[#3a3a3c]">
                关系模式：{getSummaryText(fullProfileResult.relationshipPattern)}
              </div>
              <div className="rounded-[18px] bg-white/58 p-4 text-sm leading-6 text-[#3a3a3c]">
                主要困扰：{fullProfileResult.mainConcern}
              </div>
            </div>
            <button
              className="mt-5 w-full rounded-full bg-white/72 px-5 py-3 text-sm font-semibold text-[#3478f6] transition active:scale-[0.98]"
              onClick={onAppFeature}
            >
              找大师继续解惑
            </button>
          </>
        ) : null}
      </section>

      <section className="aura-card rounded-[24px] p-5">
        <SectionTitle title="调试工具" subtitle="仅用于体验版反复测试不同结果。" />
        <button
          className="w-full rounded-full border border-[#d69ab3]/35 bg-white/72 px-5 py-3 text-sm font-semibold text-[#b85d7a] transition active:scale-[0.98]"
          onClick={onDebugReset}
        >
          调试：重置体验数据
        </button>
      </section>
    </div>
  );
}

function BottomTabs({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  const tabs = [
    { key: "today" as const, label: "今日", icon: Home },
    { key: "profile" as const, label: "我的", icon: UserRound },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 z-30 grid w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 grid-cols-2 rounded-full bg-white/78 p-1.5 shadow-aura backdrop-blur-xl">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold transition active:scale-95 ${
            active === key ? "bg-[#eef4ff] text-[#3478f6]" : "text-[#86868b]"
          }`}
          onClick={() => onChange(key)}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </nav>
  );
}

function BottomSafeFade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7]/95 to-transparent"
    />
  );
}

export default function MiniPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [testAnswers, setTestAnswers] = useState<Array<TestOptionKey | null>>(
    Array(todayStatusQuestions.length).fill(null),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [isGeneratingTodayAnalysis, setIsGeneratingTodayAnalysis] = useState(false);
  const [todayStatusResult, setTodayStatusResult] = useState<TodayStatusResult | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [appMessage, setAppMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [appUnlockOpen, setAppUnlockOpen] = useState(false);
  const [fullProfileFormOpen, setFullProfileFormOpen] = useState(false);
  const [fullProfileUnlocked, setFullProfileUnlocked] = useState(false);
  const [fullProfileForm, setFullProfileForm] = useState<FullProfileFormData>(initialFullProfileForm);
  const [fullProfileResult, setFullProfileResult] = useState<FullProfileResult | null>(null);
  const [isGeneratingFullProfile, setIsGeneratingFullProfile] = useState(false);
  const fullProfileStage = getFullProfileStage(fullProfileUnlocked, fullProfileResult);

  useEffect(() => {
    const today = getTodayStorageDate();
    const storedDate = window.localStorage.getItem(AURA_TODAY_TEST_DATE_KEY);
    const storedResult = window.localStorage.getItem(AURA_TODAY_TEST_RESULT_KEY);
    const storedAnswers = window.localStorage.getItem(AURA_TODAY_TEST_ANSWERS_KEY);
    const storedFullProfileUnlocked = window.localStorage.getItem(AURA_FULL_PROFILE_UNLOCKED_KEY);
    const storedFullProfileForm = window.localStorage.getItem(AURA_FULL_PROFILE_FORM_KEY);
    const storedFullProfileResult =
      window.localStorage.getItem(AURA_FULL_PROFILE_RESULT_KEY) ??
      window.localStorage.getItem(AURA_FULL_PROFILE_LEGACY_RESULT_KEY);

    try {
      if (storedAnswers) {
        const parsedAnswers = JSON.parse(storedAnswers) as Array<TestOptionKey | null>;
        if (Array.isArray(parsedAnswers) && parsedAnswers.length === todayStatusQuestions.length) {
          setTestAnswers(parsedAnswers);
        }
      }

      if (storedDate === today && storedResult) {
        setTodayStatusResult(normalizeTodayStatusResult(JSON.parse(storedResult) as TodayStatusResult));
      }

      setFullProfileUnlocked(storedFullProfileUnlocked === "true");

      if (storedFullProfileForm) {
        setFullProfileForm({ ...initialFullProfileForm, ...(JSON.parse(storedFullProfileForm) as FullProfileFormData) });
      }

      if (storedFullProfileResult) {
        const parsedFullProfileResult = JSON.parse(storedFullProfileResult) as FullProfileResult;
        if (Array.isArray(parsedFullProfileResult.sections)) {
          setFullProfileResult(sanitizeFullProfileResult(parsedFullProfileResult));
        }
      }
    } catch {
      window.localStorage.removeItem(AURA_TODAY_TEST_ANSWERS_KEY);
      window.localStorage.removeItem(AURA_TODAY_TEST_RESULT_KEY);
      window.localStorage.removeItem(AURA_TODAY_TEST_DATE_KEY);
      window.localStorage.removeItem(AURA_FULL_PROFILE_FORM_KEY);
      window.localStorage.removeItem(AURA_FULL_PROFILE_RESULT_KEY);
      window.localStorage.removeItem(AURA_FULL_PROFILE_LEGACY_RESULT_KEY);
    }
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  function persistAnswers(nextAnswers: Array<TestOptionKey | null>) {
    window.localStorage.setItem(AURA_TODAY_TEST_ANSWERS_KEY, JSON.stringify(nextAnswers));
  }

  function handleStartTest() {
    setIsTesting(true);
    setCurrentQuestionIndex(0);
  }

  function handleAnswer(answer: TestOptionKey) {
    const nextAnswers = [...testAnswers];
    nextAnswers[currentQuestionIndex] = answer;
    setTestAnswers(nextAnswers);
    persistAnswers(nextAnswers);
  }

  async function handleGenerateStatusReport() {
    if (testAnswers.some((answer) => !answer)) return;

    const completedAnswers = testAnswers as TestOptionKey[];
    const localResult = calculateTodayStatusResult(completedAnswers);
    let result = localResult;

    setIsGeneratingTodayAnalysis(true);

    try {
      const response = await fetch("/api/aura/today-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: completedAnswers,
          scores: localResult.scores,
          primaryDimension: localResult.primaryDimension,
          secondaryDimension: localResult.secondaryDimension,
          testProfile: localResult.testProfile,
          resultType: localResult.status.name,
          localMockResult: {
            resultTitle: localResult.status.resultTitle,
            stateName: localResult.status.name,
            shortDesc: localResult.status.shortDesc,
            traits: localResult.status.traits,
            deepAnalysis: localResult.status.deepAnalysis,
            influences: localResult.status.influences,
            suitable: localResult.status.suitable,
            avoid: localResult.status.avoid,
            quote: localResult.status.quote,
            funComment: localResult.status.funComment,
            appReason: localResult.status.appReason,
          },
        }),
      });

      if (response.ok) {
        const aiStatus = await response.json();
        result = {
          ...localResult,
          status: {
            ...localResult.status,
            name: localResult.status.name,
            id: localResult.status.id,
            icon: localResult.status.icon,
            resultTitle: aiStatus.resultTitle || localResult.status.resultTitle,
            shortDesc: aiStatus.shortDesc || localResult.status.shortDesc,
            traits: Array.isArray(aiStatus.traits) ? aiStatus.traits : localResult.status.traits,
            deepAnalysis: aiStatus.deepAnalysis || localResult.status.deepAnalysis,
            influences: Array.isArray(aiStatus.influences) ? aiStatus.influences : localResult.status.influences,
            suitable: Array.isArray(aiStatus.suitable) ? aiStatus.suitable : localResult.status.suitable,
            avoid: Array.isArray(aiStatus.avoid) ? aiStatus.avoid : localResult.status.avoid,
            quote: aiStatus.quote || localResult.status.quote,
            funComment: aiStatus.funComment || localResult.status.funComment,
            appReason: aiStatus.appReason || localResult.status.appReason,
          },
        };
      }
    } catch {
      result = localResult;
    } finally {
      setIsGeneratingTodayAnalysis(false);
    }

    setTodayStatusResult(result);
    setIsTesting(false);
    window.localStorage.setItem(AURA_TODAY_TEST_ANSWERS_KEY, JSON.stringify(completedAnswers));
    window.localStorage.setItem(AURA_TODAY_TEST_RESULT_KEY, JSON.stringify(result));
    window.localStorage.setItem(AURA_TODAY_TEST_DATE_KEY, getTodayStorageDate());
  }

  function handlePaymentSuccess() {
    setPaymentOpen(false);
    setFullProfileUnlocked(true);
    window.localStorage.setItem(AURA_FULL_PROFILE_UNLOCKED_KEY, "true");
    setToastMessage("支付成功，完整人生档案已解锁");
  }

  function handleAppDownloadMock() {
    setAppUnlockOpen(false);
    setToastMessage("这里后续接入真实 App 下载链接。");
  }

  async function handleGenerateFullProfile() {
    const todayTestResult = todayStatusResult
      ? {
          statusName: todayStatusResult.status.name,
          statusTitle: todayStatusResult.status.resultTitle,
          statusSummary: todayStatusResult.status.shortDesc,
          scores: todayStatusResult.scores,
          primaryDimension: todayStatusResult.primaryDimension,
          secondaryDimension: todayStatusResult.secondaryDimension,
          answerKeys: todayStatusResult.answerKeys,
          traits: todayStatusResult.status.traits,
          testProfile: todayStatusResult.testProfile,
        }
      : undefined;
    const fallbackResult = generateFullProfile(fullProfileForm, todayTestResult);
    let result = fallbackResult;

    setIsGeneratingFullProfile(true);

    try {
      const response = await fetch("/api/aura/full-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fullProfileForm,
          todayTestResult,
        }),
      });

      if (response.ok) {
        const aiResult = await response.json();
        if (Array.isArray(aiResult.sections)) {
          result = sanitizeFullProfileResult(aiResult as FullProfileResult);
        }
      }
    } catch {
      result = fallbackResult;
    } finally {
      setIsGeneratingFullProfile(false);
    }

    setFullProfileResult(result);
    setFullProfileFormOpen(false);
    window.localStorage.setItem(AURA_FULL_PROFILE_FORM_KEY, JSON.stringify(fullProfileForm));
    window.localStorage.setItem(AURA_FULL_PROFILE_RESULT_KEY, JSON.stringify(result));
    setToastMessage("完整人生档案已生成");
  }

  function handleAppFeatureToast() {
    setToastMessage("该功能将在 App 中开放。");
  }

  function handleDebugReset() {
    debugResetStorageKeys.forEach((key) => window.localStorage.removeItem(key));
    setTestAnswers(Array(todayStatusQuestions.length).fill(null));
    setCurrentQuestionIndex(0);
    setIsTesting(false);
    setIsGeneratingTodayAnalysis(false);
    setTodayStatusResult(null);
    setShareOpen(false);
    setPaymentOpen(false);
    setAppUnlockOpen(false);
    setFullProfileFormOpen(false);
    setFullProfileUnlocked(false);
    setFullProfileForm(initialFullProfileForm);
    setFullProfileResult(null);
    setIsGeneratingFullProfile(false);
    setActiveTab("today");
    setToastMessage("已重置体验数据，可以重新测试");
  }

  return (
    <main className="min-h-screen px-4 py-4">
      <div className="mx-auto min-h-screen w-full max-w-[390px] overflow-hidden">
        <div className="transition-all duration-300 ease-out">
          {activeTab === "today" ? (
            <TodayPage
              answers={testAnswers}
              currentQuestionIndex={currentQuestionIndex}
              result={todayStatusResult}
              isTesting={isTesting}
              isGeneratingTodayAnalysis={isGeneratingTodayAnalysis}
              onStart={handleStartTest}
              onAnswer={handleAnswer}
              onPrevious={() => setCurrentQuestionIndex((index) => Math.max(index - 1, 0))}
              onNext={() => setCurrentQuestionIndex((index) => Math.min(index + 1, todayStatusQuestions.length - 1))}
              onGenerate={handleGenerateStatusReport}
              onShare={() => setShareOpen(true)}
              fullProfileStage={fullProfileStage}
              fullProfileResult={fullProfileResult}
              onPayUnlock={() => setPaymentOpen(true)}
              onFreeUnlock={() => setAppUnlockOpen(true)}
              onFillProfile={() => setFullProfileFormOpen(true)}
              onAppFeature={handleAppFeatureToast}
            />
          ) : null}
          {activeTab === "profile" ? (
            <ProfilePage
              todayStatusResult={todayStatusResult}
              fullProfileStage={fullProfileStage}
              fullProfileResult={fullProfileResult}
              onPayUnlock={() => setPaymentOpen(true)}
              onFreeUnlock={() => setAppUnlockOpen(true)}
              onFillProfile={() => setFullProfileFormOpen(true)}
              onAppFeature={handleAppFeatureToast}
              onDebugReset={handleDebugReset}
            />
          ) : null}
        </div>
      </div>

      <BottomSafeFade />
      <BottomTabs active={activeTab} onChange={setActiveTab} />
      <ShareModal open={shareOpen} result={todayStatusResult} onClose={() => setShareOpen(false)} />
      <AppGuideModal open={Boolean(appMessage)} message={appMessage} onClose={() => setAppMessage("")} />
      <PaymentModal open={paymentOpen} onConfirm={handlePaymentSuccess} onClose={() => setPaymentOpen(false)} />
      <AppUnlockModal
        open={appUnlockOpen}
        onConfirm={handleAppDownloadMock}
        onClose={() => setAppUnlockOpen(false)}
      />
      <FullProfileFormModal
        open={fullProfileFormOpen}
        form={fullProfileForm}
        isSubmitting={isGeneratingFullProfile}
        onChange={setFullProfileForm}
        onSubmit={handleGenerateFullProfile}
        onClose={() => setFullProfileFormOpen(false)}
      />
      <Toast message={toastMessage} />
    </main>
  );
}
