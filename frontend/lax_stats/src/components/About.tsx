import React from "react";
import "./About.css";
import CardCarousel from "./CardCarousel";
import Footer from "./Footer";

const About: React.FC = () => {
  return (
    <div className="min-h-screen page-container">
      <div className="py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">About MCLAIndex</h1>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Main Content */}
        <main className="about-container max-w-7xl mx-auto pb-24">
          {/* Developer Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2">
              Meet the Developer
            </h3>
            <div className="flex dev-container items-start gap-8">
              <div className="flex-2">
                <p className="text-gray-700 leading-relaxed mb-4">
                  As a midfielder and CS major at The University of Texas,
                  MCLAIndex is a great intersection between two fields I'm
                  passionate about: lacrosse and data/software engineering. Of
                  course, a player creating rankings for their own league can
                  raise questions of bias/favoritism. That's why transparency is
                  at the core of this project. The entire source code and
                  algorithm is available on my{" "}
                  <a
                    href="https://github.com/jasonoh11/mcla_index"
                    className="custom-link"
                  >
                    GitHub
                  </a>
                  .
                </p>
                <h6>- Jason Oh, #11</h6>
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="/jason-lax.png"
                  alt="Jason Oh"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2">
              Get in Touch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <p className="text-lg text-gray-700 mb-6">
                  If you want to learn more about the project, complain about
                  the rankings, have any suggestions, or want to hire me, send
                  me a message!
                </p>
                <p className="text-lg text-gray-700 mb-8">
                  I'm always open to discussing new opportunities, answering
                  questions, or receiving feedback about MCLAIndex. Feel free to
                  reach out through any of the channels below, and I'll get back
                  to you as soon as possible.
                </p>
                <a
                  href="mailto:jason@mclaindex.com"
                  className="custom-button border border-blue-600 text-blue-600 whitespace-nowrap self-start flex items-center px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg mb-6 no-underline"
                >
                  <i className="bi bi-envelope mr-3"></i>
                  jason@mclaindex.com
                </a>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/mclaindex"
                    className="custom-button !rounded-button whitespace-nowrap flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    title="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-instagram m-0 text-xl"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jasonoh5/"
                    className="custom-button !rounded-button whitespace-nowrap flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    title="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-linkedin m-0 text-xl"></i>
                  </a>
                  <a
                    href="https://github.com/jasonoh11/mcla_index"
                    className="custom-button !rounded-button whitespace-nowrap flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    title="GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-github m-0 text-xl"></i>
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How can I help you?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="custom-button border border-blue-600 text-blue-600 whitespace-nowrap w-full py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors no-underline"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* What's Next Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2">
              What's Next
            </h3>
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                As a sophomore student, I'm constantly learning and improving my
                skills. MCLAIndex is a passion project that will evolve as I
                grow as a developer. I'm excited to implement new features and
                refine the existing ones based on user feedback and my expanding
                knowledge of web development and data analytics.
              </p>
            </div>
            <CardCarousel></CardCarousel>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default About;
