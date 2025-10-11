import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const JournalPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center bg-card rounded-2xl shadow-card-soft p-6 max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-mood-good" />
        <p className="text-lg text-foreground">
          Would you like to share more?
        </p>
      </div>
      
      <Button
        onClick={() => navigate('/journal')}
        size="lg"
        className="bg-mood-amazing hover:bg-mood-amazing/90 text-white w-full"
      >
        Open Journal
      </Button>
    </div>
  );
};

export default JournalPrompt;
