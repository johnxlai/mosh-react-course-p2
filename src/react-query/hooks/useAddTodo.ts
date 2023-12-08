import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Todo } from './useTodos';
import { CACHE_KEY_TODOS } from '../constants';
import APIClient from '../services/api-client';

const apiClient = new APIClient<Todo>('/todos');

interface AddTodoContext {
  previousTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: apiClient.post,

    onMutate: (newTodo: Todo) => {
      const previousTodos =
        queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];

      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos = []) => [
        newTodo,
        ...todos,
      ]);

      onAdd();

      return { previousTodos };
    },
    onSuccess: (savedTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(['todo'], (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
      );
    },
    // onError: (error, newToDo, context) => {
    //   if (!context) return;

    //   queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context.previousTodos);
    // },
  });
};

export default useAddTodo;
