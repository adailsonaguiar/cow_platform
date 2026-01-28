import { useState, useEffect } from 'react';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Sparkles } from 'lucide-react';

export function ScratchConfig({ value = [], onChange }) {
  const [prizes, setPrizes] = useState(value.length > 0 ? value : [
    { id: 1, label: '', probability: 10, image: '' }
  ]);

  useEffect(() => {
    onChange(prizes);
  }, [prizes]);

  const addPrize = () => {
    const newId = prizes.length > 0 ? Math.max(...prizes.map(p => p.id)) + 1 : 1;
    setPrizes([...prizes, { id: newId, label: '', probability: 10, image: '' }]);
  };

  const removePrize = (id) => {
    if (prizes.length > 1) {
      setPrizes(prizes.filter(p => p.id !== id));
    }
  };

  const updatePrize = (id, field, newValue) => {
    setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: newValue } : p));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Prêmios da Raspadinha</Label>
        <Button type="button" size="sm" onClick={addPrize}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Prêmio
        </Button>
      </div>

      <div className="space-y-3">
        {prizes.map((prize, index) => (
          <div key={prize.id} className="flex items-center gap-3 p-4 border border-border rounded-lg bg-muted/30">
            <Sparkles className="h-5 w-5 text-primary" />
            
            <div className="flex-1 grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <Input
                  placeholder="Ex: R$ 50 de desconto"
                  value={prize.label}
                  onChange={(e) => updatePrize(prize.id, 'label', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="Probabilidade %"
                  value={prize.probability}
                  onChange={(e) => updatePrize(prize.id, 'probability', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="col-span-3">
                <Input
                  type="url"
                  placeholder="URL imagem"
                  value={prize.image}
                  onChange={(e) => updatePrize(prize.id, 'image', e.target.value)}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removePrize(prize.id)}
              disabled={prizes.length === 1}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Configure os prêmios ocultos. A probabilidade determina a chance de aparecer.
      </p>
    </div>
  );
}
