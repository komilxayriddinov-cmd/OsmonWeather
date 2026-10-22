import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  CloudSun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Compass,
  MapPin,
  Search,
  Star,
  RefreshCw,
  Settings,
  Info,
  Navigation,
  Thermometer,
  Sunrise,
  Sunset,
  Calendar,
  Clock,
  Layers,
  Globe,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Sparkles,
  SunMedium,
  CloudFog,
  Umbrella,
  Activity,
  Maximize2,
  Minimize2,
  KeyRound,
  Radio,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

export type Language = 'uz' | 'ru';
export type TempUnit = 'C' | 'F';
export type WindUnit = 'kmh' | 'ms';
export type PressureUnit = 'hpa' | 'mmhg';
export type ThemeMode = 'dark' | 'light';
export type WeatherConditionType =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog';

export type NavTab =
  | 'home'
  | 'map'
  | 'forecast'
  | 'details'
  | 'favorites'
  | 'settings'
  | 'about';

export type MapLayerType = 'temp' | 'precip' | 'wind' | 'clouds';
export type ApiProviderType = 'openmeteo' | 'openweathermap' | 'weatherapi' | 'demo';

export interface CityPreset {
  id: string;
  nameUz: string;
  nameRu: string;
  countryUz: string;
  countryRu: string;
  lat: number;
  lon: number;
  timezoneOffset: number;
  elevation: number;
  baseTempC: number;
  baseHumidity: number;
  baseWindKmh: number;
  baseWindDir: number;
  basePressureHpa: number;
  condition: WeatherConditionType;
  region: 'uzbekistan' | 'central_asia' | 'europe' | 'asia' | 'americas' | 'middle_east_africa' | 'oceania';
}

export interface HourlyForecastItem {
  time: string;
  hourNum: number;
  tempC: number;
  feelsLikeC: number;
  condition: WeatherConditionType;
  pop: number; // 0 - 100%
  rainMm: number;
  snowCm: number;
  windKmh: number;
  windDir: number;
  humidity: number;
  isNight: boolean;
}

export interface DailyForecastItem {
  dateStr: string;
  dayIndex: number;
  condition: WeatherConditionType;
  tempMaxC: number;
  tempMinC: number;
  pop: number;
  rainMm: number;
  snowCm: number;
  windMaxKmh: number;
  windDir: number;
  humidity: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  morningTempC: number;
  dayTempC: number;
  eveningTempC: number;
  nightTempC: number;
  pressureHpa: number;
}

export interface WeatherData {
  locationId: string;
  nameUz: string;
  nameRu: string;
  countryUz: string;
  countryRu: string;
  lat: number;
  lon: number;
  tempC: number;
  feelsLikeC: number;
  tempMaxC: number;
  tempMinC: number;
  condition: WeatherConditionType;
  wmoCode: number;
  humidity: number;
  windKmh: number;
  windGustKmh: number;
  windDir: number;
  pressureHpa: number;
  visibilityKm: number;
  uvIndex: number;
  cloudCover: number;
  dewPointC: number;
  aqi: number;
  sunrise: string;
  sunset: string;
  isNight: boolean;
  lastUpdated: string;
  dataSource: 'live_openmeteo' | 'live_owm' | 'live_weatherapi' | 'demo_fallback';
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

// ============================================================================
// 2. BILINGUAL UZBEK & RUSSIAN DICTIONARY (100% UI COVERAGE)
// ============================================================================

export const TRANSLATIONS = {
  uz: {
    brandName: 'OSMON PRO',
    brandTagline: 'Intellektual Ob-havo va Iqlim Platformasi',
    nav: {
      home: 'Bosh sahifa',
      map: 'Dunyo xaritasi',
      forecast: 'Ob-havo prognozi',
      details: 'Batafsil maʼlumot',
      favorites: 'Sevimli shaharlar',
      settings: 'Sozlamalar',
      about: 'Loyiha haqida'
    },
    status: {
      liveApi: 'JONLI API MAʼLUMOTLARI',
      demoMode: 'NAMUNA REJIMI (Demo maʼlumotlar)',
      liveOpenMeteo: 'Open-Meteo Jonli API',
      liveOwm: 'OpenWeatherMap Jonli API',
      liveWeatherApi: 'WeatherAPI Jonli API',
      demoBannerTitle: 'Namuna rejimi faol (Demonstration Mode)',
      demoBannerDesc:
        'Tarmoq cheklovi yoki API kaliti kiritilmagani sababli yuqori aniqlikdagi namuna meteorologik maʼlumotlari koʻrsatilmoqda. Sozlamalar boʻlimida OpenWeatherMap / WeatherAPI kalitini kiritishingiz yoki jonli ulanishni tekshirishingiz mumkin.',
      configureApiBtn: 'API sozlamalari',
      retryLiveBtn: 'Jonli APIni qayta ulash',
      lastUpdated: 'Oxirgi yangilanish',
      loadingWeather: 'Ob-havo maʼlumotlari yuklanmoqda...',
      geoLocating: 'Joylashuvingiz aniqlanmoqda...',
      geoDenied: 'Geolokatsiya ruxsati berilmadi yoki brauzerda cheklangan.',
      geoSuccess: 'Sizning joriy koordinatalaringiz boʻyicha ob-havo yuklandi!',
      cityNotFound: 'Shahar topilmadi. Iltimos, boshqa nom bilan qidirib koʻring yoki xaritadan nuqtani tanlang.',
      refreshedToast: 'Ob-havo maʼlumotlari muvaffaqiyatli yangilandi!'
    },
    search: {
      placeholder: 'Dunyo boʻylab shahar yoki davlatni qidiring (masalan: Toshkent, Samarqand, London)...',
      mapSearchPlaceholder: 'Xaritadan shaharni topish...',
      searchBtn: 'Qidirish',
      myLocation: 'Mening joylashuvim',
      refresh: 'Yangilash',
      popularCities: 'Mashhur shaharlar',
      searchResults: 'Qidiruv natijalari',
      noResults: 'Hech qanday shahar topilmadi'
    },
    weather: {
      clear: 'Ochiq va musaffo havo',
      clearNight: 'Ochiq tungi osmon',
      partly_cloudy: 'Qisman bulutli',
      cloudy: 'Bulutli osmon',
      rain: 'Yomgʻirli havo',
      heavy_rain: 'Kuchli jala va yomgʻir',
      thunderstorm: 'Momaqaldiroq va chaqmoq',
      snow: 'Qor yogʻishi',
      fog: 'Tuman va xiralik',
      feelsLike: 'His qilinishi',
      high: 'Maks',
      low: 'Min',
      humidity: 'Namlik',
      wind: 'Shamol tezligi',
      windGust: 'Shamol shiddati',
      windDir: 'Shamol yoʻnalishi',
      pressure: 'Havo bosimi',
      visibility: 'Koʻrinish masofasi',
      uvIndex: 'UB indeksi',
      cloudCover: 'Bulutlilik darajasi',
      dewPoint: 'Shudring nuqtasi',
      airQuality: 'Havo sifati (AQI)',
      sunrise: 'Quyosh chiqishi',
      sunset: 'Quyosh botishi',
      daylight: 'Kunduzgi vaqt',
      precipChance: 'Yogʻingarchilik ehtimoli',
      rainfall: 'Yomgʻir miqdori',
      snowfall: 'Qor miqdori',
      coordinates: 'Koordinatalar'
    },
    uvLevels: {
      low: 'Past (Xavfsiz)',
      moderate: 'Oʻrtacha (Himoya tavsiya etiladi)',
      high: 'Yuqori (Quyoshdan saqlaning)',
      veryHigh: 'Juda yuqori (Xavfli)'
    },
    aqiLevels: {
      good: 'Aʼlo (Toza havo)',
      moderate: 'Moʻtadil',
      sensitive: 'Sezgir guruhlar uchun noqulay'
    },
    compass: ['Sh', 'Sh-Shq', 'Shq', 'J-Shq', 'J', 'J-Gʻ', 'Gʻ', 'Sh-Gʻ'],
    daysShort: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
    daysFull: [
      'Yakshanba',
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba'
    ],
    today: 'Bugun',
    tomorrow: 'Ertaga',
    home: {
      openWorldMap: 'Interaktiv Dunyo Xaritasini Ochish',
      hourlyTitle: 'Bugungi soatbay ob-havo prognozi (24 soat)',
      weeklyTitle: '7 kunlik ob-havo prognozi',
      viewFullForecast: 'Toʻliq 7 kunlik grafik va tahlil',
      highlightsTitle: 'Asosiy meteorologik koʻrsatkichlar',
      sunScheduleTitle: 'Quyosh traektoriyasi va kunduzgi vaqt',
      favoriteQuickTitle: 'Tezkor sevimli shaharlar',
      manageFavorites: 'Barchasini boshqarish',
      addToFavorites: 'Sevimlilarga qoʻshish',
      inFavorites: 'Sevimlilarda saqlangan',
      mapPreviewTitle: 'Interaktiv Jahon Meteorologik Xaritasi',
      mapPreviewSubtitle: 'Harorat, yogʻingarchilik, shamol oqimlari va bulutlar qatlamini jonli kuzating'
    },
    map: {
      title: 'Interaktiv Dunyo Ob-havo Xaritasi',
      subtitle: 'Istalgan shahar belgisini yoki xaritadagi har qanday geografik nuqtani bosing — real vaqtda ob-havo maʼlumotlari koʻrsatiladi.',
      layersTitle: 'Meteorologik qatlamlar',
      layerTemp: 'Harorat xaritasi',
      layerPrecip: 'Yogʻingarchilik radari',
      layerWind: 'Shamol oqimlari',
      layerClouds: 'Bulutlilik qatlami',
      mapModeLeaflet: 'OSM Xarita (Leaflet)',
      mapModeVector: 'Vektor Atlas Xaritasi',
      zoomIn: 'Yaqinlashtirish',
      zoomOut: 'Uzoqlashtirish',
      resetView: 'Umumiy koʻrinish',
      clickHint: 'Xaritadagi istalgan nuqtani bosib koordinata boʻyicha ob-havoni oling',
      selectedPoint: 'Tanlangan joylashuv telemetriyasi',
      nearestStation: 'Eng yaqin meteostansiya',
      customCoordName: 'Geografik nuqta',
      customCoordCountry: 'Xalqaro koordinatalar hududi',
      openDetailedForecast: 'Ushbu hududning 7 kunlik prognozi',
      regionFilterAll: 'Barcha mintaqalar',
      regionUzbekistan: 'Oʻzbekiston',
      regionCentralAsia: 'Markaziy Osiyo',
      regionWorld: 'Jahon poytaxtlari',
      legendLow: 'Past',
      legendHigh: 'Yuqori'
    },
    forecast: {
      title: 'Kengaytirilgan Ob-havo Prognozi va Grafiklar',
      subtitle: 'Soatbay dinamika, 7 kunlik tahlil, yogʻingarchilik hajmi va shamol tezligi diagrammalari',
      chartTempTab: 'Harorat va His qilinishi',
      chartPrecipTab: 'Yogʻingarchilik (Yomgʻir / Qor)',
      chartWindTab: 'Shamol tezligi va Namlik',
      hourlyBreakdown: 'Soatbay batafsil jadval',
      dailyCardsTitle: '7 kunlik ob-havo kalendari (Kunni tanlang)',
      selectedDayDetails: 'Tanlangan kunning batafsil maʼlumoti',
      morning: 'Ertalab (08:00)',
      afternoon: 'Kunduzi (14:00)',
      evening: 'Kechqurun (20:00)',
      night: 'Tunda (02:00)',
      precipProbLabel: 'Yogʻingarchilik ehtimoli',
      rainAmountLabel: 'Yomgʻir hajmi',
      snowAmountLabel: 'Qor qatlami'
    },
    details: {
      title: 'Chuqurlashtirilgan Atmosfera va Iqlim Tahlili',
      subtitle: 'Tanlangan shahar uchun barcha fizik, astronomik va ekologik koʻrsatkichlar',
      comfortTitle: 'Inson salomatligi va kiyinish tavsiyasi',
      comfortCold: 'Salqin ob-havo: issiq kurtka yoki palto kiyish tavsiya etiladi.',
      comfortMild: 'Moʻtadil va yoqimli havo: yengil ustki kiyim yetarli boʻladi.',
      comfortHot: 'Issiq ob-havo: yengil paxta kiyim kiying va koʻproq suv iching.',
      comfortRain: 'Yogʻingarchilik kutilmoqda: oʻzingiz bilan soyabon olishni unutmang.',
      windRoseTitle: 'Shamol kompas-rozasi va aerodinamika',
      barometerTitle: 'Barometrik bosim va atmosfera holati',
      barometerNormal: 'Meʼyoriy atmosfera bosimi (barqaror ob-havo)',
      barometerHigh: 'Yuqori bosim (antisiklon, ochiq osmon)',
      barometerLow: 'Past bosim (siklon faolligi, bulut va yogʻingarchilik ehtimoli)',
      astronomyTitle: 'Quyosh va astronomik sikl',
      outdoorTitle: 'Ochiq havodagi faoliyat indekslari',
      runningIndex: 'Yugurish va sport',
      drivingIndex: 'Avtomobil boshqarish',
      aviationIndex: 'Parvoz va dron uchirish',
      agricultureIndex: 'Qishloq xoʻjaligi va sugʻorish',
      statusOptimal: 'Qulay',
      statusModerate: 'Oʻrtacha',
      statusCaution: 'Ehtiyotkorlik talab etiladi'
    },
    favorites: {
      title: 'Sevimli Shaharlar Monitoringi',
      subtitle: 'Saqlangan shaharlaringizdagi ob-havoni bir vaqtning oʻzida solishtiring va tezkor oʻting',
      emptyState: 'Sizda hali sevimli shaharlar yoʻq. Roʻyxatga shahar qoʻshing!',
      sortByTemp: 'Harorat boʻyicha saralash',
      sortByName: 'Nomi boʻyicha saralash',
      addCityTitle: 'Tezkor shahar qoʻshish',
      selectCityBtn: 'Tanlash va koʻrish',
      removeBtn: 'Oʻchirish',
      viewOnMapBtn: 'Xaritada koʻrish'
    },
    settings: {
      title: 'Platforma Sozlamalari va API Konfiguratsiyasi',
      subtitle: 'Oʻlchov birliklari, til, vizual mavzu va jonli ob-havo API provayderlarini boshqaring',
      langSection: 'Interfeys tili (Language)',
      unitsSection: 'Oʻlchov birliklari',
      tempUnitLabel: 'Harorat birligi',
      windUnitLabel: 'Shamol tezligi birligi',
      pressureUnitLabel: 'Havo bosimi birligi',
      appearanceSection: 'Vizual dizayn va Maxsus imkoniyatlar',
      themeLabel: 'Mavzu rejimi (Dark / Light)',
      themeDark: 'Tungi (Dark Glass)',
      themeLight: 'Kunduzgi (Light Crystal)',
      particlesLabel: 'Jonli ob-havo animatsiyalari (Yomgʻir, qor, bulutlar)',
      reducedMotionLabel: 'Harakatlarni kamaytirish (Reduced Motion)',
      apiSection: 'Jonli Ob-havo API Integratsiyasi',
      apiProviderLabel: 'Maʼlumot manbasi provayderi',
      apiKeyLabel: 'Maxfiy API kaliti (OpenWeatherMap yoki WeatherAPI uchun)',
      apiKeyPlaceholder: 'API kalitingizni shu yerga kiriting...',
      saveApiBtn: 'Saqlash va ulanishni tekshirish',
      enabled: 'Yoqilgan',
      disabled: 'Oʻchirilgan'
    },
    about: {
      title: 'OSMON PRO — Premium Ob-havo Platformasi Haqida',
      subtitle: 'Zamonaviy veb-texnologiyalar, interaktiv kartografiya va real vaqtdagi meteorologik maʼlumotlar uygʻunligi',
      feature1Title: 'Interaktiv Jahon Xaritasi (Leaflet + Vektor Radar)',
      feature1Desc: 'Dunyo boʻylab istalgan shahar yoki koordinatani bosish orqali real vaqtda ob-havo, harorat qatlami, yogʻingarchilik radari va shamol oqimlarini kuzatish imkoniyati.',
      feature2Title: 'Haqiqiy Meteorologik API Integratsiyasi',
      feature2Desc: 'Open-Meteo (kalitsiz jonli API), OpenWeatherMap va WeatherAPI provayderlari orqali aniq joriy ob-havo, 24 soatlik va 7 kunlik prognoz.',
      feature3Title: 'Dinamik Atmosfera Fizikasi va Glassmorphism',
      feature3Desc: 'Ob-havo holatiga qarab oʻzgaruvchi osmon gradientlari, HTML5 Canvas yomgʻir, qor, chaqmoq va bulut zarralari hamda ikki tilli (Oʻzbek va Rus) toʻliq lokalizatsiya.',
      techStackTitle: 'Foydalanilgan texnologiyalar va meʼmoriy yechimlar'
    }
  },
  ru: {
    brandName: 'OSMON PRO',
    brandTagline: 'Интеллектуальная Метеорологическая Платформа',
    nav: {
      home: 'Главная',
      map: 'Карта мира',
      forecast: 'Прогноз',
      details: 'Подробности',
      favorites: 'Избранное',
      settings: 'Настройки',
      about: 'О проекте'
    },
    status: {
      liveApi: 'ЖИВЫЕ ДАННЫЕ API',
      demoMode: 'ДЕМО-РЕЖИМ (Демонстрационные данные)',
      liveOpenMeteo: 'Open-Meteo Live API',
      liveOwm: 'OpenWeatherMap Live API',
      liveWeatherApi: 'WeatherAPI Live API',
      demoBannerTitle: 'Активен демонстрационный режим (Demonstration Mode)',
      demoBannerDesc:
        'Из-за сетевых ограничений или отсутствия ключа API отображаются демонстрационные метеорологические данные. Вы можете указать ключ OpenWeatherMap / WeatherAPI в настройках или повторить подключение к живому API.',
      configureApiBtn: 'Настройки API',
      retryLiveBtn: 'Переподключить Live API',
      lastUpdated: 'Последнее обновление',
      loadingWeather: 'Загрузка метеоданных...',
      geoLocating: 'Определение вашего местоположения...',
      geoDenied: 'Доступ к геолокации отклонён или ограничен браузером.',
      geoSuccess: 'Погода успешно загружена по вашим текущим координатам!',
      cityNotFound: 'Город не найден. Попробуйте другой запрос или выберите точку прямо на карте мира.',
      refreshedToast: 'Метеорологические данные успешно обновлены!'
    },
    search: {
      placeholder: 'Поиск любого города мира (например: Ташкент, Самарканд, Москва, Лондон)...',
      mapSearchPlaceholder: 'Найти город на карте...',
      searchBtn: 'Найти',
      myLocation: 'Моё местоположение',
      refresh: 'Обновить',
      popularCities: 'Популярные города',
      searchResults: 'Результаты поиска',
      noResults: 'Города не найдены'
    },
    weather: {
      clear: 'Ясное небо',
      clearNight: 'Ясная звёздная ночь',
      partly_cloudy: 'Переменная облачность',
      cloudy: 'Пасмурно и облачно',
      rain: 'Дождливая погода',
      heavy_rain: 'Сильный ливень',
      thunderstorm: 'Гроза и молнии',
      snow: 'Снегопад',
      fog: 'Туман и дымка',
      feelsLike: 'Ощущается как',
      high: 'Макс',
      low: 'Мин',
      humidity: 'Влажность',
      wind: 'Скорость ветра',
      windGust: 'Порывы ветра',
      windDir: 'Направление ветра',
      pressure: 'Атм. давление',
      visibility: 'Видимость',
      uvIndex: 'УФ-индекс',
      cloudCover: 'Облачность',
      dewPoint: 'Точка росы',
      airQuality: 'Качество воздуха (AQI)',
      sunrise: 'Восход солнца',
      sunset: 'Закат солнца',
      daylight: 'Световой день',
      precipChance: 'Вероятность осадков',
      rainfall: 'Количество дождя',
      snowfall: 'Количество снега',
      coordinates: 'Координаты'
    },
    uvLevels: {
      low: 'Низкий (Безопасно)',
      moderate: 'Умеренный (Нужна защита)',
      high: 'Высокий (Защита обязательна)',
      veryHigh: 'Очень высокий (Опасно)'
    },
    aqiLevels: {
      good: 'Отличное (Чистый воздух)',
      moderate: 'Умеренное',
      sensitive: 'Неблагоприятно для чувствительных групп'
    },
    compass: ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'],
    daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    daysFull: [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота'
    ],
    today: 'Сегодня',
    tomorrow: 'Завтра',
    home: {
      openWorldMap: 'Открыть Интерактивную Карту Мира',
      hourlyTitle: 'Почасовой прогноз на сегодня (24 часа)',
      weeklyTitle: 'Прогноз погоды на 7 дней',
      viewFullForecast: 'Подробные графики и прогноз на 7 дней',
      highlightsTitle: 'Ключевые метеорологические показатели',
      sunScheduleTitle: 'Солнечная траектория и световой день',
      favoriteQuickTitle: 'Быстрый доступ к избранным городам',
      manageFavorites: 'Управление списком',
      addToFavorites: 'Добавить в избранное',
      inFavorites: 'В избранном',
      mapPreviewTitle: 'Интерактивная Метеорологическая Карта Мира',
      mapPreviewSubtitle: 'Исследуйте слои температуры, осадков, ветровых потоков и облачности в реальном времени'
    },
    map: {
      title: 'Интерактивная Карта Погоды Мира',
      subtitle: 'Нажмите на любой город или любую точку земного шара, чтобы мгновенно получить актуальную погоду по координатам.',
      layersTitle: 'Погодные слои',
      layerTemp: 'Температура',
      layerPrecip: 'Радар осадков',
      layerWind: 'Потоки ветра',
      layerClouds: 'Облачность',
      mapModeLeaflet: 'Карта OSM (Leaflet)',
      mapModeVector: 'Векторный Атлас Мира',
      zoomIn: 'Приблизить',
      zoomOut: 'Отдалить',
      resetView: 'Весь мир',
      clickHint: 'Кликните в любую точку карты для запроса погоды по координатам',
      selectedPoint: 'Телеметрия выбранной локации',
      nearestStation: 'Ближайшая метеостанция',
      customCoordName: 'Географическая точка',
      customCoordCountry: 'Международные координаты',
      openDetailedForecast: 'Прогноз на 7 дней для этой точки',
      regionFilterAll: 'Все регионы',
      regionUzbekistan: 'Узбекистан',
      regionCentralAsia: 'Центральная Азия',
      regionWorld: 'Мировые столицы',
      legendLow: 'Низк.',
      legendHigh: 'Выс.'
    },
    forecast: {
      title: 'Подробный Прогноз Погоды и Интерактивные Графики',
      subtitle: 'Почасовая динамика, 7-дневный календарь, графики осадков, температуры и скорости ветра',
      chartTempTab: 'Температура и Ощущение',
      chartPrecipTab: 'Осадки (Дождь / Снег)',
      chartWindTab: 'Скорость ветра и Влажность',
      hourlyBreakdown: 'Почасовая таблица на 24 часа',
      dailyCardsTitle: 'Календарь погоды на 7 дней (Выберите день)',
      selectedDayDetails: 'Детальная сводка выбранного дня',
      morning: 'Утро (08:00)',
      afternoon: 'День (14:00)',
      evening: 'Вечер (20:00)',
      night: 'Ночь (02:00)',
      precipProbLabel: 'Вероятность осадков',
      rainAmountLabel: 'Объём дождя',
      snowAmountLabel: 'Снежный покров'
    },
    details: {
      title: 'Глубокая Атмосферная и Климатическая Аналитика',
      subtitle: 'Полный спектр физических, астрономических и биометеорологических показателей',
      comfortTitle: 'Индекс комфорта и рекомендации по одежде',
      comfortCold: 'Прохладная погода: рекомендуется надеть тёплую куртку или пальто.',
      comfortMild: 'Комфортная умеренная погода: подойдёт лёгкая ветровка или свитер.',
      comfortHot: 'Тёплая/жаркая погода: выбирайте дышащую одежду и поддерживайте водный баланс.',
      comfortRain: 'Высокая вероятность осадков: обязательно возьмите зонт или дождевик.',
      windRoseTitle: 'Роза ветров и аэродинамические параметры',
      barometerTitle: 'Барометрическое давление и динамика атмосферы',
      barometerNormal: 'Нормальное атмосферное давление (устойчивая погода)',
      barometerHigh: 'Повышенное давление (антициклон, малооблачно)',
      barometerLow: 'Пониженное давление (циклоническая активность, возможны осадки)',
      astronomyTitle: 'Солнечный цикл и астрономия',
      outdoorTitle: 'Индексы активности на открытом воздухе',
      runningIndex: 'Бег и тренировки',
      drivingIndex: 'Дорожные условия',
      aviationIndex: 'Полёты и БПЛА',
      agricultureIndex: 'Агрономия и полив',
      statusOptimal: 'Отлично',
      statusModerate: 'Умеренно',
      statusCaution: 'Требуется осторожность'
    },
    favorites: {
      title: 'Мониторинг Избранных Городов',
      subtitle: 'Сравнивайте погодные условия в сохранённых городах мира и переключайтесь в один клик',
      emptyState: 'Список избранных городов пуст. Добавьте города для быстрого мониторинга!',
      sortByTemp: 'Сортировать по температуре',
      sortByName: 'Сортировать по названию',
      addCityTitle: 'Быстрое добавление города',
      selectCityBtn: 'Открыть сводку',
      removeBtn: 'Удалить',
      viewOnMapBtn: 'Показать на карте'
    },
    settings: {
      title: 'Настройки Платформы и Конфигурация API',
      subtitle: 'Управление языком интерфейса, единицами измерения, темой оформления и ключами API',
      langSection: 'Язык интерфейса (Til)',
      unitsSection: 'Единицы измерения',
      tempUnitLabel: 'Единица температуры',
      windUnitLabel: 'Скорость ветра',
      pressureUnitLabel: 'Атмосферное давление',
      appearanceSection: 'Визуальное оформление и Доступность',
      themeLabel: 'Тема оформления (Dark / Light)',
      themeDark: 'Тёмная (Dark Glass)',
      themeLight: 'Светлая (Light Crystal)',
      particlesLabel: 'Атмосферные эффекты (Дождь, снег, облака, молнии)',
      reducedMotionLabel: 'Уменьшение движения (Reduced Motion)',
      apiSection: 'Интеграция Живых Погодных API',
      apiProviderLabel: 'Поставщик метеоданных',
      apiKeyLabel: 'Ключ API (для OpenWeatherMap или WeatherAPI)',
      apiKeyPlaceholder: 'Введите ваш API-ключ...',
      saveApiBtn: 'Сохранить и проверить соединение',
      enabled: 'Включено',
      disabled: 'Выключено'
    },
    about: {
      title: 'О Платформе OSMON PRO',
      subtitle: 'Премиальное веб-приложение для интерактивной визуализации климата и глобального мониторинга погоды',
      feature1Title: 'Интерактивная Карта Мира (Leaflet + Векторный Радар)',
      feature1Desc: 'Масштабируемая карта мира с кликабельными городами, выбором произвольных координат и слоями температуры, осадков, ветра и облачности.',
      feature2Title: 'Интеграция Реальных Метеорологических API',
      feature2Desc: 'Поддержка живых данных через Open-Meteo API (без ключа), а также подключение пользовательских ключей OpenWeatherMap и WeatherAPI.',
      feature3Title: 'Динамическая Атмосфера и Полная Двуязычность (UZ / RU)',
      feature3Desc: 'Адаптивные фоновые градиенты, физическая симуляция осадков на HTML5 Canvas и мгновенное переключение между узбекским и русским языками.',
      techStackTitle: 'Технологический стек и архитектура'
    }
  }
};

// ============================================================================
// 3. CURATED WORLD & UZBEKISTAN CITIES DATABASE (42 CITIES)
// ============================================================================

export const WORLD_CITIES: CityPreset[] = [
  // Uzbekistan
  {
    id: 'tashkent',
    nameUz: 'Toshkent',
    nameRu: 'Ташкент',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 41.2995,
    lon: 69.2401,
    timezoneOffset: 5,
    elevation: 455,
    baseTempC: 21,
    baseHumidity: 44,
    baseWindKmh: 14,
    baseWindDir: 65,
    basePressureHpa: 1018,
    condition: 'clear',
    region: 'uzbekistan'
  },
  {
    id: 'samarkand',
    nameUz: 'Samarqand',
    nameRu: 'Самарканд',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 39.6542,
    lon: 66.9597,
    timezoneOffset: 5,
    elevation: 702,
    baseTempC: 20,
    baseHumidity: 46,
    baseWindKmh: 12,
    baseWindDir: 80,
    basePressureHpa: 1017,
    condition: 'partly_cloudy',
    region: 'uzbekistan'
  },
  {
    id: 'bukhara',
    nameUz: 'Buxoro',
    nameRu: 'Бухара',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 39.7747,
    lon: 64.4286,
    timezoneOffset: 5,
    elevation: 225,
    baseTempC: 23,
    baseHumidity: 36,
    baseWindKmh: 18,
    baseWindDir: 45,
    basePressureHpa: 1016,
    condition: 'clear',
    region: 'uzbekistan'
  },
  {
    id: 'khiva',
    nameUz: 'Xiva',
    nameRu: 'Хива',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 41.3775,
    lon: 60.3639,
    timezoneOffset: 5,
    elevation: 95,
    baseTempC: 19,
    baseHumidity: 38,
    baseWindKmh: 21,
    baseWindDir: 30,
    basePressureHpa: 1019,
    condition: 'clear',
    region: 'uzbekistan'
  },
  {
    id: 'namangan',
    nameUz: 'Namangan',
    nameRu: 'Наманган',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 40.9983,
    lon: 71.6726,
    timezoneOffset: 5,
    elevation: 476,
    baseTempC: 20,
    baseHumidity: 50,
    baseWindKmh: 11,
    baseWindDir: 110,
    basePressureHpa: 1018,
    condition: 'partly_cloudy',
    region: 'uzbekistan'
  },
  {
    id: 'andijan',
    nameUz: 'Andijon',
    nameRu: 'Андижан',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 40.7821,
    lon: 72.3442,
    timezoneOffset: 5,
    elevation: 490,
    baseTempC: 19,
    baseHumidity: 52,
    baseWindKmh: 10,
    baseWindDir: 95,
    basePressureHpa: 1019,
    condition: 'partly_cloudy',
    region: 'uzbekistan'
  },
  {
    id: 'fergana',
    nameUz: 'Fargʻona',
    nameRu: 'Фергана',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 40.3842,
    lon: 71.7843,
    timezoneOffset: 5,
    elevation: 580,
    baseTempC: 20,
    baseHumidity: 48,
    baseWindKmh: 9,
    baseWindDir: 120,
    basePressureHpa: 1018,
    condition: 'clear',
    region: 'uzbekistan'
  },
  {
    id: 'nukus',
    nameUz: 'Nukus',
    nameRu: 'Нукус',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 42.4619,
    lon: 59.6166,
    timezoneOffset: 5,
    elevation: 76,
    baseTempC: 17,
    baseHumidity: 41,
    baseWindKmh: 24,
    baseWindDir: 20,
    basePressureHpa: 1020,
    condition: 'cloudy',
    region: 'uzbekistan'
  },
  {
    id: 'termez',
    nameUz: 'Termiz',
    nameRu: 'Термез',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 37.2242,
    lon: 67.2783,
    timezoneOffset: 5,
    elevation: 302,
    baseTempC: 26,
    baseHumidity: 32,
    baseWindKmh: 16,
    baseWindDir: 250,
    basePressureHpa: 1014,
    condition: 'clear',
    region: 'uzbekistan'
  },
  {
    id: 'qarshi',
    nameUz: 'Qarshi',
    nameRu: 'Карши',
    countryUz: 'Oʻzbekiston',
    countryRu: 'Узбекистан',
    lat: 38.8606,
    lon: 65.7891,
    timezoneOffset: 5,
    elevation: 374,
    baseTempC: 23,
    baseHumidity: 37,
    baseWindKmh: 15,
    baseWindDir: 70,
    basePressureHpa: 1016,
    condition: 'clear',
    region: 'uzbekistan'
  },
  // Central Asia
  {
    id: 'almaty',
    nameUz: 'Olmaota',
    nameRu: 'Алматы',
    countryUz: 'Qozogʻiston',
    countryRu: 'Казахстан',
    lat: 43.222,
    lon: 76.8512,
    timezoneOffset: 5,
    elevation: 770,
    baseTempC: 14,
    baseHumidity: 58,
    baseWindKmh: 13,
    baseWindDir: 160,
    basePressureHpa: 1021,
    condition: 'partly_cloudy',
    region: 'central_asia'
  },
  {
    id: 'astana',
    nameUz: 'Ostona',
    nameRu: 'Астана',
    countryUz: 'Qozogʻiston',
    countryRu: 'Казахстан',
    lat: 51.1694,
    lon: 71.4491,
    timezoneOffset: 5,
    elevation: 347,
    baseTempC: 6,
    baseHumidity: 68,
    baseWindKmh: 28,
    baseWindDir: 290,
    basePressureHpa: 1015,
    condition: 'cloudy',
    region: 'central_asia'
  },
  {
    id: 'bishkek',
    nameUz: 'Bishkek',
    nameRu: 'Бишкек',
    countryUz: 'Qirgʻiziston',
    countryRu: 'Кыргызстан',
    lat: 42.8746,
    lon: 74.5698,
    timezoneOffset: 6,
    elevation: 800,
    baseTempC: 16,
    baseHumidity: 54,
    baseWindKmh: 12,
    baseWindDir: 140,
    basePressureHpa: 1019,
    condition: 'partly_cloudy',
    region: 'central_asia'
  },
  {
    id: 'dushanbe',
    nameUz: 'Dushanbe',
    nameRu: 'Душанбе',
    countryUz: 'Tojikiston',
    countryRu: 'Таджикистан',
    lat: 38.5598,
    lon: 68.787,
    timezoneOffset: 5,
    elevation: 789,
    baseTempC: 21,
    baseHumidity: 45,
    baseWindKmh: 9,
    baseWindDir: 105,
    basePressureHpa: 1017,
    condition: 'clear',
    region: 'central_asia'
  },
  {
    id: 'ashgabat',
    nameUz: 'Ashxobod',
    nameRu: 'Ашхабад',
    countryUz: 'Turkmaniston',
    countryRu: 'Туркменистан',
    lat: 37.9601,
    lon: 58.3261,
    timezoneOffset: 5,
    elevation: 219,
    baseTempC: 24,
    baseHumidity: 35,
    baseWindKmh: 15,
    baseWindDir: 75,
    basePressureHpa: 1016,
    condition: 'clear',
    region: 'central_asia'
  },
  // Europe & Russia
  {
    id: 'moscow',
    nameUz: 'Moskva',
    nameRu: 'Москва',
    countryUz: 'Rossiya',
    countryRu: 'Россия',
    lat: 55.7558,
    lon: 37.6173,
    timezoneOffset: 3,
    elevation: 156,
    baseTempC: 8,
    baseHumidity: 78,
    baseWindKmh: 19,
    baseWindDir: 240,
    basePressureHpa: 1009,
    condition: 'rain',
    region: 'europe'
  },
  {
    id: 'spb',
    nameUz: 'Sankt-Peterburg',
    nameRu: 'Санкт-Петербург',
    countryUz: 'Rossiya',
    countryRu: 'Россия',
    lat: 59.9343,
    lon: 30.3351,
    timezoneOffset: 3,
    elevation: 20,
    baseTempC: 7,
    baseHumidity: 84,
    baseWindKmh: 23,
    baseWindDir: 265,
    basePressureHpa: 1005,
    condition: 'rain',
    region: 'europe'
  },
  {
    id: 'istanbul',
    nameUz: 'Istanbul',
    nameRu: 'Стамбул',
    countryUz: 'Turkiya',
    countryRu: 'Турция',
    lat: 41.0082,
    lon: 28.9784,
    timezoneOffset: 3,
    elevation: 39,
    baseTempC: 19,
    baseHumidity: 67,
    baseWindKmh: 21,
    baseWindDir: 35,
    basePressureHpa: 1016,
    condition: 'partly_cloudy',
    region: 'europe'
  },
  {
    id: 'london',
    nameUz: 'London',
    nameRu: 'Лондон',
    countryUz: 'Buyuk Britaniya',
    countryRu: 'Великобритания',
    lat: 51.5074,
    lon: -0.1278,
    timezoneOffset: 1,
    elevation: 35,
    baseTempC: 14,
    baseHumidity: 81,
    baseWindKmh: 22,
    baseWindDir: 230,
    basePressureHpa: 1008,
    condition: 'rain',
    region: 'europe'
  },
  {
    id: 'paris',
    nameUz: 'Parij',
    nameRu: 'Париж',
    countryUz: 'Fransiya',
    countryRu: 'Франция',
    lat: 48.8566,
    lon: 2.3522,
    timezoneOffset: 2,
    elevation: 35,
    baseTempC: 15,
    baseHumidity: 74,
    baseWindKmh: 16,
    baseWindDir: 215,
    basePressureHpa: 1013,
    condition: 'partly_cloudy',
    region: 'europe'
  },
  {
    id: 'berlin',
    nameUz: 'Berlin',
    nameRu: 'Берлин',
    countryUz: 'Germaniya',
    countryRu: 'Германия',
    lat: 52.52,
    lon: 13.405,
    timezoneOffset: 2,
    elevation: 34,
    baseTempC: 13,
    baseHumidity: 76,
    baseWindKmh: 18,
    baseWindDir: 250,
    basePressureHpa: 1011,
    condition: 'cloudy',
    region: 'europe'
  },
  {
    id: 'rome',
    nameUz: 'Rim',
    nameRu: 'Рим',
    countryUz: 'Italiya',
    countryRu: 'Италия',
    lat: 41.9028,
    lon: 12.4964,
    timezoneOffset: 2,
    elevation: 21,
    baseTempC: 22,
    baseHumidity: 62,
    baseWindKmh: 12,
    baseWindDir: 180,
    basePressureHpa: 1017,
    condition: 'clear',
    region: 'europe'
  },
  {
    id: 'madrid',
    nameUz: 'Madrid',
    nameRu: 'Мадрид',
    countryUz: 'Ispaniya',
    countryRu: 'Испания',
    lat: 40.4168,
    lon: -3.7038,
    timezoneOffset: 2,
    elevation: 667,
    baseTempC: 20,
    baseHumidity: 52,
    baseWindKmh: 14,
    baseWindDir: 210,
    basePressureHpa: 1018,
    condition: 'clear',
    region: 'europe'
  },
  {
    id: 'reykjavik',
    nameUz: 'Reykyavik',
    nameRu: 'Рейкьявик',
    countryUz: 'Islandiya',
    countryRu: 'Исландия',
    lat: 64.1466,
    lon: -21.9426,
    timezoneOffset: 0,
    elevation: 14,
    baseTempC: 2,
    baseHumidity: 86,
    baseWindKmh: 31,
    baseWindDir: 40,
    basePressureHpa: 996,
    condition: 'snow',
    region: 'europe'
  },
  // Middle East & Africa
  {
    id: 'dubai',
    nameUz: 'Dubay',
    nameRu: 'Дубай',
    countryUz: 'BAA',
    countryRu: 'ОАЭ',
    lat: 25.2048,
    lon: 55.2708,
    timezoneOffset: 4,
    elevation: 16,
    baseTempC: 33,
    baseHumidity: 48,
    baseWindKmh: 17,
    baseWindDir: 310,
    basePressureHpa: 1011,
    condition: 'clear',
    region: 'middle_east_africa'
  },
  {
    id: 'cairo',
    nameUz: 'Qohira',
    nameRu: 'Каир',
    countryUz: 'Misr',
    countryRu: 'Египет',
    lat: 30.0444,
    lon: 31.2357,
    timezoneOffset: 3,
    elevation: 23,
    baseTempC: 28,
    baseHumidity: 42,
    baseWindKmh: 16,
    baseWindDir: 15,
    basePressureHpa: 1014,
    condition: 'clear',
    region: 'middle_east_africa'
  },
  // Asia & Oceania
  {
    id: 'tokyo',
    nameUz: 'Tokio',
    nameRu: 'Токио',
    countryUz: 'Yaponiya',
    countryRu: 'Япония',
    lat: 35.6762,
    lon: 139.6503,
    timezoneOffset: 9,
    elevation: 40,
    baseTempC: 19,
    baseHumidity: 64,
    baseWindKmh: 15,
    baseWindDir: 135,
    basePressureHpa: 1016,
    condition: 'partly_cloudy',
    region: 'asia'
  },
  {
    id: 'seoul',
    nameUz: 'Seul',
    nameRu: 'Сеул',
    countryUz: 'Janubiy Koreya',
    countryRu: 'Южная Корея',
    lat: 37.5665,
    lon: 126.978,
    timezoneOffset: 9,
    elevation: 38,
    baseTempC: 16,
    baseHumidity: 58,
    baseWindKmh: 12,
    baseWindDir: 270,
    basePressureHpa: 1018,
    condition: 'clear',
    region: 'asia'
  },
  {
    id: 'beijing',
    nameUz: 'Pekin',
    nameRu: 'Пекин',
    countryUz: 'Xitoy',
    countryRu: 'Китай',
    lat: 39.9042,
    lon: 116.4074,
    timezoneOffset: 8,
    elevation: 43,
    baseTempC: 15,
    baseHumidity: 49,
    baseWindKmh: 16,
    baseWindDir: 330,
    basePressureHpa: 1020,
    condition: 'partly_cloudy',
    region: 'asia'
  },
  {
    id: 'singapore',
    nameUz: 'Singapur',
    nameRu: 'Сингапур',
    countryUz: 'Singapur',
    countryRu: 'Сингапур',
    lat: 1.3521,
    lon: 103.8198,
    timezoneOffset: 8,
    elevation: 15,
    baseTempC: 30,
    baseHumidity: 82,
    baseWindKmh: 14,
    baseWindDir: 150,
    basePressureHpa: 1009,
    condition: 'thunderstorm',
    region: 'asia'
  },
  {
    id: 'mumbai',
    nameUz: 'Mumbay',
    nameRu: 'Мумбаи',
    countryUz: 'Hindiston',
    countryRu: 'Индия',
    lat: 19.076,
    lon: 72.8777,
    timezoneOffset: 5.5,
    elevation: 14,
    baseTempC: 31,
    baseHumidity: 74,
    baseWindKmh: 15,
    baseWindDir: 260,
    basePressureHpa: 1010,
    condition: 'partly_cloudy',
    region: 'asia'
  },
  {
    id: 'sydney',
    nameUz: 'Sidney',
    nameRu: 'Сидней',
    countryUz: 'Avstraliya',
    countryRu: 'Австралия',
    lat: -33.8688,
    lon: 151.2093,
    timezoneOffset: 11,
    elevation: 19,
    baseTempC: 22,
    baseHumidity: 63,
    baseWindKmh: 21,
    baseWindDir: 90,
    basePressureHpa: 1017,
    condition: 'partly_cloudy',
    region: 'oceania'
  },
  // Americas
  {
    id: 'new_york',
    nameUz: 'Nyu-York',
    nameRu: 'Нью-Йорк',
    countryUz: 'AQSH',
    countryRu: 'США',
    lat: 40.7128,
    lon: -74.006,
    timezoneOffset: -4,
    elevation: 10,
    baseTempC: 16,
    baseHumidity: 61,
    baseWindKmh: 19,
    baseWindDir: 295,
    basePressureHpa: 1015,
    condition: 'partly_cloudy',
    region: 'americas'
  },
  {
    id: 'los_angeles',
    nameUz: 'Los-Anjeles',
    nameRu: 'Лос-Анджелес',
    countryUz: 'AQSH',
    countryRu: 'США',
    lat: 34.0522,
    lon: -118.2437,
    timezoneOffset: -7,
    elevation: 89,
    baseTempC: 24,
    baseHumidity: 52,
    baseWindKmh: 13,
    baseWindDir: 250,
    basePressureHpa: 1015,
    condition: 'clear',
    region: 'americas'
  },
  {
    id: 'toronto',
    nameUz: 'Toronto',
    nameRu: 'Торонто',
    countryUz: 'Kanada',
    countryRu: 'Канада',
    lat: 43.6532,
    lon: -79.3832,
    timezoneOffset: -4,
    elevation: 76,
    baseTempC: 11,
    baseHumidity: 69,
    baseWindKmh: 22,
    baseWindDir: 280,
    basePressureHpa: 1014,
    condition: 'cloudy',
    region: 'americas'
  },
  {
    id: 'rio',
    nameUz: 'Rio-de-Janeyro',
    nameRu: 'Рио-де-Жанейро',
    countryUz: 'Braziliya',
    countryRu: 'Бразилия',
    lat: -22.9068,
    lon: -43.1729,
    timezoneOffset: -3,
    elevation: 11,
    baseTempC: 27,
    baseHumidity: 76,
    baseWindKmh: 16,
    baseWindDir: 120,
    basePressureHpa: 1013,
    condition: 'rain',
    region: 'americas'
  }
];

// ============================================================================
// 4. WEATHER DATA ENGINE (LIVE OPEN-METEO / OWM / WEATHERAPI + DEMO FALLBACK)
// ============================================================================

export function mapWmoCodeToCondition(code: number): WeatherConditionType {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partly_cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 51 && code <= 63) || (code >= 80 && code <= 81)) return 'rain';
  if (code === 65 || code === 67 || code === 82) return 'heavy_rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'thunderstorm';
  return 'partly_cloudy';
}

export function findNearestCity(lat: number, lon: number): { city: CityPreset; distanceKm: number } {
  let best = WORLD_CITIES[0];
  let minDist = Infinity;
  for (const c of WORLD_CITIES) {
    const dLat = ((c.lat - lat) * Math.PI) / 180;
    const dLon = ((c.lon - lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((c.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const dist = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (dist < minDist) {
      minDist = dist;
      best = c;
    }
  }
  return { city: best, distanceKm: Math.round(minDist) };
}

export function buildRealisticDemoWeather(
  target: {
    id: string;
    nameUz: string;
    nameRu: string;
    countryUz: string;
    countryRu: string;
    lat: number;
    lon: number;
    baseTempC?: number;
    baseHumidity?: number;
    baseWindKmh?: number;
    baseWindDir?: number;
    basePressureHpa?: number;
    condition?: WeatherConditionType;
  }
): WeatherData {
  const absLat = Math.abs(target.lat);
  const seed = Math.abs(Math.sin(target.lat * 12.9898 + target.lon * 78.233));
  const defaultTemp = Math.round(28 - absLat * 0.45 + (seed - 0.5) * 6);
  const tempC = target.baseTempC !== undefined ? target.baseTempC : defaultTemp;
  const condition: WeatherConditionType =
    target.condition ||
    (tempC <= 2
      ? 'snow'
      : seed > 0.82
      ? 'rain'
      : seed > 0.65
      ? 'cloudy'
      : seed > 0.35
      ? 'partly_cloudy'
      : 'clear');

  const humidity =
    target.baseHumidity !== undefined
      ? target.baseHumidity
      : condition === 'rain' || condition === 'heavy_rain' || condition === 'snow'
      ? 82
      : condition === 'cloudy'
      ? 68
      : 45;
  const windKmh =
    target.baseWindKmh !== undefined
      ? target.baseWindKmh
      : Math.round(10 + seed * 20);
  const windDir =
    target.baseWindDir !== undefined
      ? target.baseWindDir
      : Math.round((seed * 360) % 360);
  const pressureHpa =
    target.basePressureHpa !== undefined
      ? target.basePressureHpa
      : Math.round(1013 + (0.5 - seed) * 16);

  const now = new Date();
  const currentHour = now.getHours();
  const isNight = currentHour < 6 || currentHour >= 19;

  const hourly: HourlyForecastItem[] = Array.from({ length: 24 }, (_, idx) => {
    const h = (currentHour + idx) % 24;
    const diurnalCurve = Math.sin(((h - 6) / 24) * 2 * Math.PI) * 4.5;
    const hTemp = Math.round(tempC + diurnalCurve - 1);
    const hNight = h < 6 || h >= 19;
    let hCond: WeatherConditionType = condition;
    if (condition === 'partly_cloudy' && idx % 5 === 0) hCond = 'clear';
    if (condition === 'rain' && idx > 14) hCond = 'partly_cloudy';
    const pop =
      hCond === 'rain' || hCond === 'heavy_rain' || hCond === 'thunderstorm'
        ? Math.min(95, 65 + (idx % 4) * 8)
        : hCond === 'snow'
        ? 75
        : hCond === 'cloudy'
        ? 30
        : 10;
    const rainMm =
      hCond === 'heavy_rain' || hCond === 'thunderstorm'
        ? Number((2.4 + (idx % 3) * 0.8).toFixed(1))
        : hCond === 'rain'
        ? Number((0.8 + (idx % 3) * 0.4).toFixed(1))
        : 0;
    const snowCm =
      hCond === 'snow' ? Number((0.6 + (idx % 3) * 0.3).toFixed(1)) : 0;

    return {
      time: `${String(h).padStart(2, '0')}:00`,
      hourNum: h,
      tempC: hTemp,
      feelsLikeC: Math.round(hTemp - (windKmh > 18 ? 2 : 0)),
      condition: hCond,
      pop,
      rainMm,
      snowCm,
      windKmh: Math.max(4, Math.round(windKmh + Math.sin(idx) * 4)),
      windDir: (windDir + idx * 5) % 360,
      humidity: Math.min(98, Math.max(22, Math.round(humidity - diurnalCurve * 2))),
      isNight: hNight
    };
  });

  const conditionCycle: WeatherConditionType[] = [
    condition,
    condition === 'rain' ? 'partly_cloudy' : condition,
    'clear',
    'partly_cloudy',
    condition === 'snow' ? 'snow' : 'cloudy',
    'partly_cloudy',
    'clear'
  ];

  const daily: DailyForecastItem[] = Array.from({ length: 7 }, (_, dIdx) => {
    const dDate = new Date(now.getTime() + dIdx * 86400000);
    const wave = Math.round(Math.sin(dIdx * 1.1 + seed * 3) * 3);
    const maxC = tempC + 3 + wave;
    const minC = tempC - 6 + wave;
    const dCond = conditionCycle[dIdx % conditionCycle.length];
    const pop =
      dCond === 'rain' || dCond === 'heavy_rain' || dCond === 'thunderstorm'
        ? 80
        : dCond === 'snow'
        ? 75
        : dCond === 'cloudy'
        ? 35
        : dCond === 'partly_cloudy'
        ? 15
        : 5;
    const rainMm =
      dCond === 'rain' || dCond === 'heavy_rain' || dCond === 'thunderstorm'
        ? Number((4.2 + dIdx * 1.1).toFixed(1))
        : 0;
    const snowCm =
      dCond === 'snow' ? Number((2.5 + dIdx * 0.7).toFixed(1)) : 0;

    return {
      dateStr: dDate.toISOString().split('T')[0],
      dayIndex: dDate.getDay(),
      condition: dCond,
      tempMaxC: maxC,
      tempMinC: minC,
      pop,
      rainMm,
      snowCm,
      windMaxKmh: Math.round(windKmh + (dIdx % 3) * 3),
      windDir: (windDir + dIdx * 20) % 360,
      humidity: Math.min(92, Math.max(28, humidity + ((dIdx % 3) - 1) * 6)),
      uvIndex: dCond === 'clear' ? 6 : dCond === 'partly_cloudy' ? 5 : 3,
      sunrise: '06:38',
      sunset: '17:36',
      morningTempC: minC + 2,
      dayTempC: maxC,
      eveningTempC: maxC - 3,
      nightTempC: minC,
      pressureHpa: pressureHpa + ((dIdx % 3) - 1) * 2
    };
  });

  return {
    locationId: target.id,
    nameUz: target.nameUz,
    nameRu: target.nameRu,
    countryUz: target.countryUz,
    countryRu: target.countryRu,
    lat: Number(target.lat.toFixed(4)),
    lon: Number(target.lon.toFixed(4)),
    tempC,
    feelsLikeC: Math.round(tempC - (windKmh > 18 ? 2 : 0)),
    tempMaxC: daily[0].tempMaxC,
    tempMinC: daily[0].tempMinC,
    condition,
    wmoCode: condition === 'clear' ? 0 : condition === 'rain' ? 61 : condition === 'snow' ? 71 : 2,
    humidity,
    windKmh,
    windGustKmh: Math.round(windKmh * 1.35),
    windDir,
    pressureHpa,
    visibilityKm: condition === 'fog' ? 2.5 : condition === 'rain' || condition === 'snow' ? 6.8 : 10.0,
    uvIndex: isNight ? 0 : condition === 'clear' ? 6 : 4,
    cloudCover:
      condition === 'clear'
        ? 8
        : condition === 'partly_cloudy'
        ? 42
        : condition === 'cloudy'
        ? 84
        : 92,
    dewPointC: Math.round(tempC - (100 - humidity) / 5),
    aqi: 34,
    sunrise: '06:38',
    sunset: '17:36',
    isNight,
    lastUpdated: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    dataSource: 'demo_fallback',
    hourly,
    daily
  };
}

export async function fetchWeatherForLocation(
  target: {
    id: string;
    nameUz: string;
    nameRu: string;
    countryUz: string;
    countryRu: string;
    lat: number;
    lon: number;
    baseTempC?: number;
    baseHumidity?: number;
    baseWindKmh?: number;
    baseWindDir?: number;
    basePressureHpa?: number;
    condition?: WeatherConditionType;
  },
  provider: ApiProviderType,
  apiKey: string
): Promise<WeatherData> {
  if (provider === 'demo') {
    return buildRealisticDemoWeather(target);
  }

  try {
    // 1. OpenWeatherMap Provider (if selected and API key provided)
    if (provider === 'openweathermap' && apiKey.trim()) {
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${target.lat}&lon=${target.lon}&appid=${encodeURIComponent(apiKey.trim())}&units=metric`;
      const res = await fetch(owmUrl);
      if (res.ok) {
        const data = await res.json();
        const fallback = buildRealisticDemoWeather({
          ...target,
          baseTempC: Math.round(data.main?.temp ?? 20),
          baseHumidity: Math.round(data.main?.humidity ?? 50),
          baseWindKmh: Math.round((data.wind?.speed ?? 3) * 3.6),
          baseWindDir: Math.round(data.wind?.deg ?? 90),
          basePressureHpa: Math.round(data.main?.pressure ?? 1015)
        });
        return {
          ...fallback,
          feelsLikeC: Math.round(data.main?.feels_like ?? fallback.tempC),
          visibilityKm: Number(((data.visibility ?? 10000) / 1000).toFixed(1)),
          cloudCover: data.clouds?.all ?? fallback.cloudCover,
          dataSource: 'live_owm',
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
      }
    }

    // 2. WeatherAPI.com Provider (if selected and API key provided)
    if (provider === 'weatherapi' && apiKey.trim()) {
      const wapiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey.trim())}&q=${target.lat},${target.lon}&days=7&aqi=yes`;
      const res = await fetch(wapiUrl);
      if (res.ok) {
        const data = await res.json();
        const fallback = buildRealisticDemoWeather({
          ...target,
          baseTempC: Math.round(data.current?.temp_c ?? 20),
          baseHumidity: Math.round(data.current?.humidity ?? 50),
          baseWindKmh: Math.round(data.current?.wind_kph ?? 12),
          baseWindDir: Math.round(data.current?.wind_degree ?? 90),
          basePressureHpa: Math.round(data.current?.pressure_mb ?? 1015)
        });
        return {
          ...fallback,
          feelsLikeC: Math.round(data.current?.feelslike_c ?? fallback.tempC),
          visibilityKm: Number(data.current?.vis_km ?? 10),
          uvIndex: Math.round(data.current?.uv ?? 4),
          cloudCover: Math.round(data.current?.cloud ?? 30),
          dataSource: 'live_weatherapi',
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
      }
    }

    // 3. Open-Meteo Live API (Free, No Key Required, High Precision Global Meteorological Feed)
    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${target.lat}&longitude=${target.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,snowfall,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=7`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5500);
    const response = await fetch(omUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Open-Meteo HTTP error');
    }

    const json = await response.json();
    const cur = json.current;
    const hr = json.hourly;
    const dy = json.daily;

    const currentTemp = Math.round(cur.temperature_2m);
    const currentFeels = Math.round(cur.apparent_temperature);
    const currentHum = Math.round(cur.relative_humidity_2m);
    const currentWind = Math.round(cur.wind_speed_10m);
    const currentGust = Math.round(cur.wind_gusts_10m ?? currentWind * 1.3);
    const currentDir = Math.round(cur.wind_direction_10m ?? 0);
    const currentPress = Math.round(cur.pressure_msl ?? 1015);
    const currentClouds = Math.round(cur.cloud_cover ?? 25);
    const currentCond = mapWmoCodeToCondition(cur.weather_code ?? 0);
    const isNight = cur.is_day === 0;

    const hourlyItems: HourlyForecastItem[] = [];
    const totalHours = Math.min(24, hr?.time?.length || 0);
    for (let i = 0; i < totalHours; i++) {
      const tStr = String(hr.time[i]).split('T')[1] || '00:00';
      const hNum = parseInt(tStr.split(':')[0] || '0', 10);
      hourlyItems.push({
        time: tStr.slice(0, 5),
        hourNum: hNum,
        tempC: Math.round(hr.temperature_2m[i]),
        feelsLikeC: Math.round(hr.apparent_temperature[i]),
        condition: mapWmoCodeToCondition(hr.weather_code[i]),
        pop: Math.round(hr.precipitation_probability?.[i] ?? 0),
        rainMm: Number((hr.rain?.[i] ?? 0).toFixed(1)),
        snowCm: Number((hr.snowfall?.[i] ?? 0).toFixed(1)),
        windKmh: Math.round(hr.wind_speed_10m?.[i] ?? currentWind),
        windDir: Math.round(hr.wind_direction_10m?.[i] ?? currentDir),
        humidity: Math.round(hr.relative_humidity_2m?.[i] ?? currentHum),
        isNight: hr.is_day?.[i] === 0
      });
    }

    const dailyItems: DailyForecastItem[] = [];
    const totalDays = Math.min(7, dy?.time?.length || 0);
    for (let d = 0; d < totalDays; d++) {
      const dateStr = String(dy.time[d]);
      const dObj = new Date(dateStr + 'T12:00:00');
      const maxC = Math.round(dy.temperature_2m_max[d]);
      const minC = Math.round(dy.temperature_2m_min[d]);
      const sr = String(dy.sunrise?.[d] || 'T06:30').split('T')[1]?.slice(0, 5) || '06:30';
      const ss = String(dy.sunset?.[d] || 'T18:00').split('T')[1]?.slice(0, 5) || '18:00';
      dailyItems.push({
        dateStr,
        dayIndex: dObj.getDay(),
        condition: mapWmoCodeToCondition(dy.weather_code[d]),
        tempMaxC: maxC,
        tempMinC: minC,
        pop: Math.round(dy.precipitation_probability_max?.[d] ?? 0),
        rainMm: Number((dy.rain_sum?.[d] ?? dy.precipitation_sum?.[d] ?? 0).toFixed(1)),
        snowCm: Number((dy.snowfall_sum?.[d] ?? 0).toFixed(1)),
        windMaxKmh: Math.round(dy.wind_speed_10m_max?.[d] ?? currentWind),
        windDir: Math.round(dy.wind_direction_10m_dominant?.[d] ?? currentDir),
        humidity: currentHum,
        uvIndex: Math.round(dy.uv_index_max?.[d] ?? 5),
        sunrise: sr,
        sunset: ss,
        morningTempC: minC + 2,
        dayTempC: maxC,
        eveningTempC: Math.round((maxC + minC) / 2) + 1,
        nightTempC: minC,
        pressureHpa: currentPress
      });
    }

    return {
      locationId: target.id,
      nameUz: target.nameUz,
      nameRu: target.nameRu,
      countryUz: target.countryUz,
      countryRu: target.countryRu,
      lat: Number(target.lat.toFixed(4)),
      lon: Number(target.lon.toFixed(4)),
      tempC: currentTemp,
      feelsLikeC: currentFeels,
      tempMaxC: dailyItems[0]?.tempMaxC ?? currentTemp + 3,
      tempMinC: dailyItems[0]?.tempMinC ?? currentTemp - 5,
      condition: currentCond,
      wmoCode: cur.weather_code ?? 0,
      humidity: currentHum,
      windKmh: currentWind,
      windGustKmh: currentGust,
      windDir: currentDir,
      pressureHpa: currentPress,
      visibilityKm: currentCond === 'fog' ? 2.8 : currentCond === 'rain' ? 7.2 : 10.0,
      uvIndex: isNight ? 0 : dailyItems[0]?.uvIndex ?? 5,
      cloudCover: currentClouds,
      dewPointC: Math.round(currentTemp - (100 - currentHum) / 5),
      aqi: 28,
      sunrise: dailyItems[0]?.sunrise || '06:38',
      sunset: dailyItems[0]?.sunset || '17:38',
      isNight,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dataSource: 'live_openmeteo',
      hourly: hourlyItems.length > 0 ? hourlyItems : buildRealisticDemoWeather(target).hourly,
      daily: dailyItems.length > 0 ? dailyItems : buildRealisticDemoWeather(target).daily
    };
  } catch {
    return buildRealisticDemoWeather(target);
  }
}

// ============================================================================
// 5. UNIT CONVERSION & FORMATTING HELPERS
// ============================================================================

export function formatTemp(tempC: number, unit: TempUnit): number {
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export function formatWind(windKmh: number, unit: WindUnit): string {
  if (unit === 'ms') {
    return (windKmh / 3.6).toFixed(1);
  }
  return String(Math.round(windKmh));
}

export function formatPressure(hpa: number, unit: PressureUnit): number {
  if (unit === 'mmhg') {
    return Math.round(hpa * 0.750062);
  }
  return Math.round(hpa);
}

export function getCompassLabel(deg: number, lang: Language): string {
  const dirs = TRANSLATIONS[lang].compass;
  const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
  return dirs[idx];
}

// ============================================================================
// 6. REUSABLE ANIMATED COMPONENTS
// ============================================================================

export const AnimatedNumber: React.FC<{
  value: number;
  suffix?: string;
  reducedMotion?: boolean;
  className?: string;
}> = ({ value, suffix = '', reducedMotion = false, className = '' }) => {
  const [displayVal, setDisplayVal] = useState<number>(value);
  const prevRef = useRef<number>(value);

  useEffect(() => {
    if (reducedMotion || prevRef.current === value) {
      setDisplayVal(value);
      prevRef.current = value;
      return;
    }
    const startVal = prevRef.current;
    const diff = value - startVal;
    const duration = 550;
    let startTime: number | null = null;
    let rafId = 0;

    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(startVal + diff * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        prevRef.current = value;
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, reducedMotion]);

  return (
    <span className={className}>
      {displayVal}
      {suffix}
    </span>
  );
};

export const AnimatedWeatherIcon: React.FC<{
  condition: WeatherConditionType;
  isNight?: boolean;
  size?: number;
  reducedMotion?: boolean;
}> = ({ condition, isNight = false, size = 48, reducedMotion = false }) => {
  const pulseClass = reducedMotion ? '' : 'animate-pulse';
  const spinClass = reducedMotion ? '' : 'animate-spin';

  if (condition === 'clear') {
    if (isNight) {
      return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full bg-indigo-400/20 blur-md" />
          <Moon size={size * 0.82} className={`text-indigo-200 drop-shadow ${pulseClass}`} />
        </div>
      );
    }
    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-md" />
        <Sun
          size={size * 0.86}
          className="text-amber-300 drop-shadow"
          style={reducedMotion ? undefined : { animation: 'spin 18s linear infinite' }}
        />
      </div>
    );
  }

  if (condition === 'partly_cloudy') {
    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <Sun
          size={size * 0.62}
          className="absolute -top-1 -left-1 text-amber-300"
          style={reducedMotion ? undefined : { animation: 'spin 20s linear infinite' }}
        />
        <Cloud size={size * 0.78} className="relative z-10 translate-x-1 translate-y-1 text-sky-100 drop-shadow" />
      </div>
    );
  }

  if (condition === 'cloudy' || condition === 'fog') {
    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        {condition === 'fog' ? (
          <CloudFog size={size * 0.84} className="text-slate-300 drop-shadow" />
        ) : (
          <Cloud size={size * 0.84} className="text-slate-200 drop-shadow" />
        )}
      </div>
    );
  }

  if (condition === 'rain' || condition === 'heavy_rain') {
    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-md" />
        <CloudRain
          size={size * 0.85}
          className={condition === 'heavy_rain' ? 'text-sky-300 drop-shadow' : 'text-blue-300 drop-shadow'}
        />
      </div>
    );
  }

  if (condition === 'thunderstorm') {
    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <div className={`absolute inset-0 rounded-full bg-amber-400/30 blur-md ${pulseClass}`} />
        <CloudLightning size={size * 0.85} className="text-amber-300 drop-shadow" />
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-cyan-200/25 blur-md" />
      <CloudSnow size={size * 0.85} className={`text-cyan-100 drop-shadow ${spinClass ? '' : ''}`} />
    </div>
  );
};

// ============================================================================
// 7. HTML5 CANVAS ATMOSPHERIC BACKGROUND ENGINE
// ============================================================================

export const WeatherBackgroundCanvas: React.FC<{
  condition: WeatherConditionType;
  isNight: boolean;
  enabled: boolean;
  reducedMotion: boolean;
}> = ({ condition, isNight, enabled, reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled || reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles setup
    const count =
      condition === 'heavy_rain' || condition === 'thunderstorm'
        ? 110
        : condition === 'rain'
        ? 75
        : condition === 'snow'
        ? 65
        : 32;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 1,
      vy:
        condition === 'rain' || condition === 'heavy_rain' || condition === 'thunderstorm'
          ? Math.random() * 7 + 9
          : condition === 'snow'
          ? Math.random() * 1.4 + 0.6
          : Math.random() * 0.3 + 0.1,
      vx:
        condition === 'rain' || condition === 'heavy_rain' || condition === 'thunderstorm'
          ? -1.5
          : (Math.random() - 0.5) * 0.7,
      alpha: Math.random() * 0.55 + 0.2
    }));

    const clouds = Array.from({ length: 5 }, (_, idx) => ({
      x: (idx * width) / 5 + Math.random() * 120,
      y: 60 + idx * 55,
      radius: 90 + idx * 25,
      speed: 0.18 + idx * 0.06
    }));

    let lightningAlpha = 0;
    let rafId = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle drifting atmospheric clouds
      if (condition !== 'clear') {
        for (const c of clouds) {
          c.x += c.speed;
          if (c.x - c.radius * 2 > width) c.x = -c.radius * 2;
          const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.radius * 1.8);
          grad.addColorStop(0, isNight ? 'rgba(148, 163, 184, 0.08)' : 'rgba(255, 255, 255, 0.12)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Sunbeams on clear day
      if (condition === 'clear' && !isNight) {
        const sunGrad = ctx.createRadialGradient(width * 0.82, height * 0.14, 10, width * 0.82, height * 0.14, 420);
        sunGrad.addColorStop(0, 'rgba(253, 224, 71, 0.22)');
        sunGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.07)');
        sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Rain / Snow / Stars
      for (const p of particles) {
        if (condition === 'rain' || condition === 'heavy_rain' || condition === 'thunderstorm') {
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.alpha})`;
          ctx.lineWidth = condition === 'heavy_rain' ? 1.8 : 1.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 1.7);
          ctx.stroke();
          p.x += p.vx;
          p.y += p.vy;
          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
        } else if (condition === 'snow') {
          ctx.fillStyle = `rgba(240, 249, 255, ${p.alpha + 0.2})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.vx + Math.sin(p.y * 0.02) * 0.3;
          p.y += p.vy;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (isNight) {
          ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Occasional lightning flash in thunderstorm
      if (condition === 'thunderstorm') {
        if (Math.random() < 0.006) {
          lightningAlpha = 0.35;
        }
        if (lightningAlpha > 0) {
          ctx.fillStyle = `rgba(254, 249, 195, ${lightningAlpha})`;
          ctx.fillRect(0, 0, width, height);
          lightningAlpha = Math.max(0, lightningAlpha - 0.025);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [condition, isNight, enabled, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

// ============================================================================
// 8. INTERACTIVE WORLD MAP SECTION (LEAFLET OSM + VECTOR ATLAS DUAL ENGINE)
// ============================================================================

export const InteractiveWorldMapSection: React.FC<{
  lang: Language;
  theme: ThemeMode;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  pressureUnit: PressureUnit;
  selectedWeather: WeatherData;
  onSelectCity: (city: CityPreset) => void;
  onSelectCoordinates: (lat: number, lon: number) => void;
  onOpenForecast: () => void;
  reducedMotion: boolean;
}> = ({
  lang,
  theme,
  tempUnit,
  windUnit,
  pressureUnit,
  selectedWeather,
  onSelectCity,
  onSelectCoordinates,
  onOpenForecast,
  reducedMotion
}) => {
  const t = TRANSLATIONS[lang];
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('temp');
  const [mapMode, setMapMode] = useState<'vector' | 'leaflet'>('leaflet');
  const [leafletReady, setLeafletReady] = useState<boolean>(false);
  const [regionFilter, setRegionFilter] = useState<'all' | 'uzbekistan' | 'central_asia' | 'world'>('all');
  const [mapSearch, setMapSearch] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1.35);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const leafletMarkerGroupRef = useRef<any>(null);

  // Dynamically load Leaflet 1.9.4 from unpkg CDN for real OpenStreetMap tile support
  useEffect(() => {
    const win = window as any;
    if (win.L) {
      setLeafletReady(true);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletReady(true);
    };
    script.onerror = () => {
      setMapMode('vector');
    };
    document.head.appendChild(script);
  }, []);

  // Initialize & sync Leaflet Map when in 'leaflet' mode and Leaflet is loaded
  useEffect(() => {
    const win = window as any;
    if (mapMode !== 'leaflet' || !leafletReady || !win.L || !leafletContainerRef.current) {
      return;
    }

    const L = win.L;
    if (!leafletMapInstanceRef.current) {
      const map = L.map(leafletContainerRef.current, {
        center: [selectedWeather.lat, selectedWeather.lon],
        zoom: 4,
        zoomControl: false,
        attributionControl: true
      });

      const tileUrl =
        theme === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      leafletMarkerGroupRef.current = markersLayer;

      map.on('click', (e: any) => {
        if (e?.latlng) {
          onSelectCoordinates(e.latlng.lat, e.latlng.lng);
        }
      });

      leafletMapInstanceRef.current = map;
    }

    const map = leafletMapInstanceRef.current;
    const markersLayer = leafletMarkerGroupRef.current;
    if (map && markersLayer) {
      markersLayer.clearLayers();

      // Render clickable markers for all curated cities
      for (const c of WORLD_CITIES) {
        const isSelected =
          Math.abs(c.lat - selectedWeather.lat) < 0.15 &&
          Math.abs(c.lon - selectedWeather.lon) < 0.15;
        const tVal = formatTemp(c.baseTempC, tempUnit);
        const badgeColor =
          activeLayer === 'temp'
            ? c.baseTempC >= 25
              ? '#f97316'
              : c.baseTempC >= 15
              ? '#10b981'
              : '#38bdf8'
            : activeLayer === 'precip'
            ? c.condition === 'rain' || c.condition === 'thunderstorm'
              ? '#3b82f6'
              : '#64748b'
            : activeLayer === 'wind'
            ? '#a855f7'
            : '#94a3b8';

        const iconHtml = `
          <div style="
            display:inline-flex;align-items:center;gap:4px;
            padding:3px 8px;border-radius:999px;
            background:${isSelected ? '#0284c7' : 'rgba(15,23,42,0.88)'};
            border:2px solid ${isSelected ? '#38bdf8' : badgeColor};
            color:#fff;font-size:11px;font-weight:700;white-space:nowrap;
            box-shadow:0 4px 12px rgba(0,0,0,0.45);
            transform:${isSelected ? 'scale(1.15)' : 'scale(1)'};
          ">
            <span style="width:7px;height:7px;border-radius:50%;background:${badgeColor};display:inline-block;"></span>
            <span>${lang === 'uz' ? c.nameUz : c.nameRu}</span>
            <span style="color:#bae6fd;">${tVal}°</span>
          </div>
        `;

        const divIcon = L.divIcon({
          html: iconHtml,
          className: 'osmon-city-pin',
          iconSize: [90, 26],
          iconAnchor: [45, 13]
        });

        const marker = L.marker([c.lat, c.lon], { icon: divIcon });
        marker.on('click', () => {
          onSelectCity(c);
        });
        marker.addTo(markersLayer);
      }

      // Highlight custom coordinate pin if not matching a preset city
      const customMatch = WORLD_CITIES.some(
        (c) =>
          Math.abs(c.lat - selectedWeather.lat) < 0.15 &&
          Math.abs(c.lon - selectedWeather.lon) < 0.15
      );
      if (!customMatch) {
        const customIcon = L.divIcon({
          html: `<div style="width:22px;height:22px;border-radius:50%;background:#38bdf8;border:3px solid #fff;box-shadow:0 0 18px #38bdf8;"></div>`,
          className: 'osmon-custom-pin',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });
        L.marker([selectedWeather.lat, selectedWeather.lon], { icon: customIcon }).addTo(markersLayer);
      }

      map.setView([selectedWeather.lat, selectedWeather.lon], map.getZoom(), {
        animate: !reducedMotion
      });
    }
  }, [
    mapMode,
    leafletReady,
    selectedWeather.lat,
    selectedWeather.lon,
    activeLayer,
    lang,
    tempUnit,
    theme,
    reducedMotion,
    onSelectCity,
    onSelectCoordinates
  ]);

  // Cleanup Leaflet instance on unmount or mode toggle
  useEffect(() => {
    if (mapMode === 'vector' && leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.remove();
      leafletMapInstanceRef.current = null;
      leafletMarkerGroupRef.current = null;
    }
  }, [mapMode]);

  const filteredCities = useMemo(() => {
    return WORLD_CITIES.filter((c) => {
      if (regionFilter === 'uzbekistan' && c.region !== 'uzbekistan') return false;
      if (regionFilter === 'central_asia' && c.region !== 'uzbekistan' && c.region !== 'central_asia')
        return false;
      if (regionFilter === 'world' && c.region === 'uzbekistan') return false;
      if (mapSearch.trim()) {
        const q = mapSearch.toLowerCase();
        return (
          c.nameUz.toLowerCase().includes(q) ||
          c.nameRu.toLowerCase().includes(q) ||
          c.countryUz.toLowerCase().includes(q) ||
          c.countryRu.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [regionFilter, mapSearch]);

  // Convert lat/lon to SVG 1000x500 Equirectangular coordinates
  const latLonToXY = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const normX = (clickX / rect.width) * 1000;
    const normY = (clickY / rect.height) * 500;
    const lon = (normX / 1000) * 360 - 180;
    const lat = 90 - (normY / 500) * 180;
    if (lat >= -85 && lat <= 85 && lon >= -180 && lon <= 180) {
      onSelectCoordinates(lat, lon);
    }
  };

  const handleZoom = (delta: number) => {
    if (mapMode === 'leaflet' && leafletMapInstanceRef.current) {
      if (delta > 0) leafletMapInstanceRef.current.zoomIn();
      else leafletMapInstanceRef.current.zoomOut();
    } else {
      setZoom((prev) => Math.min(4, Math.max(1, Number((prev + delta).toFixed(2)))));
    }
  };

  const handleResetMap = () => {
    if (mapMode === 'leaflet' && leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.setView([30, 45], 3);
    } else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const selectedXY = latLonToXY(selectedWeather.lat, selectedWeather.lon);

  return (
    <div className="space-y-6">
      {/* Header & Map Layer Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.map.title}</h1>
          <p className="mt-1 text-sm opacity-80">{t.map.subtitle}</p>
        </div>

        {/* Map Engine Switcher & Layer Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-2xl border border-white/15 bg-slate-900/50 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMapMode('leaflet')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                mapMode === 'leaflet'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.map.mapModeLeaflet}
            </button>
            <button
              type="button"
              onClick={() => setMapMode('vector')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                mapMode === 'vector'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.map.mapModeVector}
            </button>
          </div>

          {(
            [
              { id: 'temp', label: t.map.layerTemp, icon: Thermometer },
              { id: 'precip', label: t.map.layerPrecip, icon: CloudRain },
              { id: 'wind', label: t.map.layerWind, icon: Wind },
              { id: 'clouds', label: t.map.layerClouds, icon: Cloud }
            ] as const
          ).map((layer) => {
            const Icon = layer.icon;
            const active = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? 'border-sky-400 bg-sky-500/25 text-white shadow-lg shadow-sky-500/20'
                    : 'border-white/15 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Icon size={15} className={active ? 'text-sky-300' : 'opacity-70'} />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Grid: Interactive Map Canvas (Left 8 cols) + Live Telemetry Sidebar (Right 4 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Interactive Map Container */}
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/80 shadow-2xl xl:col-span-8">
          {/* Top Floating Map Search & Region Filter Bar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                placeholder={t.search.mapSearchPlaceholder}
                className="w-full rounded-xl border border-white/15 bg-slate-800/80 py-1.5 pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: t.map.regionFilterAll },
                  { id: 'uzbekistan', label: t.map.regionUzbekistan },
                  { id: 'central_asia', label: t.map.regionCentralAsia },
                  { id: 'world', label: t.map.regionWorld }
                ] as const
              ).map((rf) => (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setRegionFilter(rf.id)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-medium transition ${
                    regionFilter === rf.id
                      ? 'bg-sky-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Viewport */}
          <div className="relative h-[480px] w-full select-none overflow-hidden bg-[#061126]">
            {/* Mode A: Leaflet OpenStreetMap Viewport */}
            <div
              ref={leafletContainerRef}
              className={`h-full w-full ${mapMode === 'leaflet' && leafletReady ? 'block' : 'hidden'}`}
              style={{ zIndex: 1 }}
            />

            {/* Mode B: High-Detail Interactive Vector World Map (Always Ready & Instant Layer Rendering) */}
            {(mapMode === 'vector' || !leafletReady) && (
              <div
                className="relative h-full w-full cursor-crosshair overflow-hidden"
                onMouseDown={(e) => {
                  setIsDragging(false);
                  dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
                }}
                onMouseMove={(e) => {
                  if (e.buttons !== 1) return;
                  setIsDragging(true);
                  setPan({
                    x: Math.max(-300, Math.min(300, e.clientX - dragStartRef.current.x)),
                    y: Math.max(-180, Math.min(180, e.clientY - dragStartRef.current.y))
                  });
                }}
              >
                <svg
                  viewBox="0 0 1000 500"
                  onClick={handleSvgClick}
                  className="h-full w-full transition-transform duration-200"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center center'
                  }}
                >
                  <defs>
                    <radialGradient id="tempHot" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="tempMild" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="tempCold" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="precipBlob" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Latitude / Longitude Graticule Grid */}
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((gx) => (
                    <line
                      key={`vx-${gx}`}
                      x1={gx}
                      y1={0}
                      x2={gx}
                      y2={500}
                      stroke="rgba(148,163,184,0.1)"
                      strokeWidth="0.8"
                    />
                  ))}
                  {[83, 166, 250, 333, 416].map((gy) => (
                    <line
                      key={`vy-${gy}`}
                      x1={0}
                      y1={gy}
                      x2={1000}
                      y2={gy}
                      stroke={gy === 250 ? 'rgba(56,189,248,0.25)' : 'rgba(148,163,184,0.1)'}
                      strokeDasharray={gy === 250 ? '4 4' : undefined}
                      strokeWidth="0.9"
                    />
                  ))}

                  {/* World Continents Stylized Geographical Paths */}
                  <g fill="#162847" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2">
                    {/* North America */}
                    <path d="M 65 65 L 235 55 L 305 110 L 265 195 L 220 235 L 165 210 L 115 155 Z" />
                    {/* South America */}
                    <path d="M 245 250 L 345 275 L 375 355 L 320 455 L 275 430 L 255 320 Z" />
                    {/* Europe */}
                    <path d="M 445 65 L 585 55 L 610 135 L 545 168 L 460 160 L 435 115 Z" />
                    {/* Africa */}
                    <path d="M 445 180 L 580 185 L 630 265 L 590 395 L 520 410 L 475 315 L 435 235 Z" />
                    {/* Eurasia / Central Asia / Asia */}
                    <path d="M 590 60 L 895 70 L 920 175 L 845 265 L 745 280 L 665 235 L 600 175 Z" />
                    {/* Uzbekistan & Central Asia Highlight Polygon */}
                    <path
                      d="M 655 125 L 718 122 L 728 152 L 662 156 Z"
                      fill="#1e3a5f"
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                    />
                    {/* Australia / Oceania */}
                    <path d="M 775 325 L 905 325 L 920 410 L 820 425 L 765 375 Z" />
                  </g>

                  {/* Weather Layer Overlays */}
                  {WORLD_CITIES.map((c) => {
                    const pt = latLonToXY(c.lat, c.lon);
                    if (activeLayer === 'temp') {
                      const gradId =
                        c.baseTempC >= 24 ? 'tempHot' : c.baseTempC >= 12 ? 'tempMild' : 'tempCold';
                      return <circle key={`layer-${c.id}`} cx={pt.x} cy={pt.y} r={55} fill={`url(#${gradId})`} />;
                    }
                    if (activeLayer === 'precip') {
                      const hasRain =
                        c.condition === 'rain' ||
                        c.condition === 'heavy_rain' ||
                        c.condition === 'thunderstorm' ||
                        c.condition === 'snow';
                      if (!hasRain) return null;
                      return <circle key={`layer-${c.id}`} cx={pt.x} cy={pt.y} r={60} fill="url(#precipBlob)" />;
                    }
                    if (activeLayer === 'wind') {
                      const rad = (c.baseWindDir * Math.PI) / 180;
                      const x2 = pt.x + Math.cos(rad) * 32;
                      const y2 = pt.y + Math.sin(rad) * 32;
                      return (
                        <line
                          key={`layer-${c.id}`}
                          x1={pt.x}
                          y1={pt.y}
                          x2={x2}
                          y2={y2}
                          stroke="#a855f7"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          opacity="0.75"
                        />
                      );
                    }
                    return (
                      <circle
                        key={`layer-${c.id}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={45}
                        fill="rgba(226,232,240,0.18)"
                      />
                    );
                  })}

                  {/* Selected Coordinate Pulsing Radar Ring */}
                  <g transform={`translate(${selectedXY.x}, ${selectedXY.y})`}>
                    <circle
                      r="22"
                      fill="rgba(56, 189, 248, 0.22)"
                      className={reducedMotion ? '' : 'animate-ping'}
                    />
                    <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                  </g>

                  {/* City Pins */}
                  {filteredCities.map((c) => {
                    const pt = latLonToXY(c.lat, c.lon);
                    const isSelected =
                      Math.abs(c.lat - selectedWeather.lat) < 0.15 &&
                      Math.abs(c.lon - selectedWeather.lon) < 0.15;
                    const tVal = formatTemp(c.baseTempC, tempUnit);
                    return (
                      <g
                        key={c.id}
                        transform={`translate(${pt.x}, ${pt.y})`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onSelectCity(c);
                        }}
                        className="cursor-pointer"
                      >
                        <circle
                          r={isSelected ? 7 : 4.5}
                          fill={isSelected ? '#38bdf8' : c.region === 'uzbekistan' ? '#10b981' : '#f8fafc'}
                          stroke="#0f172a"
                          strokeWidth="1.5"
                        />
                        <rect
                          x={8}
                          y={-10}
                          rx={6}
                          width={74}
                          height={18}
                          fill={isSelected ? '#0284c7' : 'rgba(15, 23, 42, 0.85)'}
                          stroke={isSelected ? '#7dd3fc' : 'rgba(255,255,255,0.2)'}
                          strokeWidth="0.8"
                        />
                        <text x={13} y={2} fill="#ffffff" fontSize="8.5" fontWeight="600">
                          {(lang === 'uz' ? c.nameUz : c.nameRu).slice(0, 8)} {tVal}°
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Floating Map Zoom & Reset Controls */}
            <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleZoom(0.35)}
                title={t.map.zoomIn}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-900/85 text-white shadow-lg backdrop-blur-md hover:bg-sky-500"
              >
                <Plus size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(-0.35)}
                title={t.map.zoomOut}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-900/85 text-white shadow-lg backdrop-blur-md hover:bg-sky-500"
              >
                <Minimize2 size={16} />
              </button>
              <button
                type="button"
                onClick={handleResetMap}
                title={t.map.resetView}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-slate-900/85 text-white shadow-lg backdrop-blur-md hover:bg-sky-500"
              >
                <Globe size={16} />
              </button>
            </div>

            {/* Bottom Map Layer Legend & Click Hint */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-slate-900/85 px-4 py-2 text-xs text-slate-200 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-sky-400" />
                <span>{t.map.clickHint}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-75">{t.map.legendLow}</span>
                <div className="h-2.5 w-28 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-orange-500" />
                <span className="opacity-75">{t.map.legendHigh}</span>
              </div>
            </div>
          </div>

          {/* Quick Clickable City Pills Below Map */}
          <div className="flex items-center gap-2 overflow-x-auto border-t border-white/10 bg-slate-900/60 px-4 py-3">
            {filteredCities.slice(0, 14).map((c) => {
              const active =
                Math.abs(c.lat - selectedWeather.lat) < 0.15 &&
                Math.abs(c.lon - selectedWeather.lon) < 0.15;
              return (
                <button
                  key={`pill-${c.id}`}
                  type="button"
                  onClick={() => onSelectCity(c)}
                  className={`shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'border-sky-400 bg-sky-500 text-white shadow'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/15'
                  }`}
                >
                  {lang === 'uz' ? c.nameUz : c.nameRu} • {formatTemp(c.baseTempC, tempUnit)}°{tempUnit}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Location Weather Telemetry Panel */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl xl:col-span-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300">
                <Radio size={13} className={reducedMotion ? '' : 'animate-pulse'} />
                {t.map.selectedPoint}
              </span>
              <span className="font-mono text-xs opacity-75">
                {selectedWeather.lat.toFixed(2)}°N, {selectedWeather.lon.toFixed(2)}°E
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {lang === 'uz' ? selectedWeather.nameUz : selectedWeather.nameRu}
                </h2>
                <p className="text-sm opacity-75">
                  {lang === 'uz' ? selectedWeather.countryUz : selectedWeather.countryRu}
                </p>
              </div>
              <AnimatedWeatherIcon
                condition={selectedWeather.condition}
                isNight={selectedWeather.isNight}
                size={60}
                reducedMotion={reducedMotion}
              />
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-5xl font-extrabold tracking-tight">
                <AnimatedNumber
                  value={formatTemp(selectedWeather.tempC, tempUnit)}
                  suffix={`°${tempUnit}`}
                  reducedMotion={reducedMotion}
                />
              </div>
              <div className="text-sm opacity-80">
                <div>{t.weather[selectedWeather.condition]}</div>
                <div>
                  {t.weather.feelsLike}: {formatTemp(selectedWeather.feelsLikeC, tempUnit)}°{tempUnit}
                </div>
              </div>
            </div>

            {/* 6-Metric Telemetry Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center gap-1.5 text-xs opacity-75">
                  <Droplets size={14} className="text-sky-400" />
                  <span>{t.weather.humidity}</span>
                </div>
                <div className="mt-1 text-lg font-bold">{selectedWeather.humidity}%</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center gap-1.5 text-xs opacity-75">
                  <Wind size={14} className="text-emerald-400" />
                  <span>{t.weather.wind}</span>
                </div>
                <div className="mt-1 text-lg font-bold">
                  {formatWind(selectedWeather.windKmh, windUnit)} {windUnit === 'kmh' ? 'km/h' : 'm/s'} (
                  {getCompassLabel(selectedWeather.windDir, lang)})
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center gap-1.5 text-xs opacity-75">
                  <Gauge size={14} className="text-purple-400" />
                  <span>{t.weather.pressure}</span>
                </div>
                <div className="mt-1 text-lg font-bold">
                  {formatPressure(selectedWeather.pressureHpa, pressureUnit)}{' '}
                  {pressureUnit === 'hpa' ? 'hPa' : 'mmHg'}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center gap-1.5 text-xs opacity-75">
                  <Eye size={14} className="text-amber-400" />
                  <span>{t.weather.visibility}</span>
                </div>
                <div className="mt-1 text-lg font-bold">{selectedWeather.visibilityKm} km</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center gap-1.5 text-xs opacity-75">
                  <SunMedium size={14} className="text-yellow-400" />
                  <span>{t.weather.uvIndex}</span>
                </div>
                <div className="mt-1 text-lg font-bold">{selectedWeather.uvIndex}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center gap-1.5 text-xs opacity-75">
                  <Cloud size={14} className="text-slate-300" />
                  <span>{t.weather.cloudCover}</span>
                </div>
                <div className="mt-1 text-lg font-bold">{selectedWeather.cloudCover}%</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenForecast}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110"
          >
            <Calendar size={17} />
            <span>{t.map.openDetailedForecast}</span>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Persistent User Preferences (Wrapped safely for sandboxed iframe)
  const [lang, setLang] = useState<Language>('uz');
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [windUnit, setWindUnit] = useState<WindUnit>('kmh');
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>('hpa');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [apiProvider, setApiProvider] = useState<ApiProviderType>('openmeteo');
  const [apiKey, setApiKey] = useState<string>('');

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([
    'tashkent',
    'samarkand',
    'bukhara',
    'moscow',
    'istanbul',
    'dubai'
  ]);
  const [favoritesSort, setFavoritesSort] = useState<'temp' | 'name'>('temp');

  // Search & Active Weather State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState<boolean>(false);
  const [selectedWeather, setSelectedWeather] = useState<WeatherData>(() =>
    buildRealisticDemoWeather(WORLD_CITIES[0])
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Forecast Page Interactive States
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [forecastChartTab, setForecastChartTab] = useState<'temp' | 'precip' | 'wind'>('temp');

  const t = TRANSLATIONS[lang];

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  // Respect system prefers-reduced-motion on initial load
  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) {
        setReducedMotion(true);
      }
    } catch {
      // Ignore in restricted frames
    }
  }, []);

  // Load initial weather for Tashkent on mount
  const loadWeatherForTarget = useCallback(
    async (
      target: {
        id: string;
        nameUz: string;
        nameRu: string;
        countryUz: string;
        countryRu: string;
        lat: number;
        lon: number;
        baseTempC?: number;
        baseHumidity?: number;
        baseWindKmh?: number;
        baseWindDir?: number;
        basePressureHpa?: number;
        condition?: WeatherConditionType;
      },
      silent = false
    ) => {
      if (!silent) setIsLoading(true);
      const data = await fetchWeatherForLocation(target, apiProvider, apiKey);
      setSelectedWeather(data);
      setSelectedDayIdx(0);
      if (!silent) setIsLoading(false);
    },
    [apiProvider, apiKey]
  );

  useEffect(() => {
    loadWeatherForTarget(WORLD_CITIES[0], true);
  }, [loadWeatherForTarget]);

  // Select a preset city
  const handleSelectCity = useCallback(
    (city: CityPreset) => {
      setSearchDropdownOpen(false);
      setSearchQuery('');
      loadWeatherForTarget(city);
    },
    [loadWeatherForTarget]
  );

  // Select arbitrary coordinates on the World Map
  const handleSelectCoordinates = useCallback(
    async (lat: number, lon: number) => {
      const nearest = findNearestCity(lat, lon);
      if (nearest.distanceKm <= 65) {
        loadWeatherForTarget(nearest.city);
        return;
      }

      const customTarget = {
        id: `coord-${lat.toFixed(2)}-${lon.toFixed(2)}`,
        nameUz: `${t.map.customCoordName} (${nearest.city.nameUz} yaqinida)`,
        nameRu: `${t.map.customCoordName} (близ ${nearest.city.nameRu})`,
        countryUz: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        countryRu: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        lat,
        lon
      };
      loadWeatherForTarget(customTarget);
    },
    [loadWeatherForTarget, t.map.customCoordName]
  );

  // Search handler (checks local 42 cities + Open-Meteo Live Geocoding API)
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    const localMatch = WORLD_CITIES.find(
      (c) =>
        c.nameUz.toLowerCase().includes(q.toLowerCase()) ||
        c.nameRu.toLowerCase().includes(q.toLowerCase()) ||
        c.id.toLowerCase().includes(q.toLowerCase())
    );
    if (localMatch) {
      handleSelectCity(localMatch);
      return;
    }

    // Query live Open-Meteo Geocoding API
    setIsLoading(true);
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=${lang}`;
      const res = await fetch(geoUrl);
      if (res.ok) {
        const geoJson = await res.json();
        const first = geoJson?.results?.[0];
        if (first) {
          await loadWeatherForTarget({
            id: `geo-${first.id || first.name}`,
            nameUz: first.name,
            nameRu: first.name,
            countryUz: first.country || 'Erkin hudud',
            countryRu: first.country || 'Мир',
            lat: first.latitude,
            lon: first.longitude
          });
          setSearchQuery('');
          setSearchDropdownOpen(false);
          setIsLoading(false);
          return;
        }
      }
      showToast(t.status.cityNotFound);
    } catch {
      showToast(t.status.cityNotFound);
    }
    setIsLoading(false);
  };

  // Browser Geolocation handler (only invoked upon explicit user click)
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      showToast(t.status.geoDenied);
      return;
    }
    showToast(t.status.geoLocating);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleSelectCoordinates(pos.coords.latitude, pos.coords.longitude);
        showToast(t.status.geoSuccess);
      },
      () => {
        showToast(t.status.geoDenied);
      },
      { timeout: 7000 }
    );
  };

  // Toggle favorite status
  const toggleFavorite = (cityId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

  // Filtered autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return WORLD_CITIES.slice(0, 8);
    return WORLD_CITIES.filter(
      (c) =>
        c.nameUz.toLowerCase().includes(q) ||
        c.nameRu.toLowerCase().includes(q) ||
        c.countryUz.toLowerCase().includes(q) ||
        c.countryRu.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  // Dynamic background gradient based on weather condition and theme
  const dynamicGradientClass = useMemo(() => {
    if (theme === 'light') {
      if (selectedWeather.condition === 'rain' || selectedWeather.condition === 'heavy_rain') {
        return 'from-slate-200 via-sky-100 to-blue-200 text-slate-900';
      }
      if (selectedWeather.condition === 'snow') {
        return 'from-cyan-50 via-slate-100 to-sky-200 text-slate-900';
      }
      return 'from-sky-100 via-blue-50 to-indigo-100 text-slate-900';
    }

    if (selectedWeather.isNight) {
      return 'from-[#050b1a] via-[#0c1836] to-[#151c3b] text-slate-100';
    }
    switch (selectedWeather.condition) {
      case 'clear':
        return 'from-[#082046] via-[#0e396e] to-[#1a528b] text-white';
      case 'partly_cloudy':
        return 'from-[#0b223e] via-[#163659] to-[#234b6e] text-white';
      case 'cloudy':
      case 'fog':
        return 'from-[#111c2d] via-[#1e2d42] to-[#2b3c54] text-slate-100';
      case 'rain':
      case 'heavy_rain':
        return 'from-[#091526] via-[#132642] to-[#1d3557] text-slate-100';
      case 'thunderstorm':
        return 'from-[#0c0a20] via-[#1b193b] to-[#2b224f] text-slate-100';
      case 'snow':
        return 'from-[#0f243c] via-[#1b3b5c] to-[#27527a] text-white';
      default:
        return 'from-[#082046] via-[#0e396e] to-[#1a528b] text-white';
    }
  }, [selectedWeather.condition, selectedWeather.isNight, theme]);

  const cardSurfaceClass =
    theme === 'light'
      ? 'border-slate-300/80 bg-white/75 text-slate-900 shadow-xl backdrop-blur-xl'
      : 'border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-xl';

  const subCardClass =
    theme === 'light'
      ? 'border-slate-200/90 bg-slate-100/80 text-slate-900'
      : 'border-white/10 bg-black/25 text-white';

  // Chart data formatted in user's chosen units
  const chartData = useMemo(() => {
    return selectedWeather.hourly.map((h) => ({
      time: h.time,
      temp: formatTemp(h.tempC, tempUnit),
      feelsLike: formatTemp(h.feelsLikeC, tempUnit),
      pop: h.pop,
      rainMm: h.rainMm,
      snowCm: h.snowCm,
      wind: Number(formatWind(h.windKmh, windUnit)),
      humidity: h.humidity
    }));
  }, [selectedWeather.hourly, tempUnit, windUnit]);

  const activeDay = selectedWeather.daily[selectedDayIdx] || selectedWeather.daily[0];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${dynamicGradientClass} transition-colors duration-700`}>
      {/* Dynamic Weather Particle Canvas */}
      <WeatherBackgroundCanvas
        condition={selectedWeather.condition}
        isNight={selectedWeather.isNight}
        enabled={particlesEnabled}
        reducedMotion={reducedMotion}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-sky-400/40 bg-slate-900/95 px-4 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">
          <Sparkles size={17} className="text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sticky Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/15 bg-slate-950/65 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg shadow-sky-500/30">
              <CloudSun size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white">{t.brandName}</span>
                <span className="hidden rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 sm:inline-block">
                  UZ • RU
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-300 xl:block">{t.brandTagline}</p>
            </div>
          </button>

          {/* Desktop Navigation Links (All 7 Required Sections) */}
          <nav className="hidden items-center gap-1 lg:flex">
            {(
              [
                { id: 'home', label: t.nav.home, icon: Sun },
                { id: 'map', label: t.nav.map, icon: Globe },
                { id: 'forecast', label: t.nav.forecast, icon: Calendar },
                { id: 'details', label: t.nav.details, icon: Activity },
                { id: 'favorites', label: t.nav.favorites, icon: Star },
                { id: 'settings', label: t.nav.settings, icon: Settings },
                { id: 'about', label: t.nav.about, icon: Info }
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher (UZ / RU), Unit Quick Toggle, Theme, Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* UZ / RU Language Switcher */}
            <div className="inline-flex rounded-xl border border-white/15 bg-slate-900/80 p-0.5">
              <button
                type="button"
                onClick={() => setLang('uz')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  lang === 'uz' ? 'bg-sky-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  lang === 'ru' ? 'bg-sky-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                RU
              </button>
            </div>

            {/* °C / °F Quick Button */}
            <button
              type="button"
              onClick={() => setTempUnit((u) => (u === 'C' ? 'F' : 'C'))}
              className="rounded-xl border border-white/15 bg-slate-900/80 px-2.5 py-1.5 text-xs font-bold text-sky-300 hover:bg-slate-800"
              title={t.settings.tempUnitLabel}
            >
              °{tempUnit}
            </button>

            {/* Dark / Light Theme Button */}
            <button
              type="button"
              onClick={() => setTheme((th) => (th === 'dark' ? 'light' : 'dark'))}
              className="rounded-xl border border-white/15 bg-slate-900/80 p-2 text-slate-200 hover:bg-slate-800"
              title={t.settings.themeLabel}
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="rounded-xl border border-white/15 bg-slate-900/80 p-2 text-white lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  { id: 'home', label: t.nav.home, icon: Sun },
                  { id: 'map', label: t.nav.map, icon: Globe },
                  { id: 'forecast', label: t.nav.forecast, icon: Calendar },
                  { id: 'details', label: t.nav.details, icon: Activity },
                  { id: 'favorites', label: t.nav.favorites, icon: Star },
                  { id: 'settings', label: t.nav.settings, icon: Settings },
                  { id: 'about', label: t.nav.about, icon: Info }
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={`mob-${item.id}`}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                      isActive ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* Global Search Bar, Geolocation, Refresh & API Status Strip */}
        <div className={`rounded-3xl border p-4 ${cardSurfaceClass}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Form with Instant Autocomplete */}
            <div className="relative flex-1">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setSearchDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchDropdownOpen(true);
                    }}
                    placeholder={t.search.placeholder}
                    className={`w-full rounded-2xl border py-2.5 pl-10 pr-4 text-sm focus:border-sky-400 focus:outline-none ${
                      theme === 'light'
                        ? 'border-slate-300 bg-white text-slate-900 placeholder-slate-400'
                        : 'border-white/15 bg-slate-900/75 text-white placeholder-slate-400'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
                >
                  {t.search.searchBtn}
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {searchDropdownOpen && (
                <div
                  onMouseLeave={() => setSearchDropdownOpen(false)}
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/15 bg-slate-900/95 p-2 text-white shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <span>{searchQuery.trim() ? t.search.searchResults : t.search.popularCities}</span>
                    <button
                      type="button"
                      onClick={() => setSearchDropdownOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {searchSuggestions.map((c) => (
                      <button
                        key={`sug-${c.id}`}
                        type="button"
                        onClick={() => handleSelectCity(c)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition hover:bg-sky-500/20"
                      >
                        <div>
                          <div className="font-semibold">
                            {lang === 'uz' ? c.nameUz : c.nameRu}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {lang === 'uz' ? c.countryUz : c.countryRu}
                          </div>
                        </div>
                        <span className="font-bold text-sky-300">
                          {formatTemp(c.baseTempC, tempUnit)}°{tempUnit}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Geolocation, Refresh, Status Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleGeolocation}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-semibold transition hover:bg-white/20"
              >
                <Navigation size={14} className="text-sky-400" />
                <span>{t.search.myLocation}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loadWeatherForTarget({
                    id: selectedWeather.locationId,
                    nameUz: selectedWeather.nameUz,
                    nameRu: selectedWeather.nameRu,
                    countryUz: selectedWeather.countryUz,
                    countryRu: selectedWeather.countryRu,
                    lat: selectedWeather.lat,
                    lon: selectedWeather.lon
                  });
                  showToast(t.status.refreshedToast);
                }}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-semibold transition hover:bg-white/20"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin text-sky-400' : ''} />
                <span>{t.search.refresh}</span>
              </button>

              {/* Honest Live API vs Demo Fallback Indicator Badge */}
              <div
                className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold ${
                  selectedWeather.dataSource === 'demo_fallback'
                    ? 'border-amber-400/40 bg-amber-500/20 text-amber-200'
                    : 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200'
                }`}
              >
                {selectedWeather.dataSource === 'demo_fallback' ? (
                  <>
                    <AlertTriangle size={14} className="text-amber-300" />
                    <span>{t.status.demoMode}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-300" />
                    <span>{t.status.liveApi}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Transparent Demo Mode Notice Banner (if fallback is active) */}
          {selectedWeather.dataSource === 'demo_fallback' && (
            <div className="mt-3 flex flex-col justify-between gap-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-2.5 text-xs sm:flex-row sm:items-center">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
                <div>
                  <span className="font-bold">{t.status.demoBannerTitle}: </span>
                  <span className="opacity-90">{t.status.demoBannerDesc}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="rounded-xl bg-amber-400/20 px-3 py-1.5 font-semibold text-amber-200 hover:bg-amber-400/30"
                >
                  {t.status.configureApiBtn}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* TAB 1: HOMEPAGE                                                  */}
        {/* ================================================================ */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Quick Access Favorite Cities Bar */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <div className="flex items-center gap-2">
                {WORLD_CITIES.filter((c) => favoriteIds.includes(c.id)).map((city) => {
                  const isCurrent = selectedWeather.locationId === city.id;
                  return (
                    <button
                      key={`quick-fav-${city.id}`}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition ${
                        isCurrent
                          ? 'border-sky-400 bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                          : `${cardSurfaceClass} hover:border-sky-400/50`
                      }`}
                    >
                      <MapPin size={13} className={isCurrent ? 'text-white' : 'text-sky-400'} />
                      <span>{lang === 'uz' ? city.nameUz : city.nameRu}</span>
                      <span className="opacity-80">
                        {formatTemp(city.baseTempC, tempUnit)}°{tempUnit}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className="shrink-0 text-xs font-semibold text-sky-300 hover:underline"
              >
                {t.home.manageFavorites} →
              </button>
            </div>

            {/* Hero Grid: Current Location Weather Hero (Left 7 cols) + Highlights & Sun Trajectory (Right 5 cols) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Hero Weather Card */}
              <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 lg:col-span-7 ${cardSurfaceClass}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300">
                        <MapPin size={13} />
                        {lang === 'uz' ? selectedWeather.countryUz : selectedWeather.countryRu}
                      </span>
                      <span className="text-xs opacity-70">
                        {t.status.lastUpdated}: {selectedWeather.lastUpdated}
                      </span>
                    </div>

                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                      {lang === 'uz' ? selectedWeather.nameUz : selectedWeather.nameRu}
                    </h1>
                    <p className="mt-1 text-xs font-mono opacity-70">
                      {t.weather.coordinates}: {selectedWeather.lat.toFixed(3)}°N, {selectedWeather.lon.toFixed(3)}°E
                    </p>
                  </div>

                  {/* Favorite Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(selectedWeather.locationId)}
                    className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition ${
                      favoriteIds.includes(selectedWeather.locationId)
                        ? 'border-amber-400/50 bg-amber-400/20 text-amber-300'
                        : 'border-white/15 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Star
                      size={15}
                      className={favoriteIds.includes(selectedWeather.locationId) ? 'fill-amber-300 text-amber-300' : ''}
                    />
                    <span>
                      {favoriteIds.includes(selectedWeather.locationId)
                        ? t.home.inFavorites
                        : t.home.addToFavorites}
                    </span>
                  </button>
                </div>

                {/* Giant Temperature & Animated Condition */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="text-6xl font-black tracking-tighter sm:text-8xl">
                      <AnimatedNumber
                        value={formatTemp(selectedWeather.tempC, tempUnit)}
                        suffix={`°${tempUnit}`}
                        reducedMotion={reducedMotion}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold sm:text-xl">
                        {t.weather[selectedWeather.condition]}
                      </div>
                      <div className="text-sm opacity-80">
                        {t.weather.feelsLike}:{' '}
                        <span className="font-semibold">
                          {formatTemp(selectedWeather.feelsLikeC, tempUnit)}°{tempUnit}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-sky-300">
                        <span>
                          ↑ {t.weather.high}: {formatTemp(selectedWeather.tempMaxC, tempUnit)}°
                        </span>
                        <span>
                          ↓ {t.weather.low}: {formatTemp(selectedWeather.tempMinC, tempUnit)}°
                        </span>
                      </div>
                    </div>
                  </div>

                  <AnimatedWeatherIcon
                    condition={selectedWeather.condition}
                    isNight={selectedWeather.isNight}
                    size={96}
                    reducedMotion={reducedMotion}
                  />
                </div>

                {/* Prominent CTA to Open Interactive World Map */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
                      <Globe size={22} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t.home.mapPreviewTitle}</div>
                      <div className="text-xs opacity-75">{t.home.mapPreviewSubtitle}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('map')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-sky-500/30 transition hover:scale-[1.02]"
                  >
                    <Globe size={16} />
                    <span>{t.home.openWorldMap}</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>

              {/* Right Column: Key Atmospheric Metrics + Sunrise/Sunset Solar Arc */}
              <div className="flex flex-col justify-between gap-6 lg:col-span-5">
                <div className={`rounded-3xl border p-6 ${cardSurfaceClass}`}>
                  <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
                    {t.home.highlightsTitle}
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className={`rounded-2xl border p-3.5 ${subCardClass}`}>
                      <div className="flex items-center gap-1.5 text-xs opacity-75">
                        <Droplets size={14} className="text-sky-400" />
                        <span>{t.weather.humidity}</span>
                      </div>
                      <div className="mt-1.5 text-xl font-extrabold">{selectedWeather.humidity}%</div>
                      <div className="mt-0.5 text-[11px] opacity-70">
                        {t.weather.dewPoint}: {formatTemp(selectedWeather.dewPointC, tempUnit)}°
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-3.5 ${subCardClass}`}>
                      <div className="flex items-center gap-1.5 text-xs opacity-75">
                        <Wind size={14} className="text-emerald-400" />
                        <span>{t.weather.wind}</span>
                      </div>
                      <div className="mt-1.5 text-xl font-extrabold">
                        {formatWind(selectedWeather.windKmh, windUnit)}{' '}
                        <span className="text-xs font-normal">{windUnit === 'kmh' ? 'km/h' : 'm/s'}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] opacity-70">
                        {t.weather.windDir}: {getCompassLabel(selectedWeather.windDir, lang)}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-3.5 ${subCardClass}`}>
                      <div className="flex items-center gap-1.5 text-xs opacity-75">
                        <Gauge size={14} className="text-purple-400" />
                        <span>{t.weather.pressure}</span>
                      </div>
                      <div className="mt-1.5 text-xl font-extrabold">
                        {formatPressure(selectedWeather.pressureHpa, pressureUnit)}
                      </div>
                      <div className="mt-0.5 text-[11px] opacity-70">
                        {pressureUnit === 'hpa' ? 'hPa' : 'mmHg'}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-3.5 ${subCardClass}`}>
                      <div className="flex items-center gap-1.5 text-xs opacity-75">
                        <SunMedium size={14} className="text-amber-400" />
                        <span>{t.weather.uvIndex}</span>
                      </div>
                      <div className="mt-1.5 text-xl font-extrabold">{selectedWeather.uvIndex}</div>
                      <div className="mt-0.5 text-[11px] opacity-70">
                        {selectedWeather.uvIndex <= 2
                          ? t.uvLevels.low
                          : selectedWeather.uvIndex <= 5
                          ? t.uvLevels.moderate
                          : t.uvLevels.high}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-3.5 ${subCardClass}`}>
                      <div className="flex items-center gap-1.5 text-xs opacity-75">
                        <Eye size={14} className="text-cyan-400" />
                        <span>{t.weather.visibility}</span>
                      </div>
                      <div className="mt-1.5 text-xl font-extrabold">{selectedWeather.visibilityKm} km</div>
                      <div className="mt-0.5 text-[11px] opacity-70">
                        {t.weather.cloudCover}: {selectedWeather.cloudCover}%
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-3.5 ${subCardClass}`}>
                      <div className="flex items-center gap-1.5 text-xs opacity-75">
                        <ShieldCheck size={14} className="text-lime-400" />
                        <span>{t.weather.airQuality}</span>
                      </div>
                      <div className="mt-1.5 text-xl font-extrabold">AQI {selectedWeather.aqi}</div>
                      <div className="mt-0.5 text-[11px] opacity-70">{t.aqiLevels.good}</div>
                    </div>
                  </div>
                </div>

                {/* Sunrise & Sunset Trajectory Card */}
                <div className={`rounded-3xl border p-5 ${cardSurfaceClass}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                      {t.home.sunScheduleTitle}
                    </span>
                    <span className="text-xs text-amber-300 font-semibold">
                      {t.weather.daylight}: ~11s 00d
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <Sunrise size={24} className="text-amber-400" />
                      <div>
                        <div className="text-xs opacity-75">{t.weather.sunrise}</div>
                        <div className="text-lg font-bold">{selectedWeather.sunrise}</div>
                      </div>
                    </div>

                    <div className="h-10 flex-1">
                      <svg viewBox="0 0 200 50" className="h-full w-full">
                        <path
                          d="M 10 45 Q 100 -15 190 45"
                          fill="none"
                          stroke="rgba(251, 191, 36, 0.45)"
                          strokeWidth="2.5"
                          strokeDasharray="4 4"
                        />
                        <circle cx="115" cy="16" r="6" fill="#fbbf24" />
                      </svg>
                    </div>

                    <div className="flex items-center gap-2.5 text-right">
                      <div>
                        <div className="text-xs opacity-75">{t.weather.sunset}</div>
                        <div className="text-lg font-bold">{selectedWeather.sunset}</div>
                      </div>
                      <Sunset size={24} className="text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's 24-Hour Forecast Strip */}
            <div className={`rounded-3xl border p-6 ${cardSurfaceClass}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-sky-400" />
                  <h2 className="text-lg font-bold">{t.home.hourlyTitle}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('forecast')}
                  className="text-xs font-semibold text-sky-300 hover:underline"
                >
                  {t.home.viewFullForecast} →
                </button>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {selectedWeather.hourly.map((h, idx) => (
                  <div
                    key={`hr-${idx}`}
                    className={`flex min-w-[92px] flex-col items-center rounded-2xl border p-3 transition hover:-translate-y-0.5 ${subCardClass}`}
                  >
                    <span className="text-xs font-semibold opacity-80">
                      {idx === 0 ? t.today : h.time}
                    </span>
                    <div className="my-2.5">
                      <AnimatedWeatherIcon
                        condition={h.condition}
                        isNight={h.isNight}
                        size={34}
                        reducedMotion={reducedMotion}
                      />
                    </div>
                    <span className="text-base font-extrabold">
                      {formatTemp(h.tempC, tempUnit)}°
                    </span>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-sky-300">
                      <Umbrella size={11} />
                      <span>{h.pop}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Weather Forecast Section */}
            <div className={`rounded-3xl border p-6 ${cardSurfaceClass}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-sky-400" />
                  <h2 className="text-lg font-bold">{t.home.weeklyTitle}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('forecast')}
                  className="text-xs font-semibold text-sky-300 hover:underline"
                >
                  {t.home.viewFullForecast} →
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-7">
                {selectedWeather.daily.map((d, idx) => {
                  const dayLabel =
                    idx === 0
                      ? t.today
                      : idx === 1
                      ? t.tomorrow
                      : t.daysFull[d.dayIndex];
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDayIdx(idx);
                        setActiveTab('forecast');
                      }}
                      className={`flex flex-col items-center justify-between rounded-2xl border p-4 text-center transition hover:border-sky-400 ${subCardClass}`}
                    >
                      <div className="text-xs font-bold">{dayLabel}</div>
                      <div className="text-[11px] opacity-65">{d.dateStr.slice(5)}</div>
                      <div className="my-3">
                        <AnimatedWeatherIcon
                          condition={d.condition}
                          size={40}
                          reducedMotion={reducedMotion}
                        />
                      </div>
                      <div className="text-xs opacity-85 line-clamp-1">
                        {t.weather[d.condition]}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm font-extrabold">
                        <span>{formatTemp(d.tempMaxC, tempUnit)}°</span>
                        <span className="opacity-50">{formatTemp(d.tempMinC, tempUnit)}°</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-sky-300">
                        <Droplets size={11} />
                        <span>{d.pop}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: INTERACTIVE WORLD MAP                                     */}
        {/* ================================================================ */}
        {activeTab === 'map' && (
          <InteractiveWorldMapSection
            lang={lang}
            theme={theme}
            tempUnit={tempUnit}
            windUnit={windUnit}
            pressureUnit={pressureUnit}
            selectedWeather={selectedWeather}
            onSelectCity={handleSelectCity}
            onSelectCoordinates={handleSelectCoordinates}
            onOpenForecast={() => setActiveTab('forecast')}
            reducedMotion={reducedMotion}
          />
        )}

        {/* ================================================================ */}
        {/* TAB 3: DETAILED WEATHER FORECAST PAGE                            */}
        {/* ================================================================ */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {t.forecast.title} — {lang === 'uz' ? selectedWeather.nameUz : selectedWeather.nameRu}
                </h1>
                <p className="mt-1 text-sm opacity-80">{t.forecast.subtitle}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'temp', label: t.forecast.chartTempTab },
                    { id: 'precip', label: t.forecast.chartPrecipTab },
                    { id: 'wind', label: t.forecast.chartWindTab }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setForecastChartTab(tab.id)}
                    className={`rounded-2xl border px-3.5 py-2 text-xs font-semibold transition ${
                      forecastChartTab === tab.id
                        ? 'border-sky-400 bg-sky-500 text-white shadow'
                        : 'border-white/15 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Recharts Container */}
            <div className={`rounded-3xl border p-6 ${cardSurfaceClass}`}>
              <div className="relative h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {forecastChartTab === 'temp' ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.55} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} unit={`°${tempUnit}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.92)',
                          borderColor: 'rgba(56, 189, 248, 0.4)',
                          borderRadius: '14px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        name={`${t.weather.high}/${t.weather.low} (°${tempUnit})`}
                        stroke="#38bdf8"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#tempGrad)"
                      />
                      <Line
                        type="monotone"
                        dataKey="feelsLike"
                        name={`${t.weather.feelsLike} (°${tempUnit})`}
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  ) : forecastChartTab === 'precip' ? (
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.92)',
                          borderColor: 'rgba(56, 189, 248, 0.4)',
                          borderRadius: '14px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="pop"
                        name={`${t.forecast.precipProbLabel} (%)`}
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="rainMm"
                        name={`${t.forecast.rainAmountLabel} (mm)`}
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                      />
                    </ComposedChart>
                  ) : (
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.92)',
                          borderColor: 'rgba(56, 189, 248, 0.4)',
                          borderRadius: '14px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="wind"
                        name={`${t.weather.wind} (${windUnit === 'kmh' ? 'km/h' : 'm/s'})`}
                        stroke="#10b981"
                        fill="rgba(16, 185, 129, 0.25)"
                        strokeWidth={2.5}
                      />
                      <Line
                        type="monotone"
                        dataKey="humidity"
                        name={`${t.weather.humidity} (%)`}
                        stroke="#a855f7"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* 7-Day Selector & Detailed Day Breakdown */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className={`rounded-3xl border p-6 lg:col-span-7 ${cardSurfaceClass}`}>
                <h2 className="text-lg font-bold">{t.forecast.dailyCardsTitle}</h2>
                <div className="mt-4 space-y-2.5">
                  {selectedWeather.daily.map((d, idx) => {
                    const isSelected = idx === selectedDayIdx;
                    const dayName =
                      idx === 0
                        ? t.today
                        : idx === 1
                        ? t.tomorrow
                        : t.daysFull[d.dayIndex];
                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => setSelectedDayIdx(idx)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                          isSelected
                            ? 'border-sky-400 bg-sky-500/20 shadow-lg'
                            : `${subCardClass} hover:border-white/30`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <AnimatedWeatherIcon
                            condition={d.condition}
                            size={36}
                            reducedMotion={reducedMotion}
                          />
                          <div>
                            <div className="text-sm font-bold">{dayName}</div>
                            <div className="text-xs opacity-75">
                              {d.dateStr} • {t.weather[d.condition]}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs sm:text-sm">
                          <span className="inline-flex items-center gap-1 text-sky-300 font-semibold">
                            <Umbrella size={13} />
                            {d.pop}%
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1 opacity-80">
                            <Wind size={13} />
                            {formatWind(d.windMaxKmh, windUnit)} {windUnit === 'kmh' ? 'km/h' : 'm/s'}
                          </span>
                          <div className="font-extrabold">
                            <span>{formatTemp(d.tempMaxC, tempUnit)}°</span>
                            <span className="ml-2 opacity-60">{formatTemp(d.tempMinC, tempUnit)}°</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Deep Inspection Card */}
              {activeDay && (
                <div className={`flex flex-col justify-between rounded-3xl border p-6 lg:col-span-5 ${cardSurfaceClass}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300">
                        {activeDay.dateStr}
                      </span>
                      <span className="text-xs font-semibold opacity-75">
                        {t.daysFull[activeDay.dayIndex]}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold">{t.forecast.selectedDayDetails}</h3>

                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div>
                        <div className="text-3xl font-extrabold">
                          {formatTemp(activeDay.tempMaxC, tempUnit)}° / {formatTemp(activeDay.tempMinC, tempUnit)}°{tempUnit}
                        </div>
                        <div className="mt-1 text-sm opacity-85">{t.weather[activeDay.condition]}</div>
                      </div>
                      <AnimatedWeatherIcon
                        condition={activeDay.condition}
                        size={56}
                        reducedMotion={reducedMotion}
                      />
                    </div>

                    {/* Morning / Afternoon / Evening / Night Temperature Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {[
                        { label: t.forecast.morning, val: activeDay.morningTempC },
                        { label: t.forecast.afternoon, val: activeDay.dayTempC },
                        { label: t.forecast.evening, val: activeDay.eveningTempC },
                        { label: t.forecast.night, val: activeDay.nightTempC }
                      ].map((part) => (
                        <div
                          key={part.label}
                          className={`rounded-2xl border p-2.5 text-center ${subCardClass}`}
                        >
                          <div className="text-[11px] opacity-75">{part.label}</div>
                          <div className="mt-1 text-base font-extrabold">
                            {formatTemp(part.val, tempUnit)}°{tempUnit}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Rain, Snow, Wind & UV metrics for selected day */}
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className={`rounded-2xl border p-3 ${subCardClass}`}>
                        <div className="opacity-70">{t.weather.rainfall}</div>
                        <div className="mt-1 text-base font-bold text-sky-300">
                          {activeDay.rainMm} mm ({activeDay.pop}%)
                        </div>
                      </div>
                      <div className={`rounded-2xl border p-3 ${subCardClass}`}>
                        <div className="opacity-70">{t.weather.snowfall}</div>
                        <div className="mt-1 text-base font-bold text-cyan-200">
                          {activeDay.snowCm} sm
                        </div>
                      </div>
                      <div className={`rounded-2xl border p-3 ${subCardClass}`}>
                        <div className="opacity-70">{t.weather.wind}</div>
                        <div className="mt-1 text-base font-bold">
                          {formatWind(activeDay.windMaxKmh, windUnit)} {windUnit === 'kmh' ? 'km/h' : 'm/s'} (
                          {getCompassLabel(activeDay.windDir, lang)})
                        </div>
                      </div>
                      <div className={`rounded-2xl border p-3 ${subCardClass}`}>
                        <div className="opacity-70">{t.weather.uvIndex}</div>
                        <div className="mt-1 text-base font-bold text-amber-300">
                          UV {activeDay.uvIndex}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs opacity-80">
                    <span>
                      {t.weather.sunrise}: <strong>{activeDay.sunrise}</strong>
                    </span>
                    <span>
                      {t.weather.sunset}: <strong>{activeDay.sunset}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: WEATHER DETAILS & ATMOSPHERIC ANALYTICS                   */}
        {/* ================================================================ */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {t.details.title} — {lang === 'uz' ? selectedWeather.nameUz : selectedWeather.nameRu}
              </h1>
              <p className="mt-1 text-sm opacity-80">{t.details.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Wind Rose & Aerodynamics */}
              <div className={`rounded-3xl border p-6 ${cardSurfaceClass}`}>
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-emerald-400" />
                  <h2 className="text-base font-bold">{t.details.windRoseTitle}</h2>
                </div>

                <div className="my-6 flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-slate-900/60">
                    <span className="absolute top-2 text-xs font-bold text-sky-300">{t.compass[0]}</span>
                    <span className="absolute right-2 text-xs font-bold opacity-70">{t.compass[2]}</span>
                    <span className="absolute bottom-2 text-xs font-bold opacity-70">{t.compass[4]}</span>
                    <span className="absolute left-2 text-xs font-bold opacity-70">{t.compass[6]}</span>

                    <div
                      className="flex h-24 w-24 items-center justify-center transition-transform duration-500"
                      style={{ transform: `rotate(${selectedWeather.windDir}deg)` }}
                    >
                      <Navigation size={38} className="text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="opacity-75">{t.weather.wind}:</span>
                    <span className="font-bold">
                      {formatWind(selectedWeather.windKmh, windUnit)} {windUnit === 'kmh' ? 'km/h' : 'm/s'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">{t.weather.windGust}:</span>
                    <span className="font-bold">
                      {formatWind(selectedWeather.windGustKmh, windUnit)} {windUnit === 'kmh' ? 'km/h' : 'm/s'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">{t.weather.windDir}:</span>
                    <span className="font-bold">
                      {selectedWeather.windDir}° ({getCompassLabel(selectedWeather.windDir, lang)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Barometric Pressure & Comfort Advisor */}
              <div className={`rounded-3xl border p-6 ${cardSurfaceClass}`}>
                <div className="flex items-center gap-2">
                  <Gauge size={18} className="text-purple-400" />
                  <h2 className="text-base font-bold">{t.details.barometerTitle}</h2>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
                  <div className="text-4xl font-extrabold text-purple-300">
                    {formatPressure(selectedWeather.pressureHpa, pressureUnit)}{' '}
                    <span className="text-base font-normal">
                      {pressureUnit === 'hpa' ? 'hPa' : 'mmHg'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs opacity-80">
                    {selectedWeather.pressureHpa > 1018
                      ? t.details.barometerHigh
                      : selectedWeather.pressureHpa < 1009
                      ? t.details.barometerLow
                      : t.details.barometerNormal}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-bold">{t.details.comfortTitle}</h3>
                  <div className={`mt-2 rounded-2xl border p-3.5 text-xs leading-relaxed ${subCardClass}`}>
                    <p>
                      {selectedWeather.tempC < 12
                        ? t.details.comfortCold
                        : selectedWeather.tempC > 26
                        ? t.details.comfortHot
                        : t.details.comfortMild}
                    </p>
                    {(selectedWeather.condition === 'rain' ||
                      selectedWeather.condition === 'heavy_rain' ||
                      selectedWeather.condition === 'thunderstorm') && (
                      <p className="mt-2 font-semibold text-sky-300">{t.details.comfortRain}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Outdoor Activity & Sector Indices */}
              <div className={`rounded-3xl border p-6 ${cardSurfaceClass}`}>
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-sky-400" />
                  <h2 className="text-base font-bold">{t.details.outdoorTitle}</h2>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      label: t.details.runningIndex,
                      ok: selectedWeather.condition === 'clear' || selectedWeather.condition === 'partly_cloudy'
                    },
                    {
                      label: t.details.drivingIndex,
                      ok: selectedWeather.visibilityKm >= 7 && selectedWeather.condition !== 'snow'
                    },
                    {
                      label: t.details.aviationIndex,
                      ok: selectedWeather.windKmh < 24 && selectedWeather.condition !== 'thunderstorm'
                    },
                    {
                      label: t.details.agricultureIndex,
                      ok: selectedWeather.tempC > 8 && selectedWeather.tempC < 34
                    }
                  ].map((idxItem) => (
                    <div
                      key={idxItem.label}
                      className={`flex items-center justify-between rounded-2xl border p-3.5 text-xs ${subCardClass}`}
                    >
                      <span className="font-semibold">{idxItem.label}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 font-bold ${
                          idxItem.ok
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {idxItem.ok ? t.details.statusOptimal : t.details.statusCaution}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: FAVORITE CITIES MANAGER                                   */}
        {/* ================================================================ */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{t.favorites.title}</h1>
                <p className="mt-1 text-sm opacity-80">{t.favorites.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFavoritesSort('temp')}
                  className={`rounded-2xl border px-3.5 py-2 text-xs font-semibold ${
                    favoritesSort === 'temp'
                      ? 'border-sky-400 bg-sky-500 text-white'
                      : 'border-white/15 bg-white/10'
                  }`}
                >
                  {t.favorites.sortByTemp}
                </button>
                <button
                  type="button"
                  onClick={() => setFavoritesSort('name')}
                  className={`rounded-2xl border px-3.5 py-2 text-xs font-semibold ${
                    favoritesSort === 'name'
                      ? 'border-sky-400 bg-sky-500 text-white'
                      : 'border-white/15 bg-white/10'
                  }`}
                >
                  {t.favorites.sortByName}
                </button>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WORLD_CITIES.filter((c) => favoriteIds.includes(c.id))
                .sort((a, b) =>
                  favoritesSort === 'temp'
                    ? b.baseTempC - a.baseTempC
                    : (lang === 'uz' ? a.nameUz : a.nameRu).localeCompare(
                        lang === 'uz' ? b.nameUz : b.nameRu
                      )
                )
                .map((city) => (
                  <div
                    key={`fav-card-${city.id}`}
                    className={`flex flex-col justify-between rounded-3xl border p-6 transition hover:-translate-y-1 ${cardSurfaceClass}`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {lang === 'uz' ? city.nameUz : city.nameRu}
                          </h3>
                          <p className="text-xs opacity-75">
                            {lang === 'uz' ? city.countryUz : city.countryRu}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(city.id)}
                          title={t.favorites.removeBtn}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="text-4xl font-extrabold">
                          {formatTemp(city.baseTempC, tempUnit)}°{tempUnit}
                        </div>
                        <AnimatedWeatherIcon
                          condition={city.condition}
                          size={52}
                          reducedMotion={reducedMotion}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs opacity-80">
                        <span>{t.weather[city.condition]}</span>
                        <span>• {t.weather.humidity}: {city.baseHumidity}%</span>
                        <span>
                          • {formatWind(city.baseWindKmh, windUnit)} {windUnit === 'kmh' ? 'km/h' : 'm/s'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectCity(city);
                          setActiveTab('home');
                        }}
                        className="flex-1 rounded-2xl bg-sky-500 py-2.5 text-xs font-bold text-white shadow hover:bg-sky-400"
                      >
                        {t.favorites.selectCityBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectCity(city);
                          setActiveTab('map');
                        }}
                        className="rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-semibold hover:bg-white/20"
                      >
                        {t.favorites.viewOnMapBtn}
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Add More Cities to Favorites Directory */}
            <div className={`rounded-3xl border p-6 ${cardSurfaceClass}`}>
              <h2 className="text-base font-bold">{t.favorites.addCityTitle}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {WORLD_CITIES.filter((c) => !favoriteIds.includes(c.id)).map((city) => (
                  <button
                    key={`add-fav-${city.id}`}
                    type="button"
                    onClick={() => toggleFavorite(city.id)}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold transition hover:border-sky-400 hover:bg-sky-500/20"
                  >
                    <Plus size={14} className="text-sky-400" />
                    <span>{lang === 'uz' ? city.nameUz : city.nameRu}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 6: SETTINGS & API CONFIGURATION                              */}
        {/* ================================================================ */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{t.settings.title}</h1>
              <p className="mt-1 text-sm opacity-80">{t.settings.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Language & Units Card */}
              <div className={`space-y-6 rounded-3xl border p-6 ${cardSurfaceClass}`}>
                <div>
                  <h2 className="text-base font-bold">{t.settings.langSection}</h2>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLang('uz')}
                      className={`rounded-2xl border p-3.5 text-sm font-bold transition ${
                        lang === 'uz'
                          ? 'border-sky-400 bg-sky-500 text-white shadow-lg'
                          : `${subCardClass}`
                      }`}
                    >
                      Oʻzbek tili (UZ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('ru')}
                      className={`rounded-2xl border p-3.5 text-sm font-bold transition ${
                        lang === 'ru'
                          ? 'border-sky-400 bg-sky-500 text-white shadow-lg'
                          : `${subCardClass}`
                      }`}
                    >
                      Русский язык (RU)
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-base font-bold">{t.settings.unitsSection}</h2>
                  <div className="mt-3 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span>{t.settings.tempUnitLabel}</span>
                      <div className="inline-flex rounded-xl border border-white/15 bg-black/30 p-1">
                        <button
                          type="button"
                          onClick={() => setTempUnit('C')}
                          className={`rounded-lg px-3 py-1 font-bold ${
                            tempUnit === 'C' ? 'bg-sky-500 text-white' : ''
                          }`}
                        >
                          Celsius (°C)
                        </button>
                        <button
                          type="button"
                          onClick={() => setTempUnit('F')}
                          className={`rounded-lg px-3 py-1 font-bold ${
                            tempUnit === 'F' ? 'bg-sky-500 text-white' : ''
                          }`}
                        >
                          Fahrenheit (°F)
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>{t.settings.windUnitLabel}</span>
                      <div className="inline-flex rounded-xl border border-white/15 bg-black/30 p-1">
                        <button
                          type="button"
                          onClick={() => setWindUnit('kmh')}
                          className={`rounded-lg px-3 py-1 font-bold ${
                            windUnit === 'kmh' ? 'bg-sky-500 text-white' : ''
                          }`}
                        >
                          km/h
                        </button>
                        <button
                          type="button"
                          onClick={() => setWindUnit('ms')}
                          className={`rounded-lg px-3 py-1 font-bold ${
                            windUnit === 'ms' ? 'bg-sky-500 text-white' : ''
                          }`}
                        >
                          m/s
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>{t.settings.pressureUnitLabel}</span>
                      <div className="inline-flex rounded-xl border border-white/15 bg-black/30 p-1">
                        <button
                          type="button"
                          onClick={() => setPressureUnit('hpa')}
                          className={`rounded-lg px-3 py-1 font-bold ${
                            pressureUnit === 'hpa' ? 'bg-sky-500 text-white' : ''
                          }`}
                        >
                          hPa
                        </button>
                        <button
                          type="button"
                          onClick={() => setPressureUnit('mmhg')}
                          className={`rounded-lg px-3 py-1 font-bold ${
                            pressureUnit === 'mmhg' ? 'bg-sky-500 text-white' : ''
                          }`}
                        >
                          mmHg
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appearance, Accessibility & Live API Configuration */}
              <div className={`space-y-6 rounded-3xl border p-6 ${cardSurfaceClass}`}>
                <div>
                  <h2 className="text-base font-bold">{t.settings.appearanceSection}</h2>
                  <div className="mt-3 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span>{t.settings.themeLabel}</span>
                      <button
                        type="button"
                        onClick={() => setTheme((th) => (th === 'dark' ? 'light' : 'dark'))}
                        className="rounded-xl bg-sky-500 px-3.5 py-1.5 font-bold text-white"
                      >
                        {theme === 'dark' ? t.settings.themeDark : t.settings.themeLight}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>{t.settings.particlesLabel}</span>
                      <button
                        type="button"
                        onClick={() => setParticlesEnabled((p) => !p)}
                        className={`rounded-xl px-3.5 py-1.5 font-bold ${
                          particlesEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {particlesEnabled ? t.settings.enabled : t.settings.disabled}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>{t.settings.reducedMotionLabel}</span>
                      <button
                        type="button"
                        onClick={() => setReducedMotion((r) => !r)}
                        className={`rounded-xl px-3.5 py-1.5 font-bold ${
                          reducedMotion ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {reducedMotion ? t.settings.enabled : t.settings.disabled}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Weather API Provider Configuration */}
                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2">
                    <KeyRound size={17} className="text-sky-400" />
                    <h2 className="text-base font-bold">{t.settings.apiSection}</h2>
                  </div>

                  <div className="mt-3 space-y-3 text-xs">
                    <div>
                      <label className="block opacity-80">{t.settings.apiProviderLabel}</label>
                      <div className="mt-1.5 grid grid-cols-2 gap-2">
                        {(
                          [
                            { id: 'openmeteo', label: 'Open-Meteo (Live Free)' },
                            { id: 'openweathermap', label: 'OpenWeatherMap API' },
                            { id: 'weatherapi', label: 'WeatherAPI.com' },
                            { id: 'demo', label: 'Demo Mode (Offline)' }
                          ] as const
                        ).map((prov) => (
                          <button
                            key={prov.id}
                            type="button"
                            onClick={() => setApiProvider(prov.id)}
                            className={`rounded-xl border px-3 py-2 font-semibold ${
                              apiProvider === prov.id
                                ? 'border-sky-400 bg-sky-500/30 text-white'
                                : `${subCardClass}`
                            }`}
                          >
                            {prov.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(apiProvider === 'openweathermap' || apiProvider === 'weatherapi') && (
                      <div>
                        <label className="block opacity-80">{t.settings.apiKeyLabel}</label>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={t.settings.apiKeyPlaceholder}
                          className="mt-1.5 w-full rounded-xl border border-white/15 bg-slate-900/80 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        loadWeatherForTarget({
                          id: selectedWeather.locationId,
                          nameUz: selectedWeather.nameUz,
                          nameRu: selectedWeather.nameRu,
                          countryUz: selectedWeather.countryUz,
                          countryRu: selectedWeather.countryRu,
                          lat: selectedWeather.lat,
                          lon: selectedWeather.lon
                        });
                        showToast(t.status.refreshedToast);
                      }}
                      className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg"
                    >
                      {t.settings.saveApiBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 7: ABOUT SECTION                                             */}
        {/* ================================================================ */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className={`rounded-3xl border p-8 ${cardSurfaceClass}`}>
              <h1 className="text-2xl font-extrabold sm:text-3xl">{t.about.title}</h1>
              <p className="mt-2 max-w-3xl text-sm opacity-85">{t.about.subtitle}</p>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className={`rounded-2xl border p-5 ${subCardClass}`}>
                  <Globe size={26} className="text-sky-400" />
                  <h3 className="mt-3 text-base font-bold">{t.about.feature1Title}</h3>
                  <p className="mt-2 text-xs leading-relaxed opacity-80">{t.about.feature1Desc}</p>
                </div>

                <div className={`rounded-2xl border p-5 ${subCardClass}`}>
                  <Sliders size={26} className="text-emerald-400" />
                  <h3 className="mt-3 text-base font-bold">{t.about.feature2Title}</h3>
                  <p className="mt-2 text-xs leading-relaxed opacity-80">{t.about.feature2Desc}</p>
                </div>

                <div className={`rounded-2xl border p-5 ${subCardClass}`}>
                  <Sparkles size={26} className="text-amber-400" />
                  <h3 className="mt-3 text-base font-bold">{t.about.feature3Title}</h3>
                  <p className="mt-2 text-xs leading-relaxed opacity-80">{t.about.feature3Desc}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-75">
                  {t.about.techStackTitle}
                </h4>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  {[
                    'React 18 + TypeScript',
                    'Tailwind CSS Glassmorphism',
                    'Leaflet 1.9 + OpenStreetMap',
                    'Open-Meteo / OpenWeatherMap / WeatherAPI',
                    'Recharts Interactive Analytics',
                    'HTML5 Canvas Particle Physics',
                    'Oʻzbek (UZ) & Русский (RU) i18n'
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-xl border border-sky-400/30 bg-sky-500/15 px-3 py-1.5 text-sky-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
