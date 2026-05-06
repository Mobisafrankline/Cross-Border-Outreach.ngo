//local images 
import news1 from "../assets/news1.jpeg";
import ImageSlide1 from "../assets/ImageSlide1.jpeg";
import ImageSlide2 from "../assets/ImageSlide2.jpeg";
import ImageSlide3 from "../assets/ImageSlide3.jpeg";
import ImageSlide4 from "../assets/ImageSlide4.jpeg";
import ImageSlide5 from "../assets/hero.jpeg";
import BeyondGrades from "../assets/BeyondGrades.jpg";
import NairobiFloods from "../assets/NairobiFloods.jpg";   


// Reports Data
export const reports = [
{
  id: 1,
  year: "2025",
  title: "COMPREHENSIVE ORGANIZATIONAL BUSINESS PLAN",
  type: "BUSINESS PLAN",
  category: "impact",
  size: "2.4 MB",
  pages: 39,
  date: "January 2026",
  pdfUrl: "https://docs.google.com/document/d/1zKwxqNCaWTWRgKs4IcLUf50NcdVLyjZw5NXpFzfqdLc/edit?usp=sharing",
  description: "A comprehensive strategic overview outlining Crossborders Outreach Ministry’s operational model, program priorities, resource allocation, and projected community impact within the organization’s development framework."
},
  {
  id: 2,
  year: "2026",
  title: "Murang'a Rescue Centre Outreach Report",
  type: "Outreach Report",
  category: "impact",
  size: "1.2 MB",
  pages: 12,
  date: "February 2026",
  pdfUrl: "https://docs.google.com/presentation/d/1Z_ESNZu53VQXQNeccFD69i1WKMpZnL3v/edit?usp=drive_link&ouid=106327234108443536152&rtpof=true&sd=true",
  description: "Humanitarian outreach report documenting Crossborder Outreach’s visit to Murang'a Rescue Centre on February 28, 2026, including educational support, psychosocial engagement activities, and the impact on vulnerable children."
},
{
  id: 3,
  year: "2025",
  title: "Crossborders Outreach Donor Pitch Deck",
  type: "Donor Report",
  category: "financial",
  size: "2.6 MB",
  pages: 12,
  date: "2025",
  pdfUrl: "https://docs.google.com/presentation/d/1G7qjuQGANn2X8j62BsRERwgs857DfYNY/edit?usp=drive_link&ouid=106327234108443536152&rtpof=true&sd=true",
  description: "Strategic overview of Crossborders Outreach Ministry’s mission, programs, impact goals, and partnership opportunities for donors and funding partners."
}
  // {
  //   id: 4,
  //   year: "2024",
  //   title: "Financial Report 2024",
  //   type: "Financial",
  //   category: "financial",
  //   size: "1.6 MB",
  //   pages: 30,
  //   date: "January 2025",
  //   pdfUrl: "/reports/financial-2024.pdf",
  //   description: "Financial transparency report for fiscal year 2024."
  // },
  // {
  //   id: 5,
  //   year: "2023",
  //   title: "Annual Impact Report 2023",
  //   type: "Impact",
  //   category: "impact",
  //   size: "2.1 MB",
  //   pages: 42,
  //   date: "January 2024",
  //   pdfUrl: "/reports/annual-impact-2023.pdf",
  //   description: "Comprehensive impact assessment for all programs in 2023."
  // },
  // {
  //   id: 6,
  //   year: "2023",
  //   title: "Financial Report 2023",
  //   type: "Financial",
  //   category: "financial",
  //   size: "1.5 MB",
  //   pages: 28,
  //   date: "January 2024",
  //   pdfUrl: "/reports/financial-2023.pdf",
  //   description: "Audited financial statements for fiscal year 2023."
  // }
];

// Publications Data
export const publications = [
  {
    id: 1,
    title: "Sustainable Food Security: A Community Approach",
    category: "Research Paper",
    date: "February 2026",
    pages: 45,
    size: "3.2 MB",
    pdfUrl: "/publications/sustainable-food-security.pdf",
    description: "Research on implementing sustainable food systems in underserved communities.",
    authors: ["Dr. Sarah Johnson", "David Kimani"],
    tags: ["Food Security", "Sustainability", "Community Development"]
  },
  {
    id: 2,
    title: "Impact of Education on Economic Development",
    category: "White Paper",
    date: "January 2026",
    pages: 32,
    size: "2.8 MB",
    pdfUrl: "/publications/education-economic-impact.pdf",
    description: "Analysis of how education programs contribute to economic empowerment.",
    authors: ["James Williams", "Dr. Maria Santos"],
    tags: ["Education", "Economic Development", "Impact Assessment"]
  },
  {
    id: 3,
    title: "Mobile Healthcare in Rural Communities",
    category: "Case Study",
    date: "December 2025",
    pages: 28,
    size: "2.5 MB",
    pdfUrl: "/publications/mobile-healthcare-case-study.pdf",
    description: "Case study on the effectiveness of mobile clinic programs in remote areas.",
    authors: ["Dr. Maria Santos", "Michael Chen"],
    tags: ["Healthcare", "Rural Development", "Mobile Clinics"]
  },
  {
    id: 4,
    title: "Women's Economic Empowerment Success Stories",
    category: "Report",
    date: "November 2025",
    pages: 38,
    size: "3.0 MB",
    pdfUrl: "/publications/women-empowerment-stories.pdf",
    description: "Collection of success stories from women who participated in our microfinance program.",
    authors: ["Fatima Hassan"],
    tags: ["Women Empowerment", "Microfinance", "Success Stories"]
  },
  {
    id: 5,
    title: "Best Practices in NGO Management",
    category: "Guide",
    date: "October 2025",
    pages: 52,
    size: "3.5 MB",
    pdfUrl: "/publications/ngo-best-practices.pdf",
    description: "Comprehensive guide on effective NGO operations and management.",
    authors: ["Dr. Sarah Johnson", "Michael Chen"],
    tags: ["NGO Management", "Best Practices", "Operations"]
  },
  {
    id: 6,
    title: "Community Partnership Framework",
    category: "Toolkit",
    date: "September 2025",
    pages: 41,
    size: "2.9 MB",
    pdfUrl: "/publications/partnership-framework.pdf",
    description: "Framework and tools for building effective community partnerships.",
    authors: ["Fatima Hassan", "David Okonkwo"],
    tags: ["Partnerships", "Community Engagement", "Framework"]
  }
];

// News/Updates Data
export const newsUpdates = [
  {
    id: 1,
    title: "Visit to Murang’a Rescue Centre: A Cross-Border Outreach of Love and Hope",
    excerpt: "On February 28, 2026, Crossborder Outreach crossed borders to support children at Murang’a Rescue Centre through learning materials, logistical support, and a message of hope.",
    date: "February 28, 2026",
    category: "Outreach",
    slug: "visit-to-muranga-rescue-centre-cross-border-outreach",
    image: news1,
    content: `
On 28th February 2026, the Cross-border Outreach team embarked on a meaningful journey to Murang’a Rescue Centre, driven by one mission — to share love, hope, and practical support with children in need. The visit represented more than a charitable activity; it was a powerful reminder that compassion knows no borders.

The outreach team crossed geographical boundaries to ensure that vulnerable children felt seen, valued, and supported. Through the donation of learning materials and provision of basic logistical support, the initiative aimed to strengthen both the educational environment and the emotional wellbeing of the children living at the centre.

Upon arrival, the team was welcomed with excitement and curiosity. What began as a simple visit quickly turned into moments of laughter, storytelling, and meaningful human connection. Children eagerly participated in activities, proudly receiving books, pens, and other learning supplies that will support their academic journeys.

Education remains one of the strongest tools for breaking cycles of vulnerability. By equipping the children with essential learning materials, the outreach sought to inspire confidence, encourage curiosity, and empower young minds to dream beyond their current circumstances. For many of the children, these resources symbolized opportunity — proof that their future matters.

Beyond the donations, the most impactful moments came through personal interaction. Volunteers spent time listening to the children’s stories, playing games, and offering encouragement. These shared experiences created a sense of belonging and reassurance that they are not forgotten.

Caregivers and administrators at Murang’a Rescue Centre expressed deep appreciation for the visit, noting that such engagements bring renewed hope not only to the children but also to those who dedicate their lives to caring for them. The presence of visitors who traveled across borders reinforced an important message: kindness can travel any distance.

This outreach reflects Crossborder Outreach’s continued commitment to building bridges between communities and uplifting lives through compassion-driven action. Every visit strengthens the belief that sustainable change begins with connection, empathy, and collective responsibility.

As the organization looks ahead, the mission remains clear — to continue reaching underserved communities, supporting education, and ensuring that every child grows up knowing they are loved, supported, and capable of achieving their dreams.

The visit to Murang’a Rescue Centre stands as a testament to what is possible when people come together with a shared purpose: creating hope where it is needed most.
    `,
  },
  {
    id: 2,
    title: "Nairobi Floods: A Call for Compassion and Community Action",
    excerpt: "Heavy rains caused severe flooding across Nairobi, highlighting the urgent need for support and resilience.",
    date: "March 6, 2026",
    category: "Disaster Response",
    slug: "nairobi-floods-compassion-community-action",
    image: NairobiFloods,
    content: `
Heavy rainfall that struck Nairobi on the evening of March 6, 2026 left a trail of destruction across the city. Flash floods submerged roads, swept vehicles away, and forced families to flee their homes in search of safety.

Several major roads were affected, including Uhuru Highway, Mombasa Road, Thika Superhighway, Jogoo Road, Lunga Lunga Road, Enterprise Road, and Lang’ata Road. Stranded passengers formed human chains to reach safety, while emergency responders including Kenya Red Cross and Kenya Defence Forces intervened.

Floodwaters entered houses and businesses across multiple estates including Pipeline, Embakasi, Mukuru Kwa Njenga, Reuben, Viwandani, Kibra, Mathare, Huruma, Baba Dogo, South B, South C, Nairobi West, Umoja, Ruai, Roysambu, Githurai, Kahawa West, and Westlands.

The flooding highlighted deeper structural problems: blocked drainage systems, clogged sewers, and poorly maintained infrastructure, leaving low-income communities particularly vulnerable while affluent areas experienced fewer disruptions.

Cross Borders Outreach Mission mobilized to provide relief, support affected families, raise awareness about disaster preparedness, and promote unity and resilience during the crisis. The organization emphasized that true outreach is not only about crossing borders, but also standing together when it matters most.

The Kenya Meteorological Department has warned that heavy rains may continue, emphasizing the need for preparedness and community cooperation.
    `,
    externalUrl: "https://crossbordersoutreach.medium.com/nairobi-floods-a-call-for-compassion-and-community-action-8eed618d8307",
    sourceName: "Medium"
  },
  {
    id: 3,
    title: "Beyond Grades: Why Mental Health Must Be Part of the Cross Border Outreach Mission",
    excerpt: "Supporting students’ mental health is as crucial as providing educational opportunities.",
    date: "March 5, 2026",
    category: "Mental Health",
    slug: "beyond-grades-mental-health-cross-border-outreach",
    image: BeyondGrades,
    content: `
University life can be overwhelming, especially for students pursuing demanding courses like medicine. Pressure to perform, fear of disappointing parents, loneliness, and constant comparison build silently, leading to stress, anxiety, or depression.

Mental health challenges do not discriminate. Many students suffer in silence, attending classes and submitting assignments while battling internal struggles alone.

Cross Border Outreach Mission recognizes that outreach must also address mental health. Through mentorship, counseling programs, youth support groups, and community awareness, the mission creates safe spaces where young people feel heard and supported.

Parents and communities are encouraged to check on emotional wellbeing, not just academic progress. Supporting students’ mental health can prevent crises, restore broken dreams, and build resilient communities where vulnerability is met with care.

Mental health matters. Let us speak before we shatter, check on our children beyond grades, and ensure every student has the support they need to thrive.
    `,
    externalUrl: "https://crossbordersoutreach.medium.com/beyond-grades-why-mental-health-must-be-part-of-the-cross-border-outreach-mission",
    sourceName: "Medium"
  },
  {
    id: 4,
    title: "Spring Festival · Festival de Primavera: A Celebration of Community and Compassion in Atlanta",
    excerpt: "Over 100 families received high-value household items during a large-scale community festival at Sienna Ridge Apartment Homes.",
    date: "April 14, 2026",
    category: "Community Outreach",
    slug: "spring-festival-atlanta-outreach",
    image: "https://images.unsplash.com/photo-1567965178128-abb8d8532ae7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNwcmluZyUyMGZlc3RpdmFsJTIwdXNhfGVufDB8fDB8fHww",
    content: `
On April 12, 2026, the Cross-Borders Outreach Ministry, in a powerful demonstration of unity and generosity, hosted the Spring Festival · Festival de Primavera at Sienna Ridge Apartment Homes in Atlanta, Georgia. This vibrant, bilingual event marked a major milestone in our mission to serve the Atlanta metropolitan area, bringing together diverse communities for a day of celebration, support, and profound connection.

In collaboration with Amazon, Operation Compassion, and over twelve other partner organizations, the festival successfully served more than 100 families. But this was more than just an event; it was a testament to what we can achieve when we unite across borders—whether they be linguistic, cultural, or geographic.

Attendees were blessed with significant, high-value household items designed to improve their daily lives and well-being. From humidifiers and air purifiers to essential kitchen appliances, these resources provided tangible relief and comfort to families navigating challenging times. The impact of these gifts extends far beyond their material value, offering a sense of dignity and reminding the community that they are seen, valued, and supported.

The festival atmosphere was electric, filled with the sounds of laughter and live entertainment. Food trucks offered delicious meals, creating spaces where neighbors could break bread together and share their stories. Vendor booths provided additional resources and fostered engagement, bridging gaps across generations and cultures.

As children played and families connected, the true spirit of Cross-Borders Outreach Ministry shone through. We believe that compassion knows no boundaries, and the Spring Festival exemplified this core value perfectly. By addressing holistic needs—providing practical resources while also cultivating joy and community spirit—we continue to plant seeds of hope that will grow into long-lasting resilience.

We extend our deepest gratitude to our incredible partners, dedicated volunteers, and the beautiful community of Sienna Ridge for making the Spring Festival · Festival de Primavera an unforgettable success. Together, we are building stronger, more connected communities, one act of love at a time.
    `,
  }
];
// Gallery Images
export const galleryImages = [
    {
    id: 1,
    url: "https://images.unsplash.com/photo-1764738130382-cc7a8eaf26c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbml0YXJpYW4lMjBhaWQlMjB2b2x1bnRlZXJzJTIwaGVscGluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzE5OTY2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Volunteers helping community",
    category: "community"
  },
  {
    id: 2,
    url: ImageSlide2,
    alt: "Children studying",
    category: "education"
  },
  {
    id: 3,
    url: ImageSlide1,
    alt: "crossboarders outreach team",
    category: "healthcare"
  },
  {
    id: 4,
    url: ImageSlide3,
    alt: "Food distribution",
    category: "food"
  },
  {
    id: 5,
    url: ImageSlide2,
    alt: "Women entrepreneur",
    category: "economic"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBub25wcm9maXR8ZW58MXx8fHwxNzcxOTI1NzQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Team collaboration",
    category: "community"
  },
  {
    id: 7,
    url: ImageSlide4,
    alt: "Volunteers community service",
    category: "community"
  },
  {
    id: 8,
    url: ImageSlide5,
    alt: "Classroom learning",
    category: "education"
  }
];

// Assets - Organized media library
export const assets = {
  // Hero/Banner Images
  heroes: [
    {
      id: "hero-1",
      url: "https://images.unsplash.com/photo-1764738130382-cc7a8eaf26c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbml0YXJpYW4lMjBhaWQlMjB2b2x1bnRlZXJzJTIwaGVscGluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzE5OTY2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Main Hero - Community Support",
      description: "Volunteers helping community members",
      category: "hero",
      tags: ["volunteers", "community", "humanitarian"]
    },
    {
      id: "hero-2",
      url: "https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN0dWR5aW5nJTIwZWR1Y2F0aW9uJTIwQWZyaWNhfGVufDF8fHx8MTc3MTk5NjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Education Hero",
      description: "Children engaged in learning",
      category: "hero",
      tags: ["education", "children", "learning"]
    }
  ],
  
  // Program Images
  programs: {
    foodSupport: [
      {
        id: "food-1",
        url: "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzdHJpYnV0aW9uJTIwY2hhcml0eSUyMHZvbHVudGVlcnN8ZW58MXx8fHwxNzcxOTk2NjkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Food Distribution",
        description: "Volunteers distributing food to families",
        tags: ["food", "distribution", "charity"]
      }
    ],
    education: [
      {
        id: "edu-1",
        url: "https://images.unsplash.com/photo-1770843093640-c44ae557928b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN0dWR5aW5nJTIwZWR1Y2F0aW9uJTIwQWZyaWNhfGVufDF8fHx8MTc3MTk5NjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Classroom Learning",
        description: "Students studying together",
        tags: ["education", "classroom", "students"]
      },
      {
        id: "edu-2",
        url: "https://images.unsplash.com/photo-1574132190990-cfd62178bb1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjB0ZWFjaGVyJTIwY2hpbGRyZW4lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzE5OTY3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Teacher and Students",
        description: "Teacher helping students learn",
        tags: ["education", "teacher", "learning"]
      }
    ],
    healthcare: [
      {
        id: "health-1",
        url: "https://images.unsplash.com/photo-1770221797840-8f5a095ad7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMG91dHJlYWNofGVufDF8fHx8MTc3MTk5NjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Medical Outreach",
        description: "Healthcare workers serving community",
        tags: ["healthcare", "medical", "outreach"]
      }
    ],
    economic: [
      {
        id: "econ-1",
        url: "https://images.unsplash.com/photo-1752650736246-abae155278be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGVudHJlcHJlbmV1ciUyMHNtYWxsJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcxOTk2Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Women Entrepreneur",
        description: "Woman running small business",
        tags: ["economic", "entrepreneur", "business"]
      }
    ]
  },
  
  // Team Photos
  team: [
    {
      id: "team-1",
      url: "https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBub25wcm9maXR8ZW58MXx8fHwxNzcxOTI1NzQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Team Collaboration",
      description: "Our diverse team working together",
      tags: ["team", "collaboration", "staff"]
    }
  ],
  
  // Event Photos
  events: [],
  
  // News/Press Images
  news: [
    {
      id: "news-1",
      url: "https://images.unsplash.com/photo-1638344956088-49e767865ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBwcmVzcyUyMGNvbmZlcmVuY2UlMjBhbm5vdW5jZW1lbnR8ZW58MXx8fHwxNzcxOTk3MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Press Conference",
      description: "News announcement and press coverage",
      tags: ["news", "press", "announcement"]
    },
    {
      id: "news-2",
      url: "https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzE5MzA3ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Partnership Announcement",
      description: "New partnership signing",
      tags: ["news", "partnership", "collaboration"]
    }
  ],
  
  // Logos and Branding
  branding: [
    {
      id: "logo-main",
      url: "/assets/logo-main.png",
      title: "Primary Logo",
      description: "Main organization logo",
      tags: ["logo", "branding", "primary"]
    },
    {
      id: "logo-white",
      url: "/assets/logo-white.png",
      title: "White Logo",
      description: "Logo for dark backgrounds",
      tags: ["logo", "branding", "white"]
    }
  ]
};

// Events Data
export const events = [
  {
    id: 1,
    title: "Visit to Kioimbi Children's Home",
    description: "Volunteers visited Kioimbi Children's Home in Murang'a County to support the children and staff.",
    longDescription: "On this day, volunteers engaged with the children at Kioimbi Children's Home through games, learning activities, and general support. The visit helped provide care and bring joy to the children while strengthening the community partnership.",
    date: "TBD",
    time: "8:00 AM - 5:00 PM",
    location: "Kioimbi Children's Home",
    address: "Murang'a County, Kenya",
    category: "Volunteer",
    status: "upcoming",
    ticketPrice: "Free",
    capacity: 5,
    registered: 4,
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqYjBIkT0Khmc8WWqpkKoYzGUQDNQJ9YQbQne6EqPvVDU1rqnblWXiXOQ7EJdsXF9ByP2CshyveqmJc3_wN1gqvRg4H1za9gENowIUWrw2ooc4QekGj6xVryZGpo-wa6dZBbQ=s680-w680-h510-rw",
    organizer: "Crossborders Outreach Ministry Inc",
    contactEmail: "volunteer@crossborders.org",
    contactPhone: "+1 (234) 567-8903"
  },
  {
    id: 2,
    title: "Visit to Murang'a Rescue Centre",
    description: "Crossborder Outreach volunteers visited Murang'a Rescue Centre to support children and staff through outreach activities.",
    longDescription: "On February 28, 2026, Crossborder Outreach volunteers visited Murang'a Rescue Centre in Murang'a County. The team spent time engaging with the children through games, mentorship, and learning activities. The visit focused on encouragement, community support, and strengthening partnerships with the centre while bringing joy and hope to the children.",
    date: "February 28, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Murang'a Rescue Centre",
    address: "Murang'a County, Kenya",
    category: "Outreach",
    status: "past",
    ticketPrice: "Free",
    capacity: 200,
    registered: 200,
    image: ImageSlide4,
    organizer: "Crossborders Outreach Ministry Inc",
    contactEmail: "volunteer@crossborders.org",
    contactPhone: "+1 (234) 567-8903"
  },
  {
    id: 3,
    title: "Visit to RCCG Peace Assembly",
    description: "Cross-Borders Outreach Ministry visited RCCG Peace Assembly for a community outreach and engagement program.",
    longDescription: "On March 14, 2026, Cross-Borders Outreach Ministry held an outreach visit at The Redeemed Christian Church of God (RCCG) Peace Assembly in Lilburn, Georgia. The event focused on community engagement, faith encouragement, and supporting individuals through mentorship and fellowship. Volunteers interacted with church members and visitors while sharing the mission of Cross-Borders Outreach Ministry to support vulnerable communities.",
    date: "March 14, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "RCCG Peace Assembly",
    address: "2158 McDaniel's Bridge Court, Lilburn, GA 30047, USA",
    category: "Outreach",
    status: "past",
    ticketPrice: "Free",
    capacity: 100,
    registered: 100,
    image: "https://s3-media0.fl.yelpcdn.com/bphoto/7F5PCKyicmVX_ZLjw0uM0g/348s.jpg",
    organizer: "Cross-Borders Outreach Ministry Inc",
    contactEmail: "info@cross-bordersoutreach.org",
    contactPhone: "+1 (404) 641-9248"
  },
  {
    id: 4,
    title: "Easter Egg Hunt · Búsqueda de Huevos de Pascua",
    description: "A vibrant bilingual celebration bringing together the community for a full Easter experience and product distribution.",
    longDescription: "On Monday, April 6, 2026, Cross-Borders Outreach Ministry organized an Easter Egg Hunt at Sienna Ridge Apartment Homes in Atlanta, Georgia. This event combined a traditional hunt—featuring games, prizes, face painting, and live entertainment—with the distribution of essential household items. With generous support from Amazon through Operation Compassion, over 80 families received Easter baskets, toys, hygiene products, and baby items, creating a powerful demonstration of unity and generosity.",
    date: "April 6, 2026",
    time: "11:00 AM – 4:00 PM",
    location: "Sienna Ridge Apartment Homes",
    address: "2283 Plaster Rd NE, Atlanta, GA 30345",
    category: "Outreach",
    status: "past",
    ticketPrice: "Free",
    capacity: 80,
    registered: 80,
    image: "/images/easter-egg-hunt.jpg",
    organizer: "Cross-Borders Outreach Ministry Inc.",
    contactEmail: "info@cross-bordersoutreach.org",
    contactPhone: "+1 (404) 641-9248"
  },
  {
    id: 5,
    title: "Spring Festival · Festival de Primavera",
    description: "A large-scale community festival providing high-value household appliances and essential resources to Atlanta families.",
    longDescription: "The Spring Festival held on April 12, 2026, at Sienna Ridge Apartment Homes marked a major milestone in serving the Atlanta metropolitan area. In partnership with Amazon, Operation Compassion, and over 12 other organizations, the event served 100+ families. Attendees received significant household items such as humidifiers, air purifiers, and kitchen appliances, while enjoying food trucks, live entertainment, and vendor booths designed to foster community connection across generations.",
    date: "April 12, 2026",
    time: "12:00 PM – 4:00 PM",
    location: "Sienna Ridge Apartment Homes",
    address: "2283 Plaster Rd NE, Atlanta, GA 30345",
    category: "Outreach",
    status: "past",
    ticketPrice: "Free",
    capacity: 100,
    registered: 100,
    image: "https://images.unsplash.com/photo-1567965178128-abb8d8532ae7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNwcmluZyUyMGZlc3RpdmFsJTIwdXNhfGVufDB8fDB8fHww",
    organizer: "Cross-Borders Outreach Ministry Inc.",
    contactEmail: "info@cross-bordersoutreach.org",
    contactPhone: "+1 (404) 641-9248"
  }
];