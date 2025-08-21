'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Users } from 'lucide-react';

interface CoAuthor {
  email: string;
  name: string;
  institution?: string;
}

interface CoAuthorManagerProps {
  coAuthors: CoAuthor[];
  onChange: (coAuthors: CoAuthor[]) => void;
}

export function CoAuthorManager({ coAuthors, onChange }: CoAuthorManagerProps) {
  const [newAuthor, setNewAuthor] = useState({ email: '', name: '', institution: '' });

  const addCoAuthor = () => {
    if (newAuthor.email && newAuthor.name) {
      onChange([...coAuthors, newAuthor]);
      setNewAuthor({ email: '', name: '', institution: '' });
    }
  };

  const removeCoAuthor = (index: number) => {
    onChange(coAuthors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="font-medium">Co-Authors</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {coAuthors.map((author, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {author.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => removeCoAuthor(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          placeholder="Name"
          value={newAuthor.name}
          onChange={(e) => setNewAuthor({...newAuthor, name: e.target.value})}
        />
        <Input
          placeholder="Email"
          type="email"
          value={newAuthor.email}
          onChange={(e) => setNewAuthor({...newAuthor, email: e.target.value})}
        />
        <Input
          placeholder="Institution (optional)"
          value={newAuthor.institution}
          onChange={(e) => setNewAuthor({...newAuthor, institution: e.target.value})}
        />
      </div>
      
      <Button onClick={addCoAuthor} size="sm" disabled={!newAuthor.name || !newAuthor.email}>
        <Plus className="h-4 w-4 mr-1" />
        Add Co-Author
      </Button>
    </div>
  );
}