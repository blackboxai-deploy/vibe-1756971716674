
"use client";

import * as React from "react";
import { Plus, Trash2, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
}

type SmartListView = "upcoming" | "today";

const initialTasks: Task[] = [
  { id: "task-1", text: "Objednať nové farby na vlasy", completed: false, priority: "high" },
  { id: "task-2", text: "Pripraviť marketingovú kampaň na leto", completed: false, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), priority: "medium" },
  { id: "task-3", text: "Zavolať pani Kováčovej ohľadom zmeny termínu", completed: true, priority: "low" },
  { id: "task-4", text: "Upratať sklad", completed: false, priority: "low" },
  { id: "task-5", text: "Skontrolovať dnešné platby", completed: false, dueDate: new Date(), priority: "high" },
];

export default function TodoList() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [newTaskText, setNewTaskText] = React.useState("");
  const [view, setView] = React.useState<SmartListView>("upcoming");

  const addTask = () => {
    if (newTaskText.trim() === "") return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: newTaskText,
      completed: false,
      priority: "low",
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const filteredTasks = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (view === "today") {
      return tasks.filter(task => task.dueDate && task.dueDate >= today && task.dueDate <= endOfToday && !task.completed);
    }
    // "upcoming" view shows all non-completed tasks
    return tasks.filter(task => !task.completed);
  }, [tasks, view]);

  const completedTasks = tasks.filter(task => task.completed);


  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Pripomienky a Úlohy
        </CardTitle>
        <div className="flex gap-2 pt-2">
            <Button size="sm" variant={view === "upcoming" ? "default" : "outline"} onClick={() => setView("upcoming")}>Nadchádzajúce</Button>
            <Button size="sm" variant={view === "today" ? "default" : "outline"} onClick={() => setView("today")}>Dnes</Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto">
         <div className="flex gap-2">
            <Input
                placeholder="Nová úloha..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Button onClick={addTask} size="icon">
                <Plus className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex-1 space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="rounded-full"
                />
                <label htmlFor={`task-${task.id}`} className={cn("flex-1 cursor-pointer", task.completed && "line-through text-muted-foreground")}>
                    {task.text}
                </label>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full group" onClick={() => deleteTask(task.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                </Button>
              </div>
            ))}
             {filteredTasks.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>Žiadne úlohy na zobrazenie.</p>
                </div>
            )}
        </div>
        {completedTasks.length > 0 && (
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Dokončené</h3>
                <div className="space-y-2">
                 {completedTasks.map((task) => (
                    <div 
                        key={task.id}
                        className="flex items-center gap-3 p-2 text-muted-foreground"
                    >
                         <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="rounded-full" />
                         <label htmlFor={`task-${task.id}`} className="flex-1 line-through cursor-pointer">{task.text}</label>
                    </div>
                ))}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
