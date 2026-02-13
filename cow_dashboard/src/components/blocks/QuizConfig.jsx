import { useState, useEffect } from "react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, HelpCircle, Type } from "lucide-react";

export function QuizConfig({ value = {}, onChange }) {
  const initialQuestions = Array.isArray(value) ? value : (value.questions || []);
  
  const [questions, setQuestions] = useState(
    initialQuestions.length > 0
      ? initialQuestions
      : [{ id: 1, question: "", correctAnswer: "", options: ["", ""] }],
  );

  // Campos de texto do modal
  const [title, setTitle] = useState(value.title || 'Responda para participar');

  useEffect(() => {
    onChange({ questions, title });
  }, [questions, title]);

  const addQuestion = () => {
    const newId =
      questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        question: "",
        correctAnswer: "",
        options: ["", ""],
      },
    ]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id, field, newValue) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: newValue } : q)),
    );
  };

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q,
      ),
    );
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q,
      ),
    );
  };

  const updateOption = (questionId, optionIndex, newValue) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? newValue : opt,
              ),
            }
          : q,
      ),
    );
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
              placeholder="Ex: Responda e Ganhe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Configure o título que será exibido no modal do quiz.
        </p>
      </div>

      {/* Perguntas */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <Label className="text-base">Perguntas do Quiz</Label>
          <Button type="button" size="sm" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Pergunta
          </Button>
        </div>

      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div
            key={question.id}
            className="border border-border rounded-lg p-5 bg-muted/20 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">
                  Pergunta {qIndex + 1}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(question.id)}
                disabled={questions.length === 1}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor={`question-${question.id}`} className="text-xs">
                  Pergunta
                </Label>
                <Textarea
                  id={`question-${question.id}`}
                  placeholder="Digite a pergunta aqui..."
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(question.id, "question", e.target.value)
                  }
                  required
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Opções de Resposta</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addOption(question.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Opção
                  </Button>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Input
                        placeholder={`Opção ${optIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          updateOption(question.id, optIndex, e.target.value)
                        }
                        required
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(question.id, optIndex)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor={`answer-${question.id}`} className="text-xs">
                  Resposta Correta (opcional)
                </Label>
                <Input
                  id={`answer-${question.id}`}
                  placeholder="Digite a resposta correta"
                  value={question.correctAnswer}
                  onChange={(e) =>
                    updateQuestion(question.id, "correctAnswer", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Configure as perguntas do quiz. Adicione pergunta e opções de resposta.
      </p>
      </div>
    </div>
  );
}
