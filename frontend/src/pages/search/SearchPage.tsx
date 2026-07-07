import { useState } from 'react';
import {
  HiMagnifyingGlass,
  HiUserCircle,
  HiCurrencyRupee,
  HiBeaker,
  HiCube,
  HiTruck,
} from 'react-icons/hi2';
import { motion } from 'framer-motion';
import SearchBox from '../../components/ui/SearchBox';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';

interface SearchResult {
  id: string;
  type: 'farmer' | 'payment' | 'collection' | 'inventory' | 'loan';
  title: string;
  description: string;
  metadata?: Record<string, string>;
  url: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const mockSearch = (searchQuery: string) => {
    setIsSearching(true);

    setTimeout(() => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'farmer',
          title: 'John Doe',
          description: 'Farmer ID: FM001 • Village: Green Valley',
          metadata: { cattle: '5', status: 'Active' },
          url: '/farmers/1',
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment #PAY-2024-001',
          description: 'Farmer: Jane Smith • Amount: KSh 45,000',
          metadata: { status: 'Paid', date: '15 Jan 2024' },
          url: '/payments/1',
        },
        {
          id: '3',
          type: 'collection',
          title: 'Milk Collection #MC-2024-001',
          description: 'Farmer: John Doe • Quantity: 25L',
          metadata: { fat: '4.5%', snf: '8.5%' },
          url: '/milk-collection/1',
        },
        {
          id: '4',
          type: 'inventory',
          title: 'Cattle Feed - Premium',
          description: 'Stock: 500kg • Last Updated: Today',
          metadata: { category: 'Feed', status: 'In Stock' },
          url: '/inventory/1',
        },
        {
          id: '5',
          type: 'loan',
          title: 'Loan #LN-2024-001',
          description: 'Farmer: John Doe • Amount: KSh 50,000',
          metadata: { status: 'Active', emi: 'KSh 5,000' },
          url: '/loans/1',
        },
      ];

      setResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    mockSearch(searchQuery);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'farmer':
        return <HiUserCircle className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <HiCurrencyRupee className="w-5 h-5 text-green-600" />;
      case 'collection':
        return <HiBeaker className="w-5 h-5 text-purple-600" />;
      case 'inventory':
        return <HiCube className="w-5 h-5 text-amber-600" />;
      case 'loan':
        return <HiTruck className="w-5 h-5 text-red-600" />;
    }
  };

  const getTypeBadgeVariant = (type: SearchResult['type']) => {
    switch (type) {
      case 'farmer':
        return 'info';
      case 'payment':
        return 'success';
      case 'collection':
        return 'primary';
      case 'inventory':
        return 'warning';
      case 'loan':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredResults = results.filter(
    (result) => activeFilter === 'all' || result.type === activeFilter
  );

  const categories = [
    { id: 'all', label: 'All', count: results.length },
    {
      id: 'farmer',
      label: 'Farmers',
      count: results.filter((r) => r.type === 'farmer').length,
    },
    {
      id: 'payment',
      label: 'Payments',
      count: results.filter((r) => r.type === 'payment').length,
    },
    {
      id: 'collection',
      label: 'Collections',
      count: results.filter((r) => r.type === 'collection').length,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      count: results.filter((r) => r.type === 'inventory').length,
    },
    {
      id: 'loan',
      label: 'Loans',
      count: results.filter((r) => r.type === 'loan').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Search
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Search across farmers, payments, collections, and more
        </p>
      </div>

      {/* Search Box */}
      <Card className="p-6">
        <SearchBox
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          placeholder="Search for farmers, payments, collections..."
          size="lg"
        />
      </Card>

      {/* Filters */}
      {results.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === category.id
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{category.label}</span>
              {category.count > 0 && (
                <Badge variant={activeFilter === category.id ? 'primary' : 'secondary'}>
                  {category.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div>
        {isSearching ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Searching...
              </p>
            </div>
          </Card>
        ) : query && filteredResults.length === 0 ? (
          <Card className="p-8">
            <EmptyState
              icon={<HiMagnifyingGlass className="w-16 h-16" />}
              title="No results found"
              description={`No results found for "${query}". Try a different search term.`}
            />
          </Card>
        ) : filteredResults.length > 0 ? (
          <div className="space-y-3">
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        {getTypeIcon(result.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                          {result.title}
                        </h3>
                        <Badge
                          variant={getTypeBadgeVariant(result.type) as any}
                          size="sm"
                        >
                          {result.type}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {result.description}
                      </p>

                      {result.metadata && (
                        <div className="flex items-center gap-3 flex-wrap">
                          {Object.entries(result.metadata).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-xs text-slate-500 dark:text-slate-400"
                            >
                              <span className="font-medium capitalize">{key}:</span>{' '}
                              {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8">
            <EmptyState
              icon={<HiMagnifyingGlass className="w-16 h-16" />}
              title="Start searching"
              description="Enter a search term above to find farmers, payments, collections, and more."
            />
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      {!query && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Search Farmers',
                description: 'Find farmer records',
                icon: <HiUserCircle className="w-6 h-6" />,
                color: 'text-blue-600',
              },
              {
                title: 'Search Payments',
                description: 'Find payment records',
                icon: <HiCurrencyRupee className="w-6 h-6" />,
                color: 'text-green-600',
              },
              {
                title: 'Search Collections',
                description: 'Find milk collections',
                icon: <HiBeaker className="w-6 h-6" />,
                color: 'text-purple-600',
              },
            ].map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-left"
              >
                <div className={action.color}>{action.icon}</div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                    {action.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {action.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchPage;
