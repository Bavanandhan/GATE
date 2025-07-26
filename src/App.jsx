import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from 'recharts';
import { ChevronDown, Book, Target, Calendar, BarChart2, Edit, CheckCircle, Clock, XCircle, Users, Settings, LogOut, Menu, X, Sun, Moon, ArrowUp } from 'lucide-react';

// --- MOCK DATA ---
const initialSyllabus = {
  "Engineering Mathematics": { topics: ["Linear Algebra", "Calculus", "Differential Equations", "Complex Variables", "Probability and Statistics", "Numerical Methods"] },
  "Thermodynamics": { topics: ["Basic Concepts", "First Law", "Second Law", "Entropy", "Properties of Pure Substances", "Thermodynamic Relations"] },
  "Strength of Materials": { topics: ["Stress and Strain", "Mohr's Circle", "Shear Force and Bending Moment", "Deflection of Beams", "Torsion of Circular Shafts", "Columns and Struts"] },
  "Fluid Mechanics": { topics: ["Fluid Properties", "Fluid Statics", "Fluid Kinematics", "Fluid Dynamics", "Boundary Layer", "Flow through Pipes"] },
  "Theory of Machines": { topics: ["Mechanisms and Machines", "Velocity and Acceleration Analysis", "Gears and Gear Trains", "Flywheels", "Vibrations"] },
  "Machine Design": { topics: ["Static and Dynamic Loading", "Joints: Welded, Riveted, Bolted", "Shafts, Keys, and Couplings", "Bearings", "Clutches and Brakes"] },
  "Heat Transfer": { topics: ["Conduction", "Convection", "Radiation", "Heat Exchangers"] },
  "Manufacturing Engineering": { topics: ["Casting, Forming and Joining", "Machining and Machine Tool Operations", "Metrology and Inspection", "Computer Integrated Manufacturing"] }
};

const STATUSES = { NOT_STARTED: "Not Started", IN_PROGRESS: "In Progress", COMPLETED: "Completed" };

// --- THEME & HELPER FUNCTIONS ---
const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    useEffect(() => {
        const html = window.document.documentElement;
        const prevTheme = isDarkMode ? 'light' : 'dark';
        html.classList.remove(prevTheme);
        const nextTheme = isDarkMode ? 'dark' : 'light';
        html.classList.add(nextTheme);
        localStorage.setItem('theme', nextTheme);
    }, [isDarkMode]);
    return [isDarkMode, setIsDarkMode];
};

const getStatusRingColor = (status) => {
    switch (status) {
      case STATUSES.COMPLETED: return "text-emerald-500";
      case STATUSES.IN_PROGRESS: return "text-sky-500";
      default: return "text-slate-400 dark:text-slate-600";
    }
};

// --- UI COMPONENTS ---

const Sidebar = ({ currentPage, setCurrentPage, isSidebarOpen, setSidebarOpen }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
        { id: 'subjects', label: 'Subjects', icon: Book },
        { id: 'planner', label: 'Planner', icon: Calendar },
        { id: 'pyqs', label: 'PYQs', icon: Edit },
        { id: 'tests', label: 'Tests', icon: Target },
        { id: 'community', label: 'Community', icon: Users },
    ];

    const NavLink = ({ id, label, icon: Icon }) => (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentPage(id); if (isSidebarOpen) setSidebarOpen(false); }}
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                currentPage === id
                    ? 'bg-gradient-to-tr from-sky-500 to-cyan-400 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
            <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${currentPage === id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span>{label}</span>
        </a>
    );

    return (
        <>
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-slate-100 dark:bg-slate-800/70 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 shadow-xl transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">GATETrackr</h1>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 dark:text-slate-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    {navItems.map(item => <NavLink key={item.id} {...item} />)}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-700">
                    <NavLink id="settings" label="Settings" icon={Settings} />
                </div>
            </aside>
            {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden"></div>}
        </>
    );
};

const Header = ({ setSidebarOpen, isDarkMode, setIsDarkMode }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const gateExamDate = new Date('2026-02-07T09:00:00');
        const updateCountdown = () => {
            const difference = gateExamDate - new Date();
            if (difference > 0) {
                const d = Math.floor(difference / (1000 * 60 * 60 * 24));
                const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const m = Math.floor((difference / 1000 / 60) % 60);
                setTimeLeft(`${d}d ${h}h ${m}m`);
            } else { setTimeLeft('Exam Day!'); }
        };
        updateCountdown();
        const intervalId = setInterval(updateCountdown, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between h-20 px-4 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-300">
                <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Welcome back, Aspirant!</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Let's make today count.</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                    <Calendar className="w-5 h-5 text-sky-500" />
                    <span>GATE '26:</span>
                    <span className="font-mono tracking-wider">{timeLeft}</span>
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm">
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
};

const Card = ({ children, className = '', ...props }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`} {...props}>
        {children}
    </div>
);

const SubjectProgressChart = ({ progressData }) => {
    const data = useMemo(() => {
        const completed = progressData.filter(s => s.progress === 100).length;
        const inProgress = progressData.filter(s => s.progress > 0 && s.progress < 100).length;
        const notStarted = progressData.filter(s => s.progress === 0).length;
        return [
            { name: 'Completed', value: completed, color: '#10b981' },
            { name: 'In Progress', value: inProgress, color: '#0ea5e9' },
            { name: 'Not Started', value: notStarted, color: '#64748b' },
        ];
    }, [progressData]);

    const overallProgress = useMemo(() => {
        if (progressData.length === 0) return 0;
        const total = progressData.reduce((acc, s) => acc + s.progress, 0);
        return Math.round(total / progressData.length);
    }, [progressData]);

    return (
        <Card className="p-6 col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Overall Progress</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5} startAngle={90} endAngle={450}>
                                {data.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} stroke="none" />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-4xl font-bold text-slate-800 dark:text-white">{overallProgress}%</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Complete</span>
                    </div>
                </div>
                <div className="flex flex-col space-y-3">
                    {data.map(item => (
                        <div key={item.name} className="flex items-center text-base">
                            <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></span>
                            <span className="text-slate-600 dark:text-slate-300">{item.name}:</span>
                            <span className="font-semibold ml-2 text-slate-800 dark:text-white">{item.value} subjects</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="p-6 flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-gradient-to-br ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </Card>
);

const MockTestPerformance = () => {
    const data = [
        { name: 'Test 1', score: 45, rank: 3200 },
        { name: 'Test 2', score: 52, rank: 2500 },
        { name: 'Test 3', score: 61, rank: 1800 },
        { name: 'Test 4', score: 58, rank: 2100 },
        { name: 'Test 5', score: 65, rank: 1500 },
    ];
    return (
        <Card className="p-6 col-span-1 md:col-span-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Mock Test Analysis</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="rgb(100 116 139)" fontSize={12} />
                        <YAxis yAxisId="left" stroke="rgb(100 116 139)" fontSize={12} label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: 'rgb(100 116 139)' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="rgb(100 116 139)" fontSize={12} label={{ value: 'Rank', angle: 90, position: 'insideRight', fill: 'rgb(100 116 139)'}} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', borderColor: '#e2e8f0', color: '#334155', borderRadius: '0.75rem' }} />
                        <Legend wrapperStyle={{fontSize: "14px"}} />
                        <Line yAxisId="left" type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" dataKey="rank" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const Dashboard = ({ progressData }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SubjectProgressChart progressData={progressData} />
        <StatCard title="Current Streak" value="7 Days" icon={ArrowUp} color="from-amber-500 to-orange-500" />
        <MockTestPerformance />
    </div>
);

const TopicItem = ({ topic, status, onStatusChange }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg group">
            <div className="flex items-center">
                <span className={`w-2.5 h-2.5 rounded-full mr-3 transition-colors ${status === STATUSES.COMPLETED ? 'bg-emerald-500' : status === STATUSES.IN_PROGRESS ? 'bg-sky-500' : 'bg-slate-400'}`}></span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{topic}</span>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onStatusChange(STATUSES.NOT_STARTED)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title="Not Started"><XCircle className="w-5 h-5 text-slate-400" /></button>
                <button onClick={() => onStatusChange(STATUSES.IN_PROGRESS)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title="In Progress"><Clock className="w-5 h-5 text-sky-500" /></button>
                <button onClick={() => onStatusChange(STATUSES.COMPLETED)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title="Completed"><CheckCircle className="w-5 h-5 text-emerald-500" /></button>
            </div>
        </div>
    );
};

const SubjectCard = ({ subject, topics, progress, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Card className="!p-0 overflow-hidden transition-all duration-300">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 text-left">
                <div className="flex items-center">
                     <div className="relative w-12 h-12 mr-4">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="stroke-slate-200 dark:stroke-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4"></path>
                            <path className={`${getStatusRingColor(progress === 100 ? STATUSES.COMPLETED : progress > 0 ? STATUSES.IN_PROGRESS : STATUSES.NOT_STARTED)} transition-all duration-500`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" strokeWidth="4" strokeDasharray={`${progress}, 100`} strokeLinecap="round" transform="rotate(90 18 18)" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{progress}%</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">{subject}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{topics.filter(t=>t.status===STATUSES.COMPLETED).length} / {topics.length} topics</p>
                    </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-700/60">
                    <div className="space-y-2">
                        {topics.map((topic, index) => (
                            <TopicItem key={index} topic={topic.name} status={topic.status} onStatusChange={(newStatus) => onStatusChange(subject, index, newStatus)} />
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

const Subjects = ({ subjectsData, setSubjectsData }) => {
    const handleStatusChange = (subjectName, topicIndex, newStatus) => {
        setSubjectsData(prevData => {
            const newData = { ...prevData };
            newData[subjectName].topics[topicIndex].status = newStatus;
            return newData;
        });
    };
    const progressData = useMemo(() => Object.entries(subjectsData).map(([subject, data]) => {
        const completedTopics = data.topics.filter(t => t.status === STATUSES.COMPLETED).length;
        const progress = data.topics.length > 0 ? Math.round((completedTopics / data.topics.length) * 100) : 0;
        return { subject, progress, topics: data.topics };
    }), [subjectsData]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Subjects & Topics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {progressData.map(({ subject, progress, topics }) => (
                    <SubjectCard key={subject} subject={subject} topics={topics} progress={progress} onStatusChange={handleStatusChange} />
                ))}
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    
    const [subjectsData, setSubjectsData] = useState(() => {
        const enhancedSyllabus = {};
        for (const subject in initialSyllabus) {
            enhancedSyllabus[subject] = { topics: initialSyllabus[subject].topics.map(name => ({ name, status: STATUSES.NOT_STARTED })) };
        }
        return enhancedSyllabus;
    });

    const progressData = useMemo(() => Object.entries(subjectsData).map(([subject, data]) => {
        const completedTopics = data.topics.filter(t => t.status === STATUSES.COMPLETED).length;
        const progress = data.topics.length > 0 ? Math.round((completedTopics / data.topics.length) * 100) : 0;
        return { name: subject, progress };
    }), [subjectsData]);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <Dashboard progressData={progressData} />;
            case 'subjects': return <Subjects subjectsData={subjectsData} setSubjectsData={setSubjectsData} />;
            default: return <Dashboard progressData={progressData} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="lg:ml-64 flex flex-col transition-all duration-300">
                <Header setSidebarOpen={setSidebarOpen} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}

