/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Reusable Blog Card
const BlogCard = ({ title, description, author, date, views, comments, likes }: any) => {
    return (
        <div className="flex gap-12 py-20 border-b border-neutral-800">
            <div className="w-96 flex items-center gap-4">
                <img className="w-20 h-20 rounded-full object-cover" src={author.avatar} alt={author.name} />
                <div>
                    <div className="text-white text-xl font-semibold">{author.name}</div>
                    <div className="text-neutral-400 text-lg">{author.category}</div>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-12">
                <div className="flex-1 flex flex-col gap-7">
                    <div className="text-neutral-400 text-xl font-semibold">{date}</div>
                    <div className="flex flex-col gap-2.5">
                        <h3 className="text-white text-2xl font-semibold leading-10">{title}</h3>
                        <p className="text-neutral-400 text-lg">{description}</p>
                    </div>
                    <div className="flex gap-2.5">
                        <div className="px-4 py-2 bg-zinc-900 rounded-full border border-neutral-800 flex items-center gap-1">
                            <div className="w-5 h-4 bg-orange-600" />
                            <span className="text-neutral-400">{views}</span>
                        </div>
                        <div className="px-4 py-2 bg-zinc-900 rounded-full border border-neutral-800 flex items-center gap-1">
                            <div className="w-4 h-4 border-2 border-stone-500 rounded-full" />
                            <span className="text-neutral-400">{comments}</span>
                        </div>
                        <div className="px-4 py-2 bg-zinc-900 rounded-full border border-neutral-800 flex items-center gap-1">
                            <div className="w-4 h-4 border-2 border-stone-500 rounded-full" />
                            <span className="text-neutral-400">{likes}</span>
                        </div>
                    </div>
                </div>

                <Link to="/blog/some-post" className="px-6 py-4 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center gap-2.5 hover:bg-neutral-800 transition">
                    <span className="text-neutral-400 text-lg">View Blog</span>
                    <ChevronRight className="w-6 h-6 text-violet-500" />
                </Link>
            </div>
        </div>
    );
};
export default BlogCard;