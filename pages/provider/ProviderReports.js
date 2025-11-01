"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Card_1 = require("../../components/shared/Card");
var recharts_1 = require("recharts");
var PageHeader_1 = require("../../components/shared/PageHeader");
// Mock Data - Populated
var appointmentData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 18 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 22 },
    { name: 'Fri', count: 14 },
];
var demographicData = [
    { name: '0-18', value: 40 },
    { name: '19-40', value: 120 },
    { name: '41-65', value: 95 },
    { name: '65+', value: 60 },
];
var COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];
var ProviderReports = function () {
    return (<div>
      <PageHeader_1.default title="Practice Reports"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card_1.default className="text-center"><p className="text-3xl font-bold text-primary-600">79</p><p className="text-gray-500">Appointments This Week</p></Card_1.default>
        <Card_1.default className="text-center"><p className="text-3xl font-bold text-tangerine">315</p><p className="text-gray-500">Active Patients</p></Card_1.default>
        <Card_1.default className="text-center"><p className="text-3xl font-bold text-green-600">98.2%</p><p className="text-gray-500">Billing Success Rate</p></Card_1.default>
        <Card_1.default className="text-center"><p className="text-3xl font-bold text-red-500">4</p><p className="text-gray-500">No-shows This Week</p></Card_1.default>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card_1.default title="Appointments This Week">
          <recharts_1.ResponsiveContainer width="100%" height={300}>
            <recharts_1.BarChart data={appointmentData}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="name"/>
              <recharts_1.YAxis />
              <recharts_1.Tooltip />
              <recharts_1.Legend />
              <recharts_1.Bar dataKey="count" fill="#3b82f6" name="Appointments"/>
            </recharts_1.BarChart>
          </recharts_1.ResponsiveContainer>
        </Card_1.default>
        <Card_1.default title="Patient Demographics (By Age)">
          <recharts_1.ResponsiveContainer width="100%" height={300}>
            <recharts_1.PieChart>
              <recharts_1.Pie data={demographicData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label>
                {demographicData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>); })}
              </recharts_1.Pie>
              <recharts_1.Tooltip />
              <recharts_1.Legend />
            </recharts_1.PieChart>
          </recharts_1.ResponsiveContainer>
        </Card_1.default>
      </div>
    </div>);
};
exports.default = ProviderReports;
