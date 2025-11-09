import React, { useMemo, useState, useCallback, useEffect } from 'react';
// NOTE: we dynamically import `@google/genai` inside `generateSummary` to avoid
// bundling-time export warnings and to support different shapes of the package
// (some versions export classes, others export factory functions).
import { useAuth } from '../../hooks/useAuth';
import { useEMRIntegration } from '../../hooks/useEMRIntegration';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { UserRole, SystemHealth, PredictiveAnalytics } from '../../types';
import { UsersIcon, ShieldExclamationIcon, CurrencyDollarIcon, CollectionIcon, SparklesIcon, CogIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, GlobeAltIcon as CloudIcon, ArrowPathIcon as RefreshIcon, CogIcon as PlayIcon, StopIcon } from '../../components/shared/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
// FIX: Use `react-router-dom` for web-specific components.
import { Link } from 'react-router-dom';
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

        if (!import.meta.env.VITE_API_KEY) {
            setSummaryError("API key is not configured. Please set VITE_API_KEY in your .env file.");
            setIsSummaryLoading(false);
            return;
        }

        try {
            // Dynamically load the package so the bundler doesn't statically
            // validate named exports (which can differ between versions).
            const genaiModule: any = await import('@google/generative-ai');

            // Try to detect a few common shapes of the library so this works
            // across releases: a constructor class, a factory, or a default
            // export. If the shape is unknown, surface a helpful error.
            let client: any = null;
            const GoogleGenerativeAI = genaiModule?.GoogleGenerativeAI ?? genaiModule?.Generative ?? genaiModule?.default ?? genaiModule;

            if (typeof GoogleGenerativeAI === 'function') {
                // class or constructor-style API
                client = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
            } else if (GoogleGenerativeAI && typeof GoogleGenerativeAI.create === 'function') {
                // factory/create-style API
                client = await GoogleGenerativeAI.create({ apiKey: import.meta.env.VITE_API_KEY });
            } else if (typeof genaiModule === 'function') {
                client = new genaiModule(import.meta.env.VITE_API_KEY);
            }

            const model = client?.getGenerativeModel ? client.getGenerativeModel({ model: 'gemini-pro' }) : client;

            const prompt = `
                Analyze the following metrics for the NovoPath Medical platform and provide a concise, insightful summary (around 100-150 words) for an administrator.
                Focus on key trends, potential areas of concern, and actionable recommendations. Be professional and data-driven.

                **Key Metrics:**
                - Total Users: ${stats.totalUsers} (${stats.totalProviders} Providers, ${stats.totalPatients} Patients)
                - Pending Provider Verifications: ${stats.pendingVerifications}
                - Estimated Monthly Revenue: $${stats.monthlyRevenue.toFixed(2)}

                **Monthly Revenue Growth:**
                ${revenueData.map(d => `${d.month}: $${d.revenue.toFixed(2)}`).join('\n')}

                **User Distribution:**
                ${userRoleData.map(d => `${d.name}: ${d.value}`).join(', ')}

                **System Health:**
                - Uptime: ${systemHealth?.uptime}%
                - API Error Rate: ${systemHealth?.errorRate}%
                - Average Response Time: ${systemHealth?.responseTime}ms

                **Predictive Analytics:**
                - 3-Month User Growth Prediction: +${Math.round(predictiveAnalytics?.userGrowthPrediction || 0)} users
                - Revenue Projection: $${Math.round(predictiveAnalytics?.revenueProjection || 0)}
                - Predicted Churn Rate: ${predictiveAnalytics?.churnRate}%

                Based on this data, what are the most critical insights an administrator should be aware of?
            `;

            if (!model || typeof model.generateContent !== 'function') {
                throw new Error('Loaded generative model does not expose `generateContent`. The @google/genai package shape may differ.');
            }

            const result = await model.generateContent(prompt);
            // The response shape can vary; try common access patterns safely.
            const responseText =
                (result?.response && typeof result.response.text === 'function') ? result.response.text() :
                (typeof result === 'string' ? result : (result?.text ?? JSON.stringify(result)));

            setAiSummary(responseText as string);
        } catch (error) {
            console.error("Error generating AI summary:", error);
            setSummaryError('Failed to generate insights. Please check the API key and try again.');
        } finally {
            setIsSummaryLoading(false);
        }
    }, [stats, revenueData, userRoleData, systemHealth, predictiveAnalytics]);

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