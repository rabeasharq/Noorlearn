/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PlanForm,
  ArabicPlan,
  GRADES,
  SUBJECTS,
  PERIODS,
  LESSON_TYPES,
  INTRO_TYPES,
  ALPHA_STRATEGIES,
  CHALLENGES,
  OBJECTIVES,
  ERRORS,
  ASSESSMENTS,
  STRATEGIES,
  TOOLS,
  HOMEWORK,
  REVIEW_WEEKS,
  Stage
} from "../types";

export function fmtDate(ds: string): string {
  if (!ds) return "—";
  const d = new Date(ds);
  if (isNaN(d.getTime())) return ds;
  return `${d.getDate()} / ${d.getMonth() + 1} / ${d.getFullYear()}`;
}

export function buildStages(form: PlanForm, duration: number): Stage[] {
  const gn = Number(form.grade) || 7;
  const subject = form.subject;
  const progress = form.actualProgress || 'on_time';
  const psyche = form.psychState || 'focus_needed';
  const gap = form.unexpectedGap || 'none';
  const pages = form.bookPages || "ص 45 - ص 48";
  const unit = form.bookUnit || "الوحدة المنهجية";

  // Dynamic time allocation based on progress
  let introT = 5;
  let presentT = 12;
  let practiceT = 10;
  let assessT = 5;

  if (duration === 35) {
    if (progress === 'ahead') {
      introT = 6;
      presentT = 10; // Shorter explanation, more time for self-directed enrichment
      practiceT = 14; 
      assessT = 5;
    } else if (progress === 'behind') {
      introT = 5;
      presentT = 16; // Deeper explication, pacing deceleration
      practiceT = 9;  // Standard guided practice
      assessT = 5;
    } else {
      introT = 5;
      presentT = 13;
      practiceT = 12;
      assessT = 5;
    }
  } else { // 30 mins
    if (progress === 'ahead') {
      introT = 4;
      presentT = 8;
      practiceT = 13;
      assessT = 5;
    } else if (progress === 'behind') {
      introT = 5;
      presentT = 14;
      practiceT = 6;
      assessT = 5;
    } else {
      introT = 5;
      presentT = 11;
      practiceT = 9;
      assessT = 5;
    }
  }

  // Base activities depending on subject
  let introActs: string[] = [];
  let presentActs: string[] = [];
  let practiceActs: string[] = [];
  let assessActs: string[] = [];

  if (subject === 'grammar') {
    introActs = ["ربط نحوي بصري لعلامات الإعراب الحيوية وعرض الشواهد الكبرى", "تمهيد لغوي شيق يربط بين الكلمة ومعناها الهادف"];
    presentActs = [
      `قراءة الشواهد النحوية الرئيسية في ${unit} بالـ ${pages} وتحليل بنيتها اللفظية`,
      "الاستنباط التشاركي والتدريجي لقاعدة النحو بالاستعانة برسم هيكلي على السبورة الملونة"
    ];
    practiceActs = [
      `حل التطبيقات اللغوية والتمارين في ${pages} بمشاركة نشطة وإشراف المعلم`,
      "تطبيق فردي متدرج الصعوبة (سهل/متوسط) للتحقق من كفاءة الاستيعاب"
    ];
  } else if (subject === 'texts') {
    introActs = ["إضاءة أدبية مشوقة عن الكاتب أو شاعر النص الأدبي وعصره في اليمن", "إثارة المشاعر والوجدان المرتبط بالفكرة الأساسية والقيم الكبرى للنص"];
    presentActs = [
      `تلاوة النص الأدبي تلاوة نموذجية بليغة تراعي حركات الإعراب ومخارج الحروف في ص ${pages}`,
      "شرح الألفاظ اللغوية العميقة وصياغة مواطن البلاغة والجمال الفني في جدول تبسيطي"
    ];
    practiceActs = [
      `تحليل تفصيلي وتذوق بلاغي للنصوص والأبيات في ${pages} على دفاتر التلاميذ`,
      "إجراء نقاش تفاعلي زوجي من الطالب لزميله حول القيم والدروس المستفادة بالنص"
    ];
  } else if (subject === 'reading') {
    introActs = ["تفعيل مهارات العصف الذهني واستبصار التوقع بالاعتماد على صورة الدرس وعنوانه الرئيسي", "طرح التحدي القرائي للحصة وحث همم فرسان الضاد"];
    presentActs = [
      `توجيه الطلاب لممارسة مهارة القراءة الصامتة الهادفة والسريعة لفقرات ص ${pages}`,
      "مناقشة الأفكار الرئيسية للوقوف على دلالة الكلمات الجديدة وصياغتها في جمل واقعية"
    ];
    practiceActs = [
      `حل أسئلة الاستيعاب المنهجية وتحليل معاني ومقاصد النص في ${pages}`,
      "نشاط تلخيص شفهي سريع لـ 3 فقرات يعزز الفهم والتملك اللغوي للمعلومات"
    ];
  } else if (subject === 'dictation') {
    introActs = ["تدريب بصري لعزل وملاحظة الحروف المتشابهة صوتاً والمنبثقة عن اللهجة الدارجة", "طرح لغز إملائي خاطف ومحير لإثارة الذكاء الصفي"];
    presentActs = [
      `استقراء واستنتاج قانون الظاهرة الإملائية الحالية بربطها بكلمات ${pages}`,
      "النمذجة الحية خطوة بخطوة بالسبورة لطرق الرسم الصحيحة مع كشف الأخطاء الشائعة والتحذير منها"
    ];
    practiceActs = [
      `تطبيق الإملاء المنظور أو الاستماعي المركز المشتمل على كلمات ص ${pages}`,
      "تبادل الدفاتر للتصحيح المشترك مع قيام الطالب بصياغة الكلمة الصحيحة 3 مرات"
    ];
  } else if (subject === 'calligraphy') {
    introActs = ["عرض لوحة خطية رفيعة المستوى من أعمال الخطاطين اليمنيين تلهم الطلاب", "تدبر الجلسة السليمة وزاوية ميل الحرف وقبضة قلم الخط بالطمأنينة"];
    presentActs = [
      `نمذجة كتابة الحروف واتجاهات سير القلم بالأسهم الملونة على لوحة الفروق بـ ${pages}`,
      "توضيح نقاط ارتكاز الحرف على السطر والتمييز الدقيق لحروف خط النسخ أو الرقعة"
    ];
    practiceActs = [
      `ممارسة وتدريبات كراسة الخط بـ ${pages} بهدوء ونفس منتظم ومطمئن`,
      "التقييم الذاتي بالاعتماد على نموذج المعلم وتحديد أجمل سطر قام الطالب بكتابته"
    ];
  } else { // expression
    introActs = ["عصف وجداني بالصور والوسائل حول محور ومغزى الحصة الإنشائية وتوضيح أثره في حياتنا", "تحديد البنية الهيكلية للموضوع (المقدمة، المضمون، الخاتمة)"];
    presentActs = [
      `استعراض ومناقشة التراكيب البلاغية والروابط اللغوية في ${unit} ص ${pages}`,
      "صياغة المسودة المشتركة على السبورة لفتح آفاق الإبداع الفردي وتجاوز عقدة التعبير"
    ];
    practiceActs = [
      `الانطلاق في تحرير الموضوع الإنشائي بدفاتر الطلاب مستهدين بعناصر وأمثلة ص ${pages}`,
      "المراجعة النقاشية الزميلية وتصويب المفردات والأخطاء بالاعتماد على بنك التعبيرات الصديقة"
    ];
  }

  // Adjustments based on Book-Context Integration
  presentActs.push(`📖 التحام مرن مع الكتاب المدرسي الرقمي لليمن: تكييف طريقة معالجة تمارين وجمل ${pages} لتوائم الفروق اللحظية ومستوى كفاءة الطلاب.`);

  // Adjustments based on Psychological Layer (psyche)
  if (psyche === 'low_engage') {
    introActs.unshift("🎮 تفعيل الحيوية (Low Engagement): كسر جمود الطلاب بلعبة 'عجلة الحظ اللغوية' التنافسية وتوزيع نجوم التميز الفوري لإثارة الدافعية.");
    practiceActs.push("⭐ ممارسة ممتعة: استخدام بطاقات النجوم الإجرائية والتعلم النشط القائم على الحركة والتشجيع لتأمين مشاركة جماعية نشطة.");
  } else if (psyche === 'high_energy') {
    introActs.unshift("🧘 تفريغ الحماس (High Energy): تمارين تنظيم التنفس والتركيز الموجه الصامت للتأهب والاستماع المنصت.");
    practiceActs.push("✍️ نشاط صامت مكثف (توجيه الطاقة): كتابة هادئة ومنفردة لمدة 5 دقائق لتركيز الجهود وصقل الأفكار دون إحداث فوضى.");
  } else if (psyche === 'fatigue') {
    introActs.unshift("🎭 تخفيف الهبوط النفسي (Post-exam fatigue): إلقاء حنون وقصة درس دافئة تمزج موضوع المنهج بشق تاريخي يمني ممتع.");
    practiceActs.push("🤝 نقاش ميسر هادئ: تقليص الضغط المعرفي واستبداله بأسئلة سهلة من الزميل لزميله لضمان الراحة والاستيعاب التلقائي.");
  } else if (psyche === 'focus_needed') {
    introActs.unshift("⏱️ شحذ التركيز (Needs Focus): عصف ذهني سريع بتحدي 'الثواني السبع لستة كلمات' ووميض الملاحظة المعزز للسبورة.");
    practiceActs.push("🎯 تدوين تخصصي سريع: مهام كتابية صغيرة تستهدف نتيجة مباشرة وسريعة لتثبيت انتباه جيل ألفا.");
  }

  // Adjustments based on unexpectedGap (Remedial & Psychological Layer)
  if (gap === 'prereq_gaps') {
    presentActs.push("🛠️ ردم فجوة أساسية (أنتيك رمديال): تمليس فجوة المكتسبات السابقة عبر تخصيص 4 دقائق ميكرو-علاجية لتدبر وضبط حركات الإعراب أو الإملاء الأساسي.");
    practiceActs.unshift("💡 بطاقة قرين التعلم: يقارن الطالب متوسط التحصيل إجابته بالقرين المتقدم لتخطي الفجوة اللغوية.");
  } else if (gap === 'high_variance') {
    presentActs.push("⚖️ معالجة التفاوت الكبير: تقديم تفسير بمستويات متعددة (مبسط للمجتهدين الجدد - متوسط للجميع - متقدم للأبطال).");
    practiceActs.unshift("🪜 تمايز السلالم التعليمية: توزيع 3 درجات من تطبيقات صفحات الكتاب لتناسب جميع المستويات وتحقق الرضا والأنصاف.");
  } else if (gap === 'heavy_remedial') {
    presentActs.push("🚨 خطة ميكرو-علاجية طارئة: تجميد الحشو المعرفي الجانبي والتركيز المطلق على إدراك كتابة السطر وأسس الإملاء والإعراب الحيوية.");
    practiceActs.unshift("📝 ورشة تحسين عاجلة: تدريب علاجي فوري لنمذجة الأخطاء الشائعة المكتشفة وتلافيها بمزيد من التكرار الموجه.");
  }

  assessActs = ["سؤال ختامي فوري ذكي يقيس الفهم الحقيقي بناءً على مدخلات وتفاعل الحصة اللحظي", "توزيع نقاط التميز لأبطال الحصة الملتزمين", "توجيه الواجب المنزلي والتأكد من سلامة تدوينه بالكراسات"];

  const buildStageColor = (idx: number): string => {
    const bgs = ["bg-[#e8f2ff] dark:bg-[#1e293b]/50", "bg-[#e6faf0] dark:bg-[#0f172a]/50", "bg-[#fef9e7] dark:bg-[#1a202c]/50", "bg-[#fdf2f8] dark:bg-[#2d1b4e]/30"];
    return bgs[idx % bgs.length];
  };

  return [
    { name: "التهيئة النفسية والوجدانية الفورية", t: introT, acts: introActs, color: buildStageColor(0) },
    { name: `بناء وتفكيك الدرس (الكتاب ص ${pages})`, t: presentT, acts: presentActs, color: buildStageColor(1) },
    { name: "التفاعل الإجرائي والتطبيق المرن الموجه", t: practiceT, acts: practiceActs, color: buildStageColor(2) },
    { name: "التقويم اللحظي التراكمي وسؤال الإغلاق", t: assessT, acts: assessActs, color: buildStageColor(3) }
  ];
}

export function buildPlan(form: PlanForm): ArabicPlan {
  const gn = Number(form.grade) || 7;
  const g = GRADES[form.grade] || GRADES["7"];
  const sub = SUBJECTS[form.subject] || SUBJECTS["grammar"];
  const itk = form.introType || "real_life";
  const ltk = form.lessonType || "inductive";
  const ask = form.alphaStrategy || "stations";

  const objTemplates = OBJECTIVES[form.subject]?.[gn] || [];
  const objs = objTemplates.map(obj => `${obj} ${form.lessonTitle} بالاعتماد على صفحات الكتاب`);

  const errs = ERRORS[form.subject]?.[gn] || [];
  const rems = errs.map(() => "معالجة فورية وتشاركية بتقديم عينات صحيحة مقابل الخطأ، وإعطاء الطالب فرصة للتصحيح الذاتي البصري.");

  const chRec = (form.classProblems || []).flatMap(k => CHALLENGES[k]?.recs || []);

  const meta = {
    grade: g.label,
    gradeNum: gn,
    gradeCode: g.code,
    subject: sub.label,
    subjectKey: form.subject,
    subType: form.subType || "",
    lessonTitle: form.lessonTitle,
    bookUnit: form.bookUnit || "",
    teacherName: form.teacherName || "",
    schoolName: form.schoolName || "",
    supervisorName: form.supervisorName || "",
    day: form.day,
    period: form.period ? PERIODS[Number(form.period) - 1] : "",
    periodNum: form.period || "",
    date: fmtDate(form.date),
    rawDate: form.date,
    duration: Number(form.duration) || 35,
    week: form.week || "1",
    level: g.level,
    bloom: g.bloom,
    cogNote: g.cog,
    lessonTypeLabel: LESSON_TYPES[ltk]?.label || "",
    introTypeLabel: INTRO_TYPES[itk]?.label || "",
    alphaLabel: ALPHA_STRATEGIES[ask]?.label || "",
    color: g.color,
    accent: g.accent,
    light: g.light,
  };

  // Modify homework based on actual progress feedback
  let pfxHomework = "";
  if (form.actualProgress === 'behind') {
    pfxHomework = "⚠️ [خطة مخففة لتقليص الحشو المعرفي]: حل تمرين رئيسي واحد فقط من كراسة الفصل لعدم إثقال كاهل الطلاب. ";
  } else if (form.actualProgress === 'ahead') {
    pfxHomework = "🚀 [تطبيق إثرائي متميز]: حل تمارين كراسة الطالب بالإضافة لكتابة جملتين إبداعيتين توظف مهارات الدرس اليوم. ";
  }
  const rawHomework = HOMEWORK[form.subject]?.[gn] || "";
  const finalHomework = pfxHomework + rawHomework;

  // Build Adaptable Remedial & Psychological Layer
  let remedialPlan = undefined;
  if (form.unexpectedGap && form.unexpectedGap !== 'none') {
    const gapTitles: Record<string, string> = {
      prereq_gaps: "ميكرو-خطة ردم فجوة المتطلبات اللغوية الأساسية",
      high_variance: "تنفيذ مصفوفة تمايز المهام والمستويات الثلاثية",
      heavy_remedial: "خطة التدخل الفوري لعلاج فجوات الكتابة والإعراب المزمنة"
    };

    const gapDescs: Record<string, string> = {
      prereq_gaps: `علاج الضعف المكتشف في المتطلبات السابقة من الحركات الإعرابية والقوانين الأساسية في مادة ${sub.label}.`,
      high_variance: "تنسيق مجموعات العمل بمبدأ (قرين التعلم المستقل) لربط المتقدمين لتوجيه وتحفيز بقية الزملاء بالصف.",
      heavy_remedial: "تخصيص الخمس دقائق الأولى من التطبيق لتمارين ميكرو-علاجية أحادية اللفظ لترسيخ الضابط الإملائي والإعرابي."
    };

    const gapActs: Record<string, string[]> = {
      grammar: [
        "إدراك ومقارنة علامات الرفع والجر الأصلية سماعاً وكتابة",
        "تنمية مهارة تفكيك تركيب الكلمة وعزل الفاعل المباشر",
        "تدريب فوري بورقة تدفق مرن أحادية الجمل لتفتيت التعقيد"
      ],
      dictation: [
        "إملاء تبادلي لكلمات ثنائية الحروف لتثبيت الاتساق اللفظي",
        "مراجعة التاء المربوطة والمفتوحة بالاعتماد على الوقف الساكن",
        "عرض الأخطاء الشائعة المكتشفة وتصويبها جماعياً على السبورة"
      ],
      reading: [
        "إشراك الطالب الضعيف مع القرين المتميز بنشاط القراءة الهامسة",
        "صياغة قائمة المفردات الملازمة الملونة لتنمية الحصيلة اللفظية",
        "تقديم أسئلة استيعاب بسيطة بخيارات ثنائية لتحقيق الأمان النفسي"
      ],
      calligraphy: [
        "نمذجة حركة معصم اليد والسبابة على السبورة خطوة بخطوة",
        "تنقيط الحرف المستهدف وسحبه برفق بقلم الخط الملون",
        "تشجيع الطالب ومنحه كروت الفارس الذهبي لزيادة الثقة بالذات"
      ],
      texts: [
        "تمثيل وتقريب الصور والجماليات الأدبية بمواقف يمنية حية",
        "التركيز على الفهم اللغوي الظاهر للفظة قبل التعمق بالتفسير البلاغي",
        "تيسير صياغة التلخيص الشفهي لتعزيز الجرأة الفنية بالمشاركة الصفية"
      ],
      expression: [
        "توفير مقدمات وخواتيم أدبية جاهزة لتمهيد انطلاق القلم الفردي",
        "تدشين بنك الكلمات والصناديق التعبيرية المستلهمة من البيئة اليمنية",
        "العصف الذهني التشاركي لصياغة فك العقدة وتجنب الخشية الصامتة"
      ]
    };

    const targetSubKey = form.subject || 'grammar';
    remedialPlan = {
      title: gapTitles[form.unexpectedGap] || "تدخل علاجي مصاحب",
      targetGap: gapDescs[form.unexpectedGap] || "مراعاة الفروق الفردية بالتطبيق المباشر",
      microPlan: gapActs[targetSubKey] || gapActs.grammar,
      psychActions: form.psychState === 'low_engage' 
        ? ["إشعال المنافسة بمجموعات تحدي الـ 50 نجمة بالفصل", "توزيع كروت الفارس اللغوي لإشراك الهادئين", "عجلة الحظ اللغوية السريعة"]
        : form.psychState === 'high_energy'
        ? ["تطبيق تحدي الكتابة الصامتة الصارمة لمدة 5 دقائق", "إدارة مبدأ العصف الذهني الهامس", "قوانين حركة من ضبط وتوجيه النشاط"]
        : form.psychState === 'fatigue'
        ? ["رواية قصة لغوية وجدانية خفيفة تبعث الطمأنينة", "تمارين تنفس صفي جماعي", "تقليل الضغط بنشاط ورسم معاني الكلمات"]
        : ["تحدي الثواني السبع لحل اللغز المعروض", "العد التنازلي لإنجاز أسرع تمثيل لغوي", "وميض الملاحظة المعزز للتركيز ببطاقات الصف"]
    };
  }

  return {
    id: Number(form.id) || Date.now(),
    form,
    meta,
    objectives: objs,
    strategies: STRATEGIES[form.subject]?.[gn] || [],
    tools: TOOLS[form.subject]?.[gn] || [],
    stages: buildStages(form, meta.duration),
    alphaStrategy: ALPHA_STRATEGIES[ask]?.label || "",
    alphaDesc: ALPHA_STRATEGIES[ask]?.desc || "",
    introLabel: INTRO_TYPES[itk]?.label || "",
    introEx: INTRO_TYPES[itk]?.ex || "",
    lessonTypeLabel: LESSON_TYPES[ltk]?.label || "",
    lessonTypeDesc: LESSON_TYPES[ltk]?.desc || "",
    expectedErrors: errs,
    errorRemedies: rems,
    assessments: ASSESSMENTS[form.subject]?.[gn] || [],
    homework: finalHomework,
    challengeRecs: chRec,
    references: [
      `كتاب لغتي الجميلة المعتمد لـ ${g.label} — وزارة التربية والتعليم اليمنية`,
      `دليل معلم اللغة العربية للصفوف العليا (7-9) — نسخة مطورة`,
      "شرح ابن عقيل على ألفية ابن مالك للتأصيل النحوي الرصين",
      "معجم الوسيط — للوقوف على أصول الاشتقاق ومعاني الكلمات والزوائد"
    ],
    remedialPlan
  };
}
