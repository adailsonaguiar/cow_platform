import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { X } from 'lucide-react';

export function SitesInput({ value = '', onChange, required = false }) {
  const [inputValue, setInputValue] = useState('');
  const sites = value ? value.split(',').map(s => s.trim()).filter(s => s) : [];

  const handleAddSite = () => {
    if (inputValue.trim()) {
      const newSites = [...sites, inputValue.trim()];
      onChange(newSites.join(', '));
      setInputValue('');
    }
  };

  const handleRemoveSite = (index) => {
    const newSites = sites.filter((_, i) => i !== index);
    onChange(newSites.join(', '));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSite();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="sites">Sites/URLs *</Label>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            id="sites"
            type="url"
            placeholder="https://exemplo.com/pagina"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            required={required && sites.length === 0}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSite}
            disabled={!inputValue.trim()}
          >
            Add
          </Button>
        </div>

        {sites.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            {sites.map((site, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <span className="truncate max-w-xs">{site}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSite(index)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label="Remove site"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Adicione uma ou mais URLs onde o bloco será ativado
        </p>
      </div>
    </div>
  );
}
