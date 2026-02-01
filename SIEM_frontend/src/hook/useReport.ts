// src/hooks/useReports.ts  (recommended — keeps logic reusable)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { downloadReport } from '@/api/client';  // adjust path

export function useReports() {
    const queryClient = useQueryClient();

    const generateReportMutation = useMutation({
        mutationFn: async ({ format, days }: { format: 'pdf' | 'excel' ; days: number}) => {
            const endpoint = format === 'pdf'
                ? `reports/articles/pdf/?days=${days}`
                : `reports/articles/excel/days=${days}`;

            const fileName = `articles-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

            await downloadReport(endpoint, fileName);
        },

        // Optional: if you want to show global toast / track last success
        onSuccess: () => {
            // You could invalidate something if report generation creates new data
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            console.log('Report generated and downloaded');
        },

        onError: (error) => {
            console.error('Report mutation failed:', error);
            // Here you can show a toast: "Failed to generate report"
        },
    });

    const generateDetailedReportPage = useMutation({
        mutationFn: async ({ format, id }: { format: 'pdf' | 'excel' ; id: string | undefined}) => {
            const endpoint = `reports/article/${id}/${format}/`
            const fileName = `articles-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

            await downloadReport(endpoint, fileName);
        },

        // Optional: if you want to show global toast / track last success
        onSuccess: () => {
            // You could invalidate something if report generation creates new data
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            console.log('Report generated and downloaded');
        },

        onError: (error) => {
            console.error('Report mutation failed:', error);
            // Here you can show a toast: "Failed to generate report"
        },
    })

    return {
        generateDetailedReport: generateDetailedReportPage.mutate,
        generateReport: generateReportMutation.mutate,
        isGenerating: generateReportMutation.isPending,
        generateError: generateReportMutation.error,
    };
}