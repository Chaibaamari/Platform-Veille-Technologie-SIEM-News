// src/pages/simple-user/dashboard/index.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Clock, TrendingUp } from 'lucide-react';

export default function SimpleUserDashboard() {

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">News Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here are the latest collected news highlights.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's News</CardTitle>
                        <Newspaper className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">68</p>
                        <p className="text-xs text-gray-500">New articles today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <Clock className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">342</p>
                        <p className="text-xs text-gray-500">Articles this week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trending</CardTitle>
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">5</p>
                        <p className="text-xs text-gray-500">Hot topics right now</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                            <div>
                                <p className="font-medium">New articles from BBC News</p>
                                <p className="text-sm text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                            <div>
                                <p className="font-medium">Reuters update on global markets</p>
                                <p className="text-sm text-gray-500">4 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                            <div>
                                <p className="font-medium">Tech news from The Verge</p>
                                <p className="text-sm text-gray-500">6 hours ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}