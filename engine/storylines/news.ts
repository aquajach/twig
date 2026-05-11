import type { StorylineGraph } from '@/engine/types';

export const news: StorylineGraph = {
  id: 'news',
  title: '整合財經新聞',
  nodes: {
    'task-news-report-sarah': {
      type: 'task',
      task: {
        id: 'task-news-report-sarah',
        title: '向 Sarah 匯報新聞設計',
        description: '同 Sarah 交代你同 Andy 喺 Fikma 嘅單篇新聞稿方向同重點。',
      },
      layout: {
        x: -525,
        y: 990,
      },
    },
    'unlock-news-aurora': {
      type: 'unlock_browser_page',
      pageId: 'news-ref-aurora',
      layout: {
        x: -520,
        y: -360,
      },
    },
    'unlock-news-globe': {
      type: 'unlock_browser_page',
      pageId: 'news-ref-globe',
      layout: {
        x: -520,
        y: -260,
      },
    },
    'unlock-news-pulse': {
      type: 'unlock_browser_page',
      pageId: 'news-ref-pulse',
      layout: {
        x: -520,
        y: -160,
      },
    },
    'unlock-fikma-news': {
      type: 'unlock_browser_page',
      pageId: 'fikma',
      layout: {
        x: -520,
        y: -60,
      },
    },
    'bs-fikma-news-bootstrap': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        activeScreenId: 'news-ebanking-mockup',
        screens: [
          {
            id: 'chart-final',
            name: '總資產配置圖表',
            screenKey: 'asset-allocation-pie-mockup',
            props: {
              chartOffBrand: false,
            },
          },
          {
            id: 'news-ebanking-mockup',
            name: '財經新聞單篇',
            screenKey: 'ebanking-news-article-mockup',
            props: {
              title: '獅銀晨報｜利率展望點睇',
              body: '市場預期環球央行政策走向將影響本地資金成本，分析師提醒投資者留意流動性同匯率雙重因素，配置宜保持彈性。',
            },
          },
        ],
      },
      layout: {
        x: -510,
        y: 30,
      },
    },
    'ctx-andy-news-ideation': {
      type: 'context',
      npcId: 'andy',
      contextKey: 'knows-news-ideation-brief',
      layout: {
        x: -525,
        y: -495,
      },
    },
    'news-bootstrap': {
      type: 'step',
      description: 'Issue 3 starts: unlock refs + Fikma news mockup',
      createTask: ['n-20dd19656d12', 'n-9500f1e8cebf', 'task-news-report-sarah'],
      unlockContext: ['ctx-andy-news-ideation'],
      unlock_browser_page: ['unlock-fikma-news', 'unlock-news-aurora', 'unlock-news-globe', 'unlock-news-pulse'],
      updatePageState: ['bs-fikma-news-bootstrap'],
      layout: {
        x: -1305,
        y: -150,
      },
    },
    'evt-first-chat-andy-news': {
      type: 'evt_chat_message_sent',
      npcId: 'andy',
      enabledBy: ['news-bootstrap'],
      layout: {
        x: 105,
        y: -270,
      },
    },
    'step-news-design-open': {
      type: 'step',
      triggeredBy: ['evt-first-chat-andy-news', 'news-bootstrap'],
      layout: {
        x: 360,
        y: 0,
      },
    },
    'bs-news-show-date': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        newsShowDate: true,
      },
      layout: {
        x: 1305,
        y: -990,
      },
    },
    'bs-news-show-ticker': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        newsShowTickerLink: true,
      },
      layout: {
        x: 1305,
        y: -720,
      },
    },
    'bs-news-show-chart': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        newsShowMiniChart: true,
      },
      layout: {
        x: 1305,
        y: -465,
      },
    },
    'bs-news-show-reactions': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        newsShowReactions: true,
      },
      layout: {
        x: 1305,
        y: -210,
      },
    },
    'bs-news-show-comments': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        newsShowComments: true,
      },
      layout: {
        x: 1305,
        y: 45,
      },
    },
    'bs-news-show-author': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        newsShowAuthor: true,
      },
      layout: {
        x: 1305,
        y: 315,
      },
    },
    'bs-news-show-tags': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        newsShowCategoryChips: true,
      },
      layout: {
        x: 1305,
        y: 570,
      },
    },
    'bs-news-show-share': {
      type: 'browser_state',
      pageId: 'fikma',
      mode: 'update',
      state: {
        newsShowShareButton: true,
      },
      layout: {
        x: 1305,
        y: 840,
      },
    },
    'evt-intent-andy-date': {
      type: 'evt_intent_sent',
      npcId: 'andy',
      statementText:
        'Player asks Andy to add a published date or timestamp to the single headline news article mockup.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 825,
        y: -1050,
      },
    },
    'evt-intent-andy-ticker': {
      type: 'evt_intent_sent',
      npcId: 'andy',
      statementText: 'Player asks Andy to add a stock ticker or related symbol link to the news article mockup.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 825,
        y: -780,
      },
    },
    'evt-intent-andy-chart': {
      type: 'evt_intent_sent',
      npcId: 'andy',
      statementText: 'Player asks Andy to add a small inline price or performance chart to the news article mockup.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 825,
        y: -525,
      },
    },
    'evt-intent-andy-reactions': {
      type: 'evt_intent_sent',
      npcId: 'andy',
      statementText: 'Player asks Andy to add reaction buttons or emoji reactions to the news article mockup.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 825,
        y: -270,
      },
    },
    'evt-intent-andy-comments': {
      type: 'evt_intent_sent',
      npcId: 'andy',
      statementText: 'Player asks Andy to add a comment section or comment thread to the news article mockup.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 825,
        y: -15,
      },
    },
    'evt-intent-andy-author': {
      type: 'evt_intent_sent',
      npcId: 'andy',
      statementText: 'Player asks Andy to add an author byline or author line to the news article mockup.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 825,
        y: 255,
      },
    },
    'evt-intent-andy-tags': {
      type: 'evt_intent_sent',
      npcId: 'andy',
      statementText: 'Player asks Andy to add category tags or topic chips to the news article mockup.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 825,
        y: 510,
      },
    },
    'evt-intent-andy-share': {
      type: 'evt_intent_sent',
      npcId: 'andy',
      statementText: 'Player asks Andy to add a share button to the news article mockup.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 825,
        y: 765,
      },
    },
    'step-news-feat-date': {
      type: 'step',
      triggeredBy: ['evt-intent-andy-date', 'step-news-design-open'],
      updatePageState: ['bs-news-show-date'],
      layout: {
        x: 1065,
        y: -1050,
      },
    },
    'step-news-feat-ticker': {
      type: 'step',
      triggeredBy: ['evt-intent-andy-ticker', 'step-news-design-open'],
      updatePageState: ['bs-news-show-ticker'],
      layout: {
        x: 1065,
        y: -780,
      },
    },
    'step-news-feat-chart': {
      type: 'step',
      triggeredBy: ['evt-intent-andy-chart', 'step-news-design-open'],
      updatePageState: ['bs-news-show-chart'],
      layout: {
        x: 1065,
        y: -525,
      },
    },
    'step-news-feat-reactions': {
      type: 'step',
      triggeredBy: ['evt-intent-andy-reactions', 'step-news-design-open'],
      updatePageState: ['bs-news-show-reactions'],
      layout: {
        x: 1065,
        y: -270,
      },
    },
    'step-news-feat-comments': {
      type: 'step',
      triggeredBy: ['evt-intent-andy-comments', 'step-news-design-open'],
      updatePageState: ['bs-news-show-comments'],
      layout: {
        x: 1065,
        y: -15,
      },
    },
    'step-news-feat-author': {
      type: 'step',
      triggeredBy: ['evt-intent-andy-author', 'step-news-design-open'],
      updatePageState: ['bs-news-show-author'],
      layout: {
        x: 1065,
        y: 255,
      },
    },
    'step-news-feat-tags': {
      type: 'step',
      triggeredBy: ['evt-intent-andy-tags', 'step-news-design-open'],
      updatePageState: ['bs-news-show-tags'],
      layout: {
        x: 1065,
        y: 510,
      },
    },
    'step-news-feat-share': {
      type: 'step',
      triggeredBy: ['evt-intent-andy-share', 'step-news-design-open'],
      updatePageState: ['bs-news-show-share'],
      layout: {
        x: 1065,
        y: 765,
      },
    },
    'evt-intent-manager-news-report': {
      type: 'evt_intent_sent',
      npcId: 'manager',
      statementText:
        'Player reports the e-banking headline news article design direction to Sarah, summarizing what the Fikma mockup now includes.',
      enabledBy: ['step-news-design-open'],
      layout: {
        x: 705,
        y: 1380,
      },
    },
    'memo-news-complete': {
      type: 'memo',
      memo: {
        id: 'memo-news-complete',
        title: '新聞稿方向定調',
        description: '你已完成財經新聞單篇展示的設計梳理，並向 Sarah 匯報。',
        icon: '📰',
      },
      layout: {
        x: 1455,
        y: 1260,
      },
    },
    'unlock-intranet-ceo': {
      type: 'unlock_browser_page',
      pageId: 'lion-intranet-ceo-post',
      layout: {
        x: 1440,
        y: 1815,
      },
    },
    'step-news-report-sarah': {
      type: 'step',
      triggeredBy: ['evt-intent-manager-news-report', 'step-news-design-open'],
      completeTask: ['n-20dd19656d12', 'task-news-report-sarah'],
      unlock_browser_page: ['unlock-intranet-ceo'],
      grantMemo: ['memo-news-complete'],
      layout: {
        x: 1065,
        y: 1365,
      },
    },
    'wetalk-ceo-intranet': {
      type: 'wetalk_link',
      npcId: 'manager',
      linkLabel: '內聯網｜CEO 總結帖文',
      pageId: 'lion-intranet-ceo-post',
      layout: {
        x: 1785,
        y: 1485,
      },
    },
    'ss-news-storyline-completed': {
      type: 'storyline_state',
      storylineId: 'news',
      status: 'completed',
      layout: {
        x: 1785,
        y: 1665,
      },
    },
    'step-news-share-ceo-link': {
      type: 'step',
      triggeredBy: ['step-news-report-sarah'],
      wetalkLink: ['wetalk-ceo-intranet'],
      setStorylineState: ['ss-news-storyline-completed'],
      layout: {
        x: 1455,
        y: 1455,
      },
    },
    'memo-news-brainstorm': {
      type: 'memo',
      memo: {
        id: 'memo-news-brainstorm',
        title: '集思廣益',
        description: '設計了使用所有參考元素，涵蓋日期、股票連結、圖表、反應、留言、作者、標籤與分享。',
        icon: '💡',
      },
      layout: {
        x: 2265,
        y: 1125,
      },
    },
    'step-news-bonus-all-features': {
      type: 'step',
      triggeredBy: [
        'step-news-feat-author',
        'step-news-feat-chart',
        'step-news-feat-comments',
        'step-news-feat-date',
        'step-news-feat-reactions',
        'step-news-feat-share',
        'step-news-feat-tags',
        'step-news-feat-ticker',
      ],
      grantMemo: ['memo-news-brainstorm'],
      layout: {
        x: 1995,
        y: 1065,
      },
    },
    'n-9500f1e8cebf': {
      type: 'task',
      task: {
        id: 'n-9500f1e8cebf',
        title: '參考三個新聞網頁',
        description: '用瀏覽器開啟三個參考新聞網站，留意版面同元素。',
      },
      layout: {
        x: -525,
        y: -1260,
      },
    },
    'n-f16236524862': {
      type: 'evt_browser_page_visited',
      pageId: 'news-ref-aurora',
      enabledBy: ['news-bootstrap'],
      layout: {
        x: -525,
        y: -825,
      },
    },
    'n-25b8c77b8061': {
      type: 'evt_browser_page_visited',
      pageId: 'news-ref-globe',
      enabledBy: ['news-bootstrap'],
      layout: {
        x: -525,
        y: -690,
      },
    },
    'n-38b829126387': {
      type: 'evt_browser_page_visited',
      pageId: 'news-ref-pulse',
      layout: {
        x: -525,
        y: -960,
      },
    },
    'n-a52e71c5fe1f': {
      type: 'step',
      triggeredBy: ['n-25b8c77b8061', 'n-38b829126387', 'n-f16236524862'],
      completeTask: ['n-9500f1e8cebf'],
      layout: {
        x: -180,
        y: -885,
      },
    },
    'n-20dd19656d12': {
      type: 'task',
      task: {
        id: 'n-20dd19656d12',
        title: '與 Andy 討論新聞篇章設計',
        description: '參考其他新聞網頁，在獅銀新聞頁設計中使用相同元素。',
      },
      layout: {
        x: -525,
        y: -1530,
      },
    },
  },
  initialStatus: 'locked',
  introCard: {
    label: 'Issue 3',
  },
};
