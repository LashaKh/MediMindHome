import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';
import { format } from 'date-fns';
import type { ABGResult } from '../../../store/useABGStore';

interface ABGTrendsChartProps {
  results: ABGResult[];
  patientId: string;
}

interface ChartDataPoint {
  timestamp: number;
  formattedDate: string;
  pH?: number;
  pCO2?: number;
  pO2?: number;
  HCO3?: number;
  BE?: number;
  sO2?: number;
  lactate?: number;
}

interface Parameter {
  key: string;
  label: string;
  color: string;
  range: string;
  unit: string;
  visible: boolean;
}

// This improved extractor tries multiple regex patterns to find values
const extractNumericValue = (text: string, parameter: string): number | undefined => {
  // Add more aggressive extraction that looks for any numbers near parameter mentions
  // This is a last resort method
  const findNumbersNearParameter = (text: string, parameter: string): number[] => {
    // Define a context window around parameter mentions
    const contextRegex = new RegExp(`(\\S{0,30}${parameter}\\S{0,50})`, 'gi');
    const contexts: string[] = [];
    
    let match;
    while ((match = contextRegex.exec(text)) !== null) {
      contexts.push(match[1]);
    }
    
    // Extract all numbers from these contexts
    const numbers: number[] = [];
    for (const context of contexts) {
      const numberMatches = context.match(/[-+]?\d+\.?\d*/g);
      if (numberMatches) {
        for (const numStr of numberMatches) {
          const num = parseFloat(numStr);
          if (!isNaN(num)) {
            numbers.push(num);
          }
        }
      }
    }
    
    return numbers;
  };
  
  // Sanity check for extracted numbers
  const isValidValue = (value: number, parameter: string): boolean => {
    if (parameter === 'pH' && (value >= 6.5 && value <= 8.0)) return true;
    if (parameter === 'pCO2' && (value >= 10 && value <= 150)) return true;
    if (parameter === 'pO2' && (value >= 20 && value <= 700)) return true;
    if (parameter === 'HCO3' && (value >= 5 && value <= 50)) return true;
    if (parameter === 'BE' && (value >= -30 && value <= 30)) return true;
    if (parameter === 'sO2' && (value >= 30 && value <= 100)) return true;
    if (parameter === 'lactate' && (value >= 0 && value <= 30)) return true;
    return false;
  };

  // Additional common ABG report formatting patterns
  // Sometimes values are presented in tabular format with labels followed by values
  if (parameter === 'pCO2' && text.match(/pCO2|PCO2|Carbon dioxide/i)) {
    // First try to find direct matches
    const directMatches = [
      /pCO2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /PCO2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /CO2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /pCO2\D+(\d+\.?\d*)/i,
      /PCO2\D+(\d+\.?\d*)/i
    ];
    
    for (const regex of directMatches) {
      const match = text.match(regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (value >= 10 && value <= 150) return value;
      }
    }
  }
  
  if (parameter === 'pO2' && text.match(/pO2|PO2|Oxygen|O2/i)) {
    // First try to find direct matches
    const directMatches = [
      /pO2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /PO2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /O2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /pO2\D+(\d+\.?\d*)/i,
      /PO2\D+(\d+\.?\d*)/i
    ];
    
    for (const regex of directMatches) {
      const match = text.match(regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (value >= 20 && value <= 700) return value;
      }
    }
  }
  
  if (parameter === 'HCO3' && text.match(/HCO3|Bicarbonate|bicarb/i)) {
    // First try to find direct matches
    const directMatches = [
      /HCO3\s*[:=\s-]\s*(\d+\.?\d*)/i,
      /HCO3-\s*[:=\s]\s*(\d+\.?\d*)/i,
      /Bicarbonate\s*[:=\s]\s*(\d+\.?\d*)/i,
      /Bicarb\s*[:=\s]\s*(\d+\.?\d*)/i,
      /HCO3\D+(\d+\.?\d*)/i
    ];
    
    for (const regex of directMatches) {
      const match = text.match(regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (value >= 5 && value <= 50) return value;
      }
    }
  }
  
  if (parameter === 'BE' && text.match(/BE|Base Excess|Base Deficit/i)) {
    // First try to find direct matches
    const directMatches = [
      /BE\s*[:=\s]\s*([+-]?\d+\.?\d*)/i,
      /Base Excess\s*[:=\s]\s*([+-]?\d+\.?\d*)/i,
      /Base Deficit\s*[:=\s]\s*([+-]?\d+\.?\d*)/i,
      /BE\D+([+-]?\d+\.?\d*)/i
    ];
    
    for (const regex of directMatches) {
      const match = text.match(regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (value >= -30 && value <= 30) return value;
      }
    }
  }
  
  if (parameter === 'sO2' && text.match(/sO2|SO2|O2 sat|oxygen saturation/i)) {
    // First try to find direct matches
    const directMatches = [
      /sO2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /SO2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /O2 sat\s*[:=\s]\s*(\d+\.?\d*)/i,
      /Saturation\s*[:=\s]\s*(\d+\.?\d*)/i,
      /SaO2\s*[:=\s]\s*(\d+\.?\d*)/i,
      /sO2\D+(\d+\.?\d*)/i,
      /SO2\D+(\d+\.?\d*)/i
    ];
    
    for (const regex of directMatches) {
      const match = text.match(regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (value >= 30 && value <= 100) return value;
      }
    }
  }
  
  if (parameter === 'lactate' && text.match(/lactate|lactic acid|lac/i)) {
    // First try to find direct matches
    const directMatches = [
      /lactate\s*[:=\s]\s*(\d+\.?\d*)/i,
      /Lactic acid\s*[:=\s]\s*(\d+\.?\d*)/i,
      /Lac\s*[:=\s]\s*(\d+\.?\d*)/i,
      /lactate\D+(\d+\.?\d*)/i,
      /Lac\D+(\d+\.?\d*)/i
    ];
    
    for (const regex of directMatches) {
      const match = text.match(regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        if (value >= 0 && value <= 30) return value;
      }
    }
  }

  // Parameter aliases to handle different representations
  const paramAliases: Record<string, string[]> = {
    'pH': ['pH', 'PH'],
    'pCO2': ['pCO2', 'PCO2', 'pCO₂', 'PCO₂', 'CO2', 'CO₂'],
    'pO2': ['pO2', 'PO2', 'pO₂', 'PO₂', 'O2', 'O₂'],
    'HCO3': ['HCO3', 'HCO₃', 'HCO3-', 'HCO₃-', 'Bicarbonate', 'BICARBONATE'],
    'BE': ['BE', 'Base Excess', 'Base excess', 'base excess', 'BaseExcess'],
    'sO2': ['sO2', 'SO2', 'sO₂', 'SO₂', 'O2 Sat', 'O₂ Sat', 'SaO2', 'SaO₂', 'Saturation'],
    'lactate': ['lactate', 'LACTATE', 'Lac', 'LAC', 'Lactic Acid']
  };

  // Get the aliases for this parameter
  const aliases = paramAliases[parameter] || [parameter];

  // Try each alias
  for (const alias of aliases) {
    // Try multiple patterns to match different formats in the text
    const patterns = [
      // Pattern 1: "pH: 7.4", "pH : 7.4", etc.
      new RegExp(`${alias}\\s*[:=]\\s*([\\d.]+)`, 'i'),
      
      // Pattern 2: "pH 7.4", "pH  7.4", etc.
      new RegExp(`${alias}\\s+([\\d.]+)`, 'i'),
      
      // Pattern 3: "pH=7.4", "pH = 7.4", etc.
      new RegExp(`${alias}\\s*=\\s*([\\d.]+)`, 'i'),
      
      // Pattern 4: "pH-7.4", "pH - 7.4", etc.
      new RegExp(`${alias}\\s*-\\s*([\\d.]+)`, 'i'),
      
      // Pattern 5: "pH: 7.4 mmHg", "pH: 7.4mmHg", etc. (with units)
      new RegExp(`${alias}\\s*[:=]\\s*([\\d.]+)\\s*[a-z%]+`, 'i'),
      
      // Pattern 6: Values inside brackets like "[pH 7.4]"
      new RegExp(`\\[${alias}\\s*[:=\\s-]*([\\d.]+)\\]`, 'i'),
      
      // Pattern 7: Table format like "pH........ 7.4"
      new RegExp(`${alias}[.\\s]+([\\d.]+)`, 'i'),
      
      // Pattern 8: Generic broader pattern as fallback
      new RegExp(`${alias}[^\\d]+(\\d+\\.?\\d*)`, 'i')
    ];
    
    // Try each pattern in sequence
    for (const regex of patterns) {
      const match = text.match(regex);
      if (match && match[1]) {
        const value = parseFloat(match[1]);
        // Basic sanity checks for each parameter to filter out nonsensical values
        if (parameter === 'pH' && (value < 6.5 || value > 8.0)) continue;
        if (parameter === 'pCO2' && (value < 10 || value > 150)) continue;
        if (parameter === 'pO2' && (value < 20 || value > 700)) continue;
        if (parameter === 'HCO3' && (value < 5 || value > 50)) continue;
        if (parameter === 'BE' && (value < -30 || value > 30)) continue;
        if (parameter === 'sO2' && (value < 30 || value > 100)) continue;
        if (parameter === 'lactate' && (value < 0 || value > 30)) continue;
        
        // Return the value if it passes sanity checks
        return value;
      }
    }
  }
  
  // Final attempt: Try to find values in a table-like format
  // Many ABG reports are in a tabular format with the parameter name and value aligned
  const tableRegex = new RegExp(`.*${parameter}[^\\n]*?\\s(\\d+\\.?\\d*)`, 'i');
  const tableMatch = text.match(tableRegex);
  if (tableMatch && tableMatch[1]) {
    const value = parseFloat(tableMatch[1]);
    // Apply the same sanity checks
    if (parameter === 'pH' && (value >= 6.5 && value <= 8.0)) return value;
    if (parameter === 'pCO2' && (value >= 10 && value <= 150)) return value;
    if (parameter === 'pO2' && (value >= 20 && value <= 700)) return value;
    if (parameter === 'HCO3' && (value >= 5 && value <= 50)) return value;
    if (parameter === 'BE' && (value >= -30 && value <= 30)) return value;
    if (parameter === 'sO2' && (value >= 30 && value <= 100)) return value;
    if (parameter === 'lactate' && (value >= 0 && value <= 30)) return value;
  }
  
  // Debug logging to help identify issues
  console.log(`Could not extract ${parameter} from text`);
  
  // As a last resort, try to find numbers near parameter mentions
  const nearbyNumbers = findNumbersNearParameter(text, parameter);
  for (const num of nearbyNumbers) {
    if (isValidValue(num, parameter)) {
      console.log(`Found ${parameter} value ${num} using nearby number extraction`);
      return num;
    }
  }
  
  return undefined;
};

export const ABGTrendsChart: React.FC<ABGTrendsChartProps> = ({ results, patientId }) => {
  // Define parameters with their properties
  const [parameters, setParameters] = useState<Parameter[]>([
    { key: 'pH', label: 'pH', color: '#8884d8', range: '7.35-7.45', unit: '', visible: true },
    { key: 'pCO2', label: 'pCO2', color: '#82ca9d', range: '35-45', unit: 'mmHg', visible: true },
    { key: 'pO2', label: 'pO2', color: '#ffc658', range: '80-100', unit: 'mmHg', visible: true },
    { key: 'HCO3', label: 'HCO3', color: '#ff7300', range: '22-26', unit: 'mEq/L', visible: true },
    { key: 'BE', label: 'Base Excess', color: '#00C49F', range: '-2 to +2', unit: 'mEq/L', visible: true },
    { key: 'sO2', label: 'sO2', color: '#ff0000', range: '95-100', unit: '%', visible: true },
    { key: 'lactate', label: 'Lactate', color: '#e91e63', range: '0.5-2.2', unit: 'mmol/L', visible: true }
  ]);

  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});

  const toggleParameter = (paramKey: string) => {
    setParameters(prev => prev.map(param => 
      param.key === paramKey ? { ...param, visible: !param.visible } : param
    ));
  };

  const chartData = useMemo(() => {
    // Filter results for the selected patient and sort by date
    const patientResults = results
      .filter(r => r.patient?.id === patientId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    // Log raw text for debugging
    if (patientResults.length > 0) {
      console.log("Raw analysis samples:", patientResults.map(r => r.raw_analysis));
    }

    // Extract numeric values from raw analysis text
    const data = patientResults.map(result => {
      const extractedValues = {
        timestamp: new Date(result.created_at).getTime(),
        formattedDate: format(new Date(result.created_at), 'MMM d, HH:mm'),
        pH: extractNumericValue(result.raw_analysis, 'pH'),
        pCO2: extractNumericValue(result.raw_analysis, 'pCO2'),
        pO2: extractNumericValue(result.raw_analysis, 'pO2'),
        HCO3: extractNumericValue(result.raw_analysis, 'HCO3'),
        BE: extractNumericValue(result.raw_analysis, 'BE'),
        sO2: extractNumericValue(result.raw_analysis, 'sO2'),
        lactate: extractNumericValue(result.raw_analysis, 'lactate')
      };
      
      // Log extracted values for debugging
      console.log("Extracted values:", extractedValues);
      
      return extractedValues;
    });
    
    // Save debug info
    if (data.length > 0) {
      setDebugInfo({
        rawSamples: patientResults.map(r => r.raw_analysis),
        extractedData: data
      });
    }
    
    return data;
  }, [results, patientId]);

  if (chartData.length < 2) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Not enough data points to show trends.
          At least 2 blood gas analyses are required.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any) => {
              const param = parameters.find(p => p.key === entry.dataKey);
              if (!param) return null;
              return (
                <div
                  key={entry.dataKey}
                  className="flex items-center gap-2"
                  style={{ color: entry.color }}
                >
                  <span className="font-medium">{param.label}:</span>
                  <span>{entry.value} {param.unit}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mt-6">
      {parameters.map(param => (
        <button
          key={param.key}
          onClick={() => toggleParameter(param.key)}
          className={`bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center transition-all ${
            param.visible ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800' : 'opacity-50'
          }`}
        >
          <div
            className="font-medium mb-1"
            style={{ color: param.color }}
          >
            {param.label}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Normal: {param.range} {param.unit}
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Blood Gas Parameters Trends</h3>
        <button 
          onClick={() => setDebugMode(!debugMode)}
          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {debugMode ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>
      
      {debugMode && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Debug Information</h4>
          <details>
            <summary className="cursor-pointer text-blue-600 dark:text-blue-400">Raw Samples</summary>
            <div className="mt-2">
              {debugInfo.rawSamples?.map((sample: string, index: number) => (
                <div key={index} className="mb-4">
                  <div className="font-semibold">Sample {index + 1}</div>
                  <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                    {sample}
                  </pre>
                </div>
              ))}
            </div>
          </details>
          
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600 dark:text-blue-400">Extracted Values</summary>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border">Time</th>
                    <th className="px-2 py-1 border">pH</th>
                    <th className="px-2 py-1 border">pCO2</th>
                    <th className="px-2 py-1 border">pO2</th>
                    <th className="px-2 py-1 border">HCO3</th>
                    <th className="px-2 py-1 border">BE</th>
                    <th className="px-2 py-1 border">sO2</th>
                    <th className="px-2 py-1 border">Lactate</th>
                  </tr>
                </thead>
                <tbody>
                  {debugInfo.extractedData?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-2 py-1 border">{item.formattedDate}</td>
                      <td className="px-2 py-1 border">{item.pH || 'null'}</td>
                      <td className="px-2 py-1 border">{item.pCO2 || 'null'}</td>
                      <td className="px-2 py-1 border">{item.pO2 || 'null'}</td>
                      <td className="px-2 py-1 border">{item.HCO3 || 'null'}</td>
                      <td className="px-2 py-1 border">{item.BE || 'null'}</td>
                      <td className="px-2 py-1 border">{item.sO2 || 'null'}</td>
                      <td className="px-2 py-1 border">{item.lactate || 'null'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="formattedDate"
              tick={{ fill: 'currentColor' }}
              stroke="currentColor"
            />
            <YAxis tick={{ fill: 'currentColor' }} stroke="currentColor" />
            <Tooltip content={<CustomTooltip />} />
            <Brush dataKey="formattedDate" height={30} stroke="#8884d8" />
            
            {parameters.map(param => (
              param.visible && (
                <Line
                  key={param.key}
                  type="monotone"
                  dataKey={param.key}
                  stroke={param.color}
                  name={param.label}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend />
    </div>
  );
}; 