import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌙 بدء إضافة البيانات...");

  // إنشاء اختبار ديني شامل
  const quiz = await prisma.quiz.create({
    data: {
      title: "اختبار المعلومات الإسلامية العامة",
      description:
        "اختبار شامل يضم أسئلة متنوعة في العقيدة والفقه والسيرة النبوية والقرآن الكريم. اختبر معلوماتك الدينية وتعلم المزيد!",
      timeLimit: 15, // 15 minutes
      isActive: true,
      questions: {
        create: [
          // أسئلة اختيار من متعدد
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "كم عدد سور القرآن الكريم؟",
            options: JSON.stringify(["100 سورة", "114 سورة", "120 سورة", "110 سورة"]),
            correctAnswer: JSON.stringify("114 سورة"),
            points: 1,
            order: 1,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "ما هي أطول سورة في القرآن الكريم؟",
            options: JSON.stringify(["سورة آل عمران", "سورة النساء", "سورة البقرة", "سورة الأنعام"]),
            correctAnswer: JSON.stringify("سورة البقرة"),
            points: 1,
            order: 2,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "كم عدد أركان الإسلام؟",
            options: JSON.stringify(["4 أركان", "5 أركان", "6 أركان", "7 أركان"]),
            correctAnswer: JSON.stringify("5 أركان"),
            points: 1,
            order: 3,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "ما هو أول ما يُسأل عنه العبد يوم القيامة؟",
            options: JSON.stringify(["الزكاة", "الصيام", "الصلاة", "الحج"]),
            correctAnswer: JSON.stringify("الصلاة"),
            points: 1,
            order: 4,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "في أي سنة هجرية فُرض الصيام؟",
            options: JSON.stringify(["السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة"]),
            correctAnswer: JSON.stringify("السنة الثانية"),
            points: 1,
            order: 5,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "من هو خاتم الأنبياء والمرسلين؟",
            options: JSON.stringify(["سيدنا عيسى عليه السلام", "سيدنا موسى عليه السلام", "سيدنا محمد صلى الله عليه وسلم", "سيدنا إبراهيم عليه السلام"]),
            correctAnswer: JSON.stringify("سيدنا محمد صلى الله عليه وسلم"),
            points: 1,
            order: 6,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "ما هي السورة التي تُسمى بقلب القرآن؟",
            options: JSON.stringify(["سورة الرحمن", "سورة يس", "سورة الملك", "سورة الواقعة"]),
            correctAnswer: JSON.stringify("سورة يس"),
            points: 1,
            order: 7,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "كم مرة ذُكر اسم سيدنا محمد في القرآن الكريم؟",
            options: JSON.stringify(["مرتان", "3 مرات", "4 مرات", "5 مرات"]),
            correctAnswer: JSON.stringify("4 مرات"),
            points: 1,
            order: 8,
          },

          // أسئلة صح أو خطأ
          {
            type: QuestionType.TRUE_FALSE,
            text: "أول من أسلم من الرجال هو سيدنا أبو بكر الصديق رضي الله عنه",
            options: null,
            correctAnswer: JSON.stringify(true),
            points: 1,
            order: 9,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "ليلة القدر تكون في العشر الأواخر من رمضان",
            options: null,
            correctAnswer: JSON.stringify(true),
            points: 1,
            order: 10,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "عدد ركعات صلاة الفجر أربع ركعات",
            options: null,
            correctAnswer: JSON.stringify(false),
            points: 1,
            order: 11,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "أول آية نزلت في القرآن الكريم هي (اقرأ باسم ربك الذي خلق)",
            options: null,
            correctAnswer: JSON.stringify(true),
            points: 1,
            order: 12,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "غزوة بدر وقعت في السنة الثالثة للهجرة",
            options: null,
            correctAnswer: JSON.stringify(false),
            points: 1,
            order: 13,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "الزكاة ركن من أركان الإسلام",
            options: null,
            correctAnswer: JSON.stringify(true),
            points: 1,
            order: 14,
          },

          // أسئلة ترتيب
          {
            type: QuestionType.ORDERING,
            text: "رتب أركان الإسلام بالترتيب الصحيح",
            options: JSON.stringify([
              "الشهادتان",
              "الصلاة",
              "الزكاة",
              "صيام رمضان",
              "الحج"
            ]),
            correctAnswer: JSON.stringify([
              "الشهادتان",
              "الصلاة",
              "الزكاة",
              "صيام رمضان",
              "الحج"
            ]),
            points: 2,
            order: 15,
          },
          {
            type: QuestionType.ORDERING,
            text: "رتب الخلفاء الراشدين حسب ترتيب خلافتهم",
            options: JSON.stringify([
              "أبو بكر الصديق",
              "عمر بن الخطاب",
              "عثمان بن عفان",
              "علي بن أبي طالب"
            ]),
            correctAnswer: JSON.stringify([
              "أبو بكر الصديق",
              "عمر بن الخطاب",
              "عثمان بن عفان",
              "علي بن أبي طالب"
            ]),
            points: 2,
            order: 16,
          },
          {
            type: QuestionType.ORDERING,
            text: "رتب الصلوات الخمس حسب ترتيبها في اليوم",
            options: JSON.stringify([
              "الفجر",
              "الظهر",
              "العصر",
              "المغرب",
              "العشاء"
            ]),
            correctAnswer: JSON.stringify([
              "الفجر",
              "الظهر",
              "العصر",
              "المغرب",
              "العشاء"
            ]),
            points: 2,
            order: 17,
          },

          // المزيد من أسئلة الاختيار من متعدد
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "ما هي السورة التي لا تبدأ بالبسملة؟",
            options: JSON.stringify(["سورة الفاتحة", "سورة التوبة", "سورة الإخلاص", "سورة الناس"]),
            correctAnswer: JSON.stringify("سورة التوبة"),
            points: 1,
            order: 18,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "من هو الصحابي الملقب بأمين الأمة؟",
            options: JSON.stringify(["أبو بكر الصديق", "عمر بن الخطاب", "أبو عبيدة بن الجراح", "عثمان بن عفان"]),
            correctAnswer: JSON.stringify("أبو عبيدة بن الجراح"),
            points: 1,
            order: 19,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "كم عام استمرت الدعوة السرية في مكة؟",
            options: JSON.stringify(["سنة واحدة", "سنتان", "3 سنوات", "5 سنوات"]),
            correctAnswer: JSON.stringify("3 سنوات"),
            points: 1,
            order: 20,
          },
        ],
      },
    },
  });

  console.log(`✅ تم إنشاء اختبار: ${quiz.title}`);
  console.log(`📝 عدد الأسئلة: 20 سؤال`);

  // إنشاء اختبار ثاني عن السيرة النبوية
  const quiz2 = await prisma.quiz.create({
    data: {
      title: "اختبار السيرة النبوية",
      description:
        "اختبار متخصص في السيرة النبوية الشريفة، يشمل أحداث حياة النبي صلى الله عليه وسلم من مولده حتى وفاته.",
      timeLimit: 10, // 10 minutes
      isActive: true,
      questions: {
        create: [
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "في أي عام وُلد النبي صلى الله عليه وسلم؟",
            options: JSON.stringify(["عام الفيل", "عام الحزن", "عام الفتح", "عام الوفود"]),
            correctAnswer: JSON.stringify("عام الفيل"),
            points: 1,
            order: 1,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "ما اسم أم النبي صلى الله عليه وسلم؟",
            options: JSON.stringify(["خديجة بنت خويلد", "آمنة بنت وهب", "فاطمة بنت أسد", "هالة بنت خويلد"]),
            correctAnswer: JSON.stringify("آمنة بنت وهب"),
            points: 1,
            order: 2,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "من هي مرضعة النبي صلى الله عليه وسلم؟",
            options: JSON.stringify(["أم أيمن", "حليمة السعدية", "ثويبة", "فاطمة بنت أسد"]),
            correctAnswer: JSON.stringify("حليمة السعدية"),
            points: 1,
            order: 3,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "كم كان عمر النبي عند وفاة أمه؟",
            options: JSON.stringify(["4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات"]),
            correctAnswer: JSON.stringify("6 سنوات"),
            points: 1,
            order: 4,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "من هو عم النبي الذي كفله بعد وفاة جده؟",
            options: JSON.stringify(["أبو لهب", "أبو طالب", "العباس", "حمزة"]),
            correctAnswer: JSON.stringify("أبو طالب"),
            points: 1,
            order: 5,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "كان عمر النبي 40 سنة عند نزول الوحي",
            options: null,
            correctAnswer: JSON.stringify(true),
            points: 1,
            order: 6,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "أول من آمن من النساء هي السيدة عائشة رضي الله عنها",
            options: null,
            correctAnswer: JSON.stringify(false),
            points: 1,
            order: 7,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "الهجرة إلى المدينة كانت في السنة الثالثة عشرة من البعثة",
            options: null,
            correctAnswer: JSON.stringify(true),
            points: 1,
            order: 8,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "ما هي أول غزوة غزاها النبي صلى الله عليه وسلم؟",
            options: JSON.stringify(["غزوة بدر", "غزوة أحد", "غزوة الأبواء", "غزوة بني قينقاع"]),
            correctAnswer: JSON.stringify("غزوة الأبواء"),
            points: 1,
            order: 9,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "في أي سنة هجرية كان فتح مكة؟",
            options: JSON.stringify(["السنة 6", "السنة 7", "السنة 8", "السنة 9"]),
            correctAnswer: JSON.stringify("السنة 8"),
            points: 1,
            order: 10,
          },
          {
            type: QuestionType.ORDERING,
            text: "رتب أحداث السيرة النبوية حسب ترتيبها الزمني",
            options: JSON.stringify([
              "نزول الوحي",
              "الهجرة إلى المدينة",
              "غزوة بدر",
              "فتح مكة",
              "حجة الوداع"
            ]),
            correctAnswer: JSON.stringify([
              "نزول الوحي",
              "الهجرة إلى المدينة",
              "غزوة بدر",
              "فتح مكة",
              "حجة الوداع"
            ]),
            points: 2,
            order: 11,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "كم عدد زوجات النبي صلى الله عليه وسلم؟",
            options: JSON.stringify(["9 زوجات", "11 زوجة", "13 زوجة", "7 زوجات"]),
            correctAnswer: JSON.stringify("11 زوجة"),
            points: 1,
            order: 12,
          },
          {
            type: QuestionType.TRUE_FALSE,
            text: "توفي النبي صلى الله عليه وسلم في المدينة المنورة",
            options: null,
            correctAnswer: JSON.stringify(true),
            points: 1,
            order: 13,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "من هو الصحابي الذي رافق النبي في الهجرة؟",
            options: JSON.stringify(["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق", "عثمان بن عفان"]),
            correctAnswer: JSON.stringify("أبو بكر الصديق"),
            points: 1,
            order: 14,
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            text: "ما اسم الغار الذي اختبأ فيه النبي وأبو بكر أثناء الهجرة؟",
            options: JSON.stringify(["غار حراء", "غار ثور", "غار قباء", "غار المدينة"]),
            correctAnswer: JSON.stringify("غار ثور"),
            points: 1,
            order: 15,
          },
        ],
      },
    },
  });

  console.log(`✅ تم إنشاء اختبار: ${quiz2.title}`);
  console.log(`📝 عدد الأسئلة: 15 سؤال`);

  console.log("🎉 تم إضافة جميع البيانات بنجاح!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
