import React from 'react';
import { 
  Laptop, 
  Shirt, 
  Utensils, 
  Footprints, 
  Smartphone, 
  Watch, 
  Home, 
  Sparkles, 
  Baby, 
  Activity, 
  Armchair, 
  Cat,
  Grid
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';

export const CategoryNav: React.FC = () => {
  const { 
    language, 
    selectedCategory, 
    setSelectedCategory, 
    selectedSubCategory, 
    setSelectedSubCategory, 
    easyMode, 
    t 
  } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Shirt': return <Shirt className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Footprints': return <Footprints className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Watch': return <Watch className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Armchair': return <Armchair className="w-5 h-5" />;
      case 'Cat': return <Cat className="w-5 h-5" />;
      default: return <Grid className="w-5 h-5" />;
    }
  };

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="py-2.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 sm:gap-4 min-w-max">
          {/* All Categories Button */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubCategory(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-semibold cursor-pointer ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white shadow-md shadow-orange-500/25 font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            } ${easyMode ? 'text-base py-3 px-5' : 'text-xs'}`}
          >
            <Grid className="w-4 h-4" />
            <span>{t('allCategories')}</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white font-extrabold shadow-md shadow-orange-500/25'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 hover:border-orange-300'
                } ${easyMode ? 'text-base py-3 px-4 font-bold' : 'text-xs'}`}
              >
                <span className={isSelected ? 'text-white' : 'text-orange-600'}>
                  {getIcon(cat.icon)}
                </span>
                <span>{cat.name[language] || cat.name.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategory Pills Row when a category is selected */}
      {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
        <div className="bg-slate-50/90 border-t border-slate-200 py-2 px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Sub-categories:
            </span>
            <button
              onClick={() => setSelectedSubCategory(null)}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                selectedSubCategory === null
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All {activeCategoryObj.name[language] || activeCategoryObj.name.en}
            </button>
            {activeCategoryObj.subcategories.map(sub => {
              const isSubSelected = selectedSubCategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(isSubSelected ? null : sub)}
                  className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    isSubSelected
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-orange-50 hover:border-orange-300 border border-slate-200'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
