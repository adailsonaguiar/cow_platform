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
import { Input, Label, Textarea } from '@/components/ui/Input';
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

export function CowBlockForm({ open, onOpenChange, onSubmit, initialData, mode = 'create' }) {
  const [formData, setFormData] = useState({
    site: '',
    url: '',
    type: undefined,
    language: 'pt-BR',
    data: {},
    blockConfig: null,
  });

  useEffect(() => {
    if (initialData) {
      const blockConfig = getInitialBlockConfig(initialData.type, initialData.data);
      setFormData({
        site: initialData.site || '',
        url: initialData.url || '',
        type: initialData.type || '',
        language: initialData.data?.language || 'pt-BR',
        data: initialData.data || {},
        blockConfig,
      });
    } else {
      setFormData({
        site: '',
        url: '',
        type: '',
        language: 'pt-BR',
        data: {},
        blockConfig: null,
      });
    }
  }, [initialData, open]);

  const getInitialBlockConfig = (type, data) => {
    switch (type) {
      case 'spinwheel':
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
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Montar o objeto data baseado no tipo de bloco
    let blockData = {
      language: formData.language,
    };

    switch (formData.type) {
      case 'spinwheel':
        blockData.prizes = formData.blockConfig?.prizes || [];
        blockData.preferredItem = formData.blockConfig?.preferredItem || '';
        break;
      case 'quiz':
        blockData.questions = formData.blockConfig || [];
        break;
      case 'scratch':
        blockData.prizes = formData.blockConfig || [];
        break;
      case 'countdown':
        blockData = { ...blockData, ...formData.blockConfig };
        break;
      case 'gift':
        blockData = { ...blockData, ...formData.blockConfig };
        break;
      default:
        blockData = { ...formData.data, language: formData.language };
    }

    const submitData = {
      site: formData.site,
      url: formData.url,
      type: formData.type,
      data: blockData,
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
    return formData.site && formData.url && formData.type && formData.language;
  };

  const handleBlockConfigChange = (config) => {
    setFormData((prev) => ({
      ...prev,
      blockConfig: config,
    }));
  };

  const renderBlockConfiguration = () => {
    switch (formData.type) {
      case 'spinwheel':
        return (
          <SpinWheelConfig
            value={formData.blockConfig || []}
            onChange={handleBlockConfigChange}
          />
        );
      case 'quiz':
        return (
          <QuizConfig
            value={formData.blockConfig || []}
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
            <Label htmlFor="site">Nome do Site *</Label>
            <Input
              id="site"
              placeholder="ex: meusite.com"
              value={formData.site}
              onChange={(e) => handleChange('site', e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Identificador do site onde o bloco será exibido
            </p>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL da Página *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://exemplo.com/pagina"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              URL específica onde o bloco será ativado
            </p>
          </div>

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
