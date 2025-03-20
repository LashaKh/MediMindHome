import { SearchResult, ContentType, EvidenceLevel, APISearchParams } from './types';

// Helper function to determine the source based on URL
export function determineMedicalSource(url: string): string {
  try {
    // Extract domain from URL
    const domain = new URL(url).hostname.replace('www.', '');
    
    // Map of known medical journal domains
    const medicalSources: Record<string, string> = {
      'nejm.org': 'New England Journal of Medicine',
      'thelancet.com': 'The Lancet',
      'jamanetwork.com': 'JAMA Network',
      'bmj.com': 'British Medical Journal',
      'nature.com': 'Nature',
      'science.org': 'Science',
      'cell.com': 'Cell',
      'ahajournals.org': 'American Heart Association',
      'nih.gov': 'National Institutes of Health',
      'mayoclinic.org': 'Mayo Clinic',
      'medscape.com': 'Medscape',
      'webmd.com': 'WebMD',
      'pubmed.ncbi.nlm.nih.gov': 'PubMed',
      'uptodate.com': 'UpToDate',
      'cochranelibrary.com': 'Cochrane Library',
      'cdc.gov': 'Centers for Disease Control and Prevention',
      'who.int': 'World Health Organization',
      'hopkinsmedicine.org': 'Johns Hopkins Medicine',
      'aafp.org': 'American Academy of Family Physicians',
      'acponline.org': 'American College of Physicians'
    };
    
    // Check if the domain matches any known medical source
    for (const sourceDomain in medicalSources) {
      if (domain.includes(sourceDomain)) {
        return medicalSources[sourceDomain];
      }
    }
    
    // If no match, return the domain as the source
    return domain;
  } catch (error) {
    // If URL is invalid, return a generic source
    console.warn('Invalid URL:', url);
    return 'Medical Source';
  }
}

// Helper function to determine evidence level based on source
export function determineEvidenceLevel(source: string): EvidenceLevel {
  const highEvidenceSources = [
    'New England Journal of Medicine',
    'The Lancet',
    'JAMA Network',
    'British Medical Journal',
    'Nature',
    'Science',
    'Cell',
    'Cochrane Library',
    'American Heart Association',
    'National Institutes of Health'
  ];
  
  const moderateEvidenceSources = [
    'Mayo Clinic',
    'UpToDate',
    'Centers for Disease Control and Prevention',
    'World Health Organization',
    'Johns Hopkins Medicine',
    'American Academy of Family Physicians',
    'American College of Physicians'
  ];
  
  if (highEvidenceSources.some(s => source.includes(s))) {
    return 'high';
  } else if (moderateEvidenceSources.some(s => source.includes(s))) {
    return 'moderate';
  } else {
    return 'low';
  }
}

// Helper function to determine content type based on title and description
export function determineContentType(title: string, description: string): ContentType {
  const combined = (title + " " + description).toLowerCase();
  
  if (combined.includes('meta-analysis') || combined.includes('systematic review')) {
    return 'meta';
  } else if (combined.includes('case report') || combined.includes('case study') || combined.includes('case series')) {
    return 'case';
  } else if (combined.includes('guideline') || combined.includes('recommendation') || combined.includes('consensus statement')) {
    return 'guideline';
  } else if (combined.includes('news') || combined.includes('press release') || combined.includes('announced')) {
    return 'news';
  } else {
    return 'paper'; // Default to paper for research articles
  }
}

// Helper function to extract key points from a description
export function extractKeyPoints(description: string): string[] {
  if (!description) return ['No key points available'];
  
  // Split the description into sentences
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Take up to 3 sentences as key points
  return sentences.slice(0, 3).map(s => s.trim());
}

// Helper function to get a random recent date
export function getRecentDate(maxDaysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysAgo));
  return date.toISOString().split('T')[0];
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string: string): string {
  return string.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Helper function to generate mock DOI
function generateMockDOI(query: string): string {
  // Generate a realistic looking DOI based on the query
  const prefix = '10.1056';
  const suffix = 'NEJMoa' + Math.floor(Math.random() * 10000000);
  return `${prefix}/${suffix}`;
}

// Helper function to determine specialties based on query
export function determineSpecialties(query: string): string[] {
  // Map common medical terms to specialties
  const specialtyMap: Record<string, string[]> = {
    'heart': ['cardiology'],
    'cardiac': ['cardiology'],
    'cardiogenic': ['cardiology', 'critical care'],
    'shock': ['critical care', 'emergency medicine'],
    'brain': ['neurology'],
    'neuro': ['neurology'],
    'lung': ['pulmonology', 'respiratory medicine'],
    'respiratory': ['pulmonology', 'respiratory medicine'],
    'kidney': ['nephrology'],
    'renal': ['nephrology'],
    'liver': ['hepatology', 'gastroenterology'],
    'stomach': ['gastroenterology'],
    'intestine': ['gastroenterology'],
    'cancer': ['oncology'],
    'tumor': ['oncology'],
    'diabetes': ['endocrinology'],
    'thyroid': ['endocrinology'],
    'hormone': ['endocrinology'],
    'infection': ['infectious disease'],
    'bacteria': ['infectious disease', 'microbiology'],
    'virus': ['infectious disease', 'virology'],
    'bone': ['orthopedics'],
    'joint': ['orthopedics', 'rheumatology'],
    'arthritis': ['rheumatology'],
    'skin': ['dermatology'],
    'pregnancy': ['obstetrics', 'gynecology'],
    'birth': ['obstetrics'],
    'children': ['pediatrics'],
    'pediatric': ['pediatrics'],
    'mental': ['psychiatry'],
    'depression': ['psychiatry'],
    'anxiety': ['psychiatry'],
    'eye': ['ophthalmology'],
    'vision': ['ophthalmology'],
    'ear': ['otolaryngology'],
    'hearing': ['otolaryngology'],
    'blood': ['hematology'],
    'anemia': ['hematology'],
    'immune': ['immunology', 'allergy'],
    'allergy': ['immunology', 'allergy'],
    'surgery': ['surgery'],
    'transplant': ['transplant medicine'],
    'emergency': ['emergency medicine'],
    'trauma': ['emergency medicine', 'trauma surgery'],
    'pain': ['pain management', 'anesthesiology'],
    'sleep': ['sleep medicine', 'neurology'],
    'metabolism': ['endocrinology', 'internal medicine'],
    'nutrition': ['nutrition', 'internal medicine'],
    'geriatric': ['geriatrics'],
    'elderly': ['geriatrics'],
    'genetic': ['genetics', 'genomic medicine'],
    'genome': ['genetics', 'genomic medicine'],
    'primary care': ['general practice', 'family medicine']
  };
  
  // Default specialties if none are matched
  const defaultSpecialties = ['internal medicine', 'general practice'];
  
  // Find matching specialties based on the query terms
  const matchedSpecialties = new Set<string>();
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  queryTerms.forEach(term => {
    Object.keys(specialtyMap).forEach(key => {
      if (term.includes(key) || key.includes(term)) {
        specialtyMap[key].forEach(specialty => matchedSpecialties.add(specialty));
      }
    });
  });
  
  // Return matched specialties or defaults if none matched
  return matchedSpecialties.size > 0 
    ? Array.from(matchedSpecialties) 
    : defaultSpecialties;
}

// Filter results by keywords
export function keywordFilter(results: SearchResult[], query: string): SearchResult[] {
  if (!query.trim()) return results;
  
  const cleanQuery = query.toLowerCase().trim();
  
  // First, try to find exact phrase matches
  const exactMatches = results.filter(result => {
    return result.title.toLowerCase().includes(cleanQuery) ||
           result.abstract.toLowerCase().includes(cleanQuery);
  });
  
  if (exactMatches.length > 0) {
    return exactMatches;
  }
  
  // Otherwise, split into keywords and find partial matches
  const keywords = cleanQuery.split(/\s+/);
  
  return results.filter(result => {
    return keywords.some(keyword => 
      result.title.toLowerCase().includes(keyword) ||
      result.abstract.toLowerCase().includes(keyword)
    );
  });
}

// Apply filters to results
export function filterResults(
  results: SearchResult[], 
  filters?: Partial<APISearchParams['filters']>
): SearchResult[] {
  if (!filters) return results;
  
  return results.filter(result => {
    // Filter by evidence level
    if (
      filters.evidenceLevel && 
      filters.evidenceLevel.length > 0 && 
      !filters.evidenceLevel.includes(result.evidenceLevel)
    ) {
      return false;
    }
    
    // Filter by specialty
    if (
      filters.specialty && 
      filters.specialty.length > 0 && 
      !result.specialty.some(s => filters.specialty?.includes(s))
    ) {
      return false;
    }
    
    // Filter by source
    if (
      filters.source && 
      filters.source.length > 0 && 
      !filters.source.includes(result.source)
    ) {
      return false;
    }
    
    // Filter by recency
    if (filters.recency === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(result.publicationDate) < thirtyDaysAgo) {
        return false;
      }
    }
    
    // Filter by reading time
    if (filters.readingTime === 'short' && result.readingTimeMinutes > 10) {
      return false;
    } else if (filters.readingTime === 'medium' && (result.readingTimeMinutes <= 10 || result.readingTimeMinutes > 30)) {
      return false;
    } else if (filters.readingTime === 'long' && result.readingTimeMinutes <= 30) {
      return false;
    }
    
    return true;
  });
}

// Generate mock results for fallback
export function generateMockResultsForQuery(query: string): SearchResult[] {
  console.log(`Generating mock results for query: ${query}`);
  
  const normalizedQuery = query.toLowerCase();
  const results: SearchResult[] = [];
  
  // Add some specialized mock results for common queries
  if (normalizedQuery.includes('cardiogenic shock')) {
    results.push({
      id: `mock-${Date.now()}-1`,
      title: 'Current Management of Cardiogenic Shock',
      authors: ['Hochman JS', 'Reynolds HR', 'Bangalore S'],
      source: 'Journal of the American College of Cardiology',
      publicationDate: '2023-03-15',
      contentType: 'paper',
      evidenceLevel: 'high',
      specialty: ['cardiology', 'critical care'],
      abstract: 'Cardiogenic shock is characterized by primary cardiac dysfunction resulting in tissue hypoperfusion. Despite advances in reperfusion therapy, mortality remains high. This review focuses on the latest developments in diagnostic criteria, risk stratification, and therapeutic approaches including mechanical circulatory support and pharmacological interventions.',
      keyPoints: [
        'Early revascularization is key for shock due to acute MI',
        'Mechanical circulatory support devices should be considered early', 
        'Multidisciplinary shock teams improve outcomes'
      ],
      url: 'https://www.jacc.org/doi/10.1016/j.jacc.2022.11.010',
      citationCount: 87,
      readingTimeMinutes: 25
    });
  } else if (normalizedQuery.includes('diabetes')) {
    results.push({
      id: `mock-${Date.now()}-1`,
      title: 'Advances in Diabetes Technology and Treatment',
      authors: ['Peters AL', 'Battelino T', 'Peyrot M'],
      source: 'Diabetes Care',
      publicationDate: '2023-01-20',
      contentType: 'paper',
      evidenceLevel: 'high',
      specialty: ['endocrinology', 'primary care'],
      abstract: 'This comprehensive review highlights recent advances in diabetes technology and treatments, focusing on continuous glucose monitoring systems, automated insulin delivery, and novel pharmacological agents including GLP-1 receptor agonists and SGLT2 inhibitors.',
      keyPoints: [
        'CGM technology improves glycemic control',
        'GLP-1 agonists show cardiovascular and renal benefits',
        'Hybrid closed-loop systems reduce hypoglycemia risk'
      ],
      url: 'https://diabetesjournals.org/care/article/46/Supplement_1/S1/148031/Introduction-Standards-of-Medical-Care-in-Diabetes',
      citationCount: 112,
      readingTimeMinutes: 30
    });
  } else if (normalizedQuery.includes('covid')) {
    results.push({
      id: `mock-${Date.now()}-1`,
      title: 'Long-term Effects of COVID-19 Infection',
      authors: ['Nalbandian A', 'Sehgal K', 'Gupta A'],
      source: 'Nature Medicine',
      publicationDate: '2023-04-05',
      contentType: 'paper',
      evidenceLevel: 'high',
      specialty: ['pulmonology', 'infectious disease'],
      abstract: 'This review summarizes the current understanding of long COVID, characterized by persistent symptoms after acute SARS-CoV-2 infection. It covers the epidemiology, pathophysiology, clinical manifestations, and management strategies for this complex condition.',
      keyPoints: [
        'Long COVID affects multiple organ systems',
        'Persistent symptoms may occur even after mild infection',
        'Multidisciplinary care teams are recommended'
      ],
      url: 'https://www.nature.com/articles/s41591-021-01283-z',
      citationCount: 215,
      readingTimeMinutes: 35
    });
  }
  
  // Add a generic result if we have no specific mock data
  if (results.length === 0) {
    results.push({
      id: `mock-generic-${Date.now()}`,
      title: `Recent Advances in ${query} Treatment`,
      authors: ['Smith J', 'Johnson K'],
      source: 'New England Journal of Medicine',
      publicationDate: getRecentDate(30),
      contentType: 'paper',
      evidenceLevel: 'high',
      specialty: determineSpecialties(query),
      abstract: `This comprehensive study examines the latest treatment approaches for ${query} with a focus on novel medications and interventions. The review highlights recent clinical trials that demonstrate efficacy in treatment-resistant cases.`,
      keyPoints: [
        'New treatment options show promise', 
        'Evidence-based guidelines updated', 
        'Combination therapy more effective than monotherapy'
      ],
      url: `https://www.nejm.org/doi/full/10.1056/NEJMra2212658`,
      citationCount: Math.floor(Math.random() * 100) + 10,
      readingTimeMinutes: Math.floor(Math.random() * 20) + 10
    });
  }
  
  console.log(`Generated ${results.length} mock results`);
  return results;
} 