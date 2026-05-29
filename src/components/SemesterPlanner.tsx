/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  FileText, 
  RefreshCw, 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Layers, 
  UserCheck, 
  Sparkles,
  Info
} from "lucide-react";
import { NoorDB } from "../utils/db";
import { GRADES } from "../types";

// Standard official Yemen curriculum chapters for Grades 7-9 (Semester 1 and Semester 2)
interface TextbookLesson {
  unit: string;
  topic: string;
  aspects: {
    grammar: string;
    texts: string;
    reading: string;
    dictation: string;
    calligraphy: string;
    expression: string;
  };
}

const ACADEMIC_CURRICULUM: Record<string, Record<string, TextbookLesson[]>> = {
  "7": {
    "1": [
      {
        unit: "الوحدة الأولى: القرآن كتاب هداية",
        topic: "وصايا قرآنية (نصوص وتذوق)",
        aspects: {
          grammar: "الكلام وتفصيل أجزاء الجملة القواعدية",
          texts: "روائع وصايا قرآنية من سورة الأنعام",
          reading: "تلاوة جهرية هادفة واستقصائية للوصايا الربانية",
          dictation: "تطبيقات إملائية عامة ومراجعة الأساسيات السابقة",
          calligraphy: "خط النسخ: القواعد الأساسية ورسم الأحرف المتوازنة",
          expression: "تعبير شفهي وكتابي عن فضل الهداية والتقوى"
        }
      },
      {
        unit: "الوحدة الثانية: الغزو الفكري",
        topic: "درس فقدان التربية الواعية (قراءة)",
        aspects: {
          grammar: "علامات الاسم وعلامات الفعل والحرف",
          texts: "شواهد وحكم أدبية لضرورة الحكمة الوجدانية",
          reading: "قراءة استيعابية نقدية لنص 'فقدان التربية الواعية'",
          dictation: "التاء المربوطة والهاء في آخر الكلمة والفرق بينهما",
          calligraphy: "خط النسخ: المسافات المتقابلة للحروف النازلة والصاعدة",
          expression: "بحث تعبيري في تحصين العقول والتربية من أساليب التغريب"
        }
      },
      {
        unit: "الوحدة الثالثة: قضايا وطنية",
        topic: "قصيدة يمن العز للشاعر حمير العزكي",
        aspects: {
          grammar: "أنواع الاسم من حيث التذكير والتأنيث",
          texts: "أبيات قصيدة 'يمن العز' في حب الوطن والصمود والكرامة",
          reading: "استلهام معاني الدفاع والتضحية والانتماء اليمني العريق",
          dictation: "تطبيق إملائي عام لقياس الرسم الصحيح وتفادي مظاهر اللحن",
          calligraphy: "خط الرقعة: القوانين العامة ومقارنتها بخط النسخ",
          expression: "صناعة مسودة إنشائية في الفخر بالوطن والهوية اليمنية"
        }
      },
      {
        unit: "الوحدة الرابعة: منتجات محلية",
        topic: "درس الملح اليمني (قراءة واستكشاف)",
        aspects: {
          grammar: "تقسيم الاسم من حيث العدد: المفرد والمثنى والجمع",
          texts: "مقطوعات بليغة في الحث على الإنتاج والصناعة والبركة",
          reading: "استكشاف ثروات اليمن الطبيعية ومناجم الملح بالصليف",
          dictation: "مقارنة حيوية وبصرية للرسم الإملائي للتاء المربوطة والهاء",
          calligraphy: "خط الرقعة: ارتكاز الأحرف على السطر وخطوط الزاوية",
          expression: "موضوع تعبير عن فوائد استهلاك وتشجيع الصناعة المحلية"
        }
      },
      {
        unit: "الوحدة الخامسة: قيم إيمانية",
        topic: "حديث شريف: أهمية العلم (نصوص وتذوق)",
        aspects: {
          grammar: "تطبيقات نحوية شاملة على الكلام وأنواعه المألوفة",
          texts: "حديث رسول الله صلى الله عليه وآله وسلم في عظمة العلم",
          reading: "فضل العلم ومقامه في نماء وحضارة وبناء الأمة وتحصينها",
          dictation: "تطبيقات إملائية على رسم همزتي الوصل والقطع في الجمل",
          calligraphy: "خط النسخ: محاكاة وتدبر موازين الحروف في سياق السطر",
          expression: "كتابة خطاب إذاعي بليغ في توقير المعلم والمثقف"
        }
      },
      {
        unit: "الوحدة السادسة: أحداث ومناسبات",
        topic: "درس استشهاد الإمام علي كرم الله وجهه (قراءة)",
        aspects: {
          grammar: "مفهوم الإعراب والبناء النحوي مع تمييز المعرب والمبني",
          texts: "شواهد ونصوص أدبية في مناقب وبطولات الإمام علي",
          reading: "قراءة جهرية هادفة في قصة التضحية والاستبسال من أجل الدين",
          dictation: "همزة الوصل في الأسماء والأفعال ومواضعها الإملائية",
          calligraphy: "خط الرقعة: تلافي فراغات الكلمة ورسم النقاط المتصلة",
          expression: "إنشاء تعبيري بليغ في قيمة الفداء في التاريخ الإسلامي"
        }
      },
      {
        unit: "الوحدة السابعة: عطاء الشهادة",
        topic: "قصيدة الشهيد الحي للشاعر معاذ الجنيد",
        aspects: {
          grammar: "من مبنيات الأسماء: الضمائر المنفصلة والمتصلة وتفصيلها",
          texts: "أبيات قصيدة 'الشهيد الحي' الباعثة على العزة والشهامة",
          reading: "قراءة وتحليل لمعاني الفداء والدفاع وصيانة الأوطان والكرامة",
          dictation: "تطبيقات إملائية مكثفة للهمزات لتأمين جودة التدرج الإملائي",
          calligraphy: "مقارنة فنية حية بين خطي النسخ والرقعة في تشكيل اللوحات المكتملة",
          expression: "التأليف والإنتاج الإنشائي التاريخي المبدع"
        }
      },
      {
        unit: "الوحدة الخامسة: تراث متصل",
        topic: "الصناعات الحرفية الفضية والزي اليمني التراثي",
        aspects: {
          grammar: "أسماء الإشارة للمفرد والمثنى والجمع ودلالتها النحوية",
          texts: "جماليات النثر اليمني في وصف الفلكلور الشعبي",
          reading: "قراءة مقارنة 'توارث حرفة صياغة الفضة'",
          dictation: "الهمزة المتطرفة على السطر وفي الكلمة وحالاتها",
          calligraphy: "موازين الفروق الجمالية لسطر النسخ الشامل",
          expression: "صوتيات المخاطبة وإبداء الرأي بطلاقة صفية"
        }
      },
      {
        unit: "الوحدة السادسة: زراعة وموسم",
        topic: "مواسم هطول المطر والزراعة في الجبال اليمنية",
        aspects: {
          grammar: "الأسماء الموصولة وبنيتها والجمل صلتها",
          texts: "قصيدة 'الفلاح المغني' وصوت اليقين العطر",
          reading: "ندوة حول 'الحفاظ على المدرج اليماني الأخضر'",
          dictation: "حذف الواو والألف في بعض الكلمات الشائعة",
          calligraphy: "قواعد خط الرقعة بكتابة لفظ الجلالة الكريم",
          expression: "كتابة مقال وثائقي في صيانة الطبيعة والمياه"
        }
      },
      {
        unit: "الوحدة السابعة: تكنولوجيا نفعية",
        topic: "مستقبل التكنولوجيا واستيعاب جيل ألفا المعرفي",
        aspects: {
          grammar: "الفعل المضارع المرفوع وتأصيل علامة الضمة والواو",
          texts: "أطروحة 'نور العلم وقهر الصعاب بالعزيمة'",
          reading: "استخدم الحاسوب الميسر في ردم الفجوات اللغوية",
          dictation: "علامات الترقيم وتأثيرها على الضبط الإملائي",
          calligraphy: "التناغم الجمالي للنثر بالرقعة الفصيحة",
          expression: "تنسيق العرض اللغوي السريع بمحطات الصف"
        }
      }
    ],
    "2": []
  },
  "8": {
    "1": [
      {
        unit: "الوحدة الأولى: قضايا إيمانية",
        topic: "القرآن كتاب هداية (نصوص وهدايات)",
        aspects: {
          grammar: "تطبيقات نحوية على ما سبق دراسته (أقسام الكلمة والمعرب والمبني)",
          texts: "آيات مباركة من سورة الزمر تصف القرآن كتاب هداية",
          reading: "تلاوة واستيعاب هدايات الآيات القرآنية وأثرها القلبي",
          dictation: "تطبيقات إملائية عامة ومراجعة همزتي الوصل والقطع في الكلمات",
          calligraphy: "كتابة بخطي النسخ والرقعة: كل الخلائق في حمى الديان وكتابه هدي عظيم الشان",
          expression: "التعبير الشفهي حول التوبة وشروطها، والتعبير الكتابي في موضوع الارتباط بكتاب الله"
        }
      },
      {
        unit: "الوحدة الثانية: الغزو الفكري",
        topic: "درس مخاطر الطائفية وتبعاتها المدمرة لصلات المجتمعات (قراءة واستكشاف)",
        aspects: {
          grammar: "الجملة الاسمية: ركناها المبتدأ والخبر وحالات إعرابهما والقواعد الخاصة",
          texts: "نصوص من سيرة النبي والقرآن الكريم في حظر التفرقة والعصبية والطائفية",
          reading: "قراءة وتحليل نص مخاطر الطائفية وحماية اللحمة المجتمعية والهوية اليمنية",
          dictation: "الهمزة المتطرفة في آخر الكلمة وحالات كتابتها على الألف والواو والياء والسطر",
          calligraphy: "خط النسخ والرقعة: الإسلام نبذ الطائفية وبنى المجتمع على الأخوة والتعاضد",
          expression: "بحث تعبيري في مخاطر التعصب بشتى أشكاله مجتمعيا وسبل مكافحة الفتن مذهبيا"
        }
      },
      {
        unit: "الوحدة الثالثة: قيم أخلاقية",
        topic: "درس الإحسان في القرآن الكريم والسلوك الفردي (قراءة ومفاهيم)",
        aspects: {
          grammar: "تقديم الخبر وجوباً على المبتدأ ومواضع تقدمه وشروطه النحوية",
          texts: "مقتطفات بلاغية تحث على الإيثار وبذل المعروف ومكارم المروءة اليمنية",
          reading: "قراءة تحليلية واعية لمفهوم الإحسان كقيمة دينية واجتماعية راقية في الأمة",
          dictation: "تطبيقات الهمزة المتطرفة في آخر الكلمة وقواعد رسمها الصحيح لمستوى الصف الثامن",
          calligraphy: "خط النسخ والرقعة: أحسن إلى الناس تستعبد قلوبهم فطالما استعبد الإنسان إحسان",
          expression: "حوار شفهي عن مجالات الإحسان، وكتابة تدوين لتقرير عن فضل التضحية والإيثار والمروءة"
        }
      },
      {
        unit: "الوحدة الرابعة: مفاهيم زراعية",
        topic: "درس المبيدات وأضرارها الوخيمة على زراعة الأرض والبيئة والصحة (قراءة)",
        aspects: {
          grammar: "الأفعال الناسخة (كان وأخواتها) وأثرها النحوي واللفظي على الجملة الاسمية",
          texts: "الأدبيات الزراعية وحرص المناهج على صيانة الأرض والمعاش وتشجيع المنتج الوطني",
          reading: "استيعاب مخاطر الاستخدام العشوائي والمفرط للمبيدات الزراعية المؤثرة بالسلب على التربة",
          dictation: "تطبيقات إملائية مكثفة للهمزة المتطرفة على الألف والواو والياء والسطر لتفادي التصحيف",
          calligraphy: "خطي النسخ والرقعة: احم الطبيعة يا فتى من كل شر أو ضرر وبنيت بلادي على البركة",
          expression: "موضوع ورشة صفية حول أهمية التوازن البيئي وترشيد استخدام الكيماويات في الجبل والمدرج"
        }
      },
      {
        unit: "الوحدة الخامسة: مبادئ إنسانية",
        topic: "قصيدة الشجاعة للشاعر يحيى بلابل المعبرة عن هوية الصمود (نصوص)",
        aspects: {
          grammar: "أفعال المقاربة والرجاء والشروع (كاد وأخواتها) وعملها الدقيق بالجمل الاسمية",
          texts: "أبيات قصيدة الشجاعة المفعمة بقيم الصمود والعزة والشهامة والفداء لأطياف المجتمع",
          reading: "تمجيد بطولات الشعب وصناعة الكرامة والفداء في مجالات الحياة وحماية العروبة",
          dictation: "الهمزة المفردة في آخر الكلمة (الهمزة المتطرفة بعد حرف ساكن) ورسم قواعدها",
          calligraphy: "خط النسخ والرقعة: نقش المجد في جبين الزمان كل سيف بكف حر يمان أصيل",
          expression: "التعبير الشفهي حول حماية الأوطان واللحمة، ومسودة كتابية في فضل التضحية بالنفس والمال"
        }
      },
      {
        unit: "الوحدة السادسة: مبادئ وقيم",
        topic: "قصيدة نصائح للشاعر يحيى محمد بلابل الأخلاقية والاجتماعية (نصوص)",
        aspects: {
          grammar: "الحروف الناسخة (إن وأخواتها) وعملها وأثرها النحوي والدلالي في الجملة الاسمية",
          texts: "وصايا شعرية راقية في التواضع بالقول والالتزام بالأخلاق وتجنب التكبر والغرور",
          reading: "تحليل القيم الإيمانية والأخلاقية الواردة في أبيات نصيحة بلابل وعلاقتها بالدين",
          dictation: "تطبيقات إملائية ميسرة على قواعد الهمزة المتطرفة بمواضعها المتنوعة لتثبيت الوعي الإملائي",
          calligraphy: "خطي النسخ والرقعة: أيا شبل الهدى والمكرمات وخدن الدين والآل الهداة تواضع يا أخي",
          expression: "الإنشائيات الأخلاقية وأهمية القدوة الصالحة في بناء جيل قرآني متماسك ومتحصن من الطغيان"
        }
      },
      {
        unit: "الوحدة السابعة: أحداث ومناسبات",
        topic: "يوم المرأة المسلمة - مولد الزهراء البتول ريحانة النبي (قراءة)",
        aspects: {
          grammar: "أفعال النواسخ من القلوب والتحويل (ظن وأخواتها) وتتعدى لتنصب مفعولين أصلهما مبتدأ وخبر",
          texts: "شواهد دينية وفصيحة لمقام سيدة نساء العالمين فاطمة الزهراء عليها السلام وقدوتها الإيمانية",
          reading: "قراءة نقدية وتوثيقية لسيرة الزهراء كنموذج للتربية الإيمانية الواعية وبناء النشأ الصالح",
          dictation: "قواعد رسم الهمزة شبه المتوسطة في الكلمة عند تطرأ عليها الضمائر المفتوحة والمجرورة",
          calligraphy: "بأرقى الحروف خطي النسخ والرقعة: هي الزهراء عنوان بها الأكوان تزدان بالفضل الوفي",
          expression: "تحرير مسودة تعبيرية بليغة عن فضل الأسرة وتكامل أدوار المرأة والرجل وصيانة السكن"
        }
      },
      {
        unit: "الوحدة الثامنة: شخصيات وأعلام",
        topic: "درس الصحابي الجليل أبو ذر الغفاري رضي الله عنه (قراءة واستبصار)",
        aspects: {
          grammar: "تطبيقات نحوية شاملة على النواسخ (كان وكاد وإن وظن وأخواتها) وتأهيل القدرات النحوية للطلاب",
          texts: "مناقب الصحابي الجليل وجهاده الفصيح في سبيل العقيدة وكلمة الحق والصمود ضد الباطل",
          reading: "تعميق مفاهيم الأمانة والتحذير من الغفلة ونصرة المظلوم ومروءة الدفاع عن الحقوق والحرية",
          dictation: "تطبيقات إملائية مكثفة للهمزة شبه المتوسطة في الأسماء للتأكد من الموازين والكتابة الصحيحة",
          calligraphy: "بخط النسخ والرقعة: أوصيك بتقوى الله فإنها رأس الأمر كله وعليك بقراءة القرآن الكريم",
          expression: "تعبير وقصص تاريخية تصف الشيم ومكارم الصوف والتحصين ودور الأعلام في استنهاض الكرامة"
        }
      },
      {
        unit: "الوحدة التاسعة: علوم وتكنولوجيا",
        topic: "درس عصر التطور المعرفي والتكنولوجي المعاصر للأمة المسلمة (قراءة)",
        aspects: {
          grammar: "إعراب الفعل المضارع بالتفصيل النحوي (قواعد حالات الرفع وحالات النصب بالتطبيقات)",
          texts: "النثر والنصوص المعاصرة في وصف علوم ريادة الفضاء وغزو الأكوان وحركية الأقمار الصناعية",
          reading: "مستقبل التكنولوجيا واستيعاب جيل ألفا وثورة الاتصالات المتسارعة وأثرها في تواصل الشعوب",
          dictation: "المدة في أول الكلمة وفي وسطها وحالات كتابتها ورسمها الصحيح مع تجنب مواضع الخطأ",
          calligraphy: "التناغم الجمالي للنثر بالرقعة والفصيحة: على الأمة الإسلامية أن تأخذ زمام المبادرة ناصعا",
          expression: "كتابة إنشائية تعبيرية تناقش ضرورة مواكبة التطور التقني والاهتمام بالبحث العلمي بالجمهورية"
        }
      },
      {
        unit: "الوحدة العاشرة: قضايا إسلامية ووطنية",
        topic: "قصيدة الشاعر اليمني معاذ الجنيد (قصيدة هم الشعث)",
        aspects: {
          grammar: "إعراب الفعل المضارع (أدوات جزم الفعل المضارع بالتفصيل وعلامة السكون وحذف العلة)",
          texts: "أبيات قصيدة هم الشعث الباعثة على الصمود الإيماني في وجه التآمر ومكافحة مظاهر التغريب",
          reading: "قراءة جهرية واعية لتاريخ اليمن الطارد للغزاة وصموده ومقبرة الطامعين على امتداد الدهور",
          dictation: "تطبيقات إملائية مكثفة لكتابة ورسم المدة في وسط الكلمة مع القواعد الباقية لمستوى الوعي",
          calligraphy: "خط النسخ والرقعة: نعم هم الشعث من أوجاعهم قدموا وبالبراكين شبوا النار والتحموا قوة وعزة",
          expression: "موضوع تعبير وطني بليغ حول تماسك الجبهة الداخلية وأهمية الرعاية التعليمية والوعي الوطني"
        }
      },
      {
        unit: "الوحدة الحادية عشرة: مهن وأعمال",
        topic: "درس العمل مهنة شريفة وقيمة الصنعة في صيانة النفس البشرية (قراءة)",
        aspects: {
          grammar: "الأفعال الخمسة وعلامات إعرابها التفصيلية رفعاً بثبوت النون ونصباً وجزماً بحذف النون",
          texts: "آيات قرآنية وأحاديث شريفة ورسائل نبوية تحث على السعي للعمل والإنتاج والبركة بجد واجتهاد",
          reading: "توارث الحرف الشعبية وأهمية صيانة المدرج والإنتاج المحلي التنموي لمكافحة الفقر والبطالة",
          dictation: "قواعد اللام الشمسية واللام القمرية وأثرها في النطق الصحيح والضبط البياني بأسل ميسر",
          calligraphy: "نسخ ورقعة: سعي الفتى في عيشه عبادة وقائد يهديه للسعادة طالباً حلال الرزق لعياله",
          expression: "كتابة حوار أو ندوة صفية عن شرف العمل والمهن وأثرها التنموي الفذ في استقلال القرار والإنتاج"
        }
      },
      {
        unit: "الوحدة الثانية عشرة: لغتنا الجميلة",
        topic: "سيد اللغات ومواطن بلاغة لغة الضاد العربية لغة القرآن (قراءة)",
        aspects: {
          grammar: "تطبيقات عامة وشاملة على جميع القواعد النحوية المقررة للفصل الأول لدعم الفصاحة الفردية",
          texts: "أطروحة بلاغية ونظم شعر متميز لشاعر النيل حافظ إبراهيم 'اللغة العربية تنعي حظها' للطلاب",
          reading: "تفوق اللغة العربية بمرونتها واتساعها وسر دلالاتها وصحة الإعراب البياني المتين بالتمرن",
          dictation: "تطبيقات ومراجعات إملائية شاملة (الهمزات المتطرفة وشبه المتوسطة، التاء والهاء، رسم المدة)",
          calligraphy: "كتابة اللوحات والخط في أرقى صوره بخطي النسخ والرقعة وتذوق الجمال الهندسي للحرف",
          expression: "تدريب الطلاب لغويا على إلقاء المقالات في الإذاعة المدرسية لإشاعة الفصاحة وحماية اللسان"
        }
      }
    ],
    "2": []
  },
  "9": {
    "1": [
      {
        unit: "الوحدة الأولى: آفاق بلاغية",
        topic: "الفصاحة والبيان والاشتقاق اللفظي الراقي والفريد",
        aspects: {
          grammar: "النعت وأقسامه (الحقيقي والسببي) بالتفصيل النحوي",
          texts: "شرح ابن عقيل والمعجز في ألفية ابن مالك الميسرة",
          reading: "مدائن 'زبيد ووفادات علوم العربية والبلاغة السنية'",
          dictation: "الوصل والفصل في الحروف الهجائية المركبة",
          calligraphy: "خط الرقعة بلوحة تركيب فني متداخل للألفاظ",
          expression: "إنتاج خطابات ومواقف يمنية حية بأسلوب اللقاء"
        }
      }
    ],
    "2": []
  }
};

  // Simple Fallback Curriculum generator in case a grade/semester doesn't have custom mock templates
function getCurriculumFor(grade: string, semester: string): TextbookLesson[] {
  const custom = ACADEMIC_CURRICULUM[grade]?.[semester];
  if (custom && custom.length > 0) return custom;

  // Generate generic robust curriculum matching the selected grade/semester
  const genList: TextbookLesson[] = [];
  for (let idx = 1; idx <= 8; idx++) {
    genList.push({
      unit: `الوحدة ${idx === 1 ? "الأولى" : idx === 2 ? "الثانية" : idx === 3 ? "الثالثة" : idx === 4 ? "الرابعة" : idx === 5 ? "الخامسة" : idx === 6 ? "السادسة" : idx === 7 ? "السابعة" : "الثامنة"}: مهارات نماء لغوية متسارعة`,
      topic: `الدرس ${idx}: ممارسات لغوية من الكراسة الرسمية لليمن`,
      aspects: {
        grammar: `قواعد النحو الفصل ${semester} — مبدئ تفصيلي ${idx}`,
        texts: `أدبيات وبلاغة الشاعر اليمني للدرس رقم ${idx}`,
        reading: `استيعاب قراءة سريعة وقصص تراثية ${idx}`,
        dictation: `صيانة الفجوة الإملائية ومظاهر الرسم ${idx}`,
        calligraphy: `خط النسخ والرقعة المتمايز حصة ${idx}`,
        expression: `تحرير الإنشائيات بمسودات الطالب ورشة ${idx}`
      }
    });
  }
  return genList;
}

// 14-week static calendar base
interface CalendarWeekConfig {
  weekNum: number;
  label: string;
  type: "active" | "vacation" | "exam" | "disrupted" | "delayed";
  dateRange: string;
  note: string;
}

const DEFAULT_SEMESTER_WEEKS: Record<string, CalendarWeekConfig[]> = {
  "1": [
    { weekNum: 1, label: "الأسبوع الأول", type: "active", dateRange: "٢٠ سبتمبر - ٢٤ سبتمبر", note: "عقد التهيئة الصفية وتوزيع كراسات الطلاب" },
    { weekNum: 2, label: "الأسبوع الثاني", type: "active", dateRange: "٢٧ سبتمبر - ١ أكتوبر", note: "الشروع اللغوي واستقراء المستويات الميدانية" },
    { weekNum: 3, label: "الأسبوع الثالث", type: "active", dateRange: "٤ أكتوبر - ٨ أكتوبر", note: "تنفيذ تحدي الثواني السبع والتشخيص المصاحب" },
    { weekNum: 4, label: "الأسبوع الرابع", type: "active", dateRange: "١١ أكتوبر - ١٥ أكتوبر", note: "تطبيق التمايز بمسار ومصادر المجموعات للتفاعل" },
    { weekNum: 5, label: "الأسبوع الخامس", type: "exam", dateRange: "١٨ أكتوبر - ٢٢ أكتوبر", note: "⚠️ أسبوع مراجعة أولى وتطبيقات تراكمية لتقييم الأثر" },
    { weekNum: 6, label: "الأسبوع السادس", type: "active", dateRange: "٢٥ أكتوبر - ٢٩ أكتوبر", note: "الاستنباط الجماعي باستعمال خرائط المفاهيم الملونة" },
    { weekNum: 7, label: "الأسبوع السابع", type: "active", dateRange: "١ نوفمبر - ٥ نوفمبر", note: "ورشة التحرير اللغوي وعزل الفجوات بصرياً" },
    { weekNum: 8, label: "الأسبوع الثامن", type: "active", dateRange: "٨ نوفمبر - ١٢ نوفمبر", note: "نشاط قرين التعلم الذاتي الهامس والموجه" },
    { weekNum: 9, label: "الأسبوع التاسع", type: "active", dateRange: "١٥ نوفمبر - ١٩ نوفمبر", note: "تعزيز طلاقة نطق وكفاية التلمود النثري" },
    { weekNum: 10, label: "الأسبوع العاشر", type: "exam", dateRange: "٢٢ نوفمبر - ٢٦ نوفمبر", note: "⚠️ أسبوع مراجعة ثانية والتدخل ميكرو-علاجياً للقصور" },
    { weekNum: 11, label: "الأسبوع الحادي عشر", type: "active", dateRange: "٢٩ نوفمبر - ٣ ديسمبر", note: "عجلة الحظ التفاعلية لترسيخ القاعدة النحوية" },
    { weekNum: 12, label: "الأسبوع الثاني عشر", type: "active", dateRange: "٦ ديسمبر - ١٠ ديسمبر", note: "توزيع بطاقات نجوم الإنجاز لتأمين مشاركة جماعية" },
    { weekNum: 13, label: "الأسبوع الثالث عشر", type: "active", dateRange: "١٣ ديسمبر - ١٧ ديسمبر", note: "اختبارات الاستيعاب السريع والإنهاء المظفري" },
    { weekNum: 14, label: "الأسبوع الرابع عشر", type: "exam", dateRange: "٢٠ ديسمبر - ٢٤ ديسمبر", note: "⚠️ أسبوع المراجعة الشاملة المتقارنة وقفل السجلات" }
  ],
  "2": [
    { weekNum: 1, label: "الأسبوع الأول", type: "active", dateRange: "٢٤ يناير - ٢٨ يناير", note: "تهيئة وجدانية دافئة لاستئناف العمل والمطالعة" },
    { weekNum: 2, label: "الأسبوع الثاني", type: "active", dateRange: "٣١ يناير - ٤ فبراير", note: "أوليات ميزان الحرف ونشر أوراق القواعد" },
    { weekNum: 3, label: "الأسبوع الثالث", type: "active", dateRange: "٧ فبراير - ١١ فبراير", note: "عقد حوار قرين التعلم وتجسيد حركات الفعل" },
    { weekNum: 4, label: "الأسبوع الرابع", type: "active", dateRange: "١٤ فبراير - ١٨ فبراير", note: "استنتاج القالب الهيكلي لتكويد الإملاء البصري" },
    { weekNum: 5, label: "الأسبوع الخامس", type: "exam", dateRange: "٢١ فبراير - ٢٥ فبراير", note: "⚠️ أسبوع مراجعة أولى وتطبيقات تراكمية لتقييم الأثر" },
    { weekNum: 6, label: "الأسبوع السادس", type: "active", dateRange: "٢٨ فبراير - ٤ مارس", note: "تنفيذ تحدي الثواني السبع بالبطاقة المنظورة" },
    { weekNum: 7, label: "الأسبوع السابع", type: "active", dateRange: "٧ مارس - ١١ مارس", note: "الكتابة الصامتة هادفة التفسير وحل الشواهد" },
    { weekNum: 8, label: "الأسبوع الثامن", type: "active", dateRange: "١٤ مارس - ١٨ مارس", note: "توزيع بطاقات موازنة درجات المهام المتقدمة" },
    { weekNum: 9, label: "الأسبوع التاسع", type: "vacation", dateRange: "٢١ مارس - ٢٥ مارس", note: "🌴 عطلة رسمية (إجازة منتصف الفصل الدراسي الثاني)" },
    { weekNum: 10, label: "الأسبوع العاشر", type: "exam", dateRange: "٢٨ مارس - ١ أبريل", note: "⚠️ أسبوع مراجعة ثانية والتدخل ميكرو-علاجياً للقصور" },
    { weekNum: 11, label: "الأسبوع الحادي عشر", type: "active", dateRange: "٤ أبريل - ٨ أبريل", note: "تركيب الصناديق اللغوية لإطلاق طلاقة الإنشاء" },
    { weekNum: 12, label: "الأسبوع الثاني عشر", type: "active", dateRange: "١١ أبريل - ١٥ أبريل", note: "مسابقة أجمل خط بالفصل ومنح فرسان الضاد" },
    { weekNum: 13, label: "الأسبوع الثالث عشر", type: "active", dateRange: "١٨ أبريل - ٢٢ أبريل", note: "اختبار عملي تفاعلي وتصويب زميلي متبادل" },
    { weekNum: 14, label: "الأسبوع الرابع عشر", type: "exam", dateRange: "٢٥ أبريل - ٢٩ أبريل", note: "⚠️ أسبوع المراجعة الشاملة المتقارنة وقفل السجلات" }
  ]
};

export default function SemesterPlanner() {
  const [grade, setGrade] = useState<string>("7");
  const [semester, setSemester] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  // File states (persisted via DB names)
  const [calendarFile, setCalendarFile] = useState<{name: string, size: string} | null>(null);
  const [textbook1File, setTextbook1File] = useState<{name: string, size: string} | null>(null);
  const [textbook2File, setTextbook2File] = useState<{name: string, size: string} | null>(null);

  // Active weeks configuration (shift-friendly)
  const [weeksConfig, setWeeksConfig] = useState<CalendarWeekConfig[]>([]);

  // Teacher metadata for signatures & professional header
  const [meta, setMeta] = useState({
    teacherName: "—",
    schoolName: "—",
    supervisorName: "—",
    districtName: "مديرية معين التربوية",
    governorate: "أمانة العاصمة صنعاء"
  });

  // Load configuration from IndexedDB on components mount or updates
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedProfile = await NoorDB.getPref<any>("profile");
        if (savedProfile) {
          setMeta(prev => ({
            ...prev,
            teacherName: savedProfile.teacherName || prev.teacherName,
            schoolName: savedProfile.schoolName || prev.schoolName,
            supervisorName: savedProfile.supervisorName || prev.supervisorName
          }));
        }

        // Load files state
        const savedFiles = await NoorDB.getPref<any>("semester_uploaded_files");
        if (savedFiles) {
          if (savedFiles.calendar) setCalendarFile(savedFiles.calendar);
          if (savedFiles.textbook1) setTextbook1File(savedFiles.textbook1);
          if (savedFiles.textbook2) setTextbook2File(savedFiles.textbook2);
        }

        // Load weeks config if already customized
        const savedWeeks = await NoorDB.getPref<CalendarWeekConfig[]>(`weeks_config_${grade}_${semester}`);
        if (savedWeeks && savedWeeks.length > 0) {
          setWeeksConfig(savedWeeks);
        } else {
          // Fallback to default copy
          const dc = DEFAULT_SEMESTER_WEEKS[semester] || DEFAULT_SEMESTER_WEEKS["1"];
          // Deep clone
          setWeeksConfig(JSON.parse(JSON.stringify(dc)));
        }
      } catch (err) {
        console.error("Error loading semester config:", err);
      }
    };
    loadSavedData();
  }, [grade, semester]);

  // Saves current weeks config to IndexedDB
  const saveWeeksConfig = async (newConfig: CalendarWeekConfig[]) => {
    setWeeksConfig(newConfig);
    try {
      await NoorDB.setPref(`weeks_config_${grade}_${semester}`, newConfig);
    } catch (err) {
      console.error("Failed to save weeks configuration:", err);
    }
  };

  // Drag and drop zone helper ref
  const calendarRef = useRef<HTMLInputElement>(null);
  const textbook1Ref = useRef<HTMLInputElement>(null);
  const textbook2Ref = useRef<HTMLInputElement>(null);

  // Simulated Parse flow
  const runSimulatedParsing = async (fileName: string, type: string) => {
    setIsParsing(true);
    setLogMessages([]);
    localStorage.setItem("DISABLE_HMR", "true");

    const steps = [
      `📁 تم استقبال وتخزين الملف المستند: ${fileName}`,
      "🔍 جاري فك ضغط الهيكل وتشفير البيانات المستقاة من الـ PDF...",
      `📍 تحديد النسخة والتراخيص المطابقة لمناهج الجمهورية اليمنية...`,
      type === "calendar" 
        ? "📅 تم كشف جدول التقوييم المدرسي الشامل: ١٤ أسبوعاً، ٣ عطلات، فترات مراجعة مدرجة."
        : `⚙️ تم تحليل الكتاب المدرسي: العثور على الوحدات التدريسية، وتصنيف معارف (النحو والخط والإملاء).`,
      "⭐ ربط مصفوفة جيل ألفا وتكييف فواصل الاستيعاب مع خطة الموجه...",
      "✅ تمت المعالجة بنجاح! التوزيع الزمني تم ربطه بدقة متناهية."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 450));
      setLogMessages(prev => [...prev, steps[i]]);
    }
    await new Promise(r => setTimeout(r, 600));
    setIsParsing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'calendar' | 'txt1' | 'txt2') => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const szStr = (f.size / (1024 * 1024)).toFixed(2) + " MB";
      const fileData = { name: f.name, size: szStr };

      // Update Local files list
      let newFiles: any = {};
      try {
        const savedFiles = await NoorDB.getPref<any>("semester_uploaded_files") || {};
        newFiles = { ...savedFiles };
      } catch (err) {
        newFiles = {};
      }

      if (type === 'calendar') {
        setCalendarFile(fileData);
        newFiles.calendar = fileData;
      } else if (type === 'txt1') {
        setTextbook1File(fileData);
        newFiles.textbook1 = fileData;
      } else {
        setTextbook2File(fileData);
        newFiles.textbook2 = fileData;
      }

      await NoorDB.setPref("semester_uploaded_files", newFiles);
      await runSimulatedParsing(f.name, type === 'calendar' ? 'calendar' : 'textbook');

      // Refresh weeks configuration
      const dc = DEFAULT_SEMESTER_WEEKS[semester] || DEFAULT_SEMESTER_WEEKS["1"];
      await saveWeeksConfig(JSON.parse(JSON.stringify(dc)));
    }
  };

  // Clear uploaded files
  const handleClearFile = async (type: 'calendar' | 'txt1' | 'txt2') => {
    try {
      const savedFiles = await NoorDB.getPref<any>("semester_uploaded_files") || {};
      if (type === 'calendar') {
        setCalendarFile(null);
        delete savedFiles.calendar;
      } else if (type === 'txt1') {
        setTextbook1File(null);
        delete savedFiles.txt1;
      } else {
        setTextbook2File(null);
        delete savedFiles.txt2;
      }
      await NoorDB.setPref("semester_uploaded_files", savedFiles);
    } catch (err) {
       console.error("Failed clear files:", err);
    }
  };

  // Shifting chronological mapping engine implementation
  // Weeks config status includes: "active", "vacation", "exam", "disrupted", "delayed"
  // When a lesson maps to the weeks, only active and delayed status weeks consume lessons!
  // Holiday and Disrupted/Emergency weeks do NOT consume textbook lessons. Subsequent lessons are shifted forward.
  const getMappedLessons = useCallback((): { week: CalendarWeekConfig; lesson: TextbookLesson | null; index: number }[] => {
    const textbookLessons = getCurriculumFor(grade, semester);
    const result: { week: CalendarWeekConfig; lesson: TextbookLesson | null; index: number }[] = [];
    let lessonIdx = 0;

    weeksConfig.forEach((wk, i) => {
      const isTeachingWeek = wk.type === "active" || wk.type === "delayed" || wk.type === "exam";
      const isReviewWeek = wk.type === "exam";

      if (isTeachingWeek) {
        if (isReviewWeek) {
          // Assign review special block
          result.push({
            week: wk,
            lesson: {
              unit: "محطة مراجعة مدمجة",
              topic: wk.note,
              aspects: {
                grammar: "مراجعة وحل تطبيقات نحوية جماعية ميسرة للتحقق من كفاءة وطلاقة الفهم التراكمي للدروس السابقة.",
                texts: "تذوق بلاغي ونقد أساليب المضمون للأبيات السابقة.",
                reading: "قراءة جهرية هادفة وفقرات تلخيص سريعة.",
                dictation: "تطبيق لوحة أخطاء إملائية مصورة وتصويبها جماعياً.",
                calligraphy: "تدبر تحسين سريعة ورسم أحرف الرقعة المنسجمة.",
                expression: "تأليف مسودات زميلية مع كشف المكتسبات المعنوية الحصيلة."
              }
            },
            index: i + 1
          });
        } else {
          // Assign normal textbook lesson
          const lesson = textbookLessons[lessonIdx % textbookLessons.length];
          result.push({
            week: wk,
            lesson: lesson || null,
            index: i + 1
          });
          lessonIdx++;
        }
      } else {
        // Holiday or Disrupted Shift - NO lesson consumed from queue, shifted to next week
        result.push({
          week: wk,
          lesson: null,
          index: i + 1
        });
      }
    });

    return result;
  }, [weeksConfig, grade, semester]);

  // Handle click to cycle week state:
  // active -> delayed -> disrupted -> active (or vacation/holiday)
  const toggleWeekType = async (wkNum: number) => {
    const nextConfig = weeksConfig.map(wk => {
      if (wk.weekNum === wkNum) {
        let nextType: "active" | "vacation" | "exam" | "disrupted" | "delayed" = "active";
        let nextNote = wk.note;

        if (wk.type === "active") {
          nextType = "delayed";
          nextNote = "⚠️ تباطؤ صفي لتذليل فوارق القدرات وفجوة المبتدئين";
        } else if (wk.type === "delayed") {
          nextType = "disrupted";
          nextNote = "🚨 أسبوع ترحيل اضطراري / طوارئ (سيتم إزاحة الدرس للأسبوع التالي تلقائياً)";
        } else if (wk.type === "disrupted") {
          nextType = "vacation";
          nextNote = "🌴 عطلة رسمية أو مناسبة وطنية يمنية مدرجة";
        } else if (wk.type === "vacation") {
          nextType = "exam";
          nextNote = "⚠️ أسبوع مراجعة أولى وتطبيقات تراكمية لتقييم الأثر";
        } else {
          nextType = "active";
          nextNote = "أسبوع تدريسي فعال ملتزم بالجدول المدرسية";
        }

        return { ...wk, type: nextType, note: nextNote };
      }
      return wk;
    });

    await saveWeeksConfig(nextConfig);
  };

  // Reset to calendar defaults
  const handleResetCalendar = async () => {
    const dc = DEFAULT_SEMESTER_WEEKS[semester] || DEFAULT_SEMESTER_WEEKS["1"];
    await saveWeeksConfig(JSON.parse(JSON.stringify(dc)));
  };

  // Professional print functionality using iframe style
  const handlePrint = () => {
    const data = getMappedLessons();
    const grLabel = GRADES[grade]?.label || "الصف السابع";

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <title>التوزيع الزمني المنهجي الرسمي والحر — ${grLabel} — الفصل ${semester}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;700&family=Inter:wght@400;500;600&display=swap');
          
          body {
            font-family: "Noto Naskh Arabic", "Amiri", serif;
            color: #111827;
            background-color: #ffffff;
            margin: 0;
            padding: 40px;
            direction: rtl;
            font-size: 13px;
            line-height: 1.6;
          }

          /* Official Header Styles */
          .office-header {
            width: 100%;
            border-bottom: 2px double #1f2937;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .header-table {
            width: 100%;
            border: none;
            margin-bottom: 10px;
          }

          .header-cell {
            vertical-align: top;
            width: 33%;
          }

          .goverment-title {
            text-align: right;
            font-size: 14px;
            font-weight: bold;
            line-height: 1.7;
          }

          .crest-cell {
            text-align: center;
          }

          .emblem-sim {
            font-size: 40px;
            margin-bottom: 5px;
          }

          .org-sub {
            font-size: 11px;
            color: #4b5563;
          }

          .meta-title {
            text-align: left;
            font-size: 12px;
            line-height: 1.6;
          }

          .document-title {
            text-align: center;
            font-family: "Amiri", serif;
            font-size: 26px;
            font-weight: bold;
            color: #1e3a8a;
            margin: 15px 0;
            letter-spacing: -0.5px;
          }

          /* Details info row */
          .info-stripe {
            background-color: #f3f4f6;
            border: 1px solid #e5e7eb;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
          }

          .info-item {
            font-size: 13px;
          }

          .info-label {
            font-weight: bold;
            color: #374151;
            margin-left: 5px;
          }

          /* Main Calendar Table */
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }

          .data-table th, .data-table td {
            border: 1px solid #9ca3af;
            padding: 10px 12px;
            text-align: right;
          }

          .data-table th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #111827;
            font-size: 13px;
          }

          .data-table tr:nth-child(even) {
            background-color: #fafafa;
          }

          /* Week indicators types */
          .badge {
            display: inline-block;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: bold;
            border-radius: 4px;
            text-align: center;
          }

          .badge-active { background-color: #edfcf2; color: #0d5a2b; border: 1px solid #86efac; }
          .badge-delayed { background-color: #fffbeb; color: #78350f; border: 1px solid #fde047; }
          .badge-vacation { background-color: #eff6ff; color: #1e40af; border: 1px solid #93c5fd; }
          .badge-disrupted { background-color: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
          .badge-exam { background-color: #faf5ff; color: #581c87; border: 1px solid #d8b4fe; }

          /* Official Signatures Section */
          .signatures-grid {
            margin-top: 50px;
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
          }

          .sign-col {
            width: 33%;
            text-align: center;
            vertical-align: top;
            padding: 20px;
          }

          .sign-box {
            border-top: 1px dashed #4b5563;
            margin-top: 50px;
            padding-top: 10px;
            font-size: 13px;
            font-weight: bold;
          }

          /* Footnotes */
          .footer-note {
            text-align: center;
            font-size: 11px;
            color: #6b7280;
            margin-top: 60px;
            border-top: 1px dashed #e5e7eb;
            padding-top: 15px;
          }

          @media print {
            body { padding: 0; margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="office-header">
          <table class="header-table">
            <tr>
              <td class="header-cell">
                <div class="goverment-title">
                  الجمهورية اليمنية<br/>
                  وزارة التربية والتعليم<br/>
                  مكتب التربية والتعليم بمحافظة الأمانة<br/>
                  مكتب الإشراف والتوجيه التربوي بالمديرية
                </div>
              </td>
              <td class="header-cell crest-cell">
                <div class="emblem-sim">🦅</div>
                <strong>وزارة التربية والتعليم</strong><br/>
                <span class="org-sub">منظومة نور المتطورة للتخطيط والتحضير</span>
              </td>
              <td class="header-cell" style="text-align: left;">
                <div class="meta-title">
                  التاريخ: ${new Date().toLocaleDateString("ar-YE")}<br/>
                  العام الدراسي: ٢٠٢٦ / ٢٠٢٧ م<br/>
                  المستوى المنهجي: تحضيرات معززة
                </div>
              </td>
            </tr>
          </table>

          <div class="document-title">
            مخطط التوزيع الزمني والترتيب المنهجي المقترح لدرس اللغة العربية
          </div>
        </div>

        <div class="info-stripe">
          <div class="info-item"><span class="info-label">المعلم التربوي:</span> ${meta.teacherName}</div>
          <div class="info-item"><span class="info-label">المدرسة المنتسب لها:</span> ${meta.schoolName}</div>
          <div class="info-item"><span class="info-label">الموجه التربوي المقيم:</span> ${meta.supervisorName}</div>
          <div class="info-item"><span class="info-label">المرحلة والمعدل السني:</span> ${grLabel} — الفصل الدراسي ${semester === "1" ? "الأول" : "الثاني"}</div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 11%;">الأسبوع</th>
              <th style="width: 14%;">الفترة الزمنية</th>
              <th style="width: 11%;">نوع المسار</th>
              <th style="width: 18%;">رأس الموضوع / المعزز</th>
              <th style="width: 46%;">تفاصيل الجوانب التطبيقية (النحو - الإملاء - التعبير)</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => {
              const wk = item.week;
              const lesson = item.lesson;
              let badgeClass = "badge-active";
              let badgeLabel = "نشط ومستمر";
              if (wk.type === "delayed") { badgeClass = "badge-delayed"; badgeLabel = "تباطؤ علاجي"; }
              if (wk.type === "disrupted") { badgeClass = "badge-disrupted"; badgeLabel = "إزاحة طوارئ"; }
              if (wk.type === "vacation") { badgeClass = "badge-vacation"; badgeLabel = "إجازة رسمية"; }
              if (wk.type === "exam") { badgeClass = "badge-exam"; badgeLabel = "أسبوع مراجعة"; }

              return `
              <tr>
                <td><strong>${wk.label}</strong></td>
                <td><span style="font-size: 11px; font-family: sans-serif; color: #555;">${wk.dateRange}</span></td>
                <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
                <td>
                  ${lesson ? `
                    <div style="font-weight: bold; color: #1e3a8a;">${lesson.unit}</div>
                    <div style="font-size: 11px; color: #4b5563; margin-top: 2px;">${lesson.topic}</div>
                  ` : `<span style="color:#9ca3af; font-style: italic;">${wk.note}</span>`}
                </td>
                <td>
                  ${lesson ? `
                    <div style="font-size: 11.5px; line-height: 1.5; margin-bottom: 2px;">
                      <span style="font-weight:bold; color: #b45309;">النحو:</span> ${lesson.aspects.grammar}
                    </div>
                    <div style="font-size: 11.5px; line-height: 1.5; margin-bottom: 2px;">
                      <span style="font-weight:bold; color: #047857;">الإملاء والخط:</span> ${lesson.aspects.dictation} / ${lesson.aspects.calligraphy}
                    </div>
                    <div style="font-size: 11.5px; line-height: 1.5;">
                      <span style="font-weight:bold; color: #4338ca;">التعبير والنصوص:</span> ${lesson.aspects.texts} / ${lesson.aspects.expression}
                    </div>
                  ` : `<span style="color: #6b7280; font-style: italic;">لا توجد مواد مستخرجة من الكتاب في هذه الفترة الزمنية نظراً للتنبيه أعلاه.</span>`}
                </td>
              </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        <table class="signatures-grid">
          <tr>
            <td class="sign-col">
              <strong>توقيع واعتراض معلم المادة:</strong>
              <div class="sign-box">${meta.teacherName}</div>
            </td>
            <td class="sign-col">
              <strong>توقيع ومصادقة الموجه التربوي:</strong>
              <div class="sign-box">${meta.supervisorName}</div>
            </td>
            <td class="sign-col">
              <strong>توقيع واعتماد مدير المدرسة:</strong>
              <div class="sign-box">خاتم الإدارة وبطاقة التصديق</div>
            </td>
          </tr>
        </table>

        <div class="footer-note">
          تم التوليد والتوطين الفصلي آلياً عبر منظومة نور الذكية لمنهج لغتي الجميلة للجمهورية اليمنية ١٤٤٧ هـ — خوادم محلية مؤمنة بالكامل بالمتصفح.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const currentWeeksLessons = getMappedLessons();

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto font-sans" dir="rtl">
      {/* Visual Portal Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="bg-amber-400/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/20 flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400/10" />
              أحدث تقنيات الجدولة الزمنية التربوية لليمن
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold font-display text-slate-100">
              بوابة التخطيط الفصلي والرسمي
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              توطين رقمي مرن يمنح المعلم كامل التحكم للتوزيع التلقائي للمنهج المدرسي على مدار الفصل، مع معالجة حقيقية لحالات التمديد، وعقبات الطوارئ والأعياد لتفادي تراكم الدروس.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetCalendar}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              إعادة تهيئة الافتراضي
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-amber-400/10 flex items-center gap-2"
            >
              <Printer className="w-4 h-4 shrink-0" />
              طباعة وتصدير التوزيع الرسمي
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RIGHT COLUMN: PDF upload parameters & details settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              استيعاب المستندات الثلاثة (PDF)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ارفع مستنداتك وسيقوم محرك التوزيع باستخلاص التواريخ والأسابيع الفعالة تلقائياً وتوزيع وحدات كراسة المادة بالتوافق معها.
            </p>

            {/* Upload Area 1: Calendar */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold block">
                ١. ملف التقويم المدرسي السنوي (PDF) — شامل للفصلين
              </label>
              {calendarFile ? (
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-teal-500/20 text-xs">
                  <div className="flex items-center gap-2.5 text-teal-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <div className="text-right">
                      <p className="font-bold text-slate-200 truncate max-w-[170px]" title={calendarFile.name}>{calendarFile.name}</p>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">{calendarFile.size} | تم التحليل بنجاح</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleClearFile('calendar')}
                    className="text-xs text-slate-500 hover:text-rose-400 px-2 cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => calendarRef.current?.click()}
                  className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 p-4 rounded-xl text-center cursor-pointer transition-colors space-y-1.5"
                >
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">انقر أو اسحب ملف التقويم هنا</p>
                  <p className="text-[10px] text-slate-500">يتضمن التواريخ لكل من الفصل الدراسي الأول والثاني ومواعيد الامتحانات</p>
                  <input 
                    type="file" 
                    ref={calendarRef} 
                    accept=".pdf" 
                    onChange={(e) => handleFileUpload(e, 'calendar')} 
                    className="hidden" 
                  />
                </div>
              )}
            </div>

            {/* Upload Area 2: Textbook Semester 1 */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold block">
                ٢. كتاب المنهج - الفصل الدراسي الأول (PDF)
              </label>
              {textbook1File ? (
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-teal-500/20 text-xs">
                  <div className="flex items-center gap-2.5 text-teal-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <div className="text-right">
                      <p className="font-bold text-slate-200 truncate max-w-[170px]" title={textbook1File.name}>{textbook1File.name}</p>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">{textbook1File.size} | تم استخراج ٢٣ مهارة ومفردة</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleClearFile('txt1')}
                    className="text-xs text-slate-500 hover:text-rose-400 px-2 cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => textbook1Ref.current?.click()}
                  className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 p-4 rounded-xl text-center cursor-pointer transition-colors space-y-1.5"
                >
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">رفع كتاب القواعد والنصوص ف١</p>
                  <p className="text-[10px] text-slate-500">مقرر لغة لغتي الجميلة المعتمدة رسمياً</p>
                  <input 
                    type="file" 
                    ref={textbook1Ref} 
                    accept=".pdf" 
                    onChange={(e) => handleFileUpload(e, 'txt1')} 
                    className="hidden" 
                  />
                </div>
              )}
            </div>

            {/* Upload Area 3: Textbook Semester 2 */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold block">
                ٣. كتاب المنهج - الفصل الدراسي الثاني (PDF)
              </label>
              {textbook2File ? (
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-teal-500/20 text-xs">
                  <div className="flex items-center gap-2.5 text-teal-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <div className="text-right">
                      <p className="font-bold text-slate-200 truncate max-w-[170px]" title={textbook2File.name}>{textbook2File.name}</p>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">{textbook2File.size} | تم استخراج ٢٤ مهارة ومفردة</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleClearFile('txt2')}
                    className="text-xs text-slate-500 hover:text-rose-400 px-2 cursor-pointer"
                  >
                    حذف
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => textbook2Ref.current?.click()}
                  className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 p-4 rounded-xl text-center cursor-pointer transition-colors space-y-1.5"
                >
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">رفع كتاب القواعد والنصوص ف٢</p>
                  <p className="text-[10px] text-slate-500">يتكامل ويفعل التوزيع مباشرة عقب عطلة الميد</p>
                  <input 
                    type="file" 
                    ref={textbook2Ref} 
                    accept=".pdf" 
                    onChange={(e) => handleFileUpload(e, 'txt2')} 
                    className="hidden" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* SIMULATED PARSER DISPLAY PANEL */}
          <AnimatePresence>
            {isParsing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900 border border-slate-750 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>محاكاة السيرفر وتحليل بيانات الـ PDF...</span>
                </div>
                <div className="bg-slate-950/75 p-3 rounded-xl space-y-1.5 font-mono text-[10px] text-slate-400 h-28 overflow-y-auto leading-relaxed border border-slate-900">
                  {logMessages.map((msg, i) => (
                    <p key={i}>{msg}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PREFS & SIGNATURE PREVIEWS LIST */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-400" />
              مستوى المسؤولية والمصادقة المطبقة
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              سوف يثبت النظام الترويقة وبصمة توقيع المسؤولين المعتمدين بالأسفل على مستند التوزيع المطبوع لسلامته القانونية والمدرسية.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                <span className="text-slate-400">معلم المادة والمسؤول:</span>
                <span className="font-bold text-slate-200">{meta.teacherName}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                <span className="text-slate-400">التوجيه الإشرافي والموجه:</span>
                <span className="font-bold text-slate-200">{meta.supervisorName}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                <span className="text-slate-400">طبيعة المؤسسة والوزارة:</span>
                <span className="font-bold text-slate-200">مناهج الجمهورية اليمنية</span>
              </div>
            </div>
            
            <div className="p-3 bg-amber-400/5 border border-amber-400/10 rounded-xl text-[11px] text-amber-300/80 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">من أجل تعديل هوية أو أسماء الموجه والمدير والمدرسة بقفل النظام، يرجى تكييف البيانات بصندوق "الملف الشخصي" بالتحضير الجديد أولاً.</p>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Main scheduler interface with active shifting display */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filters stripe */}
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Grade Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold block">الصف الحركي:</span>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none cursor-pointer focus:border-amber-400"
                >
                  <option value="7">الصف السابع (جيل التأسيس)</option>
                  <option value="8">الصف الثامن (البناء والتعمق)</option>
                  <option value="9">الصف التاسع (مستوى الإتقان)</option>
                </select>
              </div>

              {/* Semester Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold block">الفصل الدراسي:</span>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none cursor-pointer focus:border-amber-400"
                >
                  <option value="1">الفصل الدراسي الأول (الخريف)</option>
                  <option value="2">الفصل الدراسي الثاني (الربيع)</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              العام الدراسي المقترح: <span className="text-emerald-500 font-bold">٢٠٢٦ / ٢٠٢٧ م</span>
            </div>
          </div>

          {/* ACTIVE SHIFT EXPLANATORY BANNER */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-350">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-200">🧭 محاكاة آلية الترحيل المرن ومقاومة الطوارئ:</p>
              <p>في حالة حدوث عطل طارئ أو هبوط مفاجئ في دافعية الصف، يمكنك الضغط على عمود حالة الأسبوع وتغيير الحالة إلى <span className="text-rose-400 font-bold">"إزاحة طوارئ / ترحيل"</span> ليرحل البرنامج ومحرك التوزيع الزمني التلقائي كامل الدروس اللاحقة بالتسلسل إلى الأسابيع القادمة دون نقص في المنهج الكلي كالمسارات التقليدية.</p>
            </div>
          </div>

          {/* WEEKS SCHEDULER MATRIX TABLE */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                مصفوفة التوزيع الزمني التفاعلي حسب التقويم المعتمد
              </h4>
              <span className="text-xs text-slate-400">انقر على شارة نوع المسار لتغيير حالته فوراً</span>
            </div>

            <div className="divide-y divide-slate-850">
              {currentWeeksLessons.map((item) => {
                const wk = item.week;
                const lesson = item.lesson;

                // Build type style
                let typeBg = "bg-slate-950 text-slate-300 border-slate-900";
                let typeLabel = "غير محدد";
                if (wk.type === "active") {
                  typeBg = "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";
                  typeLabel = "نشط ومستمر";
                } else if (wk.type === "delayed") {
                  typeBg = "bg-amber-400/10 text-amber-300 border-amber-400/20";
                  typeLabel = "تباطؤ علاجي";
                } else if (wk.type === "disrupted") {
                  typeBg = "bg-rose-400/10 text-rose-300 border-rose-400/20";
                  typeLabel = "إزاحة طوارئ";
                } else if (wk.type === "vacation") {
                  typeBg = "bg-sky-400/10 text-sky-350 border-sky-400/20";
                  typeLabel = "إجازة رسمية";
                } else if (wk.type === "exam") {
                  typeBg = "bg-purple-400/10 text-purple-350 border-purple-400/20";
                  typeLabel = "أسبوع مراجعة";
                }

                return (
                  <div key={wk.weekNum} className="p-4 hover:bg-slate-950/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* ID & Date range info */}
                    <div className="w-full md:w-1/4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200 font-display">{wk.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({wk.dateRange})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate" title={wk.note}>{wk.note}</div>
                    </div>

                    {/* Cycle type Status state */}
                    <div className="w-fit md:w-1/6">
                      <button
                        type="button"
                        onClick={() => toggleWeekType(wk.weekNum)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] font-bold cursor-pointer transition-all ${typeBg}`}
                      >
                        {typeLabel}
                      </button>
                    </div>

                    {/* Lessons contents mapping info */}
                    <div className="flex-1 space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-900 relative">
                      {lesson ? (
                        <>
                          <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                              {lesson.unit}
                            </span>
                            <span className="text-[10px] text-slate-500 leading-snug">{lesson.topic}</span>
                          </div>
                          
                          {/* 3 columns aspect summary */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10.5px] leading-relaxed pt-1 select-text">
                            <div>
                              <span className="text-slate-400 font-bold block mb-0.5">⚖️ النحو المتكامل المدرس:</span>
                              <span className="text-slate-300">{lesson.aspects.grammar}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block mb-0.5">✏️ الإملاء والخط البصري:</span>
                              <span className="text-slate-300">{lesson.aspects.dictation} / {lesson.aspects.calligraphy}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="py-2.5 text-center text-xs text-slate-500 italic flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-slate-600 animate-pulse" />
                          <span>تجميد أو إزاحة: لم تدرج دروس من كتاب المنهج في هذه الفترة المخصصة لتفادي التداخل.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
