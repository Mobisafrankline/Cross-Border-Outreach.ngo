import { FileText, Download, TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { reports } from "../../data/content";

/* =========================
   2026 Projection Statistics
========================= */

const projection2026 = [
  {
    icon: DollarSign,
    title: "Projected Revenue",
    value: "$150K",
  },
  {
    icon: Users,
    title: "Projected Beneficiaries",
    value: "15,000+",
  },
  {
    icon: TrendingUp,
    title: "Expected Growth",
    value: "+50%",
  },
  {
    icon: BarChart3,
    title: "Programs Expansion",
    value: "18 Centers",
  },
];

export default function Reports() {
  return (
    <div className="min-h-screen pt-24">

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1572645098182-5e28a03f1b60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
            alt="Reports"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Reports & Transparency
          </h1>
          <p className="text-xl md:text-2xl opacity-95">
            Our commitment to accountability and transparency
          </p>
        </div>
      </section>

      {/* =========================
         2026 Projection Statistics
      ========================= */}

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              2026 Impact Projection
            </h2>
            <p className="text-xl text-gray-600">
              Expected growth and projected impact for the coming year
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {projection2026.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="bg-green-50 rounded-xl p-6 text-center hover:shadow-md transition"
                >
                  <Icon className="w-8 h-8 text-green-600 mx-auto mb-3" />

                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>

                  <div className="text-sm text-gray-600">
                    {stat.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================
             Annual Reports
          ========================= */}

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Annual Reports
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Download our comprehensive reports detailing our impact,
              finances, and operations
            </p>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-gray-50 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {report.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{report.year}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>{report.pages} pages</span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {report.description}
                    </p>
                  </div>
                </div>

                <a
                  href={report.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold flex-shrink-0"
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Transparency */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Financial Transparency
          </h2>

          <div className="bg-white rounded-xl p-8 shadow-lg">

            <div className="grid md:grid-cols-3 gap-8 text-center">

              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-gray-700">Program Services</div>
              </div>

              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">10%</div>
                <div className="text-gray-700">Fundraising</div>
              </div>

              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">5%</div>
                <div className="text-gray-700">Administrative</div>
              </div>

            </div>

            <p className="text-center text-gray-600 mt-8">
              Every dollar contributed is maximized for impact. We maintain
              one of the highest program efficiency ratings in the sector.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
}