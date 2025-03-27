import "./Footer.css";

function Footer() {
  return (
    <footer className="footer bg-[#f5f5f5] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600">
            <p className="font-medium">
              © 2025 MCLA Index. All rights reserved.
            </p>
            <p className="text-sm mt-1">Developed by Jason Oh</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/jasonoh11/mcla_index"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="bi bi-github text-xl"></i>
            </a>
            <a
              href="https://instagram.com/mclaindex"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="bi bi-instagram text-xl"></i>
            </a>
            <a
              href="https://linkedin.com/in/jasonoh5"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="bi bi-linkedin text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
