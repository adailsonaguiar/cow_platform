import { useState, useEffect } from 'react';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { Gift } from 'lucide-react';

export function PresenteConfig({ value = {}, onChange }) {
  const [config, setConfig] = useState({
    title: value.title || '',
    description: value.description || '',
    prize: value.prize || '',
    buttonText: value.buttonText || '',
    image: value.image || '',
    ...value
  });

  useEffect(() => {
    onChange(config);
  }, [config]);

  const updateConfig = (field, newValue) => {
    setConfig({ ...config, [field]: newValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary" />
        <Label className="text-base">Configuração do Presente</Label>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="gift-title" className="text-xs">Título do Presente</Label>
          <Input
            id="gift-title"
            placeholder="Ex: Você ganhou um presente!"
            value={config.title}
            onChange={(e) => updateConfig('title', e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gift-description" className="text-xs">Descrição</Label>
          <Textarea
            id="gift-description"
            placeholder="Ex: Clique para revelar seu prêmio especial..."
            value={config.description}
            onChange={(e) => updateConfig('description', e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gift-prize" className="text-xs">Prêmio</Label>
          <Input
            id="gift-prize"
            placeholder="Ex: 25% de desconto"
            value={config.prize}
            onChange={(e) => updateConfig('prize', e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gift-button" className="text-xs">Texto do Botão</Label>
          <Input
            id="gift-button"
            placeholder="Ex: Abrir Presente"
            value={config.buttonText}
            onChange={(e) => updateConfig('buttonText', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gift-image" className="text-xs">URL da Imagem (opcional)</Label>
          <Input
            id="gift-image"
            type="url"
            placeholder="https://exemplo.com/imagem.png"
            value={config.image}
            onChange={(e) => updateConfig('image', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Configure um presente surpresa para os visitantes do site.
      </p>
    </div>
  );
}
