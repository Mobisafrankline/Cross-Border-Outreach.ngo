import { Heart, ArrowRight, CheckCircle2, Quote, Calendar } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Slider from "react-slick";
import { newsUpdates, galleryImages } from "../../data/content";
import { useTranslation } from "react-i18next";
import "../../styles/carousel.css";

export default function Home() {
  const { t } = useTranslation();

  const programs = [
    {
      title: t("programs.foodSupport"),
      description: t("programs.foodDesc"),
      image:
        "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      link: "/food-support",
    },
    {
      title: t("programs.education"),
      description: t("programs.educationDesc"),
      image:
        "https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      link: "/education",
    },
    {
      title: t("programs.healthcare"),
      description: t("programs.healthcareDesc"),
      image:
        "https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      link: "/healthcare",
    },
    {
      title: t("programs.economic"),
      description: t("programs.economicDesc"),
      image:
        "https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      link: "/economic",
    },
  ];

  const testimonials = [
    {
      quote:
        "Crossborders Outreach Ministry transformed our community. My children now have access to quality education and proper nutrition.",
      author: "Maria Santos",
      role: "Community Member",
    },
    {
      quote:
        "The healthcare outreach program saved my mother's life. We are forever grateful for their dedication and compassion.",
      author: "James Okonkwo",
      role: "Beneficiary Family",
    },
    {
      quote:
        "Through their economic empowerment program, I started my own business and now support my entire family.",
      author: "Fatima Ahmed",
      role: "Small Business Owner",
    },
  ];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // default for desktop
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // tablets
        settings: { 
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // large mobile
        settings: { 
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // small mobile
        settings: { 
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const latestNews = newsUpdates.slice(0, 3);

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-[520px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1764738130382-cc7a8eaf26c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Volunteers helping community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            {t("home.heroTitle")}
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-95">
            {t("home.heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href="/donate"
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              {t("nav.donateNow")}
            </a>

            <a
              href="/volunteer"
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-white flex items-center justify-center gap-2"
            >
              {t("home.getInvolved")}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <Slider {...carouselSettings}>
            {galleryImages.map((image) => (
              <div key={image.id} className="px-2 sm:px-3">
                <div className="rounded-xl overflow-hidden shadow-lg h-56 sm:h-64 md:h-72 lg:h-80">
                  <ImageWithFallback
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We create sustainable change through four core programs designed to address
              the most critical needs in underserved communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>

                  <a
                    href={program.link}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    {t("programs.learnMore")}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.latestNews')}</h2>
              <p className="text-xl text-gray-600">
                Stay updated with our recent activities and announcements
              </p>
            </div>
            <a
              href="/news"
              className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              {t('home.viewAllNews')}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((newsItem) => (
              <article key={newsItem.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold mb-3">
                    {newsItem.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{newsItem.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{newsItem.excerpt}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{newsItem.date}</span>
                  </div>
                  
                  <Link
                    to={`/news/${newsItem.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors mt-auto"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <a
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('home.viewAllNews')}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Partner With Us</h2>
              <p className="text-lg text-gray-600 mb-8">
                At Crossborders Outreach Ministry, we believe in transparency, sustainability, 
                and community-driven solutions. Every dollar you contribute goes directly to 
                creating meaningful, lasting change.
              </p>
              
              <div className="space-y-4">
                {[
                  "100% transparency in fund allocation",
                  "Community-driven sustainable solutions",
                  "Experienced team with local partnerships",
                  "Regular impact reports and updates",
                  "Tax-deductible contributions"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <a
                  href="/mission"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Learn About Our Mission
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBub25wcm9maXR8ZW58MXx8fHwxNzcxOTI1NzQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Our team"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Stories of Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from the communities and individuals whose lives have been transformed 
              through our programs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md">
                <Quote className="w-10 h-10 text-blue-600 mb-4" />
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}