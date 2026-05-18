import { 
  Package, Users, TrendingUp, Heart, 
  BookOpen, Award, Globe, 
  Stethoscope, Shield, Activity,
  Briefcase, DollarSign,
  Home, ShieldCheck
} from "lucide-react";

export const initiativesData = {
  // Food Support
  "emergency-food-relief": {
    iconName: "Package",
    title: "Emergency Food Relief",
    description: "Immediate assistance for families facing crisis situations with nutritious food packages.",
    longDescription: "Our Emergency Food Relief initiative is a rapid-response program designed to support families and individuals who find themselves in sudden crisis due to natural disasters, economic hardship, or displacement. We deploy specialized teams to deliver comprehensive, nutritionally balanced food packages that can sustain a family of four for up to a month. By partnering with local distributors, we ensure that aid reaches the most vulnerable without delay, providing a critical lifeline when it is needed most.",
    color: "#f97316",
    category: "Food Support"
  },
  "community-feeding-programs": {
    iconName: "Users",
    title: "Community Feeding Programs",
    description: "Hot meals served daily at community centers to ensure no one goes hungry.",
    longDescription: "The Community Feeding Program operates safe, welcoming centers where anyone in need can receive a hot, nutritious meal daily. Beyond just providing food, these centers act as community hubs where social workers can connect with vulnerable individuals to offer further assistance, counseling, and resources. Our goal is to eradicate hunger at the local level while fostering a sense of community and belonging.",
    color: "#3b82f6",
    category: "Food Support"
  },
  "sustainable-agriculture": {
    iconName: "TrendingUp",
    title: "Sustainable Agriculture",
    description: "Training and resources to help communities grow their own food sustainably.",
    longDescription: "We believe that long-term food security lies in empowering communities to produce their own food. Our Sustainable Agriculture program provides rural farmers with drought-resistant seeds, modern farming equipment, and extensive training in sustainable, climate-smart agricultural practices. By shifting the focus from aid to empowerment, we help entire regions become self-sufficient and economically stable.",
    color: "#10b981",
    category: "Food Support"
  },
  "child-nutrition-initiative": {
    iconName: "Heart",
    title: "Child Nutrition Initiative",
    description: "Special programs ensuring children receive balanced, nutritious meals for healthy development.",
    longDescription: "Proper nutrition during early childhood is critical for cognitive and physical development. The Child Nutrition Initiative partners with local schools and clinics to provide fortified meals and nutritional supplements to children under the age of five and school-aged youth. We also conduct workshops for parents on how to prepare balanced meals using affordable, locally sourced ingredients.",
    color: "#8b5cf6",
    category: "Food Support"
  },

  // Education
  "primary-education-access": {
    iconName: "BookOpen",
    title: "Primary Education Access",
    description: "Ensuring every child has access to quality primary education with proper resources and infrastructure.",
    longDescription: "Education is the foundation of a prosperous society. Our Primary Education Access program removes the barriers that keep children out of school. We construct and renovate classrooms, provide free textbooks, and ensure that children have safe environments in which to learn. We work closely with local governments to ensure sustainable, long-term impact in the communities we serve.",
    guidelines: [
      "Must be a child between the ages of 5 and 12 years old.",
      "Must reside in a recognized underserved or marginalized community.",
      "Parents or guardians must attend an orientation session.",
      "A birth certificate or community leader verification is required for enrollment.",
      "Commitment to maintain at least an 85% attendance rate throughout the academic year."
    ],
    color: "#3b82f6",
    category: "Education"
  },
  "scholarship-programs": {
    iconName: "Award",
    title: "Scholarship Programs",
    description: "Financial support for deserving students to pursue secondary and higher education.",
    longDescription: "Bright, motivated students often face insurmountable financial barriers when trying to advance beyond primary school. Our Scholarship Programs provide full or partial funding for tuition, uniforms, and boarding fees for exceptionally talented but economically disadvantaged students. We invest in the future leaders of the community by giving them the opportunity to realize their full potential.",
    guidelines: [
      "Applicants must have completed primary education with outstanding academic records.",
      "Must demonstrate verifiable financial need (household income below the established threshold).",
      "Must pass our standardized entrance examination and interview process.",
      "Requires two letters of recommendation from former teachers or community leaders.",
      "Scholars must maintain a minimum GPA of 3.0 (or equivalent) to retain funding."
    ],
    color: "#10b981",
    category: "Education"
  },
  "teacher-training": {
    iconName: "Users",
    title: "Teacher Training",
    description: "Empowering educators with modern teaching methods and continuous professional development.",
    longDescription: "A school is only as good as its teachers. We provide comprehensive training programs designed to equip educators with modern, inclusive, and effective teaching methodologies. Our workshops cover child psychology, digital integration in the classroom, and advanced pedagogical strategies, ensuring that teachers are well-prepared to inspire and educate the next generation.",
    guidelines: [
      "Must be currently employed as a teacher in a recognized local school.",
      "Commitment to complete the full 6-week intensive training program.",
      "Willingness to act as a peer mentor for other educators in the community upon graduation.",
      "Requires endorsement from the school principal or educational board."
    ],
    color: "#8b5cf6",
    category: "Education"
  },
  "digital-literacy": {
    iconName: "Globe",
    title: "Digital Literacy",
    description: "Equipping students with essential technology skills for the digital age.",
    longDescription: "In an increasingly connected world, digital literacy is no longer a luxury but a necessity. We build and equip state-of-the-art computer labs in underserved schools and community centers. Our curriculum teaches basic computer navigation, internet safety, word processing, and introductory coding, ensuring that youths are prepared for the modern workforce.",
    guidelines: [
      "Open to youths aged 13 to 21 years old.",
      "No prior computer experience is necessary.",
      "Must enroll in the full 3-month certification course.",
      "Students must commit to 4 hours of lab practice per week."
    ],
    color: "#f97316",
    category: "Education"
  },

  // Healthcare
  "primary-healthcare": {
    iconName: "Stethoscope",
    title: "Primary Healthcare",
    description: "Comprehensive medical consultations, diagnosis, and treatment for common illnesses.",
    longDescription: "Our Primary Healthcare initiative establishes and supports community health clinics in remote areas where medical access is virtually non-existent. Staffed by dedicated doctors and nurses, these clinics offer essential diagnostics, treatment for common diseases like malaria and respiratory infections, and minor surgical procedures. We are committed to making quality healthcare a universal reality.",
    color: "#10b981",
    category: "Healthcare"
  },
  "preventive-care": {
    iconName: "Shield",
    title: "Preventive Care",
    description: "Vaccinations, health screenings, and education programs to prevent disease.",
    longDescription: "Prevention is the most effective form of medicine. We conduct regular health camps offering free immunizations, blood pressure and diabetes screenings, and health awareness seminars. By catching potential health issues early and educating the public on hygiene and sanitation, we significantly reduce the burden of preventable diseases in the community.",
    color: "#3b82f6",
    category: "Healthcare"
  },
  "maternal-child-health": {
    iconName: "Activity",
    title: "Maternal & Child Health",
    description: "Prenatal care, safe deliveries, and pediatric services for mothers and children.",
    longDescription: "Protecting the lives of mothers and their newborns is a core priority. We provide comprehensive maternal care, including regular prenatal checkups, vitamin supplementation, and access to skilled birth attendants during delivery. Postnatal care ensures that both mother and child remain healthy during the critical first year of life.",
    color: "#8b5cf6",
    category: "Healthcare"
  },
  "mental-health-support": {
    iconName: "Heart",
    title: "Mental Health Support",
    description: "Counseling and psychological support services for emotional wellbeing.",
    longDescription: "Mental health is just as important as physical health, yet it is often stigmatized or ignored. Our mental health professionals offer individual counseling, trauma recovery therapies, and community support groups. We work to break the stigma surrounding mental illness and provide a safe space for healing and emotional resilience.",
    color: "#f97316",
    category: "Healthcare"
  },

  // Economic
  "skills-training": {
    iconName: "Briefcase",
    title: "Skills Training",
    description: "Vocational training in trades like tailoring, carpentry, agriculture, and technology.",
    longDescription: "Our Skills Training centers offer intensive vocational courses designed to match the demands of the local economy. Whether it's advanced tailoring, carpentry, masonry, or basic IT skills, we equip adults and youths with the practical expertise needed to secure stable employment or start their own small enterprises. Graduates receive a starter kit to help them launch their careers immediately.",
    color: "#8b5cf6",
    category: "Economic Empowerment"
  },
  "microfinance-support": {
    iconName: "DollarSign",
    title: "Microfinance Support",
    description: "Small loans and financial literacy training to help entrepreneurs start businesses.",
    longDescription: "We provide interest-free or low-interest microloans to aspiring entrepreneurs who lack access to traditional banking services. Coupled with mandatory financial literacy and business management training, our microfinance program ensures that loan recipients have the knowledge and capital needed to build profitable, sustainable businesses that uplift their families.",
    color: "#10b981",
    category: "Economic Empowerment"
  },
  "business-development": {
    iconName: "Users",
    title: "Business Development",
    description: "Mentorship and guidance for small business owners to scale their operations.",
    longDescription: "For businesses that have already launched but are struggling to grow, our Business Development initiative steps in. We pair small business owners with experienced industry mentors who provide strategic advice on marketing, supply chain management, and expansion. This initiative focuses on turning micro-enterprises into robust businesses that can hire locally and stimulate the regional economy.",
    color: "#3b82f6",
    category: "Economic Empowerment"
  },
  "market-linkages": {
    iconName: "TrendingUp",
    title: "Market Linkages",
    description: "Connecting producers with markets and buyers for sustainable income growth.",
    longDescription: "A great product is only profitable if it can reach the right buyers. We help rural artisans, farmers, and manufacturers overcome geographical and logistical barriers by connecting them directly with urban markets, ethical buyers, and international fair-trade organizations. By eliminating predatory middlemen, producers receive a fair price for their hard work.",
    color: "#f97316",
    category: "Economic Empowerment"
  },

  // Helping Families
  "emergency-shelter-support": {
    iconName: "Home",
    title: "Emergency Shelter Support",
    description: "Providing temporary housing, rent assistance, and connecting displaced families with safe shelter solutions.",
    longDescription: "When disaster strikes or eviction looms, families need immediate a safe place to sleep. Our Emergency Shelter Support provides short-term housing solutions, emergency rent assistance, and structural repairs for damaged homes. We work closely with local authorities to transition these families into permanent, secure housing as quickly as possible.",
    color: "#e11d48",
    category: "Family Welfare"
  },
  "basic-needs-provision": {
    iconName: "Heart",
    title: "Basic Needs Provision",
    description: "Distributing essential supplies—clothing, hygiene products, bedding, and household items—to families in crisis.",
    longDescription: "Living in crisis often means lacking the most basic human necessities. We distribute carefully assembled care packages containing winter clothing, sanitary products, clean bedding, and essential household items. By addressing these immediate material needs, we restore dignity to families and allow them to focus their energy on rebuilding their lives.",
    color: "#3b82f6",
    category: "Family Welfare"
  },
  "family-counseling-support": {
    iconName: "Users",
    title: "Family Counseling & Support",
    description: "Professional counseling, parenting workshops, and emotional support groups to strengthen family bonds.",
    longDescription: "Strong families are the bedrock of strong communities. Our professional social workers and counselors offer mediation, parenting workshops, and support groups designed to resolve domestic conflicts, address trauma, and foster healthy relationships. We provide a safe, confidential environment for families to heal and grow together.",
    color: "#10b981",
    category: "Family Welfare"
  },
  "child-welfare-programs": {
    iconName: "ShieldCheck",
    title: "Child Welfare Programs",
    description: "School enrollment assistance, after-school care, nutritional support, and protection services for vulnerable children.",
    longDescription: "Protecting the most vulnerable among us is our highest calling. Our Child Welfare Programs intervene in cases of neglect, abuse, or extreme poverty. We provide safe after-school care, ensure proper legal documentation and school enrollment, and run child protection advocacy campaigns. We stand as dedicated advocates for every child's right to safety, love, and opportunity.",
    color: "#f97316",
    category: "Family Welfare"
  }
};
