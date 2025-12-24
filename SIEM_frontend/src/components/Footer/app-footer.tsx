import { Twitter, Linkedin, Mail, Rss, Plus } from 'lucide-react';

export default function Footer() {
    return (
        <div className="w-full py-7 bg-slate-950 flex flex-col justify-center items-center gap-16">
            <div className="w-full max-w-[1216] px-8 inline-flex justify-start items-start gap-3.5 flex-wrap">
                {/* Copyright */}
                <div className="text-white text-xl font-normal  leading-6">
                    © {new Date().getFullYear()}
                </div>

                {/* Social Links */}
                <div className="flex justify-start items-start gap-3.5 flex-wrap">
                    <a
                        href="https://twitter.com/yourhandle"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white text-xl font-normal  leading-6 hover:text-violet-400 transition-colors"
                    >
                        <Twitter size={20} />
                        Twitter
                    </a>

                    <a
                        href="https://linkedin.com/company/yourcompany"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white text-xl font-normal  leading-6 hover:text-violet-400 transition-colors"
                    >
                        <Linkedin size={20} />
                        LinkedIn
                    </a>

                    <a
                        href="mailto:contact@yourcompany.com"
                        className="flex items-center gap-2 text-white text-xl font-normal  leading-6 hover:text-violet-400 transition-colors"
                    >
                        <Mail size={20} />
                        Email
                    </a>

                    <a
                        href="/rss.xml"
                        target="_blank"
                        className="flex items-center gap-2 text-white text-xl font-normal  leading-6 hover:text-violet-400 transition-colors"
                    >
                        <Rss size={20} />
                        RSS feed
                    </a>

                    <a
                        href="https://feedly.com/i/subscription/feed/http://yourdomain.com/rss.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white text-xl font-normal  leading-6 hover:text-violet-400 transition-colors"
                    >
                        <Plus size={20} className="text-green-500" />
                        Add to Feedly
                    </a>
                </div>
            </div>
        </div>
    );
}