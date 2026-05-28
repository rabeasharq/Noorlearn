/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { REVIEW_WEEKS } from "../types";

interface ReviewBannerProps {
  week: string;
}

export default function ReviewBanner({ week }: ReviewBannerProps) {
  const w = Number(week) || 1;
  const isR = REVIEW_WEEKS.includes(w);
  const nx = REVIEW_WEEKS.find(x => x > w);

  if (!isR && !nx) return null;

  return (
    <div
      className={`p-4 rounded-xl border mb-6 transition-all duration-300 ${
        isR
          ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
          : "bg-sky-500/5 border-sky-500/20 text-sky-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{isR ? "🔁" : "📅"}</span>
        <h4 className="font-bold text-base">
          {isR
            ? `هذا الأسبوع (الأسبوع ${w}) مخصّص مراجعة وتثبيت!`
            : `محطة المراجعة والتثقيف القادمة: الأسبوع ${nx}`}
        </h4>
      </div>

      {isR ? (
        <div className="text-sm leading-relaxed text-amber-300/80">
          <p className="mb-1">
            <strong>قيمة النمط المقترحة:</strong> مراجعة وتثبيت تراكمي ومحطات مرنة.
          </p>
          <p>
            <strong>المحتوى الموصى به:</strong> مراجعة مخرجات الأسابيع السابقة من {Math.max(1, w - 4)} وحتى {w} · معالجة الفروق وتشخيص الثغرات لتعويض فجوات التحصيل الدراسي.
          </p>
        </div>
      ) : (
        <p className="text-sm text-sky-300/60 leading-relaxed">
          التحضير البنائي النشط: متبقي <strong>{nx! - w}</strong> أسابيع حتى محطة التقييم التراكمية القادمة. تفقد تفاعل الطلاب ودوّن ملاحظات لتبسيطها لاحقاً.
        </p>
      )}
    </div>
  );
}
