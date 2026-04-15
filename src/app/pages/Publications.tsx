import { FileText, Download, Calendar, BookOpen } from "lucide-react";
import { publications } from "../../data/content";

export default function Publications() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <BookOpen className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Publications</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Research, insights, and resources from our work
          </p>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse Our Publications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our research papers, case studies, and resources that document our methodologies and impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {publications.map((pub) => (
              <div key={pub.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-2">
                      {pub.category}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{pub.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{pub.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{pub.date}</span>
                      </div>
                      <span>•</span>
                      <span>{pub.pages} pages</span>
                      <span>•</span>
                      <span>{pub.size}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pub.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      By: {pub.authors.join(", ")}
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscribe */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Subscribe to Our Publications</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get notified when we publish new research and insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}