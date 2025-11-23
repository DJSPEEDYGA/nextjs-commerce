/**
 * GOAT Royalty - AI Fashion Studio
 * Main fashion studio interface
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Fashion Studio | GOAT Royalty',
  description: 'Transform your style with AI-powered fashion tools, virtual try-on, and personalized styling recommendations.'
};

export default function FashionStudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              AI Fashion Studio
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Your personal AI stylist, virtual fitting room, and 3D design studio all in one place.
              Transform your wardrobe with cutting-edge technology.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Start Virtual Try-On
              </button>
              <button className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-200">
                Get Style Analysis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Powerful Fashion Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Virtual Try-On */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Virtual Try-On</h3>
              <p className="text-gray-600 mb-6">
                See how clothes look on you before buying. Upload your photo and try on any outfit instantly with AI-powered visualization.
              </p>
              <button className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                Try Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* AI Stylist */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Personal Stylist</h3>
              <p className="text-gray-600 mb-6">
                Get personalized outfit recommendations based on your style, body type, and occasion. Your AI fashion expert available 24/7.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                Get Styled
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 3D Design Studio */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">3D Design Studio</h3>
              <p className="text-gray-600 mb-6">
                Create custom clothing designs in 3D. Design, visualize, and prototype your fashion ideas with professional tools.
              </p>
              <button className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
                Start Designing
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Style DNA Analysis */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Style DNA Analysis</h3>
              <p className="text-gray-600 mb-6">
                Discover your unique style profile. AI analyzes your preferences, body type, and personality to create your fashion DNA.
              </p>
              <button className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-2">
                Analyze Style
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Smart Wardrobe */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Wardrobe</h3>
              <p className="text-gray-600 mb-6">
                Digitize your entire wardrobe. Track what you own, get outfit suggestions, and never forget what's in your closet.
              </p>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-2">
                Build Wardrobe
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Trend Forecasting */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Trend Forecasting</h3>
              <p className="text-gray-600 mb-6">
                Stay ahead of fashion trends. AI analyzes global fashion data to predict what's next and keep you stylish.
              </p>
              <button className="text-pink-600 font-semibold hover:text-pink-700 flex items-center gap-2">
                View Trends
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Upload Your Photo</h3>
              <p className="text-gray-600">
                Take or upload a full-body photo. Our AI will analyze your body type and measurements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-pink-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Choose Your Style</h3>
              <p className="text-gray-600">
                Browse clothing items or let AI recommend outfits based on your preferences and occasion.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">See Yourself Styled</h3>
              <p className="text-gray-600">
                Instantly visualize how clothes look on you with our advanced virtual try-on technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10M+</div>
              <div className="text-purple-100">Virtual Try-Ons</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500K+</div>
              <div className="text-purple-100">Happy Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-purple-100">Outfits Created</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-purple-100">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to Transform Your Style?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of fashion-forward individuals using AI to elevate their wardrobe.
          </p>
          <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-5 text-xl font-semibold text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
}