export type Language = "en" | "vi";

export interface Translations {
  common: {
    appName: string;
    cancel: string;
    submit: string;
    understood: string;
    close: string;
    error: string;
    signIn: string;
    signOut: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    share: string;
    newChat: string;
    sendMessage: string;
    aiDisclaimer: string;
    back: string;
    home: string;
    next: string;
    confirm: string;
    or: string;
  };
  chat: {
    howCanIHelp: string;
    howCanIHelpSubtitle: string;
    writing: string;
    speaking: string;
    reading: string;
    listening: string;
    writingDescription: string;
    speakingDescription: string;
    readingDescription: string;
    listeningDescription: string;
    noMessages: string;
    typeMessage: string;
    linkCopied: string;
    collapseSidebar: string;
    toggleSidebar: string;
    expandSidebar: string;
    deleteConversation: string;
    deleteConfirmation: string;
    untitledConversation: string;
    renameConversation: string;
    searchingKnowledge: string;
  };
  writing: {
    startWriting: string;
    submitExistingEssay: string;
    task1: string;
    task2: string;
    question: string;
    essay: string;
    wordCount: string;
    submit: string;
    uploadImage: string;
    dragDropImage: string;
    timerExpired: string;
    timerExpiredMessage: string;
    startTest: string;
    questionText: string;
    writeYourEssay: string;
    pasteYourEssay: string;
    minutes: string;
    selectTask: string;
    task1Description: string;
    task2Description: string;
    backConfirmation: string;
    enterQuestion: string;
    uploadedChart: string;
    taskChart: string;
  };
  speaking: {
    part1: string;
    part2: string;
    part3: string;
    startSpeaking: string;
    showText: string;
    recording: string;
    speakingFeedback: string;
    tapToSpeak: string;
    autoplay: string;
    hideText: string;
    preparingQuestion: string;
    part1Description: string;
    part2Description: string;
    part3Description: string;
  };
  feedback: {
    taskResponse: string;
    coherenceCohesion: string;
    lexicalResource: string;
    grammaticalRange: string;
    strengths: string;
    weaknesses: string;
    noWeaknesses: string;
    correction: string;
    correctedEssay: string;
    expandIdeas: string;
    alternativeApproach: string;
    alternativeDirection: string;
    alternativeEssay: string;
    improvedVersion: string;
    vocabularyExplanations: string;
    bandScore: string;
    keyChanges: string;
    overview: string;
    taskAchievement: string;
    viewSubmission: string;
    viewFeedback: string;
    original: string;
    corrected: string;
    waitingForFeedback: string;
    overall: string;
    assessmentFailed: string;
    assessmentPartialError: string;
    retry: string;
    viewBandDescriptors: string;
    bandDescriptors: string;
  };
  onboarding: {
    chooseLanguage: string;
    languageRecommendation: string;
    continueWithGoogle: string;
    continueWithoutAccount: string;
    signInBenefits: string;
    welcome: string;
    recommended: string;
  };
  practice: {
    ieltsReading: string;
    ieltsListening: string;
    listeningLab: string;
    passage: string;
    questions: string;
    answerSheet: string;
    answered: string;
    readingDataNotReady: string;
    listeningDataNotReady: string;
    readingDataMissing: string;
    listeningDataMissing: string;
    backToChat: string;
    aiReadingFeedback: string;
    aiListeningFeedback: string;
    reviewingAnswers: string;
    strengths: string;
    focusAreas: string;
    strategy: string;
    questionReview: string;
    yourAnswer: string;
    correctAnswer: string;
    evidence: string;
    correct: string;
    review: string;
    section: string;
    audioConsole: string;
    stopAudio: string;
    playDemoAudio: string;
    seedAudioNote: string;
    noAudioAttached: string;
    answerProgress: string;
    transcriptLocked: string;
    noScriptDuringTest: string;
    transcript: string;
    typeYourAnswer: string;
    chooseAnswers: string;
    readingFallbackOverview: string;
    listeningFallbackOverview: string;
    readingFallbackStrategy: string;
    listeningFallbackTranscriptStrategy: string;
    listeningFallbackAudioStrategy: string;
  };
  admin: {
    manageExams: string;
    title: string;
    subtitle: string;
    createWriting: string;
    createSpeaking: string;
    createReading: string;
    createListening: string;
    description: string;
    saveExam: string;
    writingCreated: string;
    speakingCreated: string;
    readingCreated: string;
    listeningCreated: string;
    signInRequired: string;
    failedWriting: string;
    failedSpeaking: string;
    failedReading: string;
    failedListening: string;
    testTitle: string;
    taskNumber: string;
    partNumber: string;
    imageUrl: string;
    sourceUrl: string;
    questionContent: string;
    passageTitle: string;
    difficulty: string;
    passageText: string;
    sections: string;
    addSection: string;
    section: string;
    sectionNumber: string;
    sectionTitle: string;
    audioUrl: string;
    privateTranscript: string;
    importPdf: string;
    importingPdf: string;
    pdfImported: string;
    pdfImportFailed: string;
    audioUrlPlaceholder: string;
    privateTranscriptPlaceholder: string;
    speakingContentPlaceholder: string;
    questions: string;
    addQuestion: string;
    question: string;
    questionType: string;
    correctAnswer: string;
    questionText: string;
    options: string;
    optionsPlaceholder: string;
    explanation: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      appName: "Examinai",
      cancel: "Cancel",
      submit: "Submit",
      understood: "Understood",
      close: "Close",
      error: "Something went wrong. Please try again.",
      signIn: "Sign In",
      signOut: "Sign Out",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      share: "Share",
      newChat: "New Chat",
      sendMessage: "Send Message",
      aiDisclaimer: "AI-generated feedback may be inaccurate. Only use it as a guide.",
      back: "Back",
      home: "Home",
      next: "Next",
      confirm: "Confirm",
      or: "or",
    },
    chat: {
      howCanIHelp: "How can I help with your IELTS today?",
      howCanIHelpSubtitle: "Choose a skill card to start practicing, or ask any question by sending a message",
      writing: "Writing",
      speaking: "Speaking",
      reading: "Reading",
      listening: "Listening",
      writingDescription: "Take a timed test or submit an existing essay for detailed feedback.",
      speakingDescription: "Practice with an AI examiner that asks questions and gives real-time feedback.",
      readingDescription: "Practice passage-based questions with instant answer review.",
      listeningDescription: "Practice audio-based questions with instant answer review.",
      noMessages: "No messages yet",
      typeMessage: "Send a message...",
      linkCopied: "Link copied to clipboard!",
      collapseSidebar: "Collapse sidebar",
      toggleSidebar: "Toggle sidebar",
      expandSidebar: "Expand sidebar",
      deleteConversation: "Delete Conversation",
      deleteConfirmation: "Are you sure you want to delete this conversation? This action cannot be undone.",
      untitledConversation: "Untitled Conversation",
      renameConversation: "Rename Conversation",
      searchingKnowledge: "Searching knowledge base",
    },
    writing: {
      startWriting: "Start Writing",
      submitExistingEssay: "Submit Existing Essay",
      task1: "Task 1",
      task2: "Task 2",
      question: "Question",
      essay: "Essay",
      wordCount: "Word Count",
      submit: "Submit",
      uploadImage: "Upload Image",
      dragDropImage: "Drag and drop an image, or click to upload",
      timerExpired: "Time's Up!",
      timerExpiredMessage: "Your time has expired. Your essay has been submitted automatically.",
      startTest: "Start",
      questionText: "Question",
      writeYourEssay: "Write your essay here...",
      pasteYourEssay: "Paste your essay here...",
      minutes: "minutes",
      selectTask: "Select Task Type",
      task1Description: "Describe visual information (graph, chart, table, map, or diagram)",
      task2Description: "Respond to a point of view, argument, or problem",
      backConfirmation: "Your progress will be lost. Are you sure you want to go back?",
      enterQuestion: "Enter the essay question...",
      uploadedChart: "Uploaded chart",
      taskChart: "Task chart",
    },
    speaking: {
      part1: "Part 1",
      part2: "Part 2",
      part3: "Part 3",
      startSpeaking: "Start",
      showText: "Show Text",
      recording: "Recording...",
      speakingFeedback: "Feedback",
      tapToSpeak: "Tap to speak",
      autoplay: "Autoplay audio",
      hideText: "Hide Text",
      preparingQuestion: "Preparing question...",
      part1Description: "Answer questions about yourself",
      part2Description: "Given a topic card, prepare for 1 minute, then speak for 1-2 minutes",
      part3Description: "Discuss abstract issues/ideas related to Part 2's topic",
    },
    feedback: {
      taskResponse: "Task Response",
      coherenceCohesion: "Coherence & Cohesion",
      lexicalResource: "Lexical Resource",
      grammaticalRange: "Grammatical Range & Accuracy",
      strengths: "Strengths",
      weaknesses: "Areas for Improvement",
      noWeaknesses: "None. Well done!",
      correction: "Correction",
      correctedEssay: "Corrected Essay",
      expandIdeas: "Expand Your Ideas",
      alternativeApproach: "Alternative Approach",
      alternativeDirection: "Direction",
      alternativeEssay: "Alternative Essay",
      improvedVersion: "Improved Version",
      vocabularyExplanations: "Vocabulary",
      bandScore: "Band Score",
      keyChanges: "Key Changes",
      overview: "Overview",
      taskAchievement: "Task Achievement",
      viewSubmission: "View Submission",
      viewFeedback: "View Feedback",
      original: "Original",
      corrected: "Corrected",
      waitingForFeedback: "Waiting for feedback...",
      overall: "Overall",
      assessmentFailed: "Assessment Failed",
      assessmentPartialError: "Some feedback could not be generated.",
      retry: "Retry",
      viewBandDescriptors: "View Band Descriptors",
      bandDescriptors: "Band Descriptors",
    },
    onboarding: {
      chooseLanguage: "Choose Your Language",
      languageRecommendation: "We recommend using English for the best results.",
      continueWithGoogle: "Continue with Google",
      continueWithoutAccount: "Continue without an account",
      signInBenefits: "Sign in to save your progress, track your scores, and access your practice history across devices.",
      welcome: "Welcome to Examinai",
      recommended: "Recommended",
    },
    practice: {
      ieltsReading: "IELTS Reading",
      ieltsListening: "IELTS Listening",
      listeningLab: "Listening Lab",
      passage: "Passage",
      questions: "Questions",
      answerSheet: "Answer sheet",
      answered: "answered",
      readingDataNotReady: "Reading data not ready",
      listeningDataNotReady: "Listening data not ready",
      readingDataMissing: "No Reading data found. Run db/reading-schema.sql and db/seed-reading.sql first.",
      listeningDataMissing: "No Listening data found. Run db/listening-schema.sql and db/seed-listening.sql first.",
      backToChat: "Back to chat",
      aiReadingFeedback: "AI Reading feedback",
      aiListeningFeedback: "AI Listening feedback",
      reviewingAnswers: "Reviewing your answers...",
      strengths: "Strengths",
      focusAreas: "Focus areas",
      strategy: "Strategy",
      questionReview: "Question review",
      yourAnswer: "Your answer",
      correctAnswer: "Correct answer",
      evidence: "Evidence",
      correct: "Correct",
      review: "Review",
      section: "Section",
      audioConsole: "Audio console",
      stopAudio: "Stop audio",
      playDemoAudio: "Play demo audio",
      seedAudioNote: "Seed data uses browser speech when no audio URL exists.",
      noAudioAttached: "No audio URL is attached to this Listening section.",
      answerProgress: "Answer progress",
      transcriptLocked: "Transcript is locked until you submit your answers, matching Listening practice behavior.",
      noScriptDuringTest: "Use the audio player to answer the questions. No script is shown during the test.",
      transcript: "Transcript",
      typeYourAnswer: "Type your answer",
      chooseAnswers: "Choose {count} answers.",
      readingFallbackOverview: "Your answers have been checked, but AI feedback is unavailable right now.",
      listeningFallbackOverview: "Your answers have been checked, but AI feedback is unavailable right now.",
      readingFallbackStrategy: "Review each explanation and identify the exact sentence in the passage that supports the correct answer.",
      listeningFallbackTranscriptStrategy: "Review the transcript and compare it with each explanation. Notice where the speaker corrected or paraphrased key information.",
      listeningFallbackAudioStrategy: "Review each explanation and replay the audio if available. Notice where the speaker corrected or paraphrased key information.",
    },
    admin: {
      manageExams: "Manage exams",
      title: "Exam Admin",
      subtitle: "Add Writing, Speaking, Reading, and Listening exams to the database.",
      createWriting: "Create Writing Question",
      createSpeaking: "Create Speaking Question",
      createReading: "Create Reading Exam",
      createListening: "Create Listening Exam",
      description: "Use the relevant IELTS fields. Options are one per line for Reading and Listening.",
      saveExam: "Save exam",
      writingCreated: "Writing question created.",
      speakingCreated: "Speaking question created.",
      readingCreated: "Reading exam created.",
      listeningCreated: "Listening exam created.",
      signInRequired: "Please sign in before using admin forms.",
      failedWriting: "Failed to create writing question.",
      failedSpeaking: "Failed to create speaking question.",
      failedReading: "Failed to create reading exam.",
      failedListening: "Failed to create listening exam.",
      testTitle: "Test title",
      taskNumber: "Task number",
      partNumber: "Part number",
      imageUrl: "Image URL",
      sourceUrl: "Source URL",
      questionContent: "Question content",
      passageTitle: "Passage title",
      difficulty: "Difficulty",
      passageText: "Passage text",
      sections: "Sections",
      addSection: "Add section",
      section: "Section",
      sectionNumber: "Section number",
      sectionTitle: "Section title",
      audioUrl: "Audio URL",
      privateTranscript: "Private transcript",
      importPdf: "Import PDF",
      importingPdf: "Importing PDF...",
      pdfImported: "PDF imported into the form.",
      pdfImportFailed: "Failed to import PDF.",
      audioUrlPlaceholder: "Primary source for Listening practice",
      privateTranscriptPlaceholder: "Optional. Used only for review after submit and AI feedback, not shown before the learner submits.",
      speakingContentPlaceholder: "For Part 1/3, enter questions line by line. For Part 2, enter the cue card.",
      questions: "Questions",
      addQuestion: "Add question",
      question: "Question",
      questionType: "Question type",
      correctAnswer: "Correct answer",
      questionText: "Question text",
      options: "Options",
      optionsPlaceholder: "One option per line",
      explanation: "Explanation",
    },
  },
  vi: {
    common: {
      appName: "Examinai",
      cancel: "Hủy",
      submit: "Gửi",
      understood: "Đã hiểu",
      close: "Đóng",
      error: "Đã xảy ra lỗi. Vui lòng thử lại.",
      signIn: "Đăng nhập",
      signOut: "Đăng xuất",
      language: "Ngôn ngữ",
      theme: "Giao diện",
      light: "Sáng",
      dark: "Tối",
      share: "Chia sẻ",
      newChat: "Trò chuyện mới",
      sendMessage: "Gửi tin nhắn",
      aiDisclaimer: "Phản hồi từ AI mang tính chất tham khảo và có thể không chính xác.",
      back: "Quay lại",
      home: "Trang chủ",
      next: "Tiếp theo",
      confirm: "Xác nhận",
      or: "hoặc",
    },
    chat: {
      howCanIHelp: "Mình có thể giúp gì cho bạn về IELTS?",
      howCanIHelpSubtitle: "Chọn một kỹ năng để bắt đầu luyện tập, hoặc nhắn tin để hỏi mình bất cứ điều gì nhé",
      writing: "Viết",
      speaking: "Nói",
      reading: "Đọc",
      listening: "Nghe",
      writingDescription: "Làm bài thi thử hoặc nộp bài viết có sẵn để nhận phản hồi chi tiết.",
      speakingDescription: "Luyện tập với giám khảo AI, trả lời và nhận phản hồi ngay lập tức.",
      readingDescription: "Luyện câu hỏi theo bài đọc và xem đáp án ngay.",
      listeningDescription: "Luyện câu hỏi theo audio và xem đáp án ngay.",
      noMessages: "Chưa có tin nhắn",
      typeMessage: "Gửi tin nhắn...",
      linkCopied: "Đã sao chép liên kết!",
      collapseSidebar: "Thu gọn thanh bên",
      toggleSidebar: "Mở/đóng thanh bên",
      expandSidebar: "Mở rộng thanh bên",
      deleteConversation: "Xóa cuộc trò chuyện",
      deleteConfirmation: "Bạn có chắc muốn xóa cuộc trò chuyện này? Sau khi xóa sẽ không thể khôi phục lại.",
      untitledConversation: "Chưa đặt tên",
      renameConversation: "Đổi tên cuộc trò chuyện",
      searchingKnowledge: "Đang tìm kiếm tài liệu",
    },
    writing: {
      startWriting: "Bắt đầu viết",
      submitExistingEssay: "Gửi bài viết có sẵn",
      task1: "Task 1",
      task2: "Task 2",
      question: "Câu hỏi",
      essay: "Bài viết",
      wordCount: "Số từ",
      submit: "Nộp bài",
      uploadImage: "Tải ảnh lên",
      dragDropImage: "Kéo thả ảnh, hoặc nhấn để tải lên",
      timerExpired: "Hết giờ!",
      timerExpiredMessage: "Thời gian đã hết. Bài viết của bạn đã được nộp tự động.",
      startTest: "Bắt đầu",
      questionText: "Câu hỏi",
      writeYourEssay: "Viết bài ở đây...",
      pasteYourEssay: "Dán bài viết ở đây...",
      minutes: "phút",
      selectTask: "Chọn task",
      task1Description: "Mô tả thông tin trực quan (biểu đồ, bảng, bản đồ hoặc sơ đồ)",
      task2Description: "Phản hồi quan điểm, lập luận hoặc vấn đề",
      backConfirmation: "Tiến trình sẽ bị mất. Bạn có chắc muốn quay lại?",
      enterQuestion: "Nhập câu hỏi bài viết...",
      uploadedChart: "Biểu đồ đã tải lên",
      taskChart: "Biểu đồ bài thi",
    },
    speaking: {
      part1: "Part 1",
      part2: "Part 2",
      part3: "Part 3",
      startSpeaking: "Bắt đầu",
      showText: "Xem chữ",
      recording: "Đang ghi âm...",
      speakingFeedback: "Nhận xét",
      tapToSpeak: "Nhấn để nói",
      autoplay: "Tự động phát âm thanh",
      hideText: "Ẩn chữ",
      preparingQuestion: "Đang chuẩn bị câu hỏi...",
      part1Description: "Trả lời câu hỏi về bản thân",
      part2Description: "Nhận chủ đề, chuẩn bị 1 phút, sau đó nói 1-2 phút",
      part3Description: "Thảo luận vấn đề trừu tượng liên quan đến chủ đề Part 2",
    },
    feedback: {
      taskResponse: "Đáp ứng yêu cầu",
      coherenceCohesion: "Độ mạch lạc",
      lexicalResource: "Từ vựng",
      grammaticalRange: "Ngữ pháp",
      strengths: "Điểm mạnh",
      weaknesses: "Cần cải thiện",
      noWeaknesses: "Không có. Bạn làm tốt lắm!",
      correction: "Chỉnh sửa",
      correctedEssay: "Bài viết đã sửa",
      expandIdeas: "Phát triển ý tưởng",
      alternativeApproach: "Cách tiếp cận khác",
      alternativeDirection: "Hướng đi",
      alternativeEssay: "Bài viết thay thế",
      improvedVersion: "Bản cải thiện",
      vocabularyExplanations: "Từ vựng",
      bandScore: "Điểm",
      keyChanges: "Thay đổi chính",
      overview: "Tổng quan",
      taskAchievement: "Mức độ hoàn thành",
      viewSubmission: "Xem bài viết",
      viewFeedback: "Xem nhận xét",
      original: "Bài gốc",
      corrected: "Đã sửa",
      waitingForFeedback: "Đang chờ nhận xét...",
      overall: "Tổng",
      assessmentFailed: "Chấm bài thất bại",
      assessmentPartialError: "Một số nhận xét không thể tạo được.",
      retry: "Thử lại",
      viewBandDescriptors: "Xem tiêu chí chấm điểm",
      bandDescriptors: "Tiêu chí chấm điểm",
    },
    onboarding: {
      chooseLanguage: "Chọn ngôn ngữ",
      languageRecommendation: "Nên dùng tiếng Anh để có kết quả tốt nhất.",
      continueWithGoogle: "Tiếp tục với Google",
      continueWithoutAccount: "Tiếp tục không cần tài khoản",
      signInBenefits: "Đăng nhập để lưu tiến trình, theo dõi điểm số và xem lại lịch sử luyện tập trên mọi thiết bị.",
      welcome: "Chào mừng đến với Examinai",
      recommended: "Đề xuất",
    },
    practice: {
      ieltsReading: "IELTS Reading",
      ieltsListening: "IELTS Listening",
      listeningLab: "Phòng luyện nghe",
      passage: "Bài đọc",
      questions: "Câu hỏi",
      answerSheet: "Phiếu trả lời",
      answered: "đã trả lời",
      readingDataNotReady: "Dữ liệu Reading chưa sẵn sàng",
      listeningDataNotReady: "Dữ liệu Listening chưa sẵn sàng",
      readingDataMissing: "Chưa có dữ liệu Reading. Hãy chạy db/reading-schema.sql và db/seed-reading.sql trước.",
      listeningDataMissing: "Chưa có dữ liệu Listening. Hãy chạy db/listening-schema.sql và db/seed-listening.sql trước.",
      backToChat: "Quay lại chat",
      aiReadingFeedback: "Nhận xét Reading từ AI",
      aiListeningFeedback: "Nhận xét Listening từ AI",
      reviewingAnswers: "Đang xem lại câu trả lời...",
      strengths: "Điểm mạnh",
      focusAreas: "Cần tập trung",
      strategy: "Chiến lược",
      questionReview: "Nhận xét từng câu",
      yourAnswer: "Đáp án của bạn",
      correctAnswer: "Đáp án đúng",
      evidence: "Dẫn chứng",
      correct: "Đúng",
      review: "Xem lại",
      section: "Section",
      audioConsole: "Bảng phát audio",
      stopAudio: "Dừng audio",
      playDemoAudio: "Phát audio mẫu",
      seedAudioNote: "Dữ liệu mẫu dùng giọng đọc của trình duyệt khi chưa có audio URL.",
      noAudioAttached: "Section Listening này chưa có audio URL.",
      answerProgress: "Tiến độ trả lời",
      transcriptLocked: "Transcript bị khóa cho đến khi bạn nộp bài, đúng với cách luyện Listening.",
      noScriptDuringTest: "Dùng audio player để trả lời câu hỏi. Script không được hiển thị trong lúc làm bài.",
      transcript: "Transcript",
      typeYourAnswer: "Nhập đáp án",
      chooseAnswers: "Chọn {count} đáp án.",
      readingFallbackOverview: "Đáp án của bạn đã được kiểm tra, nhưng hiện chưa có nhận xét AI.",
      listeningFallbackOverview: "Đáp án của bạn đã được kiểm tra, nhưng hiện chưa có nhận xét AI.",
      readingFallbackStrategy: "Xem lại từng giải thích và xác định câu trong bài đọc hỗ trợ đáp án đúng.",
      listeningFallbackTranscriptStrategy: "Xem lại transcript và so sánh với từng giải thích. Chú ý nơi người nói sửa thông tin hoặc paraphrase.",
      listeningFallbackAudioStrategy: "Xem lại từng giải thích và nghe lại audio nếu có. Chú ý nơi người nói sửa thông tin hoặc paraphrase.",
    },
    admin: {
      manageExams: "Quản lý đề",
      title: "Quản trị đề thi",
      subtitle: "Thêm đề Writing, Speaking, Reading và Listening vào cơ sở dữ liệu.",
      createWriting: "Tạo câu hỏi Writing",
      createSpeaking: "Tạo câu hỏi Speaking",
      createReading: "Tạo đề Reading",
      createListening: "Tạo đề Listening",
      description: "Nhập đúng trường cho từng kỹ năng IELTS. Options nhập mỗi dòng một lựa chọn cho Reading và Listening.",
      saveExam: "Lưu đề",
      writingCreated: "Đã tạo câu hỏi Writing.",
      speakingCreated: "Đã tạo câu hỏi Speaking.",
      readingCreated: "Đã tạo đề Reading.",
      listeningCreated: "Đã tạo đề Listening.",
      signInRequired: "Vui lòng đăng nhập trước khi dùng form admin.",
      failedWriting: "Không thể tạo câu hỏi Writing.",
      failedSpeaking: "Không thể tạo câu hỏi Speaking.",
      failedReading: "Không thể tạo đề Reading.",
      failedListening: "Không thể tạo đề Listening.",
      testTitle: "Tên bài thi",
      taskNumber: "Task",
      partNumber: "Part",
      imageUrl: "URL hình ảnh",
      sourceUrl: "URL nguồn",
      questionContent: "Nội dung câu hỏi",
      passageTitle: "Tiêu đề bài đọc",
      difficulty: "Độ khó",
      passageText: "Nội dung bài đọc",
      sections: "Các section",
      addSection: "Thêm section",
      section: "Section",
      sectionNumber: "Số section",
      sectionTitle: "Tiêu đề section",
      audioUrl: "Audio URL",
      privateTranscript: "Transcript riêng tư",
      importPdf: "Nhập từ PDF",
      importingPdf: "Đang nhập PDF...",
      pdfImported: "Đã nhập PDF vào form.",
      pdfImportFailed: "Không thể nhập PDF.",
      audioUrlPlaceholder: "Nguồn chính cho bài luyện Listening",
      privateTranscriptPlaceholder: "Không bắt buộc. Chỉ dùng để xem lại sau khi nộp và hỗ trợ nhận xét AI, không hiển thị trước khi người học nộp bài.",
      speakingContentPlaceholder: "Với Part 1/3, nhập từng câu hỏi theo dòng. Với Part 2, nhập cue card.",
      questions: "Câu hỏi",
      addQuestion: "Thêm câu hỏi",
      question: "Câu hỏi",
      questionType: "Loại câu hỏi",
      correctAnswer: "Đáp án đúng",
      questionText: "Nội dung câu hỏi",
      options: "Lựa chọn",
      optionsPlaceholder: "Mỗi dòng một lựa chọn",
      explanation: "Giải thích",
    },
  },
};
