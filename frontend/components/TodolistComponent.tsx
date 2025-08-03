import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Check, Trash2, Calendar, ListTodo, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { getTodolist, checkTodolistExists, Task } from "@/view-functions/getTodolist";
import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";

export function TodolistComponent() {
  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [todolistExists, setTodolistExists] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Load todolist on account change
  useEffect(() => {
    if (account?.address) {
      loadTodolist();
    } else {
      setTasks([]);
      setTodolistExists(false);
    }
  }, [account?.address]);

  const loadTodolist = async () => {
    if (!account?.address) return;

    try {
      setLoading(true);
      const exists = await checkTodolistExists({ accountAddress: account.address.toString() });
      setTodolistExists(exists);

      if (exists) {
        const todolist = await getTodolist({ accountAddress: account.address.toString() });
        setTasks(todolist?.tasks || []);
      }
    } catch (error) {
      console.error("Error loading todolist:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load todolist",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTodolist = async () => {
    if (!account) return;

    try {
      setIsCreating(true);
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::todolist::create_list`,
          functionArguments: [],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      
      toast({
        title: "Success",
        description: "Todolist created successfully!",
      });

      await loadTodolist();
    } catch (error) {
      console.error("Error creating todolist:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create todolist",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const addTask = async () => {
    if (!account || !newTaskContent.trim()) return;

    try {
      setLoading(true);
      const now = new Date();
      
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::todolist::add_task`,
          functionArguments: [
            newTaskContent,
            now.getDate(),
            now.getMonth() + 1, // Month is 0-indexed in JS
            now.getFullYear(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      
      toast({
        title: "Success",
        description: "Task added successfully!",
      });

      setNewTaskContent("");
      await loadTodolist();
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add task",
      });
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (index: number) => {
    if (!account) return;

    try {
      setLoading(true);
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::todolist::mark_as_completed`,
          functionArguments: [index],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      
      toast({
        title: "Success",
        description: "Task marked as completed!",
      });

      await loadTodolist();
    } catch (error) {
      console.error("Error marking task as completed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark task as completed",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (index: number) => {
    if (!account) return;

    try {
      setLoading(true);
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::todolist::remove_task`,
          functionArguments: [index],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      
      toast({
        title: "Success",
        description: "Task removed successfully!",
      });

      await loadTodolist();
    } catch (error) {
      console.error("Error removing task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove task",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Task["timestamp"]) => {
    const { date, time_in_day } = timestamp;
    return `${date.day}/${date.month}/${date.year} ${time_in_day.hour.toString().padStart(2, '0')}:${time_in_day.mins.toString().padStart(2, '0')}`;
  };

  const completedTasks = tasks.filter(t => t.isCompleted);
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  if (!account) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
          <CardHeader className="relative text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Aptos Todolist
            </CardTitle>
            <CardDescription className="text-lg max-w-md mx-auto">
              Manage your tasks on the blockchain with transparency and permanence. Connect your wallet to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!todolistExists) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20" />
          <CardHeader className="relative text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Create Your On-Chain Todolist</CardTitle>
            <CardDescription className="text-lg max-w-md mx-auto">
              Ready to start managing your tasks on the Aptos blockchain? Let's create your personal todolist that will be stored permanently on-chain.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={createTodolist} 
              disabled={isCreating}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating Todolist...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Create My Todolist
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <ListTodo className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Completed</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{completedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{pendingTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Todolist Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <ListTodo className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">My Blockchain Todolist</CardTitle>
              <CardDescription>
                Your tasks are stored permanently on the Aptos blockchain
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new task */}
          <div className="flex gap-3">
            <Input
              placeholder="What do you need to do today?"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              disabled={loading}
              className="text-lg py-6 px-4 rounded-xl border-2 focus:border-purple-400 transition-colors"
            />
            <Button 
              onClick={addTask} 
              disabled={loading || !newTaskContent.trim()}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Tasks list */}
          <div className="space-y-3">
            {loading && tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Loading your tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <ListTodo className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg text-muted-foreground mb-2">No tasks yet</p>
                <p className="text-sm text-muted-foreground">Add your first task above to get started!</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={index}
                  className={`group flex items-center gap-4 p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-md ${
                    task.isCompleted 
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 opacity-75" 
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-lg leading-relaxed ${task.isCompleted ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>
                      {task.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Calendar className="h-4 w-4" />
                      {formatTimestamp(task.timestamp)}
                      {task.isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!task.isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markCompleted(index)}
                        disabled={loading}
                        className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 dark:hover:bg-green-950 dark:hover:border-green-700 dark:hover:text-green-300"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeTask(index)}
                      disabled={loading}
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:hover:bg-red-950 dark:hover:border-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
