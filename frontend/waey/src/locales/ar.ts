const ar: Record<string, string> = {
  // Navbar
  'nav.home': 'الرئيسية',
  'nav.health': 'الصحة',
  'nav.finance': 'المالية',
  'nav.environment': 'البيئة',
  'nav.education': 'التعليم',
  'nav.dashboard': 'يومي',
  'nav.login': 'تسجيل الدخول',
  'nav.account': 'حسابي',
  'nav.logout': 'تسجيل الخروج',
  'nav.signOut': 'تسجيل الخروج',
  'nav.toggleDark': 'تبديل الوضع',
  'nav.toggleLang': 'English',

  // Footer
  'footer.desc': 'منصة وعي — رحلتك نحو التوازن الشامل في الصحة، المال، البيئة، والتعليم.',
  'footer.copyright': 'جميع الحقوق محفوظة © وعي',

  // Hero
  'hero.badge': 'منصة التوازن الشامل',
  'hero.title1': 'ازرع عاداتك اليوم،',
  'hero.title2': 'واحصد حياة متوازنة غداً.',
  'hero.desc': 'منصة وعي ترشدك خطوة بخطوة نحو استقرار مالي، صحة مستدامة، وبيئة مزدهرة.',
  'hero.alt': 'نبتة خضراء تنمو من تربة ذهبية ترمز للنمو والاستدامة',

  // Index sections
  'index.explore': 'استكشف الأقسام',
  'index.heading': 'اختر المجال اللي عايز تبدأ فيه',
  'index.cta': 'ادخل القسم',

  // Cards
  'card.health.title': 'الصحة',
  'card.health.desc': 'عادات بسيطة لجسد قوي وعقل صافي.',
  'card.finance.title': 'المالية',
  'card.finance.desc': 'حاسبات وادخار يبني مستقبلك.',
  'card.environment.title': 'البيئة',
  'card.environment.desc': 'إعادة تدوير وتوفير طاقة وماء.',
  'card.education.title': 'التعليم والتركيز',
  'card.education.desc': 'طرق مذاكرة، إزاي تركز، وكلمات تحفّزك.',
  'card.dashboard.title': 'يومي في وعي',
  'card.dashboard.desc': 'لوحة شخصية، تحدي اليوم وتتبع عاداتك.',

  // Prize section
  'prize.badge': '🏆 نظام الجائزة',
  'prize.first': 'أول مستخدم يصل إلى',
  'prize.points': 'نقطة استمرار يفوز بـ',
  'prize.amount': '500 جنيه مصري',
  'prize.desc': 'كل 5 دقائق تواجد نشط = نقطة استمرار (مرة واحدة يومياً). سجل دخولك وابدأ جمع النقاط!',

  // Health page
  'health.badge': 'الصحة الشاملة',
  'health.title': 'ابنِ صحتك بخطوات يومية',
  'health.subtitle': 'عادات بسيطة لجسد قوي وعقل صافي. نصائح متجددة كل أسبوع.',
  'health.recipesHeading': 'وصفات صحية',
  'health.recipesDesc': 'أكل بيتي مصري بسعرات وتكلفة',
  'health.breathing': 'تمارين التنفس العميق',
  'health.tools': 'أدوات صحية تفاعلية',
  'health.office': 'صحة الشاشة والمكتب',
  'health.firstAid': 'دليل الإسعافات الأولية السريع',
  'health.sleep': 'نظافة النوم (Sleep Hygiene)',
  'health.digital': 'الصحة الرقمية (Digital Wellness)',
  'health.checkups': 'الفحوصات الدورية',
  'health.stress': 'نصائح سريعة للتوتر',
  'health.grounding': 'تقنية التأريض (5-4-3-2-1)',
  'health.stressTip1': 'تنفس 4-4-6',
  'health.stressDesc1': 'شهيق 4 ثوان، احبس 4، زفير 6. كرر 5 مرات — بيهدي الجهاز العصبي فوراً.',
  'health.stressTip2': 'اكتب اللي في دماغك',
  'health.stressDesc2': 'كل كلمة أو قلق في بالك، اكتبه على ورقة. التفريغ الذهني بيقلل التوتر 50%.',
  'health.stressTip3': 'امشِي 5 دقائق',
  'health.stressDesc3': 'غيّر المكان، خد نفس عميق، لاحظ حواليك. المشي البطيء بيهدي الأفكار.',
  'health.stressTip4': 'كفاية ضغط على نفسك',
  'health.stressDesc4': 'أنت مش مطلوب منك تكون perfect. الخطأ جزء من التعلم.',
  'health.stressTip5': 'اقرأ حاجة خفيفة',
  'health.stressDesc5': 'اقرا آية قرآنية، ذكر، أو جملة تحفيزية. الكلمة الحلوة بتغير المود.',
  'health.groundSee': 'حاجات تشوفها',
  'health.groundSeeDesc': 'حولك 5 حاجات تقدر تشوفها — قلم، شباك، ضوء...',
  'health.groundTouch': 'حاجات تلمسها',
  'health.groundTouchDesc': '4 حاجات تقدر تلمسها — قميصك، الطاولة، الموبايل...',
  'health.groundHear': 'حاجات تسمعها',
  'health.groundHearDesc': '3 أصوات بتسمعها دلوقتي — المروحة، العربية، صوتك...',
  'health.groundSmell': 'حاجات تشمها',
  'health.groundSmellDesc': 'ريحتين تقدر تشمهم — القهوة، الهوا...',
  'health.groundTaste': 'حاجة تتذوقها',
  'health.groundTasteDesc': 'حاجة واحدة تتذوقها — مية، نعناع، أو حتى ابتسامة.',
  'health.perfectTitle': 'مش لازم تكون perfect',
  'health.perfectBody': 'في وعي، إحنا مش بنطلب منك تكون مثالي. بنطلب منك تجرب، تتعلم، وتتحسن شوية كل يوم.',
  'health.restMind': 'عقلك محتاج راحة زيه زي جسدك.',
  'health.breathe': 'خد نفس، أنت كفايه.',

  // Finance page
  'finance.badge': 'النمو المالي',
  'finance.title': 'أدوات لإدارة أموالك بذكاء',
  'finance.subtitle': 'حاسبات الكهرباء والمياه والمصروفات بالجنيه المصري، ونصايح عملية تطبّقها من النهارده.',
  'finance.principles': 'مبادئ مالية',
  'finance.tips': 'نصائح ادخار يومية',
  'finance.beforeBuy': 'قبل ما تشتري 🛒',
  'finance.earnMore': 'زوّد دخلك',
  'finance.warnings': 'تنبيهات',
  'finance.askBefore': 'اسأل نفسك هذه الأسئلة الثلاثة قبل أي عملية شراء لتوفير المال والبيئة.',

  // Environment page
  'env.badge': 'التناغم البيئي',
  'env.title': 'قراراتك تحمي كوكبنا',
  'env.subtitle': 'بدائل طبيعية، ترشيد استهلاك، إحصائيات، ومجتمع — كل ما تحتاجه لحياة أكثر استدامة.',

  // Education page
  'edu.badge': 'تعليم وتركيز',
  'edu.title': 'ذاكر صح، وركّز، وكمّل',
  'edu.subtitle': 'طرق مذاكرة عملية، نصايح للتركيز لو تايه، وكلمتين تحفّز قلبك.',
  'edu.methods': 'طرق مذاكرة فعّالة',
  'edu.focus': 'لو مش مركز، اعمل كده',
  'edu.learningStyle': 'اعرف نمط تعلمك',
  'edu.lost': 'لو حاسس إنك تايه',

  // Dashboard page
  'dash.title': 'يومي في وعي',
  'dash.subtitle': 'تابع عاداتك اليومية في الصحة والمال والبيئة.',
  'dash.weeklyInsights': 'رؤى أسبوعية',
  'dash.sleep': 'ساعات النوم',
  'dash.activity': 'نشاط بدني (دقيقة)',
  'dash.eco': 'أفعال بيئية',
  'dash.hour': 'ساعة',
  'dash.minute': 'دقيقة',
  'dash.action': 'فعل',

  // Insights page
  'insights.title': 'رؤى أسبوعية',
  'insights.subtitle': 'ملخص آخر 7 أيام من نشاطك على وعي.',
  'insights.back': 'رجوع إلى يومي',
  'insights.report': 'تقرير وعي الأسبوعي',

  // Recipes page
  'recipes.badge': 'مطبخ صحي',
  'recipes.title': 'وصفات مصرية صحية واقتصادية',
  'recipes.subtitle': 'فلتر بالسعرات والتكلفة، واطبخ أكل بيتي بطعم وبصحة.',
  'recipes.favorites': 'المفضلة',
  'recipes.empty': 'لا توجد وصفات تطابق الفلتر. جرّب توسعته.',

  // Quiz page
  'quiz.badge': 'اختبر وعيك',
  'quiz.title': '10 أسئلة جديدة كل يوم',
  'quiz.subtitle': 'اختبر معلوماتك في الصحة والمال والبيئة.',

  // Plans page
  'plans.badge': 'خطط 30 يوم',
  'plans.title': 'غيّر عاداتك في 30 يوم',
  'plans.subtitle': 'اختر خطة وتابع تقدمك يوماً بيوم. كل يوم خطوة صغيرة تقربك من نسخة أفضل منك.',
  'plans.start': 'ابتدأ الخطة',
  'plans.reset': 'إعادة',

  // Breathing Exercise
  'breathing.title': 'تمارين التنفس',
  'breathing.subtitle': 'اتبع الإيقاع: شهيق 4 ثوان، احبس 4، زفير 6',
  'breathing.inhale': 'شهيق',
  'breathing.hold': 'احبس',
  'breathing.exhale': 'زفير',
  'breathing.start': 'ابدأ',
  'breathing.stop': 'إيقاف',
  'breathing.reset': 'إعادة',

  // Quick Tips
  'quicktips.title': 'نصائح سريعة',
  'quicktips.subtitle': 'قطرات يومية من الوعي تروي عقلك. نصائح مركزة تتجدد كل أسبوع!',

  // Water Calculator
  'waterCalc.title': 'حاسبة احتياج المياه',
  'waterCalc.subtitle': 'مش 8 أكواب — حسب وزنك وطولك وعمرك ونشاطك بالظبط',
  'waterCalc.weight': 'وزنك (كجم):',
  'waterCalc.height': 'طولك (سم):',
  'waterCalc.age': 'عمرك (سنة):',
  'waterCalc.activity': 'مستوى النشاط:',
  'waterCalc.low': 'قليل: مش بكد كتير',
  'waterCalc.med': 'متوسط: مشي/تمارين خفيفة',
  'waterCalc.high': 'كثير: رياضي/شغل بدني',
  'waterCalc.result': 'محتاج تشرب يومياً',
  'waterCalc.liter': 'لتر',

  // Sleep Cycle Calculator
  'sleepCalc.title': 'حاسبة دورات النوم',
  'sleepCalc.subtitle': 'استيقظ بريقان — احسب أفضل وقت للنوم أو الاستيقاظ',
  'sleepCalc.sleepTime': 'وقت النوم',
  'sleepCalc.wakeTime': 'وقت الاستيقاظ',
  'sleepCalc.calc': 'احسب',
  'sleepCalc.bestWake': 'أفضل أوقات للاستيقاظ:',
  'sleepCalc.bestSleep': 'أفضل أوقات للنوم:',
  'sleepCalc.cycle': 'دورة',
  'sleepCalc.footnote': 'كل دورة نوم = 90 دقيقة. استيقظ في نهاية دورة لتكون بريقان.',

  // Hospital Finder
  'hospital.badge': 'دليل المستشفيات',
  'hospital.title': 'ابحث عن مستشفى قريب منك',
  'hospital.subtitle': 'دليل إرشادي بأبرز المستشفيات في محافظات مصر...',
  'hospital.governorate': 'المحافظة',
  'hospital.city': 'المدينة / المنطقة',
  'hospital.allCities': 'كل المدن',
  'hospital.results': 'عدد النتائج:',
  'hospital.empty': 'ابدأ باختيار المحافظة لعرض المستشفيات المتاحة',
  'hospital.noResults': 'لا توجد مستشفيات مسجلة في هذه المنطقة حالياً.',

  // Calorie Calculator
  'calorie.badge': 'حساب السعرات',
  'calorie.title': 'احسب احتياجك اليومي من السعرات',
  'calorie.subtitle': 'أدخل بياناتك لتحصل على تقدير دقيق بناءً على وزنك، طولك، وعمرك.',
  'calorie.male': 'ذكر',
  'calorie.female': 'أنثى',
  'calorie.weight': 'الوزن (كجم)',
  'calorie.height': 'الطول (سم)',
  'calorie.age': 'العمر',
  'calorie.activity': 'مستوى النشاط',
  'calorie.bmr': 'سعرات الراحة (BMR)',
  'calorie.tdee': 'احتياجك اليومي (TDEE)',

  // Egyptian Plate
  'plate.title': 'الطبق الصحي المصري',
  'plate.subtitle': 'ازاي تقسم غداك بأكلات مصرية شعبية',

  // Calculators
  'calc.title': 'الأدوات التفاعلية',
  'calc.subtitle': 'حاسبات ذكية تساعدك على فهم استهلاكك واتخاذ قرارات أفضل كل يوم.',
  'calc.electricity': 'حاسبة الكهرباء',
  'calc.budget': 'المصروف الشهري',

  // Daily Challenge
  'challenge.title': 'تحدي اليوم',
  'challenge.done': 'تم إنجازه ✓',
  'challenge.do': 'أنجزته!',

  // Water Tracker
  'water.title': 'المياه',
  'water.cups': 'كوب',

  // Streak
  'streak.points': 'نقاط الاستمرار',
  'streak.flash': 'أحسنت! رصيدك الآن',
  'streak.winner': 'أنت الرابح! تواصل معنا',

  // Weight Tracker
  'weight.title': 'الوزن',
  'weight.footnote': 'سجّل وزنك كل يوم لمتابعة التغير',

  // Daily Big 3
  'big3.title': 'أهم 3 مهام النهارده',
  'big3.subtitle': 'حدد 3 مهام بس — لو خلصتهم يعتبر يومك ناجح',

  // Gratitude Journal
  'gratitude.title': 'نعمة النهارده',
  'gratitude.subtitle': 'إيه أكتر حاجة حصلتلك النهارده وشعرتك بالامتنان؟',

  // Night Review
  'night.title': 'ختام اليوم',
  'night.achievement': '🏆 إنجاز اليوم',
  'night.lesson': '💡 درس بكره',
  'night.screensOff': '✓ قفلت الشاشات — استعد للنوم',

  // Mental Energy
  'energy.title': 'بطارية الطاقة العقلية',

  // Daily Impact
  'impact.title': 'أثر اليوم',
  'impact.empty': 'لسه ما سجلتش حاجة النهارده — ابدأ بأي حاجة صغيرة.',

  // Onboarding
  'onboard.welcome': 'أهلاً بك في وعي',
  'onboard.skip': 'تخطي',
  'onboard.next': 'التالي',
  'onboard.start': 'ابدأ',

  // Offline
  'offline.text': 'لا يوجد اتصال بالإنترنت',

  // Notification Settings
  'notif.title': 'إعدادات الإشعارات',
  'notif.enabled': 'مفعلة',
  'notif.disabled': 'فعّل الإشعارات',
  'notif.footnote': 'الإشعارات بتظهر كل ساعتين بنصائح من الأقسام اللي تختارها.',

  // Export
  'export.label': 'تصدير بياناتك (Excel)',

  // Checkups
  'checkups.title': 'جدول صيانة جسمك',
  'checkups.subtitle': 'زي ما بتعمل صيانة للعربية — أهم التحاليل والمعاينات الدورية',
  'checkups.test': 'التحليل / الفحص',
  'checkups.category': 'الفئة',
  'checkups.frequency': 'التكرار',

  // Search
  'search.placeholder': 'ابحث عن وصفات، مستشفيات، نصائح...',
  'search.empty': 'اكتب كلمة للبحث...',
  'search.noResults': 'لا توجد نتائج',

  // Assistant
  'assistant.badge': 'المساعد الذكي',
  'assistant.title': 'اسأل مساعد وعي',
  'assistant.subtitle': 'إجابات سريعة وموثوقة في الصحة والمال والبيئة، باللغة العربية.',

  // NotFound
  'notFound.title': 'الصفحة مش موجودة',
  'notFound.desc': 'عذراً، الصفحة اللي بتدور عليها مش موجودة. ممكن تكون اتحذفت أو اتغيرت.',
  'notFound.back': 'الرجوع للرئيسية',

  // Auth
  'auth.signIn': 'تسجيل الدخول',
  'auth.signUp': 'إنشاء حساب',
  'auth.name': 'الاسم',
  'auth.email': 'البريد الإلكتروني',
  'auth.password': 'كلمة المرور',
  'auth.createAccount': 'إنشاء الحساب',
  'auth.noAccount': 'ليس لديك حساب؟ إنشاء حساب',
  'auth.hasAccount': 'لديك حساب بالفعل؟ تسجيل الدخول',
  'auth.namePlaceholder': 'محمد أحمد',

  // Ask section
  'ask.title': 'اسأل وعي',
  'ask.subtitle': 'عندك سؤال أو استفسار؟ ابعتلنا وهنرد عليك في أقرب وقت!',
  'ask.name': 'الاسم',
  'ask.namePlaceholder': 'اكتب اسمك',
  'ask.email': 'البريد الإلكتروني',
  'ask.message': 'رسالتك',
  'ask.messagePlaceholder': 'اكتب استفسارك هنا...',
  'ask.sending': 'جاري الإرسال...',
  'ask.sent': '✓ تم الإرسال بنجاح!',
  'ask.send': 'إرسال',

  // AI Chat
  'chat.title': 'مساعد وعي',
  'chat.suggestion1': 'إزاي أبدأ ميزانية شهرية؟',
  'chat.suggestion2': 'نصائح بسيطة لنوم أفضل 😴',
  'chat.suggestion3': 'ازاي أزرع نعناع في البلكونة؟',
  'chat.suggestion4': 'ازاي أنظم وقتي للمذاكرة؟ 📚',
  'chat.greeting': 'أهلاً بك! 👋',
  'chat.greetingText': 'اسألني عن أي شيء يخص صحتك، تخطيطك المالي، بيئتك، أو تعليمك.',
  'chat.placeholder': 'اكتب سؤالك هنا...',
  'chat.disclaimer': 'الردود لأغراض توعوية فقط ولا تغني عن استشارة المختصين.',

  // Admin
  'admin.title': 'لوحة المشرف',
  'admin.subtitle': 'إدارة المحتوى والمستخدمين',
  'admin.login': 'يرجى تسجيل الدخول',
  'admin.password': 'كلمة المرور',
  'admin.wrongPassword': 'كلمة المرور غير صحيحة',
  'admin.enter': 'دخول',
  'admin.logout': 'تسجيل خروج',

  // Common
  'common.back': 'رجوع',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.delete': 'حذف',
  'common.edit': 'تعديل',
  'common.add': 'إضافة',
  'common.search': 'بحث...',
  'common.copy': 'نسخ',
  'common.loading': 'جاري التحميل...',
  'common.error': 'خطأ',
  'common.success': 'تم بنجاح',
  'common.noResults': 'لا توجد نتائج',
  'common.day': 'يوم',
  'common.days': 'أيام',
};

export default ar;
