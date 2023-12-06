import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const usePostList = (userId: number | undefined) =>
  useQuery<Post[], Error>({
    queryKey: userId ? ['users', userId, 'postList'] : ['postList'],
    queryFn: () =>
      axios
        .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
          params: {
            userId,
          },
        })
        .then((res) => res.data),
    staleTime: 10 * 1000,
  });

export default usePostList;
