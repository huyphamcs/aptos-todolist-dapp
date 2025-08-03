import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";

export type Task = {
  content: string;
  isCompleted: boolean;
  timestamp: {
    date: {
      day: number;
      month: number;
      year: number;
    };
    time_in_day: {
      hour: number;
      mins: number;
      secs: number;
    };
  };
};

export type Todolist = {
  tasks: Task[];
};

export type GetTodolistArguments = {
  accountAddress: string;
};

export const getTodolist = async (args: GetTodolistArguments): Promise<Todolist | null> => {
  const { accountAddress } = args;
  
  try {
    const resource = await aptosClient().getAccountResource({
      accountAddress,
      resourceType: `${MODULE_ADDRESS}::todolist::Todolist`,
    });
    
    return resource as Todolist;
  } catch (error) {
    // Return null if the todolist doesn't exist
    return null;
  }
};

export const checkTodolistExists = async (args: GetTodolistArguments): Promise<boolean> => {
  const { accountAddress } = args;
  
  try {
    const result = await aptosClient().view({
      payload: {
        function: `${MODULE_ADDRESS}::todolist::todolist_exists`,
        functionArguments: [accountAddress],
      },
    });
    
    return result[0] as boolean;
  } catch (error) {
    return false;
  }
};
