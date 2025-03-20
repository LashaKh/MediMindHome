export const testSimpleAPI = () => {
  console.log('Simple API test function called');
  return true;
};

export const searchTest = async (query: string) => {
  console.log(`Test search for: ${query}`);
  return {
    results: [
      {
        id: '1',
        title: `Test Result for ${query}`,
        url: 'https://example.com',
        abstract: 'This is a test result'
      }
    ],
    totalCount: 1
  };
}; 