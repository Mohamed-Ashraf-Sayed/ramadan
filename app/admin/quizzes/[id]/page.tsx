"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, Input, Textarea, Select, Card, CardContent, CardHeader, CardFooter } from "@/components/ui";
import type { Quiz, Question, QuestionType } from "@/types";
import { getMediaUrl } from "@/lib/media";

const questionTypeOptions = [
  { value: "MULTIPLE_CHOICE", label: "اختيار من متعدد" },
  { value: "TRUE_FALSE", label: "صح أو خطأ" },
  { value: "ORDERING", label: "ترتيب" },
  { value: "IMAGE_TEXT", label: "صورة/فيديو + إجابة نصية" },
];

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // New question form
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: "MULTIPLE_CHOICE" as QuestionType,
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
    mediaUrl: "",
    mediaType: "",
  });

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  async function fetchQuiz() {
    try {
      const response = await fetch(`/api/quizzes/${quizId}?includeQuestions=true`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
        const questionsResponse = await fetch(`/api/questions?quizId=${quizId}`);
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData);
        }
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuiz(data: Partial<Quiz>) {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const updatedQuiz = await response.json();
        setQuiz(updatedQuiz);
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNewQuestion({
          ...newQuestion,
          mediaUrl: data.url,
          mediaType: data.mediaType,
        });
      } else {
        const error = await response.json();
        alert(error.error || "حدث خطأ أثناء رفع الملف");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("حدث خطأ أثناء رفع الملف");
    } finally {
      setUploading(false);
    }
  }

  async function addQuestion() {
    if (!newQuestion.text.trim() && newQuestion.type !== "IMAGE_TEXT") {
      alert("يرجى إدخال نص السؤال");
      return;
    }

    if (newQuestion.type === "IMAGE_TEXT" && !newQuestion.mediaUrl) {
      alert("يرجى رفع صورة أو فيديو");
      return;
    }

    if (newQuestion.type === "IMAGE_TEXT" && !newQuestion.correctAnswer.trim()) {
      alert("يرجى إدخال الإجابة الصحيحة");
      return;
    }

    setSaving(true);

    try {
      let correctAnswer: string | boolean | string[] = newQuestion.correctAnswer;
      let options: string[] | null = null;

      if (newQuestion.type === "MULTIPLE_CHOICE") {
        const validOptions = newQuestion.options.filter(o => o.trim());
        if (validOptions.length < 2) {
          alert("يرجى إدخال خيارين على الأقل");
          setSaving(false);
          return;
        }
        if (!newQuestion.correctAnswer) {
          alert("يرجى اختيار الإجابة الصحيحة");
          setSaving(false);
          return;
        }
        options = validOptions;
      } else if (newQuestion.type === "TRUE_FALSE") {
        correctAnswer = newQuestion.correctAnswer === "true";
      } else if (newQuestion.type === "ORDERING") {
        const validOptions = newQuestion.options.filter(o => o.trim());
        if (validOptions.length < 2) {
          alert("يرجى إدخال عنصرين على الأقل للترتيب");
          setSaving(false);
          return;
        }
        options = validOptions;
        correctAnswer = validOptions;
      }

      const body: Record<string, unknown> = {
        quizId: parseInt(quizId),
        type: newQuestion.type,
        text: newQuestion.text || (newQuestion.type === "IMAGE_TEXT" ? "ما الإجابة الصحيحة؟" : ""),
        options,
        correctAnswer,
        points: newQuestion.points,
      };

      if (newQuestion.type === "IMAGE_TEXT") {
        body.mediaUrl = newQuestion.mediaUrl;
        body.mediaType = newQuestion.mediaType;
      }

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchQuiz();
        setNewQuestion({
          type: "MULTIPLE_CHOICE",
          text: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          points: 1,
          mediaUrl: "",
          mediaType: "",
        });
        setShowNewQuestion(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert("حدث خطأ أثناء إضافة السؤال");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("حدث خطأ أثناء إضافة السؤال");
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuestion(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    try {
      const response = await fetch(`/api/questions/${id}`, { method: "DELETE" });
      if (response.ok) await fetchQuiz();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-ramadan-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-ramadan-gold mb-4">الاختبار غير موجود</h1>
        <Link href="/admin/quizzes"><Button>العودة للاختبارات</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/admin/quizzes" className="inline-flex items-center text-ramadan-gold hover:text-ramadan-gold-light transition-colors">
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        العودة للاختبارات
      </Link>

      {/* Quiz Info */}
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-ramadan-gold">تعديل الاختبار</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="عنوان الاختبار" value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} onBlur={() => updateQuiz({ title: quiz.title })} />
          <Textarea label="وصف الاختبار" value={quiz.description || ""} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} onBlur={() => updateQuiz({ description: quiz.description })} rows={2} />
          <Input type="number" label="مدة الاختبار بالدقائق" placeholder="اتركه فارغاً لعدم تحديد وقت" value={quiz.timeLimit?.toString() || ""} onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value ? parseInt(e.target.value) : null })} onBlur={() => updateQuiz({ timeLimit: quiz.timeLimit })} min={1} helperText="اتركه فارغاً إذا كنت لا تريد تحديد وقت" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={quiz.isActive} onChange={(e) => { setQuiz({ ...quiz, isActive: e.target.checked }); updateQuiz({ isActive: e.target.checked }); }} className="w-5 h-5 rounded border-ramadan-gold/30 text-ramadan-gold focus:ring-ramadan-gold" />
              <span className="text-sm text-white">الاختبار نشط ومتاح للمشاركين</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Questions Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-ramadan-gold">الأسئلة ({questions.length})</h2>
        <Button onClick={() => setShowNewQuestion(true)}>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة سؤال
        </Button>
      </div>

      {/* New Question Form */}
      {showNewQuestion && (
        <Card className="border-2 border-ramadan-gold/50">
          <CardHeader>
            <h3 className="font-bold text-ramadan-gold">سؤال جديد</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="نوع السؤال"
              options={questionTypeOptions}
              value={newQuestion.type}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  type: e.target.value as QuestionType,
                  correctAnswer: "",
                  options: ["", "", "", ""],
                  mediaUrl: "",
                  mediaType: "",
                })
              }
            />

            {/* Question text - optional for IMAGE_TEXT */}
            <Textarea
              label={newQuestion.type === "IMAGE_TEXT" ? "نص السؤال (اختياري)" : "نص السؤال"}
              placeholder={newQuestion.type === "IMAGE_TEXT" ? "مثال: ما اسم هذا المكان؟" : "اكتب السؤال هنا..."}
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              rows={2}
            />

            {/* IMAGE_TEXT specific fields */}
            {newQuestion.type === "IMAGE_TEXT" && (
              <div className="space-y-4">
                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">رفع صورة أو فيديو</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                        newQuestion.mediaUrl ? "border-success/50 bg-success/5" : "border-ramadan-gold/30 hover:border-ramadan-gold/60"
                      }`}>
                        {uploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-ramadan-gold border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-white/60 text-sm">جاري الرفع...</p>
                          </div>
                        ) : newQuestion.mediaUrl ? (
                          <div className="flex flex-col items-center gap-3">
                            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-success text-sm font-medium">تم رفع الملف بنجاح</p>
                            <p className="text-white/40 text-xs">انقر لتغيير الملف</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <svg className="w-12 h-12 text-ramadan-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-white/60 text-sm">انقر لاختيار صورة أو فيديو</p>
                            <p className="text-white/40 text-xs">JPG, PNG, GIF, MP4, WEBM - حتى 50MB</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Media Preview */}
                {newQuestion.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-ramadan-gold/20">
                    {newQuestion.mediaType === "video" ? (
                      <video src={newQuestion.mediaUrl} controls className="w-full max-h-64 object-contain bg-black" />
                    ) : (
                      <Image src={newQuestion.mediaUrl} alt="معاينة" width={600} height={300} className="w-full max-h-64 object-contain" />
                    )}
                  </div>
                )}

                {/* Correct Answer */}
                <Input
                  label="الإجابة الصحيحة"
                  placeholder="اكتب الإجابة الصحيحة..."
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                />
                <p className="text-xs text-white/40">
                  التصحيح مرن - يتجاهل التشكيل والمسافات الزيادة والأخطاء البسيطة
                </p>
              </div>
            )}

            {/* MULTIPLE_CHOICE options */}
            {newQuestion.type === "MULTIPLE_CHOICE" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">الخيارات</label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="radio" name="correctAnswer" checked={newQuestion.correctAnswer === option && option !== ""} onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: option })} disabled={!option.trim()} className="w-4 h-4" />
                    <Input placeholder={`الخيار ${index + 1}`} value={option} onChange={(e) => { const newOptions = [...newQuestion.options]; newOptions[index] = e.target.value; setNewQuestion({ ...newQuestion, options: newOptions }); }} />
                  </div>
                ))}
                <p className="text-xs text-white/40">حدد الإجابة الصحيحة بالنقر على الدائرة</p>
              </div>
            )}

            {/* TRUE_FALSE options */}
            {newQuestion.type === "TRUE_FALSE" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">الإجابة الصحيحة</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trueFalse" value="true" checked={newQuestion.correctAnswer === "true"} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} className="w-4 h-4" />
                    <span className="text-white">صحيح</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="trueFalse" value="false" checked={newQuestion.correctAnswer === "false"} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} className="w-4 h-4" />
                    <span className="text-white">خطأ</span>
                  </label>
                </div>
              </div>
            )}

            {/* ORDERING options */}
            {newQuestion.type === "ORDERING" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">العناصر بالترتيب الصحيح</label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-ramadan-gold/20 flex items-center justify-center text-sm font-bold text-ramadan-gold">{index + 1}</span>
                    <Input placeholder={`العنصر ${index + 1}`} value={option} onChange={(e) => { const newOptions = [...newQuestion.options]; newOptions[index] = e.target.value; setNewQuestion({ ...newQuestion, options: newOptions }); }} />
                  </div>
                ))}
                <p className="text-xs text-white/40">أدخل العناصر بالترتيب الصحيح، سيتم خلطها للمشارك</p>
              </div>
            )}

            <Input type="number" label="النقاط" value={newQuestion.points} onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 1 })} min={1} />
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewQuestion(false)}>إلغاء</Button>
            <Button onClick={addQuestion} isLoading={saving}>إضافة السؤال</Button>
          </CardFooter>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-ramadan-gold text-ramadan-dark flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <span className="text-xs bg-ramadan-gold/20 text-ramadan-gold px-2 py-1 rounded">
                      {question.type === "MULTIPLE_CHOICE" && "اختيار متعدد"}
                      {question.type === "TRUE_FALSE" && "صح/خطأ"}
                      {question.type === "ORDERING" && "ترتيب"}
                      {question.type === "IMAGE_TEXT" && "صورة + نص"}
                    </span>
                    <span className="text-xs text-ramadan-orange">{question.points} {question.points === 1 ? "نقطة" : "نقاط"}</span>
                  </div>
                  <p className="text-white mb-2">{question.text}</p>

                  {/* Show media thumbnail for IMAGE_TEXT */}
                  {question.type === "IMAGE_TEXT" && question.mediaUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-ramadan-gold/20 inline-block">
                      {question.mediaType === "video" ? (
                        <video src={getMediaUrl(question.mediaUrl)} className="h-24 object-cover" />
                      ) : (
                        <Image src={getMediaUrl(question.mediaUrl)} alt="" width={150} height={96} className="h-24 w-auto object-cover" />
                      )}
                    </div>
                  )}

                  {question.options && (
                    <div className="text-sm text-white/50">
                      <span className="font-medium">الخيارات: </span>
                      {Array.isArray(question.options) ? question.options.join("، ") : ""}
                    </div>
                  )}
                  <div className="text-sm text-success mt-1">
                    <span className="font-medium">الإجابة: </span>
                    {question.type === "TRUE_FALSE"
                      ? question.correctAnswer === true ? "صحيح" : "خطأ"
                      : Array.isArray(question.correctAnswer)
                      ? question.correctAnswer.join(" → ")
                      : String(question.correctAnswer)}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteQuestion(question.id)} className="text-error hover:bg-error/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {questions.length === 0 && !showNewQuestion && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-white/50 mb-4">لا توجد أسئلة بعد</p>
              <Button onClick={() => setShowNewQuestion(true)}>إضافة السؤال الأول</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
