import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Clock, Shield, MapPin, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <Heart className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Save Lives with <span className="text-red-600">LifeShare</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect blood and organ donors with recipients through our intelligent matching platform.
            Every donation has the power to save lives and bring hope to families in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Become a Donor
            </Link>
            <Link
              to="/register"
              className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors"
            >
              Find Help
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LifeShare?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform uses advanced algorithms to connect the right donors with recipients,
            ensuring compatibility and proximity for successful donations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Matching</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI-powered algorithm matches donors and recipients based on blood type compatibility,
              organ requirements, and geographical proximity for optimal results.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Updates</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant notifications when matches are found, requests are updated, or urgent
              donations are needed in your area.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Private</h3>
            <p className="text-gray-600 leading-relaxed">
              Your personal and medical information is protected with enterprise-grade security.
              We prioritize privacy while facilitating life-saving connections.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-100 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Making a Difference</h2>
          <p className="text-lg text-gray-600">Join thousands of heroes saving lives every day</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-red-600 mb-2">2,500+</div>
            <div className="text-gray-600">Lives Saved</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
            <div className="text-gray-600">Registered Donors</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">8,200+</div>
            <div className="text-gray-600">Successful Matches</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to start saving lives or find the help you need
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Register</h3>
            <p className="text-gray-600">Create your profile and complete medical eligibility screening</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Match</h3>
            <p className="text-gray-600">Our algorithm finds compatible matches based on medical criteria</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
            <p className="text-gray-600">Get notified of matches and coordinate with medical professionals</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">4</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Lives</h3>
            <p className="text-gray-600">Complete the donation process and make a life-changing impact</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of heroes and help save lives in your area.
            Every donation counts, every match matters.
          </p>
          <Link
            to="/register"
            className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center space-x-2"
          >
            <Heart className="h-5 w-5" />
            <span>Join LifeShare Today</span>
          </Link>
        </div>
      </section>
    </div>
  );
}