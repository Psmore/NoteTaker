export default function Footer() {
    return (
      <footer className="flex gap-1 justify-between mt-auto bg-blue-400 px-4 py-2">
        <div className="flex gap-3 text-md font-semibold font-sans">
          <a
            className="hover:text-white hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/psmore"
          >
            GitHub
          </a>
          <a
            className="hover:text-white hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://linkedin.com/in/pruthvi-more-4125aa340"
          >
            LinkedIn
          </a>
        </div>
        <div className="flex gap-0.5 text-lg">
          <p className="font-semibold font-serif">
            Note<span className="text-white">Taker</span>
          </p>
          <p className="font-semibold font-sans">&#169; 2024</p>
        </div>
      </footer>
    );
  }
  