import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { BLOCK_TYPES, LANGUAGES } from '@/utils/helpers';
import { SpinWheelConfig } from '@/components/blocks/SpinWheelConfig';
import { QuizConfig } from '@/components/blocks/QuizConfig';
import { ScratchConfig } from '@/components/blocks/ScratchConfig';
import { CountdownConfig } from '@/components/blocks/CountdownConfig';
import { PresenteConfig } from '@/components/blocks/PresenteConfig';
import { MysteryBoxConfig } from '@/components/blocks/MysteryBoxConfig';
import { SitesInput } from '@/components/SitesInput';

export function CowBlockForm({ open, onOpenChange, onSubmit, initialData, mode = 'create' }) {
  const [formData, setFormData] = useState({
    blockName: '',
    sites: '',
    type: undefined,
    language: 'pt-BR',
    active: true,
    data: {},
    blockConfig: null,
  });

  useEffect(() => {
    if (initialData) {
      const blockConfig = getInitialBlockConfig(initialData.type, initialData.data);
      setFormData({
        blockName: initialData.blockName || '',
        sites: initialData.sites || '',
        type: initialData.type || '',
        language: initialData.data?.language || 'pt-BR',
        active: initialData.active !== undefined ? initialData.active : true,
        data: initialData.data || {},
        blockConfig,
      });
    } else {
      setFormData({
        blockName: '',
        sites: '',
        type: '',
        language: 'pt-BR',
        active: true,
        data: {},
        blockConfig: null,
      });
    }
  }, [initialData, open]);

  const getInitialBlockConfig = (type, data) => {
    switch (type) {
      case 'spinwheel':
      case 'spinwheel-short':
        return {
          prizes: data?.prizes || [],
          preferredItem: data?.preferredItem || ''
        };
      case 'quiz':
        return data?.questions || [];
      case 'scratch':
        return data?.prizes || [];
      case 'countdown':
        return data || {};
      case 'gift':
        return data || {};
      case 'mysterybox':
        return {
          prizes: data?.prizes || [],
          preferredItem: data?.preferredItem || ''
        };
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({formData})
    
    const submitData = {
      blockName: formData.blockName,
      sites: formData.sites,
      type: formData.type,
      active: formData.active,
      data: {
        ...formData.data
      },
    };
    
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return formData.blockName && formData.sites && formData.type && formData.language;
  };

  const handleBlockConfigChange = (config) => {
    setFormData((prev) => ({
      ...prev,
      data: config,
    }));
  };

  const renderBlockConfiguration = () => {
    switch (formData.type) {
      case 'spinwheel':
      case 'spinwheel-short':
        return (
          <SpinWheelConfig
            value={formData.data || []}
            onChange={handleBlockConfigChange}
          />
        );
      case 'quiz':
        return (
          <QuizConfig
            value={formData.data || []}
            onChange={handleBlockConfigChange}
          />
        );
      case 'scratch':
        return (
          <ScratchConfig
            value={formData.blockConfig || []}
            onChange={handleBlockConfigChange}
          />
        );
      case 'countdown':
        return (
          <CountdownConfig
            value={formData.blockConfig || {}}
            onChange={handleBlockConfigChange}
          />
        );
      case 'gift':
        return (
          <PresenteConfig
            value={formData.blockConfig || {}}
            onChange={handleBlockConfigChange}
          />
        );
      case 'mysterybox':
        return (
          <MysteryBoxConfig
            value={formData.data || {}}
            onChange={handleBlockConfigChange}
          />
        );
      default:
        return null;
    }
  };

  const selectedBlockType = BLOCK_TYPES.find((bt) => bt.value === formData.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'create' ? 'Criar Novo Bloco COW' : 'Editar Bloco COW'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Preencha os campos abaixo para criar um novo bloco interativo.'
              : 'Atualize as informações do bloco interativo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Block Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Formato do Bloco *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione um formato..." />
              </SelectTrigger>
              <SelectContent>
                {BLOCK_TYPES.map((blockType) => (
                  <SelectItem key={blockType.value} value={blockType.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{blockType.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-medium">{blockType.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {blockType.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Site Name */}
          <div className="space-y-2">
            <Label htmlFor="blockName">Nome do Bloco *</Label>
            <Input
              id="blockName"
              placeholder="ex: meu bloco interativo"
              value={formData.blockName}
              onChange={(e) => handleChange('blockName', e.target.value)}
              required
            />
          </div>

          {/* URL */}
          <SitesInput
            value={formData.sites}
            onChange={(value) => handleChange('sites', value)}
            required
          />

          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language">Idioma *</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => handleChange('language', value)}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Selecione um idioma..." />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Active/Inactive */}
          <div className="space-y-2">
            <Label>Status do Bloco</Label>
            <button
              type="button"
              onClick={() => handleChange('active', !formData.active)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                formData.active
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {formData.active ? '✓ Bloco Ativo' : '✕ Bloco Inativo'}
            </button>
          </div>

          {/* Block-specific Configuration */}
          {formData.type && renderBlockConfiguration()}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid()}>
              {mode === 'create' ? 'Criar Bloco' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
