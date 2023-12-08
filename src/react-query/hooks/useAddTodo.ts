import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Todo } from './useTodos';

interface AddTodoContext {
  previousTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo>('https://jsonplaceholder.typicode.com/todosx', todo)
        .then((res) => res.data),

    onMutate: (newTodo: Todo) => {
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']) || [];

      queryClient.setQueryData<Todo[]>(['todos'], (todos) => [
        newTodo,
        ...(todos || []),
      ]);

      onAdd();

      return { previousTodos };
    },
    onSuccess: (savedTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(['todo'], (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
      );
    },
    onError: (error, newToDo, context) => {
      if (!context) return;

      queryClient.setQueryData<Todo[]>(['todos'], context.previousTodos);
    },
  });
};

export default useAddTodo;
