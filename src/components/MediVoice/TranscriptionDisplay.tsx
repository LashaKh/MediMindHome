import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Copy, CheckCircle, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { TranscriptionDisplayProps } from './types';
import { AudioPlayer } from './AudioPlayer';
import { TranscriptPanel } from './TranscriptPanel';
import { ClinicalSummaryPanel } from './ClinicalSummaryPanel';
import { processTranscriptData } from './transcriptProcessor';

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcript,
  clinicalSummary,
  audioFile
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSummaryText, setSelectedSummaryText] = useState<string | null>(null);
  const [matchedTranscriptIndices, setMatchedTranscriptIndices] = useState<number[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const transcriptContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Process transcript data to get speaker segments
  const transcriptItems = React.useMemo(() => {
    return processTranscriptData(transcript);
  }, [transcript]);

  // Log the processed transcript items for debugging
  React.useEffect(() => {
    console.log('Processed transcript items:', transcriptItems.length);
  }, [transcriptItems]);

  // Function to find matching segments in transcript based on summary text
  const findMatchingTranscriptSegments = (summaryText: string) => {
    if (!summaryText || !transcriptItems.length) return [];
    
    // Clean and prepare text for comparison
    const cleanText = summaryText.toLowerCase().trim();
    // Break into keywords (words with 4+ characters)
    const keywords = cleanText
      .split(/\s+/)
      .filter((word: string) => word.length >= 4)
      .map((word: string) => word.replace(/[.,;:!?]$/g, '')); // Remove trailing punctuation
    
    if (keywords.length === 0) return [];
    
    console.log('Searching for keywords:', keywords);
    
    // Score each transcript segment based on keyword matches
    const scoredSegments = transcriptItems.map((segment, index) => {
      const content = segment.content.toLowerCase();
      
      // Count how many keywords appear in this segment
      const matchCount = keywords.filter((keyword: string) => content.includes(keyword)).length;
      
      // Calculate relevance score (0-100)
      const relevanceScore = (matchCount / keywords.length) * 100;
      
      return {
        index,
        score: relevanceScore,
        hasExactMatch: content.includes(cleanText)
      };
    });
    
    // Sort by score (descending) and filter segments with at least one keyword match
    const matches = scoredSegments
      .filter((item) => item.score > 20 || item.hasExactMatch) // At least 20% relevant or has exact match
      .sort((a, b) => 
        b.score - a.score || (b.hasExactMatch ? 1 : 0) - (a.hasExactMatch ? 1 : 0));
    
    console.log('Found matching segments:', matches);
    
    // Return indices of matching segments (top 3 max)
    return matches.slice(0, 3).map((match) => match.index);
  };

  // Handler for when user clicks on a clinical summary item
  const handleSummaryItemClick = (text: string) => {
    console.log('Clinical summary item clicked:', text);
    setSelectedSummaryText(text);
    
    const matchedIndices = findMatchingTranscriptSegments(text);
    setMatchedTranscriptIndices(matchedIndices);
    
    // Scroll to the first match if any
    if (matchedIndices.length > 0 && transcriptContainerRef.current) {
      setTimeout(() => {
        const firstMatchElement = document.getElementById(`transcript-segment-${matchedIndices[0]}`);
        if (firstMatchElement) {
          firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handlePlaySegment = (time: number) => {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement && !isNaN(time)) {
      audioElement.currentTime = time;
      audioElement.play().catch(console.error);
    }
  };

  const handleClearSelection = () => {
    setSelectedSummaryText(null);
    setMatchedTranscriptIndices([]);
  };

  const handleCopyTranscript = () => {
    if (!transcriptItems.length) return;
    
    const fullText = transcriptItems.map(item => {
      return `${item.role ? `${item.role}: ` : ''}${item.content}`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSaveTranscript = () => {
    setIsSaved(!isSaved);
  };

  const handleDownloadTranscript = () => {
    if (!transcriptItems.length) return;
    
    const fullText = transcriptItems.map(item => {
      return `${item.role ? `${item.role}: ` : ''}${item.content}`;
    }).join('\n\n');
    
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Transcription Results</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {audioFile ? audioFile.name : 'Audio transcription'}
              {audioFile && <span className="ml-2">({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSaveTranscript}
            className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            title={isSaved ? "Remove from saved" : "Save transcript"}
          >
            {isSaved ? 
              <BookmarkCheck className="w-5 h-5" /> : 
              <Bookmark className="w-5 h-5" />
            }
          </button>
          <button 
            onClick={handleCopyTranscript}
            className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            title="Copy to clipboard"
          >
            {isCopied ? 
              <CheckCircle className="w-5 h-5 text-green-500" /> : 
              <Copy className="w-5 h-5" />
            }
          </button>
          <button 
            onClick={handleDownloadTranscript}
            className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            title="Download as text file"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            title="Share transcript"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Audio Player */}
      {audioFile && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 p-4"
        >
          <AudioPlayer 
            audioFile={audioFile}
            onTimeUpdate={setCurrentTime}
          />
        </motion.div>
      )}

      {/* Tabs for mobile view */}
      <div className="block md:hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-2" aria-label="Tabs">
            <button
              className="px-3 py-2 text-sm font-medium border-b-2 border-primary text-primary"
              aria-current="page"
            >
              Transcript
            </button>
            <button
              className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clinical Summary
            </button>
          </nav>
        </div>
      </div>

      {/* Side-by-side Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transcript Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TranscriptPanel
            transcriptItems={transcriptItems}
            currentTime={currentTime}
            selectedSummaryText={selectedSummaryText}
            matchedTranscriptIndices={matchedTranscriptIndices}
            onPlaySegment={handlePlaySegment}
            transcriptContainerRef={transcriptContainerRef}
          />
        </motion.div>

        {/* Clinical Summary Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ClinicalSummaryPanel
            clinicalSummary={clinicalSummary}
            selectedSummaryText={selectedSummaryText}
            matchedTranscriptIndices={matchedTranscriptIndices}
            onSummaryItemClick={handleSummaryItemClick}
            onClearSelection={handleClearSelection}
          />
        </motion.div>
      </div>
    </div>
  );
};