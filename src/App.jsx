import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChevronDown, Book, Target, Calendar, BarChart2, Edit, CheckCircle, Clock, XCircle, Users, Settings, LogOut, Menu, X } from 'lucide-react';

// --- MOCK DATA (to be replaced with Firebase) ---
const initialSyllabus = {
  "Engineering Mathematics": {
    topics: ["Linear Algebra", "Calculus", "Differential Equations", "Complex Variables", "Probability and Statistics", "Numerical Methods"],
  },
  "Thermodynamics": {
    topics: ["Basic Concepts", "First Law", "Second Law", "Entropy", "Properties of Pure Substances", "Thermodynamic Relations"],
  },
  "Strength of Materials": {
    topics: ["Stress and Strain", "Mohr's Circle", "Shear Force and Bending Moment", "Deflection of Beams", "Torsion of Circular Shafts", "Columns and Struts"],
  },
  "Fluid Mechanics": {
    topics: ["Fluid Properties", "Fluid Statics", "Fluid Kinematics", "Fluid Dynamics", "Boundary Layer", "Flow through Pipes"],
  },
  "Theory of Machines": {
    topics: ["Mechanisms and Machines", "Velocity and Acceleration Analysis", "Gears and Gear Trains", "Flywheels", "Vibrations"],
  },
  "Machine Design": {
    topics: ["Static and Dynamic Loading", "Joints: Welded, Riveted, Bolted", "Shafts, Keys, and Couplings", "Bearings", "Clutches and Brakes"],
  },
  "Heat Transfer": {
    topics: ["Conduction", "Convection", "Radiation", "Heat Exchangers"],
  },
  "Manufacturing Engineering": {
    topics: ["Casting, Forming and Joining", "Machining and Machine Tool Operations", "Metrology and Inspection", "Computer Integrated Manufacturing"],
  }
};

const STATUSES = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

// --- HELPER FUNCTIONS ---
const getStatusRingColor = (status) => {
    switch (status) {
      case STATUSES.COMPLETED: return "stroke-green-500";
      case STATUSES.IN_PROGRESS: return "stroke-yellow-500";
      case STATUSES.NOT_STARTED: return "stroke-gray-400";
      default: return "stroke-gray-400";
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
            onClick={(e) => {
                e.preventDefault();
                setCurrentPage(id);
                if (isSidebarOpen) setSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentPage === id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            <Icon className="w-5 h-5 mr-3" />
            <span>{label}</span>
        </a>
    );

    return (
        <>
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-xl transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-between h-16 px-6 border-b dark:border-gray-700">
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">GATETrackr</h1>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    {navItems.map(item => <NavLink key={item.id} {...item} />)}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
                    <NavLink id="settings" label="Settings" icon={Settings} />
                    <NavLink id="logout" label="Logout" icon={LogOut} />
                </div>
            </aside>
            {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden"></div>}
        </>
    );
};


const Header = ({ setSidebarOpen }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const gateExamDate = new Date('2026-02-07T09:00:00'); // Assuming first Saturday of Feb 2026
        
        const updateCountdown = () => {
            const now = new Date();
            const difference = gateExamDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m`);
            } else {
                setTimeLeft('Exam Day!');
            }
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b dark:border-gray-700 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 dark:text-gray-300">
                <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Welcome back, Aspirant!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Let's crack GATE together.</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <Calendar className="w-4 h-4" />
                    <span>GATE '26 Countdown:</span>
                    <span className="font-mono">{timeLeft}</span>
                </div>
            </div>
        </header>
    );
};

const Card = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 ${className}`}>
        {children}
    </div>
);

const SubjectProgressChart = ({ progressData }) => {
    const data = useMemo(() => {
        const completed = progressData.filter(s => s.progress === 100).length;
        const inProgress = progressData.filter(s => s.progress > 0 && s.progress < 100).length;
        const notStarted = progressData.filter(s => s.progress === 0).length;
        return [
            { name: 'Completed', value: completed, color: '#10B981' },
            { name: 'In Progress', value: inProgress, color: '#F59E0B' },
            { name: 'Not Started', value: notStarted, color: '#6B7280' },
        ];
    }, [progressData]);

    const overallProgress = useMemo(() => {
        if (progressData.length === 0) return 0;
        const total = progressData.reduce((acc, s) => acc + s.progress, 0);
        return Math.round(total / progressData.length);
    }, [progressData]);

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Overall Progress</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={5} startAngle={90} endAngle={450}>
                                {data.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} stroke={entry.color} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{overallProgress}%</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Complete</span>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    {data.map(item => (
                        <div key={item.name} className="flex items-center text-sm">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-600 dark:text-gray-300">{item.name}:</span>
                            <span className="font-semibold ml-1 text-gray-800 dark:text-gray-100">{item.value} subjects</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const DailyGoalTracker = () => {
    const streak = 7; // Mock data
    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Daily Goal</h3>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 dark:text-gray-300">Today's plan: 3 topics</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2/3 completed</p>
                </div>
                <div className="flex items-center space-x-2 text-orange-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45.385c-.345.87.312 1.819.824 2.216l.29.153a1 1 0 001.275-.21l.22-.39a1 1 0 00-.386-1.45l-.292-.154a1 1 0 00-.823-.211zM11.645 15.953c-.345.87.312 1.819.824 2.216l.29.153a1 1 0 001.275-.21l.22-.39a1 1 0 00-.386-1.45l-.292-.154a1 1 0 00-.823-.211zM6.29 18.253c.345-.87-.312-1.819-.824-2.216l-.29-.153a1 1 0 00-1.275.21l-.22.39a1 1 0 00.386 1.45l.292.154a1 1 0 00.823.211zm-3.29-5.953c.87.345 1.819-.312 2.216-.824l.153-.29a1 1 0 00-.21-1.275l-.39-.22a1 1 0 00-1.45.386l-.154.292a1 1 0 00.21.823z" clipRule="evenodd"></path><path d="M9 11a1 1 0 100-2 1 1 0 000 2z"></path><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5z" clipRule="evenodd"></path></svg>
                    <span className="text-2xl font-bold">{streak}</span>
                    <span className="text-sm">Day Streak</span>
                </div>
            </div>
        </Card>
    );
};


const MockTestPerformance = () => {
    const data = [
        { name: 'Test 1', score: 45 },
        { name: 'Test 2', score: 52 },
        { name: 'Test 3', score: 61 },
        { name: 'Test 4', score: 58 },
        { name: 'Test 5', score: 65 },
    ];
    return (
        <Card className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Mock Test Performance</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="rgb(107 114 128)" fontSize={12} />
                        <YAxis stroke="rgb(107 114 128)" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                borderColor: 'rgba(55, 65, 81, 1)',
                                color: '#fff',
                                borderRadius: '0.5rem'
                            }}
                            cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                        />
                        <Legend wrapperStyle={{fontSize: "14px"}} />
                        <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const Dashboard = ({ progressData }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Dashboard</h2>
        </div>
        <SubjectProgressChart progressData={progressData} />
        <DailyGoalTracker />
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Rank Projection</h3>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">AIR ~1500</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Based on last mock test</p>
        </Card>
        <MockTestPerformance />
    </div>
);


const TopicItem = ({ topic, status, onStatusChange }) => {
    const StatusIcon = ({ status }) => {
        switch (status) {
            case STATUSES.COMPLETED: return <CheckCircle className="w-5 h-5 text-green-500" />;
            case STATUSES.IN_PROGRESS: return <Clock className="w-5 h-5 text-yellow-500" />;
            case STATUSES.NOT_STARTED: return <XCircle className="w-5 h-5 text-gray-400" />;
            default: return null;
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
                <StatusIcon status={status} />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{topic}</span>
            </div>
            <div className="flex space-x-1">
                <button onClick={() => onStatusChange(STATUSES.NOT_STARTED)} className={`p-1 rounded-full transition-colors ${status === STATUSES.NOT_STARTED ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`} title="Not Started">
                    <XCircle className="w-5 h-5 text-gray-400" />
                </button>
                <button onClick={() => onStatusChange(STATUSES.IN_PROGRESS)} className={`p-1 rounded-full transition-colors ${status === STATUSES.IN_PROGRESS ? 'bg-yellow-200 dark:bg-yellow-800' : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/50'}`} title="In Progress">
                    <Clock className="w-5 h-5 text-yellow-500" />
                </button>
                <button onClick={() => onStatusChange(STATUSES.COMPLETED)} className={`p-1 rounded-full transition-colors ${status === STATUSES.COMPLETED ? 'bg-green-200 dark:bg-green-800' : 'hover:bg-green-100 dark:hover:bg-green-900/50'}`} title="Completed">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                </button>
            </div>
        </div>
    );
};

const SubjectCard = ({ subject, topics, progress, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="!p-0 overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 text-left">
                <div className="flex items-center">
                     <div className="relative w-12 h-12 mr-4">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="stroke-gray-200 dark:stroke-gray-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                            <path className={`${getStatusRingColor(progress === 100 ? STATUSES.COMPLETED : progress > 0 ? STATUSES.IN_PROGRESS : STATUSES.NOT_STARTED)} transition-all duration-500`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                strokeWidth="3"
                                strokeDasharray={`${progress}, 100`}
                                strokeLinecap="round"
                                transform="rotate(90 18 18)"
                            ></path>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{progress}%</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{subject}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{topics.length} topics</p>
                    </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-5 border-t dark:border-gray-700">
                    <div className="space-y-2">
                        {topics.map((topic, index) => (
                            <TopicItem
                                key={index}
                                topic={topic.name}
                                status={topic.status}
                                onStatusChange={(newStatus) => onStatusChange(subject, index, newStatus)}
                            />
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
    
    const progressData = useMemo(() => {
        return Object.entries(subjectsData).map(([subject, data]) => {
            const completedTopics = data.topics.filter(t => t.status === STATUSES.COMPLETED).length;
            const progress = Math.round((completedTopics / data.topics.length) * 100);
            return { subject, progress, topics: data.topics };
        });
    }, [subjectsData]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Subjects & Topics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {progressData.map(({ subject, progress, topics }) => (
                    <SubjectCard
                        key={subject}
                        subject={subject}
                        topics={topics}
                        progress={progress}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    // Initialize subjects data with status
    const [subjectsData, setSubjectsData] = useState(() => {
        const enhancedSyllabus = {};
        for (const subject in initialSyllabus) {
            enhancedSyllabus[subject] = {
                topics: initialSyllabus[subject].topics.map(topicName => ({
                    name: topicName,
                    status: STATUSES.NOT_STARTED
                }))
            };
        }
        return enhancedSyllabus;
    });

    const progressData = useMemo(() => {
        return Object.entries(subjectsData).map(([subject, data]) => {
            const completedTopics = data.topics.filter(t => t.status === STATUSES.COMPLETED).length;
            const progress = data.topics.length > 0 ? Math.round((completedTopics / data.topics.length) * 100) : 0;
            return { name: subject, progress };
        });
    }, [subjectsData]);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard progressData={progressData} />;
            case 'subjects':
                return <Subjects subjectsData={subjectsData} setSubjectsData={setSubjectsData} />;
            // Add other cases for planner, pyqs, etc. later
            default:
                return <Dashboard progressData={progressData} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="lg:ml-64 flex flex-col">
                <Header setSidebarOpen={setSidebarOpen} />
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
