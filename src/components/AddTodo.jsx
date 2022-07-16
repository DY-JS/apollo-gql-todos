import { useState } from 'react';
import { Button, FormControl, Input, Spinner } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { ADD_TODO, ALL_TODO } from '../apollo/todos';

const AddTodo = () => {
  const [text, setText] = useState('');
  //useMutation возвращает ф-цию AddTodo из ADD_TODO и объект с data
  const [AddTodo, { loading, error, data }] = useMutation(ADD_TODO, {
    //1-й вариант
    // refetchQueries: [  //maccив для функций которые сделают сразу запрос на обновление данных
    //   {query: ALL_TODO}
    //], //refetchQueries - так получим весь maccив данных
    //2-й вариант
    update(cache, { data: { newTodo } }) {
      const { todos } = cache.readQuery({ query: ALL_TODO }); //взяли todos из данных из запроса ALL_TODO
      cache.writeQuery({
        //обновили кэш - записали в кэш запроса ALL_TODO новый массив с newTodo вначале
        query: ALL_TODO,
        data: {
          todos: [newTodo, ...todos],
        },
      });
    },
  });

  const handleAddTodo = () => {
    if (text.trim().length) {
      AddTodo({
        variables: {
          title: text,
          completed: false,
          userId: 123,
        },
      });
      setText('');
    }
  };

  const handleKey = (event) => {
    if (event.key === 'Enter') handleAddTodo();
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <h2>Error...</h2>;
  }

  return (
    <FormControl display={'flex'} mt={6}>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKey}
      />
      <Button onClick={handleAddTodo}>Add todo</Button>
    </FormControl>
  );
};

export default AddTodo;
