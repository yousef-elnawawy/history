import { Sparkles, Heart, Compass, Terminal, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 font-sans" id="about-section">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full text-xs font-semibold mb-3">
          بطاقة تعريفية
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-950 mb-4 tracking-tight">
          عن تطبيق فوازير التاريخ
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* App Info Card */}
        <div className="md:col-span-7 bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 md:p-8 border border-amber-500/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 text-amber-800 p-2.5 rounded-xl">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-amber-950">رؤية التطبيق</h2>
            </div>
            <p className="text-stone-700 text-lg leading-relaxed mb-6 text-justify">
              تطبيق <span className="font-bold text-amber-800">فوازير التاريخ</span> هو بوابتك الرقمية لاستكشاف أغوار الماضي السحيق، وحل ألغاز الحضارات القديمة والإسلامية والحديثة بطريقة تفاعلية ممتعة.
            </p>
            <p className="text-stone-600 leading-relaxed mb-6 text-justify">
              تم تصميم الأسئلة بعناية فائقة لتتحدى معلوماتك التاريخية وتغوص بك في تفاصيل معارك حاسمة، ومسارات قادة ملهمين، وأسرار علمية غيرت مجرى البشرية. مع نظام ذكي يضمن عدم تكرار الأسئلة لتستمتع بتجربة متجددة دوماً.
            </p>
          </div>

          <div className="border-t border-stone-200/60 pt-6 mt-4">
            <h3 className="text-sm font-semibold text-stone-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> مميزات المنصة:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                أكثر من 100 فزورة وسؤال ذكي
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                تصنيف ذكي حسب الحقب التاريخية
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                نظام حماية مكرر الأسئلة بالذاكرة
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                تحدي عداد الوقت المثير للسرعة
              </li>
            </ul>
          </div>
        </div>

        {/* Developer Card */}
        <div className="md:col-span-5 bg-gradient-to-b from-amber-950 to-amber-900 text-parchment-100 shadow-xl rounded-2xl p-6 md:p-8 border border-amber-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500 text-amber-950 p-2 rounded-xl">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-amber-400">عن المطور</h2>
            </div>

            <div className="mb-6">
              <p className="text-parchment-100 text-lg leading-relaxed mb-4">
                تم تطوير هذا التطبيق بحب وشغف بواسطة{" "}
                <span className="font-bold text-amber-400 text-xl block sm:inline mt-1 sm:mt-0">يوسف (Joe Nerd)</span>
              </p>
              <p className="text-amber-200 text-sm leading-relaxed text-justify">
                مطور ومصمم ويب مهتم ببناء تطبيقات حديثة متميزة، وواجهات مستخدم بسيطة وسريعة للغاية تلبي احتياجات المستخدمين وتثري المحتوى العربي الرقمي.
              </p>
            </div>

            <div className="bg-amber-900/60 border border-amber-800/80 rounded-xl p-4 mb-6">
              <p className="text-xs text-amber-400/80 font-mono mb-1.5 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> رسالة المطور:
              </p>
              <p className="text-amber-100 text-xs leading-relaxed italic">
                \"هذا المشروع هو جزء من رحلة تعلم وتطوير مستمرة في مجال البرمجة وتطوير الويب، سعياً لتقديم تجارب ويب ترتقي بذوق وفكر المستخدم العربي.\"
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 text-right">
              تواصل معي عبر وسائل التواصل
            </h3>
            
            <div className="flex justify-center md:justify-start gap-4">
              {/* YouTube */}
              <a
                href="https://youtube.com/@جو_نيرد"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                title="يوتيوب"
                id="social-youtube"
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="w-5 h-5">
                  <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/joe._.nerd"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-pink-600/10 border border-pink-500/30 text-pink-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                title="إنستغرام"
                id="social-instagram"
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-4.5 h-4.5">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com/JOE_EGY_NERD"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-stone-800/10 border border-stone-700/30 text-stone-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                title="إكس (تويتر)"
                id="social-x"
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/yousef-elnawawy"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-amber-800/20 border border-amber-700/30 text-amber-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                title="غيت هاب"
                id="social-github"
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" className="w-4.5 h-4.5">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/201157961650"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white hover:border-amber-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                title="واتساب"
                id="social-whatsapp"
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-4.5 h-4.5">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-stone-500 flex items-center justify-center gap-1">
        صُنع بكل <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> بواسطة يوسف © {new Date().getFullYear()}
      </div>
    </div>
  );
}
