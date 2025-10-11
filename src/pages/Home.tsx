import { useState } from 'react';
import Navigation from '@/components/Navigation';
import QuoteDisplay from '@/components/QuoteDisplay';
import MoodSelector from '@/components/MoodSelector';
import JournalPrompt from '@/components/JournalPrompt';
import { MoodType } from '@/types/mood';

const Home = () => {
  const [moodSelected, setMoodSelected] = useState(false);

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
      <Navigation />
      
      <QuoteDisplay />
      
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        <MoodSelector onMoodSelected={(mood: MoodType) => setMoodSelected(true)} />
        
        {moodSelected && <JournalPrompt />}
      </div>
    </div>
  );
};

export default Home;
