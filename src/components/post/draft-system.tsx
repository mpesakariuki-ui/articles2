'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DraftData {
  title: string;
  content: string;
  category: string;
  tags: string;
}

interface DraftSystemProps {
  formData: DraftData;
  onLoadDraft: (data: DraftData) => void;
}

export function DraftSystem({ formData, onLoadDraft }: DraftSystemProps) {
  const [hasDraft, setHasDraft] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const draft = localStorage.getItem('post-draft');
    setHasDraft(!!draft);
  }, []);

  const saveDraft = () => {
    localStorage.setItem('post-draft', JSON.stringify(formData));
    setHasDraft(true);
    toast({
      title: "Draft saved",
      description: "Your post has been saved as a draft.",
    });
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('post-draft');
    if (draft) {
      onLoadDraft(JSON.parse(draft));
      toast({
        title: "Draft loaded",
        description: "Your saved draft has been loaded.",
      });
    }
  };

  const deleteDraft = () => {
    localStorage.removeItem('post-draft');
    setHasDraft(false);
    toast({
      title: "Draft deleted",
      description: "Your saved draft has been deleted.",
    });
  };

  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" onClick={saveDraft}>
        Save Draft
      </Button>
      {hasDraft && (
        <>
          <Button type="button" variant="ghost" onClick={loadDraft}>
            Load Draft
          </Button>
          <Button type="button" variant="ghost" onClick={deleteDraft}>
            Delete Draft
          </Button>
        </>
      )}
    </div>
  );
}