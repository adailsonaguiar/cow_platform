import { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CowBlockCard } from '@/components/CowBlockCard';
import { CowBlockForm } from '@/components/CowBlockForm';
import { cowService } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { BLOCK_TYPES } from '../utils/helpers';

export function Dashboard() {
  const [blocks, setBlocks] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchBlocks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [blocks, searchTerm, filterType]);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const data = await cowService.getAll();
      setBlocks(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar blocos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...blocks];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (block) =>
          block.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
          block.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((block) => block.type === filterType);
    }

    setFilteredBlocks(filtered);
  };

  const handleCreateBlock = async (formData) => {
    try {
      await cowService.create(formData);
      toast({
        title: 'Sucesso!',
        description: 'Bloco criado com sucesso.',
      });
      setIsFormOpen(false);
      fetchBlocks();
    } catch (error) {
      toast({
        title: 'Erro ao criar bloco',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateBlock = async (formData) => {
    try {
      await cowService.update(editingBlock._id, formData);
      toast({
        title: 'Sucesso!',
        description: 'Bloco atualizado com sucesso.',
      });
      setIsFormOpen(false);
      setEditingBlock(null);
      fetchBlocks();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar bloco',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBlock = async (block) => {
    if (!confirm(`Tem certeza que deseja excluir o bloco "${block.site}"?`)) {
      return;
    }

    try {
      await cowService.delete(block._id);
      toast({
        title: 'Sucesso!',
        description: 'Bloco excluído com sucesso.',
      });
      fetchBlocks();
    } catch (error) {
      toast({
        title: 'Erro ao excluir bloco',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDuplicateBlock = (block) => {
    setEditingBlock({ ...block, _id: undefined, site: `${block.site} (cópia)` });
    setIsFormOpen(true);
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBlock(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Boxes className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">COW Platform</h1>
                <p className="text-sm text-muted-foreground">
                  Gerenciamento de Blocos Interativos
                </p>
              </div>
            </div>
            <Button onClick={() => setIsFormOpen(true)} size="default">
              <Plus className="h-4 w-4 mr-2" />
              Novo Bloco
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-8">
        {/* Filters Section */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por site ou URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {BLOCK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-12 md:col-span-2 lg:col-span-4 flex justify-end">
              <Button variant="outline" onClick={fetchBlocks} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              {filteredBlocks.length} {filteredBlocks.length === 1 ? 'bloco' : 'blocos'}{' '}
              {searchTerm || filterType !== 'all' ? 'encontrado(s)' : 'no total'}
            </p>
          </div>
        </div>

        {/* Blocks Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carregando blocos...</p>
            </div>
          </div>
        ) : filteredBlocks.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Boxes className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {searchTerm || filterType !== 'all'
                    ? 'Nenhum bloco encontrado'
                    : 'Nenhum bloco criado'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {searchTerm || filterType !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando seu primeiro bloco interativo'}
                </p>
              </div>
              {!searchTerm && filterType === 'all' && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Bloco
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBlocks.map((block) => (
              <CowBlockCard
                key={block._id}
                block={block}
                onEdit={handleEditBlock}
                onDelete={handleDeleteBlock}
                onDuplicate={handleDuplicateBlock}
              />
            ))}
          </div>
        )}
      </main>

      {/* Form Modal */}
      <CowBlockForm
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        onSubmit={editingBlock?._id ? handleUpdateBlock : handleCreateBlock}
        initialData={editingBlock}
        mode={editingBlock?._id ? 'edit' : 'create'}
      />
    </div>
  );
}
