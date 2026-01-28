import { useState, useEffect } from 'react';
import { Input, Label } from '@/components/ui/Input';
import { Calendar, Clock } from 'lucide-react';

export function CountdownConfig({ value = {}, onChange }) {
  const [config, setConfig] = useState({
    title: value.title || '',
    endDate: value.endDate || '',
    message: value.message || '',
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
      <Label className="text-base">Configuração do Countdown</Label>

      <div className="space-y-4">
        <div>
          <Label htmlFor="countdown-title" className="text-xs">Título</Label>
          <Input
            id="countdown-title"
            placeholder="Ex: Oferta por tempo limitado!"
            value={config.title}
            onChange={(e) => updateConfig('title', e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="countdown-date" className="text-xs">Data e Hora de Término</Label>
          <div className="relative mt-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="countdown-date"
              type="datetime-local"
              value={config.endDate}
              onChange={(e) => updateConfig('endDate', e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="countdown-message" className="text-xs">Mensagem ao Expirar</Label>
          <Input
            id="countdown-message"
            placeholder="Ex: Esta oferta expirou!"
            value={config.message}
            onChange={(e) => updateConfig('message', e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="countdown-discount" className="text-xs">Desconto (%)</Label>
            <Input
              id="countdown-discount"
              type="number"
              placeholder="Ex: 30"
              value={config.discount || ''}
              onChange={(e) => updateConfig('discount', parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="countdown-code" className="text-xs">Código de Desconto</Label>
            <Input
              id="countdown-code"
              placeholder="Ex: SAVE30"
              value={config.code || ''}
              onChange={(e) => updateConfig('code', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Configure um contador regressivo com desconto por tempo limitado.
      </p>
    </div>
  );
}
