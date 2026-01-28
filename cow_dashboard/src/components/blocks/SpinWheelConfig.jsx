import { useState, useEffect } from 'react';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function SpinWheelConfig({ value = [], onChange }) {
  const [prizes, setPrizes] = useState(value.length > 0 ? value : [
    { id: 1, label: '', color: '#FF6B6B', value: 0 }
  ]);

  useEffect(() => {
    onChange(prizes);
  }, [prizes]);

  const addPrize = () => {
    const newId = prizes.length > 0 ? Math.max(...prizes.map(p => p.id)) + 1 : 1;
    setPrizes([...prizes, {
      id: newId,
      label: '',
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      value: 0
    }]);
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
        <Label className="text-base">Prêmios da Roleta</Label>
        <Button type="button" size="sm" onClick={addPrize}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Prêmio
        </Button>
      </div>

      <div className="space-y-3">
        {prizes.map((prize, index) => (
          <div key={prize.id} className="flex items-center gap-3 p-4 border border-border rounded-lg bg-muted/30">
            <div className="cursor-move">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex-1 grid grid-cols-12 gap-3">
              <div className="col-span-5">
                <Input
                  placeholder="Ex: 20% OFF"
                  value={prize.label}
                  onChange={(e) => updatePrize(prize.id, 'label', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={prize.color}
                    onChange={(e) => updatePrize(prize.id, 'color', e.target.value)}
                    className="h-10 w-12 rounded border border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={prize.color}
                    onChange={(e) => updatePrize(prize.id, 'color', e.target.value)}
                    placeholder="#FF6B6B"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="Valor"
                  value={prize.value}
                  onChange={(e) => updatePrize(prize.id, 'value', parseInt(e.target.value) || 0)}
                  min="0"
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
        Configure os prêmios da roleta. Cada fatia terá uma cor, label e valor associado.
      </p>
    </div>
  );
}
