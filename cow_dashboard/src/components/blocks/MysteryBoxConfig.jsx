import { useState, useEffect } from 'react';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, GripVertical, Target, Gift, Type } from 'lucide-react';

export function MysteryBoxConfig({ value = {}, onChange }) {
  // Check if value is an object with prizes or just an array (backwards compatibility)
  const initialPrizes = Array.isArray(value) ? value : (value.prizes || [
    { id: 1, label: '' }
  ]);
  const initialPreferredItem = Array.isArray(value) ? '' : (value.preferredItem || '');

  const [prizes, setPrizes] = useState(initialPrizes.length > 0 ? initialPrizes : [
    { id: 1, label: '' }
  ]);
  const [preferredItem, setPreferredItem] = useState(initialPreferredItem);
  
  // Campos de texto do modal
  const [title, setTitle] = useState(value.title || '');
  const [subtitle, setSubtitle] = useState(value.subtitle || '');
  const [description, setDescription] = useState(value.description || '');
  const [claimButtonText, setClaimButtonText] = useState(value.claimButtonText || '');

  useEffect(() => {
    onChange({
      prizes,
      preferredItem,
      title,
      subtitle,
      description,
      claimButtonText
    });
  }, [prizes, preferredItem, title, subtitle, description, claimButtonText]);

  const addPrize = () => {
    const newId = prizes.length > 0 ? Math.max(...prizes.map(p => p.id)) + 1 : 1;
    
    setPrizes([...prizes, {
      id: newId,
      label: ''
    }]);
  };

  const removePrize = (id) => {
    if (prizes.length > 1) {
      const removedPrize = prizes.find(p => p.id === id);
      setPrizes(prizes.filter(p => p.id !== id));
      
      // Se o prêmio removido era o item preferido, reseta a seleção
      if (removedPrize && removedPrize.label === preferredItem) {
        setPreferredItem('');
      }
    }
  };

  const updatePrize = (id, field, newValue) => {
    const oldPrize = prizes.find(p => p.id === id);
    
    setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: newValue } : p));
    
    // Se o label do item preferido foi alterado, atualiza o preferredItem
    if (field === 'label' && oldPrize && oldPrize.label === preferredItem) {
      setPreferredItem(newValue);
    }
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
              placeholder="Ex: Caixa Surpresa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              placeholder="Ex: Escolha uma caixa e ganhe um prêmio!"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Clique em uma das caixas abaixo para revelar seu prêmio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
          Configure os textos que serão exibidos no modal da caixa surpresa.
        </p>
      </div>

      {/* Prêmios */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <Label className="text-base">Prêmios da Caixa Surpresa</Label>
          </div>
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
            
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {index + 1}
            </div>
            
            <div className="flex-1">
              <Input
                placeholder="Ex: 20% OFF"
                value={prize.label}
                onChange={(e) => updatePrize(prize.id, 'label', e.target.value)}
                required
              />
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
        Configure os prêmios possíveis da caixa surpresa.
      </p>

      <div className="space-y-2 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <Label htmlFor="preferredItem" className="text-base">Prêmio Garantido (Opcional)</Label>
        </div>
        <Select value={preferredItem} onValueChange={setPreferredItem}>
          <SelectTrigger id="preferredItem">
            <SelectValue placeholder="Selecione o prêmio garantido..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <div className="flex items-center gap-2">
                <span>🎲</span>
                <span>Nenhum (sorteio aleatório)</span>
              </div>
            </SelectItem>
            {prizes.filter(p => p.label.trim() !== '').map((prize) => (
              <SelectItem key={prize.id} value={prize.label}>
                <div className="flex items-center gap-2">
                  <span>🎁</span>
                  <span>{prize.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Selecione qual prêmio será sempre sorteado quando o usuário abrir a caixa. 
          Deixe em "Nenhum" para sorteio verdadeiramente aleatório.
        </p>
      </div>

      {/* Preview Section */}
      {prizes.filter(p => p.label.trim() !== '').length > 0 && (
        <div className="pt-4 border-t border-border">
          <Label className="text-xs text-muted-foreground mb-2 block">Prévia dos Prêmios</Label>
          <div className="flex flex-wrap gap-2">
            {prizes.filter(p => p.label.trim() !== '').map((prize) => (
              <div 
                key={prize.id}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 ${
                  prize.label === preferredItem ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <span>🎁</span>
                <span>{prize.label}</span>
                {prize.label === preferredItem && (
                  <span className="ml-1 text-xs">⭐</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
