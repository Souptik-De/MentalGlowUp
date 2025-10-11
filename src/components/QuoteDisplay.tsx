import { useState } from 'react';
import { RefreshCw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRandomQuote } from '@/data/quotes';
import { toast } from 'sonner';

const QuoteDisplay = () => {
  const [quote, setQuote] = useState(getRandomQuote());

  const handleNewQuote = () => {
    setQuote(getRandomQuote());
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MindfulMe Quote',
          text: quote,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(quote);
      toast.success('Quote copied to clipboard!');
    }
  };

  return (
    <div className="bg-hero-gradient py-16 px-6 md:py-24">
      <div className="container mx-auto max-w-3xl text-center">
        <blockquote className="text-2xl md:text-4xl font-medium text-white mb-8 leading-relaxed">
          "{quote}"
        </blockquote>
        
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleNewQuote}
            variant="secondary"
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New quote
          </Button>
          
          <Button
            onClick={handleShare}
            variant="secondary"
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
