/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArabicPlan, REVIEW_WEEKS } from "../types";

export function exportWord(plan: ArabicPlan): void {
  const m = plan.meta;
  
  const stageRows = plan.stages.map((st, i) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold; background-color: #fcfcfc;">
        ${["①", "②", "③", "④"][i] || ""} ${st.name}
      </td>
      <td style="padding: 10px; border: 1px solid #ccc; text-align: center; font-weight: bold; color: #1b3f7a;">
        ${st.t}′
      </td>
      <td style="padding: 10px; border: 1px solid #ccc; line-height: 1.6;">
        ${(st.acts || []).map(a => "• " + a).join("<br/>")}
      </td>
      <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">
        ${["التوجيه والتحفيز", "الشرح والعرض", "الإرشاد والمتابعة", "التقييم والتلخيص"][i] || ""}
      </td>
      <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">
        ${["الاستماع والمشاركة", "الفهم والاستيعاب", "التطبيق والممارسة", "التقييم الذاتي"][i] || ""}
      </td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<style>
  body {
    font-family: 'Traditional Arabic', 'Arial', serif;
    font-size: 13.5pt;
    direction: rtl;
    margin: 2.5cm 2cm;
    color: #111;
  }
  h1 {
    font-size: 19pt;
    color: #1b3f7a;
    text-align: center;
    border-bottom: 3px solid #f0c040;
    padding-bottom: 8px;
    margin-bottom: 15px;
  }
  h2 {
    font-size: 15pt;
    color: #1b3f7a;
    border-right: 4px solid #3d8ef0;
    padding-right: 10px;
    margin: 18px 0 10px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5pt;
    margin-bottom: 12px;
  }
  th {
    background-color: #1b3f7a;
    color: white;
    padding: 8px 10px;
    text-align: right;
    font-size: 12pt;
    border: 1px solid #1b3f7a;
  }
  td {
    border: 1px solid #ccc;
    padding: 7px 10px;
    text-align: right;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background-color: #f7fafc;
  }
  .meta-label {
    font-size: 10pt;
    color: #1b3f7a;
    font-weight: bold;
  }
  .box {
    background-color: #fffdf0;
    border: 1px solid #f0c040;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
    line-height: 1.6;
  }
  .badge {
    display: inline-block;
    background-color: #e8f0ff;
    border: 1px solid #3d8ef0;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 10.5pt;
    margin: 3px;
  }
  .sig {
    margin-top: 30px;
  }
  .sig td {
    border: none;
    text-align: center;
    padding-top: 30px;
    font-size: 11.5pt;
    color: #333;
  }
  .footer {
    text-align: center;
    font-size: 9.5pt;
    color: #777;
    margin-top: 30px;
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
</style>
</head>
<body>
<h1>خطة تحضير درس اللغة العربية — ${m.lessonTitle}</h1>
<table>
  <tr>
    <td style="width: 33%;"><span class="meta-label">المعلم / المعلمة</span><br/>${m.teacherName || "—"}</td>
    <td style="width: 33%;"><span class="meta-label">المدرسة</span><br/>${m.schoolName || "—"}</td>
    <td style="width: 33%;"><span class="meta-label">الموجه التربوي</span><br/>${m.supervisorName || "—"}</td>
  </tr>
  <tr>
    <td><span class="meta-label">الصف</span><br/>${m.grade}</td>
    <td><span class="meta-label">القسم</span><br/>${m.subject} ${m.subType ? "(" + m.subType + ")" : ""}</td>
    <td><span class="meta-label">عنوان الدرس</span><br/><b>${m.lessonTitle}</b></td>
  </tr>
  <tr>
    <td><span class="meta-label">الوحدة / الفصل</span><br/>${m.bookUnit || "—"}</td>
    <td><span class="meta-label">اليوم والتاريخ</span><br/>${m.day} — ${m.date}</td>
    <td><span class="meta-label">الحصة والمدة</span><br/>${m.periodNum ? "الحصة " + m.periodNum + " (" + m.period + ")" : "—"} · ${m.duration} دقيقة</td>
  </tr>
  <tr>
    <td><span class="meta-label">نمط الحصة</span><br/>${m.lessonTypeLabel || "—"}</td>
    <td><span class="meta-label">نوع التمهيد</span><br/>${m.introTypeLabel || "—"}</td>
    <td><span class="meta-label">الأسبوع الدراسي</span><br/>الأسبوع ${m.week} من 14 ${REVIEW_WEEKS.includes(Number(m.week)) ? "🔁 أسبوع مراجعة" : ""}</td>
  </tr>
  <tr>
    <td colspan="2"><span class="meta-label">المستوى المعرفي للفئة المستهدفة</span><br/>${m.level}</td>
    <td><span class="meta-label">مستوى بلوم المستهدف</span><br/>${m.bloom}</td>
  </tr>
</table>

<h2>الأهداف التعليمية السلوكية</h2>
<table>
  <thead>
    <tr>
      <th style="width: 40px; text-align: center;">#</th>
      <th>الهدف السلوكي الإجرائي</th>
    </tr>
  </thead>
  <tbody>
    ${plan.objectives.map((o, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold; color: #1b3f7a;">${idx + 1}</td>
        <td>${o}</td>
      </tr>`).join("")}
  </tbody>
</table>

<h2>استراتيجية جيل ألفا: ${plan.alphaStrategy}</h2>
<div class="box">${plan.alphaDesc}</div>

<h2>التمهيد وإثارة الفضول المعرفي: ${plan.introLabel}</h2>
<div class="box">${plan.introEx}</div>

${plan.remedialPlan ? `
<h2>${plan.remedialPlan.title} (الطبقة العلاجية المتغيرة المستجدة)</h2>
<div class="box" style="background-color: #faf5ff; border: 1px solid #c084fc;">
  <strong style="color: #581c87;">التشخيص الطارئ للفجوة اللغوية:</strong> ${plan.remedialPlan.targetGap}
  <br/><br/>
  <strong style="color: #581c87;">🪜 الإجراءات المصاحبة لردم الفجوة:</strong><br/>
  ${plan.remedialPlan.microPlan.map(x => "• " + x).join("<br/>")}
  <br/><br/>
  <strong style="color: #0f766e;">🎭 التدابير النفسية والتهيئة السلوكية المطبقة:</strong><br/>
  ${plan.remedialPlan.psychActions.map(x => "• " + x).join("<br/>")}
</div>` : ""}

<h2>الوسائل التعليمية والاستراتيجيات التدريسية</h2>
<table>
  <thead>
    <tr>
      <th style="width: 50%;">الوسائل التعليمية والمعينات الصفية</th>
      <th style="width: 50%;">الاستراتيجيات والطرائق التدريسية الموظفة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="line-height: 1.6;">${plan.tools.map(t => "• " + t).join("<br/>")}</td>
      <td style="line-height: 1.6;">${plan.strategies.map(s => "• " + s).join("<br/>")}</td>
    </tr>
  </tbody>
</table>

<h2>خطوات وإجراءات سير الدرس</h2>
<table>
  <thead>
    <tr>
      <th style="width: 130px;">المرحلة التعليمية</th>
      <th style="width: 50px; text-align: center;">الزمن</th>
      <th>الأنشطة والأنشطة المقابلة بالتفصيل</th>
      <th style="width: 100px; text-align: center;">دور المعلم</th>
      <th style="width: 100px; text-align: center;">دور الطالب</th>
    </tr>
  </thead>
  <tbody>
    ${stageRows}
  </tbody>
</table>

<h2>الأخطاء المتوقعة والعلاج التربوي الفوري</h2>
<table>
  <thead>
    <tr>
      <th style="width: 40%;">الخطأ المتوقع من الطلاب</th>
      <th style="width: 60%;">الإجراء العلاجي الفوري المباشر</th>
    </tr>
  </thead>
  <tbody>
    ${plan.expectedErrors.map((e, idx) => `
      <tr>
        <td style="color: #b91c1c; font-weight: bold;">⚠️ ${e}</td>
        <td>✓ ${plan.errorRemedies[idx] || "تصحيح فوري موجه بتقديم مثال مقابل"}</td>
      </tr>`).join("")}
  </tbody>
</table>

<h2>أساليب التقييم التكويني والنهائي</h2>
<p>
  ${plan.assessments.map(a => `<span class="badge">✓ ${a}</span>`).join(" ")}
</p>

<h2>الواجب المنزلي المطور للتثبيت</h2>
<div class="box">${plan.homework}</div>

${plan.challengeRecs.length ? `
<h2>أفكار معالجة الفروق والتحديات الصفية</h2>
<p>
  ${plan.challengeRecs.map(r => `<span class="badge">◈ ${r}</span>`).join(" ")}
</p>` : ""}

<h2>ملاحظات الفروق الذهنية والظروف الاستثنائية لجيل ألفا اليمني</h2>
<div class="box">
  ${m.cogNote}
  <br/><br/>
  <i>تنبيه تربوي هام: قد تؤدي فجوات الانقطاعات المستمرة إلى تراجع المستويات المكتسبة — يُرجى مراعاة ذلك عبر التدرج والتشخيص المستمر قبل عرض المفاهيم المعقدة.</i>
</div>

<h2>المراجع والمصادر التعليمية المعتمدة</h2>
<p>
  ${plan.references.map(r => `<span class="badge">📎 ${r}</span>`).join(" ")}
</p>

<table class="sig">
  <tr>
    <td>توقيع المعلم / المعلمة<br/><br/>_______________________<br/>التاريخ: ___ / ___ / ______</td>
    <td>توقيع مدير / مديرة المدرسة<br/><br/>_______________________<br/>التاريخ: ___ / ___ / ______</td>
    <td>توقيع الموجه التربوي المختص<br/><br/>_______________________<br/>التاريخ: ___ / ___ / ______</td>
  </tr>
</table>

<div class="footer">
  نشأ وتأسس عبر ${m.lessonTitle === "بدون عنوان" ? "منظومة نور" : "منظومة نور لتحضير الدروس"} · مخصّص للصفوف 7-9 بالجمهورية اليمنية
</div>
</body>
</html>`;

  const blob = new Blob(["\uFEFF" + html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `خطة_${m.lessonTitle || "درس"}_${m.subjectKey}.doc`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
