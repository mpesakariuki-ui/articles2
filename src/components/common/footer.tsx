import { BookOpen, Github, Linkedin, Mail, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <BookOpen className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/stanleysankan3-commits/articles" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="mailto:jamexkarix583@gmail.com" aria-label="Email">
            <Mail className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="https://x.com/Kariuki__Ke?t=lg4mmSYCrr5cgQBD5I1-2Q&s=09" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
            <X className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
          </Link>

        </div>
      </div>
    </footer>
  );
}
