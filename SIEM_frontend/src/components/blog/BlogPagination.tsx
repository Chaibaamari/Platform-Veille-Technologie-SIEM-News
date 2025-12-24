import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
    return (
        <div className="flex items-center justify-center gap-4 mt-16">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-white hover:text-gray-300"
            >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
            </Button>

            <div className="flex items-center gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                        <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(pageNum)}
                            className={currentPage === pageNum ? "bg-white text-black" : "text-white border-gray-700"}
                        >
                            {pageNum}
                        </Button>
                    );
                })}
                {totalPages > 5 && <span className="text-gray-500 px-3">...</span>}
                {totalPages > 5 && (
                    <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </Button>
                )}
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-white hover:text-gray-300"
            >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
        </div>
    );
}