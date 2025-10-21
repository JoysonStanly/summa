import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import type { EditorialProps } from './types';
import EditorialTabs from './EditorialTabs';
import VideoCard from './VideoCard';
import Section from './Section';
import ImageCarousel from './ImageCarousel';
import CodeTabs from './CodeTabs';

const Editorial: FC<EditorialProps> = ({
  title,
  subtitle,
  videoUrl,
  videoThumbnail,
  sections,
  dryRunImages,
  solutions,
  timeComplexity,
  spaceComplexity
}) => {
  const [activeTab, setActiveTab] = useState<'brute' | 'optimal'>('brute');
  const [activeLanguage, setActiveLanguage] = useState<string>('java');

  return (
    <div className="editorial p-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <EditorialTabs
          tabs={[
            { id: 'brute', label: 'Brute' },
            { id: 'optimal', label: 'Optimal' }
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'brute' | 'optimal')}
        />

        {/* Video Section */}
        <VideoCard
          title={title}
          subtitle={subtitle}
          thumbnailUrl={videoThumbnail}
          videoUrl={videoUrl}
        />

        {/* Content Sections */}
        {sections.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            isCollapsed={section.isCollapsed}
          >
            {typeof section.content === 'string' ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-[#9ca3af] whitespace-pre-line">{section.content}</p>
              </div>
            ) : (
              section.content
            )}
          </Section>
        ))}

        {/* Dry Run Section */}
        {dryRunImages.length > 0 && (
          <Section title="Dry Run">
            <ImageCarousel images={dryRunImages} />
          </Section>
        )}

        {/* Solution Section */}
        <Section title="Solution">
          <CodeTabs
            solutions={solutions}
            activeLanguage={activeLanguage}
            onLanguageChange={setActiveLanguage}
          />
        </Section>

        {/* Complexity Analysis */}
        <Section title="Complexity Analysis">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Time Complexity:</h3>
              <p className="text-[#9ca3af]">{timeComplexity}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Space Complexity:</h3>
              <p className="text-[#9ca3af]">{spaceComplexity}</p>
            </div>
          </div>
        </Section>
      </motion.div>
    </div>
  );
};

export default Editorial;
