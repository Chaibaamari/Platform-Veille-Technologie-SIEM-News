import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Article } from "@/types/blog"
import { getTagBg, getTagText } from "@/lib/utils"
import { Link } from "react-router-dom"
import { useAppSelector } from "@/stores/hooks"

interface BlogCardProps {
  article: Article
  large?: boolean
  variant?: "default" | "row"
}

export default function BlogCard({
  article,
  large = false,
  variant = "default",
}: BlogCardProps) {
    const { role } = useAppSelector((state) => state.auth);
  /* ROW VARIANT (FULL WIDTH) */
  if (variant === "row") {
      return (
          <Card className="bg-transparent border-none">
              <Link to={`/${role}/article/${article.id}`}>
                  <div className="flex gap-8 items-start">
                      {/* Image */}
                      <div className="shrink-0">

                          <img
                              src={article?.thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUkOkp-ul9SF-K79OGubZg13v0qMPuV271RQ&s"}
                              alt={article.titre}
                              className="w-148 h-74 object-cover rounded-lg"
                          />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col gap-4 pt-1">
                          <p className="text-violet-400 text-sm font-semibold">
                              {article.date_publication}
                          </p>

                          <div className="flex items-start justify-between gap-4">
                              <h2 className="text-2xl font-semibold text-white line-clamp-1">
                                  {article.titre}
                              </h2>
                              <img
                                  src="/images/arrow-up-right.svg"
                                  alt="arrow"
                                  className="w-5 h-5 mt-1"
                              />
                          </div>

                          <p className="text-neutral-300 text-base leading-6 line-clamp-2">
                              {article.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-2">
                              {article.categories.map((tag) => (
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
              </Link>
          </Card>
      );
    };

    /* EXISTING CARD (unchanged) */
    return (
        <Card className="bg-transparent border-none shadow-none h-fit">
            <Link to={`/${role}/article/${article.id}`}>
                <div className="group cursor-pointer h-full">
                    {large ? (
                        /* LARGE CARD LAYOUT */
                        <div className="h-full flex flex-col">
                            {/* Top Image */}
                            <div className="relative overflow-hidden mb-6">
                                <img
                                    src={article?.thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUkOkp-ul9SF-K79OGubZg13v0qMPuV271RQ&s"}
                                    alt={article.titre}
                                    className="w-full h-fit object-cover"
                                />
                            </div>
                
                            {/* Content below image */}
                            <div className="flex flex-col gap-4 flex-1">
                                <p className="text-violet-400 text-sm font-semibold">
                                    {article.date_publication}
                                </p>
                                <div className="flex items-start justify-between gap-4">
                                    <h2 className="text-2xl font-semibold text-white line-clamp-1">
                                        {article.titre}
                                    </h2>
                                    <img
                                        src="/images/arrow-up-right.svg"
                                        alt="arrow"
                                        className="w-5 h-5 mt-1"
                                    />
                                </div>
                                <p className="text-neutral-300 text-base leading-6 line-clamp-2">
                                    {article.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {article.categories.map((tag) => (
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
                            <div>
                                <img
                                    src={article?.thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUkOkp-ul9SF-K79OGubZg13v0qMPuV271RQ&s"}
                                    alt={article.titre}
                                    className="w-[592px] h-[296px] object-cover rounded-lg"
                                />
                            </div>
                
                            {/* Content */}
                            <div className="flex flex-col gap-2 flex-1 justify-between ">
                                <p className="text-violet-400 text-sm font-semibold">
                                    {article.date_publication}
                                </p>
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="text-lg font-semibold text-white line-clamp-1">
                                        {article.titre}
                                    </h2>
                                    <img
                                        src="/images/arrow-up-right.svg"
                                        alt="arrow"
                                        className="w-5 h-5 shrink-0 mt-1"
                                    />
                                </div>
                                <p className="text-neutral-300 text-sm leading-5 line-clamp-2">
                                    {article.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-4">
                                    {article.categories.map((tag) => (
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
            </Link>
        </Card>
    );
}

