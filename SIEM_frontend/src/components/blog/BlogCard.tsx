import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type BlogPost } from "@/types/blog"
import { getTagBg, getTagText } from "@/lib/utils"

interface BlogCardProps {
  post: BlogPost
  large?: boolean
  variant?: "default" | "row"
}

export default function BlogCard({
  post,
  large = false,
  variant = "default",
}: BlogCardProps) {
  /* ROW VARIANT (FULL WIDTH) */
  if (variant === "row") {
      return (
          <Card className="bg-transparent border-none">
              <div className="flex gap-8 items-start">
                  {/* Image */}
                  <div className="shrink-0">

                      <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-[592] h-[246] object-cover rounded-xl"
                      />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-4 pt-1">
                      <p className="text-violet-400 text-sm font-semibold">
                          {post.date}
                      </p>

                      <div className="flex items-start justify-between gap-4">
                          <h3 className="text-2xl font-semibold text-white">
                              {post.title}
                          </h3>
                          <img
                              src="/images/arrow-up-right.svg"
                              alt="arrow"
                              className="w-5 h-5 mt-1"
                          />
                      </div>

                      <p className="text-neutral-300 text-base leading-6 line-clamp-2">
                          {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags.map((tag) => (
                              <Badge
                                  key={tag}
                                  className="px-2.5 py-0.5 rounded-2xl text-sm font-medium"
                                  style={{
                                      backgroundColor: getTagBg(tag),
                                      color: getTagText(tag),
                                  }}
                              >
                                  {tag}
                              </Badge>
                          ))}
                      </div>
                  </div>
              </div>
          </Card>
      );
    };

  /* EXISTING CARD (unchanged) */
    return (
        <Card className="bg-transparent border-none shadow-none h-full">
            <div className="group cursor-pointer h-full">
                {large ? (
                    /* LARGE CARD LAYOUT */
                    <div className="h-full flex flex-col">
                        {/* Top Image */}
                        <div className="relative overflow-hidden rounded-xl mb-6">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full object-cover aspect-video"
                            />
                        </div>
            
                        {/* Content below image */}
                        <div className="flex flex-col gap-4 flex-1">
                            <p className="text-violet-400 text-sm font-semibold">
                                {post.date}
                            </p>
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-2xl font-semibold text-white">
                                    {post.title}
                                </h3>
                                <img
                                    src="/images/arrow-up-right.svg"
                                    alt="arrow"
                                    className="w-5 h-5 mt-1"
                                />
                            </div>
                            <p className="text-neutral-300 text-base leading-6 line-clamp-2">
                                {post.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {post.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        className="px-2.5 py-0.5 rounded-2xl text-sm font-medium"
                                        style={{
                                            backgroundColor: getTagBg(tag),
                                            color: getTagText(tag),
                                        }}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* SMALL CARD LAYOUT */
                    <div className="flex gap-4 h-full items-start">
                        {/* Image - fixed size */}
                        <div className="shrink-0">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-[592] h-[246] object-cover rounded-xl"
                            />
                        </div>
            
                        {/* Content */}
                        <div className="flex flex-col gap-2 flex-1 justify-between ">
                            <p className="text-violet-400 text-sm font-semibold">
                                {post.date}
                            </p>
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-lg font-semibold text-white line-clamp-2">
                                    {post.title}
                                </h3>
                                <img
                                    src="/images/arrow-up-right.svg"
                                    alt="arrow"
                                    className="w-5 h-5 shrink-0 mt-1"
                                />
                            </div>
                            <p className="text-neutral-300 text-sm leading-5 line-clamp-2">
                                {post.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-4">
                                {post.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        className="px-2 py-0.5 rounded-2xl text-xs font-medium text-end"
                                        style={{
                                            backgroundColor: getTagBg(tag),
                                            color: getTagText(tag),
                                        }}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

