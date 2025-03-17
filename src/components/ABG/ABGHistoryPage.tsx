import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronDown, 
  Clock, 
  Trash2, 
  ArrowLeft,
  FileText,
  User,
  Info,
  Download,
  Share,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  BarChart2,
  Loader2,
  Settings,
  Send
} from 'lucide-react';
import { useABGStore } from '../../store/useABGStore';
import { ABGResultDisplay } from './ABGResultDisplay';
import { ActionPlanResults } from './components/ActionPlanResults';
import { ABGTrendsChart } from './components/ABGTrendsChart';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'react-hot-toast';
import type { Toast } from 'react-hot-toast';

// Update type imports
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

// Helper function to determine the status of a blood gas analysis
const getAnalysisStatus = (interpretation: string | null) => {
  if (!interpretation) return 'unknown';
  
  const lowerInterpretation = interpretation.toLowerCase();
  
  if (lowerInterpretation.includes('critical') || 
      lowerInterpretation.includes('severe') || 
      lowerInterpretation.includes('urgent')) {
    return 'critical';
  }
  
  if (lowerInterpretation.includes('abnormal') || 
      lowerInterpretation.includes('moderate') || 
      lowerInterpretation.includes('mild')) {
    return 'abnormal';
  }
  
  if (lowerInterpretation.includes('normal') || 
      lowerInterpretation.includes('within range')) {
    return 'normal';
  }
  
  return 'unknown';
};

// Helper function to render status badge
const renderStatusBadge = (status: string) => {
  switch (status) {
    case 'critical':
      return (
        <div className="flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>Critical</span>
        </div>
      );
    case 'abnormal':
      return (
        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-1 rounded-full text-xs">
          <AlertTriangle className="w-3 h-3" />
          <span>Abnormal</span>
        </div>
      );
    case 'normal':
      return (
        <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" />
          <span>Normal</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1 text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
          <Info className="w-3 h-3" />
          <span>Unknown</span>
        </div>
      );
  }
};

const ABGHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { results, loadResults, deleteResult, updateResult, loading, error } = useABGStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    type: string[];
    status: string[];
    patient: string[];
  }>({
    type: [],
    status: [],
    patient: []
  });
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingActionPlan, setIsSendingActionPlan] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showTrendsChart, setShowTrendsChart] = useState(false);

  // Keyboard shortcuts
  useHotkeys('ctrl+f, cmd+f', (e) => {
    e.preventDefault();
    document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
  });

  useHotkeys('esc', () => {
    if (selectedResult) {
      setSelectedResult(null);
    } else if (isFilterMenuOpen) {
      setIsFilterMenuOpen(false);
    }
  });

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // Memoized patient options
  const patientOptions = useMemo(() => {
    const patientMap = new Map();
    results.forEach(result => {
      if (result.patient) {
        patientMap.set(result.patient.id, result.patient);
      }
    });
    return Array.from(patientMap.values());
  }, [results]);

  // Enhanced delete handler with confirmation toast
  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmDelete = () => {
      toast.promise(
        deleteResult(id),
        {
          loading: 'Deleting analysis...',
          success: 'Analysis deleted successfully',
          error: 'Failed to delete analysis'
        }
      );
      if (selectedResult === id) {
        setSelectedResult(null);
      }
    };

    toast((t: Toast) => (
      <div className="flex items-center gap-4">
        <p>Are you sure you want to delete this analysis?</p>
        <button
          onClick={() => {
            confirmDelete();
            toast.dismiss(t.id);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ));
  }, [deleteResult, selectedResult]);

  // Enhanced export handler with loading state
  const handleExport = useCallback(async (result: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExporting(true);
    
    try {
      const data = JSON.stringify(result, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `abg-result-${format(result.created_at, 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Analysis exported successfully');
    } catch (error) {
      toast.error('Failed to export analysis');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleGetActionPlan = async () => {
    const result = results.find(r => r.id === selectedResult);
    if (!result?.interpretation) return;

    const uniqueId = crypto.randomUUID();

    try {
      setIsSendingActionPlan(true);

      const response = await fetch('https://hook.eu2.make.com/my64d4sw14m11sw7513fhskb6bkkvhut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interpretation: result.interpretation,
          timestamp: new Date().toISOString(),
          requestId: uniqueId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get action plan');
      }

      const actionPlan = await response.text();
      
      // Update the result with the new action plan
      await updateResult(result.id, {
        action_plan: actionPlan
      });
      
      // Reload results to get the updated data
      await loadResults();
      
      toast.success('Action plan generated successfully');

    } catch (error) {
      toast.error('Failed to generate action plan');
    } finally {
      setIsSendingActionPlan(false);
    }
  };

  // Function to filter and sort results
  const getFilteredAndSortedResults = () => {
    // First apply search and filters
    let filtered = results.filter(result => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        
        // Search in raw analysis, interpretation, and action plan
        const matchesRawAnalysis = result.raw_analysis?.toLowerCase().includes(searchLower);
        const matchesInterpretation = result.interpretation?.toLowerCase().includes(searchLower);
        const matchesActionPlan = result.action_plan?.toLowerCase().includes(searchLower);
        
        // Search in patient name and diagnosis if available
        const matchesPatientName = result.patient?.name?.toLowerCase().includes(searchLower);
        const matchesPatientDiagnosis = result.patient?.diagnosis?.toLowerCase().includes(searchLower);
        
        if (!(matchesRawAnalysis || matchesInterpretation || matchesActionPlan || 
              matchesPatientName || matchesPatientDiagnosis)) {
          return false;
        }
      }
      
      // Type filter
      if (selectedFilters.type.length > 0 && result.type) {
        if (!selectedFilters.type.includes(result.type)) {
          return false;
        }
      }
      
      // Status filter
      if (selectedFilters.status.length > 0) {
        const status = getAnalysisStatus(result.interpretation);
        if (!selectedFilters.status.includes(status)) {
          return false;
        }
      }
      
      // Patient filter
      if (selectedFilters.patient.length > 0) {
        if (!result.patient || !selectedFilters.patient.includes(result.patient.id)) {
          return false;
        }
      }
      
      // Date range filter
      if (dateRange.start) {
        const resultDate = new Date(result.created_at);
        if (resultDate < dateRange.start) {
          return false;
        }
      }
      
      if (dateRange.end) {
        const resultDate = new Date(result.created_at);
        const endOfDay = new Date(dateRange.end);
        endOfDay.setHours(23, 59, 59, 999);
        
        if (resultDate > endOfDay) {
          return false;
        }
      }
      
      return true;
    });
    
    // Then apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'patientAZ':
          return (a.patient?.name || '').localeCompare(b.patient?.name || '');
        case 'patientZA':
          return (b.patient?.name || '').localeCompare(a.patient?.name || '');
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    
    return filtered;
  };

  const filteredResults = getFilteredAndSortedResults();

  // Toggle filter selection
  const toggleFilter = (filterType: 'type' | 'status' | 'patient', value: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      
      return newFilters;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({ type: [], status: [], patient: [] });
    setDateRange({ start: null, end: null });
    setSearchTerm('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Enhanced Header with Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/bg-analysis')}
              className="mr-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blood Gas Analysis History</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                View, filter, and manage your blood gas analysis results
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/bg-analysis/new')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Analysis</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/bg-analysis/stats')}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="View Statistics"
            >
              <BarChart2 className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/bg-analysis/settings')}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Analyses', value: results.length, color: 'blue' },
            { 
              label: 'Critical Cases', 
              value: results.filter(r => getAnalysisStatus(r.interpretation) === 'critical').length,
              color: 'red'
            },
            { 
              label: 'Abnormal Cases', 
              value: results.filter(r => getAnalysisStatus(r.interpretation) === 'abnormal').length,
              color: 'amber'
            },
            { 
              label: 'Normal Cases', 
              value: results.filter(r => getAnalysisStatus(r.interpretation) === 'normal').length,
              color: 'green'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-${stat.color}-100 dark:border-${stat.color}-900/20`}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
              <p className={`text-2xl font-bold mt-1 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trends Chart Section */}
        {selectedFilters.patient.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Patient Trends Analysis</h2>
              <button
                onClick={() => setShowTrendsChart(!showTrendsChart)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                <span>{showTrendsChart ? 'Hide Chart' : 'Show Chart'}</span>
              </button>
            </div>
            
            <AnimatePresence>
              {showTrendsChart && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ABGTrendsChart
                    results={results}
                    patientId={selectedFilters.patient[0]}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Enhanced Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search analyses (Ctrl + F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filter</span>
                  <motion.div
                    animate={{ rotate: isFilterMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </motion.button>

                {/* Filter Menu */}
                <AnimatePresence>
                  {isFilterMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-4 space-y-4">
                        {/* Type Filter */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Test Type</h4>
                          <div className="space-y-2">
                            {['Arterial Blood Gas', 'Venous Blood Gas'].map(type => (
                              <label key={type} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.type.includes(type)}
                                  onChange={() => toggleFilter('type', type)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Status</h4>
                          <div className="space-y-2">
                            {['normal', 'abnormal', 'critical'].map(status => (
                              <label key={status} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.status.includes(status)}
                                  onChange={() => toggleFilter('status', status)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm capitalize">{status}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Patient Filter */}
                        {patientOptions.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Patient</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {patientOptions.map(patient => (
                                <label key={patient.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedFilters.patient.includes(patient.id)}
                                    onChange={() => toggleFilter('patient', patient.id)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <span className="ml-2 text-sm">{patient.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Date Range Filter */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Date Range</h4>
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
                              <input
                                type="date"
                                value={dateRange.start ? format(dateRange.start, 'yyyy-MM-dd') : ''}
                                onChange={(e) => setDateRange(prev => ({
                                  ...prev,
                                  start: e.target.value ? new Date(e.target.value) : null
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400">To</label>
                              <input
                                type="date"
                                value={dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : ''}
                                onChange={(e) => setDateRange(prev => ({
                                  ...prev,
                                  end: e.target.value ? new Date(e.target.value) : null
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end pt-2 border-t dark:border-gray-700">
                          <button
                            onClick={clearFilters}
                            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="patientAZ">Patient (A-Z)</option>
                <option value="patientZA">Patient (Z-A)</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title={`Switch to ${viewMode === 'list' ? 'Grid' : 'List'} View`}
              >
                {viewMode === 'list' ? (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-1 h-1 bg-current rounded" />
                    <div className="w-1 h-1 bg-current rounded" />
                    <div className="w-1 h-1 bg-current rounded" />
                    <div className="w-1 h-1 bg-current rounded" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <div className="w-4 h-0.5 bg-current rounded" />
                    <div className="w-4 h-0.5 bg-current rounded" />
                    <div className="w-4 h-0.5 bg-current rounded" />
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results List/Grid */}
        <AnimatePresence mode="wait">
          {!loading && !error && (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}
            >
              {filteredResults.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-8 text-center"
                >
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {results.length === 0 
                      ? "You haven't saved any blood gas analyses yet."
                      : "No results match your current filters. Try adjusting your search criteria."}
                  </p>
                  {results.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Clear Filters
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                filteredResults.map((result, index) => {
                  const status = getAnalysisStatus(result.interpretation);
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedResult(result.id)}
                      className={`
                        bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 
                        dark:border-gray-700 p-4 hover:shadow-lg transition-all cursor-pointer
                        ${status === 'critical' ? 'border-l-4 border-l-red-500' : ''}
                        ${status === 'abnormal' ? 'border-l-4 border-l-amber-500' : ''}
                        ${status === 'normal' ? 'border-l-4 border-l-green-500' : ''}
                      `}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{format(new Date(result.created_at), 'MMM d, yyyy h:mm a')}</span>
                            </div>
                            {result.type && (
                              <div className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-gray-300">
                                {result.type}
                              </div>
                            )}
                            {renderStatusBadge(status)}
                          </div>
                          
                          {result.patient && (
                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-700 dark:text-gray-300">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{result.patient.name}</span>
                              {result.patient.diagnosis && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>{result.patient.diagnosis}</span>
                                </>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {result.interpretation ? (
                                result.interpretation
                                  .replace(/\*\*/g, '')
                                  .replace(/##/g, '')
                                  .replace(/###/g, '')
                                  .replace(/<span.*?>/g, '')
                                  .replace(/<\/span>/g, '')
                                  .split('\n')[0]
                              ) : (
                                result.raw_analysis
                                  .replace(/\*\*/g, '')
                                  .replace(/##/g, '')
                                  .replace(/###/g, '')
                                  .replace(/<span.*?>/g, '')
                                  .replace(/<\/span>/g, '')
                                  .split('\n')[0]
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleExport(result, e)}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            title="Export"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(result.id, e)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Modal with Animations */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold">Analysis Details</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      const result = results.find(r => r.id === selectedResult);
                      if (result) handleExport(result, e);
                    }}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    title="Export"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    title="Share"
                  >
                    <Share className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {results.find(r => r.id === selectedResult) && (
                  <div className="space-y-8">
                    {/* Details Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b dark:border-gray-700">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-500">
                            {format(results.find(r => r.id === selectedResult)!.created_at, 'PPpp')}
                          </span>
                        </div>
                        {results.find(r => r.id === selectedResult)?.type && (
                          <div className="mt-1 text-sm font-medium">
                            Test Type: {results.find(r => r.id === selectedResult)?.type}
                          </div>
                        )}
                      </div>
                      
                      {results.find(r => r.id === selectedResult)?.interpretation && (
                        <div>
                          {renderStatusBadge(getAnalysisStatus(results.find(r => r.id === selectedResult)?.interpretation || null))}
                        </div>
                      )}
                    </div>
                    
                    {/* Patient Information (if available) */}
                    {results.find(r => r.id === selectedResult)?.patient && (
                      <>
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Patient Information</h4>
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-5 h-5 text-primary" />
                              <span className="font-medium">{results.find(r => r.id === selectedResult)!.patient!.name}</span>
                            </div>
                            {results.find(r => r.id === selectedResult)!.patient!.diagnosis && (
                              <p className="text-gray-700 dark:text-gray-300">
                                <strong>Diagnosis:</strong> {results.find(r => r.id === selectedResult)!.patient!.diagnosis}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quick Patient Stats */}
                        <div className="mt-8">
                          <button
                            onClick={() => {
                              setSelectedFilters(prev => ({
                                ...prev,
                                patient: [results.find(r => r.id === selectedResult)!.patient!.id]
                              }));
                              setShowTrendsChart(true);
                              setSelectedResult(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            <BarChart2 className="w-4 h-4" />
                            <span>View Patient Trends</span>
                          </button>
                        </div>
                      </>
                    )}
                    
                    {/* Analysis Sections */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Raw Analysis</h4>
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                          {results.find(r => r.id === selectedResult)?.raw_analysis
                            .replace(/\*\*/g, '')
                            .replace(/##/g, '')
                            .replace(/###/g, '')
                            .replace(/<span.*?>/g, '')
                            .replace(/<\/span>/g, '')}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Interpretation</h4>
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                          {results.find(r => r.id === selectedResult)?.interpretation
                            ?.replace(/\*\*/g, '')
                            .replace(/##/g, '')
                            .replace(/###/g, '')
                            .replace(/<span.*?>/g, '')
                            .replace(/<\/span>/g, '')}
                        </p>
                      </div>
                      
                      {/* Add Generate Recommendations button if no action plan exists */}
                      {!results.find(r => r.id === selectedResult)?.action_plan && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={handleGetActionPlan}
                            disabled={isSendingActionPlan}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 shadow-sm flex items-center gap-2"
                          >
                            {isSendingActionPlan ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Generating Action Plan...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                <span>Generate Clinical Recommendations</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Plan Section */}
                    {results.find(r => r.id === selectedResult)?.action_plan && (
                      <ActionPlanResults
                        actionPlan={results.find(r => r.id === selectedResult)!.action_plan!}
                        onSave={() => {}}
                        saveStatus={saveStatus}
                        autoSaved={true}
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ABGHistoryPage; 