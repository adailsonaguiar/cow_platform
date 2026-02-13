import { useState, useEffect } from 'react';
import { Input, Label } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, GripVertical, Target, Type } from 'lucide-react';

export function SpinWheelConfig({ value = [], onChange }) {
  // Check if value is an object with prizes or just an array (backwards compatibility)
  const initialPrizes = Array.isArray(value) ? value : (value.prizes || [
    { id: 1, label: '', color: '#FF6B6B', value: 0 }
  ]);
  const initialPreferredItem = Array.isArray(value) ? '' : (value.preferredItem || '');

  const [prizes, setPrizes] = useState(initialPrizes.length > 0 ? initialPrizes : [
    { id: 1, label: '', color: '#FF6B6B', value: 0 }
  ]);
  const [preferredItem, setPreferredItem] = useState(initialPreferredItem);

  // Campos de texto do modal
  const [title, setTitle] = useState(value.title || '');
  const [subtitle, setSubtitle] = useState(value.subtitle || '');
  const [description, setDescription] = useState(value.description || '');
  const [claimButtonText, setClaimButtonText] = useState(value.claimButtonText || '');
  const [spinButtonText, setSpinButtonText] = useState(value.spinButtonText || '');
  const [spinningText, setSpinningText] = useState(value.spinningText || '');

  useEffect(() => {
    onChange({
      prizes,
      preferredItem,
      title,
      subtitle,
      description,
      claimButtonText,
      spinButtonText,
      spinningText
    });
  }, [prizes, preferredItem, title, subtitle, description, claimButtonText, spinButtonText, spinningText]);

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
    <div className="space-y-6">
      {/* Textos do Modal */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          <Label className="text-base">Textos do Modal</Label>
        </div>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Gire a Roleta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              placeholder="Ex: Tente a sorte e ganhe prêmios!"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Clique no botão abaixo para girar a roleta"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spinButtonText">Texto do Botão Girar</Label>
              <Input
                id="spinButtonText"
                placeholder="Ex: Girar Roleta"
                value={spinButtonText}
                onChange={(e) => setSpinButtonText(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="spinningText">Texto Durante o Giro</Label>
              <Input
                id="spinningText"
                placeholder="Ex: Girando..."
                value={spinningText}
                onChange={(e) => setSpinningText(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="claimButtonText">Texto do Botão de Resgatar</Label>
            <Input
              id="claimButtonText"
              placeholder="Ex: Resgatar Prêmio"
              value={claimButtonText}
              onChange={(e) => setClaimButtonText(e.target.value)}
            />
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Configure os textos que serão exibidos no modal da roleta.
        </p>
      </div>

      {/* Prêmios */}
      <div className="space-y-4 pt-4 border-t border-border">
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

      <div className="space-y-2 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <Label htmlFor="preferredItem" className="text-base">Item Preferido (Opcional)</Label>
        </div>
        <Select value={preferredItem} onValueChange={setPreferredItem}>
          <SelectTrigger id="preferredItem">
            <SelectValue placeholder="Selecione o item preferido..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum (aleatório)</SelectItem>
            {prizes.filter(p => p.label.trim() !== '').map((prize) => (
              <SelectItem key={prize.id} value={prize.label}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-border" 
                    style={{ backgroundColor: prize.color }}
                  />
                  <span>{prize.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Selecione qual prêmio deve ser o resultado preferido da roleta. Deixe em "Nenhum" para sorteio aleatório.
        </p>
      </div>
      </div>
    </div>
  );
}
