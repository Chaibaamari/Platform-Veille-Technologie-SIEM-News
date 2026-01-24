import { Card } from "@/components/ui/card";

// Skeleton Card Component
function SkeletonCard({ large = false, variant = "default" }) {
  if (variant === "row") {
    return (
      <Card className="bg-transparent border-none animate-pulse">
        <div className="flex gap-8 items-start">
          {/* Image Skeleton */}
          <div className="shrink-0 w-[592px] h-[296px] bg-zinc-800 rounded-lg"></div>

          {/* Content Skeleton */}
          <div className="flex-1 flex flex-col gap-4 pt-1">
            {/* Date */}
            <div className="w-24 h-4 bg-zinc-800 rounded"></div>

            {/* Title */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 h-7 bg-zinc-800 rounded"></div>
              <div className="w-5 h-5 bg-zinc-800 rounded"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-zinc-800 rounded"></div>
              <div className="w-3/4 h-4 bg-zinc-800 rounded"></div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-2">
              <div className="w-16 h-6 bg-zinc-800 rounded-2xl"></div>
              <div className="w-20 h-6 bg-zinc-800 rounded-2xl"></div>
              <div className="w-14 h-6 bg-zinc-800 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (large) {
      return (
          <Card className="bg-transparent border-none shadow-none h-fit animate-pulse">
              <div className="h-full flex flex-col">
                  {/* Image Skeleton */}
                  <div className="w-full h-80 bg-zinc-800 rounded-lg mb-6"></div>

                  {/* Content */}
                  <div className="flex flex-col gap-4 flex-1">
                      {/* Date */}
                      <div className="w-24 h-4 bg-zinc-800 rounded"></div>

                      {/* Title */}
                      <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 h-7 bg-zinc-800 rounded"></div>
                          <div className="w-5 h-5 bg-zinc-800 rounded"></div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                          <div className="w-full h-4 bg-zinc-800 rounded"></div>
                          <div className="w-4/5 h-4 bg-zinc-800 rounded"></div>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-2 mt-auto">
                          <div className="w-16 h-6 bg-zinc-800 rounded-2xl"></div>
                          <div className="w-20 h-6 bg-zinc-800 rounded-2xl"></div>
                      </div>
                  </div>
              </div>
          </Card>
      );
    };

  // Small Card Skeleton
    return (
        <Card className="bg-transparent border-none shadow-none h-fit animate-pulse">
            <div className="flex gap-4 h-full items-start">
                {/* Image */}
                <div className="shrink-0 w-32 h-32 bg-zinc-800 rounded-lg"></div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                    {/* Date */}
                    <div className="w-20 h-3 bg-zinc-800 rounded"></div>

                    {/* Title */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 h-5 bg-zinc-800 rounded"></div>
                        <div className="w-5 h-5 bg-zinc-800 rounded"></div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <div className="w-full h-3 bg-zinc-800 rounded"></div>
                        <div className="w-2/3 h-3 bg-zinc-800 rounded"></div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1 mt-4">
                        <div className="w-12 h-5 bg-zinc-800 rounded-2xl"></div>
                        <div className="w-16 h-5 bg-zinc-800 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Main Skeleton Grid
export default function BlogGridSkeleton() {
    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Top section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <SkeletonCard large />

                <div className="grid grid-cols-1 gap-8">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>

            {/* Rest posts - full-width rows */}
            <div className="grid grid-cols-1 gap-8">
                <SkeletonCard variant="row" />
                <SkeletonCard variant="row" />
                <SkeletonCard variant="row" />
            </div>
        </div>
    );
}