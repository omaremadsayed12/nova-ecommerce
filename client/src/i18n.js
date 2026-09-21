import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = localStorage.getItem("language") || "en";

document.documentElement.lang = savedLanguage;
document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        authModal: {
          loginSuccess: "Login Success: Welcome back,",
          loginFailure: "Login failed. Please try again.",
          signUpSuccess: "Sign Up Success: Welcome,",
          signUpFailure: "Signup failed. Please try again.",
          loginForm: {
            header: "Welcome back",
            paragraph: "Log in to continue shopping.",
            email: {
              label: "Email",
              placeHolder: "you@example.com",
            },
            password: {
              label: "Password",
              placeHolder: "Enter your password",
            },
            button: {
              loading: "Logging in...",
              text: "Log In",
            },
            switch: {
              paragraph: "New user?",
              button: "Register Now",
            },
          },
          signUpForm: {
            header: "Register Now",
            paragraph: "Sign up to continue shopping.",
            englishName: {
              label: "English Name",
              placeHolder: "Enter your name in english",
            },
            arabicName: {
              label: "Arabic Name",
              placeHolder: "Enter your name in arabic",
            },
            email: {
              label: "Email",
              placeHolder: "you@example.com",
            },
            password: {
              label: "Password",
              placeHolder: "Enter your password (8 Characters or more)",
            },
            button: {
              loading: "Signing Up...",
              text: "Sign up",
            },
            switch: {
              paragraph: "Already registered?",
              button: "Login",
            },
          },
        },
        navbar: {
          prefMenu: {
            login: "Login Now",
            theme: "Theme:",
            lang: "Language:",
          },
        },
        footer: {
          upperFooter: {
            logo: "NOVA",
            paragraph:
              "Shopping made simple with a seamless online shopping experience, secure payments, and lightning-fast delivery.",
            explore: "Explore",
            contactUs: "Contact Us",
          },
          lowerFooter: {
            paragraph: "© All rights reserved | NOVA 2026",
            privacyPolicy: "Privacy Policy",
          },
        },
        home: {
          heroSection: {
            eyebrow: "New Collection 2026",
            headline: "Elevate Your Everyday",
            paragraph:
              "Discover timeless essentials and modern styles designed to become part of your everyday.",
            primaryButton: "Shop Collection",
            sliderNote: {
              headline: "Fast Delivery",
              info: "2-4 Days",
            },
            stats: {
              orders: "Orders Placed",
              products: "Listed Product",
            },
          },
        },
      },
    },
    ar: {
      translation: {
        authModal: {
          loginSuccess: "تم تسجيل الدخول بنجاح: مرحبًا،",
          loginFailure: "فشل في تسجيل الدخول، يرجى المحاولة مرة اخرى",
          signUpSuccess: "تم تسجيل مستخدم جديد بنجاح: مرحبًا،",
          signUpFailure: "فشل في تسجيل المستخدم، يرجى المحاولة مرة اخرى",
          loginForm: {
            header: "مرحبًا",
            paragraph: "قم بتسجيل الدخول لأستكمال التسوق",
            email: {
              label: "البريد الالكتروني",
              placeHolder: "you@example.com",
            },
            password: {
              label: "كلمة المرور",
              placeHolder: "قم بادخال كلمة المرور",
            },
            button: {
              loading: "يتم تسجيل الدخول...",
              text: "تسجيل الدخول",
            },
            switch: {
              paragraph: "مستخدم جديد؟",
              button: "سجل الأن",
            },
          },
          signUpForm: {
            header: "مرحبًا",
            paragraph: "قم بتسجيل حساب لأستكمال التسوق",
            englishName: {
              label: "الأسم باللغة الانجليزية",
              placeHolder: "قم بأدخال اسمك باللغة الانجليزية",
            },
            arabicName: {
              label: "الأسم باللغة العربية",
              placeHolder: "قم بأدخال اسمك باللغة العربية",
            },
            email: {
              label: "البريد الالكتروني",
              placeHolder: "you@example.com",
            },
            password: {
              label: "كلمة المرور",
              placeHolder: "قم بادخال كلمة مرور لا تقل عن 8 احرف",
            },
            button: {
              loading: "يتم تسجيل الحساب...",
              text: "تسجيل",
            },
            switch: {
              paragraph: "مُسجل من قبل؟",
              button: "تسجيل دخول",
            },
          },
        },
        navbar: {
          prefMenu: {
            login: "سجل الأن",
            theme: "الوضع:",
            lang: "اللغة:",
          },
        },
        footer: {
          upperFooter: {
            logo: "نوڤا",
            paragraph: "تجربة تسوق سهلة مع خدمة مدفوعات امنة وتوصيل سريع",
            explore: "تصفح",
            contactUs: "تواصل معنا",
          },
          lowerFooter: {
            paragraph: "© جميع الحقوق محفوظة | نوڤا 2026",
            privacyPolicy: "سياسة الخصوصية",
          },
        },
        home: {
          heroSection: {
            eyebrow: "مجموعة 2026 الجديدة",
            headline: "ارتق بإطلالتك اليومية",
            paragraph:
              "اكتشف قطعًا أساسية بتصميم عصري وأناقة تدوم، لتصبح جزءًا من إطلالتك اليومية.",
            primaryButton: "تسوق المجموعة",

            sliderNote: {
              headline: "توصيل سريع",
              info: "4 ايام بحد اقصى",
            },

            stats: {
              orders: "طلب",
              products: "منتج متوفر",
            },
          },
        },
      },
    },
  },
  lng: savedLanguage,
  fallbacking: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
