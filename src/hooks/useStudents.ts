import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteStudentApi, getStudentsApi, addStudentApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';
import { useEffect } from 'react';

interface StudentsHookInterface {
  students: StudentInterface[];
  deleteStudentMutate: (studentId: number) => void;
  addStudentMutate: (student: Omit<StudentInterface, 'id'>) => void
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  // Принудительно получаем данные при монтировании компонента
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['students'],
      queryFn: () => getStudentsApi(),
    });
  }, [queryClient]);

  const { data } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    enabled: true,
  });

  /**
   * Мутация удаления студента
   */
  const deleteStudentMutate = useMutation({
    // вызов API delete
    mutationFn: async (studentId: number) => deleteStudentApi(studentId),
    // оптимистичная мутация (обновляем данные на клиенте до API запроса delete)
    onMutate: async (studentId: number) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // получаем данные из TanStackQuery
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      let updatedStudents = [...(previousStudents ?? [])] ;

      if (!updatedStudents) return;

      // помечаем удаляемую запись
      updatedStudents = updatedStudents.map((student: StudentInterface) => ({
        ...student,
        ...(student.id === studentId ? { isDeleted: true } : {}),
      }));
      // обновляем данные в TanStackQuery
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);

      return { previousStudents, updatedStudents };
    },
    onError: (err, variables, context) => {
      console.log('>>> deleteStudentMutate  err', err);
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    // обновляем данные в случаи успешного выполнения mutationFn: async (studentId: number) => deleteStudentApi(studentId),
    onSuccess: async (studentId, variables, context) => {
      // console.log('>>> deleteStudentMutate onSuccess', studentId, variables, context);
      // удаляем студента
      const updatedStudents = context?.updatedStudents?.filter((student: StudentInterface) => student.id !== studentId) ?? [];
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
    },
  });

  const addStudentMutate = useMutation({
    mutationFn: async (student: Omit<StudentInterface, 'id'>) => {
      console.log('Sending student:', student);
      const result = await addStudentApi(student);
      console.log('Received from API:', result);
      
      // Если сервер возвращает только id, создаем полный объект
      if (result && result.id && !result.last_name) {
        const fullStudent: StudentInterface = {
          id: result.id,
          ...student
        };
        console.log('Created full student:', fullStudent);
        return fullStudent;
      }
      
      return result;
    },
    onSuccess: (newStudent) => {
      console.log('Adding to cache:', newStudent);
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']) ?? [];
      console.log('Previous students:', previousStudents);
      queryClient.setQueryData<StudentInterface[]>(['students'], [...previousStudents, newStudent]);
    },
    onError: (err) => {
      console.log('>>> addStudentMutate err', err);
    },
  });

  return {
    students: data ?? [],
    deleteStudentMutate: deleteStudentMutate.mutate,
    addStudentMutate: addStudentMutate.mutate,
  };
};

export default useStudents;