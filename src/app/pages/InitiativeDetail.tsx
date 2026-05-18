import { useParams, Navigate, Link } from "react-router";
import { 
  ArrowLeft, Heart, ChevronRight, CheckCircle2,
  Package, Users, TrendingUp, BookOpen, Award, Globe, 
  Stethoscope, Shield, Activity, Briefcase, DollarSign,
  Home as HomeIcon, ShieldCheck,
  ListChecks
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { initiativesData } from "../../data/initiatives";
import "../../styles/programs.css";

const iconMap: Record<string, any> = {
  Package, Users, TrendingUp, Heart, 
  BookOpen, Award, Globe, 
  Stethoscope, Shield, Activity,
  Briefcase, DollarSign,
  Home: HomeIcon, ShieldCheck
};

export default function InitiativeDetail() {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !initiativesData[id as keyof typeof initiativesData]) {
    return <Navigate to="/" replace />;
  }

  const initiative = initiativesData[id as keyof typeof initiativesData];
  const Icon = iconMap[initiative.iconName];
  // We check if guidelines exist in this specific initiative
  const hasGuidelines = 'guidelines' in initiative && initiative.guidelines && initiative.guidelines.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <section className="prog-hero" style={{ minHeight: '50vh', position: 'relative' }}>
        <div className="absolute top-24 left-4 md:left-12 z-50">
          <Link to={-1 as any} className="inline-flex items-center px-4 py-2 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Programs
          </Link>
        </div>

        <div className="prog-hero-bg">
          <ImageWithFallback
            src={`https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`}
            alt={initiative.title}
            className="w-full h-full object-cover"
          />
          <div className="prog-hero-overlay" />
        </div>
        
        <div className="prog-orb prog-orb-1" style={{ background: `${initiative.color}25` }} />
        <div className="prog-orb prog-orb-2" style={{ background: `${initiative.color}15` }} />
        
        <div className="prog-hero-content" style={{ marginTop: '2rem' }}>
          <div className="prog-badge">
            <div className="prog-badge-dot" style={{ background: initiative.color }} />
            {initiative.category}
          </div>
          
          <h1 className="prog-hero-title">{initiative.title}</h1>
          <p className="prog-hero-subtitle max-w-3xl">
            {initiative.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            
            {/* Main Details */}
            <div className="lg:col-span-2 p-8 lg:p-12">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 rounded-xl" style={{ background: `${initiative.color}15`, color: initiative.color }}>
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">About the Initiative</h2>
              </div>
              
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p className="lead text-xl text-gray-800 font-medium mb-6">
                  {initiative.description}
                </p>
                <p className="leading-relaxed">
                  {initiative.longDescription}
                </p>
                
                {hasGuidelines && (
                  <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <ListChecks className="w-6 h-6" style={{ color: initiative.color }} />
                      <h3 className="text-xl font-bold text-gray-900 m-0">Eligibility & Guidelines</h3>
                    </div>
                    <ul className="space-y-4 m-0 p-0 list-none">
                      {initiative.guidelines?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <div className="flex-shrink-0 mt-1.5 mr-3">
                            <div className="w-2 h-2 rounded-full" style={{ background: initiative.color }} />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 mt-10 mb-6">Key Focus Areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Community outreach and engagement",
                    "Sustainable resource allocation",
                    "Capacity building and training",
                    "Continuous monitoring and evaluation"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle2 className="w-5 h-5" style={{ color: initiative.color }} />
                      </div>
                      <p className="ml-3 text-gray-700 m-0">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="p-8 lg:p-12 bg-gray-50 flex flex-col justify-center">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: `${initiative.color}15`, color: initiative.color }}>
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Support This Cause</h3>
                <p className="text-gray-600 mb-8">
                  Your contribution directly funds the {initiative.title} initiative, helping us reach more people in need.
                </p>
                
                <div className="space-y-4">
                  <Link 
                    to="/donate" 
                    className="flex items-center justify-center w-full px-6 py-4 rounded-xl text-white font-medium transition-transform hover:scale-[1.02]"
                    style={{ background: initiative.color }}
                  >
                    Donate Now
                  </Link>
                  <Link 
                    to="/volunteer" 
                    className="flex items-center justify-center w-full px-6 py-4 rounded-xl bg-white border-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    style={{ borderColor: `${initiative.color}30` }}
                  >
                    Volunteer With Us
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
