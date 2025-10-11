import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Sparkles } from "lucide-react";
import { CreateGoalRequest } from "@/types/goal";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface CreateGoalDialogProps {
  onGoalCreated: () => void;
}

export const CreateGoalDialog = ({ onGoalCreated }: CreateGoalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateGoalRequest>({
    title: "",
    description: "",
    achievable: true,
    relevant: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    reminder_frequency: "daily",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createGoal(formData);
      toast({
        title: "Goal created! 🎉",
        description: "Your AI-powered action plan is ready.",
      });
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        achievable: true,
        relevant: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        reminder_frequency: "daily",
      });
      onGoalCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gradient-primary border-0 shadow-glow hover:opacity-90 transition-smooth">
          <Plus className="h-5 w-5 mr-2" />
          Create New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Create Your Goal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              required
              placeholder="e.g., Master React Development"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              placeholder="Describe your goal in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="relevant">Why is this important to you? *</Label>
            <Textarea
              id="relevant"
              required
              placeholder="Your motivation and why this goal matters..."
              value={formData.relevant}
              onChange={(e) => setFormData({ ...formData, relevant: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="frequency">Reminder Frequency</Label>
            <Select
              value={formData.reminder_frequency}
              onValueChange={(value) => setFormData({ ...formData, reminder_frequency: value })}
            >
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="achievable" className="cursor-pointer">
                This goal is achievable
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Mark if you believe this goal is realistic
              </p>
            </div>
            <Switch
              id="achievable"
              checked={formData.achievable}
              onCheckedChange={(checked) => setFormData({ ...formData, achievable: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 gradient-primary border-0">
              {loading ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
