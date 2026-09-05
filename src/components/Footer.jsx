const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kora Rwanda</h3>
            <p className="text-gray-300">Connecting Rwandan youth with opportunities for a better future.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/scholarships" className="hover:text-white">Scholarships</a></li>
              <li><a href="/jobs" className="hover:text-white">Jobs</a></li>
              <li><a href="/internships" className="hover:text-white">Internships</a></li>
              <li><a href="/training" className="hover:text-white">Training</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">Kigali, Rwanda</p>
            <p className="text-gray-300">contact@korarwanda.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Kora Rwanda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;