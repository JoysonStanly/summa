import { useState } from 'react';
import type { Category } from '../../data/quizData';
import { quantitativeCategories } from '../../data/quizData';
import { ChevronRight, ChevronDown, Search, PlusCircle, CircleDot } from 'lucide-react';

export const QuizSidebar = () => {
  const [categories, setCategories] = useState<Category[]>(quantitativeCategories);
  
  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return { ...category, isExpanded: !category.isExpanded };
      }
      return category;
    }));
  };

  const setActiveSubCategory = (categoryId: string, subCategoryId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          subCategories: category.subCategories?.map(subCategory => ({
            ...subCategory,
            isActive: subCategory.id === subCategoryId
          }))
        };
      }
      return {
        ...category,
        subCategories: category.subCategories?.map(subCategory => ({
          ...subCategory,
          isActive: false
        }))
      };
    }));
  };

  return (
    <div className="w-64 h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#111111] text-sm rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-700"
          />
        </div>
      </div>

      {/* Category Section */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="font-medium text-sm mb-3">Quantitative Aptitude</h2>
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.id} className="text-sm">
              <div 
                className={`flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer hover:bg-gray-800 ${
                  category.isActive ? 'bg-gray-800' : ''
                }`}
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center">
                  {category.subCategories ? (
                    category.isExpanded ? (
                      <ChevronDown size={16} className="text-gray-400 mr-1" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400 mr-1" />
                    )
                  ) : (
                    <div className="w-4 mr-1"></div>
                  )}
                  <span className="text-gray-300">{category.name}</span>
                </div>
              </div>

              {/* Sub Categories */}
              {category.subCategories && category.isExpanded && (
                <div className="ml-6 space-y-1 mt-1 mb-1">
                  {category.subCategories.map((subCategory) => (
                    <div
                      key={subCategory.id}
                      className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-gray-800 ${
                        subCategory.isActive ? 'bg-gray-800 border-l-2 border-orange-500' : ''
                      }`}
                      onClick={() => setActiveSubCategory(category.id, subCategory.id)}
                    >
                      {subCategory.isActive ? (
                        <CircleDot size={14} className="text-orange-500 mr-2" />
                      ) : (
                        <div className="w-[14px] mr-2"></div>
                      )}
                      <span 
                        className={`text-sm ${
                          subCategory.isActive ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {subCategory.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Track & User */}
      <div className="mt-auto border-t border-gray-800">
        <div className="p-4 flex justify-center">
          <button className="flex items-center bg-[#111111] text-white px-4 py-2 rounded-md text-sm">
            <PlusCircle size={16} className="mr-2" />
            Track
          </button>
        </div>
        <div className="p-4 flex items-center border-t border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex-shrink-0"></div>
          <span className="text-sm truncate">Joy</span>
        </div>
      </div>
    </div>
  );
};
