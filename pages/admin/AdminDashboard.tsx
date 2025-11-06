import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAuth } from '../../hooks/useAuth';
import { useEMRIntegration } from '../../hooks/useEMRIntegration';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { UserRole, SystemHealth, PredictiveAnalytics } from '../../types';
import { UsersIcon, ShieldExclamationIcon, CurrencyDollarIcon, CollectionIcon, SparklesIcon, CogIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, CloudIcon, RefreshIcon, PlayIcon, StopIcon } from '../../components/shared/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
// FIX: Use `react-router-dom` for web-specific components.
import Link from 'next/link';
import UniqueLoader from '../../components/shared/UniqueLoader';

const AdminDashboard: React.FC = () => {
    const { users, invoices, providerSubscriptionPlans } = useAuth();
    const emrIntegration = useEMRIntegration();
    const [aiSummary, setAiSummary] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState('');
    const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
    const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalytics | null>(null);
    const [complianceAlerts, setComplianceAlerts] = useState<string[]>([]);
    const [emrHealth, setEmrHealth] = useState({ uptime: 0, errorRate: 0, responseTime: 0, syncedPatients: 0, syncedProviders: 0 });
    const [emrAutoSyncActive, setEmrAutoSyncActive] = useState(false);

    // Mock data for new features - in real app, this would come from APIs
    useEffect(() => {
        // Simulate real-time system health monitoring
        const mockSystemHealth: SystemHealth = {
            uptime: 99.8,
            errorRate: 0.2,
            responseTime: 245,
            activeUsers: users.length,
            lastUpdated: new Date().toISOString()
        };
        setSystemHealth(mockSystemHealth);

        // Simulate predictive analytics
        const mockPredictiveAnalytics: PredictiveAnalytics = {
            userGrowthPrediction: users.length * 1.15,
            revenueProjection: 5000 * 1.25, // Mock revenue
            churnRate: 5.2,
            confidence: 87
        };
        setPredictiveAnalytics(mockPredictiveAnalytics);

        // Mock compliance alerts
        setComplianceAlerts([
            "HIPAA compliance audit due in 30 days",
            "Provider verification renewal required for 3 accounts"
        ]);

        // Simulate EMR health metrics
        const mockEmrHealth = {
            uptime: 98.5,
            errorRate: 1.2,
            responseTime: 320,
            syncedPatients: users.filter(u => u.role === UserRole.PATIENT).length * 0.9,
            syncedProviders: users.filter(u => u.role === UserRole.PROVIDER).length * 0.95
        };
        setEmrHealth(mockEmrHealth);
    }, [users]);

    const stats = useMemo(() => {
        const providers = users.filter(u => u.role === UserRole.PROVIDER);
        const patients = users.filter(u => u.role === UserRole.PATIENT);
        
        const totalRevenue = providers.reduce((acc, provider) => {
            const plan = providerSubscriptionPlans.find(p => p.id === provider.subscription?.planId);
            if (plan && plan.price.startsWith('$')) {
                const price = parseFloat(plan.price.replace(/[^0-9.-]+/g,""));
                if (!isNaN(price)) {
                    return acc + price;
                }
            }
            return acc;
        }, 0);

        return {
            totalUsers: users.length,
            totalProviders: providers.length,
            totalPatients: patients.length,
            pendingVerifications: providers.filter(p => !p.isVerified).length,
            monthlyRevenue: totalRevenue,
        };
    }, [users, providerSubscriptionPlans]);

    const userRoleData = useMemo(() => [
        { name: 'Patients', value: stats.totalPatients },
        { name: 'Providers', value: stats.totalProviders },
        { name: 'Admins', value: users.filter(u => u.role === UserRole.ADMIN).length },
    ], [stats, users]);
    
    const revenueData = useMemo(() => {
        const months: { [key: string]: number } = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        invoices.forEach(invoice => {
            if (invoice.status === 'Paid') {
                const date = new Date(invoice.date);
                const month = monthNames[date.getMonth()];
                months[month] = (months[month] || 0) + invoice.totalAmount;
            }
        });
        
        // Add current month's estimated revenue from subscriptions
        const currentMonthName = monthNames[new Date().getMonth()];
        months[currentMonthName] = (months[currentMonthName] || 0) + stats.monthlyRevenue;
        
        return monthNames.slice(0, new Date().getMonth() + 1).map(month => ({
            month,
            revenue: months[month] || 0,
        }));
    }, [invoices, stats.monthlyRevenue]);

    const COLORS = ['#3b82f6', '#14B8A6', '#6366f1'];

    const generateSummary = useCallback(async () => {
        setIsSummaryLoading(true);
        setAiSummary('');
        setSummaryError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY });
            const prompt = `
                You are a business analyst for NovoPath Medical, a healthcare platform.
                Analyze the following key metrics and provide a concise summary of insights in 3-4 bullet points.
                Highlight key trends, successes, and potential areas for focus.
                Format the response as simple text with bullet points (using *).

                Metrics:
                - Total Users: ${stats.totalUsers}
                - Total Providers: ${stats.totalProviders}
                - Total Patients: ${stats.totalPatients}
                - Pending Provider Verifications: ${stats.pendingVerifications}
                - Estimated Monthly Revenue: $${stats.monthlyRevenue.toFixed(2)}
                - Revenue trend over past months: ${JSON.stringify(revenueData)}
                - User distribution: ${JSON.stringify(userRoleData)}
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            // FIX: Correctly access the 'text' property from the response object.
            // Try several common response shapes from the GenAI client,
            // then fall back to a short JSON string so UI doesn't break.
            const respAny = response as any;
            const tryFindText = () => {
                // candidate/content style
                if (Array.isArray(respAny?.candidates) && respAny.candidates[0]) {
                    const c = respAny.candidates[0];
                    if (typeof c?.content === 'string') return c.content;
                    if (Array.isArray(c?.content)) {
                        const t = c.content.find((x: any) => typeof x?.text === 'string');
                        if (t) return t.text;
                    }
                }
                // output/content style
                if (Array.isArray(respAny?.output) && respAny.output[0]) {
                    const o = respAny.output[0];
                    if (Array.isArray(o?.content)) {
                        const t = o.content.find((x: any) => typeof x?.text === 'string');
                        if (t) return t.text;
                    }
                }
                // direct text property
                if (typeof respAny?.text === 'string') return respAny.text;
                return null;
            };
            const text = tryFindText() || JSON.stringify(respAny).slice(0, 2000);
            setAiSummary(text || 'No summary returned.');
        } catch (error) {
            console.error("Error generating AI summary:", error);
            setSummaryError('Failed to generate insights. Please try again.');
        } finally {
            setIsSummaryLoading(false);
        }
    }, [stats, revenueData, userRoleData]);

    return (
        <div className="animate-fade-in-up">
            <PageHeader 
                title="Administrator Dashboard"
                subtitle="Oversee and manage the NovoPath Medical platform."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="flex items-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="p-3 bg-blue-100 rounded-full mr-4"><UsersIcon className="w-6 h-6 text-blue-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p><p className="text-gray-500">Total Users</p></div>
                </Card>
                <Card className="flex items-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="p-3 bg-teal-100 rounded-full mr-4"><CollectionIcon className="w-6 h-6 text-teal-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.totalProviders}</p><p className="text-gray-500">Active Providers</p></div>
                </Card>
                 <Card className="flex items-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="p-3 bg-emerald-100 rounded-full mr-4"><CurrencyDollarIcon className="w-6 h-6 text-emerald-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">${stats.monthlyRevenue.toFixed(2)}</p><p className="text-gray-500">Est. Monthly Revenue</p></div>
                </Card>
                <Card className="flex items-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="p-3 bg-amber-100 rounded-full mr-4"><ShieldExclamationIcon className="w-6 h-6 text-amber-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.pendingVerifications}</p><p className="text-gray-500">Pending Verifications</p></div>
                </Card>
            </div>

            {/* New Advanced Features Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* System Health Monitoring */}
                <Card title="System Health" className="relative">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CogIcon className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="text-sm font-medium">Uptime</span>
                            </div>
                            <span className="text-sm font-bold text-green-600">{systemHealth?.uptime}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="text-sm font-medium">Error Rate</span>
                            </div>
                            <span className="text-sm font-bold text-red-600">{systemHealth?.errorRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ArrowTrendingUpIcon className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="text-sm font-medium">Response Time</span>
                            </div>
                            <span className="text-sm font-bold text-blue-600">{systemHealth?.responseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <UsersIcon className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="text-sm font-medium">Active Users</span>
                            </div>
                            <span className="text-sm font-bold text-purple-600">{systemHealth?.activeUsers}</span>
                        </div>
                    </div>
                </Card>

                {/* Predictive Analytics */}
                <Card title="Predictive Analytics" className="relative">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">User Growth (3 months)</span>
                            <span className="text-sm font-bold text-green-600">+{Math.round(predictiveAnalytics?.userGrowthPrediction || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Revenue Projection</span>
                            <span className="text-sm font-bold text-blue-600">${Math.round(predictiveAnalytics?.revenueProjection || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Churn Rate</span>
                            <span className="text-sm font-bold text-red-600">{predictiveAnalytics?.churnRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Confidence Level</span>
                            <span className="text-sm font-bold text-purple-600">{predictiveAnalytics?.confidence}%</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Compliance Alerts */}
            {complianceAlerts.length > 0 && (
                <Card title="Compliance Alerts" className="mb-8 border-l-4 border-red-500">
                    <div className="space-y-2">
                        {complianceAlerts.map((alert, index) => (
                            <div key={index} className="flex items-center text-sm text-red-700">
                                <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                {alert}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card title="Revenue Growth (Monthly)">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }} formatter={(value: number) => `$${value.toFixed(2)}`} />
                                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" barSize={30} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="User Distribution">
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={userRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {userRoleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
            <div className="mt-8">
                <Card title={
                    <div className="flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-3 text-primary-500" />
                        <span>AI-Powered Insights</span>
                    </div>
                }>
                    {isSummaryLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <UniqueLoader />
                        </div>
                    ) : summaryError ? (
                        <div className="text-center text-red-500 p-4">{summaryError}</div>
                    ) : aiSummary ? (
                        <div>
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{aiSummary}</pre>
                            <div className="text-right mt-4">
                                <button onClick={generateSummary} className="text-sm font-semibold text-primary-600 hover:underline">
                                    Refresh Insights
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-gray-600 mb-4">Get a quick, AI-generated overview of your platform's key metrics.</p>
                            <button onClick={generateSummary} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm inline-flex items-center">
                                <SparklesIcon className="w-5 h-5 mr-2" /> Generate Insights
                            </button>
                        </div>
                    )}
                </Card>
            </div>
             <div className="mt-8">
                <Card title="Quick Actions">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/admin/users" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Manage Users</Link>
                        <Link to="/admin/subscriptions" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">View Subscriptions</Link>
                        <Link to="/admin/billing" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Go to Billing</Link>
                        <Link to="/admin/reports" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Generate Reports</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;