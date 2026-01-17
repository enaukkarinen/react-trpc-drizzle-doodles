export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white mb-2">About Us</h1>
            <p className="text-blue-100 text-lg">
              Learn more about our mission and story
            </p>
          </div>

          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Story
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome to our platform. We're dedicated to creating meaningful
                experiences and building tools that make a difference in
                people's lives.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What We Do
              </h2>
              <p className="text-gray-600 mb-6">
                We focus on innovation, quality, and user satisfaction. Our team
                works tirelessly to deliver products that exceed expectations
                and solve real problems.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Values
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Excellence in everything we create</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>User-centered design and development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Continuous innovation and improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
